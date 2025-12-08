import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { AppSettings, ManualAnnouncement } from '../types';
import { doc, onSnapshot, collection, query, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';

interface ConfigContextType {
  settings: AppSettings;
  announcements: ManualAnnouncement[];
  loading: boolean;
}

const defaultSettings: AppSettings = {
  mode: 'info',
  youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  academicYear: '2025 - 2026',
  showAnnouncements: true,
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
    // 1. Listen to Settings
    const settingsRef = doc(db, "general", "settings");
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AppSettings);
      } else {
        // Create default if not exists (Admin panel will handle write, but good to have fallback)
      }
      setLoading(false);
    });

    // 2. Listen to Announcements
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