

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
  id?: string;
  TARİH: string;
  "BİNA İÇİ": string;
  "BAHÇE": string;
  "NÖBETÇİ OKUL ÖNCESİ": string;
  "NÖBETÇİ MÜDÜR YRD.": string;
  [key: string]: any; 
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

export interface ManualAnnouncement {
  id: string; 
  title: string;
  important: boolean;
  createdAt?: any;
}

export interface LayoutSettings {
  newsHeight: number;
  weatherHeight: number;
  clockHeight: number;
  dutyHeight: number;
  announceHeight: number;
  dashboardZoom: number;
  announcementFontSize: number;
  imageScale: number;
  dutyRowHeight: number;
}

export interface AppSettings {
  schoolName: string;
  mode: 'info' | 'video' | 'image';
  youtubeUrl: string;
  imageUrl?: string;
  academicYear: string;
  showAnnouncements: boolean;
  examDate?: string;
  lgsDate?: string;
  layout?: LayoutSettings;
  bellTimes?: string[];
}

// Added WeatherData interface for open-meteo API response
export interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
}

// Added NewsItem interface for school website news
export interface NewsItem {
  title: string;
  img: string;
  link: string;
}

// Added LessonStatus interface for school bell schedule calculations
export interface LessonStatus {
  type: 'class' | 'break' | 'before' | 'after';
  label: string;
  dersNo: number;
  isAlert: boolean;
  nextBellTime: Date | null;
  progress: number;
}
