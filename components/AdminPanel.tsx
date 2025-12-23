
import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { db } from '../services/firebase';
import { doc, setDoc, collection, addDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Save, Trash2, Plus, Monitor, Youtube, Calendar, Megaphone, ArrowLeft, Layout, Sliders, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { settings, announcements } = useConfig();
  
  const [mode, setMode] = useState<'info' | 'video'>(settings.mode);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [showAnnouncements, setShowAnnouncements] = useState(settings.showAnnouncements);
  
  // Layout States
  const [layout, setLayout] = useState(settings.layout!);

  const [newAnnounceTitle, setNewAnnounceTitle] = useState("");
  const [newAnnounceImportant, setNewAnnounceImportant] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setMode(settings.mode);
    setYoutubeUrl(settings.youtubeUrl);
    setAcademicYear(settings.academicYear);
    setShowAnnouncements(settings.showAnnouncements);
    if (settings.layout) setLayout(settings.layout);
  }, [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "general", "settings"), {
        mode,
        youtubeUrl: youtubeUrl.trim(),
        academicYear,
        showAnnouncements,
        layout
      }, { merge: true });
      alert("Ayarlar başarıyla kaydedildi!");
    } catch (error) {
      console.error(error);
      alert("Ayarlar kaydedilirken bir hata oluştu.");
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
    if (confirm("Duyuruyu silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "announcements", id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateLayout = (key: keyof typeof layout, value: number) => {
    setLayout(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Yönetim Paneli
              </h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Özyayla İlk-Ortaokulu</p>
            </div>
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-fit">
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">Ekrana Dön</span>
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GENEL AYARLAR */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
                    <Monitor className="text-blue-400" size={20} />
                    Ekran Modu
                </h2>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setMode('info')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${mode === 'info' ? 'border-blue-500 bg-blue-500/10 text-blue-100' : 'border-slate-800 bg-slate-800/20 text-slate-500'}`}
                    >
                        <Layout size={24} />
                        <div className="font-bold text-sm">Bilgi Ekranı</div>
                    </button>
                    <button 
                        onClick={() => setMode('video')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${mode === 'video' ? 'border-purple-500 bg-purple-500/10 text-purple-100' : 'border-slate-800 bg-slate-800/20 text-slate-500'}`}
                    >
                        <Youtube size={24} />
                        <div className="font-bold text-sm">Video Modu</div>
                    </button>
                </div>

                {mode === 'video' && (
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Youtube Video Linki</label>
                        <input 
                            type="text" 
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Eğitim Öğretim Yılı</label>
                    <input 
                        type="text" 
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* YERLEŞİM AYARLARI */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
                    <Sliders className="text-emerald-400" size={20} />
                    Kart Yükseklik Ayarları (%)
                </h2>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                            <span>Haberler / Video Boyutu</span>
                            <span className="text-emerald-400">{layout.newsHeight}%</span>
                        </div>
                        <input type="range" min="20" max="60" value={layout.newsHeight} onChange={(e) => updateLayout('newsHeight', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Hava Durumu</span>
                                <span className="text-emerald-400">{layout.weatherHeight}%</span>
                            </div>
                            <input type="range" min="15" max="40" value={layout.weatherHeight} onChange={(e) => updateLayout('weatherHeight', parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Saat / Zil</span>
                                <span className="text-emerald-400">{layout.clockHeight}%</span>
                            </div>
                            <input type="range" min="30" max="60" value={layout.clockHeight} onChange={(e) => updateLayout('clockHeight', parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Nöbetçiler</span>
                                <span className="text-emerald-400">{layout.dutyHeight}%</span>
                            </div>
                            <input type="range" min="30" max="70" value={layout.dutyHeight} onChange={(e) => updateLayout('dutyHeight', parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Duyuru Listesi</span>
                                <span className="text-emerald-400">{layout.announceHeight}%</span>
                            </div>
                            <input type="range" min="15" max="50" value={layout.announceHeight} onChange={(e) => updateLayout('announceHeight', parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                            <span className="flex items-center gap-1"><Laptop size={12}/> Ekran Ölçeği (Zoom)</span>
                            <span className="text-blue-400">{layout.dashboardZoom}%</span>
                        </div>
                        <input type="range" min="50" max="100" value={layout.dashboardZoom} onChange={(e) => updateLayout('dashboardZoom', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        <p className="text-[10px] text-slate-500 italic">Ekrana sığmayan durumlarda bu değeri düşürün.</p>
                    </div>
                </div>
            </div>

            {/* DUYURU YÖNETİMİ */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
                        <Megaphone className="text-pink-400" size={20} />
                        Duyurular
                    </h2>
                    <div className="flex items-center gap-3 bg-slate-800/50 px-3 py-1.5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Görünürlük</span>
                        <button 
                            onClick={() => {
                                const newValue = !showAnnouncements;
                                setShowAnnouncements(newValue);
                                updateDoc(doc(db, "general", "settings"), { showAnnouncements: newValue });
                            }}
                            className={`w-10 h-5 rounded-full relative transition-colors ${showAnnouncements ? 'bg-green-500' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${showAnnouncements ? 'left-5.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <input 
                        type="text" 
                        value={newAnnounceTitle}
                        onChange={(e) => setNewAnnounceTitle(e.target.value)}
                        placeholder="Yeni duyuru metni..."
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddAnnouncement()}
                    />
                    <div className="flex gap-2">
                      <button 
                          onClick={() => setNewAnnounceImportant(!newAnnounceImportant)}
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${newAnnounceImportant ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}
                          title="Önemli olarak işaretle"
                      >
                          !
                      </button>
                      <button 
                          onClick={handleAddAnnouncement}
                          className="flex-1 md:flex-none md:px-6 bg-pink-600 hover:bg-pink-500 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
                      >
                          <Plus size={20} /> <span className="md:hidden">Ekle</span>
                      </button>
                    </div>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                    {announcements.length === 0 && <div className="text-slate-600 text-center py-8 text-sm italic">Henüz duyuru eklenmemiş.</div>}
                    {announcements.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 group hover:bg-slate-800/50 transition-all">
                            <div className="flex items-center gap-4">
                                {item.important ? (
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 font-black text-lg">!</div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-blue-500 ml-3 mr-3"></div>
                                )}
                                <span className={`text-sm ${item.important ? 'text-white font-bold' : 'text-slate-300'}`}>{item.title}</span>
                            </div>
                            <button 
                                onClick={() => handleDeleteAnnouncement(item.id)}
                                className="text-slate-600 hover:text-red-400 p-2 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="fixed bottom-6 left-0 right-0 px-4 md:static md:px-0 z-50">
          <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full max-w-4xl mx-auto py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-bold shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
          >
              <Save size={20} />
              {saving ? "Değişiklikler Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
          </button>
        </div>

        <div className="h-20 md:hidden"></div> {/* Mobile spacer for fixed button */}
      </div>
    </div>
  );
};

export default AdminPanel;
