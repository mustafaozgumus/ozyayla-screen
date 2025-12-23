import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { db } from '../services/firebase';
import { doc, setDoc, collection, addDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Save, Trash2, Plus, Monitor, Youtube, Megaphone, ArrowLeft, Layout, Sliders, Laptop, Settings, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { settings, announcements } = useConfig();
  
  const [mode, setMode] = useState<'info' | 'video'>(settings.mode);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [showAnnouncements, setShowAnnouncements] = useState(settings.showAnnouncements);
  const [layout, setLayout] = useState(settings.layout!);

  const [newAnnounceTitle, setNewAnnounceTitle] = useState("");
  const [newAnnounceImportant, setNewAnnounceImportant] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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

  const updateLayout = (key: keyof typeof layout, value: number) => {
    setLayout(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Settings className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Yönetim Paneli</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Özyayla İlk-Ortaokulu</p>
            </div>
          </div>
          <Link to="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-32">
        
        {/* Sol Kolon: Genel Ayarlar */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5 space-y-6">
            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider">
              <Monitor size={18} className="text-blue-400" /> Ekran Modu
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setMode('info')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${mode === 'info' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <Layout size={20} />
                <span className="text-xs font-bold">Bilgi</span>
              </button>
              <button onClick={() => setMode('video')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${mode === 'video' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <Youtube size={20} />
                <span className="text-xs font-bold">Video</span>
              </button>
            </div>
            {mode === 'video' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">YouTube URL</label>
                <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Eğitim Yılı</label>
              <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
          </section>

          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider">
                  <Laptop size={18} className="text-blue-400" /> Ekran Ölçeği
                </h2>
                <span className="text-blue-400 font-bold text-sm">{layout.dashboardZoom}%</span>
             </div>
             <input type="range" min="50" max="100" value={layout.dashboardZoom} onChange={(e) => updateLayout('dashboardZoom', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
             <p className="text-[10px] text-slate-500 mt-2 italic text-center">İçerik ekrana sığmıyorsa bu değeri düşürün.</p>
          </section>
        </div>

        {/* Orta Kolon: Yerleşim Ayarları */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5">
            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider mb-8">
              <Sliders size={18} className="text-emerald-400" /> Kart Yükseklikleri (%)
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold px-1">
                  <span className="text-slate-300">Haberler & Ders Programı</span>
                  <span className="text-emerald-400">{layout.newsHeight}%</span>
                </div>
                <input type="range" min="20" max="60" value={layout.newsHeight} onChange={(e) => updateLayout('newsHeight', parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                <p className="text-[10px] text-slate-500">Bu değer haberlerin yüksekliğini belirler, ders programı kalan alanı doldurur.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold px-1">
                    <span className="text-slate-300">Hava Durumu</span>
                    <span className="text-emerald-400">{layout.weatherHeight}%</span>
                  </div>
                  <input type="range" min="10" max="40" value={layout.weatherHeight} onChange={(e) => updateLayout('weatherHeight', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold px-1">
                    <span className="text-slate-300">Saat & Zil</span>
                    <span className="text-emerald-400">{layout.clockHeight}%</span>
                  </div>
                  <input type="range" min="30" max="60" value={layout.clockHeight} onChange={(e) => updateLayout('clockHeight', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold px-1">
                    <span className="text-slate-300">Nöbetçiler</span>
                    <span className="text-emerald-400">{layout.dutyHeight}%</span>
                  </div>
                  <input type="range" min="20" max="60" value={layout.dutyHeight} onChange={(e) => updateLayout('dutyHeight', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold px-1">
                    <span className="text-slate-300">Duyuru Listesi</span>
                    <span className="text-emerald-400">{layout.announceHeight}%</span>
                  </div>
                  <input type="range" min="10" max="50" value={layout.announceHeight} onChange={(e) => updateLayout('announceHeight', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
              </div>
            </div>
          </section>

          {/* Duyurular */}
          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider">
                <Megaphone size={18} className="text-pink-400" /> Duyurular
              </h2>
              <button onClick={() => {
                const nv = !showAnnouncements;
                setShowAnnouncements(nv);
                updateDoc(doc(db, "general", "settings"), { showAnnouncements: nv });
              }} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${showAnnouncements ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                {showAnnouncements ? "Görünür" : "Gizli"}
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input type="text" value={newAnnounceTitle} onChange={(e) => setNewAnnounceTitle(e.target.value)} placeholder="Duyuru metni..." className="flex-1 bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-pink-500 outline-none" />
              <button onClick={() => setNewAnnounceImportant(!newAnnounceImportant)} className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${newAnnounceImportant ? 'bg-red-500 border-red-500 text-white' : 'border-white/5 text-slate-600'}`}>!</button>
              <button onClick={handleAddAnnouncement} className="bg-pink-600 hover:bg-pink-500 text-white px-5 rounded-xl transition-all"><Plus /></button>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {announcements.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className={`text-sm ${item.important ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{item.title}</span>
                  <button onClick={() => deleteDoc(doc(db, "announcements", item.id))} className="text-slate-600 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none">
        <button onClick={handleSaveSettings} disabled={saving} className="pointer-events-auto max-w-lg mx-auto w-full h-16 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3 transition-all transform active:scale-95 group">
          {success ? (
            <div className="flex items-center gap-2 text-white animate-in zoom-in">
              <CheckCircle2 size={24} />
              <span className="font-bold">Kaydedildi!</span>
            </div>
          ) : (
            <>
              <Save size={20} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-lg">{saving ? "Kaydediliyor..." : "Ayarları Kaydet"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;