import React from 'react';
import { School, Wifi } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { settings } = useConfig();

  return (
    <div className="relative z-20 w-full px-8 pt-4 pb-2 shrink-0">
      <header className="max-w-[1120px] mx-auto bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-2xl px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-red blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 rounded-lg border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
               <div className="absolute top-0 right-0 w-6 h-6 bg-brand-red/20 rounded-full blur-md -mr-2 -mt-2"></div>
               <School className="text-brand-red w-5 h-5 z-10" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-black tracking-tighter text-white leading-none mb-0.5">
              ÖZYAYLA
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">İlk & Ortaokulu</span>
              <div className="w-0.5 h-0.5 rounded-full bg-slate-600"></div>
              <Link to="/admin" className="cursor-default focus:outline-none">
                <span className="text-[9px] font-bold text-brand-red uppercase tracking-widest bg-brand-red/10 px-1.5 py-px rounded border border-brand-red/20 hover:bg-brand-red/20 transition-colors cursor-pointer">
                  Bilgi Ekranı
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Eğitim Öğretim Yılı</span>
            <span className="text-[11px] text-slate-200 font-bold tracking-wide">{settings.academicYear}</span>
          </div>

          <div className="h-8 w-px bg-white/10 mx-1 hidden md:block"></div>

          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
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