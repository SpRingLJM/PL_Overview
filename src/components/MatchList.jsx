import { useState } from 'react';
import './MatchList.css';

const TIMEZONES = [
  { label: 'GMT', iana: 'UTC', abbr: 'GMT' },
  { label: 'CET', iana: 'Europe/Berlin', abbr: 'CET/CEST' },
  { label: 'KST', iana: 'Asia/Seoul', abbr: 'KST' },
  { label: 'PT', iana: 'America/Los_Angeles', abbr: 'PT' },
  { label: 'ET', iana: 'America/New_York', abbr: 'ET' },
];

export default function MatchList({ fixtures }) {
  const [tz, setTz] = useState(() => {
    const saved = localStorage.getItem('pl-timezone');
    return saved || 'UTC';
  });

  const handleTzChange = (iana) => {
    setTz(iana);
    localStorage.setItem('pl-timezone', iana);
  };

  if (!fixtures || fixtures.length === 0) return <p className="no-data">No fixtures available</p>;

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
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: tz,
    });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: tz,
      hour12: false,
    });
  };

  const getTzAbbr = (dateStr) => {
    const d = new Date(dateStr);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    }).formatToParts(d);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  };

  const renderMatch = (match, showResult) => {
    const home = match.teams.home;
    const away = match.teams.away;
    const goals = match.goals;
    const dateStr = match.fixture.date;

    return (
      <div key={match.fixture.id} className="match-row">
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
            <span className="match-score">
              {goals.home} - {goals.away}
            </span>
          ) : (
            <span className="match-vs">vs</span>
          )}
          <div className="match-team away">
            <img src={away.logo} alt={away.name} className="match-logo" />
            <span>{away.name}</span>
          </div>
        </div>
        {showResult && (
          <span className={`match-result ${
            home.winner ? 'result-w' : away.winner ? 'result-l' : 'result-d'
          }`}>
            {home.winner ? 'W' : away.winner ? 'L' : 'D'}
          </span>
        )}
      </div>
    );
  };

  const currentTzAbbr = fixtures.length > 0 ? getTzAbbr(fixtures[0].fixture.date) : '';

  return (
    <div className="match-list">
      <div className="tz-selector">
        <span className="tz-label">Timezone:</span>
        {TIMEZONES.map((t) => (
          <button
            key={t.iana}
            className={`tz-btn ${tz === t.iana ? 'active' : ''}`}
            onClick={() => handleTzChange(t.iana)}
          >
            {t.label}
          </button>
        ))}
        {currentTzAbbr && <span className="tz-current">({currentTzAbbr})</span>}
      </div>

      {past.length > 0 && (
        <>
          <h4 className="match-section-title">Recent Results</h4>
          {past.map((m) => renderMatch(m, true))}
        </>
      )}
      {upcoming.length > 0 && (
        <>
          <h4 className="match-section-title">Upcoming Fixtures</h4>
          {upcoming.map((m) => renderMatch(m, false))}
        </>
      )}
    </div>
  );
}
