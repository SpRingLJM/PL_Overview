import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Standing } from '../types';
import './StandingsTable.css';

interface Props {
  standings: Standing[];
}

export default function StandingsTable({ standings }: Props) {
  const { t } = useTranslation();

  if (!standings || standings.length === 0) return null;

  const getFormIcon = (char: string) => {
    const map: Record<string, string> = { W: 'form-w', D: 'form-d', L: 'form-l' };
    return <span className={`form-dot ${map[char] || ''}`} key={Math.random()}>{char}</span>;
  };

  return (
    <div className="standings-wrapper">
      <table className="standings-table">
        <thead>
          <tr>
            <th className="col-pos">{t('standings.pos')}</th>
            <th className="col-team">{t('standings.team')}</th>
            <th>{t('standings.mp')}</th>
            <th>{t('standings.w')}</th>
            <th>{t('standings.d')}</th>
            <th>{t('standings.l')}</th>
            <th>{t('standings.gf')}</th>
            <th>{t('standings.ga')}</th>
            <th>{t('standings.gd')}</th>
            <th className="col-pts">{t('standings.pts')}</th>
            <th className="col-form">{t('standings.form')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr
              key={team.team.id}
              className={`
                ${team.rank <= 4 ? 'zone-ucl' : ''}
                ${team.rank === 5 ? 'zone-uel' : ''}
                ${team.rank >= 18 ? 'zone-rel' : ''}
              `}
            >
              <td className="col-pos">{team.rank}</td>
              <td className="col-team">
                <Link to={`/team/${team.team.id}`} className="team-link">
                  <img src={team.team.logo} alt={team.team.name} className="team-logo-sm" />
                  <span>{team.team.name}</span>
                </Link>
              </td>
              <td>{team.all.played}</td>
              <td>{team.all.win}</td>
              <td>{team.all.draw}</td>
              <td>{team.all.lose}</td>
              <td>{team.all.goals.for}</td>
              <td>{team.all.goals.against}</td>
              <td className={team.goalsDiff > 0 ? 'positive' : team.goalsDiff < 0 ? 'negative' : ''}>
                {team.goalsDiff > 0 ? '+' : ''}{team.goalsDiff}
              </td>
              <td className="col-pts">{team.points}</td>
              <td className="col-form">
                {team.form && team.form.split('').slice(-5).map(getFormIcon)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="standings-legend">
        <span className="legend-item"><span className="legend-dot ucl"></span> {t('standings.championsLeague')}</span>
        <span className="legend-item"><span className="legend-dot uel"></span> {t('standings.europaLeague')}</span>
        <span className="legend-item"><span className="legend-dot rel"></span> {t('standings.relegation')}</span>
      </div>
    </div>
  );
}
