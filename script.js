/* Site-wide scroll choreography
   - About slider: horizontal carousel with prev/next buttons + dots.
   - Hero: mouse parallax on orbs, scroll-driven scale/opacity on title.
   - Case covers: subtle parallax translateY based on viewport center.
   - IntersectionObserver toggles body.is-light when a .case--light is visible
     (so the nav inverts on light-themed case pages). */

(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Easter egg for curious devs ---------- */
  try {
    const css = {
      sig:   'font-family: "Instrument Serif", Georgia, serif; font-style: italic; font-size: 34px; line-height: 1.1; color: #d4ff3a; padding: 6px 0;',
      head:  'font-family: Inter, system-ui, sans-serif; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #a8a7a3; padding: 8px 0 2px;',
      body:  'font-family: Inter, system-ui, sans-serif; font-size: 13px; line-height: 1.55; color: #f6f5f1; padding: 0 0 4px;',
      hint:  'font-family: Inter, system-ui, sans-serif; font-size: 12px; color: #ff7a59; padding: 4px 0 10px;',
      link:  'font-family: Inter, system-ui, sans-serif; font-size: 12px; color: #d4ff3a; padding: 1px 0;'
    };
    console.log('%cElena Meshnina', css.sig);
    console.log('%cYou opened the dev tools.', css.head);
    console.log(
      '%cOnly two kinds of people do that on a designer’s site:\n' +
      '  — fellow tinkerers who can’t resist peeking under the hood\n' +
      '  — recruiters who do their homework\n' +
      'Both are exactly the kind of people I want to hear from.',
      css.body
    );
    console.log('%c↗ hand-built, no frameworks, no tracking.', css.hint);
    console.log('%cemail    →  elena.meshnina@gmail.com', css.link);
    console.log('%clinkedin →  https://www.linkedin.com/in/elena-meshnina-862780237/', css.link);
    console.log('%ctelegram →  https://t.me/elena_m239', css.link);
  } catch (_) { /* console-styling unsupported, ignore */ }

  /* ---------- Language selector (EN / RU) ----------
     Initial language is set pre-paint by the inline <head> script, which also
     populates window.__i18n with per-page {title, desc}. Here we just wire the
     buttons: set <html lang>, persist the choice, and swap the head meta.
     Active-button styling is pure CSS off :root[lang]. */
  function initLangSwitch() {
    const KEY = 'site-lang';
    const btns = document.querySelectorAll('[data-lang-btn]');
    if (!btns.length) return;

    function apply(lang) {
      if (lang !== 'en' && lang !== 'ru') lang = 'en';
      document.documentElement.setAttribute('lang', lang);
      try { localStorage.setItem(KEY, lang); } catch (_) { /* private mode */ }
      const meta = window.__i18n && window.__i18n[lang];
      if (meta) {
        if (meta.title) document.title = meta.title;
        const md = document.querySelector('meta[name="description"]');
        if (md && meta.desc) md.setAttribute('content', meta.desc);
      }
    }

    btns.forEach((b) => {
      b.addEventListener('click', () => apply(b.getAttribute('data-lang-btn')));
    });
  }
  initLangSwitch();

  /* ---------- About horizontal slider ---------- */
  function initAboutSlider() {
    const root = document.querySelector('[data-about-slider]');
    if (!root) return;
    const viewport = root.querySelector('.about__viewport');
    const cards = Array.from(root.querySelectorAll('.about-card'));
    const dots = Array.from(root.querySelectorAll('.slider-controls__dot'));
    const prevBtn = root.querySelector('[data-dir="prev"]');
    const nextBtn = root.querySelector('[data-dir="next"]');
    if (!viewport || cards.length === 0) return;

    let active = 0;

    function setActive(idx) {
      active = idx;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      if (prevBtn) prevBtn.disabled = idx <= 0;
      if (nextBtn) nextBtn.disabled = idx >= cards.length - 1;
    }

    function scrollToCard(idx) {
      const card = cards[idx];
      if (!card) return;
      // offsetLeft is relative to the offsetParent (the track / viewport)
      viewport.scrollTo({ left: card.offsetLeft - viewport.offsetLeft, behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
      if (active > 0) scrollToCard(active - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (active < cards.length - 1) scrollToCard(active + 1);
    });
    dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToCard(i)));

    // Track which card is most visible inside the viewport, sync active state
    const io = new IntersectionObserver((entries) => {
      // Pick the most visible card
      let best = null;
      entries.forEach((e) => {
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      });
      if (best && best.intersectionRatio > 0.55) {
        const idx = cards.indexOf(best.target);
        if (idx >= 0 && idx !== active) setActive(idx);
      }
    }, { root: viewport, threshold: [0.4, 0.6, 0.8, 1.0] });
    cards.forEach((c) => io.observe(c));

    setActive(0);

    // Keyboard support when the slider is in view
    document.addEventListener('keydown', (e) => {
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft' && active > 0) {
        scrollToCard(active - 1);
      } else if (e.key === 'ArrowRight' && active < cards.length - 1) {
        scrollToCard(active + 1);
      }
    });
  }
  initAboutSlider();


  /* ---------- Body theme switching for light cases ----------
     Pages can hardcode `<body class="is-light">` for case pages whose whole
     content is light-themed — in that case we never toggle it off, because
     the prev/next case-nav + footer sit below the .case--light section and
     would otherwise render cream-on-cream when scrolled into view. */
  const lockedLight = document.body.classList.contains('is-light');
  const lightCases = document.querySelectorAll('.case--light');
  if (lightCases.length && !lockedLight) {
    const themeObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          document.body.classList.add('is-light');
        } else if (e.intersectionRatio < 0.3) {
          const anyLight = Array.from(lightCases).some((el) => {
            const r = el.getBoundingClientRect();
            const total = r.height || 1;
            const visible = Math.max(0, Math.min(window.innerHeight, r.bottom) - Math.max(0, r.top));
            return visible / Math.min(window.innerHeight, total) > 0.5;
          });
          document.body.classList.toggle('is-light', anyLight);
        }
      });
    }, { threshold: [0.3, 0.5, 0.75] });
    lightCases.forEach((c) => themeObserver.observe(c));
  }

  /* ---------- Reveal & cover parallax ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.case').forEach((el) => revealObserver.observe(el));

  /* ---------- Generic scroll-reveal (any element with [data-reveal]) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => revealIO.observe(el));
  }

  /* ---------- Scroll-driven mesh background + hero parallax ----------
     Drives two CSS custom props on .bg-mesh:
       --mesh-hue   : hue rotation in degrees, looped through the scroll range
       --mesh-shift : 0..1, used to translateY the mesh inner layer
     Also translates any [data-parallax] element by (scrollY * factor). */
  const bgMesh = document.querySelector('[data-bg-mesh]');
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if ((bgMesh || parallaxEls.length) && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const t = Math.min(1, y / max);
      if (bgMesh) {
        bgMesh.style.setProperty('--mesh-hue', (t * 120).toFixed(2) + 'deg');
        bgMesh.style.setProperty('--mesh-shift', t.toFixed(4));
      }
      parallaxEls.forEach((el) => {
        const factor = parseFloat(el.dataset.parallax) || 0;
        el.style.transform = `translate3d(0, ${(y * factor).toFixed(2)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  if (!reduceMotion) {
    /* Case-cover parallax */
    const covers = document.querySelectorAll('.case__cover img');
    if (covers.length) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          covers.forEach((img) => {
            const rect = img.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;
            const center = rect.top + rect.height / 2 - window.innerHeight / 2;
            const offset = center * -0.06;
            img.style.transform = `translateY(${offset}px) scale(1.02)`;
          });
          ticking = false;
        });
      }, { passive: true });
    }
  }
  /* ---------- Portfolio works-index: hover/focus swaps preview slide ---------- */
  function initWorksIndex() {
    const root = document.querySelector('[data-works-index]');
    if (!root) return;
    const items = Array.from(root.querySelectorAll('.works-item'));
    const slides = Array.from(root.querySelectorAll('.works-preview__slide'));
    if (!items.length || !slides.length) return;

    function activate(slug) {
      items.forEach((el) => el.classList.toggle('is-active', el.dataset.preview === slug));
      slides.forEach((el) => el.classList.toggle('is-active', el.dataset.slide === slug));
    }

    items.forEach((el) => {
      el.addEventListener('mouseenter', () => activate(el.dataset.preview));
      el.addEventListener('focus', () => activate(el.dataset.preview));
    });
  }
  initWorksIndex();

  /* ---------- Lightbox for case-page images ---------- */
  function initLightbox() {
    const selectors = '.case-flow__visual img, .case__cover img, .concepts-grid figure img, .case-zoom img';
    const triggers = document.querySelectorAll(selectors);
    if (!triggers.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML = `
      <button class="lightbox__close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
      <img class="lightbox__img" alt="" />
    `;
    document.body.appendChild(overlay);
    const img = overlay.querySelector('.lightbox__img');
    const closeBtn = overlay.querySelector('.lightbox__close');

    function open(src, alt) {
      img.src = src;
      img.alt = alt || '';
      overlay.classList.add('is-open');
      document.body.classList.add('lightbox-open');
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
    }

    triggers.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(el.currentSrc || el.src, el.alt);
      });
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === img || e.target === closeBtn || closeBtn.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }
  initLightbox();
})();
