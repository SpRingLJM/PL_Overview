import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTopScorers, getTopAssists } from '../services/api';
import './StatsPage.css';

const eplSearchUrl = (name) =>
  `https://www.premierleague.com/search?query=${encodeURIComponent(name)}`;

export default function StatsPage() {
  const { t } = useTranslation();
  const [scorers, setScorers] = useState([]);
  const [assists, setAssists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('scorers');

  useEffect(() => {
    setLoading(true);
    Promise.all([getTopScorers(), getTopAssists()])
      .then(([scorerData, assistData]) => {
        setScorers(scorerData || []);
        setAssists(assistData || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>{t('stats.loading')}</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">{t('common.error', { message: error })}</div>;
  }

  const renderPlayerRow = (item, index, statKey) => {
    const player = item.player;
    const stat = item.statistics[0];

    return (
      <tr key={player.id}>
        <td className="stat-rank">{index + 1}</td>
        <td className="stat-player">
          <img src={player.photo} alt={player.name} className="stat-photo" />
          <div>
            <a
              href={eplSearchUrl(player.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="stat-name stat-link"
            >
              {player.name}
            </a>
            <span className="stat-team">
              <img src={stat.team.logo} alt="" className="stat-team-logo" />
              {stat.team.name}
            </span>
            {player.nationality && (
              <span className="stat-nationality">{player.nationality}</span>
            )}
          </div>
        </td>
        <td className="stat-value">
          {statKey === 'goals' ? stat.goals.total : stat.goals.assists}
        </td>
        <td>{stat.games.appearences}</td>
        <td>{stat.games.minutes}</td>
      </tr>
    );
  };

  const data = activeTab === 'scorers' ? scorers : assists;
  const statKey = activeTab === 'scorers' ? 'goals' : 'assists';

  return (
    <div className="stats-page">
      <h2 className="section-title">{t('stats.title')}</h2>

      <div className="stats-tabs">
        <button
          className={activeTab === 'scorers' ? 'active' : ''}
          onClick={() => setActiveTab('scorers')}
        >
          {t('stats.topScorers')}
        </button>
        <button
          className={activeTab === 'assists' ? 'active' : ''}
          onClick={() => setActiveTab('assists')}
        >
          {t('stats.topAssists')}
        </button>
      </div>

      <div className="card">
        <table className="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('stats.player')}</th>
              <th>{activeTab === 'scorers' ? t('stats.goals') : t('stats.assists')}</th>
              <th>{t('stats.apps')}</th>
              <th>{t('stats.mins')}</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 20).map((item, i) => renderPlayerRow(item, i, statKey))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
