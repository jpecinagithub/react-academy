// Effect Lab — pick a dependency array and watch exactly when the effect
// runs, then explore real examples (title, timer, fetch, storage, listener)
// and a guarded infinite-loop demo.
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Play,
  Square,
  RotateCcw,
  Zap,
  Timer,
  Globe,
  Database,
  Radio,
  CloudDownload,
} from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  FlowSteps,
  Quiz,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  concept: {
    en: 'Some things live outside React: the document title, timers, the network, the window. useEffect is how a component synchronizes with those external systems — after React has rendered.',
    es: 'Algunas cosas viven fuera de React: el título del documento, temporizadores, la red, la ventana. useEffect es como un componente se sincroniza con esos sistemas externos, después de que React haya renderizado.',
  },
  selectorTitle: { en: '1 · Choose the dependency array', es: '1 · Elige el array de dependencias' },
  selectorHint: {
    en: 'This is the second argument of useEffect. It answers one question: “after which renders should this effect re-run?”',
    es: 'Es el segundo argumento de useEffect. Responde a una pregunta: «¿después de qué renders debe repetirse este efecto?»',
  },
  modeNone: { en: 'No array', es: 'Sin array' },
  modeNoneDesc: { en: 'useEffect(fn) — every render', es: 'useEffect(fn): cada render' },
  modeEmpty: { en: '[]', es: '[]' },
  modeEmptyDesc: { en: 'useEffect(fn, []) — mount only', es: 'useEffect(fn, []): solo al montar' },
  modeCount: { en: '[count]', es: '[count]' },
  modeCountDesc: { en: 'useEffect(fn, [count]) — when count changes', es: 'useEffect(fn, [count]): cuando count cambia' },
  demoTitle: { en: '2 · The experiment', es: '2 · El experimento' },
  demoHint: {
    en: 'Two buttons, one truth. “+1 count” changes state; “unrelated render” re-renders without touching count. The log below is recorded by real useEffect calls.',
    es: 'Dos botones, una verdad. «+1 count» cambia el estado; «render no relacionado» re-renderiza sin tocar count. El registro lo escriben llamadas useEffect reales.',
  },
  incCount: { en: '+1 count (state change)', es: '+1 count (cambio de estado)' },
  unrelated: { en: 'Force unrelated render', es: 'Forzar render no relacionado' },
  resetLog: { en: 'Reset log', es: 'Reiniciar registro' },
  renders: { en: 'renders', es: 'renders' },
  effectRuns: { en: 'effect runs', es: 'ejecuciones del efecto' },
  logTitle: { en: 'Effect log', es: 'Registro del efecto' },
  logEmpty: {
    en: 'Press a button above — every render and every effect run will be logged here.',
    es: 'Pulsa un botón: cada render y cada ejecución del efecto quedarán registrados aquí.',
  },
  renderRow: { en: 'Render', es: 'Render' },
  effectRan: { en: 'effect RAN', es: 'el efecto SE EJECUTÓ' },
  effectSkipped: { en: 'effect SKIPPED', es: 'el efecto SE OMITIÓ' },
  skipReasonEmpty: {
    en: 'deps [] are unchanged since mount',
    es: 'las deps [] no han cambiado desde el montaje',
  },
  skipReasonCount: {
    en: 'deps [count] are unchanged since the last run',
    es: 'las deps [count] no han cambiado desde la última ejecución',
  },
  mountNote: {
    en: 'Switching strategy remounts the demo component — like rewriting the effect in your editor.',
    es: 'Cambiar de estrategia desmonta el componente demo, como reescribir el efecto en tu editor.',
  },
  loopTitle: { en: '3 · The infinite loop (guarded)', es: '3 · El bucle infinito (controlado)' },
  loopHint: {
    en: 'An effect with no dependency array that calls setState re-runs after every render — forever. This demo stops itself at 8 iterations so the page survives.',
    es: 'Un efecto sin array de dependencias que llama a setState se repite tras cada render, para siempre. Esta demo se detiene sola a las 8 iteraciones para que la página sobreviva.',
  },
  startLoop: { en: 'Start the loop', es: 'Iniciar el bucle' },
  stopLoop: { en: 'Stop', es: 'Detener' },
  loopGuard: {
    en: 'Guard stopped it at 8 iterations. Without the guard, this would render forever.',
    es: 'El guardián lo detuvo a las 8 iteraciones. Sin él, esto renderizaría para siempre.',
  },
  loopIteration: { en: 'iteration', es: 'iteración' },
  examplesTitle: { en: '4 · Effects in the wild', es: '4 · Efectos en la naturaleza' },
  examplesHint: {
    en: 'Five real patterns. Each one is a live component — open its code and check why its dependency array looks the way it does.',
    es: 'Cinco patrones reales. Cada uno es un componente vivo: abre su código y comprueba por qué su array de dependencias es así.',
  },
  challengeTitle: { en: '5 · Challenge', es: '5 · Reto' },
  afterRender: {
    en: 'Effects run AFTER render — React paints the UI first, then synchronizes with the outside world.',
    es: 'Los efectos se ejecutan DESPUÉS del render: React pinta la UI primero y luego se sincroniza con el mundo exterior.',
  },
  // example tabs
  exTitle: { en: 'Document title', es: 'Título del documento' },
  exTimer: { en: 'Timer', es: 'Temporizador' },
  exFetch: { en: 'Simulated fetch', es: 'Fetch simulado' },
  exStorage: { en: 'localStorage', es: 'localStorage' },
  exListener: { en: 'Window listener', es: 'Listener de ventana' },
  mount: { en: 'Mount demo', es: 'Montar demo' },
  unmount: { en: 'Unmount demo', es: 'Desmontar demo' },
  docTitleNow: { en: 'document.title is now:', es: 'document.title ahora es:' },
  docNote: {
    en: 'Deps [n]: re-sync the title only when n changes. Cleanup restores the previous title on unmount.',
    es: 'Deps [n]: re-sincroniza el título solo cuando n cambia. La limpieza restaura el título anterior al desmontar.',
  },
  timerStart: { en: 'Start', es: 'Iniciar' },
  timerStop: { en: 'Stop', es: 'Detener' },
  timerNote: {
    en: 'Deps [running]: the interval is created when running turns true, destroyed by the cleanup when it turns false. Forget the cleanup and timers pile up.',
    es: 'Deps [running]: el intervalo se crea cuando running pasa a true y la limpieza lo destruye al pasar a false. Sin limpieza, los temporizadores se acumulan.',
  },
  seconds: { en: 'seconds elapsed', es: 'segundos transcurridos' },
  fetchBtn: { en: 'Fetch user', es: 'Cargar usuario' },
  fetchIdle: { en: 'idle — press the button', es: 'en espera: pulsa el botón' },
  fetchLoading: { en: 'loading… (cleanup would abort this)', es: 'cargando… (la limpieza abortaría esto)' },
  fetchNote: {
    en: 'Deps [requestId]: fetch again only when a new request starts. The cleanup clears the pending timeout — the same idea as aborting a real fetch.',
    es: 'Deps [requestId]: repite la petición solo cuando empieza una nueva. La limpieza cancela el timeout pendiente: la misma idea que abortar un fetch real.',
  },
  storageLabel: { en: 'Your name (persisted)', es: 'Tu nombre (persistido)' },
  storageNow: { en: 'localStorage holds:', es: 'localStorage contiene:' },
  storageNote: {
    en: 'Deps [name]: write to storage only when name changes. Reload the page — the value survives.',
    es: 'Deps [name]: escribe solo cuando name cambia. Recarga la página: el valor sobrevive.',
  },
  listenerToggle: { en: 'Listen to resize', es: 'Escuchar resize' },
  listenerOff: {
    en: 'Listener detached. Resize the window — nothing happens.',
    es: 'Listener desconectado. Redimensiona la ventana: no pasa nada.',
  },
  listenerOn: {
    en: 'Listener attached. Resize the window and watch:',
    es: 'Listener conectado. Redimensiona la ventana y observa:',
  },
  listenerNote: {
    en: 'Deps [listening]: subscribe on true, unsubscribe in the cleanup on false. A missing cleanup means duplicate listeners on every toggle.',
    es: 'Deps [listening]: suscribe en true, desuscribe en la limpieza en false. Sin limpieza, cada toggle duplica los listeners.',
  },
  on: { en: 'on', es: 'activado' },
  off: { en: 'off', es: 'desactivado' },
  width: { en: 'window width', es: 'ancho de ventana' },
  px: { en: 'px', es: 'px' },
}

const LIFECYCLE_FLOW = [
  {
    label: { en: 'Render', es: 'Render' },
    desc: { en: 'React runs your component function', es: 'React ejecuta tu función componente' },
  },
  {
    label: { en: 'Browser paints', es: 'El navegador pinta' },
    desc: { en: 'the UI updates on screen', es: 'la UI se actualiza en pantalla' },
  },
  {
    label: { en: 'Effect runs', es: 'El efecto se ejecuta' },
    desc: { en: 'only if the deps say so', es: 'solo si las dependencias lo dicen' },
  },
  {
    label: { en: 'Cleanup (before next run / unmount)', es: 'Limpieza (antes del próximo / al desmontar)' },
    desc: { en: 'the return () => {…} from the previous effect', es: 'el return () => {…} del efecto anterior' },
  },
]

/* ---------- The three honest demo variants: real useEffect calls ---------- */
function FxNone({ count, notify }) {
  const r = useRef(0)
  r.current += 1
  const n = r.current
  useEffect(() => {
    notify({ kind: 'render', n })
  })
  useEffect(() => {
    notify({ kind: 'effect', n })
  })
  return <DemoFace count={count} />
}
function FxEmpty({ count, notify }) {
  const r = useRef(0)
  r.current += 1
  const n = r.current
  useEffect(() => {
    notify({ kind: 'render', n })
  })
  useEffect(() => {
    notify({ kind: 'effect', n })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <DemoFace count={count} />
}
function FxCount({ count, notify }) {
  const r = useRef(0)
  r.current += 1
  const n = r.current
  useEffect(() => {
    notify({ kind: 'render', n })
  })
  useEffect(() => {
    notify({ kind: 'effect', n })
  }, [count])
  return <DemoFace count={count} />
}

function DemoFace({ count }) {
  const { t } = useLang()
  return (
    <div className="rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-dim)] p-5 text-center">
      <Zap size={22} className="mx-auto text-[var(--accent)]" aria-hidden="true" />
      <p className="font-mono text-2xl font-bold text-[var(--text-strong)] mt-2">count = {count}</p>
      <p className="text-xs text-[var(--muted)] mt-1">
        {t({ en: 'demo component — re-renders on every button press', es: 'componente demo: re-renderiza con cada pulsación' })}
      </p>
    </div>
  )
}

const DEMO_CODE = {
  none: `useEffect(() => {
  log('effect ran');
}); // no array → runs after EVERY render`,
  empty: `useEffect(() => {
  log('effect ran');
}, []); // [] → runs ONCE, after mount`,
  count: `useEffect(() => {
  log('effect ran');
}, [count]); // [count] → runs when count changes`,
}

/* ---------- Guarded infinite loop ---------- */
const LOOP_MAX = 8
function LoopDemo() {
  const { t } = useLang()
  const [running, setRunning] = useState(false)
  const [iters, setIters] = useState(0)
  const guarded = iters >= LOOP_MAX

  useEffect(() => {
    if (!running) return
    if (iters < LOOP_MAX) {
      const id = setTimeout(() => setIters((i) => i + 1), 350)
      return () => clearTimeout(id)
    }
    setRunning(false)
  })

  return (
    <div className="card p-5">
      <CodeBlock
        lang="jsx"
        code={`function Broken() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1); // ← no deps: runs after EVERY render…
  });                    // …each run triggers another render. Forever.
  return <p>{count}</p>;
}`}
      />
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          type="button"
          className={running ? 'btn' : 'btn btn-primary'}
          onClick={() => {
            setIters(0)
            setRunning(true)
          }}
          disabled={running}
        >
          <Play size={15} /> {t(STRINGS.startLoop)}
        </button>
        <button type="button" className="btn" onClick={() => setRunning(false)} disabled={!running}>
          <Square size={14} /> {t(STRINGS.stopLoop)}
        </button>
        <div className="font-mono text-sm text-[var(--text-strong)]" aria-live="polite">
          {t(STRINGS.loopIteration)}: <strong style={{ color: 'var(--red)' }}>{iters}</strong> / {LOOP_MAX}
        </div>
      </div>
      <div className="mt-3 h-3 rounded-full bg-[var(--surface-3)] overflow-hidden" role="progressbar" aria-valuenow={iters} aria-valuemin={0} aria-valuemax={LOOP_MAX} aria-label={t(STRINGS.loopIteration)}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${(iters / LOOP_MAX) * 100}%`, background: 'var(--red)' }}
        />
      </div>
      {guarded && (
        <Callout type="danger" title={t({ en: 'This is what the guard prevented', es: 'Esto es lo que evitó el guardián' })}>
          {t(STRINGS.loopGuard)}
        </Callout>
      )}
      <Callout type="tip" title={t({ en: 'The fixes', es: 'Las soluciones' })}>
        <CodeBlock
          lang="jsx"
          code={`// Fix 1 — run once: give it a real dependency array
useEffect(() => { setCount(0); }, []);

// Fix 2 — only set state under a condition
useEffect(() => {
  if (count < 10) setCount(count + 1);
}, [count]);`}
        />
      </Callout>
    </div>
  )
}

/* ---------- Example 1: document.title ---------- */
function TitleSync() {
  const { t } = useLang()
  const [n, setN] = useState(0)
  const prev = useRef(null)
  if (prev.current === null && typeof document !== 'undefined') prev.current = document.title
  useEffect(() => {
    document.title = `(${n}) React Academy`
    return () => {
      document.title = prev.current
    }
  }, [n])
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn" onClick={() => setN((x) => x + 1)}>
        n = {n} (+1)
      </button>
      <p className="text-sm text-[var(--muted)]">
        {t(STRINGS.docTitleNow)}{' '}
        <code className="font-mono text-[var(--text-strong)]">({n}) React Academy</code>
      </p>
    </div>
  )
}
function TitleDemo() {
  const { t } = useLang()
  const [mounted, setMounted] = useState(false)
  return (
    <div>
      <button type="button" className="btn mb-4" onClick={() => setMounted((m) => !m)} aria-pressed={mounted}>
        {mounted ? t(STRINGS.unmount) : t(STRINGS.mount)}
      </button>
      {mounted && <TitleSync />}
      <CodeBlock
        lang="jsx"
        code={`useEffect(() => {
  document.title = \`(\${n}) React Academy\`; // sync with the outside world
  return () => { document.title = prevTitle; }; // cleanup on unmount
}, [n]);`}
      />
      <p className="text-sm text-[var(--muted)]">{t(STRINGS.docNote)}</p>
    </div>
  )
}

/* ---------- Example 2: timer ---------- */
function TimerDemo() {
  const { t } = useLang()
  const [running, setRunning] = useState(false)
  const [s, setS] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setS((x) => x + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button type="button" className={running ? 'btn' : 'btn btn-primary'} onClick={() => setRunning(true)} disabled={running}>
          <Play size={15} /> {t(STRINGS.timerStart)}
        </button>
        <button type="button" className="btn" onClick={() => { setRunning(false); setS(0) }}>
          <Square size={14} /> {t(STRINGS.timerStop)}
        </button>
        <p className="font-mono text-xl font-bold text-[var(--text-strong)]" aria-live="polite">
          {s}s <span className="text-sm font-normal text-[var(--muted)]">{t(STRINGS.seconds)}</span>
        </p>
      </div>
      <CodeBlock
        lang="jsx"
        code={`useEffect(() => {
  if (!running) return;
  const id = setInterval(() => setS((s) => s + 1), 1000);
  return () => clearInterval(id); // ← without this, intervals pile up
}, [running]);`}
      />
      <p className="text-sm text-[var(--muted)]">{t(STRINGS.timerNote)}</p>
    </div>
  )
}

/* ---------- Example 3: simulated fetch ---------- */
function FetchDemo() {
  const { t } = useLang()
  const [requestId, setRequestId] = useState(0)
  const [status, setStatus] = useState('idle')
  const [user, setUser] = useState(null)
  useEffect(() => {
    if (requestId === 0) return
    setStatus('loading')
    setUser(null)
    const id = setTimeout(() => {
      setUser({ name: 'Ada Lovelace', role: 'Pioneer of computing' })
      setStatus('done')
    }, 1400)
    return () => clearTimeout(id)
  }, [requestId])
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button type="button" className="btn btn-primary" onClick={() => setRequestId((i) => i + 1)}>
          <CloudDownload size={15} /> {t(STRINGS.fetchBtn)}
        </button>
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-full"
          style={{
            background: status === 'done' ? 'var(--green-dim)' : status === 'loading' ? 'var(--amber-dim)' : 'var(--surface-3)',
            color: status === 'done' ? 'var(--green)' : status === 'loading' ? 'var(--amber)' : 'var(--muted)',
          }}
          aria-live="polite"
        >
          {status === 'idle' && t(STRINGS.fetchIdle)}
          {status === 'loading' && t(STRINGS.fetchLoading)}
          {status === 'done' && '✓ 200 OK'}
        </span>
      </div>
      {status === 'done' && user && (
        <div className="card p-4 mb-4 max-w-sm">
          <p className="font-bold text-[var(--text-strong)]">{user.name}</p>
          <p className="text-sm text-[var(--muted)]">{user.role}</p>
        </div>
      )}
      <CodeBlock
        lang="jsx"
        code={`useEffect(() => {
  setStatus('loading');
  const id = setTimeout(() => {
    setUser(fakeUser); setStatus('done');
  }, 1400);
  return () => clearTimeout(id); // abort the "request" if unmounted
}, [requestId]);`}
      />
      <p className="text-sm text-[var(--muted)]">{t(STRINGS.fetchNote)}</p>
    </div>
  )
}

/* ---------- Example 4: localStorage ---------- */
function StorageDemo() {
  const { t } = useLang()
  const KEY = 'rfa:effect-lab:name'
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(KEY) || ''
    } catch {
      return ''
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, name)
    } catch {
      /* storage unavailable */
    }
  }, [name])
  return (
    <div>
      <label htmlFor="fx-storage" className="block text-sm font-semibold text-[var(--text-strong)] mb-1.5">
        {t(STRINGS.storageLabel)}
      </label>
      <input
        id="fx-storage"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full max-w-sm px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] text-[var(--text-strong)] mb-3"
      />
      <p className="text-sm text-[var(--muted)] mb-4">
        {t(STRINGS.storageNow)}{' '}
        <code className="font-mono text-[var(--accent)]">“{name}”</code>
      </p>
      <CodeBlock
        lang="jsx"
        code={`useEffect(() => {
  localStorage.setItem('user-name', name); // sync state → storage
}, [name]);`}
      />
      <p className="text-sm text-[var(--muted)]">{t(STRINGS.storageNote)}</p>
    </div>
  )
}

/* ---------- Example 5: window listener ---------- */
function ListenerDemo() {
  const { t } = useLang()
  const [listening, setListening] = useState(false)
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  useEffect(() => {
    if (!listening) return
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [listening])
  return (
    <div>
      <button
        type="button"
        className={listening ? 'btn' : 'btn btn-primary'}
        onClick={() => setListening((l) => !l)}
        aria-pressed={listening}
      >
        <Radio size={15} /> {t(STRINGS.listenerToggle)}: {listening ? t(STRINGS.on) : t(STRINGS.off)}
      </button>
      <p className="text-sm text-[var(--muted)] mt-3">
        {listening ? t(STRINGS.listenerOn) : t(STRINGS.listenerOff)}
      </p>
      {listening && (
        <p className="font-mono text-xl font-bold text-[var(--text-strong)] mt-1" aria-live="polite">
          {t(STRINGS.width)}: <span style={{ color: 'var(--accent)' }}>{w}</span>
          {t(STRINGS.px)}
        </p>
      )}
      <CodeBlock
        lang="jsx"
        code={`useEffect(() => {
  if (!listening) return;
  const onResize = () => setW(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, [listening]);`}
      />
      <p className="text-sm text-[var(--muted)]">{t(STRINGS.listenerNote)}</p>
    </div>
  )
}

const EXAMPLES = [
  { id: 'title', icon: Globe, label: STRINGS.exTitle, Comp: TitleDemo },
  { id: 'timer', icon: Timer, label: STRINGS.exTimer, Comp: TimerDemo },
  { id: 'fetch', icon: CloudDownload, label: STRINGS.exFetch, Comp: FetchDemo },
  { id: 'storage', icon: Database, label: STRINGS.exStorage, Comp: StorageDemo },
  { id: 'listener', icon: Radio, label: STRINGS.exListener, Comp: ListenerDemo },
]

const QUIZ = [
  {
    q: {
      en: 'When does the body of useEffect run?',
      es: '¿Cuándo se ejecuta el cuerpo de useEffect?',
    },
    options: [
      { en: 'Before React renders', es: 'Antes de que React renderice' },
      { en: 'After React renders (and paints)', es: 'Después de que React renderice (y pinte)' },
      { en: 'Only when the user clicks', es: 'Solo cuando el usuario pulsa' },
      { en: 'During the build', es: 'Durante el build' },
    ],
    answer: 1,
    explain: {
      en: 'Effects synchronize after the UI is on screen — that is why they are safe for DOM, network and timers.',
      es: 'Los efectos se sincronizan después de que la UI está en pantalla; por eso son seguros para DOM, red y temporizadores.',
    },
  },
  {
    q: {
      en: 'useEffect(() => {…}, []) runs…',
      es: 'useEffect(() => {…}, []) se ejecuta…',
    },
    options: [
      { en: 'On every render', es: 'En cada render' },
      { en: 'Once, after the first render (mount)', es: 'Una vez, tras el primer render (montaje)' },
      { en: 'Never', es: 'Nunca' },
      { en: 'Only on unmount', es: 'Solo al desmontar' },
    ],
    answer: 1,
    explain: {
      en: 'An empty array means “no dependencies to watch” → run once after mount (and clean up on unmount).',
      es: 'Un array vacío significa «nada que vigilar» → se ejecuta una vez tras el montaje (y limpia al desmontar).',
    },
  },
  {
    q: {
      en: 'An effect with NO dependency array calls setState unconditionally. What happens?',
      es: 'Un efecto SIN array de dependencias llama a setState sin condición. ¿Qué ocurre?',
    },
    options: [
      { en: 'Nothing — React ignores it', es: 'Nada: React lo ignora' },
      { en: 'It runs once', es: 'Se ejecuta una vez' },
      {
        en: 'Infinite loop: render → effect → setState → render → …',
        es: 'Bucle infinito: render → efecto → setState → render → …',
      },
      { en: 'The component unmounts', es: 'El componente se desmonta' },
    ],
    answer: 2,
    explain: {
      en: 'No array = run after every render. setState triggers a render. Fix: add a dependency array or a condition.',
      es: 'Sin array = ejecutar tras cada render. setState dispara un render. Solución: añade un array de dependencias o una condición.',
    },
  },
]

const MODES = [
  { id: 'none', label: STRINGS.modeNone, desc: STRINGS.modeNoneDesc, Comp: FxNone },
  { id: 'empty', label: STRINGS.modeEmpty, desc: STRINGS.modeEmptyDesc, Comp: FxEmpty },
  { id: 'count', label: STRINGS.modeCount, desc: STRINGS.modeCountDesc, Comp: FxCount },
]

export default function EffectLab() {
  const { t } = useLang()
  const [mode, setMode] = useState('none')
  const [count, setCount] = useState(0)
  const [tick, setTick] = useState(0)
  const [log, setLog] = useState([])
  const [example, setExample] = useState('title')

  const notify = useCallback(
    (ev) => setLog((l) => [...l.slice(-60), { ...ev }]),
    [],
  )
  const active = MODES.find((m) => m.id === mode)
  const FxComp = active.Comp

  const renders = log.filter((e) => e.kind === 'render')
  const effectRuns = log.filter((e) => e.kind === 'effect').length
  const ExampleComp = EXAMPLES.find((e) => e.id === example).Comp

  const skipReason = mode === 'empty' ? t(STRINGS.skipReasonEmpty) : t(STRINGS.skipReasonCount)

  return (
    <SimulationShell
      labId="effect-lab"
      title={t({ en: 'Effect Lab', es: 'Laboratorio de efectos' })}
      intro={t({
        en: 'The dependency array is a question React asks after every render: “did anything I care about change?” Answer it three ways and watch.',
        es: 'El array de dependencias es una pregunta que React hace tras cada render: «¿cambió algo de lo que me importa?». Respóndela de tres formas y observa.',
      })}
      difficulty="intermediate"
    >
      <p className="text-[var(--text)] mb-6 max-w-3xl">
        <GlossaryTerm term="effect">{t({ en: 'effect', es: 'efecto' })}</GlossaryTerm>{' '}
        {t(STRINGS.concept)}
      </p>
      <Callout type="info">{t(STRINGS.afterRender)}</Callout>
      <FlowSteps steps={LIFECYCLE_FLOW} />

      <SectionTitle>{t(STRINGS.selectorTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.selectorHint)}</p>
      <div className="grid sm:grid-cols-3 gap-3" role="group" aria-label={t(STRINGS.selectorTitle)}>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id)
              setLog([])
            }}
            aria-pressed={mode === m.id}
            className="text-left px-4 py-3 rounded-xl border-2 transition-colors"
            style={{
              borderColor: mode === m.id ? 'var(--accent)' : 'var(--border)',
              background: mode === m.id ? 'var(--accent-dim)' : 'var(--surface-2)',
            }}
          >
            <span className="font-mono font-bold text-[var(--text-strong)]">{t(m.label)}</span>
            <span className="block text-xs text-[var(--muted)] mt-1">{t(m.desc)}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--muted)] mt-2">{t(STRINGS.mountNote)}</p>

      <SectionTitle>{t(STRINGS.demoTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.demoHint)}</p>
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-4 items-start">
        <div>
          <FxComp key={mode} count={count} tick={tick} notify={notify} />
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" className="btn btn-primary" onClick={() => setCount((c) => c + 1)}>
              {t(STRINGS.incCount)}
            </button>
            <button type="button" className="btn" onClick={() => setTick((x) => x + 1)}>
              {t(STRINGS.unrelated)}
            </button>
            <button type="button" className="btn" onClick={() => setLog([])}>
              <RotateCcw size={14} /> {t(STRINGS.resetLog)}
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="card px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold text-[var(--text-strong)]">{renders.length}</p>
              <p className="text-xs text-[var(--muted)]">{t(STRINGS.renders)}</p>
            </div>
            <div className="card px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>{effectRuns}</p>
              <p className="text-xs text-[var(--muted)]">{t(STRINGS.effectRuns)}</p>
            </div>
          </div>
          <CodeBlock code={DEMO_CODE[mode]} lang="jsx" />
        </div>
        <div className="card p-4">
          <h3 className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.logTitle)}</h3>
          {renders.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">{t(STRINGS.logEmpty)}</p>
          ) : (
            <ol className="space-y-1.5 max-h-96 overflow-y-auto font-mono text-xs" aria-live="polite">
              {[...renders].reverse().map((r) => {
                const ran = log.some((e) => e.kind === 'effect' && e.n === r.n)
                return (
                  <li key={r.n} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2">
                    <span className="text-[var(--text-strong)] font-bold">
                      {t(STRINGS.renderRow)} #{r.n}
                    </span>
                    <span
                      className="block mt-0.5 font-semibold"
                      style={{ color: ran ? 'var(--green)' : 'var(--faint)' }}
                    >
                      {ran ? `✓ ${t(STRINGS.effectRan)}` : `○ ${t(STRINGS.effectSkipped)} — ${skipReason}`}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </div>

      <SectionTitle>{t(STRINGS.loopTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.loopHint)}</p>
      <LoopDemo />

      <SectionTitle>{t(STRINGS.examplesTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.examplesHint)}</p>
      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label={t(STRINGS.examplesTitle)}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            type="button"
            role="tab"
            aria-selected={example === ex.id}
            onClick={() => setExample(ex.id)}
            className={example === ex.id ? 'btn btn-primary' : 'btn'}
          >
            <ex.icon size={15} /> {t(ex.label)}
          </button>
        ))}
      </div>
      <div className="card p-5" role="tabpanel">
        <ExampleComp />
      </div>

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="effect-lab-challenge" />
    </SimulationShell>
  )
}
