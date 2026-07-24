# SkyPulse - Modern Weather & Outdoor Intelligence Application

SkyPulse is a responsive, feature-rich weather dashboard built with **React**, **TypeScript**, **Tailwind CSS**, and **Recharts**. It utilizes the Open-Meteo API to deliver real-time weather conditions, 24-hour hourly charts, 7-day forecasts, and intelligent outdoor planning insights.

---

## 🌟 Key Features

- **Current Weather Dashboard**:
  - Real-time temperature, condition badge, "feels like" index, and daily high/lows.
  - Comprehensive weather metrics: UV index, humidity, wind speed & direction, atmospheric pressure, cloud cover, and visibility.
  - Dynamic sun progress visualizer tracking sunrise and sunset times.

- **Quick Bar & City Search**:
  - **Quick Bar**: Convenient top 5 quick-access cities cleanly displayed without horizontal scrolling.
  - **Global Search**: Search any city worldwide with instant autocomplete suggestions.
  - **Location Pinning**: Pin your favorite cities directly from search results into your Quick Bar.
  - **Geolocation Fallback**: Automatic current location detection with graceful permission handling and city fallbacks.

- **Hourly & Extended Forecasts**:
  - **24-Hour Interactive Visualizer**: Toggle between smooth area temperature charts (powered by Recharts) and detailed hourly cards (precipitation probability, wind speed).
  - **7-Day Forecast**: Extended weekly overview with daily temperature ranges, condition icons, and rain probabilities.

- **Outdoor Planning Intelligence**:
  - Real-time activity suitability scores for Running, Cycling, Outdoor Dining, Stargazing, and Drone Flying based on wind, cloud cover, rain, and temperature.

- **Customization & Persistence**:
  - **Unit Conversion**: Toggle seamlessly between Celsius (°C) and Fahrenheit (°F), as well as Wind Speed units (km/h, mph, m/s).
  - **Favorites Manager**: Save favorite cities locally with instant access via the modal toolbar.
  - **Resilient API Architecture**: Multi-tiered Open-Meteo fallback handling and data normalization ensure weather reports load reliably even if specific endpoint attributes are restricted.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Iconography**: Lucide React
- **Weather API**: Open-Meteo (Free Geocoding & Weather Forecast APIs)

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build Application**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx   # Primary current weather display & sun curve
│   │   ├── DailyForecast.tsx        # 7-day extended forecast row list
│   │   ├── FavoritesModal.tsx       # Favorites list & location launcher
│   │   ├── HourlyForecast.tsx       # Recharts 24h area chart & hourly cards
│   │   ├── Navbar.tsx               # Top header with units toggle & favorites button
│   │   ├── PlanningIntelligence.tsx  # Outdoor activity condition advisor
│   │   ├── SearchBar.tsx            # Search autocomplete, Quick Bar & location trigger
│   │   ├── WeatherDetailsGrid.tsx   # Detailed weather metric cards
│   │   └── WeatherIcon.tsx          # WMO weather code icon mapper
│   ├── utils/
│   │   ├── api.ts                   # Open-Meteo API fetching & normalization engine
│   │   └── weatherUtils.ts          # Conversion helpers & outdoor score logic
│   ├── App.tsx                      # Main application view & local state management
│   ├── main.tsx                     # React entry point
│   └── types.ts                     # TypeScript interfaces & types
├── package.json
└── README.md
```
