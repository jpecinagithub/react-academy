# React Fundamentals Academy

An interactive academy to **learn React by seeing it work** — bilingual
(EN/ES), client-side only, no accounts, no paywalls. Built with Vite +
React 19 + JavaScript.

> Philosophy: *Don't just explain React. Let the user see React working.*

Author: **Jon Peciña Iturbe**

---

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

Requirements: Node 18+.

## What's included (Phase 0)

- **Shell**: bilingual layout (EN/ES toggle, persisted), dark/light theme,
  learning-mode tooltips toggle, mobile navigation, footer with author credit.
- **18-module curriculum registry** (`src/data/modules.js`): Before React →
  Thinking in React, each with difficulty, icon, bilingual title/blurb.
- **Shared UI contracts** (`src/components/ui.jsx`): `SimulationShell`,
  `PageHeader`, `CodeBlock` (regex highlighter, no dep), `Callout`,
  `FlowSteps` (animated, reduced-motion safe), `Quiz`, `DifficultyBadge`,
  `ProgressRing`, `GlossaryTerm`, `Compare`, `SectionTitle`.
- **Runtimes**: `ReactRunner` (sucrase JSX transform + `new Function`,
  errors contained in an error boundary — user code can never crash the app),
  `JsConsole` (iframe-sandboxed plain JS with 3 s anti-loop timeout),
  `CodeEditor` (CodeMirror 6, lazy-loaded).
- **Pages**: Home (with manipulable live demos), Modules, Module page,
  Lab page (lazy lab loading), Playground (multi-file IDE: editor/preview,
  desktop panes + mobile tabs), Sandboxes (placeholder), Challenges
  (placeholder), Quiz page, Dashboard (progress + reset), Learning Path,
  Concept Map (interactive SVG + glossary panel), Glossary (searchable),
  Cheat Sheets (print-ready placeholders), Certificate (unlocks at 60 %,
  print/PDF via browser), About, 404.
- **Persistence**: zustand + localStorage (`rfa-store-v1`): language, theme,
  tooltip mode, lessons/labs/challenges/quizzes/sandboxes progress.
- **PWA**: `vite-plugin-pwa` — manifest, generated icons
  (`tools/make-icons.mjs`, pure-Node PNG writer), service worker with
  offline shell, installable.
- **Analytics**: `@vercel/analytics` + `@vercel/speed-insights`; page views
  and lab opens tracked automatically via the safe `track()` wrapper.
- **Example lab**: `/lab/hello-lab` proves the full lab contract end to end.
- **Content contracts**: see `docs/CONTRACTS.md` — the exact recipe later
  phases follow to add labs, lessons, quizzes, cheat sheets, sandboxes and
  challenges.

## Deploy to Vercel

1. Push this directory to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`.
   Output directory: `dist`. (Vercel detects both automatically.)
4. `vercel.json` already contains the SPA rewrite (`/(.*)` → `/index.html`)
   so deep links like `/lab/hello-lab` work, plus immutable caching for
   `/assets/*`.

No environment variables needed. No backend.

## Project structure

```
src/
  main.jsx            # router + providers + Analytics + SpeedInsights
  App.jsx             # routes (all pages lazy except Home)
  index.css           # Tailwind v4, CSS vars, dark/light, reduced-motion, print
  i18n/               # LanguageProvider, useLang, en.js/es.js (chrome strings)
  state/store.js      # zustand store (rfa-store-v1)
  components/         # ui.jsx contracts, CodeEditor.jsx, Layout.jsx
  runtime/            # ReactRunner.jsx, JsConsole.jsx
  data/               # modules.js (18), glossary.js (24 terms)
  labs/               # loader.js + _template/ + hello/ (example)
  lessons/            # loader.js + renderer.jsx + _template/
  quizzes/            # loader.js + _template/
  utils/              # markdown.jsx (markdown-lite), analytics.js, icons.jsx
  pages/              # 16 pages
tools/make-icons.mjs  # PWA icon generator (node tools/make-icons.mjs)
docs/CONTRACTS.md     # content contracts for later phases
```

## Conventions for contributors

- Feature strings live in local `const STRINGS = { en, es }` per component;
  only chrome strings go in `src/i18n/en.js|es.js`.
- Heavy deps (CodeMirror, ReactRunner, recharts) are `React.lazy` — never
  imported statically outside their own lazy boundary.
- Every lab is wrapped in `<SimulationShell labId=…>`.
- Keep `npm run build` green and `npm run lint` at 0 warnings.

## Roadmap

- **Phase 1–7**: lessons + ~30 labs per the module plan (vanilla-vs-React,
  Component Builder, JSX translator, Props Lab, State Machine Lab, Render
  Visualizer, Event Flow, Effect Lab, …).
- **Phase 8**: 25 runnable sandboxes. **Phase 9**: challenges + bug hunts.
- **Phase 10**: cheat-sheet content, final quizzes, certificate polish.
