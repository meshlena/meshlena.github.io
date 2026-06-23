# meshlena.github.io ✨

The personal portfolio of **Elena Meshnina** — UI / UX & Product Designer.
Live and lovely at **<https://meshlena.github.io/>**.

Plain HTML, CSS, and a sprinkle of vanilla JS. No framework, no build step, no fuss — the repo root *is* the site that ships. 🚀

## What's inside

```
.
├── index.html              landing (hero · about slider · toolkit · contact)
├── portfolio.html          editorial hover-list of all the work
├── 404.html                a not-found page that's still nice to land on
├── styles.css              all the shared styles
├── script.js               all the behaviour (one tidy IIFE)
├── favicon.svg             the EM monogram mark
├── robots.txt / sitemap.xml
├── assets/                 shared bits (portrait, OG cover)
├── cases/<slug>/           one self-contained folder per case study
└── .github/workflows/      GitHub Pages deploy
```

## Two languages, zero build 🌍

The whole site speaks **English and Russian**. Both translations live side by side
in the markup, and one CSS rule hides the language you're not reading. The `EN · RU`
switch in the nav flips `<html lang>`, remembers your choice, and first-time visitors
get auto-detected from their browser. Works even straight off `file://`.

## Run it locally

```bash
python3 -m http.server 8765
# open http://localhost:8765/ and enjoy 🎉
```

Run from the repo root. It also happily opens via `file://` — that's why every case
link is written with an explicit `index.html`.

## Ship it 📦

Push to `main` → `.github/workflows/deploy.yml` publishes the repo to GitHub Pages.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
`.nojekyll` keeps Pages from running things through Jekyll.

## For the curious contributor

Peek at [`CLAUDE.md`](CLAUDE.md) for the full architecture, conventions, and the
list of hard requirements that should stay exactly as they are. 💛
