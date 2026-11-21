export function Header() {
  return (
    <>
      <div className="stripe"><i /><i /><i /></div>

      <div className="wrap brand">
        <img src="/logo.png" alt="UGDBB e.V. logo" />
        <div>
          <h1>UGDBB e.V.</h1>
          <p>Ugandische Deutsche Gemeinde<br />Berlin-Brandenburg e.V. · Seit 1991</p>
        </div>
      </div>

      <section className="hero">
        <div className="wrap">
          <div>
            <div className="kicker">MEMBER ELECTION</div>
            <h2>VOTES<span>TODAY</span></h2>
            <div className="rule" />
            <p>Your voice. Your community.<br />Be part of the decision.</p>
          </div>
          <svg viewBox="0 0 340 280" aria-hidden="true">
            <ellipse cx="170" cy="258" rx="140" ry="12" fill="#0e0c0b" />
            <g transform="rotate(4 180 90)">
              <rect x="120" y="18" width="110" height="130" rx="6" fill="#fff" />
              <rect x="134" y="32" width="40" height="8" rx="3" fill="#bbb" />
              <rect x="134" y="50" width="76" height="5" rx="2" fill="#ddd" />
              <rect x="134" y="72" width="22" height="22" rx="4" fill="#fff" stroke="#1a1614" strokeWidth="3" />
              <path d="M138 83l6 6 9-12" fill="none" stroke="#c8261d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="166" y="80" width="40" height="5" rx="2" fill="#ddd" />
              <rect x="134" y="108" width="22" height="22" rx="4" fill="#fff" stroke="#1a1614" strokeWidth="3" />
              <rect x="166" y="116" width="40" height="5" rx="2" fill="#ddd" />
            </g>
            <rect x="40" y="128" width="262" height="124" rx="14" fill="#c8261d" />
            <rect x="40" y="128" width="262" height="30" rx="14" fill="#e23c32" />
            <rect x="112" y="136" width="116" height="12" rx="6" fill="#1a1614" />
            <rect x="82" y="172" width="178" height="52" rx="8" fill="#f9c11c" />
            <text x="171" y="208" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif" fontWeight="900" fontSize="28" letterSpacing="5" fill="#1a1614">VOTE</text>
          </svg>
        </div>
      </section>
    </>
  );
}

export function Info() {
  return (
    <div className="info">
      <div className="box"><span className="lab">DATE</span><b>Saturday<br />21 November 2026</b></div>
      <div className="box"><span className="lab">TIME</span><b>3:00 – 6:00 pm</b></div>
      <div className="box loc">
        <svg viewBox="0 0 24 32" aria-hidden="true">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#f9c11c" />
          <circle cx="12" cy="12" r="4.5" fill="#1a1614" />
        </svg>
        <div><span className="lab">LOCATION</span><b>Ollenhauerstr. 99, 13403 Berlin</b></div>
      </div>
    </div>
  );
}
