
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
    const fontSize = settings.layout?.announcementFontSize || 14;

    return (
        <ListContainer title="Duyuru Panosu" icon={<Megaphone size={16} className="text-blue-400" />}>
            {(!show || announcements.length === 0) ? (
                <div className="text-center text-xs text-slate-500 mt-4 italic">
                    {show ? "Aktif duyuru bulunmamaktadır." : "Duyurular şu an kapalı."}
                </div>
            ) : (
                <div className="space-y-2" key={fontSize}> {/* Force re-render on font size change */}
                  {announcements.map((item, i) => (
                      <div key={item.id || i} className={`flex items-start gap-3 py-2 border-b border-slate-700/30 last:border-0 ${item.important ? 'bg-red-500/5 rounded-lg px-2 -mx-2' : ''}`}>
                          <div className="shrink-0 flex items-center justify-center" style={{ width: `${fontSize + 4}px`, height: `${fontSize * 1.5}px` }}>
                            {item.important ? (
                               <AlertCircle size={Math.max(14, fontSize * 0.9)} className="text-red-500 animate-pulse" />
                            ) : (
                               <div style={{ width: `${Math.max(4, fontSize * 0.3)}px`, height: `${Math.max(4, fontSize * 0.3)}px` }} className="rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            )}
                          </div>
                          <span 
                            style={{ 
                                fontSize: `${fontSize}px`,
                                lineHeight: '1.4',
                                display: 'block'
                            }}
                            className={`flex-1 break-words ${item.important ? 'text-red-100 font-bold' : 'text-slate-200 font-medium'}`}
                          >
                              {item.title}
                          </span>
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
          const todayTime = new Date().setHours(0,0,0,0);
          const limitDate = new Date();
          limitDate.setDate(today.getDate() + 30); // 30 gün ileriye bak
          const limitTime = limitDate.setHours(23,59,59,999);
  
          const processed = rows
            .map(r => ({ ...r, parsedDate: parseDateStr(r.TARİH) }))
            .filter(item => {
              if (!item.parsedDate) return false;
              const itemTime = item.parsedDate.getTime();
              return itemTime >= todayTime && itemTime <= limitTime;
            })
            .sort((a, b) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0))
            .slice(0, 5); // En yakın 5 etkinliği göster

          setList(processed);
      });
    }, []);
  
    return (
      <ListContainer title="Özel Günler" icon={<Calendar size={16} className="text-green-400" />}>
        {list.length === 0 ? (
           <div className="text-center text-xs text-slate-500 mt-2 italic">Yakın tarihte (30 gün) özel gün yok</div>
        ) : (
          list.map((item, i) => (
              <div key={i} className="flex flex-col bg-slate-800/30 p-1.5 rounded-lg border border-slate-700/30 mb-1 last:mb-0 hover:bg-slate-700/40 transition-colors">
                  <span className="text-[10px] font-bold text-slate-200">{item['ÖZEL GÜN ADI']}</span>
                  <span className="text-[9px] text-slate-500 mt-0.5 font-medium">{item.TARİH}</span>
              </div>
          ))
        )}
      </ListContainer>
    );
  };
