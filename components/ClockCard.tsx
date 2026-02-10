
import React, { useState, useEffect } from 'react';
import { Clock, Bell, BookOpen, Coffee, Moon, Sunrise, Timer, Calendar } from 'lucide-react';
import { LessonStatus } from '../types';
import { useConfig } from '../contexts/ConfigContext';

const weekdayBellTimes = [
  "08:50","09:30", "09:45","10:25", "10:45","11:25", 
  "11:40","12:20", "13:05","13:45", "14:00","14:40", "14:55","15:35"
];

const fridayBellTimes = [
  "08:50","09:30", "09:45","10:25", "10:45","11:25", 
  "11:40","12:20", "13:15","13:55", "14:05","14:45", "14:55","15:35"
];

const calculateStatus = (now: Date, customBellTimes?: string[]) => {
  const isFriday = now.getDay() === 5;
  // Use admin provided bell times if available, otherwise use defaults
  const bellTimes = (customBellTimes && customBellTimes.length >= 14) 
    ? customBellTimes 
    : (isFriday ? fridayBellTimes : weekdayBellTimes);

  const times = bellTimes.map(t => {
    const [h, m] = t.split(':').map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  });

  const nextBell = times.find(t => t > now) || null;
  let lastBell = null;
  let lastIndex = -1;

  times.forEach((t, i) => {
    if (t <= now) {
        lastIndex = i;
        lastBell = t;
    }
  });

  let label = '';
  let type: LessonStatus['type'] = 'break';
  let dersNo = 0;
  let progress = 0;

  if (lastIndex === -1) {
    label = "Dersler Başlamadı";
    type = 'before';
  } else if (lastIndex === times.length - 1 && (!nextBell)) {
    label = "Dersler Bitti";
    type = 'after';
  } else if (lastIndex === 9 && isFriday && !customBellTimes) {
    label = "Öğle Arası";
    type = 'break';
  } else if (lastIndex % 2 === 0) {
    dersNo = Math.floor(lastIndex / 2) + 1;
    label = `${dersNo}. Ders`;
    type = 'class';
  } else {
    label = "Teneffüs";
    type = 'break';
  }

  if (lastBell && nextBell) {
      const total = nextBell.getTime() - lastBell.getTime();
      const elapsed = now.getTime() - lastBell.getTime();
      progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  let isAlert = false;
  if (nextBell) {
      const diff = (nextBell.getTime() - now.getTime()) / 1000;
      if (diff < 60 && diff > 0) isAlert = true; 
  }

  return { label, type, dersNo, isAlert, nextBellTime: nextBell, progress };
};

const ClockCard: React.FC = () => {
  const { settings } = useConfig();
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<ReturnType<typeof calculateStatus> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setStatus(calculateStatus(now, settings.bellTimes));
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.bellTimes]);

  if (!status) return null;

  const timeLeftStr = status.nextBellTime ? (() => {
    const diff = Math.floor((status.nextBellTime.getTime() - time.getTime()) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  })() : null;

  const getStatusIcon = () => {
    switch (status.type) {
      case 'class': return <BookOpen className="text-brand-primary" size={22} />;
      case 'break': return <Coffee className="text-orange-400" size={22} />;
      case 'before': return <Sunrise className="text-blue-400" size={22} />;
      case 'after': return <Moon className="text-slate-500" size={22} />;
      default: return <Clock size={22} />;
    }
  };

  return (
    <div className={`glass-panel relative flex flex-col h-full rounded-[2.5rem] p-6 overflow-hidden transition-all duration-500 border-2 ${status.isAlert ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_50px_rgba(239,68,68,0.15)]' : 'border-white/5'}`}>
      
      <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${status.isAlert ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-brand-primary shadow-[0_0_10px_#3b82f6]'}`}
          style={{ width: `${status.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-0.5">
            <Calendar size={12} className="opacity-60" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {time.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {time.toLocaleDateString('tr-TR', { weekday: 'long' })}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-slate-900/60 shadow-inner flex items-center justify-center border border-white/5">
          {getStatusIcon()}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="text-6xl font-black tracking-tighter tabular-nums text-white drop-shadow-2xl flex items-baseline">
            {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            <span className="text-2xl text-brand-primary/60 ml-1 font-bold animate-pulse">:</span>
            <span className="text-2xl text-slate-500 font-bold">
              {time.toLocaleTimeString('tr-TR', { second: '2-digit' })}
            </span>
          </div>
          <div className={`absolute inset-0 blur-3xl opacity-20 -z-10 transition-colors duration-1000 ${status.isAlert ? 'bg-red-600' : 'bg-brand-primary'}`}></div>
        </div>

        <div className={`mt-5 px-6 py-2 rounded-full flex items-center gap-3 border transition-all duration-500 ${
            status.isAlert 
            ? 'bg-red-600 text-white border-red-500 shadow-xl shadow-red-900/40 animate-bounce' 
            : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-sm'
        }`}>
            <Bell size={14} className={status.type === 'class' ? 'animate-ring' : ''} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                {status.label}
            </span>
        </div>
      </div>

      <div className="mt-6">
        {status.nextBellTime ? (
          <div className="bg-slate-950/60 backdrop-blur-xl rounded-[2rem] p-4 flex items-center justify-between border border-white/5 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                {status.type === 'class' ? 'ZİLE KALAN' : 'DERSE KALAN'}
              </span>
              <span className={`text-3xl font-black tabular-nums leading-none tracking-tighter ${status.isAlert ? 'text-red-400' : 'text-slate-100'}`}>
                {timeLeftStr}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${status.isAlert ? 'bg-red-950 text-red-500 animate-pulse' : 'bg-slate-800/80 text-brand-primary border border-white/5'}`}>
              <Timer size={24} className={status.isAlert ? 'animate-spin' : ''} />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-brand-primary to-brand-dark text-white rounded-[2rem] p-5 flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/20 border border-white/10">
             <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Moon size={22} className="text-yellow-300 fill-yellow-300" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Bugünlük Bu Kadar</span>
                <span className="text-sm font-bold tracking-wide">İyi Dinlenmeler!</span>
             </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ring {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
        .animate-ring { animation: ring 0.5s ease infinite; }
      `}} />
    </div>
  );
};

export default ClockCard;
