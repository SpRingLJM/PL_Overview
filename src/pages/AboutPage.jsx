import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <h2 className="section-title">About</h2>
      <div className="card about-content">
        <h3>The Overview of Premier League</h3>
        <p>
          Premier League 2025-26 season overview dashboard. Real-time standings,
          squad information, player conditions, match fixtures, player statistics,
          and stadium weather data.
        </p>

        <h4>Data Sources</h4>
        <ul>
          <li><strong>API-Football</strong> - Standings, fixtures, squads, injuries, player stats</li>
          <li><strong>OpenWeatherMap</strong> - Stadium weather conditions</li>
        </ul>

        <h4>Season Info</h4>
        <ul>
          <li>The 2025-26 Premier League is the 34th season of the competition</li>
          <li>Promoted clubs: Leeds United, Burnley, Sunderland</li>
          <li>Relegated from 2024-25: Leicester City, Ipswich Town, Southampton</li>
        </ul>

        <h4>Key Storylines</h4>
        <ul>
          <li>Arsenal leading the title race with 56 points</li>
          <li>Mid-season managerial changes at Man United (Michael Carrick), Chelsea (Liam Rosenior)</li>
          <li>Liverpool struggling under Arne Slot in defense of their title</li>
          <li>Everton's new Hill Dickinson Stadium (52,769 capacity)</li>
          <li>Sunderland's impressive return to the top flight (9th place)</li>
          <li>Wolves at the bottom with historic low points</li>
        </ul>
      </div>
    </div>
  );
}
