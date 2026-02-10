import { useTranslation } from 'react-i18next';
import type { Player, InjuryEntry } from '../types';
import './SquadList.css';

const positionOrder: Record<string, number> = { Goalkeeper: 0, Defender: 1, Midfielder: 2, Attacker: 3 };
const positionKeys: Record<string, string> = {
  Goalkeeper: 'squad.goalkeepers',
  Defender: 'squad.defenders',
  Midfielder: 'squad.midfielders',
  Attacker: 'squad.attackers',
};

interface Props {
  players: Player[];
  injuries: InjuryEntry[];
}

export default function SquadList({ players, injuries }: Props) {
  const { t } = useTranslation();

  if (!players || players.length === 0) return <p className="no-data">{t('squad.unavailable')}</p>;

  const injuredIds = new Set((injuries || []).map((inj) => inj.player.id));
  const injuryMap: Record<number, string> = {};
  (injuries || []).forEach((inj) => {
    injuryMap[inj.player.id] = inj.player.reason || t('squad.injured');
  });

  const sorted = [...players].sort(
    (a, b) => (positionOrder[a.position] ?? 9) - (positionOrder[b.position] ?? 9)
  );

  let currentPos = '';

  return (
    <div className="squad-list">
      {sorted.map((player) => {
        const showHeader = player.position !== currentPos;
        if (showHeader) currentPos = player.position;
        const isInjured = injuredIds.has(player.id);

        return (
          <div key={player.id}>
            {showHeader && (
              <h4 className="position-header">{t(positionKeys[player.position] || player.position)}</h4>
            )}
            <div className={`squad-player ${isInjured ? 'injured' : ''}`}>
              <img src={player.photo} alt={player.name} className="player-photo" />
              <div className="player-info">
                <span className="player-name">
                  {player.number && <span className="player-number">{player.number}</span>}
                  {player.name}
                </span>
                <span className="player-age">{t('squad.age', { age: player.age })}</span>
              </div>
              <span className={`player-status ${isInjured ? 'status-injured' : 'status-fit'}`}>
                {isInjured ? injuryMap[player.id] : t('squad.fit')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
