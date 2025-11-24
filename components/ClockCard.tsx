import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { LessonStatus } from '../types';

// Bell Schedules
const weekdayBellTimes = [
  "08:50","09:30", "09:45","10:25", "10:45","11:25", 
  "11:40","12:20", "13:05","13:45", "14:00","14:40", "14:55","15:35"
];

const fridayBellTimes = [
  "08:50","09:30", "09:45","10:25", "10:45","11:25", 
  "11:40","12:20", "13:15","13:55", "14:05","14:45", "14:55","15:35"
];

const getBellTimesForDate = (date: Date) => {
  return date.getDay() === 5 ? fridayBellTimes : weekdayBellTimes;
};

const calculateStatus = (now: Date): LessonStatus => {
  const timesStr = getBellTimesForDate(now);
  const times = timesStr.map(t => {
    const [h, m] = t.split(':').map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  });

  // Find next bell
  const nextBell = times.find(t => t > now) || null;

  // Determine current period index
  let lastIndex = -1;
  times.forEach((t, i) => {
    if (t <= now) lastIndex = i;
  });

  let label = '';
  let type: LessonStatus['type'] = 'break';
  let dersNo = 0;

  if (lastIndex === -1) {
    label = "Bugünkü dersler henüz başlamadı";
    type = 'before';
  } else if (lastIndex === times.length - 1 && (!nextBell)) {
    label = "Bugünkü dersler bitti";
    type = 'after';
  } else if (lastIndex % 2 === 0) {
    // Even index in this array means start of a lesson (0=Lesson 1 Start, 1=Lesson 1 End)
    // Wait, array is [Start1, End1, Start2, End2...]
    // Index 0 passed -> Inside Lesson 1
    // Index 1 passed -> Inside Break 1
    dersNo = Math.floor(lastIndex / 2) + 1;
    label = `Şu an derste • ${dersNo}. Ders`;
    type = 'class';
  } else {
    label = "Şu an teneffüste";
    type = 'break';
  }

  // Alert logic: if next bell is within 10 seconds? (Original code used a change timestamp)
  // Let's make it simple: if countdown < 1 minute, turn yellow/alert
  let isAlert = false;
  if (nextBell) {
      const diff = (nextBell.getTime() - now.getTime()) / 1000;
      if (diff < 60 && diff > 0) isAlert = true; 
  }

  return { label, type, dersNo, isAlert, nextBellTime: nextBell };
};

const ClockCard: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<LessonStatus | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setStatus(calculateStatus(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!status) return null;

  const timeLeftStr = status.nextBellTime ? (() => {
    const diff = Math.floor((status.nextBellTime.getTime() - time.getTime()) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m} DK ${s.toString().padStart(2, '0')} SN`;
  })() : '--';

  return (
    <div className={`glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${status.isAlert ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]' : ''}`}>
      <Clock className="w-8 h-8 text-brand-softRed mb-2 opacity-80" />
      <div className="text-4xl font-black tracking-widest tabular-nums leading-none">
        {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 mb-4">
        {time.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-3 transition-colors ${
        status.isAlert ? 'bg-yellow-500 text-yellow-950 animate-pulse' : 'bg-slate-800 text-slate-200 border border-slate-700'
      }`}>
        {status.label}
      </div>

      {status.nextBellTime && (
        <div className="flex flex-col animate-fade-in">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">SONRAKİ ZİLE KALAN</span>
          <span className="text-2xl font-black text-white tabular-nums tracking-wide">{timeLeftStr}</span>
        </div>
      )}
    </div>
  );
};

export default ClockCard;
