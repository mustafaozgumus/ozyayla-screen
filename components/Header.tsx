import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative z-20 w-full px-8 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Logo Element */}
        <div className="relative w-8 h-10 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(229,9,20,0.6)] bg-gradient-to-br from-brand-red to-red-900">
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/30"></div>
           <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/20 transform -skew-x-12"></div>
        </div>
        
        <div>
           <h1 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
             Özyayla İlk-Ortaokulu
           </h1>
           <span className="text-[10px] text-brand-red font-bold tracking-[0.2em] uppercase">Bilgi Ekranı</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
            Canlı Sistem
        </span>
        <span className="hidden md:inline">v2.0 React</span>
      </div>
    </header>
  );
};

export default Header;
