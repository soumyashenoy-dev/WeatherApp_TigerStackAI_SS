import { GeocodingResponse, GeocodingResult, WeatherResponse, CurrentData, HourlyData, DailyData } from '../types';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const data: GeocodingResponse = await response.json();
  return data.results || [];
}

export function normalizeWeatherData(data: any): WeatherResponse {
  const cw = data.current_weather || {};
  
  // Synthesize or sanitize current data
  const rawCurrent = data.current || {};
  const current: CurrentData = {
    time: rawCurrent.time || cw.time || new Date().toISOString(),
    temperature_2m: rawCurrent.temperature_2m ?? cw.temperature ?? 15,
    relative_humidity_2m: rawCurrent.relative_humidity_2m ?? data.hourly?.relative_humidity_2m?.[0] ?? 60,
    apparent_temperature: rawCurrent.apparent_temperature ?? cw.temperature ?? 15,
    is_day: rawCurrent.is_day ?? cw.is_day ?? 1,
    precipitation: rawCurrent.precipitation ?? data.hourly?.precipitation?.[0] ?? 0,
    rain: rawCurrent.rain ?? 0,
    showers: rawCurrent.showers ?? 0,
    snowfall: rawCurrent.snowfall ?? 0,
    weather_code: rawCurrent.weather_code ?? cw.weathercode ?? cw.weather_code ?? 0,
    cloud_cover: rawCurrent.cloud_cover ?? data.hourly?.cloud_cover?.[0] ?? 20,
    pressure_msl: rawCurrent.pressure_msl ?? rawCurrent.surface_pressure ?? data.hourly?.surface_pressure?.[0] ?? 1013,
    surface_pressure: rawCurrent.surface_pressure ?? rawCurrent.pressure_msl ?? data.hourly?.surface_pressure?.[0] ?? 1013,
    wind_speed_10m: rawCurrent.wind_speed_10m ?? cw.windspeed ?? cw.wind_speed_10m ?? 10,
    wind_direction_10m: rawCurrent.wind_direction_10m ?? cw.winddirection ?? cw.wind_direction_10m ?? 180,
    wind_gusts_10m: rawCurrent.wind_gusts_10m ?? cw.windspeed ?? cw.wind_speed_10m ?? 10,
  };

  // Safe hourly arrays
  const hTimes: string[] = data.hourly?.time || Array.from({ length: 24 }, (_, i) => {
    const d = new Date(Date.now() + i * 3600000);
    return d.toISOString();
  });

  const hourly: HourlyData = {
    time: hTimes,
    temperature_2m: data.hourly?.temperature_2m || hTimes.map(() => current.temperature_2m),
    relative_humidity_2m: data.hourly?.relative_humidity_2m || hTimes.map(() => current.relative_humidity_2m),
    apparent_temperature: data.hourly?.apparent_temperature || hTimes.map(() => current.apparent_temperature),
    precipitation_probability: data.hourly?.precipitation_probability || hTimes.map(() => 0),
    precipitation: data.hourly?.precipitation || hTimes.map(() => 0),
    weather_code: data.hourly?.weather_code || data.hourly?.weathercode || hTimes.map(() => current.weather_code),
    surface_pressure: data.hourly?.surface_pressure || hTimes.map(() => current.pressure_msl),
    cloud_cover: data.hourly?.cloud_cover || hTimes.map(() => 20),
    visibility: data.hourly?.visibility || hTimes.map(() => 10000),
    wind_speed_10m: data.hourly?.wind_speed_10m || hTimes.map(() => current.wind_speed_10m),
    uv_index: data.hourly?.uv_index || hTimes.map(() => 3),
  };

  // Safe daily arrays
  const dTimes: string[] = data.daily?.time || Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const daily: DailyData = {
    time: dTimes,
    weather_code: data.daily?.weather_code || data.daily?.weathercode || dTimes.map(() => current.weather_code),
    temperature_2m_max: data.daily?.temperature_2m_max || dTimes.map(() => current.temperature_2m + 3),
    temperature_2m_min: data.daily?.temperature_2m_min || dTimes.map(() => current.temperature_2m - 3),
    apparent_temperature_max: data.daily?.apparent_temperature_max || dTimes.map(() => current.apparent_temperature + 3),
    apparent_temperature_min: data.daily?.apparent_temperature_min || dTimes.map(() => current.apparent_temperature - 3),
    sunrise: data.daily?.sunrise || dTimes.map((t: string) => `${t}T06:30`),
    sunset: data.daily?.sunset || dTimes.map((t: string) => `${t}T19:30`),
    uv_index_max: data.daily?.uv_index_max || dTimes.map(() => 5),
    precipitation_sum: data.daily?.precipitation_sum || dTimes.map(() => 0),
    rain_sum: data.daily?.rain_sum || dTimes.map(() => 0),
    showers_sum: data.daily?.showers_sum || dTimes.map(() => 0),
    snowfall_sum: data.daily?.snowfall_sum || dTimes.map(() => 0),
    precipitation_hours: data.daily?.precipitation_hours || dTimes.map(() => 0),
    precipitation_probability_max: data.daily?.precipitation_probability_max || dTimes.map(() => 0),
    wind_speed_10m_max: data.daily?.wind_speed_10m_max || dTimes.map(() => current.wind_speed_10m + 5),
    wind_gusts_10m_max: data.daily?.wind_gusts_10m_max || dTimes.map(() => current.wind_speed_10m + 10),
  };

  return {
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    generationtime_ms: data.generationtime_ms ?? 0,
    utc_offset_seconds: data.utc_offset_seconds ?? 0,
    timezone: data.timezone ?? 'UTC',
    timezone_abbreviation: data.timezone_abbreviation ?? 'UTC',
    elevation: data.elevation ?? 0,
    current_weather: cw,
    current,
    hourly,
    daily,
  };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const primaryUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&current_weather=true&timezone=auto`;

  const fallbackUrl1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;

  const fallbackUrl2 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min`;

  let data: any = null;

  try {
    const res = await fetch(primaryUrl);
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {
    console.warn('Primary weather endpoint unreachable, trying fallback 1...', err);
  }

  if (!data) {
    try {
      const res = await fetch(fallbackUrl1);
      if (res.ok) {
        data = await res.json();
      }
    } catch (err) {
      console.warn('Fallback 1 endpoint unreachable, trying fallback 2...', err);
    }
  }

  if (!data) {
    const res = await fetch(fallbackUrl2);
    if (!res.ok) {
      throw new Error(`Weather API request failed with status ${res.status}`);
    }
    data = await res.json();
  }

  return normalizeWeatherData(data);
}

// Reverse geocode fallback using open street map / bigdatacloud or coordinate label
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Your Location';
      const country = data.countryName ? `, ${data.countryName}` : '';
      return `${city}${country}`;
    }
  } catch {
    // ignore error fallback
  }
  return `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
}

