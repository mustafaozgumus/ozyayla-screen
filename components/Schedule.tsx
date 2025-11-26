import React, { useEffect, useState } from 'react';
import { getSchedule } from '../services/dataService';
import { LessonRow } from '../types';

// Manual day mapping to avoid TV browser locale issues (e.g. "Monday" vs "Pazartesi")
const DAYS_TR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<LessonRow[]>([]);
  const [dayName, setDayName] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const rows = await getSchedule();
        
        // Use getDay() which returns 0-6, independent of system language
        const dayIndex = new Date().getDay();
        const todayTR = DAYS_TR[dayIndex];
        
        setDayName(todayTR);
        
        // Proper Turkish normalization for key matching
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
    <div className="glass-panel rounded-3xl p-5 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-5 rounded-full bg-brand-red shadow-[0_0_10px_rgba(229,9,20,0.6)]"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Ders Programı</h3>
        </div>
        <span className="text-[10px] font-bold px-3 py-1 bg-slate-800/50 rounded-full border border-white/5 text-slate-400 uppercase tracking-widest">
          {dayName}
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="text-[10px] font-bold text-slate-500 uppercase pb-3 text-center w-14">Sınıf</th>
              {['1', '2', '3', '4', '5', '6', '7'].map((h, i) => (
                <th key={i} className="text-[10px] font-bold text-slate-500 uppercase pb-3 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {schedule.length === 0 ? (
                 <tr>
                     <td colSpan={8} className="text-center py-10 text-sm text-slate-500 italic">
                         Ders programı yükleniyor veya bugün ders yok.
                     </td>
                 </tr>
            ) : (
                schedule.map((row, idx) => (
                <tr key={idx} className="group border-b border-transparent last:border-0">
                    {/* Sınıf Adı */}
                    <td className="py-1.5 px-1">
                      <div className="bg-gradient-to-br from-brand-red to-brand-softRed text-white font-bold text-center rounded-lg shadow-lg shadow-red-900/20 py-2 text-[11px]">
                        {row.SINIF}
                      </div>
                    </td>
                    {/* Dersler */}
                    {[row['1'], row['2'], row['3'], row['4'], row['5'], row['6'], row['7']].map((lesson, i) => (
                    <td key={i} className="text-slate-300 font-medium text-center align-middle p-1">
                        <div className={`
                            flex items-center justify-center rounded-lg py-2 px-1 min-h-[32px]
                            ${idx % 2 === 0 ? 'bg-slate-800/30' : 'bg-transparent'} 
                            group-hover:bg-slate-700/30 transition-colors
                        `}>
                          <div className="line-clamp-1 text-[11px] tracking-tight">
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