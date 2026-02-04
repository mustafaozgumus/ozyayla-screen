
import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Image as ImageIcon, AlertCircle, Settings } from 'lucide-react';

const ImageDisplay: React.FC = () => {
  const { settings } = useConfig();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get current image scale from settings, default to 100
  const imageScale = settings.layout?.imageScale || 100;

  if (!settings.imageUrl) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-6 p-10 text-center">
        <div className="p-5 bg-blue-500/10 rounded-full border border-blue-500/20">
          <ImageIcon size={48} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">RESİM MODU AKTİF</h2>
          <p className="text-sm text-slate-400">Ancak henüz bir resim bağlantısı girilmemiş.</p>
        </div>
        <a href="/#/admin" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-2xl transition-all border border-white/10">
          <Settings size={18} />
          AYARLARA GİT
        </a>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center justify-center text-red-400 gap-4 p-10 text-center">
          <AlertCircle size={48} />
          <h2 className="text-xl font-bold">Resim Yüklenemedi</h2>
          <p className="text-xs opacity-60">Bağlantıyı kontrol edip tekrar deneyin.</p>
          <a href="/#/admin" className="text-white bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold uppercase">Düzenle</a>
        </div>
      ) : (
        <div 
          className="flex items-center justify-center w-full h-full transition-all duration-700"
          style={{ 
            transform: `scale(${imageScale / 100})`,
            transformOrigin: 'center center' 
          }}
        >
          <img 
            src={settings.imageUrl} 
            alt="Okul Ekran Görseli" 
            className={`max-w-full max-h-full object-contain transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
