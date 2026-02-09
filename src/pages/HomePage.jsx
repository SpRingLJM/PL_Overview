import { useState, useEffect } from 'react';
import { getStandings } from '../services/api';
import StandingsTable from '../components/StandingsTable';
import TeamCard from '../components/TeamCard';
import './HomePage.css';

export default function HomePage() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    setLoading(true);
    getStandings()
      .then((data) => {
        if (data && data[0] && data[0].league && data[0].league.standings) {
          setStandings(data[0].league.standings[0]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading standings...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2 className="section-title">
          Premier League Standings
        </h2>
        <div className="view-toggle">
          <button
            className={view === 'table' ? 'active' : ''}
            onClick={() => setView('table')}
          >
            Table
          </button>
          <button
            className={view === 'cards' ? 'active' : ''}
            onClick={() => setView('cards')}
          >
            Cards
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
