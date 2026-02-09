import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFixtureLineups, getFixtureEvents } from '../services/api';
import './MatchList.css';

const TIMEZONES = [
  { label: 'GMT', iana: 'UTC', abbr: 'GMT' },
  { label: 'CET', iana: 'Europe/Berlin', abbr: 'CET/CEST' },
  { label: 'KST', iana: 'Asia/Seoul', abbr: 'KST' },
  { label: 'PT', iana: 'America/Los_Angeles', abbr: 'PT' },
  { label: 'ET', iana: 'America/New_York', abbr: 'ET' },
];

export default function MatchList({ fixtures }) {
  const { t } = useTranslation();
  const [tz, setTz] = useState(() => {
    const saved = localStorage.getItem('pl-timezone');
    return saved || 'UTC';
  });
  const [expandedId, setExpandedId] = useState(null);
  const [matchDetail, setMatchDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleTzChange = (iana) => {
    setTz(iana);
    localStorage.setItem('pl-timezone', iana);
  };

  const handleMatchClick = async (match) => {
    const fId = match.fixture.id;
    if (match.fixture.status.short !== 'FT') return;

    if (expandedId === fId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(fId);
    setDetailLoading(true);
    try {
      const [lineups, events] = await Promise.all([
        getFixtureLineups(fId),
        getFixtureEvents(fId),
      ]);
      setMatchDetail({ lineups, events });
    } catch {
      setMatchDetail({ lineups: [], events: [] });
    } finally {
      setDetailLoading(false);
    }
  };

  if (!fixtures || fixtures.length === 0) return <p className="no-data">{t('match.noFixtures')}</p>;

  const now = new Date();
  const past = fixtures
    .filter((f) => new Date(f.fixture.date) < now && f.fixture.status.short === 'FT')
    .sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date))
    .slice(0, 10);

  const upcoming = fixtures
    .filter((f) => new Date(f.fixture.date) >= now || f.fixture.status.short === 'NS')
    .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
    .slice(0, 10);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: tz });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false });
  };

  const getTzAbbr = (dateStr) => {
    const d = new Date(dateStr);
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(d);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  };

  const renderDetail = () => {
    if (detailLoading) {
      return (
        <div className="match-detail">
          <div className="loading"><div className="spinner" /><span>{t('common.loading')}</span></div>
        </div>
      );
    }
    if (!matchDetail) return null;

    const { lineups, events } = matchDetail;
    const goals = (events || []).filter((e) => e.type === 'Goal');
    const homeLineup = lineups?.[0];
    const awayLineup = lineups?.[1];

    return (
      <div className="match-detail">
        {goals.length > 0 && (
          <div className="detail-section">
            <h5 className="detail-title">{t('match.goals')}</h5>
            <div className="detail-events">
              {goals.map((e, i) => (
                <div key={i} className="event-row">
                  <span className="event-time">{e.time.elapsed}'{e.time.extra ? `+${e.time.extra}` : ''}</span>
                  <span className="event-icon">⚽</span>
                  <span className="event-player">{e.player.name}</span>
                  {e.assist?.name && <span className="event-assist">({t('match.assist')}: {e.assist.name})</span>}
                  <span className="event-team">{e.team.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(homeLineup || awayLineup) && (
          <div className="detail-section">
            <h5 className="detail-title">{t('match.lineups')}</h5>
            <div className="lineups-grid">
              {homeLineup && (
                <div className="lineup-side">
                  <div className="lineup-header">
                    <img src={homeLineup.team.logo} alt="" className="lineup-logo" />
                    <span>{homeLineup.team.name}</span>
                    <span className="lineup-formation">{homeLineup.formation}</span>
                  </div>
                  <div className="lineup-players">
                    {homeLineup.startXI?.map((p, i) => (
                      <div key={i} className="lineup-player">
                        <span className="lineup-number">{p.player.number}</span>
                        <span>{p.player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {awayLineup && (
                <div className="lineup-side">
                  <div className="lineup-header">
                    <img src={awayLineup.team.logo} alt="" className="lineup-logo" />
                    <span>{awayLineup.team.name}</span>
                    <span className="lineup-formation">{awayLineup.formation}</span>
                  </div>
                  <div className="lineup-players">
                    {awayLineup.startXI?.map((p, i) => (
                      <div key={i} className="lineup-player">
                        <span className="lineup-number">{p.player.number}</span>
                        <span>{p.player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMatch = (match, showResult) => {
    const home = match.teams.home;
    const away = match.teams.away;
    const goals = match.goals;
    const dateStr = match.fixture.date;
    const isExpanded = expandedId === match.fixture.id;
    const isClickable = match.fixture.status.short === 'FT';

    return (
      <div key={match.fixture.id}>
        <div
          className={`match-row ${isClickable ? 'clickable' : ''} ${isExpanded ? 'expanded' : ''}`}
          onClick={() => isClickable && handleMatchClick(match)}
        >
          <div className="match-datetime">
            <span className="match-date">{formatDate(dateStr)}</span>
            <span className="match-time">{formatTime(dateStr)}</span>
          </div>
          <div className="match-teams">
            <div className="match-team home">
              <span>{home.name}</span>
              <img src={home.logo} alt={home.name} className="match-logo" />
            </div>
            {showResult ? (
              <span className="match-score">{goals.home} - {goals.away}</span>
            ) : (
              <span className="match-vs">{t('match.vs')}</span>
            )}
            <div className="match-team away">
              <img src={away.logo} alt={away.name} className="match-logo" />
              <span>{away.name}</span>
            </div>
          </div>
          {showResult && (
            <span className={`match-result ${home.winner ? 'result-w' : away.winner ? 'result-l' : 'result-d'}`}>
              {home.winner ? 'W' : away.winner ? 'L' : 'D'}
            </span>
          )}
          {isClickable && <span className={`match-expand-icon ${isExpanded ? 'open' : ''}`}>▼</span>}
        </div>
        {isExpanded && renderDetail()}
      </div>
    );
  };

  const currentTzAbbr = fixtures.length > 0 ? getTzAbbr(fixtures[0].fixture.date) : '';

  return (
    <div className="match-list">
      <div className="tz-selector">
        <span className="tz-label">{t('match.timezone')}</span>
        {TIMEZONES.map((tz_item) => (
          <button
            key={tz_item.iana}
            className={`tz-btn ${tz === tz_item.iana ? 'active' : ''}`}
            onClick={() => handleTzChange(tz_item.iana)}
          >
            {tz_item.label}
          </button>
        ))}
        {currentTzAbbr && <span className="tz-current">({currentTzAbbr})</span>}
      </div>

      {past.length > 0 && (
        <>
          <h4 className="match-section-title">{t('match.recentResults')}</h4>
          {past.map((m) => renderMatch(m, true))}
        </>
      )}
      {upcoming.length > 0 && (
        <>
          <h4 className="match-section-title">{t('match.upcomingFixtures')}</h4>
          {upcoming.map((m) => renderMatch(m, false))}
        </>
      )}
    </div>
  );
}
