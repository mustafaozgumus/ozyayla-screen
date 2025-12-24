
import React from 'react';
import Header from './Header';
import WeatherCard from './WeatherCard';
import ClockCard from './ClockCard';
import { AnnouncementsList, Birthdays, DutyTeachers, SpecialEvents } from './InfoLists';
import NewsSlider from './NewsSlider';
import Schedule from './Schedule';
import { useConfig } from '../contexts/ConfigContext';

const Dashboard: React.FC = () => {
  const { settings } = useConfig();
  const layout = settings.layout!;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans text-slate-100 selection:bg-none cursor-none bg-slate-950">
      
      {/* Modern Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 mesh-bg"></div>
      
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
      </div>

      <Header />

      <main className="relative z-10 flex-1 px-4 pb-4 pt-0 overflow-hidden" style={{ zoom: `${layout.dashboardZoom / 100}` }}>
        <div className="w-full h-full max-w-[99%] mx-auto grid grid-cols-10 gap-4">
          
          {/* Sol Kolon */}
          <div className="col-span-2 flex flex-col gap-4 h-full overflow-hidden">
            <div style={{ height: `${layout.weatherHeight}%` }} className="shrink-0 min-h-[140px]"><WeatherCard /></div>
            <div style={{ height: `${layout.clockHeight}%` }} className="shrink-0 min-h-[180px]"><ClockCard /></div>
            <div className="flex-1 min-h-0"><Birthdays /></div>
          </div>

          {/* Orta Kolon */}
          <div className="col-span-6 flex flex-col gap-4 h-full overflow-hidden">
            <div style={{ height: `${layout.newsHeight}%` }} className="w-full shrink-0 min-h-[200px]"><NewsSlider /></div>
            <div className="flex-1 min-h-0"><Schedule /></div>
          </div>

          {/* Sağ Kolon */}
          <div className="col-span-2 flex flex-col gap-4 h-full overflow-hidden">
             <div style={{ height: `${layout.dutyHeight}%` }} className="shrink-0 min-h-[180px]"><DutyTeachers /></div>
             <div style={{ height: `${layout.announceHeight}%` }} className="shrink-0 min-h-[140px]"><AnnouncementsList /></div>
             <div className="flex-1 min-h-0"><SpecialEvents /></div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
