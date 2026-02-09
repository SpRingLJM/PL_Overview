import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStandings, getTeamSquad, getFixtures, getInjuries } from '../services/api';
import SquadList from '../components/SquadList';
import MatchList from '../components/MatchList';
import StaffInfo from '../components/StaffInfo';
import WeatherWidget from '../components/WeatherWidget';
import stadiums from '../data/stadiums';
import { IoArrowBack } from 'react-icons/io5';
import './TeamPage.css';

export default function TeamPage() {
  const { teamId } = useParams();
  const id = Number(teamId);

  const [teamStanding, setTeamStanding] = useState(null);
  const [squad, setSquad] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('squad');

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      getStandings(),
      getTeamSquad(id),
      getFixtures(id),
      getInjuries(id).catch(() => []),
    ])
      .then(([standingsData, squadData, fixturesData, injuriesData]) => {
        if (standingsData?.[0]?.league?.standings?.[0]) {
          const team = standingsData[0].league.standings[0].find(
            (t) => t.team.id === id
          );
          setTeamStanding(team);
        }
        if (squadData?.[0]?.players) {
          setSquad(squadData[0].players);
        }
        setFixtures(fixturesData || []);
        setInjuries(injuriesData || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading team data...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!teamStanding) {
    return <div className="error">Team not found</div>;
  }

  const stadium = stadiums[id];
  const { team, rank, points, all, goalsDiff, form } = teamStanding;

  return (
    <div className="team-page">
      <Link to="/" className="back-link">
        <IoArrowBack /> Back to Standings
      </Link>

      <div className="team-hero">
        <img src={team.logo} alt={team.name} className="team-hero-logo" />
        <div className="team-hero-info">
          <h2 className="team-hero-name">{team.name}</h2>
          {stadium && (
            <span className="team-stadium">
              {stadium.name} ({stadium.capacity?.toLocaleString()})
            </span>
          )}
          <div className="team-hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">{rank}</span>
              <span className="hero-stat-label">Position</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value highlight">{points}</span>
              <span className="hero-stat-label">Points</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{all.played}</span>
              <span className="hero-stat-label">Played</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{all.win}</span>
              <span className="hero-stat-label">Won</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{all.draw}</span>
              <span className="hero-stat-label">Drawn</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{all.lose}</span>
              <span className="hero-stat-label">Lost</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{goalsDiff > 0 ? '+' : ''}{goalsDiff}</span>
              <span className="hero-stat-label">GD</span>
            </div>
          </div>
          <div className="team-form-row">
            {form && form.split('').slice(-10).map((c, i) => (
              <span key={i} className={`form-dot form-${c.toLowerCase()}`}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {stadium && (
        <WeatherWidget lat={stadium.lat} lon={stadium.lon} stadiumName={stadium.name} />
      )}

      <div className="team-tabs">
        <button
          className={activeTab === 'staff' ? 'active' : ''}
          onClick={() => setActiveTab('staff')}
        >
          Manager
        </button>
        <button
          className={activeTab === 'squad' ? 'active' : ''}
          onClick={() => setActiveTab('squad')}
        >
          Squad
        </button>
        <button
          className={activeTab === 'matches' ? 'active' : ''}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
      </div>

      <div className="team-tab-content card">
        {activeTab === 'staff' && (
          <StaffInfo teamId={id} />
        )}
        {activeTab === 'squad' && (
          <SquadList players={squad} injuries={injuries} />
        )}
        {activeTab === 'matches' && (
          <MatchList fixtures={fixtures} />
        )}
      </div>
    </div>
  );
}
