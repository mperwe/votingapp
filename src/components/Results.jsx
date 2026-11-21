import Avatar from './Avatar.jsx';
import { votable, voters, ranked, pct } from '../store.js';

export default function Results({ S }) {
  const time = S.updated
    ? new Date(S.updated).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '—';
  return (
    <>
      <div className="big">
        <div className="stat y"><strong>{voters(S)}</strong><span>Voters counted</span></div>
        <div className="stat"><strong>{time}</strong><span>Last updated</span></div>
      </div>

      {voters(S) === 0 && (
        <p className="hint">Counting has not started yet. Results will appear here as soon as they are entered.</p>
      )}

      <div className="card">
        {votable(S).map((p) => {
          const rows = ranked(S, p);
          const cut = rows[p.seats - 1] ? rows[p.seats - 1].v : 0;
          const tie = rows.length > p.seats && cut > 0 && rows[p.seats].v === cut;
          return (
            <div className="pos" key={p.id}>
              <h3>{p.name} <span className="sub">· {p.seats} seat{p.seats > 1 ? 's' : ''}</span></h3>
              {tie && <p className="err" style={{ margin: '0 0 6px' }}>Tie at the cut-off. A runoff is needed.</p>}
              {rows.map((r, i) => {
                const lead = i < p.seats && r.v > 0 && !tie;
                return (
                  <div className={'res' + (lead ? ' lead' : '')} key={r.c.id}>
                    <Avatar c={r.c} size={52} />
                    <div>
                      <div className="nm">{r.c.name}{lead && <span className="tag">LEADING</span>}</div>
                      <div className="track"><i style={{ width: pct(S, r.v) + '%' }} /></div>
                    </div>
                    <div className="num">{r.v}<small>{pct(S, r.v)}%</small></div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <p className="hint">Percentages show each candidate’s votes as a share of all voters counted.</p>
    </>
  );
}
