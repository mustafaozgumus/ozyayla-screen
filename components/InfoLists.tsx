
import React, { useEffect, useState } from 'react';
import { getBirthdays, getEvents, parseDateStr } from '../services/dataService';
import { BirthdayRow, EventRow, DutyRow } from '../types';
import { Cake, Calendar, Megaphone, UserCheck, AlertCircle, Info } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const ListContainer: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, color?: string }> = ({ title, icon, children, color = "bg-slate-800" }) => (
  <div className="glass-panel rounded-3xl p-3.5 h-full flex flex-col overflow-hidden">
    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5 shrink-0">
        <div className="p-1.5 bg-white/5 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">{title}</h3>
    </div>
    <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {children}
    </div>
  </div>
);

export const DutyTeachers: React.FC = () => {
  const { duties } = useConfig();
  const [todayDuty, setTodayDuty] = useState<{loc: string, name: string}[]>([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const found = duties.find(r => {
      const d = parseDateStr(r.TARİH);
      if (!d) return false;
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (found) {
      const entries: {loc: string, name: string}[] = [];
      const fields = ["BİNA İÇİ", "BAHÇE", "NÖBETÇİ OKUL ÖNCESİ", "NÖBETÇİ MÜDÜR YRD."];
      fields.forEach(field => {
        if (found[field]) {
          entries.push({ loc: field, name: found[field] });
        }
      });
      setTodayDuty(entries);
    } else {
      setTodayDuty([]);
    }
  }, [duties]);

  return (
    <ListContainer title="Nöbetçi Öğretmenler" icon={<UserCheck size={16} className="text-emerald-400" />}>
      {todayDuty.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2 py-4">
            <Info size={20} className="opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Nöbetçi Bilgisi Yok</span>
          </div>
      ) : (
          todayDuty.map((item, i) => (
            <div key={i} className="flex flex-col py-2.5 px-3.5 bg-slate-900/40 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-colors">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">{item.loc}</span>
                <span className="text-xs font-black text-emerald-400 tracking-tight">{item.name}</span>
            </div>
          ))
      )}
    </ListContainer>
  );
};

export const AnnouncementsList: React.FC = () => {
    const { settings, announcements } = useConfig();
    const show = settings.showAnnouncements;
    const fontSize = settings.layout?.announcementFontSize || 14;

    return (
        <ListContainer title="Duyuru Panosu" icon={<Megaphone size={16} className="text-blue-400" />}>
            {(!show || announcements.length === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-3 py-10">
                    <div className="p-4 bg-slate-900/50 rounded-full border border-white/5 opacity-40">
                      <Megaphone size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                        {show ? "Aktif Duyuru Yok" : "Panosu Kapalı"}
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-3 pb-2" key={fontSize}>
                  {announcements.map((item, i) => (
                      <div 
                        key={item.id || i} 
                        className={`relative group flex flex-col p-4 rounded-2xl border transition-all duration-300 ${
                          item.important 
                          ? 'bg-red-500/10 border-red-500/30 shadow-[0_4px_20px_rgba(229,9,20,0.15)] ring-1 ring-red-500/20' 
                          : 'bg-slate-900/60 border-white/5 hover:bg-slate-900/80 hover:border-white/10'
                        }`}
                      >
                          {/* Accent Line */}
                          <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all ${item.important ? 'bg-brand-red shadow-[0_0_10px_#e50914]' : 'bg-blue-500/40'}`} />

                          <div className="flex items-start gap-4 pl-2">
                              <div className="shrink-0 flex items-center justify-center mt-1">
                                {item.important ? (
                                   <div className="relative">
                                      <span className="absolute inset-0 bg-red-500 blur-md opacity-40 animate-pulse"></span>
                                      <AlertCircle size={Math.max(16, fontSize * 1.1)} className="relative text-brand-red animate-bounce" />
                                   </div>
                                ) : (
                                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] mt-1.5"></div>
                                )}
                              </div>
                              
                              <div className="flex flex-col flex-1 gap-1">
                                {item.important && (
                                  <span className="text-[8px] font-black text-brand-red uppercase tracking-[0.3em] mb-1">Kritik Duyuru</span>
                                )}
                                <span 
                                  style={{ 
                                      fontSize: `${fontSize}px`,
                                      lineHeight: '1.5',
                                  }}
                                  // Fixed missing single quote in ternary operator to prevent JSX parsing errors
                                  className={`break-words tracking-tight ${item.important ? 'text-red-50' : 'text-slate-200'} font-bold`}
                                >
                                    {item.title}
                                </span>
                              </div>
                          </div>

                          {/* Subtle Glass Reflection */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-tr-2xl"></div>
                      </div>
                  ))}
                </div>
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
         <div className="h-full flex flex-col items-center justify-center text-slate-700 italic gap-2 py-4">
            <Cake size={20} className="opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Bugün Kutlama Yok</span>
         </div>
      ) : (
        <div className="space-y-2">
          <div className="bg-pink-500/10 p-2.5 rounded-xl flex items-center justify-center gap-2 border border-pink-500/20 shadow-lg shadow-pink-900/10">
              <span className="text-[10px] text-pink-300 font-black uppercase tracking-[0.2em] animate-pulse">🎉 İyi ki Doğdunuz!</span>
          </div>
          {list.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-white/5 transition-transform hover:scale-[1.02]">
                  <span className="text-[11px] font-black text-slate-100">{item['AD SOYAD']}</span>
                  <span className="text-[8px] font-black text-white bg-pink-600 px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-pink-900/20">{item.SINIF}</span>
              </div>
          ))}
        </div>
      )}
    </ListContainer>
  );
};

export const SpecialEvents: React.FC = () => {
    const [list, setList] = useState<(EventRow & { isToday: boolean })[]>([]);
  
    useEffect(() => {
      getEvents().then(rows => {
          const today = new Date();
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);

          const pastLimit = new Date();
          pastLimit.setDate(today.getDate() - 3);
          const pastTime = pastLimit.setHours(0, 0, 0, 0);

          const futureLimit = new Date();
          futureLimit.setDate(today.getDate() + 3);
          const futureTime = futureLimit.setHours(23, 59, 59, 999);
  
          const processed = rows
            .map(r => {
                const parsedDate = parseDateStr(r.TARİH);
                const isToday = parsedDate ? (parsedDate >= todayStart && parsedDate <= todayEnd) : false;
                return { ...r, parsedDate, isToday };
            })
            .filter(item => {
              if (!item.parsedDate) return false;
              const itemTime = item.parsedDate.getTime();
              return itemTime >= pastTime && itemTime <= futureTime;
            })
            .sort((a, b) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0));

          setList(processed);
      });
    }, []);
  
    return (
      <ListContainer title="Özel Günler" icon={<Calendar size={16} className="text-amber-400" />}>
        {list.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-700 italic gap-2 py-4">
              <Calendar size={20} className="opacity-20" />
              <span className="text-[10px] font-bold uppercase tracking-widest px-4 text-center">Yakın Tarihte Özel Gün Yok</span>
           </div>
        ) : (
          list.map((item, i) => (
              <div key={i} className={`flex flex-col p-3 rounded-2xl border mb-1 last:mb-0 transition-all ${item.isToday ? 'bg-amber-500/10 border-amber-500/30 shadow-inner ring-1 ring-amber-500/10' : 'bg-slate-900/40 border-white/5'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-black tracking-tight uppercase ${item.isToday ? 'text-amber-400' : 'text-slate-300'}`}>
                        {item['ÖZEL GÜN ADI']}
                    </span>
                    {item.isToday && (
                        <div className="flex items-center h-4 bg-amber-500 px-2 rounded shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                          <span className="text-[7px] font-black text-slate-950 uppercase tracking-tighter">BUGÜN</span>
                        </div>
                    )}
                  </div>
                  <span className={`text-[9px] mt-1 font-bold tracking-widest ${item.isToday ? 'text-amber-500/60' : 'text-slate-500'}`}>{item.TARİH}</span>
              </div>
          ))
        )}
      </ListContainer>
    );
  };
