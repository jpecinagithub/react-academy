# CONTRACTS — how later phases add content

This file is the **source of truth** for every content-adding phase.
Follow it exactly; the shell, loaders, dashboard and certificate already
depend on these shapes.

---

## 1. Adding a lab — `src/labs/<lab-id>/`

Two files, nothing else:

```
src/labs/<lab-id>/
  manifest.js   # eager metadata (tiny, synchronous)
  Lab.jsx       # the interactive lab (lazy-loaded)
```

### manifest.js

```js
export default {
  id: 'state-lab',            // kebab-case, UNIQUE. Route: /lab/<id>.
                              // Also the key in progress.labs[id].
  moduleId: 'state',          // one of src/data/modules.js ids
  title: { en: 'State Machine Lab', es: 'Laboratorio de estado' },
  intro: { en: '…', es: '…' },// 1–2 sentences shown under the title
  difficulty: 'beginner',     // 'beginner' | 'intermediate' | 'advanced'
  order: 1,                   // ordering inside the module page
  load: () => import('./Lab.jsx'),  // NEVER import Lab.jsx statically
}
```

### Lab.jsx

```jsx
import { useState, lazy, Suspense } from 'react'
import { SimulationShell, /* … */ } from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const ReactRunner = lazy(() => import('../../runtime/ReactRunner.jsx'))
const CodeEditor = lazy(() => import('../../components/CodeEditor.jsx'))
// import { BarChart } from 'recharts'  // static import is fine; recharts is
// already split into its own chunk — but prefer lazy for heavy labs.

const STRINGS = {
  // ALL feature strings live here as { en, es }. Never add them to i18n/en.js.
  title: { en: '…', es: '…' },
}

export default function MyLab() {
  const { t } = useLang()
  return (
    <SimulationShell
      labId="state-lab"          // MUST equal manifest id
      title={t(STRINGS.title)}    // caller translates; SimulationShell takes strings
      intro={t(STRINGS.intro)}
      difficulty="beginner"
    >
      {/* lab UI */}
    </SimulationShell>
  )
}
```

Rules:

- **Always** wrap in `<SimulationShell>` — it renders the title, intro,
  difficulty badge and the "Mark lab complete" button (`visitLab(labId)`).
- Heavy deps (`CodeEditor`, `ReactRunner`, `recharts` visuals) must be
  `React.lazy` — the loader eagerly reads only `manifest.js`.
- Directories starting with `_` are ignored by the loader (templates live there).
- Track notable events: `track('lab_open', { labId })` is automatic in
  `LabPage`; add custom events (e.g. `track('batching_quiz_answer', …)`)
  sparingly via `src/utils/analytics.js`.

Working example: `src/labs/hello/` (counter + FlowSteps + ReactRunner sandbox).

---

## 2. Adding a lesson — `src/lessons/<module-id>/<lesson-slug>/lesson.js`

Lessons are **data**, rendered by `<LessonRenderer>`.

```js
export default {
  id: 'state-intro',        // UNIQUE across all lessons
  moduleId: 'state',        // one of src/data/modules.js ids
  order: 1,
  title: { en: '…', es: '…' },
  sections: [
    { kind: 'text', body: { en: '…', es: '…' } },
    // markdown-lite: ### headings, - lists, **bold**, `code`, [label](url),
    // paragraphs separated by blank lines. See src/utils/markdown.jsx.
    { kind: 'code', code: 'const [c, setC] = useState(0)', lang: 'jsx' },
    { kind: 'callout', type: 'info', text: { en: '…', es: '…' } },
    // type: 'info' | 'warn' | 'tip' | 'danger'
    { kind: 'flow', steps: [
        { label: { en: 'Click', es: 'Clic' }, desc: { en: '…', es: '…' } },
    ]},
    { kind: 'checklist', items: [{ en: '…', es: '…' }] },
    { kind: 'labref', labId: 'state-lab' },   // card linking to a lab
    { kind: 'quizref', quizId: 'state' },      // card linking to module quiz
  ],
}
```

- Lesson completion: `<LessonRenderer>` renders the "Mark lesson complete"
  button itself (`completeLesson(lessonId)` → `progress.lessons[id]`).
- `_`-prefixed dirs are ignored by `src/lessons/loader.js`.

---

## 3. Adding a module quiz — `src/quizzes/<module-id>/quiz.js`

The quiz **id must equal the module id** (`/quiz/<moduleId>` links to it).

```js
export default {
  id: 'state',   // === moduleId
  title: { en: 'State quiz', es: 'Quiz de estado' },
  questions: [
    {
      q: { en: '…', es: '…' },
      options: [{ en: '…', es: '…' }, /* … */],
      answer: 1,                       // index of the correct option
      explain: { en: '…', es: '…' },   // optional, shown after answering
    },
  ],
}
```

`<Quiz questions quizId>` handles answering, instant feedback, score and
`recordQuiz(quizId, score, total)` (best score is kept).

---

## 4. Adding a cheat sheet — Phase 10

`src/pages/CheatSheets.jsx` holds the `SHEETS` array. Each sheet becomes a
print-ready card; add real content as a `content: { en, es }` markdown-lite
field and render it inside the `.print-sheet` card. Print pipeline
(`window.print()` + `@media print` in `index.css`) is already wired.

---

## 5. Adding a sandbox — Phase 8

Sandboxes are runnable mini-apps listed in `src/pages/Sandboxes.jsx`.
Contract (to be implemented): each entry `{ id, name: {en, es}, files: {...} }`
rendered with `<CodeEditor>` + `<ReactRunner>` in a tabbed Code/Preview
layout; opening one calls `visitSandbox(id)` → `progress.sandboxes[id]`.

## 6. Adding a challenge — Phase 9

Contract (to be implemented): challenge components call
`completeChallenge(challengeId)` → `progress.challenges[id]`. Categories:
fill-in-the-blank, bug hunt, predict-the-output.

---

## 7. Shared primitives — `src/components/ui.jsx`

Import from here; do not re-implement:

| Component | Props |
|---|---|
| `PageHeader` | `title, subtitle, icon?, actions?` — strings pre-translated by caller |
| `SimulationShell` | `labId, title, intro, difficulty, onDone?` — wraps every lab |
| `CodeBlock` | `code, lang?, maxHeight?` — regex-highlighted, copy button |
| `Callout` | `type="info\|warn\|tip\|danger", title?` |
| `FlowSteps` | `steps=[{label, desc?}], auto?` — sequential glow, Replay button, reduced-motion safe |
| `Quiz` | `questions, quizId, onFinish?` |
| `DifficultyBadge` | `level="beginner\|intermediate\|advanced"` |
| `ProgressRing` | `value, size?, label?` |
| `GlossaryTerm` | `term` — dotted underline + tooltip when learning mode is on |
| `Compare` | `cols=[{title, children}]` |
| `SectionTitle` | children |

---

## 8. Runtime

- `<ReactRunner code scope? runKey?>` (`src/runtime/ReactRunner.jsx`, **lazy**):
  sucrase-transforms JSX → `new Function` → renders the component named
  `App`. Exposes `React, useState, useEffect, useRef, useMemo, useCallback,
  useContext, createContext, memo, Fragment`. Syntax/runtime errors render
  `<SandboxError>` — never crash the app.
- `<JsConsole code>` (`src/runtime/JsConsole.jsx`): plain-JS runner in a
  `sandbox="allow-scripts"` iframe, postMessage protocol, 3 s timeout that
  destroys the iframe. Run button only — never auto-executes.
- `<CodeEditor>` (`src/components/CodeEditor.jsx`, **lazy**): CodeMirror 6
  wrapper. Props `value, onChange, language='jsx', height, readOnly`.

---

## 9. State & persistence — `src/state/store.js`

Single zustand store, persisted as `rfa-store-v1` (localStorage):

```js
progress: {
  lessons:    { [lessonId]: true },
  labs:       { [labId]: timestamp },
  challenges: { [challengeId]: true },
  quizzes:    { [moduleId]: { score, total, at } },  // best kept
  sandboxes:  { [sandboxId]: true },
}
```

Actions: `completeLesson, visitLab, completeChallenge, recordQuiz,
visitSandbox, resetProgress, setTheme, toggleTheme, setTooltipMode, setLang`.

**Dashboard totals must be updated** when new content types land:
`src/pages/Dashboard.jsx` and `src/pages/Certificate.jsx` hardcode
`challenges: 0, sandboxes: 0` with `// Phase 9/8` comments — replace with
real registries when they exist. `selectOverallProgress(progress, totals)`
is the single scoring function; the certificate unlocks at ≥ 60 %.

---

## 10. i18n rules

- Chrome (nav, buttons, footer, home hero): `src/i18n/en.js` / `es.js`,
  accessed via `t('nav.home')` or `t('common.run')`. `t(path, {name})`
  supports `{var}` interpolation.
- **Everything else**: local `const STRINGS = { key: { en, es } }` in the
  component, rendered with `t(STRINGS.key)`. Never put feature copy in the
  global dicts.
- Language persists as `rfa-lang` (+ store); `document.documentElement.lang`
  is set automatically.

---

## 11. Design & a11y rules

- CSS variables are the theme source (`src/index.css`); Tailwind v4 with
  `@custom-variant dark`; `.dark` class toggled on `<html>`.
- Dark is default; keep AA contrast in both themes.
- Interactive controls: real `<button>`s, `aria-label`s, visible
  `:focus-visible`. `prefers-reduced-motion` is handled globally in CSS —
  don't add decorative animation; every animation must explain something.
- Mobile-first: labs stack; playground/sandboxes use Code/Preview tabs
  under `md:` (see `Playground.jsx` pattern).
- Analytics: `track(event, data)` from `src/utils/analytics.js` —
  best-effort wrapper, never throws. Page views + lab opens are automatic.
