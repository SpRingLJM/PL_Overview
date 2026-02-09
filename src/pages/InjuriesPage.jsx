import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeagueInjuries } from '../services/api';
import './InjuriesPage.css';

export default function InjuriesPage() {
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTeam, setFilterTeam] = useState('all');

  useEffect(() => {
    setLoading(true);
    getLeagueInjuries()
      .then((data) => {
        // Deduplicate by player id, keep the most recent entry
        const latestByPlayer = new Map();
        data.forEach((entry) => {
          const pid = entry.player.id;
          const existing = latestByPlayer.get(pid);
          if (!existing || new Date(entry.fixture.date) > new Date(existing.fixture.date)) {
            latestByPlayer.set(pid, entry);
          }
        });

        // Filter to recent injuries only (last 30 days)
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const recent = [...latestByPlayer.values()]
          .filter((e) => new Date(e.fixture.date) >= cutoff)
          .sort((a, b) => a.team.name.localeCompare(b.team.name));

        setInjuries(recent);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading injuries...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Get unique teams for filter
  const teams = [...new Map(injuries.map((i) => [i.team.id, i.team])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));

  const filtered = filterTeam === 'all'
    ? injuries
    : injuries.filter((i) => i.team.id === Number(filterTeam));

  // Group by team
  const grouped = {};
  filtered.forEach((entry) => {
    const tid = entry.team.id;
    if (!grouped[tid]) {
      grouped[tid] = { team: entry.team, players: [] };
    }
    grouped[tid].players.push(entry);
  });

  return (
    <div className="injuries-page">
      <h2 className="section-title">Injury Report</h2>

      <div className="injury-filter">
        <label className="filter-label">Filter by team:</label>
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Teams ({injuries.length} players)</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({injuries.filter((i) => i.team.id === t.id).length})
            </option>
          ))}
        </select>
      </div>

      <div className="injury-grid">
        {Object.values(grouped).map(({ team, players }) => (
          <div key={team.id} className="injury-team-card card">
            <Link to={`/team/${team.id}`} className="injury-team-header">
              <img src={team.logo} alt={team.name} className="injury-team-logo" />
              <h3>{team.name}</h3>
              <span className="injury-count">{players.length}</span>
            </Link>
            <div className="injury-player-list">
              {players.map((entry) => (
                <div key={`${entry.player.id}-${entry.fixture.id}`} className="injury-player-row">
                  <img src={entry.player.photo} alt={entry.player.name} className="injury-player-photo" />
                  <div className="injury-player-info">
                    <span className="injury-player-name">{entry.player.name}</span>
                    <span className="injury-reason">{entry.player.reason || 'Unknown'}</span>
                  </div>
                  <span className={`injury-type-badge ${entry.player.type === 'Missing Fixture' ? 'missing' : 'questionable'}`}>
                    {entry.player.type || 'Out'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="no-data">No injury data available</p>
      )}
    </div>
  );
}
