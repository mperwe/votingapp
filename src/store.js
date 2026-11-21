
// ======================================================
// UGDBB ELECTION SYSTEM
// Data, helpers and admin login
// ======================================================

export const KEY = 'ugdbb.election.v2';

// ------------------------------------------------------
// ELECTION POSITIONS
// Edit positions and seats here only.
// ------------------------------------------------------

const POS = [
  ['Chairperson', 1],
  ['Vice Chairperson', 1],
  ['Treasurer', 1],
  ['General Secretary', 1],
  ['Deputy General Secretary', 1],
  ['Additional board members (Beisitzer/innen)', 3],
];

// ------------------------------------------------------
// CANDIDATE NAMES
// Edit candidate names here in the source code only.
// Candidates cannot be added, removed or renamed
// through the application interface.
// ------------------------------------------------------

const CANDIDATES = [
  ['Isabella - Chairman', 'Dauda T K  ', 'Anish ' ],
  ['Anisha', 'Dauda'],
  ['Andrew S', 'Dauda T K'],
  ['Candidate-7', 'Candidate-8'],
  ['Candidate-9', 'Candidate-10'],
  [
    'Mark Kabuusu - Youth Representative',
    'Candidate-12',
    'Candidate-13',
    'Candidate-14',
    'Candidate-15',
  ],
];

// ------------------------------------------------------
// UNIQUE ID GENERATOR
// ------------------------------------------------------

let counter = 0;

export const uid = () =>
  'c' + Date.now().toString(36) + counter++;

// ------------------------------------------------------
// CREATE CANDIDATE
// ------------------------------------------------------

export const mkCand = (name) => ({
  id: uid(),
  name,
  photo: '',
  votes: 0,
});

// ------------------------------------------------------
// CREATE FRESH ELECTION DATA
// ------------------------------------------------------

export function fresh() {
  return {
    voters: 0,
    updated: '',

    positions: POS.map((position, index) => ({
      id: 'p' + index,
      name: position[0],
      seats: position[1],

      // Candidate names come exclusively from source code.
      cands: (CANDIDATES[index] || []).map(mkCand),
    })),
  };
}

// ------------------------------------------------------
// LOAD ELECTION DATA
// ------------------------------------------------------

export function load() {
  try {
    const raw = localStorage.getItem(KEY);

    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading election data:', e);
  }

  return fresh();
}

// ------------------------------------------------------
// SAVE ELECTION DATA
// ------------------------------------------------------

export function save(S) {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    return true;
  } catch (e) {
    console.error('Error saving election data:', e);
    return false;
  }
}

// ------------------------------------------------------
// ELECTION HELPERS
// ------------------------------------------------------

// Positions with candidates
export const votable = (S) =>
  S.positions.filter((p) => p.cands.length > 0);

// Total registered voters counted
export const voters = (S) =>
  +S.voters || 0;

// Calculate candidate vote percentage
export const pct = (S, v) =>
  voters(S)
    ? Math.round((v / voters(S)) * 1000) / 10
    : 0;

// Rank candidates according to votes
export const ranked = (S, p) =>
  p.cands
    .map((c) => ({
      c,
      v: +c.votes || 0,
    }))
    .sort((a, b) => b.v - a.v);

// Total number of candidates
export const nCands = (S) =>
  S.positions.reduce(
    (total, position) => total + position.cands.length,
    0
  );

// Find candidate by position and candidate ID
export const findCand = (S, pid, cid) => {
  const p = S.positions.find((x) => x.id === pid);

  return {
    p,
    c: p && p.cands.find((x) => x.id === cid),
  };
};

// ------------------------------------------------------
// ADMIN LOGIN
// Username: admin
// Only a salted PBKDF2 hash is stored.
// ------------------------------------------------------

const SALT = 'ugdbb-2026-tally-salt';
const ITER = 200000;

const HASH =
  'de963c93b91358f18cd9a048790811106117d49c032e57783f96567206a04812';

export async function checkLogin(user, password) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(
      user.toLowerCase().trim() + ':' + password
    ),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(SALT),
      iterations: ITER,
      hash: 'SHA-256',
    },
    key,
    256
  );

  const hex = [...new Uint8Array(bits)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');

  return hex === HASH;
}
