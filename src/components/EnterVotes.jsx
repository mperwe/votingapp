import Avatar from './Avatar.jsx';
import SaveBar from './SaveBar.jsx';
import { votable, voters, findCand } from '../store.js';

const clamp = (v) => Math.max(0, parseInt(v) || 0);

export default function EnterVotes({ S, update }) {
  const setVoters = (v) => update((s) => { s.voters = clamp(v); });
  const setVotes = (pid, cid, v) => update((s) => { findCand(s, pid, cid).c.votes = clamp(v); });

  return (
    <>
      <div className="card">
        <h3>Enter votes</h3>
        <p className="hint">
          Type or tap to enter the counted votes. The public results update immediately. Press “Save & send results” when you are done.
        </p>
        <div className="crow" style={{ border: 0 }}>
          <div className="nm">Total voters counted</div>
          <div className="step">
            <button onClick={() => setVoters(voters(S) - 1)}>−</button>
            <input type="number" min="0" aria-label="Total voters counted" value={voters(S)}
              onChange={(e) => setVoters(e.target.value)} />
            <button className="p" onClick={() => setVoters(voters(S) + 1)}>+</button>
          </div>
        </div>
      </div>

      {votable(S).map((p) => {
        const sum = p.cands.reduce((a, c) => a + (+c.votes || 0), 0);
        const tooMany = sum > voters(S) * p.seats;
        return (
          <div className="card" key={p.id}>
            <h3>{p.name} <span className="sub">· {p.seats} seat{p.seats > 1 ? 's' : ''}</span></h3>
            {p.cands.map((c) => (
              <div className="crow" key={c.id}>
                <Avatar c={c} size={44} />
                <div className="nm">{c.name}</div>
                <div className="step">
                  <button onClick={() => setVotes(p.id, c.id, (+c.votes || 0) - 1)}>−</button>
                  <input type="number" min="0" aria-label={'Votes for ' + c.name} value={+c.votes || 0}
                    onChange={(e) => setVotes(p.id, c.id, e.target.value)} />
                  <button className="p" onClick={() => setVotes(p.id, c.id, (+c.votes || 0) + 1)}>+</button>
                </div>
              </div>
            ))}
            {tooMany && <p className="warn">Check the numbers: there are more votes here than the voters counted allow.</p>}
          </div>
        );
      })}

      <SaveBar S={S} label="votes entered" />
    </>
  );
}
