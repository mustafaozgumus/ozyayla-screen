
// BU DOSYAYI DÜZENLEYEREK EKRANDAKİ BİLGİLERİ GÜNCELLEYEBİLİRSİNİZ

export const USER_CONFIG = {
  // Sağ üstte görünen Eğitim Öğretim Yılı yazısı
  ACADEMIC_YEAR: "2025 - 2026",

  // MANUEL DUYURULAR
  // Buraya yazdığınız maddeler, otomatik çekilen haberlerin ÜSTÜNDE görünür.
  // "important: true" yaparsanız kırmızı yanar (Acil duyurular için).
  // Duyuru eklemek istemiyorsanız köşeli parantezlerin içini boş bırakın: []
  MANUAL_ANNOUNCEMENTS: [
    {
      id: 1,
      title: ,
      important: true 
    },
    {
      id: 2,
      title: "Okul Aile Birliği Toplantısı bu Cuma saat 15:30'da konferans salonunda yapılacaktır.",
      important: false
    },
    // Yeni eklemek için virgül koyup altına şunu yapıştırabilirsiniz:
    // { id: 3, title: "Duyuru metni buraya", important: false },
  ]
};
