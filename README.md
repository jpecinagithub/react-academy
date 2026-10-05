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

## What's included (final)

- **18 modules, bilingual EN/ES**: Before React → Why React → Components →
  JSX → Props → State → Rendering → Events → Conditional & Lists → Forms →
  Effects → Data Fetching → Hooks → Context → Patterns → Internals → Tools →
  Thinking in React. Every module page lists its lessons, labs and quiz.
- **18 lessons** (one per module, data-driven via `src/lessons/`) with
  markdown-lite sections, callouts, flow diagrams, checklists and links to
  labs/quizzes.
- **32 interactive labs** (`src/labs/`): Vanilla-vs-React split screen,
  Component Builder (drag components, live component tree, highlight
  boundaries), JSX Translator, Props Lab (incl. "break the component"),
  State Machine Lab (animated event → setState → render flow), Render
  Visualizer, Event Flow Simulator, List Reconciliation Lab (with/without
  keys), Controlled Input Lab, Effect Lab (dependency-array explorer),
  Cleanup simulator, API Fetch Lab (latency/error/empty controls),
  Lifecycle Simulator, useRef / useMemo / useCallback labs, Prop-Drilling
  Visualizer → Context, Custom Hook Builder, Router simulator, Virtual DOM
  diff visualizer, Reconciliation demo, State Batching Lab, Stale Closures
  simulator, Immutability Lab, DevTools-concept inspector, Render Profiler,
  Data Flow Visualizer, "Where should state live?" game, Thinking-in-React
  board.
- **18 module quizzes** (`src/quizzes/`, 90 questions total): understanding
  over trivia — batching predictions, dependency-array choices,
  reconciliation decisions. Best score kept per quiz
  (`progress.quizzes`), instant feedback with explanations.
- **25 runnable sandboxes** (`src/sandboxes/`): Counter → Kanban board,
  Theme/Language context, useReducer, memoization… each editable with
  Code/Preview tabs on mobile.
- **22 challenges** (`src/challenges/`): fill-in-the-blank, bug hunts
  (infinite useEffect, missing key, mutating state, …), predict-the-output
  with step-by-step reveals.
- **5 guided mini-apps** (`src/miniapps/`): Todo App, Weather Dashboard,
  Expense Tracker, Movie Search, Mini Ecommerce — starter code with TODOs
  the learner completes.
- **8 cheat sheets** (`/cheatsheets`): useState, useEffect, JSX, Events,
  Arrays & Keys, Forms, React Router, Hooks overview — bilingual
  syntax tables + tips, printable individually or all at once.
- **Playground** (`/playground`): multi-file IDE (App.jsx, Counter.jsx,
  UserCard.jsx), editable + live preview, Run/Reset/Format/Copy, errors
  contained in the sandbox.
- **Progress dashboard** (`/dashboard`): overall % ring, per-module bars,
  counts of lessons/labs/challenges/quizzes, Reset Progress (with confirm).
  Totals derive from the real registries — no hardcodes.
- **Certificate** (`/certificate`): unlocks at ≥ 60 % overall progress,
  name field, print/PDF via the browser. Generated locally, no backend.
- **Learning Path** (`/path`): clickable roadmap; **Concept Map**
  (`/concepts`): interactive graph of React concepts; **Glossary**
  (`/glossary`): 24 searchable terms with definitions, examples and
  lesson links.
- **Shell**: bilingual chrome (EN/ES toggle persisted as `rfa-lang`),
  dark/light theme, learning-mode tooltips toggle, mobile navigation,
  footer with author credit.
- **Shared UI contracts** (`src/components/ui.jsx`): `SimulationShell`,
  `PageHeader`, `CodeBlock` (regex highlighter, no dep), `Callout`,
  `FlowSteps` (animated, reduced-motion safe), `Quiz`, `DifficultyBadge`,
  `ProgressRing`, `GlossaryTerm`, `Compare`, `SectionTitle`.
- **Runtimes**: `ReactRunner` (sucrase JSX transform + `new Function`,
  syntax/runtime errors render a bilingual `SandboxError` inside an error
  boundary — user code can never crash the app), `JsConsole`
  (iframe-sandboxed plain JS with 3 s anti-loop timeout), `CodeEditor`
  (CodeMirror 6, lazy-loaded).
- **Persistence**: zustand + localStorage (`rfa-store-v1`): language,
  theme, tooltip mode, lessons/labs/challenges/quizzes/sandboxes
  progress. No login, no accounts.
- **PWA**: `vite-plugin-pwa` — manifest (192/512 + maskable PNG icons),
  service worker with offline shell, installable.
- **Analytics**: `@vercel/analytics` + `@vercel/speed-insights` mounted in
  `main.jsx`; page views, lab opens, quiz finishes tracked via the safe
  `track()` wrapper (no personal data).
- **Content contracts**: `docs/CONTRACTS.md` — the recipe for adding labs,
  lessons, quizzes, cheat sheets, sandboxes and challenges.

## Deploy to Vercel

1. Push this directory to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`.
   Output directory: `dist`. (Vercel detects both automatically.)
4. `vercel.json` already contains the SPA rewrite (`/(.*)` → `/index.html`)
   so deep links like `/lab/hello-lab` work, plus immutable caching for
   `/assets/*`.

No environment variables needed. No backend.

## PWA notes

- Manifest: `public/manifest.webmanifest` (name, `start_url: /`,
  192/512 + maskable PNG icons in `public/icons/`, generated with
  `node tools/make-icons.mjs`).
- Service worker: generated by `vite-plugin-pwa` (`generateSW`,
  precache ~104 entries / ~2 MB) — `dist/sw.js` + workbox runtime.
- After the first visit the shell and all content pages work offline;
  installable from the browser via "Add to Home screen" / install prompt.
- Icon/theme updates: rerun `node tools/make-icons.mjs`, then rebuild.

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
  labs/               # loader.js + 32 labs (manifest.js + lazy Lab.jsx each)
  lessons/            # loader.js + renderer.jsx + 18 lessons (one per module)
  quizzes/            # loader.js + 18 module quizzes (90 questions)
  sandboxes/          # registry.js + items/ (25 runnable sandboxes)
  challenges/         # registry.js (22) + ChallengeView.jsx
  miniapps/           # data.js (5 guided mini-apps)
  pages/              # 17 pages (Home … About, 404)
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

## Status

All 10 phases complete: shell + contracts (0), core modules (1–7),
playground + sandbox library (8), challenges + bug hunts + predict +
mini-apps (9), module quizzes + cheat sheets + dashboard wiring + final
verification (10). `npm run build` green, `npm run lint` (oxlint) 0
warnings, all routes smoke-tested, EN/ES audited, PWA verified.
