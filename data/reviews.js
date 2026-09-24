/* =============================================================
   KUBA SPORTS — Google yorumları (statik veri)
   Ana sayfadaki "Üyeler ne diyor" slider'ı bu dosyayı okur.
   Yorumları güncellemek için SADECE bu dosyayı düzenle; HTML/CSS/JS'e
   dokunman gerekmez. (JSON yerine .js: sayfa çift tıklayarak file://
   ile açıldığında da çalışsın diye.)

   Aşağıdaki yorumlar Google işletme profilinden alınan gerçek üye
   yorumlarıdır; tarihe göre en yeniden en eskiye sıralıdır.

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
    puan: 4.7,
    yorumSayisi: 272,
    url: ""
  },
  yorumlar: [
    {
      ad: "Irmak D.",
      puan: 5,
      tarih: "Haziran 2026",
      metin: "Nilay hoca ve Malhun hoca sayesinde yeniden pilatesi sevdim, kendileri çok güler yüzlüler, aynı zamanda motive ediciler :) Eğer eğlenerek kilo vermek isterseniz kesinlikle gidin derim."
    },
    {
      ad: "Nil K.",
      puan: 5,
      tarih: "Mayıs 2026",
      metin: "Gelen insan profili düzgün, neredeyse herkes herkesle arkadaş. Salon oldukça temiz ve düzenli. Ekipmanlar yeni ve bakımlı, antrenman sırasında sıra bekleme problemi yaşanmıyor. Çalışan ekip ilgili ve yardımcı; özellikle yeni başlayanlar için yönlendirmeleri yeterli ve anlaşılır. Ortam motive edici, kalabalık olsa bile düzen korunuyor. Düzenli spor yapmak isteyenler için rahatlıkla tercih edilebilecek bir yer."
    },
    {
      ad: "Damla S.",
      puan: 5,
      tarih: "Mayıs 2026",
      metin: "Spor salonuna başladığımdan beri hayatımda gerçekten fark yaratan bir deneyim yaşıyorum. Öncelikle salonun genel atmosferi insanı motive eden türden; içeri adım attığınız anda düzen, temizlik ve profesyonellik hemen hissediliyor. 6 aydır reformer pilatese gidiyorum, Nilay hocaya sonsuz teşekkürlerimi iletiyorum, kendisini çoooookkk seviyorum, iyi ki var; hem enerjisi hem de güler yüzlülüğü içimi ısıtıyor. Nilay Hoca gerçekten bu spor salonunun en değerli parçalarından biri. Ayrıca Ömer Bey'e ilgisi ve alakası için teşekkür ederim, her sorumu cevapladı, kendisi çok kibar birisi. Bütün hocalara tek tek teşekkür ederim, iyi ki varsınız. Elinize, emeğinize sağlık 🙂"
    },
    {
      ad: "Muhammed L.",
      puan: 5,
      tarih: "Mayıs 2026",
      metin: "Çalışanları güler yüzlü, Ömer Bey aralarında en kibar beyefendi, çok memnunuz. Kuba ailesinde herkese tavsiye ederim."
    },
    {
      ad: "Ferhat A.",
      puan: 5,
      tarih: "Nisan 2026",
      metin: "Uzun zamandır gittiğim bu spor salonu temizliği, alanında tecrübeli hocaları, salon içindeki yenilenen ve sürekli ihtiyaca göre düzenlenen aletleri ve spora gelen kişilerin profili ile gidilebilecek en iyi spor salonlarından biri diyebilirim."
    },
    {
      ad: "Çağan M.",
      puan: 5,
      tarih: "Eylül 2025",
      metin: "1 yıllık üyeliğimi tamamlamak üzereyim. Makineleri hem powerlifterlar için hem bodybuilding sporcuları için çok yeterli. PT'ler her ihtiyaç olduğunda sağ olsunlar ilgileniyorlar."
    }
  ]
};
