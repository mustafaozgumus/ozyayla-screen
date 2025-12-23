import React, { useEffect, useState } from 'react';
import { getSchedule } from '../services/dataService';
import { LessonRow } from '../types';

const DAYS_TR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<LessonRow[]>([]);
  const [dayName, setDayName] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const rows = await getSchedule();
        const dayIndex = new Date().getDay();
        const todayTR = DAYS_TR[dayIndex];
        setDayName(todayTR);
        
        const normalize = (s: string) => s.toLocaleLowerCase('tr-TR').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const key = normalize(todayTR);

        const filtered = rows.filter(r => normalize(r.GÜN || '') === key);
        setSchedule(filtered);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-brand-red shadow-[0_0_10px_rgba(229,9,20,0.6)]"></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">DERS PROGRAMI</h3>
        </div>
        <span className="text-[10px] font-black px-3 py-1 bg-brand-red/20 rounded-full border border-brand-red/30 text-brand-softRed uppercase tracking-[0.2em]">
          {dayName}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md">
            <tr>
              <th className="text-[10px] font-black text-slate-500 uppercase pb-3 text-center w-14 tracking-tighter">SINIF</th>
              {['1', '2', '3', '4', '5', '6', '7'].map((h, i) => (
                <th key={i} className="text-[10px] font-black text-slate-500 uppercase pb-3 text-center tracking-tighter">
                  {h}. SAAT
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {schedule.length === 0 ? (
                 <tr>
                     <td colSpan={8} className="text-center py-12 text-sm text-slate-500 font-bold italic">
                         Bugün için kayıtlı ders programı bulunamadı.
                     </td>
                 </tr>
            ) : (
                schedule.map((row, idx) => (
                <tr key={idx} className="group border-b border-white/5 last:border-0">
                    <td className="py-2 px-1">
                      <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white font-black text-center rounded-lg border border-white/10 shadow-lg py-2.5 text-xs">
                        {row.SINIF}
                      </div>
                    </td>
                    {[row['1'], row['2'], row['3'], row['4'], row['5'], row['6'], row['7']].map((lesson, i) => (
                    <td key={i} className="text-white font-black text-center align-middle p-1">
                        <div className={`
                            flex items-center justify-center rounded-xl py-2.5 px-0.5 min-h-[44px]
                            ${idx % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-800/10'} 
                            group-hover:bg-brand-red/10 group-hover:border-brand-red/20 border border-transparent transition-all duration-300
                        `}>
                          <div className="line-clamp-1 text-[11px] md:text-xs uppercase tracking-tight text-white drop-shadow-sm">
                            {lesson || '-'}
                          </div>
                        </div>
                    </td>
                    ))}
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;