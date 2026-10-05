import { useState, useEffect, useRef, useCallback } from 'react'
import {
  SimulationShell,
  CodeBlock,
  Callout,
  Quiz,
  SectionTitle,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  title: { en: 'Custom Hook Builder', es: 'Constructor de custom hooks' },
  intro: {
    en: 'Pick features, watch the hook assemble itself, and see it run live. Custom hooks extract stateful logic — not UI.',
    es: 'Elige funcionalidades, mira cómo el hook se ensambla solo y velo funcionar en vivo. Los custom hooks extraen lógica con estado, no UI.',
  },
  concept: {
    en: 'A custom hook is just a JavaScript function whose name starts with `use` and that calls other hooks inside it. It lets you pull reusable stateful logic — a piece of behavior — out of your components, with no UI attached. Below you assemble one feature by feature and watch it work.',
    es: 'Un custom hook es simplemente una función de JavaScript cuyo nombre empieza por `use` y que llama a otros hooks en su interior. Permite extraer lógica con estado reutilizable — un fragmento de comportamiento — fuera de tus componentes, sin UI. Abajo lo ensamblarás funcionalidad a funcionalidad y lo verás funcionar.',
  },

  pickerTitle: { en: '1 · Pick the features', es: '1 · Elige las funcionalidades' },
  pickOneHint: {
    en: 'Select at least one feature to assemble the hook.',
    es: 'Selecciona al menos una funcionalidad para ensamblar el hook.',
  },

  labelStorage: { en: 'useLocalStorage(key)', es: 'useLocalStorage(key)' },
  descStorage: {
    en: 'State that survives a page reload, synced with localStorage.',
    es: 'Estado que sobrevive a recargar la página, sincronizado con localStorage.',
  },
  commentStorage: { en: 'state persisted to localStorage', es: 'estado persistido en localStorage' },

  labelSize: { en: 'useWindowSize()', es: 'useWindowSize()' },
  descSize: {
    en: 'Live window dimensions, updated on every resize.',
    es: 'Dimensiones de la ventana en vivo, actualizadas con cada resize.',
  },
  commentSize: { en: 'live window dimensions', es: 'dimensiones de la ventana en vivo' },

  labelToggle: { en: 'useToggle()', es: 'useToggle()' },
  descToggle: {
    en: 'A boolean with a flip function — the simplest state machine.',
    es: 'Un booleano con función para invertirlo: la máquina de estados más simple.',
  },
  commentToggle: { en: 'boolean + flip function', es: 'booleano + función para invertir' },

  labelDocTitle: { en: 'useDocumentTitle()', es: 'useDocumentTitle()' },
  descDocTitle: {
    en: 'Keeps the browser tab title in sync, restoring it on unmount.',
    es: 'Mantiene sincronizado el título de la pestaña y lo restaura al desmontar.',
  },
  commentDocTitle: { en: 'syncs the tab title', es: 'sincroniza el título de la pestaña' },

  labelPrevious: { en: 'usePrevious()', es: 'usePrevious()' },
  descPrevious: {
    en: 'Remembers the previous render’s value of something that changes.',
    es: 'Recuerda el valor del render anterior de algo que cambia.',
  },
  commentPrevious: { en: 'track the previous value', es: 'sigue el valor anterior' },

  codeTitle: { en: '2 · The hook assembles itself', es: '2 · El hook se ensambla solo' },
  codeEmpty: {
    en: 'Nothing selected — the hook is an empty shell.',
    es: 'Nada seleccionado: el hook es un caparazón vacío.',
  },

  demoTitle: { en: '3 · It runs live', es: '3 · Funciona en vivo' },

  wToggle: { en: 'Toggle demo', es: 'Demo de toggle' },
  wToggleBtn: { en: 'Flip it', es: 'Invierte' },
  on: { en: 'ON', es: 'ON' },
  off: { en: 'OFF', es: 'OFF' },

  wSize: { en: 'Window size demo', es: 'Demo de tamaño de ventana' },
  wSizeHint: {
    en: 'Resize the browser window and watch.',
    es: 'Cambia el tamaño de la ventana del navegador y observa.',
  },
  pixels: { en: 'px', es: 'px' },

  wStorage: { en: 'Persisted name demo', es: 'Demo de nombre persistido' },
  wStorageLabel: { en: 'Your name', es: 'Tu nombre' },
  wStorageStored: { en: 'Stored value', es: 'Valor guardado' },
  wStorageHint: {
    en: 'Reload the page — the value survives, thanks to localStorage.',
    es: 'Recarga la página: el valor sobrevive gracias a localStorage.',
  },

  wDocTitle: { en: 'Document title demo', es: 'Demo de título del documento' },
  wDocTitleLabel: { en: 'Tab title', es: 'Título de la pestaña' },
  wDocTitleHint: {
    en: 'Look at the browser tab: the title updates as you type.',
    es: 'Mira la pestaña del navegador: el título se actualiza al escribir.',
  },

  wPrevious: { en: 'Previous value demo', es: 'Demo de valor anterior' },
  wPrevCurrent: { en: 'current', es: 'actual' },
  wPrevPrev: { en: 'previous', es: 'anterior' },
  wPrevNone: { en: '— (first render)', es: '— (primer render)' },

  poweredBy: { en: 'Powered by', es: 'Con tecnología de' },

  takeaway: {
    en: 'Custom hooks extract stateful LOGIC, not UI — they return data and functions, never JSX. The name MUST start with `use`: that is how React (and the eslint rules-of-hooks plugin) knows to treat the function as a hook and enforce the rules inside it. Logic extracted this way becomes easy to test and share between components.',
    es: 'Los custom hooks extraen LÓGICA con estado, no UI: devuelven datos y funciones, nunca JSX. El nombre DEBE empezar por `use`: así es como React (y el plugin de eslint de las reglas de los hooks) sabe que debe tratar la función como un hook y aplicar las reglas en su interior. La lógica extraída así es fácil de probar y de compartir entre componentes.',
  },

  quizTitle: { en: 'Check your understanding', es: 'Comprueba lo que aprendiste' },
  q1: {
    en: 'What can a custom hook contain?',
    es: '¿Qué puede contener un custom hook?',
  },
  q1a: { en: 'Only state — effects are not allowed', es: 'Solo estado: los efectos no están permitidos' },
  q1b: {
    en: 'Calls to other hooks plus any plain JS logic',
    es: 'Llamadas a otros hooks más cualquier lógica JS',
  },
  q1c: { en: 'JSX components only', es: 'Solo componentes JSX' },
  q1d: {
    en: 'Direct DOM manipulation, outside any effect',
    es: 'Manipulación directa del DOM, fuera de cualquier efecto',
  },
  q1Explain: {
    en: 'A custom hook is a plain function that calls other hooks (useState, useEffect…) plus whatever JS logic you need. It returns data and functions — never JSX.',
    es: 'Un custom hook es una función normal que llama a otros hooks (useState, useEffect…) más la lógica JS que necesites. Devuelve datos y funciones, nunca JSX.',
  },
  q2: {
    en: 'Why must a custom hook’s name start with `use`?',
    es: '¿Por qué el nombre de un custom hook debe empezar por `use`?',
  },
  q2a: {
    en: 'It is only a style convention, nothing breaks without it',
    es: 'Es solo una convención de estilo, nada se rompe sin ella',
  },
  q2b: {
    en: 'So React and the linter treat it as a hook and enforce the rules of hooks inside it',
    es: 'Para que React y el linter lo traten como un hook y apliquen las reglas de los hooks en su interior',
  },
  q2c: { en: 'Otherwise it cannot be imported', es: 'Si no, no se puede importar' },
  q2d: { en: 'It makes the hook run faster', es: 'Hace que el hook se ejecute más rápido' },
  q2Explain: {
    en: 'The `use` prefix is the signal the rules-of-hooks linter looks for. Without it, hook calls inside the function are invisible to the linter and the rules (top level only, same order) cannot be checked.',
    es: 'El prefijo `use` es la señal que busca el linter de las reglas de los hooks. Sin él, las llamadas a hooks dentro de la función son invisibles para el linter y no se pueden comprobar las reglas (solo en el nivel superior, siempre en el mismo orden).',
  },
}

const FEATURES = [
  {
    id: 'storage',
    hook: 'useLocalStorage',
    label: STRINGS.labelStorage,
    desc: STRINGS.descStorage,
    comment: STRINGS.commentStorage,
    line: `  const [name, setName] = useLocalStorage('rfa-demo-name', '');`,
    returns: ['name', 'setName'],
  },
  {
    id: 'size',
    hook: 'useWindowSize',
    label: STRINGS.labelSize,
    desc: STRINGS.descSize,
    comment: STRINGS.commentSize,
    line: `  const { width, height } = useWindowSize();`,
    returns: ['width', 'height'],
  },
  {
    id: 'toggle',
    hook: 'useToggle',
    label: STRINGS.labelToggle,
    desc: STRINGS.descToggle,
    comment: STRINGS.commentToggle,
    line: `  const [on, toggle] = useToggle(false);`,
    returns: ['on', 'toggle'],
  },
  {
    id: 'docTitle',
    hook: 'useDocumentTitle',
    label: STRINGS.labelDocTitle,
    desc: STRINGS.descDocTitle,
    comment: STRINGS.commentDocTitle,
    line: `  const [docTitle, setDocTitle] = useState('My dashboard');\n  useDocumentTitle(docTitle);`,
    returns: ['docTitle', 'setDocTitle'],
  },
  {
    id: 'previous',
    hook: 'usePrevious',
    label: STRINGS.labelPrevious,
    desc: STRINGS.descPrevious,
    comment: STRINGS.commentPrevious,
    line: `  const [count, setCount] = useState(0);\n  const prevCount = usePrevious(count);`,
    returns: ['count', 'setCount', 'prevCount'],
  },
]

// ---------------------------------------------------------------------------
// The real hooks. These exact implementations power the live demo below —
// and the assembled code above mirrors them line by line.
// ---------------------------------------------------------------------------

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue // corrupted entry → fall back gracefully
    }
  })
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked → the state still works in memory
    }
  }, [key, value])
  return [value, setValue]
}

function useWindowSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window === 'undefined' ? 0 : window.innerWidth,
    height: typeof window === 'undefined' ? 0 : window.innerHeight,
  }))
  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue((v) => !v), [])
  return [value, toggle, setValue]
}

function useDocumentTitle(title) {
  const original = useRef(null)
  useEffect(() => {
    if (original.current === null) original.current = document.title
    if (title != null) document.title = title
    return () => {
      document.title = original.current // restore on unmount / change
    }
  }, [title])
}

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

// ---------------------------------------------------------------------------

function buildCode(selected, t) {
  const chosen = FEATURES.filter((f) => selected.has(f.id))
  const body = chosen
    .map((f) => `  // ${t(f.comment)}\n${f.line}`)
    .join('\n\n')
  const returns = chosen.flatMap((f) => f.returns).join(', ')
  const inner = chosen.length > 0 ? body : `  // ${t(STRINGS.codeEmpty)}`
  return [
    'function useMyHook() {',
    inner,
    '',
    `  return { ${returns} };`,
    '}',
  ].join('\n')
}

function Widget({ hook, title, children }) {
  const { t } = useLang()
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="font-semibold text-[var(--text-strong)]">{title}</h4>
        <span
          className="mono text-xs px-2 py-1 rounded bg-[var(--code-bg)] text-[var(--accent)] whitespace-nowrap"
          title={`${t(STRINGS.poweredBy)} ${hook}`}
        >
          {hook}
        </span>
      </div>
      {children}
    </div>
  )
}

function LiveDemo({ selected }) {
  const { t } = useLang()

  // Every hook is called unconditionally, in the same order, every render.
  // Only the *widgets* below are rendered conditionally (rules of hooks).
  const [name, setName] = useLocalStorage('rfa-demo-name', '')
  const { width, height } = useWindowSize()
  const [on, toggle] = useToggle(false)
  const [docTitle, setDocTitle] = useState('My dashboard')
  useDocumentTitle(selected.has('docTitle') ? docTitle : undefined)
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  const has = (id) => selected.has(id)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {has('toggle') && (
        <Widget hook="useToggle" title={t(STRINGS.wToggle)}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={toggle}
            aria-pressed={on}
          >
            {t(STRINGS.wToggleBtn)}
          </button>
          <p className="mono mt-3 text-lg" aria-live="polite">
            on = <span className="font-bold text-[var(--accent)]">{on ? t(STRINGS.on) : t(STRINGS.off)}</span>
          </p>
        </Widget>
      )}

      {has('size') && (
        <Widget hook="useWindowSize" title={t(STRINGS.wSize)}>
          <p className="text-sm text-[var(--muted)] mb-2">{t(STRINGS.wSizeHint)}</p>
          <p className="mono text-lg" aria-live="polite">
            <span className="font-bold text-[var(--accent)]">{width}</span>
            {' × '}
            <span className="font-bold text-[var(--accent)]">{height}</span>
            {' '}{t(STRINGS.pixels)}
          </p>
        </Widget>
      )}

      {has('storage') && (
        <Widget hook="useLocalStorage" title={t(STRINGS.wStorage)}>
          <label className="block text-sm font-medium text-[var(--text-strong)] mb-1" htmlFor="chb-name">
            {t(STRINGS.wStorageLabel)}
          </label>
          <input
            id="chb-name"
            type="text"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2 text-[var(--text)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada"
          />
          <p className="mono text-sm mt-2" aria-live="polite">
            {t(STRINGS.wStorageStored)}: <span className="text-[var(--accent)]">{JSON.stringify(name)}</span>
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">{t(STRINGS.wStorageHint)}</p>
        </Widget>
      )}

      {has('docTitle') && (
        <Widget hook="useDocumentTitle" title={t(STRINGS.wDocTitle)}>
          <label className="block text-sm font-medium text-[var(--text-strong)] mb-1" htmlFor="chb-title">
            {t(STRINGS.wDocTitleLabel)}
          </label>
          <input
            id="chb-title"
            type="text"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2 text-[var(--text)]"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
          <p className="text-xs text-[var(--muted)] mt-2">{t(STRINGS.wDocTitleHint)}</p>
        </Widget>
      )}

      {has('previous') && (
        <Widget hook="usePrevious" title={t(STRINGS.wPrevious)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn px-4"
              onClick={() => setCount((c) => c - 1)}
              aria-label="−1"
            >
              −
            </button>
            <button
              type="button"
              className="btn btn-primary px-4"
              onClick={() => setCount((c) => c + 1)}
              aria-label="+1"
            >
              +
            </button>
          </div>
          <p className="mono mt-3 text-lg" aria-live="polite">
            {t(STRINGS.wPrevCurrent)}:{' '}
            <span className="font-bold text-[var(--accent)]">{count}</span>
            {' · '}{t(STRINGS.wPrevPrev)}:{' '}
            <span className="font-bold text-[var(--muted)]">
              {prevCount === undefined ? t(STRINGS.wPrevNone) : prevCount}
            </span>
          </p>
        </Widget>
      )}
    </div>
  )
}

const QUIZ = [
  {
    q: STRINGS.q1,
    options: [STRINGS.q1a, STRINGS.q1b, STRINGS.q1c, STRINGS.q1d],
    answer: 1,
    explain: STRINGS.q1Explain,
  },
  {
    q: STRINGS.q2,
    options: [STRINGS.q2a, STRINGS.q2b, STRINGS.q2c, STRINGS.q2d],
    answer: 1,
    explain: STRINGS.q2Explain,
  },
]

export default function CustomHooksBuilderLab() {
  const { t } = useLang()
  const [selected, setSelected] = useState(
    () => new Set(FEATURES.map((f) => f.id))
  )

  const toggleFeature = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <SimulationShell
      labId="custom-hooks-builder"
      title={t(STRINGS.title)}
      intro={t(STRINGS.intro)}
      difficulty="intermediate"
    >
      <p className="text-[var(--text)] leading-relaxed mb-6">{t(STRINGS.concept)}</p>

      <SectionTitle>{t(STRINGS.pickerTitle)}</SectionTitle>
      <fieldset>
        <legend className="sr-only">{t(STRINGS.pickerTitle)}</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {FEATURES.map((f) => {
            const checked = selected.has(f.id)
            return (
              <label
                key={f.id}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  checked
                    ? 'border-[var(--accent)] bg-[var(--accent-dim)]'
                    : 'border-[var(--border)] bg-[var(--surface-2)]'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--accent)]"
                  checked={checked}
                  onChange={() => toggleFeature(f.id)}
                />
                <span>
                  <span className="mono font-semibold text-[var(--text-strong)]">
                    {t(f.label)}
                  </span>
                  <span className="block text-sm text-[var(--muted)] mt-1">
                    {t(f.desc)}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
      {selected.size === 0 && (
        <p className="text-sm text-[var(--muted)] mt-3" role="status">
          {t(STRINGS.pickOneHint)}
        </p>
      )}

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <CodeBlock code={buildCode(selected, t)} lang="jsx" />

      <SectionTitle>{t(STRINGS.demoTitle)}</SectionTitle>
      {selected.size === 0 ? (
        <p className="text-sm text-[var(--muted)]" role="status">
          {t(STRINGS.pickOneHint)}
        </p>
      ) : (
        <LiveDemo selected={selected} />
      )}

      <div className="mt-6">
        <Callout type="tip">{t(STRINGS.takeaway)}</Callout>
      </div>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="custom-hooks-builder" />
    </SimulationShell>
  )
}
