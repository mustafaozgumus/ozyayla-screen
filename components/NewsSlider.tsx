import React, { useEffect, useState } from 'react';
import { getNews } from '../services/dataService';
import { NewsItem } from '../types';

const NewsSlider: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getNews().then(setNews);
  }, []);

  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) {
    return (
      <div className="glass-panel rounded-3xl w-full aspect-video flex items-center justify-center text-slate-500 text-sm">
         Haberler yükleniyor...
      </div>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group bg-slate-900">
      {/* Background Image with animation */}
      {news.map((item, index) => (
         <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
         >
            <img 
                src={item.img} 
                alt={item.title} 
                className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
            />
             {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent mix-blend-multiply opacity-90"></div>
         </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20">
        <div className="inline-block px-3 py-1 mb-2 rounded-full bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-red-900/50">
            Duyurular
        </div>
        <h2 className="text-xl md:text-2xl font-bold leading-tight text-white drop-shadow-md line-clamp-2 max-w-[95%]">
          {currentNews.title}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-brand-red z-30 transition-all duration-300 ease-linear"
           style={{ width: `${((currentIndex + 1) / news.length) * 100}%` }}>
      </div>
    </div>
  );
};

export default NewsSlider;