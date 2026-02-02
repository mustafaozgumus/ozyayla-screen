
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { AppSettings, ManualAnnouncement, LayoutSettings, DutyRow } from '../types';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

interface ConfigContextType {
  settings: AppSettings;
  announcements: ManualAnnouncement[];
  duties: DutyRow[];
  loading: boolean;
}

const defaultLayout: LayoutSettings = {
  newsHeight: 35,
  weatherHeight: 25,
  clockHeight: 45,
  dutyHeight: 50,
  announceHeight: 30,
  dashboardZoom: 85,
  announcementFontSize: 14
};

const defaultSettings: AppSettings = {
  schoolName: 'Özyayla İlk ve Şehit Hüseyin İpek Ortaokulu',
  mode: 'info',
  youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  imageUrl: '',
  academicYear: '2025 - 2026',
  showAnnouncements: true,
  layout: defaultLayout
};

const ConfigContext = createContext<ConfigContextType>({
  settings: defaultSettings,
  announcements: [],
  duties: [],
  loading: true,
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [announcements, setAnnouncements] = useState<ManualAnnouncement[]>([]);
  const [duties, setDuties] = useState<DutyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to settings
    const settingsRef = doc(db, "general", "settings");
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
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

    // Listen to announcements
    const qAnnounce = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubAnnouncements = onSnapshot(qAnnounce, (snapshot) => {
      const list: ManualAnnouncement[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ManualAnnouncement);
      });
      setAnnouncements(list);
    });

    // Listen to duties
    const qDuties = query(collection(db, "duties"), orderBy("TARİH", "asc"));
    const unsubDuties = onSnapshot(qDuties, (snapshot) => {
      const list: DutyRow[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as DutyRow);
      });
      setDuties(list);
    });

    return () => {
      unsubSettings();
      unsubAnnouncements();
      unsubDuties();
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ settings, announcements, duties, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
