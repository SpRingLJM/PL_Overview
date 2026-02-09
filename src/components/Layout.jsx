import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="header-logo">
            <h1>
              The Overview of <span>Premier League</span>
            </h1>
          </NavLink>
          <nav className="header-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Standings
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>
              Stats
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
              About
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>The Overview of Premier League &copy; 2026 | Data provided by API-Football &amp; OpenWeatherMap</p>
      </footer>
    </div>
  );
}
