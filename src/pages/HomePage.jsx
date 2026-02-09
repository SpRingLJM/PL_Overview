import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStandings, getLeagueFixtures } from '../services/api';
import StandingsTable from '../components/StandingsTable';
import TeamCard from '../components/TeamCard';
import './HomePage.css';

export default function HomePage() {
  const { t } = useTranslation();
  const [standings, setStandings] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('table');
  const [gmtTime, setGmtTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setGmtTime(now.toLocaleString('en-GB', {
        timeZone: 'UTC',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' GMT');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([getStandings(), getLeagueFixtures()])
      .then(([standingsData, fixturesData]) => {
        if (standingsData?.[0]?.league?.standings) {
          setStandings(standingsData[0].league.standings[0]);
        }
        if (fixturesData) {
          const now = new Date();
          const upcoming = fixturesData
            .filter((f) => new Date(f.fixture.date) > now && f.fixture.status.short === 'NS')
            .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
            .slice(0, 5);
          setUpcomingFixtures(upcoming);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>{t('home.loading')}</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">{t('common.error', { message: error })}</div>;
  }

  return (
    <div className="home-page">
      <div className="gmt-clock">
        <span className="gmt-label">{t('home.serverTime')}</span>
        <span className="gmt-value">{gmtTime}</span>
      </div>

      {upcomingFixtures.length > 0 && (
        <div className="upcoming-section">
          <h3 className="upcoming-title">{t('home.upcomingMatches')}</h3>
          <div className="upcoming-list">
            {upcomingFixtures.map((f) => (
              <div key={f.fixture.id} className="upcoming-card card">
                <span className="upcoming-date">
                  {new Date(f.fixture.date).toLocaleDateString('en-GB', {
                    timeZone: 'UTC',
                    day: 'numeric',
                    month: 'short',
                  })}
                  {' '}
                  {new Date(f.fixture.date).toLocaleTimeString('en-GB', {
                    timeZone: 'UTC',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </span>
                <div className="upcoming-teams">
                  <Link to={`/team/${f.teams.home.id}`} className="upcoming-team">
                    <img src={f.teams.home.logo} alt={f.teams.home.name} />
                    <span>{f.teams.home.name}</span>
                  </Link>
                  <span className="upcoming-vs">vs</span>
                  <Link to={`/team/${f.teams.away.id}`} className="upcoming-team">
                    <img src={f.teams.away.logo} alt={f.teams.away.name} />
                    <span>{f.teams.away.name}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="home-header">
        <h2 className="section-title">{t('home.title')}</h2>
        <div className="view-toggle">
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>
            {t('home.table')}
          </button>
          <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>
            {t('home.cards')}
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <StandingsTable standings={standings} />
      ) : (
        <div className="team-cards-grid">
          {standings.map((team) => (
            <TeamCard key={team.team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
