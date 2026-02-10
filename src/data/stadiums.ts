import type { Stadium } from '../types';

// Stadium coordinates for weather API
const stadiums: Record<number, Stadium> = {
  40: { name: 'Anfield', lat: 53.4308, lon: -2.9609, capacity: 61276 },
  42: { name: 'Emirates Stadium', lat: 51.5549, lon: -0.1084, capacity: 60704 },
  50: { name: 'Etihad Stadium', lat: 53.4831, lon: -2.2004, capacity: 55097 },
  49: { name: 'Stamford Bridge', lat: 51.4816, lon: -0.1909, capacity: 40341 },
  33: { name: 'Old Trafford', lat: 53.4631, lon: -2.2913, capacity: 75653 },
  34: { name: 'St James\' Park', lat: 54.9756, lon: -1.6217, capacity: 52305 },
  47: { name: 'Tottenham Hotspur Stadium', lat: 51.6043, lon: -0.0663, capacity: 62062 },
  66: { name: 'Villa Park', lat: 52.5092, lon: -1.8846, capacity: 42657 },
  65: { name: 'City Ground', lat: 52.9399, lon: -1.1322, capacity: 30602 },
  51: { name: 'Amex Stadium', lat: 50.8616, lon: -0.0834, capacity: 31800 },
  35: { name: 'Vitality Stadium', lat: 50.7352, lon: -1.8384, capacity: 11364 },
  36: { name: 'Craven Cottage', lat: 51.4749, lon: -0.2217, capacity: 25700 },
  55: { name: 'Gtech Community Stadium', lat: 51.4907, lon: -0.2886, capacity: 17250 },
  52: { name: 'Selhurst Park', lat: 51.3983, lon: -0.0855, capacity: 25486 },
  45: { name: 'Hill Dickinson Stadium', lat: 53.4388, lon: -2.9663, capacity: 52769 },
  48: { name: 'London Stadium', lat: 51.5387, lon: -0.0166, capacity: 62500 },
  39: { name: 'Molineux', lat: 52.5902, lon: -2.1306, capacity: 31750 },
  // Promoted teams (2025-26)
  63: { name: 'Elland Road', lat: 53.7778, lon: -1.5722, capacity: 37890 }, // Leeds
  44: { name: 'Turf Moor', lat: 53.7890, lon: -2.2302, capacity: 21944 }, // Burnley
  71: { name: 'Stadium of Light', lat: 54.9146, lon: -1.3882, capacity: 49000 }, // Sunderland
  // Relegated teams (still in 2024 data)
  46: { name: 'King Power Stadium', lat: 52.6204, lon: -1.1422, capacity: 32312 }, // Leicester
  57: { name: 'Portman Road', lat: 52.0545, lon: 1.1447, capacity: 29673 }, // Ipswich
  41: { name: "St Mary's Stadium", lat: 50.9058, lon: -1.3910, capacity: 32384 }, // Southampton
};

export default stadiums;
