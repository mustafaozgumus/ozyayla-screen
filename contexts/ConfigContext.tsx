
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { AppSettings, ManualAnnouncement, LayoutSettings } from '../types';
import { doc, onSnapshot, collection, query, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';

interface ConfigContextType {
  settings: AppSettings;
  announcements: ManualAnnouncement[];
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
  mode: 'info',
  youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  academicYear: '2025 - 2026',
  showAnnouncements: true,
  layout: defaultLayout
};

const ConfigContext = createContext<ConfigContextType>({
  settings: defaultSettings,
  announcements: [],
  loading: true,
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [announcements, setAnnouncements] = useState<ManualAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubAnnouncements = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const list: ManualAnnouncement[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ManualAnnouncement);
      });
      setAnnouncements(list);
    });

    return () => {
      unsubSettings();
      unsubAnnouncements();
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ settings, announcements, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
