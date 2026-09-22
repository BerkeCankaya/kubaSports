# Kuba Sports — web sitesi

Saf HTML / CSS / JavaScript. Derleyici, paket yöneticisi veya kurulum gerekmez.
`index.html` dosyasına çift tıklayarak açabilirsin.

---

## 1. Dosya yapısı

```
kuba-sports/
├─ index.html          Ana sayfa
├─ hakkimizda.html     Hakkımızda
├─ hizmetler.html      Hizmetler (4 program + SSS)
├─ egitmenler.html     Eğitmen kadrosu
├─ galeri.html         Fotoğraf galerisi (filtre + büyütme)
├─ iletisim.html       İletişim + deneme dersi formu
├─ data/reviews.js     Google yorumları (ana sayfa slider'ı — yorumları buradan düzenle)
├─ assets/
│  ├─ css/style.css    Tüm stiller (tek dosya)
│  ├─ js/main.js       Tüm etkileşim (kütüphane yok)
│  ├─ img/             Fotoğraflarını buraya koy
│  └─ img/galeri-web/  Galeri fotoğraflarının web boyutu kopyaları (uzun kenar 1800 px)
└─ _kaynak/build.py    (İsteğe bağlı) sayfaları yeniden üreten betik
```

## 2. Renk sistemi — %60 / %30 / %10

Kural, rengin *kapladığı alana* göre uygulandı:

| Oran | Renk      | Nerede                                                        |
|------|-----------|---------------------------------------------------------------|
| %60  | `#090029` | Sayfa zemini, kart zeminleri, footer — baskın koyu yüzey       |
| %30  | `#3700FE` | Tam genişlik elektrik mavisi paneller + birincil butonlar      |
| %10  | `#7900B2` | Vurgular: etiketler, hover durumları, parıltılar, ilerleme rayı |

Renkler `assets/css/style.css` dosyasının en üstünde CSS değişkeni olarak duruyor.
`--volt-lit` ve `--plum-lit`, koyu zeminde okunabilir kontrast (6:1+) için
türetilmiş açık tonlardır — metin vurgularında bunları kullan, ham `#3700FE`
koyu zeminde metin olarak okunmaz (2,5:1).

## 3. Fotoğraf ekleme

Her görsel alanı `<div class="media">` etiketiyle işaretli. Fotoğraf eklemek için
tek satır yeterli:

```html
<div class="media" style="--photo:url('assets/img/salon-01.jpg')">
```

Alt sayfalarda yol bir seviye değişmez, hepsi kök dizinde olduğu için aynı yazım
her sayfada geçerli. Fotoğraf koymazsan mor-mavi degrade yer tutucu görünür;
site eksik durmaz.

**Önerilen boyutlar** (WebP tercih et, 200 KB altı):

| Alan                | Oran  | Boyut       |
|---------------------|-------|-------------|
| Ana sayfa hero      | 3:4   | 900×1200    |
| Eğitmen kartı       | 4:5   | 800×1000    |
| Hizmet görselleri   | 4:3   | 1200×900    |

`media__label` sınıflı küçük etiketleri (ör. "Salon fotoğrafı") gerçek fotoğrafı
koyduktan sonra silebilirsin.

## 4. İletişim formunu bağlama

Form şu anda **demo modunda**: gönderince doğrulama yapıp teşekkür mesajı
gösteriyor ama hiçbir yere veri yollamıyor. Gerçek gönderim için
`assets/js/main.js` içindeki `/* Demo davranışı */` yorumunun olduğu bloğu
kendi servisinle değiştir. En hızlı seçenekler:

- **Formspree** — `<form>` etiketine `action="https://formspree.io/f/KODUN" method="POST"` ekle, JS'teki `e.preventDefault()` satırını kaldır.
- **Netlify Forms** — siteyi Netlify'a yüklüyorsan `<form netlify>` yeter.
- **Kendi sunucun** — `fetch('/api/iletisim', { method:'POST', body:new FormData(form) })`.

## 5. Değiştirilmesi gereken yer tutucu içerik

Tasarım gerçek içerikle dolmaya hazır, ama aşağıdakiler **uydurma örnek
metinlerdir** — yayına almadan önce mutlaka değiştir:

- **Eğitmen isimleri ve biyografileri** (`egitmenler.html`, `index.html`)
- **Google yorumları** (`data/reviews.js`) — 6 yorum örnektir; Google işletme profilindeki gerçek yorumlarla değiştir, `ozet.puan` ve `ozet.yorumSayisi` alanlarına profildeki gerçek ortalama ve toplamı yaz (boş bırakılırsa dosyadaki yorumlardan hesaplanır)
- **Sayılar**: 6 haftalık program, 8 eğitmen, 1250 m² (`index.html` içindeki `.metrics`)
- **Adres, telefon, e-posta, sosyal medya bağlantıları** (her sayfanın footer'ı + `iletisim.html`)
- **JSON-LD yapısal verisi** (her sayfanın `<head>` bölümü) — Google işletme kaydınla birebir aynı olmalı
- **Harita**: `iletisim.html` içindeki harita yer tutucusunu Google Maps embed koduyla değiştir
- **Çalışma saatleri** üç yerde geçiyor: footer, iletişim sayfası, JSON-LD

## 6. Animasyonlar

Kaydırma belirmeleri GSAP + ScrollTrigger ile (`assets/js/vendor/`, yerel kopya);
geri kalan her şey saf CSS. Her şey `transform` ve `opacity` üzerinden çalışıyor
(düşük donanımlı telefonlarda da 60 fps).

- **Hero açılışı**: başlık satırları maskeden yukarı kayar, ardından alt metin, butonlar ve ölçüm şeridi sırayla belirir. Sayfada tek "koreografik" an budur.
- **Üst bar**: açılışta kısa bir iniş (CSS, `html.anim` varken).
- **Kaydırma belirmeleri**: `.reveal` (tekil) ve `.reveal-group` (doğrudan çocukları) hedefleri `IntersectionObserver` ile **tek tek** izlenir; viewport'a ilk girişte 30 px aşağıdan (mobilde 20 px) 720 ms'de (mobilde 560 ms) belirir, bir kez çalışır, geri sarmaz. Aynı karede giren hedefler belge sırasına göre 80 ms arayla kademelenir (başlık → açıklama → kartlar → buton); yavaş kaydırmada kademe doğal olarak kaydırma temposundan gelir. Süre/kayma/kademe değerleri `style.css` başındaki `--t-reveal`, `--reveal-shift`, `--reveal-step`, `--reveal-cap` değişkenlerinde. Yeni bir blok eklerken tek parça için `class="reveal"`, çocukları sırayla gelsin istiyorsan kapsayıcıya `class="reveal-group"` yeter.
- **Sayaçlar**: ölçüm şeridindeki rakamlar görünür olunca sayar.
- **İlerleme rayı**: 1180 px üstü ekranlarda sol kenarda; bölüm başlarına denk gelen işaretler geçildikçe mor yanar.

Güvenlik ağları: JavaScript çalışmazsa veya `IntersectionObserver`
desteklenmiyorsa **tüm içerik görünür** olarak açılır (gizleme yalnızca
`<html class="anim">` varken uygulanır). `<head>` içindeki 4 saniyelik emniyet
zamanlayıcısı yalnızca `main.js` hiç çalışmazsa devreye girer (betik gözlemi
kurunca iptal eder); sayfa dibine gelindiğinde ekranda kalan gizli hedefler de
gösterilir. Yazdırmada hiçbir şey gizli kalmaz.
**Hareket azaltma (`prefers-reduced-motion`) varsayılan olarak YOK SAYILIR.**
Windows'ta Ayarlar › Erişilebilirlik › Görsel efektler › *Animasyon efektleri*
kapalıysa tarayıcı bu tercihi otomatik bildirir; eski sürümde bu, sitedeki tüm
giriş animasyonlarını kapatıyor ve hover geçişlerini 0 ms'ye indiriyordu
("animasyonlar görünmüyor" şikâyetinin sebebi buydu). Artık her sayfanın
`<head>` betiğindeki tek anahtar karar verir:

- `HONOR_REDUCED_MOTION = false` (varsayılan) — işletim sistemi ne derse desin
  site animasyonlarını oynatır.
- `HONOR_REDUCED_MOTION = true` — tercih açıksa `<html class="reduce">` eklenir:
  giriş/kaydırma koreografisi kurulmaz, içerik doğrudan görünür, çekmece kaymak
  yerine solar; hover geçişleri kısa olduğu için dokunulmaz. Kurallar
  `style.css` sonundaki "Hareket azaltma" bloğunda.

Anahtarı değiştirmek için 6 HTML dosyasındaki (ve `_kaynak/build.py`
şablonundaki) `var HONOR_REDUCED_MOTION=false;` ifadesini düzenle.
Geçiş (transition) kurallarında `!important` kullanılmaz; eskiden hareket
azaltma bloğundaki `* { transition-duration:.001ms !important }` kuralını
yenmek için gerekiyordu, o kural kaldırıldı.

## 7. Erişilebilirlik ve tarayıcı desteği

- Tüm metin/zemin çiftleri WCAG AA'yı geçiyor (en düşük 6,1:1)
- Klavye ile gezilebilir, görünür odak halkası var, "İçeriğe geç" bağlantısı mevcut
- Dokunma hedefleri en az 44×44 px
- 375 / 768 / 1024 / 1440 px'te yatay kaydırma yok
- `lang="tr"` ve kaynakta doğru Türkçe büyük harfler (İ/I ayrımı tarayıcıya bırakılmadı)
- Chrome, Edge, Firefox, Safari (son 2 sürüm) ve iOS/Android

## 8. Yayına alma

Statik site olduğu için herhangi bir hostinge klasörü olduğu gibi yükleyebilirsin:
Netlify, Vercel, Cloudflare Pages, GitHub Pages veya klasik cPanel/FTP.
Sunucu tarafı gereksinimi yoktur.

Yüklemeden önce: fotoğrafları WebP'ye çevir, `<link rel="canonical">`
adreslerini gerçek alan adınla güncelle, `sitemap.xml` ve `robots.txt` ekle.
