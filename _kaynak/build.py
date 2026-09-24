# -*- coding: utf-8 -*-
"""Kuba Sports — statik HTML üretici. Çıktı: saf HTML/CSS/JS."""
import io, os

NAV = [
    ("index.html",      "Ana Sayfa",   "00"),
    ("hakkimizda.html", "Hakkımızda",  "01"),
    ("hizmetler.html",  "Hizmetler",   "02"),
    ("uyelikler.html",  "Üyelikler",   "03"),
    ("egitmenler.html", "Eğitmenler",  "04"),
    ("donusumler.html", "Dönüşümler",  "05"),
]

ICON = {
 "dumbbell":'<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
 "pulse":'<path d="M3 12h4l2.5-7 4 14L16 12h5"/>',
 "spine":'<path d="M4 7h16M4 12h16M4 17h16M8 7v10M16 7v10"/>',
 "leaf":'<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16Z"/><path d="M4 20c2-4 5-7 9-9"/>',
 "badge":'<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9Z"/>',
 "chart":'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 "users":'<path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="7.5" r="3.5"/><path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6"/>',
 "clock":'<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
 "shield":'<path d="M12 3 5 6v5.5c0 4.3 2.9 7.8 7 9.5 4.1-1.7 7-5.2 7-9.5V6Z"/><path d="m9.2 12.2 2 2 3.6-3.9"/>',
 "target":'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
 "pin":'<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
 "phone":'<path d="M6 3h3l2 5-2.4 1.4a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/>',
 "mail":'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.6 6.8 8.4 6 8.4-6"/>',
 "ig":'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1"/>',
 "wa":'<path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12Z"/><path d="M9.2 9.4c.4 2.5 2.9 5 5.4 5.4l1-1.4 1.8.8v1.4c-3.6.5-7.7-3.6-7.2-7.2h1.4l.8 1.8Z"/>',
 "yt":'<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.5 9.5 5 2.5-5 2.5Z"/>',
}

def svg(name, cls=""):
    c = ' class="%s"' % cls if cls else ""
    return ('<svg%s viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % (c, ICON[name]))

ARROW = ('<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5"/></svg>')

LOGO = ('<img class="brand__mark" src="assets/img/kubasports-logo.png" alt="" width="116" height="100" decoding="async">')

def head(title, desc, current):
    canon = "" if current == "index.html" else current
    cur = ' aria-current="page"'
    nav_items = "".join('<li><a href="%s"%s>%s</a></li>' % (h, cur if h == current else "", t) for h, t, _ in NAV)
    drawer_items = "".join('<a href="%s"%s>%s<small>%s</small></a>' % (h, cur if h == current else "", t, n) for h, t, n in NAV)
    return f'''<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Kuba Sports — Bahçelievler, İzmir</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#090029">
<meta property="og:title" content="{title} · Kuba Sports">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="assets/img/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="canonical" href="https://www.kubasports.com/{canon}">
<!-- HONOR_REDUCED_MOTION: false = işletim sisteminin "hareketi azalt" tercihini yok say (varsayılan);
     true = tercih açıksa giriş/kaydırma animasyonlarını kapat (html.reduce). Bkz. style.css sonu, main.js §4. -->
<script>(function(d,w){{var h=d.documentElement;h.className+=" js";var HONOR_REDUCED_MOTION=false;if(HONOR_REDUCED_MOTION&&w.matchMedia("(prefers-reduced-motion: reduce)").matches){{h.className+=" reduce";}}else if("IntersectionObserver" in w){{h.className+=" anim";w.__animGuard=setTimeout(function(){{if(!d.querySelector(".is-in"))h.className=h.className.replace(/\\banim\\b/,"");}},4000);}}}})(document,window);</script>

<!-- GSAP 3.12.5 (yerel kopya) — main.js §4 kaydırma belirmelerini bununla yapar.
     defer sırası korunmalı: main.js bu ikisinden SONRA çalışır. CDN yerine yerel
     dosya: head'deki 4 sn emniyet zamanlayıcısı yavaş ağda GSAP inmeden tetiklenip
     animasyonu sessizce iptal ediyordu. Yerel kopyada böyle bir yarış yok. -->
<script src="assets/js/vendor/gsap.min.js" defer></script>
<script src="assets/js/vendor/ScrollTrigger.min.js" defer></script>
<script src="assets/js/main.js" defer></script>
<!-- Yerel işletme yapısal verisi. Adres, telefon ve koordinatları gerçek
     bilgilerle güncelleyin; Google işletme panelindeki verilerle birebir aynı olmalı. -->
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "Kuba Sports",
  "description": "Bahçelievler, İzmir'de ölçülebilir ilerleme üzerine kurulu antrenman salonu.",
  "url": "https://www.kubasports.com/",
  "telephone": "+90-507-120-20-10",
  "email": "info@kubasports.com",
  "address": {{
    "@type": "PostalAddress",
    "streetAddress": "Bahçelievler Mah. Zübeyde Hanım Cd.",
    "addressLocality": "Karşıyaka",
    "addressRegion": "İzmir",
    "postalCode": "35600",
    "addressCountry": "TR"
  }},
  "openingHoursSpecification": [
    {{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "23:00" }},
    {{ "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "11:00", "closes": "19:00" }},
    {{ "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "12:00", "closes": "17:00" }}
  ],
  "priceRange": "$$"
}}
</script>
</head>
<body>
<a class="skip" href="#main">İçeriğe geç</a>

<div class="rail" aria-hidden="true"><span class="rail__track"></span><span class="rail__fill"></span></div>

<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Kuba Sports ana sayfa">
      {LOGO}
      <span class="brand__name">KUBA<br>SPORTS<span>KARŞIYAKA · İZMİR</span></span>
    </a>
    <nav class="nav" aria-label="Ana menü">
      <ul>{nav_items}</ul>
    </nav>
    <div class="header-actions">
      <a class="btn btn--sm" href="iletisim.html"><span>Bize ulaş</span>{ARROW}</a>
      <button class="burger" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="drawer"><span></span></button>
    </div>
  </div>
</header>

<div class="drawer" id="drawer" aria-hidden="true">
  {drawer_items}
  <a class="btn" href="iletisim.html"><span>Ücretsiz deneme dersi</span>{ARROW}</a>
</div>

<main id="main">
'''

FOOTER = f'''</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid reveal-group">
      <div>
        <a class="brand" href="index.html" aria-label="Kuba Sports ana sayfa">
          {LOGO}
          <span class="brand__name">KUBA<br>SPORTS<span>KARŞIYAKA · İZMİR</span></span>
        </a>
        <p class="muted" style="margin-top:1rem;max-width:32ch;font-size:var(--fs-sm)">Ölçülebilir ilerleme üzerine kurulu bir antrenman salonu. Kalabalık değil, planlı.</p>
      </div>
      <div>
        <h4>Salon</h4>
        <ul>{"".join(f'<li><a href="{h}">{t}</a></li>' for h,t,_ in NAV[1:])}</ul>
      </div>
      <div>
        <h4>Hizmetler</h4>
        <ul>
          <li><a href="hizmetler.html#performans">Vücut performansı</a></li>
          <li><a href="hizmetler.html#kardiyo">Kardiyo &amp; kondisyon</a></li>
          <li><a href="hizmetler.html#pilates">Reformer pilates</a></li>
          <li><a href="hizmetler.html#beslenme">Beslenme desteği</a></li>
        </ul>
      </div>
      <div>
        <h4>Ulaşım</h4>
        <ul class="muted">
          <li>Bahçelievler, Zübeyde Hanım Cd.<br>35600 Karşıyaka / İzmir</li>
          <li><a href="tel:+905071202010">0507 120 20 10</a></li>
          <li><a href="mailto:info@kubasports.com">info@kubasports.com</a></li>
        </ul>
        <div class="socials" style="margin-top:1rem">
          <a href="#" aria-label="Instagram">{svg("ig")}</a>
          <a href="#" aria-label="WhatsApp">{svg("wa")}</a>
          <a href="#" aria-label="YouTube">{svg("yt")}</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> Kuba Sports. Tüm hakları saklıdır.</span>
      <span>Hafta içi 10:00–23:00 · Cumartesi 11:00–19:00 · Pazar 12:00–17:00</span>
    </div>
  </div>
</footer>
</body>
</html>
'''

CTA_BAND = f'''
<section class="cta-band" data-rail>
  <div class="container cta-band__inner reveal-group">
    <span class="tag">Tanışalım</span>
    <h2 class="h2">SALONU GÖR, SORULARINI SOR,<br>SONRA KARAR VER</h2>
    <p class="lead" style="text-align:center">Salonu gez, hedefini konuş, sana uygun programı birlikte belirleyelim.</p>
    <div class="btn-row" style="justify-content:center;margin-top:.8rem">
      <a class="btn" href="iletisim.html"><span>Ücretsiz Bilgi Al</span>{ARROW}</a>
      <a class="btn btn--ghost" href="tel:+905071202010"><span>Hemen ara</span></a>
    </div>
  </div>
</section>
'''

import re as _re

_SPLIT = _re.compile(r'(<[^>]+>|&[#a-zA-Z0-9]+;)')

def U(html):
    """HTML'i bozmadan Türkçe büyük harfe çevirir (i -> İ)."""
    out = []
    for part in _SPLIT.split(html):
        if part.startswith('<') or part.startswith('&'):
            out.append(part)
        else:
            out.append(part.replace('i', 'İ').upper())
    return ''.join(out)

_HEADING = _re.compile(r'(<(h1|h2)\b[^>]*>)(.*?)(</\2>)', _re.S)
_DRAWER  = _re.compile(r'(<div class="drawer".*?</div>)', _re.S)
_DLINK   = _re.compile(r'(<a href="[^"]*"[^>]*>)([^<]*)(<small>)', _re.S)

def turkish_caps(html):
    """CSS text-transform tarayıcıda i -> İ dönüşümünü garanti etmiyor;
    büyük harfli başlıkları kaynakta doğru yazıyoruz."""
    html = _HEADING.sub(
        lambda m: m.group(0) if 'class="h3"' in m.group(1)
        else m.group(1) + U(m.group(3)) + m.group(4), html)
    html = _DRAWER.sub(lambda m: _DLINK.sub(
        lambda d: d.group(1) + U(d.group(2)) + d.group(3), m.group(1)), html)
    return html

def write(name, body):
    body = turkish_caps(body)
    with io.open(name, "w", encoding="utf-8") as f:
        f.write(body)
    print("  ->", name, os.path.getsize(name), "bytes")

print("Kuba Sports build")

# ============================ ANA SAYFA ============================
# NOT: Tüm isimler, sayılar, yorumlar ve fotoğraf alanları YER TUTUCUDUR.
# Gerçek içerikle değiştirilmek üzere hazırlanmıştır.

SERVICES = [
    ("performans", "6 haftalık", "dumbbell", "Vücut<br>performansı",
     "Kişiye özel hazırlanan kuvvet programı, beslenme planıyla birlikte ilerler. Yağ, kas ve su oranını düzenli ölçer, değişimi rakamla görürsün."),
    ("kardiyo", "Yüksek tempo", "pulse", "Kardiyo &amp;<br>kondisyon",
     "Yağ yakımını desteklerken nefes kapasiteni ve dayanıklılığını geliştiren, kalp atışına göre ayarlanan interval seansları."),
    ("pilates", "Denge &amp; kontrol", "spine", "Reformer<br>pilates",
     "Duruşunu düzelt, esnekliğini artır, derin kas grubunu güvenli biçimde çalıştır. Her seviyeye uygun, en fazla 5 kişilik gruplar."),
    ("beslenme", "Bilimsel plan", "leaf", "Beslenme<br>desteği",
     "Diyetisyen eşliğinde yaşam tarzına uyan, sürdürülebilir bir plan. Antrenman programınla birlikte her dört haftada güncellenir."),
]

BENEFITS = [
    ("badge", "Sertifikalı kadro", "Her eğitmen alanında sertifikalı ve düzenli olarak eğitim alıyor. Programını kim yazdıysa sahada da o var."),
    ("chart", "Ölçülen ilerleme", "Dört haftada bir vücut kompozisyonu ölçümü. İlerlemeyi aynada değil, karşılaştırmalı raporda görürsün."),
    ("users", "Kalabalık olmayan salon", "Aynı saatte sınırlı sayıda üye. Sıra beklemeden, ekipmanı kapmaya çalışmadan antrenman."),
    ("clock", "Geniş çalışma saatleri", "Hafta içi 10:00–23:00, Cumartesi 11:00–19:00, Pazar 12:00–17:00. Programını iş saatine göre değil, kendine göre kur."),
]

# (ad, fotoğraf anahtarı [assets/img/<anahtar>.webp — şeffaf arka planlı kesilmiş figür], rol, tanıtım, etiketler)
TRAINERS = [
    ("Kaan Demir",    "pt3", "Kuvvet &amp; performans", "Powerlifting geçmişi olan, teknik detaya takıntılı bir eğitmen. Ağırlık kaldırmayı yeni öğrenenlerle çalışmayı seviyor.", ["Kuvvet", "Hipertrofi", "Rehabilitasyon sonrası"]),
    ("Elif Yıldırım", "pt2", "Reformer pilates",        "Duruş bozuklukları ve bel-boyun ağrısı olan üyelerle çalışıyor. Sekiz yıldır reformer eğitmeni.", ["Postür", "Mobilite"]),
    ("Mert Aslan",    "pt4", "Kondisyon &amp; kardiyo", "Maraton koşucusu. Dayanıklılık programlarını nabız verisine göre kuruyor, tempoyu birlikte ayarlıyorsunuz.", ["HIIT", "Dayanıklılık", "Koşu tekniği"]),
    ("Burak Şahin",   "pt1", "Fonksiyonel antrenman",   "Günlük hayatta işe yarayan hareket kalitesi üzerine çalışıyor. Masa başı çalışanların favorisi.", ["Fonksiyonel", "Core", "Esneklik"]),
]

STORIES = [
    ("Selin A.", "34 yaşında, yazılım geliştirici", ["16 hafta", "-9,4 kg", "+3,1 kg kas"],
     "Daha önce iki kez salona yazılıp bıraktım. Buradaki fark, ne yaptığımı bilerek antrenman yapmam oldu. Dört haftada bir ölçüm alınca rakamlar konuşuyor, motivasyon kendiliğinden geliyor."),
]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def photo(key):
    """assets/img/<key>.(webp|jpg|png) varsa CSS'e göreli yolunu döndürür (bkz. style.css §8)."""
    for ext in ("webp", "jpg", "png"):
        if os.path.exists(os.path.join(ROOT, "assets", "img", "%s.%s" % (key, ext))):
            return "../img/%s.%s" % (key, ext)
    return None

def media(cls, label, rings=True, photo=None):
    r = '<span class="media__rings" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' if rings else ''
    g = '<span class="media__grain" aria-hidden="true"></span>'
    if photo:
        # Gerçek fotoğraf: yer tutucu etiketi düşer. Halkalar kalır; görsel
        # yüklenemezse altındaki degrade yer tutucu yeniden görünür.
        return '<div class="%s" style="--photo:url(\'%s\')">%s%s</div>' % (cls, photo, r, g)
    return ('<div class="%s"><!-- Fotoğraf eklemek için: style="--photo:url(\'../img/dosya.webp\')" -->'
            '%s%s<span class="media__label">%s</span></div>' % (cls, r, g, label))

def service_cards():
    out = []
    for sid, chip, icon, title, text in SERVICES:
        out.append(
            '<article class="card">'
            '<span class="card__chip">%s</span>'
            '<span class="card__icon">%s</span>'
            '<h3 class="h3">%s</h3>'
            '<p>%s</p>'
            '<div class="card__foot"><a class="link" href="hizmetler.html#%s"><span>Detaylı bilgi</span>%s</a></div>'
            '</article>' % (chip, svg(icon), title, text, sid, ARROW))
    return "".join(out)

def benefit_items():
    return "".join(
        '<div class="benefit"><span class="benefit__icon">%s</span><div><h4 class="h4">%s</h4><p>%s</p></div></div>'
        % (svg(i), t, d) for i, t, d in BENEFITS)

def trainer_cards(items):
    out = []
    for name, img, role, bio, tags in items:
        out.append(
            '<article class="trainer">'
            '%s'
            '<div class="trainer__meta"><h3 class="h3">%s</h3><span class="trainer__role">%s</span></div>'
            '<p>%s</p>'
            '<ul class="trainer__tags">%s</ul>'
            '</article>' % (media("media media--cutout", name.split()[0] + " — fotoğraf",
                                  photo=photo(img)), name, role, bio,
                            "".join('<li>%s</li>' % t for t in tags)))
    return "".join(out)

def story_block(name, meta, stats, quote):
    return ('<figure class="story reveal">'
            '%s'
            '<div class="story__body">'
            '<ul class="story__stats">%s</ul>'
            '<blockquote>%s</blockquote>'
            '<figcaption><b>%s</b>%s</figcaption>'
            '</div></figure>'
            % (media("media", name + " — öncesi / sonrası",
                     photo=photo("donusum-" + name.split()[0].lower())),
               "".join('<li><b>%s</b></li>' % s for s in stats),
               quote, name, meta))

INDEX = f'''
<section class="hero" data-rail>
  <span class="hero__glow" aria-hidden="true"></span>
  <div class="container hero__inner">
    <div>
      <span class="tag hero__eyebrow">Bahçelievler, İzmir</span>
      <h1 class="display">
        <span class="mask"><span>Sıkı <span class="display__accent">çalış.</span></span></span>
        <span class="mask"><span>İyi <span class="display__accent">yaşa.</span></span></span>
      </h1>
      <p class="hero__sub">Kişiye özel antrenman, dört haftada bir ölçülen ilerleme ve seni adıyla tanıyan bir eğitmen kadrosu. Kalabalık değil — planlı.</p>
      <div class="btn-row hero__cta">
        <a class="btn" href="iletisim.html"><span>Hemen bize ulaş</span>{ARROW}</a>
        <a class="btn btn--ghost" href="uyelikler.html"><span>Üyelikleri gör</span></a>
      </div>
      <ul class="metrics">
        <li><b data-count="12">12</b><span>haftalık ölçümlü program</span></li>
        <li><b data-count="8">8</b><span>sertifikalı eğitmen</span></li>
        <li><b data-count="1250">1250</b><span>m&sup2; antrenman alanı</span></li>
        <li><b>1<i>:</i>1</b><span>kişiye özel takip</span></li>
      </ul>
    </div>
    {media("media hero__media", "Salon fotoğrafı", photo=photo("home-hero-v2"))}
  </div>
</section>

<section class="section" data-rail>
  <div class="container">
    <div class="section-head reveal-group">
      <span class="tag">Hizmetlerimiz</span>
      <h2 class="h2">Dört program,<br>tek bir plan</h2>
      <p class="lead">Hangisiyle başlarsan başla, ölçümle açılır ve dört haftada bir yeniden hesaplanır. Programlar birbirine geçebilir.</p>
    </div>
    <div class="grid g-2 g-4 reveal-group">{service_cards()}</div>
  </div>
</section>

<section class="panel" data-rail>
  <div class="container panel__split">
    <div class="reveal-group">
      <span class="tag">Neden Kuba Sports</span>
      <h2 class="h2" style="margin-top:.4rem">Salonu değil,<br>programı seçiyorsun</h2>
      <p class="lead" style="margin-top:1rem">Ekipman her yerde aynı. Fark, o ekipmanı kimin, hangi sırayla ve neden yaptırdığında.</p>
      <div class="btn-row" style="margin-top:1.8rem">
        <a class="btn btn--on-volt" href="hakkimizda.html"><span>Bizi tanı</span>{ARROW}</a>
      </div>
    </div>
    <div class="benefits reveal-group">{benefit_items()}</div>
  </div>
</section>

<section class="section" data-rail>
  <div class="container">
    <div class="section-head reveal-group">
      <span class="tag">Eğitmen kadrosu</span>
      <h2 class="h2">Programını yazan kişi,<br>sahada da yanında</h2>
      <p class="lead">Her üyeye bir sorumlu eğitmen atanır. Ölçümünü o alır, programını o yazar, formunu o düzeltir.</p>
    </div>
    <div class="grid g-3 reveal-group">{trainer_cards(TRAINERS[:3])}</div>
    <div class="btn-row reveal" style="margin-top:2.5rem">
      <a class="btn btn--ghost" href="egitmenler.html"><span>Tüm kadroyu gör</span>{ARROW}</a>
    </div>
  </div>
</section>

<section class="section section--tight" data-rail>
  <div class="container">
    <div class="section-head reveal-group">
      <span class="tag">Dönüşüm hikâyeleri</span>
      <h2 class="h2">Rakamlar<br>abartmıyor</h2>
    </div>
    {story_block(*STORIES[0])}
    <div class="btn-row reveal" style="margin-top:2rem">
      <a class="btn btn--ghost" href="donusumler.html"><span>Diğer hikâyeler</span>{ARROW}</a>
    </div>
  </div>
</section>
{CTA_BAND}'''

write("index.html", head("Ana Sayfa", "Bahçelievler İzmir'de kişiye özel antrenman, reformer pilates ve beslenme desteği. Ölçümle takip edilen 6 haftalık programlar.", "index.html") + INDEX + FOOTER)

# ============================ ORTAK PARÇALAR ============================
def page_head(crumb, tag, title, lead):
    return ('<section class="page-head" data-rail>'
            '<span class="page-head__glow" aria-hidden="true"></span>'
            '<div class="container">'
            '<nav class="crumbs" aria-label="Site yolu"><a href="index.html">Ana sayfa</a> &nbsp;/&nbsp; %s</nav>'
            '<span class="tag">%s</span>'
            '<h1 class="h1" style="margin-top:.6rem"><span class="mask"><span>%s</span></span></h1>'
            '<p class="lead" style="margin-top:1.2rem">%s</p>'
            '</div></section>' % (crumb, tag, title, lead))

# ============================ HAKKIMIZDA ============================
VALUES = [
    ("Ölçmeden başlamayız", "İlk gün vücut kompozisyonu ölçümü, hareket taraması ve hedef görüşmesi yapılır. Program bu üç veriden çıkar; hazır şablon kullanılmaz."),
    ("Kalabalık bir salon iyi bir salon değildir", "Aynı saatte kabul edilen üye sayısını sınırlı tutuyoruz. Sıra beklemek antrenmanın ritmini bozar."),
    ("İlerleme görünür olmalı", "Dört haftada bir ölçüm tekrarlanır ve karşılaştırmalı rapor çıkarılır. Neyin işe yaradığını tahmin etmezsin."),
    ("Beslenme antrenmanın yarısıdır", "Diyetisyen desteği ayrı bir hizmet değil, programın parçası. İki plan aynı masada güncellenir."),
]

HAKKIMIZDA = f'''
{page_head("Hakkımızda", "2016'dan beri Bahçelievler'de",
           "Bir salon değil,<br>bir çalışma yöntemi",
           "Kuba Sports, İzmir Bahçelievler'de ölçülebilir ilerleme üzerine kurulu bir antrenman salonu. Üye sayısını değil, üyenin ilerlemesini büyütmeye çalışıyoruz.")}

<section class="section section--flush-top" data-rail>
  <div class="container">
    <div class="grid g-2" style="align-items:center;gap:2.5rem">
      {media("media reveal", "Salon içi — geniş açı", photo=photo("salon-genis-aci"))}
      <div class="reveal-group">
        <h2 class="h2">On altı yılda öğrendiğimiz<br>tek şey var</h2>
        <p class="lead" style="margin-top:1.2rem">İnsanlar salonu bırakmıyor; sonuç göremediği için bırakıyor. 2010'da açtığımızda da bugün de aynı soruyu soruyoruz: bu üye dört hafta sonra neyin değiştiğini rakamla görebilecek mi?</p>
        <p class="muted" style="margin-top:1rem;font-size:var(--fs-sm);max-width:56ch">Bu yüzden ekipman listesiyle değil, çalışma yöntemiyle anlatıyoruz kendimizi. 1250 m&sup2;'lik alanda kuvvet bölgesi, kardiyo bölgesi ve ayrı bir reformer stüdyosu var — ama asıl fark, o alanı nasıl planladığımızda.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight" data-rail>
  <div class="container">
    <div class="section-head reveal-group">
      <span class="tag">Çalışma ilkelerimiz</span>
      <h2 class="h2">Dört madde,<br>pazarlık yok</h2>
    </div>
    <div class="rows reveal-group">
      {"".join('<div class="row"><span class="row__n">%02d</span><h3 class="h3">%s</h3><p>%s</p></div>' % (i + 1, t, d) for i, (t, d) in enumerate(VALUES))}
    </div>
  </div>
</section>

<section class="panel" data-rail>
  <div class="container panel__split">
    <div class="reveal-group">
      <span class="tag">Salon</span>
      <h2 class="h2" style="margin-top:.4rem">Ne var,<br>ne kadar var</h2>
      <p class="lead" style="margin-top:1rem">Bahçelievler Mahallesi'nde, otobüs duraklarına yürüme mesafesinde. Üyelerimize ayrılmış otopark alanı mevcut.</p>
      <div class="btn-row" style="margin-top:1.8rem">
        <a class="btn btn--on-volt" href="iletisim.html"><span>Salonu görmeye gel</span>{ARROW}</a>
      </div>
    </div>
    <div class="benefits reveal-group">
      <div class="benefit"><span class="benefit__icon">{svg("target")}</span><div><h4 class="h4">1250 m&sup2; alan</h4><p>Kuvvet, kardiyo ve reformer için üç ayrı bölge. Isınma ve mobilite alanı ayrı tutulur.</p></div></div>
      <div class="benefit"><span class="benefit__icon">{svg("chart")}</span><div><h4 class="h4">Ölçüm odası</h4><p>Vücut kompozisyonu cihazı ve karşılaştırmalı raporlama. Ölçüm ücreti üyelik içinde.</p></div></div>
      <div class="benefit"><span class="benefit__icon">{svg("shield")}</span><div><h4 class="h4">Kadınlara özel reformer stüdyosu</h4><p>Reformer pilates stüdyomuz tamamen kadınlara özeldir; dersler en fazla 5 kişilik gruplarla yapılır.</p></div></div>
      <div class="benefit"><span class="benefit__icon">{svg("users")}</span><div><h4 class="h4">Sınırlı kontenjan</h4><p>Aynı seansta kabul edilen üye sayısı sabit. Ekipman beklemek programın parçası değildir.</p></div></div>
    </div>
  </div>
</section>
{CTA_BAND}'''

write("hakkimizda.html", head("Hakkımızda", "Kuba Sports, İzmir Bahçelievler'de ölçülebilir ilerleme üzerine kurulu bir antrenman salonu. Çalışma ilkelerimizi ve salonu tanıyın.", "hakkimizda.html") + HAKKIMIZDA + FOOTER)

# ============================ HİZMETLER ============================
DETAIL = {
 "performans": ["İlk gün vücut kompozisyonu ölçümü ve hareket taraması",
                "Haftada 2–4 antrenman, kişiye özel yazılmış kuvvet programı",
                "Dört haftada bir ölçüm tekrarı ve karşılaştırmalı rapor",
                "Diyetisyen görüşmesi ve beslenme planı dahil"],
 "kardiyo":    ["Nabız verisine göre ayarlanan interval seansları",
                "Koşu, kürek ve bisiklet üzerinde dönüşümlü çalışma",
                "Dayanıklılık testiyle başlar, altı haftada tekrarlanır",
                "Kuvvet programıyla birlikte veya tek başına alınabilir"],
 "pilates":    ["En fazla 5 kişilik reformer grupları",
                "Postür değerlendirmesiyle başlayan seviyelendirme",
                "Bel ve boyun şikâyeti olanlar için ayrı akış",
                "Doğum sonrası dönem için özel program"],
 "beslenme":   ["Diyetisyenle yüz yüze ilk görüşme ve alışkanlık analizi",
                "Yaşam tarzına uyarlanmış, listesiz beslenme düzeni",
                "Dört haftada bir güncelleme ve WhatsApp üzerinden takip",
                "Sporcu beslenmesi ve takviye danışmanlığı"],
}

FAQ = [
 ("Metabolizma nedir ve neden önemlidir?",
  "Metabolizma, vücudun temel fonksiyonlarını devam ettirebilmek için yaktığı enerji miktarıdır. Yemek yeme, uyuma, temizlenme ve benzeri faaliyetler sırasında vücudunuz devamlı kalori yakar."),
 ("Hiç spor yapmadım, başlayabilir miyim?",
  "Evet — üyelerimizin büyük bölümü öyle başlıyor. İlk gün ölçüm ve hareket taraması yapılır, program senin bulunduğun noktadan kurulur. İlk iki hafta teknik öğrenmeye ayrılır, ağırlık sonra gelir."),
 ("Ağrıyan bir kası çalıştırmalı mıyız?",
  "Çalıştırmamak daha doğrudur. Bacak çalıştırırsanız ve bacaklarınız “Squat” hareketinden dolayı ağrıyorsa ve o gün “Göğüs” çalışmanız varsa sorun yoktur. Fakat bacak çalışmanız varsa ve bacak kaslarınız son bacak çalışmasından sonra hâlâ ağrıyorsa, en az bir gün daha dinlenmelisiniz. Çünkü kaslarınız dinlenirken gelişir ve yenilenir."),
 ("Sakatlık geçmişim var, program yazılır mı?",
  "Yazılır. Fizyoterapi raporun veya doktor önerin varsa getir; program ona göre kurulur. Gerekirse eğitmen doğrudan fizyoterapistinle iletişime geçer."),
 ("Üyelik dondurma hakkım var mı?",
  "Var. Sağlık raporu veya şehir dışı görevlendirme durumunda üyelik dondurulabilir. Koşulları üyelik sözleşmesinde yazılı olarak paylaşıyoruz."),
 ("Beslenme desteği ayrı ücretlendiriliyor mu?",
  "6 haftalık performans programında beslenme desteği pakete dahildir. Tek başına diyetisyen desteği almak isteyenler için ayrı bir seçenek de var."),
]

def service_detail(i, sid, chip, icon, title, text):
    flip = ' style="order:2"' if i % 2 else ''
    return ('<section class="section section--tight" id="%s" data-rail><div class="container">'
            '<div class="grid g-2" style="align-items:center;gap:2.5rem">'
            '<div class="reveal-group"%s><span class="card__chip">%s</span>'
            '<h2 class="h2" style="margin-top:1rem">%s</h2>'
            '<p class="lead" style="margin-top:1rem">%s</p>'
            '<ul class="info-list" style="margin-top:1.5rem">%s</ul>'
            '<div class="btn-row" style="margin-top:1.8rem"><a class="btn" href="iletisim.html"><span>Bu programı sor</span>%s</a></div>'
            '</div>%s</div></div></section>'
            % (sid, flip, chip, title.replace("<br>", " "), text,
               "".join('<li>%s<span>%s</span></li>' % (svg("badge"), d) for d in DETAIL[sid]),
               ARROW, media("media reveal", title.replace("<br>", " ") + " — fotoğraf",
                            photo=photo("hizmet-" + sid))))

HIZMETLER = (page_head("Hizmetler", "Programlar",
        "Nereden başlarsan<br>başla, ölçümle başlar",
        "Dört ana program var; hepsi aynı mantıkla işliyor. Ölç, planla, dört hafta uygula, tekrar ölç. İkisini birlikte almak da mümkün.")
    + "".join(service_detail(i, *s) for i, s in enumerate(SERVICES))
    + f'''
<section class="section" data-rail>
  <div class="container">
    <div class="section-head reveal-group">
      <span class="tag">Sık sorulanlar</span>
      <h2 class="h2">Merak edilenler</h2>
    </div>
    <div class="faq reveal-group">
      {"".join('<details><summary>%s</summary><p>%s</p></details>' % (q, a) for q, a in FAQ)}
    </div>
  </div>
</section>
{CTA_BAND}''')

write("hizmetler.html", head("Hizmetler", "Vücut performansı, kardiyo & kondisyon, reformer pilates ve beslenme desteği. Kuba Sports programlarının kapsamı ve sık sorulan sorular.", "hizmetler.html") + HIZMETLER + FOOTER)

# ============================ EĞİTMENLER ============================
EGITMENLER = f'''
{page_head("Eğitmenler", "Kadro",
           "Programını yazan kişi,<br>sahada da yanında",
           "Her üyeye bir sorumlu eğitmen atanır. Ölçümünü o alır, programını o yazar, formunu o düzeltir. Eğitmen değiştirmek istersen tek bir mesaj yeter.")}

<section class="section section--flush-top" data-rail>
  <div class="container">
    <div class="grid g-2 g-4 reveal-group">{trainer_cards(TRAINERS)}</div>
  </div>
</section>

<section class="panel" data-rail>
  <div class="container">
    <div class="reveal-group" style="max-width:62ch">
      <span class="tag">Kadroya katıl</span>
      <h2 class="h2" style="margin-top:.4rem">Eğitmen misin?</h2>
      <p class="lead" style="margin-top:1rem">Sertifikalı, program yazmayı bilen ve üyeyi adıyla tanımayı önemseyen eğitmenlerle çalışıyoruz. Özgeçmişini gönder, tanışalım.</p>
      <div class="btn-row" style="margin-top:1.8rem">
        <a class="btn btn--on-volt" href="mailto:kariyer@kubasports.com"><span>Özgeçmiş gönder</span>{ARROW}</a>
      </div>
    </div>
  </div>
</section>
{CTA_BAND}'''

write("egitmenler.html", head("Eğitmenler", "Kuba Sports eğitmen kadrosu: kuvvet, kondisyon, reformer pilates ve beslenme alanlarında sertifikalı antrenörler.", "egitmenler.html") + EGITMENLER + FOOTER)

# ============================ DÖNÜŞÜMLER ============================
DONUSUMLER = f'''
{page_head("Dönüşümler", "Üye hikâyeleri",
           "Rakamlar<br>abartmıyor",
           "Aşağıdaki ölçümler dört haftada bir alınan vücut kompozisyonu raporlarından. Fotoğraflar ve hikâyeler üyelerimizin izniyle yayımlanıyor.")}

<section class="section section--flush-top" data-rail>
  <div class="container grid" style="gap:2rem">
    {"".join(story_block(*s) for s in STORIES)}
  </div>
</section>

<section class="panel" data-rail>
  <div class="container panel__split">
    <div class="reveal-group">
      <span class="tag">Ölçüm nasıl işliyor</span>
      <h2 class="h2" style="margin-top:.4rem">Aynada değil,<br>raporda görürsün</h2>
      <p class="lead" style="margin-top:1rem">Kilo tek başına yanıltıcıdır. Yağ oranı düşerken kas kütlesi artabilir ve tartı kıpırdamaz. Bu yüzden üç değeri birlikte takip ediyoruz.</p>
    </div>
    <div class="benefits reveal-group">
      <div class="benefit"><span class="benefit__icon">{svg("chart")}</span><div><h4 class="h4">Yağ oranı</h4><p>Toplam kilodan bağımsız olarak vücut yağ yüzdesi. Programın asıl hedefi genelde bu.</p></div></div>
      <div class="benefit"><span class="benefit__icon">{svg("dumbbell")}</span><div><h4 class="h4">Kas kütlesi</h4><p>Kuvvet programının işe yarayıp yaramadığını gösteren değer. Bölgesel olarak da okunur.</p></div></div>
      <div class="benefit"><span class="benefit__icon">{svg("pulse")}</span><div><h4 class="h4">Su dengesi</h4><p>Hücre içi ve dışı su oranı. Beslenme planındaki değişikliklerin ilk göründüğü yer.</p></div></div>
      <div class="benefit"><span class="benefit__icon">{svg("clock")}</span><div><h4 class="h4">Dört haftada bir</h4><p>Daha sık ölçüm gürültü üretir, daha seyreği geç kalır. Dört hafta anlamlı farkın göründüğü aralık.</p></div></div>
    </div>
  </div>
</section>
{CTA_BAND}'''

write("donusumler.html", head("Dönüşümler", "Kuba Sports üyelerinin ölçümle belgelenmiş dönüşüm hikâyeleri ve vücut kompozisyonu takibinin nasıl işlediği.", "donusumler.html") + DONUSUMLER + FOOTER)

# ============================ İLETİŞİM ============================
ILETISIM = f'''
{page_head("İletişim", "Bize ulaş",
           "SORULARINI SOR,<br>SONRA KARAR VER",
           "Formu doldur, 24 saat içinde seni arayalım.")}

<section class="section section--flush-top" data-rail>
  <div class="container">
    <div class="grid g-2 reveal-group" style="gap:2.5rem 3.5rem;align-items:start">

      <form class="form" data-form novalidate>
        <div class="form__status" role="status" aria-live="polite"></div>

        <div class="form__2">
          <div class="field">
            <label for="ad">Ad soyad</label>
            <input id="ad" name="ad" type="text" autocomplete="name" placeholder="Adın ve soyadın" required>
            <span class="field__error">Gerekli alan</span>
          </div>
          <div class="field">
            <label for="tel">Telefon</label>
            <div class="phone"><span class="phone__prefix" aria-hidden="true">+90</span><input id="tel" name="tel" type="tel" autocomplete="tel-national" inputmode="numeric" placeholder="5XX XXX XX XX" pattern="[0-9]{{10}}" required></div>
            <span class="field__error">10 hane olmalı</span>
          </div>
        </div>

        <div class="field">
          <label for="eposta">E-posta</label>
          <input id="eposta" name="eposta" type="email" autocomplete="email" placeholder="ornek@eposta.com" required>
          <span class="field__error">Geçerli e-posta gir</span>
        </div>

        <div class="field">
          <label for="program">Hangi programla ilgileniyorsun?</label>
          <select id="program" name="program" required>
            <option value="">Seçim yap</option>
            <option>Fitness &amp; Vücut Geliştirme</option>
            <option>Reformer / Pilates</option>
            <option>Üyelik / Genel Bilgi</option>
          </select>
          <span class="field__error">Bir program seç</span>
        </div>

        <div class="field">
          <label for="mesaj">Eklemek istediklerin</label>
          <textarea id="mesaj" name="mesaj" placeholder="Hedefin, sakatlık geçmişin ya da uygun olduğun saatler…"></textarea>
          <small>İsteğe bağlı. Sakatlık geçmişin varsa yazman programı hızlandırır.</small>
        </div>

        <button class="btn" type="submit"><span>Hemen gönder</span>{ARROW}</button>
        <small class="muted" style="font-size:var(--fs-xs)">Gönderdiğin bilgiler yalnızca seninle iletişim kurmak için kullanılır.</small>
      </form>

      <div>
        <h2 class="h3">Doğrudan ulaş</h2>
        <ul class="info-list" style="margin-top:1rem">
          <li>{svg("pin")}<div><b>Adres</b><span>Bahçelievler, Zübeyde Hanım Cd.<br>35600 Karşıyaka / İzmir</span></div></li>
          <li>{svg("phone")}<div><b>Telefon</b><span><a href="tel:+905071202010">0507 120 20 10</a></span></div></li>
          <li>{svg("wa")}<div><b>WhatsApp</b><span><a href="https://wa.me/905071202010">Mesaj gönder</a></span></div></li>
          <li>{svg("mail")}<div><b>E-posta</b><span><a href="mailto:info@kubasports.com">info@kubasports.com</a></span></div></li>
          <li>{svg("clock")}<div><b>Çalışma saatleri</b><span>Hafta içi 10:00–23:00<br>Cumartesi 11:00–19:00<br>Pazar 12:00–17:00</span></div></li>
        </ul>
      </div>

    </div>

    <div class="map-block reveal">
      <div class="map-block__head">
        <span class="tag">Salonun konumu</span>
        <a class="link" href="https://www.google.com/maps/dir/?api=1&amp;destination=Kuba+Sports%2C+Bah%C3%A7elievler%2C+Z%C3%BCbeyde+Han%C4%B1m+Cd.%2C+35600+Kar%C5%9F%C4%B1yaka%2F%C4%B0zmir" target="_blank" rel="noopener"><span>Yol tarifi al</span>{ARROW}</a>
      </div>
      <div class="map-frame">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3124.000265555904!2d27.11424307643677!3d38.46455517212675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd9cfc53f481d%3A0x5aa1bc85f3036bdc!2sKuba%20Sports!5e0!3m2!1str!2str!4v1789564482717!5m2!1str!2str" title="Kuba Sports konumu — Google Haritalar" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
    </div>
  </div>
</section>
'''

write("iletisim.html", head("İletişim", "Kuba Sports Bahçelievler İzmir iletişim bilgileri, çalışma saatleri ve ücretsiz deneme dersi talep formu.", "iletisim.html") + ILETISIM + FOOTER)
