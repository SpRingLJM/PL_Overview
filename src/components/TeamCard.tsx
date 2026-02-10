import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Standing } from '../types';
import './TeamCard.css';

interface Props {
  team: Standing;
}

export default function TeamCard({ team }: Props) {
  const { t } = useTranslation();
  const { rank, team: teamInfo, points, all, goalsDiff, form } = team;

  const getFormDots = (formStr: string) => {
    if (!formStr) return null;
    return formStr.split('').slice(-5).map((c, i) => (
      <span key={i} className={`card-form-dot ${c === 'W' ? 'w' : c === 'D' ? 'd' : 'l'}`} />
    ));
  };

  return (
    <Link to={`/team/${teamInfo.id}`} className="team-card card">
      <div className="team-card-header">
        <span className="team-rank">#{rank}</span>
        <img src={teamInfo.logo} alt={teamInfo.name} className="team-card-logo" />
      </div>
      <h3 className="team-card-name">{teamInfo.name}</h3>
      <div className="team-card-stats">
        <div className="team-card-points">
          <span className="pts-value">{points}</span>
          <span className="pts-label">{t('teamCard.pts')}</span>
        </div>
        <div className="team-card-record">
          <span>{all.win}W {all.draw}D {all.lose}L</span>
          <span className={goalsDiff > 0 ? 'positive' : goalsDiff < 0 ? 'negative' : ''}>
            {t('teamCard.gd')} {goalsDiff > 0 ? '+' : ''}{goalsDiff}
          </span>
        </div>
      </div>
      <div className="team-card-form">
        {getFormDots(form)}
      </div>
    </Link>
  );
}
