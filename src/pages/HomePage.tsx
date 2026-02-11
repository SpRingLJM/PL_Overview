import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStandings, getLeagueFixtures } from '../services/api';
import type { Standing, Fixture } from '../types';
import StandingsTable from '../components/StandingsTable';
import TeamCard from '../components/TeamCard';
import './HomePage.css';

const TIMEZONES = [
  { label: 'GMT', iana: 'UTC', suffix: 'GMT' },
  { label: 'KST', iana: 'Asia/Seoul', suffix: 'KST' },
  { label: 'PST', iana: 'America/Los_Angeles', suffix: 'PT' },
  { label: 'ET', iana: 'America/New_York', suffix: 'ET' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [standings, setStandings] = useState<Standing[]>([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState('table');
  const [selectedTz, setSelectedTz] = useState(() =>
    localStorage.getItem('pl-home-timezone') || 'UTC'
  );
  const [clockTime, setClockTime] = useState('');

  const tzInfo = TIMEZONES.find((tz) => tz.iana === selectedTz) || TIMEZONES[0];

  const handleTzChange = (iana: string) => {
    setSelectedTz(iana);
    localStorage.setItem('pl-home-timezone', iana);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleString('en-GB', {
        timeZone: tzInfo.iana,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' ' + tzInfo.suffix);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [tzInfo]);

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
            .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
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
        <span className="gmt-value">{clockTime}</span>
        <div className="home-tz-selector">
          {TIMEZONES.map((tz) => (
            <button
              key={tz.iana}
              className={`home-tz-btn ${selectedTz === tz.iana ? 'active' : ''}`}
              onClick={() => handleTzChange(tz.iana)}
            >
              {tz.label}
            </button>
          ))}
        </div>
      </div>

      {upcomingFixtures.length > 0 && (
        <div className="upcoming-section">
          <h3 className="upcoming-title">{t('home.upcomingMatches')}</h3>
          <div className="upcoming-list">
            {upcomingFixtures.map((f) => (
              <div key={f.fixture.id} className="upcoming-card card">
                <span className="upcoming-date">
                  {new Date(f.fixture.date).toLocaleDateString('en-GB', {
                    timeZone: tzInfo.iana,
                    day: 'numeric',
                    month: 'short',
                  })}
                  {' '}
                  {new Date(f.fixture.date).toLocaleTimeString('en-GB', {
                    timeZone: tzInfo.iana,
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
