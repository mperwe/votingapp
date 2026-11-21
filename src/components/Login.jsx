import { useState } from 'react';
import { checkLogin } from '../store.js';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const ok = await checkLogin(user, pw);
      await new Promise((r) => setTimeout(r, 800)); // slows down guessing
      if (ok) return onLogin();
      setErr('Wrong username or password.');
    } catch (e2) {
      setErr('Login needs a secure page (https or localhost).');
    }
    setBusy(false);
  };

  return (
    <div className="card" style={{ maxWidth: 460 }}>
      <h3>Admin login</h3>
      <p className="hint">For the tally centre only.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
        <input type="text" placeholder="Username" autoComplete="username" aria-label="Username"
          value={user} onChange={(e) => setUser(e.target.value)} autoFocus />
        <input type="password" placeholder="Password" autoComplete="current-password" aria-label="Password"
          value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn y" disabled={busy}>Log in</button>
      </form>
      <p className="err">{err}</p>
    </div>
  );
}
