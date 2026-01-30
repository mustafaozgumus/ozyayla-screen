
import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Play, AlertCircle } from 'lucide-react';

const VideoPlayer: React.FC = () => {
  const { settings } = useConfig();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Extract Video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    
    // Pattern covers: standard, shorts, embed, youtu.be, mobile, and attributes
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    
    // Video ID is always 11 characters
    const id = (match && match[7].length === 11) ? match[7] : null;
    
    // Secondary check for Shorts specifically if the first one fails
    if (!id && cleanUrl.includes('/shorts/')) {
        const parts = cleanUrl.split('/shorts/');
        if (parts[1]) return parts[1].split(/[?&]/)[0];
    }
    
    return id;
  };

  const videoId = getVideoId(settings.youtubeUrl);

  // Modern browsers block autoplay unless muted OR user has interacted with the page.
  // We provide a fallback overlay if they haven't interacted yet.
  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      {videoId ? (
        <>
          <iframe
            className="w-full h-full absolute inset-0"
            // Using youtube-nocookie for better compatibility
            // mute=1 is essential for autoplay
            // playlist={id} is required for loop=1 to work
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
            title="Okul Tanıtım Videosu"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 0 }}
          ></iframe>
          
          {!hasInteracted && (
            <div 
              onClick={() => setHasInteracted(true)}
              className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer group transition-all"
            >
              <div className="bg-brand-red p-6 rounded-full shadow-[0_0_50px_rgba(229,9,20,0.4)] group-hover:scale-110 transition-transform">
                <Play className="text-white fill-white w-12 h-12" />
              </div>
              <p className="mt-6 text-white font-bold text-lg tracking-widest uppercase animate-pulse">
                Videoyu Başlatmak İçin Dokunun
              </p>
              <p className="mt-2 text-slate-400 text-xs">
                Tarayıcı kısıtlamaları nedeniyle ilk oynatma için etkileşim gereklidir.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 gap-6 p-10 text-center max-w-lg">
            <div className="p-4 bg-red-500/10 rounded-3xl border border-red-500/20">
                <AlertCircle size={48} className="text-red-500" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-white mb-2">Video Bağlantısı Hatalı</h2>
                <p className="text-sm leading-relaxed">
                    Lütfen Yönetim Paneli'nden geçerli bir YouTube video linki girildiğinden emin olun. 
                    Shorts, Normal veya Paylaş linklerini kullanabilirsiniz.
                </p>
            </div>
            <div className="w-full text-xs opacity-40 font-mono bg-slate-900 p-4 rounded-xl border border-white/5 break-all">
                Girilen Değer: {settings.youtubeUrl || "Boş"}
            </div>
            <a href="/#/admin" className="text-brand-red font-bold uppercase tracking-widest text-[10px] border border-brand-red/30 px-4 py-2 rounded-full hover:bg-brand-red/10 transition-all">
                Yönetim Paneline Git
            </a>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
