
import Papa from 'papaparse';
import { BirthdayRow, DutyRow, EventRow, LessonRow, NewsItem, WeatherData } from '../types';

// Constants
const URLs = {
  SCHEDULE: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTClYVMj0KftN0xG1N16kd6kIBfH00J2KPNSFX525oBhjB0_koUX43Gy9lSKTy_u62H6D2MLRwD5_w8/pub?output=csv",
  DUTY: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTAmcyAXX1e6VgI1_1248w5lFiyLuwzuDJt0KAUBtWKSsRqH4Tb1ozXhyOB45vuAsWWWQ5voh_hMVNC/pub?output=csv",
  BIRTHDAY: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9aSaP3f-bpi1IDIVVm89AM-dmkubGaePESh-c9tLHxIqoQtz1c-8c6apD2-IpfW9vhFk5sfDlK7dY/pub?output=csv",
  EVENTS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxyVVv11bjcWu4mF9_cLqpS7tSr3B4KsdsotZnsVcxYH_DS2gNbAvnZt8nlWz7s5TwHGd7TxtB0ofp/pub?output=csv",
  WEATHER: "https://api.open-meteo.com/v1/forecast?latitude=38.764&longitude=34.658&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m&timezone=auto",
  NEWS_BASE: "https://ozyaylaoo.meb.k12.tr",
  NEWS_PROXY: "https://dronecekiminevsehir.com/proxy.php"
};

// Robust CSV Fetcher
export const fetchCsv = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as T[]);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("CSV Fetch Error:", error);
    return [];
  }
};

export const getSchedule = () => fetchCsv<LessonRow>(URLs.SCHEDULE);
export const getDuties = () => fetchCsv<DutyRow>(URLs.DUTY);
export const getBirthdays = () => fetchCsv<BirthdayRow>(URLs.BIRTHDAY);
export const getEvents = () => fetchCsv<EventRow>(URLs.EVENTS);

export const getWeather = async (): Promise<WeatherData> => {
  const res = await fetch(URLs.WEATHER);
  return res.json();
};

export const getNews = async (): Promise<NewsItem[]> => {
  const targetUrl = `${URLs.NEWS_BASE}/icerikler/icerikler/listele__Haberler`;
  try {
    const proxyUrl = `${URLs.NEWS_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl);
    const html = await res.text();
    
    // Parse HTML string to DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const items = Array.from(doc.querySelectorAll(".haberler ul li")).slice(0, 5);
    const news: NewsItem[] = [];

    items.forEach(li => {
      const a = li.querySelector("a");
      const img = li.querySelector("img");
      const p = li.querySelector("p");

      if (a && img) {
        let imgSrc = img.getAttribute("src") || "";
        if (imgSrc && !imgSrc.startsWith("http")) {
            if (imgSrc.startsWith("//")) imgSrc = "https:" + imgSrc;
            else if (imgSrc.startsWith("/")) imgSrc = URLs.NEWS_BASE + imgSrc;
            else imgSrc = URLs.NEWS_BASE + "/" + imgSrc;
        }

        let link = a.getAttribute("href") || "";
        if (link && !link.startsWith("http")) {
             link = URLs.NEWS_BASE + link;
        }

        news.push({
          title: p ? p.textContent?.trim() || "Haber" : "Haber",
          img: imgSrc,
          link: link
        });
      }
    });
    return news;

  } catch (error) {
    console.error("News fetch error", error);
    return [];
  }
};

// Date helper
export const parseDateStr = (str: string): Date | null => {
  if (!str) return null;
  const s = str.trim();
  const currentYear = new Date().getFullYear();
  
  // Try YYYY-MM-DD
  const direct = new Date(s);
  if (!isNaN(direct.getTime())) return direct;

  // Try DD.MM.YYYY or DD.MM (Turkish format)
  const parts = s.split(/[\.\-\/]/);
  
  if (parts.length === 3) {
    // DD.MM.YYYY
    if (parts[2].length === 4) {
       return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    } 
    // YYYY.MM.DD
    else if (parts[0].length === 4) {
       return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
  } else if (parts.length === 2) {
    // DD.MM assumes current year
    return new Date(currentYear, Number(parts[1]) - 1, Number(parts[0]));
  }
  
  return null;
};
