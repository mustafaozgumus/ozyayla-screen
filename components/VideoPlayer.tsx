
import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Play, AlertCircle, Settings } from 'lucide-react';

const VideoPlayer: React.FC = () => {
  const { settings } = useConfig();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Gelişmiş YouTube Video ID ayıklama fonksiyonu
  const getVideoId = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    
    // Standart, Shorts, Embed, youtu.be ve mobil formatlarını kapsayan kapsamlı regex
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    
    if (match && match[7].length === 11) {
      return match[7];
    }
    
    // Shorts linkleri için özel kontrol
    if (cleanUrl.includes('/shorts/')) {
      const parts = cleanUrl.split('/shorts/');
      const id = parts[1]?.split(/[?&]/)[0];
      if (id && id.length === 11) return id;
    }

    // Direkt 11 haneli ID girilmişse
    if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('.')) {
      return cleanUrl;
    }
    
    return null;
  };

  const videoId = getVideoId(settings.youtubeUrl);

  // Kullanıcının önerdiği en stabil parametreler:
  // autoplay=1: Otomatik oynatır
  // mute=1: Tarayıcıların "otomatik oynatma" engelini aşmak için zorunludur
  // rel=0: Video bitince farklı kanalları önermez
  // playsinline=1: Mobil cihazlarda tam ekran zorlamasını engeller
  // loop=1 & playlist=ID: Videonun sonsuz döngüde kalmasını sağlar (Bilgi ekranları için kritik)
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=0`
    : null;

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      {videoId ? (
        <>
          <iframe
            key={videoId} // ID değiştiğinde iframe'i sıfırla
            className="w-full h-full absolute inset-0 pointer-events-none"
            src={embedUrl!}
            title="Okul Bilgi Ekranı Videosu"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
          
          {/* Tarayıcılar bazen muted olsa bile ilk yüklemede "kullanıcı etkileşimi" bekleyebilir. 
              Eğer video başlamazsa ekranın herhangi bir yerine dokunulması iframe'i tetikler. */}
          {!hasInteracted && (
            <div 
              onClick={() => setHasInteracted(true)}
              className="absolute inset-0 z-50 bg-black/20 hover:bg-black/10 transition-colors cursor-pointer flex flex-col items-center justify-center"
            >
               <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <Play className="text-white/20 w-12 h-12 mb-4" />
                  <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase">Ekranı Aktifleştir</p>
               </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 gap-6 p-10 text-center max-w-lg animate-in fade-in duration-700">
            <div className="p-5 bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                <AlertCircle size={48} className="text-red-500" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">VİDEO BULUNAMADI</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Girilen YouTube bağlantısı çözümlenemedi. Lütfen geçerli bir URL girdiğinizden emin olun.
                </p>
            </div>
            <div className="w-full text-[10px] font-mono bg-slate-900 p-4 rounded-xl border border-white/5 break-all text-slate-500">
                <span className="text-slate-600 block mb-1">Girilen Değer:</span>
                {settings.youtubeUrl || "Boş"}
            </div>
            <a href="/#/admin" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-2xl transition-all border border-white/10 group">
                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                AYARLARA GİT
            </a>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
