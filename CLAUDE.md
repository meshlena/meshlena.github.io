# meshlena.github.io — Elena Meshnina Portfolio

Static, multi-page portfolio site for **Elena Meshnina** (UI / UX & Product Designer), deployed as **GitHub Pages at <https://meshlena.github.io/>**. Pure HTML / CSS / vanilla JS — no build step, no framework. Two top-level routes (landing, portfolio), one self-contained sub-page per case study, plus a styled `404.html`.

The site is **bilingual — English + Russian** (see *Internationalization* below). English is the authored/source language and the no-JS fallback; Russian is a full translation co-located in the markup. A nav language selector lets visitors switch; first visit auto-selects from the browser language (`ru*` → Russian, everything else → English).

> Source of truth: this site was transferred from `~/Documents/lena-site/`. The old `backup.zip` (15 MB Notion archive) is intentionally **not** committed — it's excluded via `.gitignore`.

## Project layout

The repo root *is* the deployable site — there is no `site/` subdirectory.

```
meshlena.github.io/
├── CLAUDE.md                     ← this file
├── README.md
├── index.html                    ← landing: hero (intro + 3-card carousel) → about (slider) → toolkit → contact
├── portfolio.html                ← hover-list editorial showcase of all work
├── 404.html                      ← styled not-found page (root-absolute asset links)
├── styles.css                    ← all shared styles (incl. body.is-light overrides)
├── script.js                     ← all behaviour, single IIFE
├── favicon.svg                   ← EM monogram (dark tile, lime hairline)
├── robots.txt                    ← allow-all + sitemap pointer
├── sitemap.xml                   ← all 7 routes
├── .nojekyll                     ← tell GitHub Pages to skip Jekyll
├── .github/workflows/deploy.yml  ← GitHub Pages deploy (actions/deploy-pages)
├── assets/
│   ├── avatar/portrait.jpg       ← shared (not case-specific)
│   └── og-cover.jpg              ← 1200×630 Open Graph card (cropped from tracker cover)
└── cases/                        ← one self-contained folder per case study
    ├── atlas/{index.html, assets/}        (AML triage workspace, dark theme; newest case)
    ├── dinogarten/{index.html, assets/}   (cream / Archivo; embedded styles override globals)
    ├── tracker/{index.html, assets/}      (dark theme, Red Collar internship case)
    └── concepts/{index.html, assets/}     (light theme, UI concept exercises)
```

**Four cases total, in this order** (matches the portfolio list, hero carousel, and case-num):

1. Atlas — AML triage workspace
2. Dinogarten — kindergarten daily-report web app
3. Corporate task-tracker (Red Collar)
4. UI concepts (Vika Breusova course)

Dinosadik, SberHealth, and Plant Pal were removed; don't reintroduce. Hero carousel on the index shows the first 3 only (Atlas / Dinogarten / Tracker).

## Deployment (GitHub Pages)

- **How it ships:** push to `main` → `.github/workflows/deploy.yml` uploads the repo root as the Pages artifact and deploys it via `actions/deploy-pages`. No build step; the site is served as-is.
- **One-time repo setting:** Settings → Pages → Source = **GitHub Actions**.
- `.nojekyll` (empty file at root) prevents Pages from running the files through Jekyll — important because some folders/files could otherwise be ignored or transformed.
- The deployed origin is `https://meshlena.github.io/` (a *user/org* Pages site served from the domain root). Root-absolute paths (`/styles.css`, `/favicon.svg`) therefore resolve correctly. **404.html and favicon links use root-absolute paths on purpose** so they work from any depth.
- **Do not commit** unless asked — the owner commits manually.

## SEO & social

Every page carries: `<title>`, `description`, `author`, `theme-color`, `canonical`, `favicon.svg`, and a full Open Graph + Twitter card block.

- **OG image:** `index.html` and `portfolio.html` use the shared `https://meshlena.github.io/assets/og-cover.jpg` (1200×630). Each case page uses **its own cover** as the OG image (dinogarten has no cover file, so it uses a representative screen). All absolute URLs — relative OG images don't resolve for crawlers.
- `theme-color` matches each page's background: `#0a0a0c` (dark: index, portfolio, tracker, atlas), cream (`#f6f5f1` for concepts, `#FBF1D5` for dinogarten).
- `robots.txt` allows everything and points to `sitemap.xml`; `sitemap.xml` lists all 7 routes.
- To regenerate the OG card: `sips --resampleWidth 1200 <src>.png --out w.png && sips --cropToHeightWidth 630 1200 w.png --out c.png && sips -s format jpeg -s formatOptions 82 c.png --out assets/og-cover.jpg`.
- **When adding/renaming a route**, update `sitemap.xml` and the canonical/OG `og:url` of the new page.

## URL / path conventions

Each case is a directory served as `/cases/<slug>/index.html`. **All case links are written with the explicit `index.html`** so they resolve under `file://` (which doesn't auto-serve directory index files like an HTTP server does).

Inside a case file:
- Own assets: `assets/...`
- Site stylesheet / script: `../../styles.css`, `../../script.js`
- Other pages: `../../index.html`, `../../portfolio.html`
- Sibling case (prev/next): `../<other-slug>/index.html`
- Favicon / canonical: root-absolute (`/favicon.svg`) and full URL respectively.

Inside `index.html` / `portfolio.html`:
- Case link: `cases/<slug>/index.html` (always explicit)
- Per-case asset reference: `cases/<slug>/assets/...`

## Running locally

```bash
python3 -m http.server 8765
# open http://localhost:8765/
```

Run from the repo root. The site also works opened directly via `file://` — that's why every case link is written with explicit `index.html`. (Note: root-absolute favicon/404 links resolve under HTTP/Pages, not `file://` — harmless for local dev.)

Fonts: Inter + Instrument Serif via Google Fonts. Dinogarten additionally loads Archivo at weights 400–900.

## Pages

### Shared nav (all pages)

```
[ EM ]  [ Back button (case/portfolio only) ]    Portfolio  About  Contact  |  in  gh  tg
```

- **Left** (`.nav__left`): `EM` circle mark linking to `index.html`. On `portfolio.html` and every case page, a **Back pill is rendered inline next to the logo**. On the portfolio page it reads `Back`; on case pages, `Back to portfolio`.
- **Right** (`.nav__links`): plain text links `Portfolio`, `About`, `Contact`, then a `.nav__social-group` divider with three circular SVG social icons.
- **Social URLs** (live, hardcoded in every page):
  - LinkedIn → `https://www.linkedin.com/in/elena-meshnina-862780237/`
  - GitHub  → `https://github.com/meshlena`
  - Telegram → `https://t.me/elena_m239`
- The nav inverts to dark text on cream background via `body.is-light`. See *Light-theme handling* below.
- Mobile (≤960px) hides `.nav__links`.
- **No "Elena Meshnina" wordmark, no glowing accent button** in the nav — both were tried and removed; don't reintroduce.

### Index page (`/index.html`)

In order:

1. **Animated mesh-gradient background** (`<div class="bg-mesh">`, first child of body) — scroll-driven hue + drift layers behind transparent sections.
2. **Nav** — fixed, blurred.
3. **Hero** — two-column `.hero__layout`:
   - **Left** (`.hero__intro`): pill eyebrow (`UX / UI Product Designer`), two-line headline (`Elena` / *Meshnina* in italic serif), short lede paragraph, single `Get in touch` CTA (mailto).
   - **Right** (`.hero__work`): vertical scroll-snap carousel of the first 3 cases (Atlas / Dinogarten / Tracker). Each card is an `<a class="work-card">` linking to the case page. Carousel ends with a `Full portfolio →` pill.
   - The Dinogarten card uses a special `.work-card--dinogarten` modifier with `.work-card__media--hero-art` — yellow gradient + two phone screens.
   - **No entry animations** on the headline, lede, CTA, or work cards. Hover transforms remain.
4. **About — horizontal slider** (`section.about[data-about-slider]`): portrait left; `.about__viewport` right with three `.about-card` panels (**How I work** → **Today** → **About**); `.slider-controls` pill below.
5. **Toolkit** — three skill cards (Design / UX / Tools) + serif italic marquee strip.
6. **Contact** (`#contact`) — radial-gradient background, big italic email link, then `Email · LinkedIn · Telegram`. **No phone number.**
7. **Footer**.

Removed (don't reintroduce): Experience timeline, Education/Courses/Languages, Work CTA, Scroll hint.

### Portfolio page (`/portfolio.html`)

**Hover-list editorial** layout (`.works-index`), not a mosaic grid: left a vertical `<ol class="works-list">` of case rows, right a sticky `.works-preview` pane. Hovering a row flips the matching `.works-preview__slide` to `is-active` (`initWorksIndex` in `script.js`). Dinogarten's slide uses `.works-preview__hero-art`. Mobile (≤960px) hides the preview pane; rows collapse to stacked cards with inline thumbnails.

### Case sub-pages (`cases/<slug>/index.html`)

Skeleton (tracker / concepts):

```html
<body[ class="is-light"]>            <!-- is-light hardcoded on cream-themed cases -->
<header class="nav"> … EM + Back-to-portfolio + nav links … </header>
<main class="case-page">
  <section class="case case--{dark|light|green}" data-case="...">
    <div class="case__hero"> chip + case__num + case__title (no trailing dot) + case__sub + case__cover img </div>
    <div class="case-flow"> repeated .case-flow__row (visual + text); even rows put visual right via order:2 </div>
    <!-- optional tail: .case__results | .concepts-grid -->
  </section>
  <nav class="case-nav"> prev · All work · next </nav>
</main>
<footer class="footer">…</footer>
<script src="../../script.js"></script>
```

Cases scroll **naturally** — no sticky pinning, no scroll-jacking, no slider controls inside case content. Visuals use `min-height` + `object-fit: contain` + `max-height: 70vh`.

### Prev/next chain & themes

Cyclic prev/next: **atlas → dinogarten → tracker → concepts → atlas**.

| Slug | Theme | Body class | Tail | Notes |
|---|---|---|---|---|
| `cases/dinogarten/` | custom cream (`#FBF1D5`) | `is-light` | self-contained sections | Embedded `<style>` block; Archivo headings; loads global `styles.css` for chrome |
| `cases/tracker/` | `case--dark` | — | 5-row case-flow | |
| `cases/concepts/` | `case--light` | `is-light` | `.concepts-grid` (4 figures) | |

(Atlas was added later — dark theme; see `cases/atlas/index.html` for its structure.)

### Lightbox

Clicking any image inside a case page opens a fullscreen `.lightbox` overlay (`initLightbox` in `script.js`). Selector: `.case-flow__visual img, .case__cover img, .concepts-grid figure img, .case-zoom img`. Close via × button, click-outside, click image, or Esc.

## Dinogarten case — special handling

Dinogarten keeps its own visual identity (cream `#FBF1D5`, Archivo display font, blue accents, custom UI mockups). Integrated **without rewriting its content** — its embedded `<style>` block is preserved and loaded after `styles.css` so it wins on conflicts. Critical overrides in the inline `<style>` at the top of `cases/dinogarten/index.html`:

- `main#top { padding-top: 120px !important; }` — clear the fixed nav.
- `main#top em { font-family/style/weight: inherit !important; }` — neutralize the global italic-serif `em` rule so `<em>Dinogarten</em>` stays Archivo 900.
- `main#top p, li, h1..h5, summary { color: #1D1D1F }` — global `p { color: var(--fg) }` would otherwise force cream-on-cream (invisible).
- `main#top .lede { color: #5E5E62 }`, `main#top section { padding: 32px 0; }`, `.case-nav` border tweak, and nav/footer forced back to Inter.

`<body class="is-light">` is hardcoded so nav, back pill, and case-nav read correctly on cream.

## Light-theme handling (`body.is-light`)

Three case pages set `<body class="is-light">` statically: **sber**, **concepts**, **dinogarten**. `script.js` checks for it at load. **If `is-light` is set in HTML, the IntersectionObserver does not attach** and the class is never toggled off — a tall `case--light` section would otherwise have `intersectionRatio < 0.3` and flip the class off, making the cream-text case-nav invisible on the cream body. `body.is-light` paints the body cream in `styles.css`; Dinogarten re-declares it to keep its own `#FBF1D5`.

## Scroll choreography (`script.js`)

Single IIFE, init on DOMContentLoaded: `initLangSwitch` (see *Internationalization*), `initAboutSlider`, `initWorksIndex`, `initLightbox`, light-theme observer (skipped on statically-light pages), reveal observer (`.is-visible` on `.case`), case-cover parallax. `prefers-reduced-motion` disables scroll-driven animation and the bg-mesh drift.

**Removed (don't reintroduce):** cursor-following hero-orb parallax; scroll-driven scale/opacity on `.hero__title`; sticky-pin step choreography; stagger-pop on hero `.work-card`; rise animation on `.hero__title` spans; `fadeUp` on lede/CTA; lightbox `.case-zoom` for Dinogarten. The `slider-controls` class survives — used **only** by the About slider.

## Internationalization (EN / RU)

The site is bilingual via a **dual-inline + CSS-toggle** pattern — no build step, no JSON dictionary, works under `file://`.

- **Active language = the `lang` attribute on `<html>`** (`"en"` or `"ru"`). Every page ships static `<html lang="en">` as the no-JS fallback.
- **Translatable text is co-located in the markup.** Each text-leaf wraps its content in two sibling spans, English first:
  `<p class="kicker"><span data-lang="en">Discovery</span><span data-lang="ru">Исследование</span></p>`.
  Inline markup (`<em>`, `<br>`, `<strong>`) lives **inside** the matching language span. `data-lang` goes on text leaves only — never on flex/grid containers, `<img>`, or `<svg>`.
- **One CSS rule hides the inactive language** (`styles.css`):
  `:root[lang="en"] [data-lang]:not([data-lang="en"]), :root[lang="ru"] [data-lang]:not([data-lang="ru"]) { display:none; }`. Because it's render-blocking and `lang` is set pre-paint, there's no flash of both languages.
- **Per-page inline `<head>` script (synchronous, before `</head>`)** sets `<html lang>` *before paint* from `localStorage["site-lang"]` → else `navigator.language` (`ru*` → `ru`) → else `en`. It also exposes `window.__i18n = { en:{title,desc}, ru:{title,desc} }` and swaps `document.title` + `<meta name="description">` (which can't be CSS-toggled).
- **Selector:** `.nav__lang` (`EN · RU` buttons with `data-lang-btn`) is a direct child of `<header class="nav">`, **outside** `.nav__links` so it stays visible at ≤960px where the links hide. On `404.html` (no nav) it's a `position:fixed` element. Active-button styling is pure CSS off `:root[lang]`.
- **Behaviour:** `initLangSwitch()` in `script.js` wires the buttons — set `<html lang>`, persist to `localStorage`, swap title/desc from `window.__i18n`. No reload.
- **Not translated** (intentionally identical in both languages): the `EM` monogram, email, brand/proper nouns (Dinogarten, Plant Pal, SberHealth, Red Collar, Figma, ClassDojo…), acronyms (JTBD, CJM), and `alt`/`aria-label` attributes. OG/Twitter meta stay English (crawlers don't run JS).

**When adding/editing copy:** provide both `data-lang="en"` and `data-lang="ru"` spans, keep the EN/RU span counts balanced per file, and honour the hard requirements below in *both* languages. When adding a page, copy the inline head script (with translated title/desc) and the `.nav__lang` block.

## CSS conventions (`styles.css`)

- BEM-ish (`case-flow__row`, `case__hero`, `works-item__num`, `work-card__media--hero-art`).
- Tokens at top: `--bg`, `--bg-2`, `--fg`, `--fg-dim`, `--accent` (#d4ff3a lime), `--accent-2` (#ff7a59 coral), `--serif` (Instrument Serif), `--sans` (Inter), `--maxw` 1280, fluid `--pad`, `--section-pad: clamp(48px, 8vh, 96px)`.
- Buttons: `.btn` + `.btn--solid` / `.btn--ghost` / `.btn--ghost-on-dark`.
- Theme variants: `case--dark`, `case--light` (#f6f5f1 cream), `case--green` (#102b1f).
- Italic serif `<em>` is a visual highlight inside headings — `em { font-family: var(--serif); font-style: italic; font-weight: 400; }`. **Dinogarten overrides this.**

## Image handling

- `loading="lazy" decoding="async"` on images. Convention: the **case cover stays eager** (LCP) where a `.case__cover img` exists; everything else is lazy.
- Filenames inside `assets/` are ASCII only.
- New raster: `sips -Z 1800` for PNGs; `sips -s format jpeg -s formatOptions 80 -Z 1400` for screenshots without transparency.
- Dinogarten assets under `cases/dinogarten/assets/{board,screens/new}/` aren't recompressed.

## Hard requirements (don't undo)

Explicitly requested by Elena; don't revert without asking. **These apply in both languages** (English and Russian copy alike):

- **No "Moscow" / "Москва"** anywhere in the served site.
- **No `2025` references** (nor any 4-digit year) anywhere in the served site. Internal dev docs (this file) may mention years for source attribution.
- **No years inside chips/tags/pills.**
- **No trailing dots on headings** (h1–h6). Body paragraphs keep normal punctuation.
- **No "Elena Meshnina" wordmark** in the nav — just the EM mark.
- **No glowing Portfolio button.**
- **No phone number** anywhere in the served site.
- **Cases scroll naturally** — no sticky pin, no in-case slider controls.
- **Lightbox stays in case pages only** — not on portfolio tiles or hero carousel.
- **Each case is its own page** with shared nav/footer.

## Conventions for future edits

Adding a new case = new folder under `cases/<slug>/` with its own `index.html` + `assets/`, then:
- Add a tile to `portfolio.html`'s `.works-list` (and a matching `.works-preview__slide`).
- Add a card to the index carousel if it should be featured.
- Update the prev/next chain on the two cases that bracket the new one.
- Add the route to `sitemap.xml`; set the new page's `canonical`, `og:url`, and OG image.
- Match tone: short editorial paragraphs, italic serif `<em>` for emphasis, kicker labels in caps.
- All case links from `index.html` / `portfolio.html` use the explicit `cases/<slug>/index.html` form.
- Test all 6 routes after structural changes — every `src`/`href` must resolve relative to its own file:
  ```
  /, /portfolio.html,
  /cases/atlas/index.html, /cases/dinogarten/index.html,
  /cases/tracker/index.html, /cases/concepts/index.html
  ```

## Open / deferred items

- A dedicated, branded 1200×630 OG card (text + work montage) would beat the current cropped tracker cover.
- Could add a downloadable CV PDF link in the contact section (PDF must come from Elena).
- No analytics. Add a privacy-friendly analytics snippet only if Elena wants it.
- Dinogarten case copy was authored by Elena directly (no translated Notion source).

## User context

- Owner: **Elena Meshnina** — `elena.meshnina@gmail.com`.
  - LinkedIn: <https://www.linkedin.com/in/elena-meshnina-862780237/>
  - GitHub: <https://github.com/meshlena>
  - Telegram: <https://t.me/elena_m239>
- Background: linguistics (NUST MISIS, 2011–2015) → English-for-IT instructor → product design (Yandex Practicum, Red Collar internship, currently Product Designer at Kryptonit). The linguistics background is part of the editorial framing — keep "linguist's ear for clarity"-style phrasing if rewriting.
