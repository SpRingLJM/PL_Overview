import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStandings, getTransfers } from '../services/api';
import './TransfersPage.css';

const eplSearchUrl = (name) =>
  `https://www.premierleague.com/search?query=${encodeURIComponent(name)}`;

export default function TransfersPage() {
  const { t } = useTranslation();
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
        <span>{t('transfers.loading')}</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">{t('common.error', { message: error })}</div>;
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

  const renderTransfer = (tr, i) => (
    <div key={`${tr.player.id}-${tr.date}-${i}`} className="transfer-row">
      <span className="transfer-date">
        {new Date(tr.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
      <a
        href={eplSearchUrl(tr.player.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="transfer-player transfer-link"
      >
        {tr.player.name}
      </a>
      <div className="transfer-clubs">
        <Link to={`/team/${tr.from.id}`} className="transfer-club">
          <img src={tr.from.logo} alt={tr.from.name} className="transfer-club-logo" />
          <span>{tr.from.name}</span>
        </Link>
        <span className={`transfer-arrow ${tr.direction}`}>
          {tr.direction === 'in' ? '→' : '←'}
        </span>
        <Link to={`/team/${tr.to.id}`} className="transfer-club">
          <img src={tr.to.logo} alt={tr.to.name} className="transfer-club-logo" />
          <span>{tr.to.name}</span>
        </Link>
      </div>
      <span className={`transfer-badge ${tr.direction}`}>
        {tr.direction === 'in' ? t('transfers.in') : t('transfers.out')}
      </span>
      {tr.type && tr.type !== 'N/A' && (
        <span className="transfer-type">{tr.type}</span>
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
      <h2 className="section-title">{t('transfers.title')}</h2>

      <div className="transfer-filters">
        <div className="transfer-filter-group">
          <label className="filter-label">{t('transfers.direction')}</label>
          <div className="filter-buttons">
            {[
              { val: 'all', label: t('transfers.all') },
              { val: 'in', label: t('transfers.incoming') },
              { val: 'out', label: t('transfers.outgoing') },
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
          <label className="filter-label">{t('transfers.team')}</label>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('transfers.allTeams')}</option>
            {plTeams.map((tm) => (
              <option key={tm.id} value={tm.id}>{tm.name}</option>
            ))}
          </select>
        </div>
      </div>

      {renderSection(t('transfers.januaryWindow'), winter)}
      {renderSection(t('transfers.summerWindow'), summer)}
      {other.length > 0 && renderSection(t('transfers.other'), other)}

      {filtered.length === 0 && (
        <p className="no-data">{t('transfers.noData')}</p>
      )}
    </div>
  );
}
