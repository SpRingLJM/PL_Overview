const API_FOOTBALL_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const SEASON = import.meta.env.VITE_SEASON || '2024';
const LEAGUE_ID = 39; // Premier League

const footballApi = async (endpoint, params = {}) => {
  const url = new URL(`https://v3.football.api-sports.io/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, {
    headers: { 'x-apisports-key': API_FOOTBALL_KEY },
  });
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(Object.values(data.errors).join(', '));
  }
  return data.response;
};

export const getStandings = () =>
  footballApi('standings', { league: LEAGUE_ID, season: SEASON });

export const getTeamSquad = (teamId) =>
  footballApi('players/squads', { team: teamId });

export const getFixtures = (teamId) =>
  footballApi('fixtures', { league: LEAGUE_ID, season: SEASON, team: teamId });

export const getLiveFixtures = () =>
  footballApi('fixtures', { live: 'all', league: LEAGUE_ID });

export const getInjuries = (teamId) =>
  footballApi('injuries', { league: LEAGUE_ID, season: SEASON, team: teamId });

export const getTopScorers = () =>
  footballApi('players/topscorers', { league: LEAGUE_ID, season: SEASON });

export const getTopAssists = () =>
  footballApi('players/topassists', { league: LEAGUE_ID, season: SEASON });

export const getTeamInfo = (teamId) =>
  footballApi('teams', { id: teamId });

export const getCoaches = (teamId) =>
  footballApi('coachs', { team: teamId });

export const getLeagueInjuries = () =>
  footballApi('injuries', { league: LEAGUE_ID, season: SEASON });

export const getTransfers = (teamId) =>
  footballApi('transfers', { team: teamId });

// OpenWeatherMap API
export const getWeather = async (lat, lon) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${OPENWEATHER_KEY}`
  );
  return res.json();
};

export const getWeatherForecast = async (lat, lon) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${OPENWEATHER_KEY}`
  );
  return res.json();
};
