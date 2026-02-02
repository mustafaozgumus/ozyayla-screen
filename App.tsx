
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import VideoPlayer from './components/VideoPlayer';
import ImageDisplay from './components/ImageDisplay';
import { useConfig } from './contexts/ConfigContext';

// İç bileşen: Ayara göre Video, Resim veya Dashboard gösterir
const ScreenContent = () => {
  const { settings, loading } = useConfig();

  if (loading) return <div className="w-screen h-screen bg-black flex items-center justify-center text-white font-bold animate-pulse">Yükleniyor...</div>;

  if (settings.mode === 'video') {
    return <VideoPlayer />;
  }

  if (settings.mode === 'image') {
    return <ImageDisplay />;
  }

  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ScreenContent />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
};

export default App;
