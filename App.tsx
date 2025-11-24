import React from 'react';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import ClockCard from './components/ClockCard';
import { Birthdays, DutyTeachers, SpecialEvents } from './components/InfoLists';
import NewsSlider from './components/NewsSlider';
import Schedule from './components/Schedule';

const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden flex flex-col font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-red/20 blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-float-slow" style={{animationDelay: '-5s'}}></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px] animate-pulse-slow"></div>
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
      </div>

      <Header />

      {/* Main Grid Content */}
      <main className="relative z-10 flex-1 p-6">
        <div className="w-full h-full max-w-[1800px] mx-auto grid grid-cols-12 grid-rows-[auto_1fr] gap-6">
          
          {/* Left Column (Weather & Clock) */}
          <div className="col-span-3 flex flex-col gap-6">
            <div className="h-48">
              <WeatherCard />
            </div>
            <div className="flex-1">
               <ClockCard />
            </div>
            <div className="flex-1">
               <Birthdays />
            </div>
          </div>

          {/* Middle Column (News & Schedule) */}
          <div className="col-span-6 flex flex-col gap-6">
            <div className="w-full">
              <NewsSlider />
            </div>
            <div className="flex-1 min-h-0">
              <Schedule />
            </div>
          </div>

          {/* Right Column (Duties & Events) */}
          <div className="col-span-3 flex flex-col gap-6">
             <div className="flex-1">
              <DutyTeachers />
             </div>
             <div className="h-48">
              <SpecialEvents />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
