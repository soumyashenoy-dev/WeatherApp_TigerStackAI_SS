export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface CurrentData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: CurrentWeather;
  current?: CurrentData;
  hourly?: HourlyData;
  daily?: DailyData;
}

export type TempUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';

export interface WeatherCondition {
  code: number;
  label: string;
  iconName: string;
  description: string;
  category: 'clear' | 'clouds' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  gradient: string;
  bgTone: string;
}

export interface PlanningRecommendation {
  type: 'umbrella' | 'clothing' | 'uv' | 'wind' | 'outdoor' | 'driving' | 'stargazing';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
  icon: string;
}

export interface ActivityScore {
  name: string;
  score: number; // 0 to 10
  status: 'Ideal' | 'Good' | 'Moderate' | 'Poor';
  icon: string;
  tip: string;
}
