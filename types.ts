
export interface LessonRow {
  GÜN: string;
  SINIF: string;
  "1"?: string;
  "2"?: string;
  "3"?: string;
  "4"?: string;
  "5"?: string;
  "6"?: string;
  "7"?: string;
}

export interface DutyRow {
  TARİH: string;
  [key: string]: string; 
}

export interface BirthdayRow {
  "AD SOYAD": string;
  SINIF: string;
  "DOĞUM TARİHİ": string;
}

export interface EventRow {
  "ÖZEL GÜN ADI": string;
  TARİH: string;
}

export interface NewsItem {
  title: string;
  img: string;
  link: string;
}

export interface ManualAnnouncement {
  id: string; 
  title: string;
  important: boolean;
  createdAt?: any;
}

export interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
}

export type LessonStatusType = 'before' | 'after' | 'class' | 'break';

export interface LessonStatus {
  label: string;
  type: LessonStatusType;
  dersNo?: number;
  isAlert: boolean;
  nextBellTime: Date | null;
}

export interface LayoutSettings {
  newsHeight: number;
  weatherHeight: number;
  clockHeight: number;
  dutyHeight: number;
  announceHeight: number;
  dashboardZoom: number;
  announcementFontSize: number;
}

export interface AppSettings {
  schoolName: string;
  mode: 'info' | 'video';
  youtubeUrl: string;
  academicYear: string;
  showAnnouncements: boolean;
  layout?: LayoutSettings;
}
