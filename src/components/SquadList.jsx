import './SquadList.css';

const positionOrder = { Goalkeeper: 0, Defender: 1, Midfielder: 2, Attacker: 3 };

export default function SquadList({ players, injuries }) {
  if (!players || players.length === 0) return <p className="no-data">Squad data unavailable</p>;

  const injuredIds = new Set((injuries || []).map((inj) => inj.player.id));
  const injuryMap = {};
  (injuries || []).forEach((inj) => {
    injuryMap[inj.player.id] = inj.player.reason || 'Injured';
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
              <h4 className="position-header">{player.position}s</h4>
            )}
            <div className={`squad-player ${isInjured ? 'injured' : ''}`}>
              <img src={player.photo} alt={player.name} className="player-photo" />
              <div className="player-info">
                <span className="player-name">
                  {player.number && <span className="player-number">{player.number}</span>}
                  {player.name}
                </span>
                <span className="player-age">Age: {player.age}</span>
              </div>
              <span className={`player-status ${isInjured ? 'status-injured' : 'status-fit'}`}>
                {isInjured ? injuryMap[player.id] : 'Fit'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
