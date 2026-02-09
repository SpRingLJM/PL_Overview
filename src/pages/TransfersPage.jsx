import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStandings, getTransfers } from '../services/api';
import './TransfersPage.css';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'in', 'out'
  const [filterTeam, setFilterTeam] = useState('all');

  useEffect(() => {
    setLoading(true);
    getStandings()
      .then(async (standingsData) => {
        const teams = standingsData?.[0]?.league?.standings?.[0] || [];
        const teamIds = teams.map((t) => t.team);

        // Fetch transfers for all teams (batch)
        const allTransfers = [];
        for (const team of teamIds) {
          try {
            const data = await getTransfers(team.id);
            // Filter to 2025-26 window transfers (after June 2025)
            data.forEach((entry) => {
              entry.transfers.forEach((t) => {
                const transferDate = new Date(t.date);
                if (transferDate >= new Date('2025-06-01')) {
                  const isIncoming = t.teams.in.id === team.id;
                  allTransfers.push({
                    player: entry.player,
                    date: t.date,
                    type: t.type,
                    from: t.teams.out,
                    to: t.teams.in,
                    direction: isIncoming ? 'in' : 'out',
                    plTeam: team,
                  });
                }
              });
            });
          } catch {
            // Skip failed team
          }
        }

        allTransfers.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransfers(allTransfers);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading transfers... (this may take a moment)</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Get unique PL teams
  const plTeams = [...new Map(transfers.map((t) => [t.plTeam.id, t.plTeam])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));

  const filtered = transfers
    .filter((t) => filterType === 'all' || t.direction === filterType)
    .filter((t) => filterTeam === 'all' || t.plTeam.id === Number(filterTeam));

  // Split into summer and winter windows
  const summer = filtered.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() >= 5 && d.getMonth() <= 8 && d.getFullYear() === 2025;
  });
  const winter = filtered.filter((t) => {
    const d = new Date(t.date);
    return (d.getMonth() === 0 || d.getMonth() === 11) &&
      (d.getFullYear() === 2026 || (d.getFullYear() === 2025 && d.getMonth() === 11));
  });
  const other = filtered.filter((t) => !summer.includes(t) && !winter.includes(t));

  const renderTransfer = (t, i) => (
    <div key={`${t.player.id}-${t.date}-${i}`} className="transfer-row">
      <span className="transfer-date">
        {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
      <span className="transfer-player">{t.player.name}</span>
      <div className="transfer-clubs">
        <Link to={`/team/${t.from.id}`} className="transfer-club">
          <img src={t.from.logo} alt={t.from.name} className="transfer-club-logo" />
          <span>{t.from.name}</span>
        </Link>
        <span className={`transfer-arrow ${t.direction}`}>
          {t.direction === 'in' ? '→' : '←'}
        </span>
        <Link to={`/team/${t.to.id}`} className="transfer-club">
          <img src={t.to.logo} alt={t.to.name} className="transfer-club-logo" />
          <span>{t.to.name}</span>
        </Link>
      </div>
      <span className={`transfer-badge ${t.direction}`}>
        {t.direction === 'in' ? 'IN' : 'OUT'}
      </span>
      {t.type && t.type !== 'N/A' && (
        <span className="transfer-type">{t.type}</span>
      )}
    </div>
  );

  const renderSection = (title, items) => {
    if (items.length === 0) return null;
    return (
      <>
        <h3 className="transfer-window-title">{title} ({items.length})</h3>
        <div className="card transfer-list">
          {items.map(renderTransfer)}
        </div>
      </>
    );
  };

  return (
    <div className="transfers-page">
      <h2 className="section-title">Transfer News</h2>

      <div className="transfer-filters">
        <div className="transfer-filter-group">
          <label className="filter-label">Direction:</label>
          <div className="filter-buttons">
            {[
              { val: 'all', label: 'All' },
              { val: 'in', label: 'Incoming' },
              { val: 'out', label: 'Outgoing' },
            ].map((f) => (
              <button
                key={f.val}
                className={`filter-btn ${filterType === f.val ? 'active' : ''}`}
                onClick={() => setFilterType(f.val)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="transfer-filter-group">
          <label className="filter-label">Team:</label>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Teams</option>
            {plTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {renderSection('January 2026 Window', winter)}
      {renderSection('Summer 2025 Window', summer)}
      {other.length > 0 && renderSection('Other', other)}

      {filtered.length === 0 && (
        <p className="no-data">No transfer data available</p>
      )}
    </div>
  );
}
