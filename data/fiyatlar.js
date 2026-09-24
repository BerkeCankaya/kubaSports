/* =============================================================
   KUBA SPORTS — Üyelik fiyat listesi (statik veri)
   Üyelikler sayfası (uyelikler.html) fiyat kartlarını bu dosyadan çizer.
   Fiyatları güncellemek için SADECE bu dosyayı düzenle; HTML/CSS/JS'e
   dokunman gerekmez. (JSON yerine .js: sayfa çift tıklayarak file://
   ile açıldığında da çalışsın diye.)

   Alanlar:
     gecerlilik  → Notlardaki "Fiyatlar … itibarıyla geçerlidir" tarihi.
     eski / yeni → TL, sayı olarak (nokta koyma: 3900 yaz, 3.900 değil).
                   eski boş (null) bırakılırsa üstü çizili fiyat gösterilmez.
     Paket eklemek/çıkarmak için ilgili listeye satır ekle/sil.
   ============================================================= */
window.KUBA_FIYATLAR = {
  gecerlilik: "Eylül 2026",

  fitness: {
    paketler: [
      { ad: "1 Aylık",  eski: 3900,  yeni: 3400 },
      { ad: "3 Aylık",  eski: 10500, yeni: 9000 },
      { ad: "6 Aylık",  eski: 17500, yeni: 15500 },
      { ad: "1 Yıllık", eski: 27500, yeni: 24500 }
    ],
    ekler: [
      { ad: "Günlük giriş ücreti",       fiyat: 600 },
      { ad: "Salon üyelik kartı ücreti", fiyat: 250 }
    ]
  },

  pilates: {
    gruplar: [
      { ad: "Haftada 2 gün", paketler: [
        { ad: "8 Ders",  eski: 4300,  yeni: 3900 },
        { ad: "24 Ders", eski: 10400, yeni: 9450 }
      ]},
      { ad: "Haftada 3 gün", paketler: [
        { ad: "12 Ders", eski: 5450,  yeni: 4950 },
        { ad: "36 Ders", eski: 13100, yeni: 11900 }
      ]}
    ],
    kampanya: {
      ad: "Gündüz Kampanyası",
      not: "17:30'a kadar geçerli",
      paketler: [
        { ad: "8 Ders",  eski: 3900, yeni: 3150 },
        { ad: "12 Ders", eski: 4950, yeni: 4000 }
      ]
    }
  },

  /* {gecerlilik} yazan yere yukarıdaki tarih konur. */
  notlar: [
    "Fiyatlar nakit ödemeler için geçerlidir. Kredi kartı ile ödemelerde %15 fark uygulanır.",
    "Fiyatlar {gecerlilik} itibarıyla geçerlidir. Güncel kampanyalar için bize ulaşın."
  ]
};
