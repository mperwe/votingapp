import { useState } from 'react';
import Avatar from './Avatar.jsx';
import SaveBar from './SaveBar.jsx';
import { fresh, mkCand, findCand } from '../store.js';

// Crops a photo to a 240x240 square so it fits in browser storage.
function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(img.width, img.height);
        const cv = document.createElement('canvas');
        cv.width = cv.height = 240;
        cv.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 240, 240);
        resolve(cv.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AddRow({ label, onAdd }) {
  const [name, setName] = useState('');
  const add = () => {
    if (name.trim()) { onAdd(name.trim()); setName(''); }
  };
  return (
    <div className="row" style={{ marginTop: 14 }}>
      <input type="text" placeholder="New candidate name" aria-label={label} value={name}
        onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
      <button className="btn y" onClick={add}>Add</button>
    </div>
  );
}

export default function Candidates({ S, update, setS, onLogout }) {
  const edit = (pid, cid, fn) => update((s) => fn(findCand(s, pid, cid).c, findCand(s, pid, cid).p));

  const addCand = (pid, name) =>
    update((s) => {
      const p = s.positions.find((x) => x.id === pid);
      if (!p.cands.some((c) => c.name.toLowerCase() === name.toLowerCase())) p.cands.push(mkCand(name));
    });

  const rename = (pid, c) => {
    const v = prompt('Candidate name', c.name);
    if (v && v.trim()) edit(pid, c.id, (x) => { x.name = v.trim(); });
  };

  const remove = (pid, c) => {
    if (confirm('Remove ' + c.name + '?'))
      update((s) => { const p = s.positions.find((x) => x.id === pid); p.cands = p.cands.filter((x) => x.id !== c.id); });
  };

  const upload = async (pid, cid, file) => {
    if (!file) return;
    const photo = await resizePhoto(file);
    edit(pid, cid, (x) => { x.photo = photo; });
  };

  const resetVotes = () => {
    if (confirm('Set all votes and the voters counted back to 0? Candidates stay.'))
      update((s) => { s.voters = 0; s.positions.forEach((p) => p.cands.forEach((c) => (c.votes = 0))); });
  };

  const resetAll = () => {
    if (confirm('Delete everything, including candidates and photos?')) { setS(fresh()); onLogout(); }
  };

  return (
    <>
      {S.positions.map((p) => (
        <div className="card" key={p.id}>
          <h3>{p.name} <span className="sub">· {p.seats} seat{p.seats > 1 ? 's' : ''}</span></h3>
          {p.cands.length === 0 && <p className="hint">No candidates yet.</p>}
          {p.cands.map((c) => (
            <div className="crow" key={c.id}>
              <Avatar c={c} size={52} />
              <div className="nm">{c.name}</div>
              <label className="lnk">
                Photo
                <input type="file" accept="image/*" hidden
                  onChange={(e) => { upload(p.id, c.id, e.target.files[0]); e.target.value = ''; }} />
              </label>
              {c.photo && <button className="lnk" onClick={() => edit(p.id, c.id, (x) => { x.photo = ''; })}>Clear photo</button>}
              <button className="lnk" onClick={() => rename(p.id, c)}>Rename</button>
              <button className="lnk red" onClick={() => remove(p.id, c)}>Remove</button>
            </div>
          ))}
          <AddRow label={'New candidate for ' + p.name} onAdd={(n) => addCand(p.id, n)} />
        </div>
      ))}

      <SaveBar S={S} label="candidates updated" />

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Reset</h3>
        <p className="hint">These cannot be undone.</p>
        <div className="row">
          <button className="btn red" onClick={resetVotes}>Reset all votes</button>
          <button className="btn red" onClick={resetAll}>Reset everything</button>
          <button className="btn ghost" onClick={onLogout}>Log out</button>
        </div>
      </div>
    </>
  );
}
