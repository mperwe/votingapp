import { useState } from 'react';
import { saveAll } from '../exporter.js';

const FILE_MSG = {
  saved: ['ok', 'Results file saved to your computer.'],
  downloaded: ['ok', 'Results file downloaded. Check your Downloads folder.'],
  cancelled: ['bad', 'File save was cancelled.'],
  error: ['bad', 'The file could not be saved.'],
};

export default function SaveBar({ S, label, flat }) {
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);

  const click = async () => {
    setBusy(true);
    setRes(null);
    setRes(await saveAll(S, label));
    setBusy(false);
  };

  const f = res && FILE_MSG[res.file];
  return (
    <div className={'savebar noprint' + (flat ? ' flat' : '')}>
      <div className="row">
        <button className="btn y" onClick={click} disabled={busy}>
          {busy ? 'Saving…' : 'Save & send results'}
        </button>
      </div>
      {res && (
        <ul className="status">
          <li className="ok">Saved in this browser.</li>
          <li className={f[0]}>{f[1]}</li>
          {res.email === 'sent' && <li className="ok">Results sent by email.</li>}
          {res.email !== 'sent' && (
            <li className="bad">
              {res.email === 'local'
                ? 'Email is only sent from the live Netlify site.'
                : 'Email could not be sent automatically.'}{' '}
              <a href={res.mailto}>Open an email draft instead</a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}