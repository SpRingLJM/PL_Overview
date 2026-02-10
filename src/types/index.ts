// API-Football response types

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  form: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

export interface FixtureStatus {
  short: string;
  long?: string;
}

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    status: FixtureStatus;
  };
  teams: {
    home: Team & { winner?: boolean | null };
    away: Team & { winner?: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

export interface Player {
  id: number;
  name: string;
  number?: number;
  position: string;
  photo: string;
  age: number;
  nationality?: string;
}

export interface PlayerStat {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality?: string;
  };
  statistics: Array<{
    team: Team;
    games: {
      appearences: number;
      minutes: number;
    };
    goals: {
      total: number;
      assists: number;
    };
  }>;
}

export interface InjuryEntry {
  player: {
    id: number;
    name: string;
    photo: string;
    reason: string;
    type: string;
  };
  team: Team;
  fixture: {
    id: number;
    date: string;
  };
}

export interface TransferTeam {
  id: number;
  name: string;
  logo: string;
}

export interface TransferEntry {
  player: {
    id: number;
    name: string;
  };
  update: string;
  transfers: Array<{
    date: string;
    type: string;
    teams: {
      in: TransferTeam;
      out: TransferTeam;
    };
  }>;
}

export interface ProcessedTransfer {
  player: { id: number; name: string };
  date: string;
  type: string;
  from: TransferTeam;
  to: TransferTeam;
  direction: 'in' | 'out';
  plTeam: Team;
}

export interface Coach {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  photo: string;
  nationality: string;
  age?: number;
  career: Array<{
    team: { id: number; name: string };
    start: string;
    end: string | null;
  }>;
}

export interface WeatherResponse {
  cod: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface Stadium {
  name: string;
  lat: number;
  lon: number;
  capacity: number;
}

export interface FixtureEvent {
  type: string;
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: Team;
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
}

export interface FixtureLineup {
  team: Team;
  formation: string;
  startXI: Array<{
    player: { id: number; name: string; number: number };
  }>;
}
