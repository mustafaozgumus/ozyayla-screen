import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

const VideoPlayer: React.FC = () => {
  const { settings } = useConfig();

  // Extract Video ID from URL (supports Standard, Embed, Short, Mobile)
  const getVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(settings.youtubeUrl);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      {videoId ? (
        <iframe
          className="w-full h-full absolute inset-0 pointer-events-none"
          // mute=1 is REQUIRED for autoplay to work on most browsers without user interaction
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&showinfo=0&iv_load_policy=3`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 0 }}
        ></iframe>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="text-2xl font-bold">Video yüklenemedi</div>
            <div className="text-sm">Lütfen Admin panelinden geçerli bir YouTube linki (Normal veya Shorts) girin.</div>
            <div className="text-xs opacity-50 font-mono bg-slate-900 p-2 rounded">Girilen Link: {settings.youtubeUrl || "Boş"}</div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;