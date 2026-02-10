
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { AppSettings, ManualAnnouncement, LayoutSettings, DutyRow } from '../types';
import { 
  doc, onSnapshot, collection, query, orderBy, 
  setDoc, addDoc, deleteDoc, serverTimestamp, 
  writeBatch, getDocs 
} from 'firebase/firestore';

interface ConfigContextType {
  settings: AppSettings;
  announcements: ManualAnnouncement[];
  duties: DutyRow[];
  loading: boolean;
  updateSettings: (newSettings: AppSettings) => Promise<void>;
  addAnnouncement: (title: string, important: boolean) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  bulkAddDuties: (data: any[], columns: string[]) => Promise<void>;
  clearDuties: () => Promise<void>;
}

const defaultLayout: LayoutSettings = {
  newsHeight: 35,
  weatherHeight: 25,
  clockHeight: 45,
  dutyHeight: 50,
  announceHeight: 30,
  dashboardZoom: 85,
  announcementFontSize: 14,
  imageScale: 100,
  dutyRowHeight: 50
};

const defaultBellTimes = [
  "08:50","09:30", "09:45","10:25", "10:45","11:25", 
  "11:40","12:20", "13:05","13:45", "14:00","14:40", "14:55","15:35"
];

const defaultSettings: AppSettings = {
  schoolName: 'Özyayla İlk ve Şehit Hüseyin İpek Ortaokulu',
  mode: 'info',
  youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  imageUrl: '',
  academicYear: '2025 - 2026',
  showAnnouncements: true,
  layout: defaultLayout,
  bellTimes: defaultBellTimes
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within a ConfigProvider");
  return context;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [announcements, setAnnouncements] = useState<ManualAnnouncement[]>([]);
  const [duties, setDuties] = useState<DutyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "general", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AppSettings;
        setSettings({
          ...defaultSettings,
          ...data,
          layout: { ...defaultLayout, ...(data.layout || {}) }
        });
      }
      setLoading(false);
    });

    const qAnnounce = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubAnnouncements = onSnapshot(qAnnounce, (snapshot) => {
      const list: ManualAnnouncement[] = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as ManualAnnouncement));
      setAnnouncements(list);
    });

    const qDuties = query(collection(db, "duties"), orderBy("TARİH", "asc"));
    const unsubDuties = onSnapshot(qDuties, (snapshot) => {
      const list: DutyRow[] = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as DutyRow));
      setDuties(list);
    });

    return () => {
      unsubSettings();
      unsubAnnouncements();
      unsubDuties();
    };
  }, []);

  const updateSettings = async (newSettings: AppSettings) => {
    await setDoc(doc(db, "general", "settings"), newSettings, { merge: true });
  };

  const addAnnouncement = async (title: string, important: boolean) => {
    await addDoc(collection(db, "announcements"), {
      title, important, createdAt: serverTimestamp()
    });
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, "announcements", id));
  };

  const bulkAddDuties = async (data: any[], columns: string[]) => {
    const batch = writeBatch(db);
    data.forEach(row => {
      const dutyRef = doc(collection(db, "duties"));
      batch.set(dutyRef, { ...row, createdAt: serverTimestamp() });
    });
    await batch.commit();
  };

  const clearDuties = async () => {
    const snapshot = await getDocs(collection(db, "duties"));
    const batch = writeBatch(db);
    snapshot.forEach(d => batch.delete(d.ref));
    await batch.commit();
  };

  return (
    <ConfigContext.Provider value={{ 
      settings, announcements, duties, loading, 
      updateSettings, addAnnouncement, deleteAnnouncement, 
      bulkAddDuties, clearDuties 
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
