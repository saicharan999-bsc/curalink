export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Clinical Intelligence Platform</p>
          <h1>Curalink</h1>
        </div>
      </div>

      <div className="nav-meta">
        <span className="nav-pill">Live evidence ranking</span>
        <span className="nav-pill">AI-assisted synthesis</span>
      </div>
    </header>
  );
}
