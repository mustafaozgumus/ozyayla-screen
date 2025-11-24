import React, { useEffect, useState } from 'react';
import { getWeather } from '../services/dataService';
import { WeatherData } from '../types';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';

const WeatherCard: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    getWeather().then(setData).catch(console.error);
    const interval = setInterval(() => getWeather().then(setData).catch(console.error), 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  const getIcon = (code: number, size = 24) => {
    // WMO Weather interpretation codes (WW)
    if (code === 0 || code === 1) return <Sun size={size} className="text-yellow-400" />;
    if (code === 2 || code === 3) return <Cloud size={size} className="text-gray-300" />;
    if ([45, 48].includes(code)) return <CloudFog size={size} className="text-gray-400" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={size} className="text-blue-400" />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow size={size} className="text-white" />;
    if ([95, 96, 99].includes(code)) return <CloudLightning size={size} className="text-purple-400" />;
    return <Sun size={size} className="text-yellow-400" />;
  };

  if (!data) return <div className="glass-panel rounded-3xl p-4 h-full animate-pulse bg-slate-800/50"></div>;

  const { current_weather } = data;
  
  // Find next 4 hours
  const now = new Date();
  const currentHourIndex = data.hourly.time.findIndex(t => new Date(t).getHours() === now.getHours());
  // If current hour not found (e.g. data stale), default to 0
  const safeIndex = currentHourIndex === -1 ? 0 : currentHourIndex;

  const nextHours = data.hourly.time.slice(safeIndex + 1, safeIndex + 5).map((t, i) => ({
    time: t,
    temp: data.hourly.temperature_2m[safeIndex + 1 + i],
    code: data.hourly.weathercode[safeIndex + 1 + i]
  }));

  return (
    <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between h-full relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>

      <div className="flex items-center gap-4 z-10">
        <div className="p-3 bg-slate-800/50 rounded-2xl shadow-inner border border-white/5">
            {getIcon(current_weather.weathercode, 40)}
        </div>
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hava Durumu</div>
          <div className="text-3xl font-black leading-none">{Math.round(current_weather.temperature)}°C</div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <Wind size={12} />
            <span>{current_weather.windspeed} km/sa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 z-10">
        {nextHours.map((h, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400 mb-1">
              {new Date(h.time).getHours()}:00
            </span>
            <div className="mb-1">{getIcon(h.code, 16)}</div>
            <span className="text-xs font-bold">{Math.round(h.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;