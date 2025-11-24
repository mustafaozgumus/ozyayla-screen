import React, { useEffect, useState } from 'react';
import { getSchedule } from '../services/dataService';
import { LessonRow } from '../types';

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<LessonRow[]>([]);
  const [dayName, setDayName] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const rows = await getSchedule();
        const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
        setDayName(today);
        
        const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const key = normalize(today);

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
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-brand-red to-brand-softRed shadow-[0_0_10px_rgba(229,9,20,0.5)]"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Ders Programı</h3>
        </div>
        <span className="text-[10px] font-bold px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-slate-400 uppercase">
          {dayName}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              {['Sınıf', '1', '2', '3', '4', '5', '6', '7'].map((h, i) => (
                <th key={i} className="text-[10px] font-bold text-slate-500 uppercase pb-2 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.length === 0 ? (
                 <tr>
                     <td colSpan={8} className="text-center py-8 text-sm text-slate-500 italic">
                         Bugün için ders programı bulunamadı.
                     </td>
                 </tr>
            ) : (
                schedule.map((row, idx) => (
                <tr key={idx} className="group hover:-translate-y-0.5 transition-transform duration-200">
                    <td className="bg-gradient-to-br from-brand-red to-brand-softRed text-white font-bold text-xs text-center py-2 px-2 rounded-l-lg shadow-lg shadow-red-900/20">
                    {row.SINIF}
                    </td>
                    {[row['1'], row['2'], row['3'], row['4'], row['5'], row['6'], row['7']].map((lesson, i, arr) => (
                    <td key={i} className={`bg-slate-800/80 text-xs text-slate-300 font-medium text-center py-2 px-1 border-t border-b border-slate-700/50 ${i === arr.length - 1 ? 'rounded-r-lg border-r' : ''}`}>
                        {lesson || '-'}
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
