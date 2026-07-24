import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  Wind,
  Umbrella,
  Shirt,
  SunDim,
  Sparkles,
  Bike,
  Footprints,
  Camera,
  Car,
  Trees,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Compass,
  Sunrise,
  Sunset,
  Navigation,
  Flame,
  Search,
  MapPin,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ChevronDown,
  Info,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { getWeatherCondition } from '../utils/weatherUtils';

interface WeatherIconProps {
  code?: number;
  name?: string;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  name,
  isDay = 1,
  className = 'w-6 h-6',
  size,
}) => {
  let iconName = name;

  if (code !== undefined && !iconName) {
    const condition = getWeatherCondition(code);
    iconName = condition.iconName;

    // Adjust for night
    if (isDay === 0) {
      if (code === 0 || code === 1) iconName = 'Moon';
      else if (code === 2) iconName = 'CloudMoon';
    }
  }

  const props = { className, size };

  switch (iconName) {
    case 'Sun':
      return <Sun {...props} />;
    case 'SunMedium':
      return <SunMedium {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'CloudMoon':
      return <CloudMoon {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudRain':
      return <CloudRain {...props} />;
    case 'CloudRainWind':
      return <CloudRain {...props} />;
    case 'CloudSnow':
      return <CloudSnow {...props} />;
    case 'Snowflake':
      return <Snowflake {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Umbrella':
      return <Umbrella {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'SunDim':
      return <SunDim {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Bike':
      return <Bike {...props} />;
    case 'Footprints':
      return <Footprints {...props} />;
    case 'Camera':
      return <Camera {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'TreeParks':
    case 'Trees':
      return <Trees {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Eye':
      return <Eye {...props} />;
    case 'Gauge':
      return <Gauge {...props} />;
    case 'Thermometer':
      return <Thermometer {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Sunrise':
      return <Sunrise {...props} />;
    case 'Sunset':
      return <Sunset {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    default:
      return <Cloud {...props} />;
  }
};
