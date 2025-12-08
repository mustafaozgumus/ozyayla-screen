import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { db } from '../services/firebase';
import { doc, setDoc, collection, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Trash2, Plus, Monitor, Youtube, Calendar, Megaphone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { settings, announcements } = useConfig();
  
  // Local states for form inputs
  const [mode, setMode] = useState<'info' | 'video'>(settings.mode);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [showAnnouncements, setShowAnnouncements] = useState(settings.showAnnouncements);
  
  const [newAnnounceTitle, setNewAnnounceTitle] = useState("");
  const [newAnnounceImportant, setNewAnnounceImportant] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state when data loads
  React.useEffect(() => {
    setMode(settings.mode);
    setYoutubeUrl(settings.youtubeUrl);
    setAcademicYear(settings.academicYear);
    setShowAnnouncements(settings.showAnnouncements);
  }, [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "general", "settings"), {
        mode,
        youtubeUrl,
        academicYear,
        showAnnouncements
      });
      alert("Ayarlar kaydedildi!");
    } catch (error) {
      console.error(error);
      alert("Hata oluştu.");
    }
    setSaving(false);
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnounceTitle) return;
    try {
      await addDoc(collection(db, "announcements"), {
        title: newAnnounceTitle,
        important: newAnnounceImportant,
        createdAt: serverTimestamp()
      });
      setNewAnnounceTitle("");
      setNewAnnounceImportant(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "announcements", id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Yönetim Paneli
            </h1>
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                Ekranı Görüntüle
            </Link>
        </div>

        {/* GENEL AYARLAR */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-200">
                <Monitor className="text-blue-400" />
                Ekran Modu & Ayarlar
            </h2>

            <div className="space-y-6">
                {/* Mod Seçimi */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setMode('info')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${mode === 'info' ? 'border-blue-500 bg-blue-500/10 text-blue-100' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}
                    >
                        <div className="font-bold text-lg">Bilgi Ekranı</div>
                        <div className="text-xs opacity-70">Ders programı, nöbetçiler</div>
                    </button>
                    <button 
                        onClick={() => setMode('video')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${mode === 'video' ? 'border-purple-500 bg-purple-500/10 text-purple-100' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}
                    >
                        <Youtube className={mode === 'video' ? 'text-purple-400' : ''} />
                        <div className="font-bold text-lg">Video Modu</div>
                        <div className="text-xs opacity-70">Tam ekran Youtube</div>
                    </button>
                </div>

                {/* Youtube Link */}
                {mode === 'video' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Youtube Video Linki</label>
                        <input 
                            type="text" 
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                )}

                {/* Okul Yılı */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                        <Calendar size={14} /> Eğitim Öğretim Yılı
                    </label>
                    <input 
                        type="text" 
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <button 
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
                >
                    <Save size={18} />
                    {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </button>
            </div>
        </div>

        {/* DUYURU YÖNETİMİ */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
                    <Megaphone className="text-pink-400" />
                    Duyurular
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Ekranda Göster</span>
                    <button 
                        onClick={() => {
                            const newValue = !showAnnouncements;
                            setShowAnnouncements(newValue);
                            // Auto save toggle for UX
                            setDoc(doc(db, "general", "settings"), { showAnnouncements: newValue }, { merge: true });
                        }}
                        className={`w-11 h-6 rounded-full relative transition-colors ${showAnnouncements ? 'bg-green-500' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showAnnouncements ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            {/* Yeni Ekle */}
            <div className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    value={newAnnounceTitle}
                    onChange={(e) => setNewAnnounceTitle(e.target.value)}
                    placeholder="Yeni duyuru yazın..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAnnouncement()}
                />
                <button 
                    onClick={() => setNewAnnounceImportant(!newAnnounceImportant)}
                    className={`px-3 rounded-lg border border-slate-700 transition-colors ${newAnnounceImportant ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-800 text-slate-500'}`}
                    title="Önemli olarak işaretle"
                >
                    !
                </button>
                <button 
                    onClick={handleAddAnnouncement}
                    className="px-4 bg-pink-600 hover:bg-pink-500 rounded-lg text-white font-bold transition-colors"
                >
                    <Plus />
                </button>
            </div>

            {/* Liste */}
            <div className="space-y-2">
                {announcements.length === 0 && <div className="text-slate-500 text-center py-4">Henüz duyuru eklenmemiş.</div>}
                {announcements.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 group">
                        <div className="flex items-center gap-3">
                            {item.important ? (
                                <span className="text-red-400 font-bold text-lg">!</span>
                            ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            )}
                            <span className={item.important ? 'text-white font-medium' : 'text-slate-300'}>{item.title}</span>
                        </div>
                        <button 
                            onClick={() => handleDeleteAnnouncement(item.id)}
                            className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;