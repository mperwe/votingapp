const COLORS = ['#c8261d', '#1a1614', '#b8860b', '#2f6b4f', '#5a3d7a', '#2c5f8a'];

export default function Avatar({ c, size = 52 }) {
  if (c.photo) {
    return <img className="av" src={c.photo} alt={c.name} style={{ width: size, height: size }} />;
  }
  const initials = c.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const color = COLORS[[...c.name].reduce((a, x) => a + x.charCodeAt(0), 0) % COLORS.length];
  return (
    <span className="av" style={{ width: size, height: size, background: color, fontSize: size / 2.6 }}>
      {initials}
    </span>
  );
}
