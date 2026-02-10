const API_FOOTBALL_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const SEASON = import.meta.env.VITE_SEASON || '2024';
const LEAGUE_ID = 39; // Premier League

const footballApi = async (endpoint: string, params: Record<string, string | number> = {}): Promise<any[]> => {
  const url = new URL(`https://v3.football.api-sports.io/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'x-apisports-key': API_FOOTBALL_KEY },
  });
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(Object.values(data.errors).join(', '));
  }
  return data.response;
};

export const getStandings = (): Promise<any[]> =>
  footballApi('standings', { league: LEAGUE_ID, season: SEASON });

export const getTeamSquad = (teamId: number): Promise<any[]> =>
  footballApi('players/squads', { team: teamId });

export const getFixtures = (teamId: number): Promise<any[]> =>
  footballApi('fixtures', { league: LEAGUE_ID, season: SEASON, team: teamId });

export const getLiveFixtures = (): Promise<any[]> =>
  footballApi('fixtures', { live: 'all', league: LEAGUE_ID });

export const getInjuries = (teamId: number): Promise<any[]> =>
  footballApi('injuries', { league: LEAGUE_ID, season: SEASON, team: teamId });

export const getTopScorers = (): Promise<any[]> =>
  footballApi('players/topscorers', { league: LEAGUE_ID, season: SEASON });

export const getTopAssists = (): Promise<any[]> =>
  footballApi('players/topassists', { league: LEAGUE_ID, season: SEASON });

export const getTeamInfo = (teamId: number): Promise<any[]> =>
  footballApi('teams', { id: teamId });

export const getCoaches = (teamId: number): Promise<any[]> =>
  footballApi('coachs', { team: teamId });

export const getLeagueInjuries = (): Promise<any[]> =>
  footballApi('injuries', { league: LEAGUE_ID, season: SEASON });

export const getTransfers = (teamId: number): Promise<any[]> =>
  footballApi('transfers', { team: teamId });

export const getLeagueFixtures = (): Promise<any[]> =>
  footballApi('fixtures', { league: LEAGUE_ID, season: SEASON });

export const getFixtureLineups = (fixtureId: number): Promise<any[]> =>
  footballApi('fixtures/lineups', { fixture: fixtureId });

export const getFixtureEvents = (fixtureId: number): Promise<any[]> =>
  footballApi('fixtures/events', { fixture: fixtureId });

// OpenWeatherMap API
export const getWeather = async (lat: number, lon: number): Promise<any> => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${OPENWEATHER_KEY}`
  );
  return res.json();
};

export const getWeatherForecast = async (lat: number, lon: number): Promise<any> => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${OPENWEATHER_KEY}`
  );
  return res.json();
};
