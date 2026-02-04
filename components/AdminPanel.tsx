
import React, { useState, useRef } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { db } from '../services/firebase';
import { doc, setDoc, collection, addDoc, deleteDoc, serverTimestamp, updateDoc, writeBatch, getDocs } from 'firebase/firestore';
import { Save, Trash2, Plus, Monitor, Youtube, Megaphone, ArrowLeft, Layout, Sliders, Laptop, Settings, CheckCircle2, Type, School, UserCheck, Upload, FileText, AlertTriangle, Calendar as CalendarIcon, Loader2, Edit2, X, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { DutyRow } from '../types';

const AdminPanel: React.FC = () => {
  const { settings, announcements, duties } = useConfig();
  
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [mode, setMode] = useState<'info' | 'video' | 'image'>(settings.mode);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [imageUrl, setImageUrl] = useState(settings.imageUrl || "");
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [showAnnouncements, setShowAnnouncements] = useState(settings.showAnnouncements);
  const [layout, setLayout] = useState(settings.layout!);

  // Nöbetçi Form State
  const [editingDutyId, setEditingDutyId] = useState<string | null>(null);
  const [newDuty, setNewDuty] = useState<Partial<DutyRow>>({
    TARİH: new Date().toISOString().split('T')[0],
    "BİNA İÇİ": "",
    "BAHÇE": "",
    "NÖBETÇİ OKUL ÖNCESİ": "",
    "NÖBETÇİ MÜDÜR YRD.": ""
  });

  const [newAnnounceTitle, setNewAnnounceTitle] = useState("");
  const [newAnnounceImportant, setNewAnnounceImportant] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSchoolName(settings.schoolName);
    setMode(settings.mode);
    setYoutubeUrl(settings.youtubeUrl);
    setImageUrl(settings.imageUrl || "");
    setAcademicYear(settings.academicYear);
    setShowAnnouncements(settings.showAnnouncements);
    if (settings.layout) setLayout(settings.layout);
  }, [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "general", "settings"), {
        schoolName,
        mode,
        youtubeUrl: youtubeUrl.trim(),
        imageUrl: imageUrl.trim(),
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

  const handleDutyAction = async () => {
    if (!newDuty.TARİH) return;
    try {
      if (editingDutyId) {
        // Update existing
        const dutyRef = doc(db, "duties", editingDutyId);
        await updateDoc(dutyRef, {
          ...newDuty,
          updatedAt: serverTimestamp()
        });
        setEditingDutyId(null);
      } else {
        // Add new
        await addDoc(collection(db, "duties"), {
          ...newDuty,
          createdAt: serverTimestamp()
        });
      }
      
      // Reset fields
      setNewDuty({
        TARİH: new Date().toISOString().split('T')[0],
        "BİNA İÇİ": "",
        "BAHÇE": "",
        "NÖBETÇİ OKUL ÖNCESİ": "",
        "NÖBETÇİ MÜDÜR YRD.": ""
      });
    } catch (error) {
      console.error(error);
      alert("İşlem sırasında bir hata oluştu.");
    }
  };

  const startEditDuty = (duty: DutyRow) => {
    setEditingDutyId(duty.id!);
    setNewDuty({
      TARİH: duty.TARİH,
      "BİNA İÇİ": duty["BİNA İÇİ"],
      "BAHÇE": duty["BAHÇE"],
      "NÖBETÇİ OKUL ÖNCESİ": duty["NÖBETÇİ OKUL ÖNCESİ"],
      "NÖBETÇİ MÜDÜR YRD.": duty["NÖBETÇİ MÜDÜR YRD."]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingDutyId(null);
    setNewDuty({
      TARİH: new Date().toISOString().split('T')[0],
      "BİNA İÇİ": "",
      "BAHÇE": "",
      "NÖBETÇİ OKUL ÖNCESİ": "",
      "NÖBETÇİ MÜDÜR YRD.": ""
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const batch = writeBatch(db);
        const data = results.data as any[];
        
        try {
          for (const row of data) {
            const dutyRef = doc(collection(db, "duties"));
            batch.set(dutyRef, {
              TARİH: row.TARİH || "",
              "BİNA İÇİ": row["BİNA İÇİ"] || "",
              "BAHÇE": row["BAHÇE"] || "",
              "NÖBETÇİ OKUL ÖNCESİ": row["NÖBETÇİ OKUL ÖNCESİ"] || "",
              "NÖBETÇİ MÜDÜR YRD.": row["NÖBETÇİ MÜDÜR YRD."] || "",
              createdAt: serverTimestamp()
            });
          }
          await batch.commit();
          alert(`${data.length} kayıt başarıyla yüklendi.`);
        } catch (error) {
          console.error("Batch upload error", error);
          alert("Dosya yüklenirken hata oluştu.");
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: (error) => {
        console.error("CSV Parse Error", error);
        alert("CSV ayrıştırılamadı.");
        setUploading(false);
      }
    });
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      alert("Resim dosyası 1MB'dan küçük olmalıdır (Firestore limiti). Daha büyük dosyalar için lütfen bir link kullanın.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearAllDuties = async () => {
    if (!confirm("Tüm nöbetçi listesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    
    setUploading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "duties"));
      const batch = writeBatch(db);
      querySnapshot.forEach((d) => {
        batch.delete(d.ref);
      });
      await batch.commit();
      cancelEdit();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const updateLayout = (key: keyof typeof layout, value: number) => {
    setLayout(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-y-auto overflow-x-hidden pb-40">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Settings className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Yönetim Paneli</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Sistem Ayarları</p>
            </div>
          </div>
          <Link to="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol Kolon: Genel Ayarlar */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5 space-y-6">
            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider">
              <School size={18} className="text-blue-400" /> Kurum Bilgileri
            </h2>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Okul Adı</label>
              <textarea 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)} 
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none" 
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Eğitim Yılı</label>
              <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            
            <hr className="border-white/5" />

            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider">
              <Monitor size={18} className="text-purple-400" /> Ekran Modu
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setMode('info')} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mode === 'info' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <Layout size={18} />
                <span className="text-[10px] font-bold">Bilgi</span>
              </button>
              <button onClick={() => setMode('video')} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mode === 'video' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <Youtube size={18} />
                <span className="text-[10px] font-bold">Video</span>
              </button>
              <button onClick={() => setMode('image')} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${mode === 'image' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <ImageIcon size={18} />
                <span className="text-[10px] font-bold">Resim</span>
              </button>
            </div>

            {mode === 'video' && (
              <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">YouTube Video Linki</label>
                <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-purple-500 outline-none" placeholder="https://youtube.com/..." />
              </div>
            )}

            {mode === 'image' && (
              <div className="space-y-4 animate-in slide-in-from-top duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resim Bağlantısı (URL)</label>
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="https://site.com/resim.jpg" />
                </div>
                
                <div className="relative">
                   <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                   <div className="relative flex justify-center text-[9px] uppercase font-bold text-slate-600"><span className="bg-slate-900 px-2">Veya Dosya Yükle</span></div>
                </div>

                <input type="file" accept="image/*" className="hidden" ref={imageUploadRef} onChange={handleLocalImageUpload} />
                <button onClick={() => imageUploadRef.current?.click()} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Upload size={14} /> Bilgisayardan Seç
                </button>
                
                {imageUrl && (
                  <div className="mt-2 relative group rounded-xl overflow-hidden border border-white/10 bg-black aspect-video">
                     <img src={imageUrl} className="w-full h-full object-contain" alt="Önizleme" />
                     <button onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                  </div>
                )}

                <hr className="border-white/5" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <ZoomIn size={14} className="text-emerald-400" /> Resim Ölçeği
                    </label>
                    <span className="text-emerald-400 font-bold text-xs">%{layout.imageScale || 100}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    value={layout.imageScale || 100} 
                    onChange={(e) => updateLayout('imageScale', parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                  />
                  <p className="text-[9px] text-slate-500 italic">Resmin ekrandaki boyutunu ayarlayın.</p>
                </div>
              </div>
            )}
          </section>

          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider">
                  <Laptop size={18} className="text-blue-400" /> Bilgi Ekranı Ölçeği
                </h2>
                <span className="text-blue-400 font-bold text-sm">{layout.dashboardZoom}%</span>
             </div>
             <input type="range" min="50" max="100" value={layout.dashboardZoom} onChange={(e) => updateLayout('dashboardZoom', parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
             <p className="text-[10px] text-slate-500 mt-3 italic text-center">İçerik ekrana sığmıyorsa bu değeri düşürün.</p>
          </section>
        </div>

        {/* Orta & Sağ Kolon: İçerik Yönetimi */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Nöbetçi Yönetimi */}
          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5 shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
                  <UserCheck size={18} /> Nöbetçi Yönetimi
                </h2>
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={uploading}
                    className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600/30 transition-all flex items-center gap-2"
                  >
                    {uploading ? <Loader2 className="animate-spin w-3 h-3" /> : <Upload size={14} />} CSV Yükle
                  </button>
                  <button 
                    onClick={clearAllDuties}
                    className="bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600/30 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Temizle
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`space-y-4 bg-slate-950/40 p-4 rounded-2xl border transition-colors ${editingDutyId ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5'}`}>
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {editingDutyId ? <Edit2 size={14} className="text-emerald-400" /> : <Plus size={14} />}
                        {editingDutyId ? 'Kaydı Düzenle' : 'Manuel Kayıt Ekle'}
                      </div>
                      {editingDutyId && (
                        <button onClick={cancelEdit} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                          <X size={12} /> Vazgeç
                        </button>
                      )}
                   </h3>
                   <div className="grid grid-cols-1 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-600 uppercase ml-1">Tarih</label>
                        <input 
                          type="date" 
                          value={newDuty.TARİH} 
                          onChange={(e) => setNewDuty({...newDuty, TARİH: e.target.value})} 
                          className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
                        />
                      </div>
                      <input 
                        placeholder="Bina İçi" 
                        value={newDuty["BİNA İÇİ"]} 
                        onChange={(e) => setNewDuty({...newDuty, "BİNA İÇİ": e.target.value})} 
                        className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                      <input 
                        placeholder="Bahçe" 
                        value={newDuty["BAHÇE"]} 
                        onChange={(e) => setNewDuty({...newDuty, "BAHÇE": e.target.value})} 
                        className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                      <input 
                        placeholder="Okul Öncesi" 
                        value={newDuty["NÖBETÇİ OKUL ÖNCESİ"]} 
                        onChange={(e) => setNewDuty({...newDuty, "NÖBETÇİ OKUL ÖNCESİ": e.target.value})} 
                        className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                      <input 
                        placeholder="Müdür Yrd." 
                        value={newDuty["NÖBETÇİ MÜDÜR YRD."]} 
                        onChange={(e) => setNewDuty({...newDuty, "NÖBETÇİ MÜDÜR YRD.": e.target.value})} 
                        className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                      <button 
                        onClick={handleDutyAction}
                        className={`${editingDutyId ? 'bg-emerald-500' : 'bg-emerald-600'} hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 text-xs uppercase`}
                      >
                        {editingDutyId ? 'KAYDI GÜNCELLE' : 'KAYDI EKLE'}
                      </button>
                   </div>
                </div>

                <div className="space-y-2 flex flex-col h-full">
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <FileText size={14} /> Kayıtlı Nöbetçiler ({duties.length})
                   </h3>
                   <div className="flex-1 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 space-y-2">
                      {duties.length === 0 ? (
                        <div className="text-center py-10 text-slate-600 text-xs italic bg-white/2 rounded-2xl border border-dashed border-white/5">
                           Hiç nöbetçi kaydı yok.
                        </div>
                      ) : (
                        duties.map(d => (
                          <div 
                            key={d.id} 
                            onClick={() => startEditDuty(d)}
                            className={`bg-white/5 border p-3 rounded-xl flex items-center justify-between group cursor-pointer transition-all hover:bg-white/10 ${editingDutyId === d.id ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/5'}`}
                          >
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-emerald-400">{d.TARİH}</span>
                                <span className="text-[11px] text-slate-300 line-clamp-1">{d["BİNA İÇİ"]} | {d["BAHÇE"]}</span>
                             </div>
                             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); deleteDoc(doc(db, "duties", d.id!)); if(editingDutyId === d.id) cancelEdit(); }} 
                                 className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                               >
                                  <Trash2 size={16} />
                               </button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                   <p className="text-[9px] text-slate-600 text-center mt-1 italic">Düzenlemek için bir kayda tıklayın.</p>
                </div>
             </div>
          </section>

          {/* Duyurular */}
          <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider">
                <Megaphone size={18} className="text-pink-400" /> Duyuru Yönetimi
              </h2>
              <button onClick={() => {
                const nv = !showAnnouncements;
                setShowAnnouncements(nv);
                updateDoc(doc(db, "general", "settings"), { showAnnouncements: nv });
              }} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all ${showAnnouncements ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                {showAnnouncements ? "Panel Açık" : "Panel Kapalı"}
              </button>
            </div>

            <div className="mb-8 p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                    <Type size={16} className="text-blue-400" /> Duyuru Yazı Boyutu (Punto)
                  </h3>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-black">{layout.announcementFontSize}px</span>
               </div>
               <input 
                  type="range" 
                  min="12" 
                  max="100" 
                  step="1"
                  value={layout.announcementFontSize} 
                  onChange={(e) => updateLayout('announcementFontSize', parseInt(e.target.value))} 
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
               />
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <textarea 
                rows={2}
                value={newAnnounceTitle} 
                onChange={(e) => setNewAnnounceTitle(e.target.value)} 
                placeholder="Duyuru metnini buraya yazın..." 
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-4 py-4 text-sm focus:ring-1 focus:ring-pink-500 outline-none resize-none" 
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setNewAnnounceImportant(!newAnnounceImportant)} 
                  className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl border transition-all font-bold text-xs uppercase tracking-wider ${newAnnounceImportant ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-900/20' : 'border-white/5 text-slate-500 bg-white/5'}`}
                >
                  <Plus size={16} /> Önemli İşaretle
                </button>
                <button 
                  onClick={handleAddAnnouncement} 
                  disabled={!newAnnounceTitle}
                  className="bg-pink-600 hover:bg-pink-500 disabled:opacity-30 text-white px-8 rounded-2xl transition-all font-bold flex items-center gap-2 shadow-lg shadow-pink-900/20"
                >
                  EKLE
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {announcements.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                  <span className="text-base pr-4" style={{ color: item.important ? '#f87171' : '#e2e8f0', fontWeight: item.important ? 'bold' : 'normal' }}>{item.title}</span>
                  <button onClick={() => deleteDoc(doc(db, "announcements", item.id))} className="text-slate-600 hover:text-red-400 p-2 shrink-0 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none z-[60]">
        <button 
          onClick={handleSaveSettings} 
          disabled={saving} 
          className="pointer-events-auto max-w-lg mx-auto w-full h-16 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3 transition-all transform active:scale-95 group"
        >
          {success ? (
            <div className="flex items-center gap-2 text-white animate-in zoom-in">
              <CheckCircle2 size={24} />
              <span className="font-bold">Ayarlar Kaydedildi!</span>
            </div>
          ) : (
            <>
              <Save size={20} className="text-white group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-lg">{saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
