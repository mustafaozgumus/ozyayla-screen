import React, { useEffect, useState } from 'react';
import { getBirthdays, getDuties, getEvents, parseDateStr } from '../services/dataService';
import { BirthdayRow, EventRow } from '../types';
import { Cake, Calendar, Megaphone, UserCheck, AlertCircle } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const ListContainer: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, color?: string }> = ({ title, icon, children, color = "bg-slate-800" }) => (
  <div className="glass-panel rounded-3xl p-3 h-full flex flex-col">
    <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/5 shrink-0">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h3>
    </div>
    <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
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
    <ListContainer title="Nöbetçi Öğretmenler" icon={<UserCheck size={16} className="text-yellow-400" />}>
      {list.length === 0 ? (
          <div className="text-center text-xs text-slate-500 mt-4">Bugün için nöbetçi bilgisi girilmemiş.</div>
      ) : (
          list.map((item, i) => (
            <div key={i} className="flex flex-col py-1.5 border-b border-slate-700/30 last:border-0">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.loc}</span>
                <span className="text-xs font-bold text-yellow-500/90">{item.name}</span>
            </div>
          ))
      )}
    </ListContainer>
  );
};

export const AnnouncementsList: React.FC = () => {
    const { settings, announcements } = useConfig();
    const show = settings.showAnnouncements;

    return (
        <ListContainer title="Duyuru Panosu" icon={<Megaphone size={16} className="text-blue-400" />}>
            {(!show || announcements.length === 0) ? (
                <div className="text-center text-xs text-slate-500 mt-4 italic">
                    {show ? "Aktif duyuru bulunmamaktadır." : "Duyurular şu an kapalı."}
                </div>
            ) : (
                announcements.map((item, i) => (
                    <div key={item.id || i} className={`flex items-start gap-2 py-1.5 border-b border-slate-700/30 last:border-0 ${item.important ? 'text-red-200' : 'text-slate-300'}`}>
                        {item.important ? (
                           <AlertCircle size={12} className="mt-0.5 shrink-0 text-red-500 animate-pulse" />
                        ) : (
                           <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        )}
                        <span className="text-[10px] font-medium leading-snug">
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
    <ListContainer title="Doğum Günleri" icon={<Cake size={16} className="text-pink-400" />}>
      {list.length === 0 ? (
         <div className="text-center text-xs text-slate-500 mt-4">Bugün doğum günü yok</div>
      ) : (
        <>
        <div className="bg-gradient-to-r from-pink-500/20 to-transparent p-1.5 rounded-lg mb-1.5 flex items-center gap-2 border border-pink-500/10">
            <span className="text-[9px] text-pink-200 font-bold uppercase tracking-wide">🎂 İyi ki doğdunuz!</span>
        </div>
        {list.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-800/40 p-1.5 rounded-lg border border-slate-700/50 mb-1">
                <span className="text-[11px] font-bold text-slate-200">{item['AD SOYAD']}</span>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded-md">{item.SINIF}</span>
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
  
          const matches = rows.filter(r => {
              const d = parseDateStr(r.TARİH);
              if (!d) return false;
              const dTime = d.setHours(0,0,0,0);
              const tTime = new Date().setHours(0,0,0,0);
              const nTime = nextWeek.setHours(0,0,0,0);
              return dTime >= tTime && dTime <= nTime;
          }).slice(0, 3); 

          setList(matches);
      });
    }, []);
  
    return (
      <ListContainer title="Özel Günler" icon={<Calendar size={16} className="text-green-400" />}>
        {list.length === 0 ? (
           <div className="text-center text-xs text-slate-500 mt-2">Yakın tarihte özel gün yok</div>
        ) : (
          list.map((item, i) => (
              <div key={i} className="flex flex-col bg-slate-800/30 p-1.5 rounded-lg border border-slate-700/30 mb-1 last:mb-0">
                  <span className="text-[10px] font-bold text-slate-200">{item['ÖZEL GÜN ADI']}</span>
                  <span className="text-[9px] text-slate-500 mt-0.5 font-medium">{item.TARİH}</span>
              </div>
          ))
        )}
      </ListContainer>
    );
  };