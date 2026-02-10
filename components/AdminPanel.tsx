
import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { 
  Save, Trash2, Megaphone, ArrowLeft, Settings, CheckCircle2, 
  School, UserCheck, Loader2, Timer, AlertCircle, Upload, Layout,
  Maximize2, Type, MoveVertical, Rows, Video as VideoIcon, Image as ImageIcon, Link as LinkIcon,
  Clock, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { LayoutSettings, AppSettings } from '../types';

const AdminPanel: React.FC = () => {
  const { 
    settings, announcements, duties, 
    updateSettings, addAnnouncement, deleteAnnouncement,
    clearDuties, bulkAddDuties 
  } = useConfig();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [mode, setMode] = useState<'info' | 'video' | 'image'>(settings.mode);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [imageUrl, setImageUrl] = useState(settings.imageUrl || "");
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [showAnnouncements, setShowAnnouncements] = useState(settings.showAnnouncements);
  const [examDate, setExamDate] = useState(settings.examDate || '');
  const [lgsDate, setLgsDate] = useState(settings.lgsDate || '');
  const [layout, setLayout] = useState<LayoutSettings>(settings.layout!);
  const [bellTimes, setBellTimes] = useState<string[]>(settings.bellTimes || []);

  const [newAnnounceTitle, setNewAnnounceTitle] = useState("");
  const [newAnnounceImportant, setNewAnnounceImportant] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBellModal, setShowBellModal] = useState(false);

  useEffect(() => {
    if (settings) {
      setSchoolName(settings.schoolName);
      setMode(settings.mode);
      setYoutubeUrl(settings.youtubeUrl);
      setImageUrl(settings.imageUrl || "");
      setAcademicYear(settings.academicYear);
      setShowAnnouncements(settings.showAnnouncements);
      setExamDate(settings.examDate || '');
      setLgsDate(settings.lgsDate || '');
      if (settings.layout) setLayout(settings.layout);
      if (settings.bellTimes) setBellTimes(settings.bellTimes);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateSettings({
        ...settings,
        schoolName, mode, 
        youtubeUrl: youtubeUrl.trim(), 
        imageUrl: imageUrl.trim(),
        academicYear, showAnnouncements, 
        examDate, lgsDate, layout, bellTimes
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Ayarlar kaydedilirken bir hata oluştu.");
    }
    setSaving(false);
  };

  const updateLayout = (key: keyof LayoutSettings, val: number) => {
    setLayout(prev => ({ ...prev, [key]: val }));
  };

  const handleBellTimeChange = (index: number, value: string) => {
    const newTimes = [...bellTimes];
    newTimes[index] = value;
    setBellTimes(newTimes);
  };

  const handleFileUpload = (input: React.ChangeEvent<HTMLInputElement>) => {
    const file = input.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.data && results.data.length > 0) {
          const columns = results.meta.fields || [];
          if (confirm(`${results.data.length} adet nöbetçi kaydı eklenecek. Devam edilsin mi?`)) {
            await bulkAddDuties(results.data, columns);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        }
      }
    });
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnounceTitle.trim()) return;
    await addAnnouncement(newAnnounceTitle, newAnnounceImportant);
    setNewAnnounceTitle("");
    setNewAnnounceImportant(false);
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Header Panel */}
      <div className="shrink-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="text-blue-400 w-5 h-5" />
            <h1 className="text-sm md:text-base font-bold uppercase tracking-widest">Yönetim Sistemi</h1>
          </div>
          <Link to="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-tighter">
            <ArrowLeft className="w-4 h-4" /> Ekrana Dön
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-6 pb-40 px-4 md:px-6 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 space-y-6">
            {/* OKUL AYARLARI */}
            <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 space-y-5 shadow-2xl">
              <h2 className="text-[10px] font-black flex items-center gap-2 text-blue-400 uppercase tracking-[0.2em] mb-2"><School size={16} /> Kurum & Genel</h2>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Okul Adı</label>
                <textarea placeholder="Okul Adı" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none text-white resize-none focus:border-blue-500/50" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Eğitim Yılı</label>
                  <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-2.5 text-xs outline-none text-slate-200 focus:border-blue-500/50" />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Yayın Modu</label>
                   <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-2 py-2.5 text-xs outline-none text-slate-200 focus:border-blue-500/50">
                      <option value="info">Bilgi Ekranı</option>
                      <option value="video">Video Modu</option>
                      <option value="image">Resim Modu</option>
                   </select>
                </div>
              </div>

              <button 
                onClick={() => setShowBellModal(true)}
                className="w-full bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl p-4 flex items-center justify-center gap-3 transition-all border border-white/10 group shadow-lg"
              >
                <Clock size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Ders Saatlerini Düzenle</span>
              </button>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1"><Timer size={10} /> YKS Sayacı</label>
                  <input type="datetime-local" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-[11px] outline-none text-slate-200 focus:border-blue-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1"><Timer size={10} /> LGS Sayacı</label>
                  <input type="datetime-local" value={lgsDate} onChange={(e) => setLgsDate(e.target.value)} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-[11px] outline-none text-slate-200 focus:border-blue-500/50" />
                </div>
              </div>
            </section>

            {/* MEDYA AYARLARI */}
            <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 space-y-4 shadow-2xl border-l-4 border-l-purple-500">
              <h2 className="text-[10px] font-black flex items-center gap-2 text-purple-400 uppercase tracking-[0.2em] mb-2"><LinkIcon size={16} /> Medya Kaynakları</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1.5 text-blue-400"><VideoIcon size={12} /> Video URL (MP4/YouTube)</label>
                  <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-xs outline-none text-white focus:border-blue-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1.5 text-emerald-400"><ImageIcon size={12} /> Resim URL</label>
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-xs outline-none text-white focus:border-emerald-500/50" />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* TASARIM AYARLARI */}
            <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
              <h2 className="col-span-full text-[10px] font-black flex items-center gap-2 text-orange-400 uppercase tracking-[0.2em] mb-2"><Layout size={18} /> Arayüz ve Layout Konfigürasyonu</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2"><MoveVertical size={14}/> Haber Paneli</label>
                  <span className="text-[10px] font-black text-orange-400">%{layout.newsHeight}</span>
                </div>
                <input type="range" min="20" max="60" value={layout.newsHeight} onChange={(e) => updateLayout('newsHeight', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                
                <div className="flex justify-between items-center mt-6">
                  <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2"><MoveVertical size={14}/> Nöbet Paneli</label>
                  <span className="text-[10px] font-black text-orange-400">%{layout.dutyHeight}</span>
                </div>
                <input type="range" min="30" max="95" value={layout.dutyHeight} onChange={(e) => updateLayout('dutyHeight', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2"><Type size={14}/> Duyuru Fontu</label>
                  <span className="text-[10px] font-black text-orange-400">{layout.announcementFontSize}px</span>
                </div>
                <input type="range" min="10" max="32" value={layout.announcementFontSize} onChange={(e) => updateLayout('announcementFontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />

                <div className="flex justify-between items-center mt-6">
                  <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2"><Maximize2 size={14}/> Ekran Zoom</label>
                  <span className="text-[10px] font-black text-orange-400">%{layout.dashboardZoom}</span>
                </div>
                <input type="range" min="50" max="100" value={layout.dashboardZoom} onChange={(e) => updateLayout('dashboardZoom', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              <div className="col-span-full pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Duyuru Panosu Durumu</span>
                   <span className="text-[9px] text-slate-500 italic">Ekranda sağ alt köşede duyurular listelensin mi?</span>
                </div>
                <button onClick={() => setShowAnnouncements(!showAnnouncements)} className={`w-14 h-7 rounded-full transition-all relative ${showAnnouncements ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${showAnnouncements ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </section>

            {/* DUYURU YÖNETİMİ */}
            <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-[10px] font-black flex items-center gap-2 text-pink-400 uppercase tracking-[0.2em] mb-6"><Megaphone size={18} /> Duyuru Panosu Yönetimi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <textarea rows={3} value={newAnnounceTitle} onChange={(e) => setNewAnnounceTitle(e.target.value)} placeholder="Yeni duyuru metni..." className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-sm outline-none text-white focus:border-pink-500/50 resize-none" />
                  <div className="flex items-center justify-between">
                    <button onClick={() => setNewAnnounceImportant(!newAnnounceImportant)} className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${newAnnounceImportant ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-slate-800 border-white/10 text-slate-500'}`}>
                      {newAnnounceImportant ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded border border-slate-600" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Önemli Olarak İşaretle</span>
                    </button>
                    <button onClick={handleAddAnnouncement} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-900/20">Ekle</button>
                  </div>
                </div>
                <div className="max-h-[220px] overflow-y-auto space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5 scrollbar-thin scrollbar-thumb-slate-800">
                  {announcements.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-600 text-[10px] italic font-bold">Aktif duyuru bulunmuyor</div>
                  ) : announcements.map(ann => (
                    <div key={ann.id} className={`flex items-start justify-between p-3 rounded-xl border transition-all ${ann.important ? 'bg-red-500/10 border-red-500/20 shadow-inner' : 'bg-white/5 border-transparent'}`}>
                      <div className="flex-1 flex gap-3">
                        {ann.important && <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />}
                        <span className={`text-[11px] leading-relaxed ${ann.important ? 'font-bold text-red-100' : 'text-slate-300'}`}>{ann.title}</span>
                      </div>
                      <button onClick={() => deleteAnnouncement(ann.id!)} className="p-1 hover:text-red-400 text-slate-600 transition-colors ml-2"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* NÖBETÇİ LİSTESİ */}
            <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-black flex items-center gap-2 text-emerald-400 uppercase tracking-[0.2em]"><UserCheck size={18} /> Nöbetçi Çizelgesi (CSV)</h2>
                <div className="flex items-center gap-3">
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 transition-all">
                    <Upload size={14} /> Dosya Yükle
                  </button>
                  <button onClick={() => { if(confirm("Tüm listeyi silmek istediğinize emin misiniz?")) clearDuties(); }} className="flex items-center gap-2 px-5 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all">
                    <Trash2 size={14} /> Temizle
                  </button>
                </div>
              </div>
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-3 mb-4 text-slate-500">
                    <AlertCircle size={16} className="text-slate-600" />
                    <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        CSV Formatı: "TARİH, BİNA İÇİ, BAHÇE, NÖBETÇİ OKUL ÖNCESİ, NÖBETÇİ MÜDÜR YRD." başlıklarını içermelidir.
                    </p>
                 </div>
                 <div className="max-h-[200px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
                   {duties.length === 0 ? (
                     <div className="text-center py-10 text-slate-700 text-[10px] font-black uppercase tracking-widest italic">Liste Boş</div>
                   ) : (
                     <div className="grid grid-cols-1 gap-2">
                       {duties.slice(0, 15).map(d => (
                         <div key={d.id} className="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                           <span className="font-black text-[10px] text-emerald-500 tracking-widest">{d.TARİH}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate ml-4">Veri Sisteme İşlendi</span>
                         </div>
                       ))}
                       {duties.length > 15 && <div className="text-center py-2 text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">... Toplam {duties.length} Kayıt Mevcut</div>}
                     </div>
                   )}
                 </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* DERS SAATLERİ MODALI */}
      {showBellModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowBellModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-slate-800/40">
               <div className="flex items-center gap-3">
                 <Clock className="text-blue-400" />
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Zil Saatleri Konfigürasyonu</h2>
               </div>
               <button onClick={() => setShowBellModal(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 scrollbar-thin scrollbar-thumb-slate-800">
               {Array.from({ length: 8 }).map((_, dersIdx) => (
                 <div key={dersIdx} className="space-y-4 bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 shadow-inner">
                   <div className="flex items-center gap-3 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{dersIdx + 1}. Ders Periyodu</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Giriş</label>
                        <input 
                          type="time" 
                          value={bellTimes[dersIdx * 2] || "00:00"} 
                          onChange={(e) => handleBellTimeChange(dersIdx * 2, e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none text-white focus:border-blue-500/50" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Çıkış</label>
                        <input 
                          type="time" 
                          value={bellTimes[dersIdx * 2 + 1] || "00:00"} 
                          onChange={(e) => handleBellTimeChange(dersIdx * 2 + 1, e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none text-white focus:border-blue-500/50" 
                        />
                      </div>
                   </div>
                 </div>
               ))}
               
               <div className="md:col-span-2 bg-orange-500/5 border border-orange-500/20 p-5 rounded-[2rem] flex items-start gap-4">
                  <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-[10px] text-orange-200/60 leading-relaxed font-bold uppercase tracking-wider italic">
                    DİKKAT: Saatlerde yaptığınız değişikliklerin geçerli olması için önce "UYGULA" butonuna basın, ardından ana panelin altındaki büyük "KAYDET" butonuyla tüm sistemi güncelleyin.
                  </p>
               </div>
            </div>

            <div className="p-8 bg-slate-800/40 border-t border-white/5 flex justify-end gap-4">
               <button onClick={() => setShowBellModal(false)} className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Vazgeç</button>
               <button onClick={() => setShowBellModal(false)} className="bg-blue-600 hover:bg-blue-500 px-12 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-900/40 transition-all active:scale-95">Uygula</button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL KAYDET BUTONU */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-[60]">
        <button 
          onClick={handleSaveSettings} 
          disabled={saving} 
          className="max-w-md mx-auto w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-[0_15px_40px_rgba(37,99,235,0.4)] disabled:opacity-50 active:scale-95 group"
        >
          {success ? (
            <div className="flex items-center gap-3 animate-in zoom-in duration-300">
                <CheckCircle2 size={28} />
                <span className="font-black uppercase tracking-[0.2em] text-sm">Başarıyla Kaydedildi!</span>
            </div>
          ) : (
            <>
              {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} className="group-hover:scale-110 transition-transform" />}
              <span className="font-black uppercase tracking-[0.2em] text-sm">
                {saving ? "İşleniyor..." : "Sistem Ayarlarını Kaydet"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
