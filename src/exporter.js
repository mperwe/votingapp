import { votable, voters, ranked, pct, nCands } from './store.js';

export const ADMIN_EMAIL = 'frankmperwe@gmail.com';

const q = (x) => '"' + String(x).replace(/"/g, '""') + '"';
const row = (a) => a.map(q).join(',');

export function csvText(S) {
  const lines = [
    row(['UGDBB e.V. - Member election results']),
    row(['Generated', new Date().toLocaleString('en-GB')]),
    row(['Total voters counted', voters(S)]),
    row(['Positions', votable(S).length]),
    row(['Candidates', nCands(S)]),
    '',
    row(['Position', 'Seats', 'Candidate', 'Votes', 'Percent of voters']),
  ];
  votable(S).forEach((p) =>
    ranked(S, p).forEach((x) => lines.push(row([p.name, p.seats, x.c.name, x.v, pct(S, x.v) + '%'])))
  );
  return lines.join('\n');
}

export function summaryText(S) {
  const out = [
    'UGDBB e.V. - Member election results',
    'Generated: ' + new Date().toLocaleString('en-GB'),
    'Total voters counted: ' + voters(S),
    '',
  ];
  votable(S).forEach((p) => {
    out.push(`${p.name} (${p.seats} seat${p.seats > 1 ? 's' : ''})`);
    ranked(S, p).forEach((x) => out.push(`  ${x.c.name}: ${x.v} votes (${pct(S, x.v)}%)`));
    out.push('');
  });
  return out.join('\n');
}

// Opens the "Save as" window (Chrome/Edge) or downloads the file (other browsers).
async function saveFile(name, text) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: name,
        types: [{ description: 'CSV file (opens in Excel)', accept: { 'text/csv': ['.csv'] } }],
      });
      const w = await handle.createWritable();
      await w.write(text);
      await w.close();
      return 'saved';
    } catch (e) {
      if (e && e.name === 'AbortError') return 'cancelled';
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
  return 'downloaded';
}

export function mailtoLink(S, label) {
  const subject = `UGDBB election results (${label})`;
  const body = summaryText(S).slice(0, 1500);
  return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// 1) asks where to save the file on your computer, 2) sends the results by email.
export async function saveAll(S, label) {
  const stamp = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
  const result = { file: 'error', email: 'failed', mailto: mailtoLink(S, label) };

  // The save window must open first, straight after the click.
  result.file = await saveFile(`ugdbb-election-results-${stamp}.csv`, '\ufeff' + csvText(S));

  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    result.email = 'local'; // Netlify Forms only works on the live site
    return result;
  }
  try {
    const body = new URLSearchParams({
      'form-name': 'election-results',
      'bot-field': '',
      subject: `UGDBB election results (${label}) - ${new Date().toLocaleString('en-GB')}`,
      summary: summaryText(S),
      csv: csvText(S),
    });
    const r = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    result.email = r.ok ? 'sent' : 'failed';
  } catch (e) {
    result.email = 'failed';
  }
  return result;
}
