import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { KEY, load, save } from './store.js';
import { Header, Info } from './components/Header.jsx';
import Results from './components/Results.jsx';
import EnterVotes from './components/EnterVotes.jsx';
import Candidates from './components/Candidates.jsx';
import Report from './components/Report.jsx';
import Login from './components/Login.jsx';

const ADMIN_TABS = ['count', 'cands', 'report'];
const LABEL = {
  results: 'Live results', count: 'Enter votes', cands: 'Candidates',
  report: 'Report', login: 'Admin login',
};
const SESSION = 'ugdbb.admin';

export default function App() {
  const [S, setS] = useState(load);
  const [tab, setTab] = useState('results');
  const [admin, setAdmin] = useState(() => {
    try { return sessionStorage.getItem(SESSION) === '1'; } catch (e) { return false; }
  });

  // Every change is saved in this browser straight away.
  useEffect(() => {
    if (!save(S)) alert('Could not save. Browser storage is full or blocked. Try smaller photos.');
  }, [S]);

  // Keeps a second tab of the same browser (for example a projector window) in sync.
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY && e.newValue) setS(JSON.parse(e.newValue)); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Change a copy of the state: update((s) => { s.voters = 5 })
  const update = useCallback((fn) => setS((prev) => {
    const next = structuredClone(prev);
    fn(next);
    next.updated = new Date().toISOString();
    return next;
  }), []);

  const login = () => { try { sessionStorage.setItem(SESSION, '1'); } catch (e) {} setAdmin(true); setTab('count'); };
  const logout = () => { try { sessionStorage.removeItem(SESSION); } catch (e) {} setAdmin(false); setTab('results'); };

  let view = tab;
  if (ADMIN_TABS.includes(tab) && !admin) view = 'login';
  if (admin && tab === 'login') view = 'count';
  const tabs = admin ? ['results', ...ADMIN_TABS] : ['results', 'login'];

  return (
    <>
      <Header />
      <div className="wrap">
        <Info />
        <div className="tabs noprint" role="tablist">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={t === view} onClick={() => setTab(t)}>{LABEL[t]}</button>
          ))}
          {admin && <button className="out" onClick={logout}>Log out</button>}
        </div>

        <main>
          {view === 'results' && <Results S={S} />}
          {view === 'login' && <Login onLogin={login} />}
          {view === 'count' && <EnterVotes S={S} update={update} />}
          {view === 'cands' && <Candidates S={S} update={update} setS={setS} onLogout={logout} />}
          {view === 'report' && <Report S={S} />}
        </main>
        <div style={{ height: 40 }} />
      </div>
    </>
  );
}
