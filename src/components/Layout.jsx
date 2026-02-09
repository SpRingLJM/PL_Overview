import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="header-logo">
            <h1>
              {t('header.titlePre')} <span>{t('header.titleHighlight')}</span>
            </h1>
          </NavLink>
          <nav className="header-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.standings')}
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.stats')}
            </NavLink>
            <NavLink to="/injuries" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.injuries')}
            </NavLink>
            <NavLink to="/transfers" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.transfers')}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
              {t('nav.about')}
            </NavLink>
            <LanguageSelector />
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}
