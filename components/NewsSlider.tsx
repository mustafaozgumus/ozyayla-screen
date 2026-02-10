
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getNews } from '../services/dataService';
import { NewsItem } from '../types';

const NewsSlider: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const fetchNewsData = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const data = await getNews();
      if (data && data.length > 0) {
        setNews(data);
        setLoading(false);
      } else {
        throw new Error("Haber bulunamadı");
      }
    } catch (err) {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = setTimeout(fetchNewsData, 15000);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchNewsData();
    const interval = setInterval(fetchNewsData, 600000); // 10 dakikada bir veri tazele
    return () => {
      isMounted.current = false;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      clearInterval(interval);
    };
  }, [fetchNewsData]);

  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 12000); // 12 saniyede bir haber değiştir
    return () => clearInterval(interval);
  }, [news.length]);

  if (loading && news.length === 0) {
    return (
      <div className="glass-panel rounded-[2.5rem] w-full h-full flex flex-col items-center justify-center bg-slate-900/20 overflow-hidden border-white/5">
         <div className="w-10 h-10 border-2 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
         <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Haberler Hazırlanıyor</span>
      </div>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-950 group">
      {/* Background Images with Cinematic Zoom (Ken Burns) */}
      {news.map((item, index) => (
         <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
         >
            <img 
                src={item.img} 
                alt={item.title} 
                className={`w-full h-full object-cover transition-transform duration-[14000ms] ease-linear ${index === currentIndex ? 'scale-100' : 'scale-115'}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200';
                }}
            />
            
            {/* Multi-layered Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent mix-blend-multiply opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
         </div>
      ))}

      {/* Modern Pagination Indicators (Top Right) */}
      <div className="absolute top-8 right-10 z-30 flex gap-2">
        {news.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-700 ${i === currentIndex ? 'w-12 bg-brand-red shadow-[0_0_15px_rgba(229,9,20,0.6)]' : 'w-2 bg-white/20'}`} 
          />
        ))}
      </div>

      {/* Content Area */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
        <div className="max-w-5xl">
          {/* Badge & Label */}
          <div className="flex items-center gap-4 mb-5">
             <div className="flex items-center justify-center px-3 py-1 bg-brand-red rounded-lg shadow-lg shadow-red-900/40 border border-white/10">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">GÜNCEL</span>
             </div>
             <div className="h-[1px] w-8 bg-white/20"></div>
             <div className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase opacity-80">
                OKUL HABERLERİ
             </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black leading-[1.15] text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] line-clamp-2 tracking-tighter">
            {currentNews?.title}
          </h2>
          
          {/* Slide Progress Counter */}
          <div className="mt-8 flex items-center gap-5">
             <div className="flex items-baseline gap-1">
                <span className="text-brand-red text-lg font-black tracking-tighter">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="text-white/20 text-xs font-bold">/ {String(news.length).padStart(2, '0')}</span>
             </div>
             <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent max-w-[120px]"></div>
          </div>
        </div>
      </div>

      {/* Sleek Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 w-full z-30 bg-white/5">
        <div 
          className="h-full bg-brand-red shadow-[0_0_20px_rgba(229,9,20,0.8)] transition-all duration-[12000ms] ease-linear origin-left"
          style={{ width: '100%' }}
          key={currentIndex} // Slider her değiştiğinde animasyonu sıfırlar
        />
      </div>

      {/* Glassy reflection at the top */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
    </div>
  );
};

export default NewsSlider;
