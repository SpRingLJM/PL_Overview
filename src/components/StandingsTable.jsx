import { Link } from 'react-router-dom';
import './StandingsTable.css';

export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) return null;

  const getFormIcon = (char) => {
    const map = { W: 'form-w', D: 'form-d', L: 'form-l' };
    return <span className={`form-dot ${map[char] || ''}`} key={Math.random()}>{char}</span>;
  };

  return (
    <div className="standings-wrapper">
      <table className="standings-table">
        <thead>
          <tr>
            <th className="col-pos">#</th>
            <th className="col-team">Team</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th className="col-pts">PTS</th>
            <th className="col-form">Form</th>
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
        <span className="legend-item"><span className="legend-dot ucl"></span> Champions League</span>
        <span className="legend-item"><span className="legend-dot uel"></span> Europa League</span>
        <span className="legend-item"><span className="legend-dot rel"></span> Relegation</span>
      </div>
    </div>
  );
}
