import React from 'react';
import Header from './Header';
import WeatherCard from './WeatherCard';
import ClockCard from './ClockCard';
import { AnnouncementsList, Birthdays, DutyTeachers, SpecialEvents } from './InfoLists';
import NewsSlider from './NewsSlider';
import Schedule from './Schedule';

const Dashboard: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans text-slate-100 selection:bg-none cursor-none">
      
      {/* Modern Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 mesh-bg"></div>
      
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
      </div>

      <Header />

      <main className="relative z-10 flex-1 px-6 pb-4 pt-1 overflow-hidden">
        <div className="w-full h-full max-w-[1120px] mx-auto grid grid-cols-10 gap-2">
          
          {/* Sol Kolon */}
          <div className="col-span-2 flex flex-col gap-2 h-full">
            <div className="h-[28%] shrink-0"><WeatherCard /></div>
            <div className="h-[42%] shrink-0"><ClockCard /></div>
            <div className="h-[26%] shrink-0"><Birthdays /></div>
          </div>

          {/* Orta Kolon */}
          <div className="col-span-6 flex flex-col gap-2 h-full">
            <div className="w-full shrink-0"><NewsSlider /></div>
            <div className="flex-1 min-h-0"><Schedule /></div>
          </div>

          {/* Sağ Kolon */}
          <div className="col-span-2 flex flex-col gap-2 h-full">
             <div className="h-[55%] shrink-0"><DutyTeachers /></div>
             <div className="h-[25%] shrink-0"><AnnouncementsList /></div>
             <div className="h-[15%] shrink-0"><SpecialEvents /></div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;