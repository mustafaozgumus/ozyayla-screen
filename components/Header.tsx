import React from 'react';
import { School, Wifi } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="relative z-20 w-full px-6 pt-6 pb-2">
      <header className="max-w-[1800px] mx-auto bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-5">
          {/* Logo Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-red blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
               <div className="absolute top-0 right-0 w-8 h-8 bg-brand-red/20 rounded-full blur-md -mr-2 -mt-2"></div>
               <School className="text-brand-red w-6 h-6 z-10" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
              ÖZYAYLA
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 tracking-[0.2em] uppercase">İlk & Ortaokulu</span>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest bg-brand-red/10 px-1.5 py-0.5 rounded border border-brand-red/20">
                Bilgi Ekranı
              </span>
            </div>
          </div>
        </div>

        {/* Center: Decorative or Motto (Optional, keeping it clean for now) */}
        
        {/* Right: Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Eğitim Öğretim Yılı</span>
            <span className="text-xs text-slate-200 font-bold tracking-wide">2024 - 2025</span>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              Canlı
            </span>
            <Wifi size={14} className="text-slate-500 ml-1" />
          </div>
        </div>

      </header>
    </div>
  );
};

export default Header;