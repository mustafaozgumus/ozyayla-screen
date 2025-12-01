
import React from 'react';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import ClockCard from './components/ClockCard';
import { AnnouncementsList, Birthdays, DutyTeachers, SpecialEvents } from './components/InfoLists';
import NewsSlider from './components/NewsSlider';
import Schedule from './components/Schedule';

const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans text-slate-100 selection:bg-none cursor-none">
      
      {/* Modern Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 mesh-bg"></div>
      
      {/* Noise Overlay for Texture */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
      </div>

      <Header />

      {/* Main Grid Content */}
      <main className="relative z-10 flex-1 px-6 pb-4 pt-1 overflow-hidden">
        {/* Max width constrained to safe area */}
        <div className="w-full h-full max-w-[1120px] mx-auto grid grid-cols-10 gap-2">
          
          {/* Left Column (Weather & Clock) - 2 units */}
          <div className="col-span-2 flex flex-col gap-2 h-full">
            {/* Hava Durumu - Increased for hourly data */}
            <div className="h-[28%] shrink-0">
              <WeatherCard />
            </div>
            {/* Saat - Fixed percentage to prevent overlap */}
            <div className="h-[42%] shrink-0">
               <ClockCard />
            </div>
            {/* Doğum Günleri - Fills rest */}
            <div className="h-[26%] shrink-0">
               <Birthdays />
            </div>
          </div>

          {/* Middle Column (News & Schedule) - 6 units */}
          <div className="col-span-6 flex flex-col gap-2 h-full">
            {/* News Slider - Fixed height ratio approx 16:9 relative to width */}
            <div className="w-full shrink-0">
              <NewsSlider />
            </div>
            {/* Schedule fills remaining space */}
            <div className="flex-1 min-h-0">
              <Schedule />
            </div>
          </div>

          {/* Right Column (Duties, Announcements, Events) - 2 units */}
          <div className="col-span-2 flex flex-col gap-2 h-full">
             {/* Duty Teachers - Massive height increase to prevent scroll */}
             <div className="h-[55%] shrink-0">
                <DutyTeachers />
             </div>
             
             {/* Announcements - Reduced height since it is often empty or short */}
             <div className="h-[25%] shrink-0">
                <AnnouncementsList />
             </div>

             {/* Special Events - Small fixed height at bottom */}
             <div className="h-[15%] shrink-0">
                <SpecialEvents />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
