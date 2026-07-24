import {
  WeatherCondition,
  TempUnit,
  SpeedUnit,
  CurrentData,
  DailyData,
  HourlyData,
  PlanningRecommendation,
  ActivityScore,
} from '../types';

export const WMO_CODES: Record<number, WeatherCondition> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    iconName: 'Sun',
    description: 'Bright and clear skies',
    category: 'clear',
    gradient: 'from-amber-400 via-orange-400 to-amber-500',
    bgTone: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    iconName: 'SunMedium',
    description: 'Mostly clear with minimal clouds',
    category: 'clear',
    gradient: 'from-amber-400 via-sky-400 to-blue-500',
    bgTone: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    iconName: 'CloudSun',
    description: 'Scattered clouds and sunshine',
    category: 'clouds',
    gradient: 'from-sky-400 via-indigo-400 to-slate-500',
    bgTone: 'bg-sky-500/10 border-sky-500/20 text-sky-700 dark:text-sky-300',
  },
  3: {
    code: 3,
    label: 'Overcast',
    iconName: 'Cloud',
    description: 'Fully covered by clouds',
    category: 'clouds',
    gradient: 'from-slate-400 via-slate-500 to-slate-600',
    bgTone: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300',
  },
  45: {
    code: 45,
    label: 'Foggy',
    iconName: 'CloudFog',
    description: 'Reduced visibility due to fog',
    category: 'fog',
    gradient: 'from-slate-300 via-gray-400 to-zinc-500',
    bgTone: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300',
  },
  48: {
    code: 48,
    label: 'Freezing Fog',
    iconName: 'CloudFog',
    description: 'Depositing rime fog with icy surfaces',
    category: 'fog',
    gradient: 'from-slate-300 via-cyan-400 to-teal-600',
    bgTone: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    iconName: 'CloudDrizzle',
    description: 'Gentle light drizzle drops',
    category: 'drizzle',
    gradient: 'from-sky-300 via-blue-400 to-indigo-500',
    bgTone: 'bg-sky-500/10 border-sky-500/20 text-sky-700 dark:text-sky-300',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    iconName: 'CloudDrizzle',
    description: 'Continuous light drizzle',
    category: 'drizzle',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    bgTone: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  55: {
    code: 55,
    label: 'Heavy Drizzle',
    iconName: 'CloudRain',
    description: 'Dense drizzle creating damp conditions',
    category: 'drizzle',
    gradient: 'from-blue-400 via-blue-600 to-slate-700',
    bgTone: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  56: {
    code: 56,
    label: 'Freezing Drizzle',
    iconName: 'CloudSnow',
    description: 'Light icy drizzle',
    category: 'drizzle',
    gradient: 'from-cyan-300 via-blue-400 to-indigo-600',
    bgTone: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    iconName: 'CloudSnow',
    description: 'Heavy freezing drizzle causing icy glaze',
    category: 'drizzle',
    gradient: 'from-cyan-400 via-blue-600 to-slate-800',
    bgTone: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    iconName: 'CloudRain',
    description: 'Light rainfall',
    category: 'rain',
    gradient: 'from-blue-400 via-sky-500 to-indigo-600',
    bgTone: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    iconName: 'CloudRain',
    description: 'Steady rain showers',
    category: 'rain',
    gradient: 'from-blue-500 via-indigo-600 to-slate-700',
    bgTone: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    iconName: 'CloudRainWind',
    description: 'Heavy downpour and rain',
    category: 'rain',
    gradient: 'from-indigo-600 via-blue-700 to-slate-900',
    bgTone: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300',
  },
  66: {
    code: 66,
    label: 'Freezing Rain',
    iconName: 'CloudSnow',
    description: 'Light rain freezing on contact',
    category: 'rain',
    gradient: 'from-cyan-400 via-indigo-500 to-blue-700',
    bgTone: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    iconName: 'CloudSnow',
    description: 'Heavy rain forming thick ice coating',
    category: 'rain',
    gradient: 'from-cyan-500 via-indigo-700 to-slate-900',
    bgTone: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300',
  },
  71: {
    code: 71,
    label: 'Slight Snow',
    iconName: 'Snowflake',
    description: 'Light snow flurries',
    category: 'snow',
    gradient: 'from-sky-200 via-indigo-300 to-blue-400',
    bgTone: 'bg-sky-400/10 border-sky-400/20 text-sky-700 dark:text-sky-300',
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    iconName: 'Snowflake',
    description: 'Steady snowfall',
    category: 'snow',
    gradient: 'from-sky-300 via-blue-400 to-indigo-600',
    bgTone: 'bg-blue-400/10 border-blue-400/20 text-blue-700 dark:text-blue-300',
  },
  75: {
    code: 75,
    label: 'Heavy Snow',
    iconName: 'Snowflake',
    description: 'Heavy accumulating snowfall',
    category: 'snow',
    gradient: 'from-blue-300 via-indigo-500 to-slate-800',
    bgTone: 'bg-indigo-400/10 border-indigo-400/20 text-indigo-700 dark:text-indigo-300',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    iconName: 'Snowflake',
    description: 'Fine frozen snow particles',
    category: 'snow',
    gradient: 'from-cyan-200 via-sky-400 to-blue-600',
    bgTone: 'bg-cyan-400/10 border-cyan-400/20 text-cyan-700 dark:text-cyan-300',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    iconName: 'CloudRain',
    description: 'Passing light showers',
    category: 'rain',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    bgTone: 'bg-sky-500/10 border-sky-500/20 text-sky-700 dark:text-sky-300',
  },
  81: {
    code: 81,
    label: 'Moderate Showers',
    iconName: 'CloudRain',
    description: 'Intermittent moderate showers',
    category: 'rain',
    gradient: 'from-blue-400 via-indigo-600 to-slate-700',
    bgTone: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  82: {
    code: 82,
    label: 'Violent Showers',
    iconName: 'CloudRainWind',
    description: 'Torrential downpours',
    category: 'rain',
    gradient: 'from-indigo-600 via-purple-700 to-slate-900',
    bgTone: 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300',
  },
  85: {
    code: 85,
    label: 'Light Snow Showers',
    iconName: 'CloudSnow',
    description: 'Brief light snow showers',
    category: 'snow',
    gradient: 'from-sky-200 via-blue-300 to-indigo-500',
    bgTone: 'bg-sky-400/10 border-sky-400/20 text-sky-700 dark:text-sky-300',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    iconName: 'CloudSnow',
    description: 'Intense snow squalls',
    category: 'snow',
    gradient: 'from-indigo-300 via-blue-500 to-slate-800',
    bgTone: 'bg-indigo-400/10 border-indigo-400/20 text-indigo-700 dark:text-indigo-300',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    iconName: 'CloudLightning',
    description: 'Thunderstorms with lightning risk',
    category: 'thunderstorm',
    gradient: 'from-amber-600 via-purple-800 to-slate-950',
    bgTone: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    iconName: 'CloudLightning',
    description: 'Thunderstorm accompanied by small hail',
    category: 'thunderstorm',
    gradient: 'from-purple-700 via-slate-800 to-black',
    bgTone: 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300',
  },
  99: {
    code: 99,
    label: 'Severe Thunderstorm',
    iconName: 'CloudLightning',
    description: 'Severe thunderstorm with heavy hail and high winds',
    category: 'thunderstorm',
    gradient: 'from-purple-900 via-slate-900 to-black',
    bgTone: 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300',
  },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return WMO_CODES[code] || {
    code,
    label: 'Unknown Weather',
    iconName: 'Cloud',
    description: 'Weather conditions variable',
    category: 'clouds',
    gradient: 'from-slate-400 via-slate-500 to-slate-600',
    bgTone: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300',
  };
}

export function convertTemp(tempC: number, unit: TempUnit): number {
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function convertSpeed(speedKmh: number, unit: SpeedUnit): number {
  if (unit === 'mph') {
    return Math.round(speedKmh * 0.621371);
  }
  if (unit === 'ms') {
    return Math.round((speedKmh / 3.6) * 10) / 10;
  }
  return Math.round(speedKmh);
}

export function getSpeedLabel(unit: SpeedUnit): string {
  if (unit === 'mph') return 'mph';
  if (unit === 'ms') return 'm/s';
  return 'km/h';
}

export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function getUVRating(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: 'text-emerald-500 bg-emerald-500/10' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-amber-500 bg-amber-500/10' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500 bg-orange-500/10' };
  if (uv <= 10) return { label: 'Very High', color: 'text-rose-500 bg-rose-500/10' };
  return { label: 'Extreme', color: 'text-purple-500 bg-purple-500/10' };
}

/**
 * Generates smart planning recommendations based on weather parameters
 */
export function generateRecommendations(
  current: CurrentData | undefined,
  daily: DailyData | undefined,
  hourly: HourlyData | undefined
): PlanningRecommendation[] {
  const list: PlanningRecommendation[] = [];

  if (!current) return list;

  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const code = current.weather_code;
  const precip = current.precipitation;
  const wind = current.wind_speed_10m;
  const gusts = current.wind_gusts_10m;

  // Max precipitation probability in upcoming hours
  let maxPrecipProb = 0;
  if (hourly?.precipitation_probability?.length) {
    // Next 12 hours
    const next12 = hourly.precipitation_probability.slice(0, 12);
    maxPrecipProb = Math.max(...next12);
  } else if (daily?.precipitation_probability_max?.[0]) {
    maxPrecipProb = daily.precipitation_probability_max[0];
  }

  // Max UV today
  const maxUV = daily?.uv_index_max?.[0] ?? 0;

  // 1. Umbrella & Rain Advice
  const isRainingCategory = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
  if (isRainingCategory || precip > 0) {
    list.push({
      type: 'umbrella',
      title: 'Rain Gear Required',
      message: `Active precipitation detected (${precip} mm). Bring a waterproof umbrella, rain jacket, and water-resistant boots.`,
      severity: 'warning',
      icon: 'Umbrella',
    });
  } else if (maxPrecipProb >= 60) {
    list.push({
      type: 'umbrella',
      title: 'High Chance of Rain Today',
      message: `Rain probability reaches ${maxPrecipProb}% today. Pack an umbrella in your bag just in case!`,
      severity: 'info',
      icon: 'Umbrella',
    });
  } else if (maxPrecipProb >= 35) {
    list.push({
      type: 'umbrella',
      title: 'Slight Chance of Rain',
      message: `Pop-up showers possible (${maxPrecipProb}% chance). A compact umbrella is recommended for commute.`,
      severity: 'info',
      icon: 'CloudRain',
    });
  } else {
    list.push({
      type: 'umbrella',
      title: 'Dry Day Ahead',
      message: 'No umbrella needed today. Enjoy the clear outdoor conditions!',
      severity: 'success',
      icon: 'Sun',
    });
  }

  // 2. Clothing & Layers Recommendation
  if (apparentTemp <= 0) {
    list.push({
      type: 'clothing',
      title: 'Freezing Conditions (Sub-Zero)',
      message: `Feels like ${Math.round(apparentTemp)}°C. Wear heavy insulated coat, thermal base layers, winter gloves, beanie, and a scarf.`,
      severity: 'alert',
      icon: 'Shirt',
    });
  } else if (apparentTemp < 12) {
    list.push({
      type: 'clothing',
      title: 'Chilly Weather Layering',
      message: `Feels like ${Math.round(apparentTemp)}°C. Wear a medium winter jacket, sweater, and long pants.`,
      severity: 'info',
      icon: 'Shirt',
    });
  } else if (apparentTemp < 20) {
    list.push({
      type: 'clothing',
      title: 'Mild & Crisp Comfort',
      message: `Feels like ${Math.round(apparentTemp)}°C. A light jacket, cardigan, or hoodie over a long sleeve tee is ideal.`,
      severity: 'success',
      icon: 'Shirt',
    });
  } else if (apparentTemp <= 28) {
    list.push({
      type: 'clothing',
      title: 'Warm & Pleasant Apparel',
      message: `Feels like ${Math.round(apparentTemp)}°C. T-shirt, breathable shirt, and jeans or shorts are great.`,
      severity: 'success',
      icon: 'Shirt',
    });
  } else {
    list.push({
      type: 'clothing',
      title: 'Hot Weather Advisory',
      message: `Feels like ${Math.round(apparentTemp)}°C. Wear light, loose cotton/linen clothing, stay hydrated, and seek shade during peak hours.`,
      severity: 'warning',
      icon: 'Flame',
    });
  }

  // 3. Sun & UV Protection
  if (maxUV >= 8) {
    list.push({
      type: 'uv',
      title: 'Very High UV Index (' + maxUV + ')',
      message: 'Apply broad-spectrum SPF 50+ sunscreen every 2 hours, wear UV-blocking sunglasses and a wide-brim hat.',
      severity: 'alert',
      icon: 'SunDim',
    });
  } else if (maxUV >= 6) {
    list.push({
      type: 'uv',
      title: 'High UV Exposure (' + maxUV + ')',
      message: 'Sun protection essential between 10 AM - 4 PM. Apply SPF 30+ sunscreen and wear sunglasses.',
      severity: 'warning',
      icon: 'SunDim',
    });
  } else if (maxUV >= 3) {
    list.push({
      type: 'uv',
      title: 'Moderate UV Index (' + maxUV + ')',
      message: 'Moderate sun exposure. Consider sunglasses and light SPF if spending prolonged time outdoors.',
      severity: 'info',
      icon: 'SunDim',
    });
  }

  // 4. Wind & Gust Caution
  if (gusts >= 50 || wind >= 35) {
    list.push({
      type: 'wind',
      title: 'High Wind Warning',
      message: `Wind gusts up to ${Math.round(gusts)} km/h. Secure loose outdoor objects, patio furniture, and take extra care when driving or cycling.`,
      severity: 'alert',
      icon: 'Wind',
    });
  } else if (gusts >= 30 || wind >= 20) {
    list.push({
      type: 'wind',
      title: 'Breezy Weather',
      message: `Moderate winds around ${Math.round(wind)} km/h. Hold onto hats and light accessories outdoors.`,
      severity: 'info',
      icon: 'Wind',
    });
  }

  // 5. Stargazing / Night conditions (if night or upcoming night)
  const cloudCover = current.cloud_cover;
  if (cloudCover < 20 && !isRainingCategory) {
    list.push({
      type: 'stargazing',
      title: 'Prime Night Stargazing',
      message: `Low cloud cover (${cloudCover}%). Clear skies tonight offer optimal conditions for viewing stars and planets.`,
      severity: 'success',
      icon: 'Sparkles',
    });
  }

  return list;
}

/**
 * Calculates activity scores from 0-10 based on weather conditions
 */
export function calculateActivityScores(
  current: CurrentData | undefined,
  daily: DailyData | undefined
): ActivityScore[] {
  if (!current) return [];

  const temp = current.temperature_2m;
  const precip = current.precipitation;
  const code = current.weather_code;
  const wind = current.wind_speed_10m;
  const cloud = current.cloud_cover;
  const maxUV = daily?.uv_index_max?.[0] ?? 0;

  const isRain = precip > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

  // 1. Outdoor Running / Jogging
  let runScore = 10;
  if (isRain) runScore -= 5;
  if (temp < 5) runScore -= 3;
  else if (temp > 28) runScore -= 4;
  else if (temp > 33) runScore -= 7;
  if (wind > 30) runScore -= 3;
  runScore = Math.max(1, Math.min(10, runScore));

  // 2. Outdoor Cycling
  let cycleScore = 10;
  if (isRain) cycleScore -= 6;
  if (wind > 25) cycleScore -= 4;
  if (wind > 40) cycleScore -= 8;
  if (temp < 2) cycleScore -= 4;
  if (temp > 32) cycleScore -= 4;
  cycleScore = Math.max(1, Math.min(10, cycleScore));

  // 3. Outdoor Picnic / Park
  let picnicScore = 10;
  if (isRain) picnicScore -= 8;
  if (temp < 15 || temp > 30) picnicScore -= 4;
  if (wind > 25) picnicScore -= 3;
  if (maxUV > 8) picnicScore -= 2;
  picnicScore = Math.max(1, Math.min(10, picnicScore));

  // 4. Outdoor Photography
  let photoScore = 10;
  if (isRain && precip > 2) photoScore -= 5;
  if (code === 2 || code === 1) photoScore += 0; // great lighting
  if (cloud > 90) photoScore -= 2;
  if (wind > 35) photoScore -= 2;
  photoScore = Math.max(1, Math.min(10, photoScore));

  // 5. Commute & Driving
  let driveScore = 10;
  if (isRain) driveScore -= 3;
  if (precip > 5) driveScore -= 5;
  if (code === 45 || code === 48) driveScore -= 6; // fog
  if ([71, 73, 75, 85, 86].includes(code)) driveScore -= 6; // snow
  if (wind > 45) driveScore -= 4;
  driveScore = Math.max(1, Math.min(10, driveScore));

  const getStatus = (score: number): ActivityScore['status'] => {
    if (score >= 8) return 'Ideal';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Moderate';
    return 'Poor';
  };

  return [
    {
      name: 'Running & Jogging',
      score: runScore,
      status: getStatus(runScore),
      icon: 'Footprints',
      tip:
        runScore >= 8
          ? 'Perfect temperature and wind conditions for outdoor cardio.'
          : runScore >= 5
          ? 'Acceptable conditions. Wear appropriate gear.'
          : 'Consider indoor treadmill training today.',
    },
    {
      name: 'Cycling & Biking',
      score: cycleScore,
      status: getStatus(cycleScore),
      icon: 'Bike',
      tip:
        cycleScore >= 8
          ? 'Smooth wind speed and clear roads for cycling.'
          : cycleScore >= 5
          ? 'Mild headwinds or damp road surfaces possible.'
          : 'Slippery roads or strong crosswinds present.',
    },
    {
      name: 'Picnic & Parks',
      score: picnicScore,
      status: getStatus(picnicScore),
      icon: 'TreeParks',
      tip:
        picnicScore >= 8
          ? 'Pleasant temperatures and mild sun ideal for outings.'
          : picnicScore >= 5
          ? 'Check weather timing for sudden shade or breeze.'
          : 'Unfavorable for prolonged outdoor lounging.',
    },
    {
      name: 'Outdoor Photography',
      score: photoScore,
      status: getStatus(photoScore),
      icon: 'Camera',
      tip:
        photoScore >= 8
          ? 'Dynamic lighting and cloud textures for stunning shots.'
          : photoScore >= 5
          ? 'Standard lighting. Diffused light under soft clouds.'
          : 'Low visibility or gear protection required.',
    },
    {
      name: 'Road Commute',
      score: driveScore,
      status: getStatus(driveScore),
      icon: 'Car',
      tip:
        driveScore >= 8
          ? 'Clear road visibility and dry traction.'
          : driveScore >= 5
          ? 'Allow slight extra buffer time for traffic.'
          : 'Wet or icy roads — reduce speed and maintain distance.',
    },
  ];
}
