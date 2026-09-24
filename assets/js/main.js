/* =============================================================
   KUBA SPORTS — main.js
   Bağımlılık: GSAP + ScrollTrigger (yalnızca §4); §3b data/fiyatlar.js, §9 data/reviews.js verisini okur.
   Sadece transform/opacity animasyonları.
   ============================================================= */
(function () {
  'use strict';

  /* Hareket azaltma tek yerden yönetilir: <head> betiği HONOR_REDUCED_MOTION
     true iken ve işletim sistemi hareketi azalt bildiriyorsa html.reduce ekler.
     Varsayılan false — burada matchMedia OKUNMAZ, aksi halde Windows'ta
     "Animasyon efektleri" kapalı olan her makinede tüm hareket sessizce kapanır. */
  var reduced = document.documentElement.classList.contains('reduce');
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Üst bar: kaydırınca daralt ---------- */
  var header = $('.site-header');
  if (header) {
    var stuck = false;
    var onScrollHeader = function () {
      var should = window.scrollY > 24;
      if (should !== stuck) { stuck = should; header.classList.toggle('is-stuck', should); }
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  /* ---------- 2. Mobil menü ---------- */
  var burger = $('.burger');
  var drawer = $('.drawer');
  if (burger && drawer) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
    };
    setNav(false);
    burger.addEventListener('click', function () {
      setNav(!document.body.classList.contains('nav-open'));
    });
    $$('a, button', drawer).forEach(function (el) {
      el.addEventListener('click', function () { setNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setNav(false);
        burger.focus();
      }
    });
  }

  /* ---------- 3. Hero açılış sekansı ---------- */
  var hero = $('.hero');
  if (hero) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-ready'); });
    });
  }

  /* ---------- 3b. Üyelik fiyat listesi ----------
     uyelikler.html'deki [data-prices] kapsayıcılarını data/fiyatlar.js
     (window.KUBA_FIYATLAR) verisinden doldurur. §4'ten ÖNCE çalışır ki
     kaydırma tetikleri son yerleşime göre hesaplansın. */
  var prices = window.KUBA_FIYATLAR;
  if (prices && $('[data-prices]')) {
    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    };
    var tl = function (n) { return Number(n).toLocaleString('tr-TR') + ' TL'; };
    var ARROW_SVG = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5"/></svg>';
    var amount = function (p) {
      return '<p class="price__amount">' +
        (p.eski ? '<del><span class="sr-only">Eski fiyat: </span>' + tl(p.eski) + '</del>' : '') +
        '<strong><span class="sr-only">' + (p.eski ? 'Kampanyalı fiyat: ' : 'Fiyat: ') + '</span>' + tl(p.yeni) + '</strong></p>';
    };
    var card = function (p, chip) {
      return '<article class="card price">' +
        (chip ? '<span class="price__chip">' + esc(chip) + '</span>' : '') +
        '<h3 class="h3">' + esc(p.ad) + '</h3>' + amount(p) +
        '<div class="card__foot"><a class="link" href="iletisim.html"><span>Bilgi al</span>' + ARROW_SVG + '</a></div></article>';
    };
    var fill = function (sel, html) { var el = $(sel); if (el) el.innerHTML = html; };

    if (prices.fitness) {
      fill('[data-prices="fitness"]', prices.fitness.paketler.map(function (p) { return card(p); }).join(''));
      fill('[data-price-extras="fitness"]', (prices.fitness.ekler || []).map(function (e) {
        return '<li>' + esc(e.ad) + ': <b>' + tl(e.fiyat) + '</b></li>';
      }).join(''));
    }
    if (prices.pilates) {
      fill('[data-prices="pilates"]', prices.pilates.gruplar.map(function (g) {
        return g.paketler.map(function (p) { return card(p, g.ad); }).join('');
      }).join(''));
      var k = prices.pilates.kampanya;
      if (k) {
        fill('[data-price-promo="pilates"]',
          '<div class="price-promo__head"><span class="price-promo__badge">Kampanya</span>' +
          '<h3 class="h3">' + esc(k.ad) + '</h3><p>' + esc(k.not) + '</p></div>' +
          '<div class="grid g-2">' + k.paketler.map(function (p) { return card(p); }).join('') + '</div>');
      }
    }
    /* Notlar birden fazla yerde gösterilebilir (Fitness ve Pilates bölümlerinin altı). */
    var notesHtml = (prices.notlar || []).map(function (n) {
      return '<li>' + esc(n.replace('{gecerlilik}', prices.gecerlilik || '')) + '</li>';
    }).join('');
    $$('[data-price-notes]').forEach(function (el) { el.innerHTML = notesHtml; });
  }

  /* ---------- 4. Kaydırmada beliren bloklar (GSAP) ----------
     Hedefler: tekil .reveal ve .reveal-group'un DOĞRUDAN çocukları. Viewport'a
     giren hedefler yumuşak fade + hafif yukarı kayma ile gelir. Aynı karede
     giren hedefler ScrollTrigger.batch ile gruplanır, belge sırasına göre
     kademelenir; kademe --reveal-cap ile sınırlıdır. Bir kez çalışır.

     TRANSFORM NOTU — tween biterken clearProps:"transform" ile inline transform
     silinir. Silinmezse .card:hover gibi transform kullanan etkileşim kuralları
     inline stil tarafından ezilir. Bu, CSS §18'deki "giriş hareketi ile
     etkileşim hareketi ayrı tutulmalı" notunun JS tarafındaki karşılığıdır.

     opacity inline olarak 1'de BIRAKILIR. CSS'teki ".anim .reveal{opacity:0}"
     kuralını ezen şey odur; temizlenirse içerik yeniden kaybolur. */
  var revealTargets = $$('.reveal, .reveal-group > *');
  if (revealTargets.length) {
    var animOn  = document.documentElement.classList.contains('anim');
    var hasGsap = !!(window.gsap && window.ScrollTrigger);

    if (animOn && hasGsap && !reduced) {
      var rootStyle = getComputedStyle(document.documentElement);
      var cssNum = function (name, fallback) {
        var v = parseFloat(rootStyle.getPropertyValue(name));
        return isNaN(v) ? fallback : v;
      };
      var shift = cssNum('--reveal-shift', 30);
      var step  = cssNum('--reveal-step', 80) / 1000;
      var cap   = cssNum('--reveal-cap', 7);
      var dur   = cssNum('--t-reveal', 720) / 1000;

      gsap.registerPlugin(ScrollTrigger);
      gsap.set(revealTargets, { opacity: 0, y: shift });

      /* Açılışta zaten ekranda olan hedefler hero / sayfa başlığı
         koreografisinin ardından gelsin diye ilk karelere taban gecikme
         eklenir; taban, sayfa açıldığından beri geçen süre kadar erir. */
      var t0 = performance.now();
      var lead = $('.hero') ? 0.42 : ($('.page-head') ? 0.36 : 0);

      var byDocOrder = function (a, b) {
        return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
      };

      var playIn = function (batch) {
        var base = Math.max(0, lead - (performance.now() - t0) / 1000);
        batch.sort(byDocOrder).forEach(function (el, i) {
          if (el.__revealed) return;
          el.__revealed = true;
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: dur,
            delay: base + Math.min(i, cap) * step,
            ease: 'power3.out',
            clearProps: 'transform',
            overwrite: 'auto'
          });
        });
      };

      ScrollTrigger.batch(revealTargets, {
        start: 'top 92%',
        once: true,
        onEnter: playIn
      });

      /* Sayfa sonu emniyeti: en alttaki hedefler tetik çizgisini hiç geçemeyebilir
         (kaydıracak yer kalmaz). Dibe gelindiğinde ekranda kalan gizli hedefler
         gösterilir; yukarıdakilere dokunulmaz. */
      var atBottom = function () {
        return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      };
      var revealRest = function () {
        if (!atBottom()) return;
        var rest = revealTargets.filter(function (el) {
          if (el.__revealed) return false;
          var r = el.getBoundingClientRect();
          return r.bottom > 0 && r.top < window.innerHeight;
        });
        if (rest.length) playIn(rest);
      };
      var endTick = false;
      window.addEventListener('scroll', function () {
        if (endTick) return;
        endTick = true;
        requestAnimationFrame(function () { endTick = false; revealRest(); });
      }, { passive: true });

      /* Yazı tipi yüklenince oluşan layout kayması tetik noktalarını kaydırır. */
      window.addEventListener('load', function () { ScrollTrigger.refresh(); revealRest(); });

    } else if (animOn) {
      /* GSAP yüklenemedi (çevrimdışı ya da CDN engelli). Yedek olarak CSS'teki
         reveal-rise animasyonu devreye girer. */
      revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    }
    /* animOn false ise: html.reduce eklenmiş (HONOR_REDUCED_MOTION=true ve
       hareket azaltma açık), IntersectionObserver yok ya da <head> emniyeti
       sınıfı kaldırmış demektir. İçerik zaten görünür, dokunulmaz. */

    /* <head> içindeki 4 sn emniyet zamanlayıcısı yalnızca bu betik hiç
       çalışmazsa devreye girmeli; buraya gelindiğine göre iptal edilir. */
    if (window.__animGuard) clearTimeout(window.__animGuard);
  }

  /* ---------- 5. Sayaçlar ---------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = (el.getAttribute('data-decimals') | 0);
      if (reduced || isNaN(target)) { el.textContent = target.toFixed(decimals); return; }
      var dur = 1400, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          cio.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- 6. İlerleme rayı ---------- */
  var rail = $('.rail');
  if (rail && !reduced) {
    var fill = $('.rail__fill', rail);
    var sections = $$('[data-rail]');
    var ticks = [];

    sections.forEach(function () {
      var t = document.createElement('i');
      t.className = 'rail__tick';
      rail.appendChild(t);
      ticks.push(t);
    });

    var placeTicks = function () {
      var docH = document.documentElement.scrollHeight;
      sections.forEach(function (sec, i) {
        var top = sec.getBoundingClientRect().top + window.scrollY;
        ticks[i].style.top = (top / docH * 100).toFixed(3) + '%';
      });
    };

    var ticking = false;
    var update = function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
      fill.style.transform = 'translateX(-50%) scaleY(' + p.toFixed(4) + ')';
      var mark = window.scrollY + window.innerHeight * 0.45;
      sections.forEach(function (sec, i) {
        var top = sec.getBoundingClientRect().top + window.scrollY;
        ticks[i].classList.toggle('is-passed', mark >= top);
      });
      ticking = false;
    };

    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    placeTicks();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { placeTicks(); update(); });
    window.addEventListener('load', function () { placeTicks(); update(); });
  }

  /* ---------- 7. İletişim formu ---------- */
  var form = $('[data-form]');
  if (form) {
    var status = $('.form__status', form);

    var validate = function (input) {
      var field = input.closest('.field');
      var ok = input.checkValidity();
      if (field) field.classList.toggle('is-invalid', !ok);
      return ok;
    };

    /* Telefon: +90 kutuda sabit yazılı; alana yalnızca 10 rakam girilir.
       Yapıştırılan "+90 5xx…" ya da "05xx…" biçimleri de 10 haneye indirgenir. */
    var tel = $('input[type="tel"]', form);
    if (tel) {
      tel.addEventListener('input', function () {
        var d = tel.value.replace(/\D/g, '');
        if (d.length > 10 && d.indexOf('90') === 0) d = d.slice(2);
        if (d.charAt(0) === '0') d = d.replace(/^0+/, '');
        d = d.slice(0, 10);
        if (d !== tel.value) tel.value = d;
      });
    }

    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('is-invalid')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inputs = $$('input, select, textarea', form);
      var firstBad = null;
      inputs.forEach(function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });

      if (firstBad) {
        firstBad.focus();
        if (status) {
          status.textContent = 'Formda eksik alanlar var. İşaretli alanları tamamlayın.';
          status.classList.add('is-visible');
        }
        return;
      }

      /* Demo davranışı — form henüz hiçbir yere gönderilmiyor. Canlıda bunun
         yerine kendi form servisinizi bağlayın (Formspree, Netlify Forms,
         kendi PHP/Node uç noktanız vb.) ve bu bildirimi kaldırın.
         Girilen bilgiler silinmez; ziyaretçi WhatsApp/telefonla iletebilir. */
      if (status) {
        status.textContent = '';
        status.classList.remove('is-visible');
      }
      showDemoNotice();
    });

    var notice = null;
    var showDemoNotice = function () {
      if (!notice) {
        notice = document.createElement('dialog');
        notice.className = 'notice';
        notice.setAttribute('aria-labelledby', 'notice-title');
        notice.innerHTML =
          '<h2 class="notice__title" id="notice-title">Demo sürümü</h2>' +
          '<p class="notice__text">Bu bir demo sürümüdür, form yayına alındığında aktif olacak.</p>' +
          '<button class="btn" type="button" data-notice-close><span>Tamam</span></button>';
        document.body.appendChild(notice);
        $('[data-notice-close]', notice).addEventListener('click', function () { notice.close(); });
        notice.addEventListener('click', function (e) { if (e.target === notice) notice.close(); });   /* arka plan */
      }
      if (typeof notice.showModal === 'function') notice.showModal();
      else window.alert('Bu bir demo sürümüdür, form yayına alındığında aktif olacak.');
    };
  }

  /* ---------- 8. Footer yılı ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- 9. Google yorumları slider'ı ----------
     Veri: data/reviews.js (window.KUBA_REVIEWS). Kütüphane yok: yatay
     kaydırma + CSS scroll-snap; oklar, noktalar ve ok tuşları scrollTo ile
     sayfa atlar, mobilde parmakla sürükleme tarayıcının kendi kaydırması.
     Otomatik oynatma; fare üstündeyken, odak içerdeyken, sürüklerken, sekme
     gizliyken, bölüm ekran dışındayken ve html.reduce varken (hareket
     azaltma — bkz. dosya başındaki 'reduced' notu) durur. */
  var reviewsRoot = $('[data-reviews]');
  if (reviewsRoot) {
    var reviewsData = window.KUBA_REVIEWS;
    var reviews = reviewsData && Array.isArray(reviewsData.yorumlar)
      ? reviewsData.yorumlar.filter(function (r) { return r && r.metin; }) : [];
    var reviewsSection = reviewsRoot.closest('section');

    if (!reviews.length) {
      if (reviewsSection) reviewsSection.hidden = true;   /* veri yoksa bölüm çıkmaz */
    } else {
      var track    = $('[data-reviews-track]', reviewsRoot);
      var prevBtn  = $('[data-reviews-prev]', reviewsRoot);
      var nextBtn  = $('[data-reviews-next]', reviewsRoot);
      var dotsEl   = $('[data-reviews-dots]', reviewsRoot);
      var controls = $('[data-reviews-controls]', reviewsRoot);

      var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9Z"/></svg>';
      var esc = function (s) {
        return String(s).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
      };
      var clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };
      var starsHtml = function (lit) {
        var out = '';
        for (var i = 1; i <= 5; i++) out += i <= lit ? STAR : STAR.replace('<svg', '<svg class="is-off"');
        return out;
      };

      /* Kartlar */
      track.innerHTML = reviews.map(function (r, i) {
        var puan = clamp(Math.round(Number(r.puan) || 0), 0, 5);
        return '<li class="review" aria-label="Yorum ' + (i + 1) + ' / ' + reviews.length + '">' +
          '<div class="review__top">' +
            '<span class="stars" role="img" aria-label="5 üzerinden ' + puan + ' yıldız">' + starsHtml(puan) + '</span>' +
            '<span class="review__source"><i aria-hidden="true">G</i>Google</span>' +
          '</div>' +
          '<p class="review__text" data-review-text data-full="' + esc(r.metin) + '"></p>' +
          '<footer class="review__meta"><b>' + esc(r.ad || 'Google kullanıcısı') + '</b>' +
            (r.tarih ? '<time>' + esc(r.tarih) + '</time>' : '') +
          '</footer>' +
        '</li>';
      }).join('');

      /* Uzun yorumlar 8 satırı aşınca metin karakter bazında kırpılır ve
         kırpılan yerin hemen ardına satır içi "devamını oku" eklenir
         (ayrı bir blok değil, paragrafın kendisinin bir parçası). Tam tersi
         için tıklayınca "daha az göster" ile eski haline döner. */
      var LINE_CLAMP = 8;
      var appendMoreLink = function (el, label) {
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'review__more';
        a.setAttribute('data-review-more', '');
        a.textContent = label;
        el.appendChild(a);
      };
      var renderClampedText = function (el, expanded) {
        var full = el.getAttribute('data-full') || '';
        el.classList.toggle('is-expanded', expanded);
        if (expanded) {
          el.textContent = full + ' ';
          appendMoreLink(el, 'daha az göster');
          return;
        }
        el.textContent = full;
        var lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        var maxHeight = Math.round(lineHeight * LINE_CLAMP) + 1;
        if (el.scrollHeight <= maxHeight) return;   /* zaten 8 satıra sığıyor */
        el.style.maxHeight = maxHeight + 'px';
        el.style.overflow = 'hidden';
        var lo = 0, hi = full.length, best = 0;
        while (lo <= hi) {
          var mid = (lo + hi) >> 1;
          el.textContent = full.slice(0, mid).replace(/\s+$/, '') + '… ';
          appendMoreLink(el, 'devamını oku');
          if (el.scrollHeight <= maxHeight) { best = mid; lo = mid + 1; } else hi = mid - 1;
        }
        el.textContent = full.slice(0, best).replace(/\s+$/, '') + '… ';
        appendMoreLink(el, 'devamını oku');
        el.style.maxHeight = '';
        el.style.overflow = '';
      };
      var refreshClampedTexts = function () {
        $$('[data-review-text]', track).forEach(function (el) {
          if (!el.classList.contains('is-expanded')) renderClampedText(el, false);
        });
      };
      /* "Devamını oku / Daha az göster": kart boyu anında sıçramasın diye
         yükseklik + opaklık birlikte yumuşak geçer (reduced'ta anında). */
      var animateTextChange = function (el, expand) {
        if (reduced) { renderClampedText(el, expand); return; }
        var fromHeight = el.getBoundingClientRect().height;
        renderClampedText(el, expand);
        var toHeight = el.scrollHeight;
        el.style.transition = 'none';
        el.style.height = fromHeight + 'px';
        el.style.overflow = 'hidden';
        el.style.opacity = '.35';
        void el.offsetHeight;   /* reflow — geçiş başlangıç değerini sabitler */
        el.style.transition = 'height var(--t-move) var(--ease-out), opacity var(--t-feedback) var(--ease-out)';
        requestAnimationFrame(function () {
          el.style.height = toHeight + 'px';
          el.style.opacity = '1';
        });
        el.addEventListener('transitionend', function () {
          el.style.transition = el.style.height = el.style.overflow = el.style.opacity = '';
        }, { once: true });
      };
      track.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-review-more]');
        if (!btn) return;
        e.preventDefault();
        var textEl = btn.closest('[data-review-text]');
        if (!textEl) return;
        animateTextChange(textEl, !textEl.classList.contains('is-expanded'));
      });
      refreshClampedTexts();

      /* Özet: ortalama puan + yıldız + toplam yorum (ozet alanları boşsa listeden) */
      var ozet  = reviewsData.ozet || {};
      var avg   = typeof ozet.puan === 'number' ? ozet.puan
                : reviews.reduce(function (s, r) { return s + (Number(r.puan) || 0); }, 0) / reviews.length;
      avg = clamp(Math.round(avg * 10) / 10, 0, 5);
      var count = typeof ozet.yorumSayisi === 'number' ? ozet.yorumSayisi : reviews.length;
      var avgText = avg.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      var scoreEl = $('[data-summary-score]'), avgStarsEl = $('[data-summary-stars]'), countEl = $('[data-summary-count]');
      if (scoreEl) scoreEl.textContent = avgText;
      if (avgStarsEl) {
        avgStarsEl.style.setProperty('--fill', (avg / 5 * 100) + '%');
        avgStarsEl.innerHTML = '<span class="stars__off">' + starsHtml(0) + '</span><span class="stars__on">' + starsHtml(5) + '</span>';
        avgStarsEl.setAttribute('aria-label', '5 üzerinden ' + avgText + ' yıldız');
      }
      if (countEl) {
        countEl.innerHTML = count.toLocaleString('tr-TR') + ' Google yorumu' +
          (ozet.url ? ' · <a href="' + esc(ozet.url) + '" target="_blank" rel="noopener">Tümünü gör</a>' : '');
      }

      /* Sayfalama: bir sayfa = aynı anda görünen --n kart. Sayfa genişliği
         = görünür alan + bir boşluk (kart k, k*(kartGenişliği+boşluk)'ta başlar). */
      var perView   = function () { return Math.max(1, parseInt(getComputedStyle(reviewsRoot).getPropertyValue('--n'), 10) || 1); };
      var gapPx     = function () { return parseFloat(getComputedStyle(track).columnGap) || 0; };
      var pageCount = function () { return Math.max(1, Math.ceil(reviews.length / perView())); };
      var pageWidth = function () { return track.clientWidth + gapPx(); };
      var current = 0;

      var syncDots = function () {
        $$('button', dotsEl).forEach(function (b, i) {
          if (i === current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
        });
      };
      /* Yumuşak kaydırma tarayıcıya bırakılmaz: Windows'ta "Animasyon
         efektleri" kapalıyken (ve reduced-motion'da) Chrome/Edge CSS
         scroll-behavior:smooth ile scrollTo({behavior:'smooth'}) çağrısını
         ANINDA atlatır, kaydırma sert olur. Bu yüzden scrollLeft GSAP ile
         tween'lenir. Tween sırasında scroll-snap ve CSS scroll-behavior
         kapatılır (aksi halde her kare snap noktasına çekilir / ayrı bir
         smooth scroll başlatır); bitince geri açılır — varış noktası zaten
         bir kart başlangıcı, sıçrama olmaz. */
      var slideTween = null;
      var setInstant = function (x) {
        var prevBehavior = track.style.scrollBehavior;
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = x;
        track.style.scrollBehavior = prevBehavior;
      };
      var endTween = function () {
        if (slideTween) { slideTween.kill(); slideTween = null; }
        track.style.scrollSnapType = '';
        track.style.scrollBehavior = '';
      };
      var goTo = function (p, instant) {
        var n = pageCount();
        p = ((p % n) + n) % n;                      /* uçlarda başa/sona sar */
        var x = Math.min(track.scrollWidth - track.clientWidth, p * pageWidth());
        current = p; syncDots();                    /* nokta hemen güncellensin, kaydırmanın bitmesini beklemesin */
        endTween();
        if (instant || reduced) { setInstant(x); return; }
        if (!window.gsap) { track.scrollTo({ left: x, behavior: 'smooth' }); return; }   /* GSAP yoksa tarayıcıya bırak */
        track.style.scrollSnapType = 'none';
        track.style.scrollBehavior = 'auto';
        slideTween = gsap.to(track, {
          scrollLeft: x,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: true,
          onComplete: endTween
        });
      };
      var renderDots = function () {
        var n = pageCount(), html = '';
        for (var i = 0; i < n; i++) html += '<button type="button" aria-label="' + (i + 1) + '. grup / ' + n + '"></button>';
        dotsEl.innerHTML = html;
        controls.hidden = n <= 1;                    /* her şey sığıyorsa kontrol gereksiz */
        syncDots();
      };

      /* Kaydırma durunca (elle sürükleme dahil) aktif noktayı güncelle.
         rAF değil setTimeout: arka plandaki sekmede/panelde rAF durur. */
      var scrollT = null;
      track.addEventListener('scroll', function () {
        clearTimeout(scrollT);
        scrollT = setTimeout(function () {
          var max = track.scrollWidth - track.clientWidth;
          var p = track.scrollLeft >= max - 1 ? pageCount() - 1 : Math.round(track.scrollLeft / pageWidth());
          p = clamp(p, 0, pageCount() - 1);
          if (p !== current) { current = p; syncDots(); }
        }, 80);
      }, { passive: true });

      /* Otomatik oynatma */
      var AUTOPLAY_MS = 5000;
      var timer = null, hovered = false, focused = false, dragging = false, onScreen = true;
      var autoplayAllowed = function () {
        return !reduced && pageCount() > 1 && !hovered && !focused && !dragging && !document.hidden && onScreen;
      };
      var stopAuto  = function () { if (timer) { clearInterval(timer); timer = null; } };
      var startAuto = function () {                  /* kullanıcı müdahalesinden sonra süre baştan başlar */
        stopAuto();
        if (autoplayAllowed()) timer = setInterval(function () { goTo(current + 1); }, AUTOPLAY_MS);
      };

      prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
      nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });
      dotsEl.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        goTo($$('button', dotsEl).indexOf(b)); startAuto();
      });
      track.addEventListener('keydown', function (e) {
        var k = e.key, handled = true;
        if (k === 'ArrowRight')     goTo(current + 1);
        else if (k === 'ArrowLeft') goTo(current - 1);
        else if (k === 'Home')      goTo(0);
        else if (k === 'End')       goTo(pageCount() - 1);
        else handled = false;
        if (handled) { e.preventDefault(); startAuto(); }
      });

      /* Yalnızca gerçek fare için hover duraklatması (dokunmatikte tap
         sonrası sonsuza kadar durmasın diye pointerType kontrolü) */
      reviewsRoot.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovered = true; stopAuto(); } });
      reviewsRoot.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hovered = false; startAuto(); } });
      reviewsRoot.addEventListener('focusin',  function () { focused = true; stopAuto(); });
      reviewsRoot.addEventListener('focusout', function (e) {
        if (!reviewsRoot.contains(e.relatedTarget)) { focused = false; startAuto(); }
      });
      track.addEventListener('pointerdown',   function () { dragging = true; stopAuto(); endTween(); }, { passive: true });   /* sürükleme tween'i keser */
      track.addEventListener('pointerup',     function () { dragging = false; startAuto(); }, { passive: true });
      track.addEventListener('pointercancel', function () { dragging = false; startAuto(); }, { passive: true });
      document.addEventListener('visibilitychange', function () { document.hidden ? stopAuto() : startAuto(); });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          onScreen ? startAuto() : stopAuto();
        }, { threshold: 0.25 }).observe(reviewsRoot);
      }

      /* Kırılım değişince sayfa sayısı değişir: noktaları yenile, hizala */
      var lastN = perView(), resizeT = null;
      window.addEventListener('resize', function () {
        clearTimeout(resizeT);
        resizeT = setTimeout(function () {
          var n = perView();
          if (n !== lastN) { lastN = n; current = Math.min(current, pageCount() - 1); renderDots(); }
          refreshClampedTexts();
          goTo(current, true);
          startAuto();
        }, 150);
      });

      renderDots();
      goTo(0, true);
      startAuto();
    }
  }

  /* ---------- 10. Galeri: kategori filtresi + ışık kutusu ----------
     Sayfa: galeri.html. Filtre kareleri hidden yapar; ışık kutusu native
     <dialog> (Esc ve odak yönetimi tarayıcıdan gelir), ← → görünür kareler
     arasında gezer, arka plana tıklama kapatır. */
  var gallery = $('[data-gallery]');
  if (gallery) {
    var gItems = $$('.gallery__item', gallery);
    var visibleItems = function () { return gItems.filter(function (li) { return !li.hidden; }); };

    var filterBar = $('[data-gallery-filters]');
    if (filterBar) {
      filterBar.addEventListener('click', function (e) {
        var b = e.target.closest('[data-filter]');
        if (!b) return;
        var cat = b.getAttribute('data-filter');
        $$('[data-filter]', filterBar).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });

        /* Yeni görünecek kareler (o an gizliyken açılanlar) sayfa açılışındaki
           gibi yumuşak fade + hafif yukarı kayma ile gelsin; zaten görünür
           kalanlar tekrar oynamasın. */
        var toShow = [];
        gItems.forEach(function (li) {
          var show = cat === 'all' || li.getAttribute('data-cat') === cat;
          if (!show) { li.hidden = true; return; }
          if (li.hidden) toShow.push(li);
          li.hidden = false;
        });
        if (toShow.length && !reduced && window.gsap) {
          gsap.fromTo(toShow,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: .55, ease: 'power3.out', stagger: .045, clearProps: 'transform,opacity', overwrite: 'auto' }
          );
        }
        if (window.ScrollTrigger) ScrollTrigger.refresh();   /* sayfa boyu değişti */
      });
    }

    var box = $('[data-lightbox]');
    if (box && typeof box.showModal === 'function') {
      var boxImg = $('[data-lightbox-img]', box);
      var boxCap = $('[data-lightbox-cap]', box);
      var boxIdx = 0;
      var showSlide = function (i) {
        var list = visibleItems();
        if (!list.length) return;
        boxIdx = ((i % list.length) + list.length) % list.length;
        var a = $('a', list[boxIdx]), img = $('img', list[boxIdx]);
        boxImg.src = a.href;
        boxImg.alt = img.alt;
        boxCap.textContent = (a.getAttribute('data-caption') || img.alt) + ' · ' + (boxIdx + 1) + ' / ' + list.length;
      };
      gallery.addEventListener('click', function (e) {
        var a = e.target.closest('.gallery__item a');
        if (!a) return;
        e.preventDefault();
        showSlide(visibleItems().indexOf(a.closest('.gallery__item')));
        document.body.classList.add('lightbox-open');
        box.showModal();
      });
      /* Temizlik close olayını beklemez (olay bir sonraki görevde gelir);
         kendi kapatma yollarımız hemen temizler, close olayı yalnızca
         tarayıcının kendi Esc kapatması için yedektir. */
      var unlockBox = function () {
        document.body.classList.remove('lightbox-open');
        boxImg.removeAttribute('src');
      };
      var closeBox = function () { if (box.open) box.close(); unlockBox(); };
      $('[data-lightbox-close]', box).addEventListener('click', closeBox);
      $('[data-lightbox-prev]', box).addEventListener('click', function () { showSlide(boxIdx - 1); });
      $('[data-lightbox-next]', box).addEventListener('click', function () { showSlide(boxIdx + 1); });
      box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });   /* arka plan */
      box.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight')     { e.preventDefault(); showSlide(boxIdx + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(boxIdx - 1); }
        else if (e.key === 'Escape')    { e.preventDefault(); closeBox(); }
      });
      box.addEventListener('close', unlockBox);
    }
  }

  /* ---------- 11. Sabit WhatsApp butonu ----------
     Tüm sayfalar için tek tanım burada. Başka bir buton (ör. "Hemen ara",
     form gönder) ya da footer'ın son satırı butonun altına denk gelince
     .is-hidden ile geri çekilir. */
  (function () {
    var WA_URL = 'https://wa.me/905071202010?text=Merhaba%2C%20%C3%BCcretsiz%20deneme%20dersi%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.';
    var wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = WA_URL;
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'WhatsApp ile yazın');
    wa.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12Z"/>' +
      '<path d="M9.2 9.4c.4 2.5 2.9 5 5.4 5.4l1-1.4 1.8.8v1.4c-3.6.5-7.7-3.6-7.2-7.2h1.4l.8 1.8Z" fill="currentColor" stroke-width="1"/>' +
      '</svg>';
    document.body.appendChild(wa);

    var targets = $$('main .btn, main button[type="submit"], .footer-bottom > span');
    if (!targets.length) return;
    var ticking = false;
    var check = function () {
      ticking = false;
      var w = wa.getBoundingClientRect();
      var pad = 8;
      var hit = targets.some(function (el) {
        var r = el.getBoundingClientRect();
        return r.width && r.left < w.right + pad && r.right > w.left - pad &&
               r.top < w.bottom + pad && r.bottom > w.top - pad;
      });
      wa.classList.toggle('is-hidden', hit);
    };
    var schedule = function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    check();
  })();

})();
