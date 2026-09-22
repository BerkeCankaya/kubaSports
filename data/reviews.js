/* =============================================================
   KUBA SPORTS — Google yorumları (statik veri)
   Ana sayfadaki "Üyeler ne diyor" slider'ı bu dosyayı okur.
   Yorumları güncellemek için SADECE bu dosyayı düzenle; HTML/CSS/JS'e
   dokunman gerekmez. (JSON yerine .js: sayfa çift tıklayarak file://
   ile açıldığında da çalışsın diye.)

   !!! AŞAĞIDAKİ 6 YORUM ÖRNEKTİR — gerçek üye yorumu değildir. !!!
   Yayına almadan önce Google işletme profilindeki gerçek yorumlarla
   (ad, puan, tarih, metin) birebir değiştir.

   Alanlar:
     ozet.puan        → Google'daki ortalama puan (ör. 4.8). null bırakılırsa
                        aşağıdaki yorumların ortalaması hesaplanır.
     ozet.yorumSayisi → Google'daki toplam yorum sayısı (ör. 214). null
                        bırakılırsa aşağıdaki yorum adedi kullanılır.
     ozet.url         → Google profil bağlantısı (boşsa "Tüm yorumlar" linki çıkmaz).
     yorumlar[]       → ad, puan (1–5 tam sayı), tarih (serbest metin), metin
   ============================================================= */
window.KUBA_REVIEWS = {
  ozet: {
    puan: null,
    yorumSayisi: null,
    url: ""
  },
  yorumlar: [
    {
      ad: "Merve K.",
      puan: 5,
      tarih: "Ağustos 2026",
      metin: "İlk gün ölçüm alınıp programın ona göre yazılması beni en çok etkileyen şey oldu. Daha önce gittiğim salonlarda herkese aynı kâğıt veriliyordu. Burada dört haftada bir tekrar ölçüm yapılıyor, neyin değiştiğini rakamla görüyorsun."
    },
    {
      ad: "Emre D.",
      puan: 5,
      tarih: "Temmuz 2026",
      metin: "Temiz, düzenli ve kalabalık olmayan bir salon. Eğitmenler ilgili."
    },
    {
      ad: "Ayşe T.",
      puan: 4,
      tarih: "Temmuz 2026",
      metin: "Reformer pilates için geldim, grup küçük olduğu için eğitmen herkesle tek tek ilgilenebiliyor. Bel ağrım belirgin şekilde azaldı. Akşam saatlerinde rezervasyon bulmak bazen zor oluyor, tek eksisi bu."
    },
    {
      ad: "Burak S.",
      puan: 5,
      tarih: "Haziran 2026",
      metin: "Yıllardır spor yapıyorum ama form hatalarımı ilk kez burada düzelttiler. Kuvvet programı ile birlikte beslenme planı da verildi, ikisi birlikte yürüyünce sonuç hızlı geldi."
    },
    {
      ad: "Zeynep A.",
      puan: 5,
      tarih: "Mayıs 2026",
      metin: "Spora yeni başlayan biri olarak çekinerek gelmiştim. Kimse kimseyi yargılamıyor, eğitmen adım adım anlatıyor. Üç aydır düzenli geliyorum, ilk kez bir salonu bırakmadım."
    },
    {
      ad: "Hakan Y.",
      puan: 5,
      tarih: "Nisan 2026",
      metin: "Kardiyo seansları nabza göre ayarlanıyor, boşa yorulmuyorsun. Otopark ve konum da rahat."
    }
  ]
};
