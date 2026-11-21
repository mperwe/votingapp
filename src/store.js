// Data, helpers and login hash for the election tool.
export const KEY = 'ugdbb.election.v2';

const POS = [
  ['Chairperson', 1],
  ['Vice Chairperson', 1],
  ['Treasurer', 1],
  ['General Secretary', 1],
  ['Deputy General Secretary', 1],
  ['Additional board members (Beisitzer/innen)', 3],
];

// Dummy names: replace them in the "Candidates" tab once you know the real candidates.
const DUMMY = [
  ['Candidate-1', 'Candidate-2'],
  ['Candidate-3', 'Candidate-4'],
  ['Candidate-5', 'Candidate-6'],
  ['Candidate-7', 'Candidate-8'],
  ['Candidate-9', 'Candidate-10'],
  ['Candidate-11', 'Candidate-12', 'Candidate-13', 'Candidate-14', 'Candidate-15'],
];

let counter = 0;
export const uid = () => 'c' + Date.now().toString(36) + counter++;
export const mkCand = (name) => ({ id: uid(), name, photo: '', votes: 0 });

export function fresh() {
  return {
    voters: 0, // total voters counted
    updated: '', // time of the last change
    positions: POS.map((p, i) => ({
      id: 'p' + i,
      name: p[0],
      seats: p[1],
      cands: DUMMY[i].map(mkCand),
    })),
  };
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return fresh();
}

export function save(S) {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    return true;
  } catch (e) {
    return false;
  }
}

export const votable = (S) => S.positions.filter((p) => p.cands.length);
export const voters = (S) => +S.voters || 0;
export const pct = (S, v) => (voters(S) ? Math.round((v / voters(S)) * 1000) / 10 : 0);
export const ranked = (S, p) =>
  p.cands.map((c) => ({ c, v: +c.votes || 0 })).sort((a, b) => b.v - a.v);
export const nCands = (S) => S.positions.reduce((a, p) => a + p.cands.length, 0);
export const findCand = (S, pid, cid) => {
  const p = S.positions.find((x) => x.id === pid);
  return { p, c: p && p.cands.find((x) => x.id === cid) };
};

// ---- Admin login (username: admin) ----
// Only a salted PBKDF2 hash is stored here, never the password itself.
const SALT = 'ugdbb-2026-tally-salt';
const ITER = 200000;
const HASH = 'de963c93b91358f18cd9a048790811106117d49c032e57783f96567206a04812';

export async function checkLogin(user, password) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(user.toLowerCase().trim() + ':' + password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(SALT), iterations: ITER, hash: 'SHA-256' },
    key,
    256
  );
  const hex = [...new Uint8Array(bits)].map((x) => x.toString(16).padStart(2, '0')).join('');
  return hex === HASH;
}
