import SaveBar from './SaveBar.jsx';
import { votable, voters, ranked, pct, nCands } from '../store.js';

export default function Report({ S }) {
  const generated = new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });
  return (
    <div className="card report">
      <h3>Election report</h3>
      <p className="hint">UGDBB e.V. · Member election · 21 November 2026 · Generated {generated}</p>

      <table>
        <tbody>
          <tr><th>Total voters counted</th><td><b>{voters(S)}</b></td></tr>
          <tr><th>Positions</th><td>{votable(S).length}</td></tr>
          <tr><th>Candidates</th><td>{nCands(S)}</td></tr>
        </tbody>
      </table>

      {votable(S).map((p) => (
        <div key={p.id}>
          <h3 style={{ marginTop: 24 }}>{p.name} <span className="sub">· {p.seats} seat{p.seats > 1 ? 's' : ''}</span></h3>
          <table>
            <thead><tr><th>Candidate</th><th>Votes</th><th>% of voters</th></tr></thead>
            <tbody>
              {ranked(S, p).map((r, i) => (
                <tr key={r.c.id}>
                  <td>{r.c.name}{i < p.seats && r.v > 0 && <> <span className="tag">LEADING</span></>}</td>
                  <td>{r.v}</td>
                  <td>{pct(S, r.v)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="noprint" style={{ marginTop: 24 }}>
        <SaveBar S={S} label="report" flat />
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => window.print()}>Print / save as PDF</button>
        </div>
        <p className="hint" style={{ marginTop: 10 }}>
          For a PDF, choose “Save as PDF” as the printer in the window that opens.
        </p>
      </div>
    </div>
  );
}
