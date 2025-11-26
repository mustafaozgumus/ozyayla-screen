
// BU DOSYAYI DÜZENLEYEREK EKRANDAKİ BİLGİLERİ GÜNCELLEYEBİLİRSİNİZ

export const USER_CONFIG = {
  // Sağ üstte görünen Eğitim Öğretim Yılı yazısı
  ACADEMIC_YEAR: "2024 - 2025",

  // DUYURULAR LİSTESİ
  // Buraya yazdığınız maddeler sağ taraftaki Duyuru Panosu'nda görünür.
  // "important: true" yaparsanız yazının yanında kırmızı uyarı ikonu çıkar.
  // Eklemek için süslü parantezlerin arasına virgül koyarak yenisini ekleyebilirsiniz.
  MANUAL_ANNOUNCEMENTS: [
    {
      id: 1,
      title: "29 Ekim Cumhuriyet Bayramı hazırlıkları başlamıştır.",
      important: true 
    },
    {
      id: 2,
      title: "Okul Aile Birliği Toplantısı bu Cuma saat 15:30'da yapılacaktır.",
      important: false
    },
    {
        id: 3,
        title: "Kütüphane haftası etkinlikleri kapsamında kitap okuma saati.",
        important: false
    }
  ]
};
