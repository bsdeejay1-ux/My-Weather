'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchWeather, WeatherData, getWeatherCondition } from '@/lib/weather';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, MapPin, Search, Sun, Wind, Droplets } from 'lucide-react';

const IconMap: Record<string, React.ElementType> = {
  'sun': Sun,
  'cloud-sun': CloudSun,
  'cloud-fog': CloudFog,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
  'cloud': Cloud
};

export default function WeatherDashboard() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState<Date>(new Date());

  // Current Time Ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Logic
  useEffect(() => {
    async function loadWeather(lat: number, lon: number) {
      try {
        const weather = await fetchWeather(lat, lon);
        setData(weather);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data.');
      } finally {
        setLoading(false);
      }
    }

    // Default to Tokyo if geolocation fails or is denied
    const defaultLocation = { lat: 35.6762, lon: 139.6503 };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied/failed, using default location.");
          loadWeather(defaultLocation.lat, defaultLocation.lon);
        },
        { timeout: 10000 }
      );
    } else {
      loadWeather(defaultLocation.lat, defaultLocation.lon);
    }
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
          <span className="font-mono text-cyan-400 animate-pulse text-sm tracking-widest uppercase">Acquiring_Data...</span>
        </div>
      </div>
    );
  }

  const currentCondition = getWeatherCondition(data.current.weatherCode);
  const CurrentIcon = IconMap[currentCondition.icon] || Cloud;

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Background Atmospheric Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Top Navigation Bar */}
      <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-black/40 border-b border-white/10 backdrop-blur-md z-10 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tighter text-cyan-400">MY WEATHER</h1>
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-60 -mt-1 font-mono">Presented by RVK EDITION</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-mono uppercase">{data.location}</div>
            <div className="text-[10px] opacity-50 uppercase tracking-widest">Live Tracking</div>
          </div>
          <div className="w-10 h-10 rounded-full border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 z-10 overflow-auto">
        
        {/* Left Section: Hero Weather & Grid */}
        <section className="flex-1 flex flex-col gap-6">
          {/* Real-time Digital Clock & Status Panel */}
          <div className="h-auto md:h-40 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden gap-6">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 border border-cyan-500/30 rounded-full text-[10px] bg-cyan-500/10 text-cyan-300">SYSTEM ACTIVE</span>
            </div>
            <div>
              <div className="text-5xl font-light tracking-widest font-mono">
                {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                <span className="text-xl opacity-40 ml-2">{time.getSeconds().toString().padStart(2, '0')}S</span>
              </div>
              <div className="text-xs text-cyan-400 uppercase tracking-widest mt-1">
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} • Local Node
              </div>
            </div>
            <div className="text-left md:text-right flex flex-col items-start md:items-end z-10">
              <div className="text-7xl font-thin tracking-tighter text-white flex items-center gap-4">
                <CurrentIcon className="w-12 h-12 text-cyan-400 hidden sm:block" />
                {Math.round(data.current.temperature)}°<span className="text-2xl text-cyan-400">C</span>
              </div>
              <div className="text-sm uppercase tracking-widest text-white/60 mt-1 md:mt-0">{currentCondition.label}</div>
            </div>
          </div>

          {/* Detailed Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-cyan-400">Humidity</span>
              <div className="text-3xl font-mono mt-4 mb-4">{data.current.humidity}<span className="text-sm opacity-50">%</span></div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-auto">
                <div className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" style={{ width: `${data.current.humidity}%` }}></div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md p-6 flex flex-col justify-between hover:border-purple-400/40 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-purple-400">Wind Velocity</span>
              <div className="text-3xl font-mono mt-4 mb-4">{data.current.windSpeed}<span className="text-sm opacity-50 ml-1">km/h</span></div>
              <div className="text-[10px] opacity-40 uppercase mt-auto">Local Sensor Data</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md p-6 flex flex-col justify-between hover:border-yellow-400/40 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-yellow-400">Index ID</span>
              <div className="text-3xl font-mono mt-4 mb-4">{data.current.weatherCode}<span className="text-sm opacity-50 ml-1">WMO</span></div>
              <div className="text-[10px] opacity-40 uppercase mt-auto">Condition Code</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md p-6 flex flex-col justify-between col-span-1 md:col-span-2 hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-white/50">Temp Range (Today)</span>
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-4">
                <div className="text-4xl font-mono flex items-baseline gap-2">
                  <span className="text-2xl text-cyan-400">L:</span>{Math.round(data.daily.temperatureMin[0])}°<span className="text-sm opacity-50 ml-1">/</span>
                  <span className="text-2xl text-purple-400 ml-2">H:</span>{Math.round(data.daily.temperatureMax[0])}°
                </div>
                <div className="flex-1 h-8 flex items-end gap-1 mb-1 mt-4 sm:mt-0 opacity-80">
                  <div className="w-full h-[20%] bg-cyan-950 border border-cyan-500/20"></div>
                  <div className="w-full h-[40%] bg-cyan-950 border border-cyan-500/20"></div>
                  <div className="w-full h-[60%] bg-cyan-500/40 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]"></div>
                  <div className="w-full h-[30%] bg-cyan-950 border border-cyan-500/20"></div>
                  <div className="w-full h-[15%] bg-cyan-950 border border-cyan-500/20"></div>
                </div>
              </div>
            </div>
            <div className="bg-cyan-500 border border-cyan-300 rounded-3xl p-6 flex flex-col items-center justify-center text-black text-center shadow-[0_0_30px_rgba(6,182,212,0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2 z-10">Status</div>
              <div className="text-xs leading-tight font-bold z-10">Data synchronized with remote server. Local node active.</div>
            </div>
          </div>
        </section>

        {/* Right Section: 5-Day Forecast */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <div className="px-4 flex items-center justify-between mt-2 lg:mt-0">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">5-Day Forecast</h2>
            <div className="w-12 h-[1px] bg-white/20"></div>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {data.daily.time.slice(1, 6).map((day, i) => {
              const condition = getWeatherCondition(data.daily.weatherCode[i + 1]);
              const DayIcon = IconMap[condition.icon] || Cloud;
              const d = new Date(day);
              
              const borderColors = ['', 'border-l-purple-500', '', 'border-l-cyan-500', ''];
              const textColors = ['', 'text-purple-400', '', 'text-cyan-400', ''];

              return (
                <div key={day} className={`flex-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-4 flex items-center justify-between transition-colors hover:bg-white/10 min-h-[70px] ${borderColors[i]}`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-40 uppercase font-bold text-white">
                      {d.toLocaleDateString(undefined, { weekday: 'long' })}
                    </span>
                    <span className="text-lg font-mono flex items-center gap-2">
                       <DayIcon className="w-4 h-4 opacity-70" />
                       {condition.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-light ${textColors[i] || 'text-white'}`}>
                      {Math.round(data.daily.temperatureMax[i + 1])}°
                    </span>
                    <span className="text-[10px] block opacity-40">L: {Math.round(data.daily.temperatureMin[i + 1])}°</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="h-12 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2 group mt-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Advanced Analysis</span>
            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
          </button>
        </aside>
      </main>

      {/* Bottom Status Rail */}
      <footer className="h-8 bg-cyan-950/20 backdrop-blur-sm border-t border-white/10 flex items-center px-4 md:px-8 justify-between shrink-0 z-10 hidden sm:flex">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest hidden md:block">Data Uplink: Stable</span>
          </div>
          <div className="flex items-center gap-2 hidden md:flex">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Latency: 24ms</span>
          </div>
        </div>
        <div className="text-[10px] text-white/20 uppercase font-mono tracking-widest">
          Build v1.0.42_RVK
        </div>
      </footer>
    </div>
  );
}
