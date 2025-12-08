import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

const VideoPlayer: React.FC = () => {
  const { settings } = useConfig();

  // Extract Video ID from URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(settings.youtubeUrl);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      {videoId ? (
        <iframe
          className="w-full h-full absolute inset-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${videoId}&rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="text-white">Video yüklenemedi. Lütfen Admin panelinden linki kontrol edin.</div>
      )}
    </div>
  );
};

export default VideoPlayer;