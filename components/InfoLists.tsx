import React, { useEffect, useState } from 'react';
import { getBirthdays, getDuties, getEvents, parseDateStr } from '../services/dataService';
import { BirthdayRow, DutyRow, EventRow } from '../types';
import { Cake, Calendar, Megaphone, UserCheck, AlertCircle } from 'lucide-react';
import { USER_CONFIG } from '../userConfig';

const ListContainer: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, color?: string }> = ({ title, icon, children, color = "bg-slate-800" }) => (
  <div className="glass-panel rounded-3xl p-5 h-full flex flex-col">
    <div className="flex items-center gap-3 mb-3 pb-2 border-b border-white/5 shrink-0">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h3>
    </div>
    <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {children}
    </div>
  </div>
);

export const DutyTeachers: React.FC = () => {
  const [list, setList] = useState<{loc: string, name: string}[]>([]);

  useEffect(() => {
    getDuties().then(rows => {
      const today = new Date();
      
      const found = rows.find(r => {
        const d = parseDateStr(r.TARİH);
        if (!d) return false;
        // Compare Day, Month, Year individually to avoid Timezone/Hour issues on TV browsers
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
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
    <ListContainer title="Nöbetçi Öğretmenler" icon={<UserCheck size={18} className="text-yellow-400" />}>
      {list.length === 0 ? (
          <div className="text-center text-xs text-slate-500 mt-4">Bugün için nöbetçi bilgisi girilmemiş.</div>
      ) : (
          list.map((item, i) => (
            <div key={i} className="flex flex-col py-2 border-b border-slate-700/30 last:border-0">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.loc}</span>
                <span className="text-xs font-bold text-yellow-500/90">{item.name}</span>
            </div>
          ))
      )}
    </ListContainer>
  );
};

export const AnnouncementsList: React.FC = () => {
    // Sadece userConfig'den gelen veriyi kullanıyoruz
    const list = USER_CONFIG.MANUAL_ANNOUNCEMENTS || [];

    return (
        <ListContainer title="Duyuru Panosu" icon={<Megaphone size={18} className="text-blue-400" />}>
            {list.length === 0 ? (
                <div className="text-center text-xs text-slate-500 mt-4 italic">Aktif duyuru bulunmamaktadır.</div>
            ) : (
                list.map((item, i) => (
                    <div key={item.id || i} className={`flex items-start gap-3 py-2.5 border-b border-slate-700/30 last:border-0 ${item.important ? 'text-red-200' : 'text-slate-300'}`}>
                        {item.important ? (
                           <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-500 animate-pulse" />
                        ) : (
                           <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        )}
                        <span className="text-[11px] font-medium leading-snug">
                            {item.title}
                        </span>
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
    <ListContainer title="Doğum Günleri" icon={<Cake size={18} className="text-pink-400" />}>
      {list.length === 0 ? (
         <div className="text-center text-xs text-slate-500 mt-4">Bugün doğum günü yok</div>
      ) : (
        <>
        <div className="bg-gradient-to-r from-pink-500/20 to-transparent p-2.5 rounded-xl mb-3 flex items-center gap-2 border border-pink-500/10">
            <span className="text-[10px] text-pink-200 font-bold uppercase tracking-wide">🎂 İyi ki doğdunuz!</span>
        </div>
        {list.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50 mb-2">
                <span className="text-xs font-bold text-slate-200">{item['AD SOYAD']}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2 py-1 rounded-md">{item.SINIF}</span>
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
      <ListContainer title="Özel Günler" icon={<Calendar size={18} className="text-green-400" />}>
        {list.length === 0 ? (
           <div className="text-center text-xs text-slate-500 mt-4">Yakın tarihte özel gün yok</div>
        ) : (
          list.map((item, i) => (
              <div key={i} className="flex flex-col bg-slate-800/30 p-2.5 rounded-xl border border-slate-700/30 mb-2 last:mb-0">
                  <span className="text-xs font-bold text-slate-200">{item['ÖZEL GÜN ADI']}</span>
                  <span className="text-[10px] text-slate-500 mt-1 font-medium">{item.TARİH}</span>
              </div>
          ))
        )}
      </ListContainer>
    );
  };