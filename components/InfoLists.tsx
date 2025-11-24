import React, { useEffect, useState } from 'react';
import { getBirthdays, getDuties, getEvents, parseDateStr } from '../services/dataService';
import { BirthdayRow, DutyRow, EventRow } from '../types';
import { Cake, Calendar, UserCheck } from 'lucide-react';

const ListContainer: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, color?: string }> = ({ title, icon, children, color = "bg-slate-800" }) => (
  <div className="glass-panel rounded-3xl p-4 h-full flex flex-col">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h3>
    </div>
    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {children}
    </div>
  </div>
);

export const DutyTeachers: React.FC = () => {
  const [list, setList] = useState<{loc: string, name: string}[]>([]);

  useEffect(() => {
    getDuties().then(rows => {
      const today = new Date();
      // Reset time to compare dates only
      today.setHours(0,0,0,0);
      
      const found = rows.find(r => {
        const d = parseDateStr(r.TARİH);
        if (!d) return false;
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
      });

      if (found) {
        const entries: {loc: string, name: string}[] = [];
        Object.keys(found).forEach(k => {
          if (k !== 'TARİH' && found[k]) {
            entries.push({ loc: k, name: found[k] });
          }
        });
        setList(entries);
      }
    });
  }, []);

  return (
    <ListContainer title="Nöbetçi Öğretmenler" icon={<UserCheck size={16} className="text-yellow-400" />}>
      {list.length === 0 ? (
          <div className="text-center text-xs text-slate-500 mt-4">Nöbetçi bilgisi yok</div>
      ) : (
          list.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.loc}</span>
                <span className="text-xs font-bold text-yellow-500 text-right">{item.name}</span>
            </div>
          ))
      )}
    </ListContainer>
  );
};

export const Birthdays: React.FC = () => {
  const [list, setList] = useState<BirthdayRow[]>([]);

  useEffect(() => {
    getBirthdays().then(rows => {
        const today = new Date();
        const tM = today.getMonth();
        const tD = today.getDate();

        const matches = rows.filter(r => {
            const d = parseDateStr(r['DOĞUM TARİHİ']);
            if (!d) return false;
            return d.getMonth() === tM && d.getDate() === tD;
        });
        setList(matches);
    });
  }, []);

  return (
    <ListContainer title="Doğum Günleri" icon={<Cake size={16} className="text-pink-400" />}>
      {list.length === 0 ? (
         <div className="text-center text-xs text-slate-500 mt-4">Bugün doğum günü yok</div>
      ) : (
        <>
        <div className="bg-gradient-to-r from-pink-500/20 to-transparent p-2 rounded-lg mb-2 flex items-center gap-2">
            <span className="text-[10px] text-pink-200 font-bold uppercase">🎂 İyi ki doğdunuz!</span>
        </div>
        {list.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                <span className="text-xs font-bold text-slate-200">{item['AD SOYAD']}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">{item.SINIF}</span>
            </div>
        ))}
        </>
      )}
    </ListContainer>
  );
};

export const SpecialEvents: React.FC = () => {
    const [list, setList] = useState<EventRow[]>([]);
  
    useEffect(() => {
      getEvents().then(rows => {
          const today = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
  
          // Filter next 7 days
          const matches = rows.filter(r => {
              const d = parseDateStr(r.TARİH);
              if (!d) return false;
              // Reset hours for comparison
              const dTime = d.setHours(0,0,0,0);
              const tTime = new Date().setHours(0,0,0,0);
              const nTime = nextWeek.setHours(0,0,0,0);
              return dTime >= tTime && dTime <= nTime;
          }).slice(0, 3); // Limit to 3

          setList(matches);
      });
    }, []);
  
    return (
      <ListContainer title="Özel Günler" icon={<Calendar size={16} className="text-green-400" />}>
        {list.length === 0 ? (
           <div className="text-center text-xs text-slate-500 mt-4">Yakın tarihte özel gün yok</div>
        ) : (
          list.map((item, i) => (
              <div key={i} className="flex flex-col bg-slate-800/30 p-2 rounded-lg border border-slate-700/30">
                  <span className="text-xs font-bold text-slate-200">{item['ÖZEL GÜN ADI']}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{item.TARİH}</span>
              </div>
          ))
        )}
      </ListContainer>
    );
  };
