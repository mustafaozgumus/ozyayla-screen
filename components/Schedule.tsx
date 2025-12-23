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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Ders Programı</h3>
        </div>
        <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-800/50 rounded-full border border-white/5 text-slate-400 uppercase tracking-widest">
          {dayName}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md">
            <tr>
              <th className="text-[9px] font-bold text-slate-500 uppercase pb-2 text-center w-12">SINIF</th>
              {['1', '2', '3', '4', '5', '6', '7'].map((h, i) => (
                <th key={i} className="text-[9px] font-bold text-slate-500 uppercase pb-2 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {schedule.length === 0 ? (
                 <tr>
                     <td colSpan={8} className="text-center py-8 text-xs text-slate-500 italic">
                         Bugün ders yok.
                     </td>
                 </tr>
            ) : (
                schedule.map((row, idx) => (
                <tr key={idx} className="group border-b border-white/5 last:border-0">
                    <td className="py-1 px-0.5">
                      <div className="bg-gradient-to-br from-brand-red to-brand-softRed text-white font-bold text-center rounded-md shadow-lg shadow-red-900/20 py-1.5 text-[10px]">
                        {row.SINIF}
                      </div>
                    </td>
                    {[row['1'], row['2'], row['3'], row['4'], row['5'], row['6'], row['7']].map((lesson, i) => (
                    <td key={i} className="text-slate-300 font-medium text-center align-middle p-0.5">
                        <div className={`
                            flex items-center justify-center rounded-md py-1.5 px-0.5 min-h-[28px]
                            ${idx % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'} 
                            group-hover:bg-slate-700/30 transition-colors
                        `}>
                          <div className="line-clamp-1 text-[10px] tracking-tight">
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