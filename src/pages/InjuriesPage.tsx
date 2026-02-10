import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLeagueInjuries } from '../services/api';
import type { InjuryEntry, Team } from '../types';
import './InjuriesPage.css';

const eplSearchUrl = (name: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(name + ' site:premierleague.com')}`;

const SEVERE_KEYWORDS = ['acl', 'cruciate', 'ligament', 'surgery', 'broken', 'fracture', 'rupture', 'tendon'];
const MODERATE_KEYWORDS = ['muscle', 'hamstring', 'calf', 'ankle', 'groin', 'thigh', 'shoulder', 'back', 'hip', 'foot', 'strain'];

function getInjurySeverity(reason: string): 'severe' | 'moderate' | 'minor' {
  if (!reason) return 'minor';
  const lower = reason.toLowerCase();
  if (SEVERE_KEYWORDS.some((k) => lower.includes(k))) return 'severe';
  if (MODERATE_KEYWORDS.some((k) => lower.includes(k))) return 'moderate';
  return 'minor';
}

// Expected return dates from Transfermarkt (updated 2026-02-09)
const RETURN_DATES: Record<string, string | null> = {
  'Caleb Wiley': null,
  'Julio Soler': null,
  'Jérémy Doku': null,
  'Jeremy Doku': null,
  'Granit Xhaka': null,
  'Bertrand Traoré': null,
  'Bertrand Traore': null,
  'Harrison Jones': null,
  'Jocelin Ta Bi': null,
  'Lukasz Fabianski': null,
  'Daniel James': null,
  'Matai Akinmboni': null,
  'Mikel Merino': null,
  'Chris Wood': null,
  'John Victor': null,
  'Nicolò Savona': null,
  'Nicola Savona': null,
  'Fabian Schär': null,
  'Fabian Schar': null,
  'Emil Krafth': null,
  'Matthijs de Ligt': null,
  'Rio Cardines': null,
  'Caleb Kporha': null,
  'Tom Cairney': null,
  'Lucas Bergvall': null,
  'Jeremie Frimpong': null,
  'Connor Roberts': null,
  'Ben Davies': null,
  'Mike Tresor': null,
  'Jordan Beyer': null,
  'John Stones': null,
  'Justin Devenny': '2026-02-10',
  'Martin Ødegaard': '2026-02-10',
  'Martin Odegaard': '2026-02-10',
  'Tosin Adarabioyo': '2026-02-13',
  'Yasin Ayari': '2026-02-13',
  'Mats Wieffer': '2026-02-13',
  'Savinho': '2026-02-15',
  'Tyler Adams': '2026-02-16',
  'Alysson': '2026-02-20',
  'Andrés García': '2026-02-20',
  'Andres Garcia': '2026-02-20',
  'Jan Paul van Hecke': '2026-02-20',
  'Max Dowman': '2026-02-20',
  'Ben Gannon-Doak': '2026-02-21',
  'Josh Dasilva': '2026-02-21',
  'Saša Lukić': '2026-02-21',
  'Sasa Lukic': '2026-02-21',
  'Marcus Tavernier': '2026-02-23',
  'Bukayo Saka': '2026-02-23',
  'Jean-Philippe Mateta': '2026-02-25',
  'Solly March': '2026-02-27',
  'Richarlison': '2026-02-28',
  'Pedro Porro': '2026-02-28',
  'Dário Essugo': '2026-03-01',
  'Dario Essugo': '2026-03-01',
  'Eddie Nketiah': '2026-03-01',
  'Dejan Kulusevski': '2026-03-09',
  'Tino Livramento': '2026-03-11',
  'Valentino Livramento': '2026-03-11',
  'Mateo Kovacic': '2026-03-14',
  'Jamie Gittens': '2026-03-20',
  'Alexander Isak': '2026-04-01',
  'Zeki Amdouni': '2026-04-01',
  'Stefan Bajcetic': '2026-04-01',
  'Patrick Dorgu': '2026-04-05',
  'Rodrigo Bentancur': '2026-04-07',
  'John McGinn': '2026-04-10',
  'Mohammed Kudus': '2026-04-10',
  'Justin Kluivert': '2026-04-11',
  'Youri Tielemans': '2026-04-17',
  'Cheick Doucouré': '2026-05-01',
  'Cheick Doucoure': '2026-05-01',
  'Conor Bradley': '2026-05-31',
  'James Maddison': '2026-06-01',
  'Jack Grealish': '2026-06-01',
  'Adam Webster': '2026-06-01',
  'Boubacar Kamara': '2026-06-01',
  'Levi Colwill': '2026-06-01',
  'Josko Gvardiol': '2026-06-17',
  'Antoni Milambo': '2026-07-31',
  'Fábio Carvalho': '2026-08-31',
  'Fabio Carvalho': '2026-08-31',
  'Giovanni Leoni': '2026-09-01',
  'Josh Cullen': '2026-09-01',
  'Stefanos Tzimas': '2026-09-01',
};

function getReturnDate(playerName: string): string | null {
  return RETURN_DATES[playerName] || null;
}

function formatReturnDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const dateFormatted = d.toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (diffDays < 0) return dateFormatted;
  if (diffDays <= 7) {
    const labels: Record<string, string> = { en: 'days', ko: '일', es: 'días' };
    return `${dateFormatted} (~${diffDays}${labels[lang] || labels.en})`;
  }
  return dateFormatted;
}

export default function InjuriesPage() {
  const { t, i18n } = useTranslation();
  const [injuries, setInjuries] = useState<InjuryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTeam, setFilterTeam] = useState('all');

  useEffect(() => {
    setLoading(true);
    getLeagueInjuries()
      .then((data) => {
        const latestByPlayer = new Map();
        data.forEach((entry) => {
          const pid = entry.player.id;
          const existing = latestByPlayer.get(pid);
          if (!existing || new Date(entry.fixture.date) > new Date(existing.fixture.date)) {
            latestByPlayer.set(pid, entry);
          }
        });

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
        <span>{t('injuries.loading')}</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">{t('common.error', { message: error })}</div>;
  }

  const teams = [...new Map(injuries.map((i) => [i.team.id, i.team])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));

  const filtered = filterTeam === 'all'
    ? injuries
    : injuries.filter((i) => i.team.id === Number(filterTeam));

  const grouped: Record<number, { team: Team; players: InjuryEntry[] }> = {};
  filtered.forEach((entry) => {
    const tid = entry.team.id;
    if (!grouped[tid]) {
      grouped[tid] = { team: entry.team, players: [] };
    }
    grouped[tid].players.push(entry);
  });

  return (
    <div className="injuries-page">
      <h2 className="section-title">{t('injuries.title')}</h2>

      <div className="injury-legend">
        <span className="legend-chip severe">{t('injuries.severe')}</span>
        <span className="legend-chip moderate">{t('injuries.moderate')}</span>
        <span className="legend-chip minor">{t('injuries.minor')}</span>
      </div>

      <div className="injury-filter">
        <label className="filter-label">{t('injuries.filterByTeam')}</label>
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="filter-select"
        >
          <option value="all">{t('injuries.allTeams', { count: injuries.length })}</option>
          {teams.map((tm) => (
            <option key={tm.id} value={tm.id}>
              {tm.name} ({injuries.filter((i) => i.team.id === tm.id).length})
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
              {players.map((entry) => {
                const severity = getInjurySeverity(entry.player.reason);
                return (
                  <div key={`${entry.player.id}-${entry.fixture.id}`} className={`injury-player-row severity-${severity}`}>
                    <img src={entry.player.photo} alt={entry.player.name} className={`injury-player-photo photo-${severity}`} />
                    <div className="injury-player-info">
                      <a
                        href={eplSearchUrl(entry.player.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="injury-player-name injury-link"
                      >
                        {entry.player.name}
                      </a>
                      <span className={`injury-reason reason-${severity}`}>
                        {entry.player.reason || 'Unknown'}
                      </span>
                      <span className="injury-recovery">
                        {(() => {
                          const returnDateStr = getReturnDate(entry.player.name);
                          if (returnDateStr) {
                            return t('injuries.returnDate', { date: formatReturnDate(returnDateStr, i18n.language) });
                          }
                          return t('injuries.returnUnknown');
                        })()}
                      </span>
                    </div>
                    <span className={`injury-severity-badge ${severity}`}>
                      {severity === 'severe' && t('injuries.severe')}
                      {severity === 'moderate' && t('injuries.moderate')}
                      {severity === 'minor' && t('injuries.minor')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="no-data">{t('injuries.noData')}</p>
      )}
    </div>
  );
}
