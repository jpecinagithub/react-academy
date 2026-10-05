import { useRef, useState } from 'react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  Quiz,
  Compare,
  SectionTitle,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'
import { track } from '../../utils/analytics.js'

const STRINGS = {
  intro: {
    en: 'Mount and unmount components with and without cleanup, and watch leaked intervals and listeners pile up in real time.',
    es: 'Monta y desmonta componentes con y sin limpieza, y observa cómo se acumulan intervalos y listeners olvidados en tiempo real.',
  },
  conceptTitle: { en: '1 · Concept', es: '1 · Concepto' },
  conceptBody: {
    en: 'Effects often create things that live **outside** React: intervals, event listeners, subscriptions, sockets. When the component unmounts — or the effect re-runs — those things do **not** disappear on their own. The function you `return` from an effect is React\'s way of asking: "how do I clean this up?"',
    es: 'Los efectos suelen crear cosas que viven **fuera** de React: intervalos, listeners, suscripciones, sockets. Cuando el componente se desmonta — o el efecto se re-ejecuta — esas cosas **no** desaparecen solas. La función que `return`as desde un efecto es la forma que tiene React de preguntar: "¿cómo limpio esto?"',
  },
  flowTitle: { en: '2 · When cleanup runs', es: '2 · Cuándo se ejecuta la limpieza' },
  expTitle: { en: '3 · Experiment: create a leak', es: '3 · Experimento: crea una fuga' },
  codeTitle: { en: '4 · The code behind it', es: '4 · El código detrás' },
  challengeTitle: { en: '5 · Challenge: predict, then observe', es: '5 · Reto: predice y luego observa' },

  demo1Title: { en: 'Demo A — setInterval', es: 'Demo A — setInterval' },
  demo1Desc: {
    en: 'Each mount starts an interval that ticks every 0.7 s. Mount and unmount several times and watch the tick log and the active-interval counter.',
    es: 'Cada montaje inicia un intervalo que hace tick cada 0,7 s. Monta y desmonta varias veces y observa el registro de ticks y el contador de intervalos activos.',
  },
  demo2Title: { en: 'Demo B — window event listeners', es: 'Demo B — listeners de eventos' },
  demo2Desc: {
    en: 'Each mount attaches a listener to a custom "ping" event. Press "Send ping" and count how many listeners answer.',
    es: 'Cada montaje añade un listener a un evento "ping" personalizado. Pulsa "Enviar ping" y cuenta cuántos listeners responden.',
  },

  withCleanup: { en: 'With cleanup', es: 'Con limpieza' },
  withoutCleanup: { en: 'Without cleanup', es: 'Sin limpieza' },
  cleanupHint: {
    en: 'Switching mode unmounts everything and resets the demo.',
    es: 'Cambiar de modo desmonta todo y reinicia la demo.',
  },
  mount: { en: 'Mount component', es: 'Montar componente' },
  unmount: { en: 'Unmount component', es: 'Desmontar componente' },
  reset: { en: 'Reset demo', es: 'Reiniciar demo' },
  sendPing: { en: 'Send ping', es: 'Enviar ping' },
  activeIntervals: { en: 'Active intervals', es: 'Intervalos activos' },
  activeListeners: { en: 'Active listeners', es: 'Listeners activos' },
  leakMeter: { en: 'Leak meter', es: 'Medidor de fugas' },
  tickLog: { en: 'Tick log', es: 'Registro de ticks' },
  pingLog: { en: 'Ping log', es: 'Registro de pings' },
  totalTicks: { en: 'Total ticks', es: 'Ticks totales' },
  mountedBadge: { en: 'mounted', es: 'montado' },
  unmountedBadge: { en: 'unmounted', es: 'desmontado' },
  leakedBadge: { en: 'LEAKED — still running!', es: '¡FUGA — sigue corriendo!' },
  emptyLog: { en: 'Nothing here yet. Mount something.', es: 'Nada por aquí todavía. Monta algo.' },

  codeBad: { en: 'Without cleanup — the leak', es: 'Sin limpieza — la fuga' },
  codeGood: { en: 'With cleanup — the fix', es: 'Con limpieza — la solución' },
  warnTitle: { en: 'Why this matters', es: 'Por qué importa' },
  warnBody: {
    en: 'Leaked intervals keep running timers, leaked listeners keep firing handlers, and leaked subscriptions keep pushing data — into components that no longer exist. Symptoms: duplicated work, stale updates, and apps that get slower the longer they run.',
    es: 'Los intervalos olvidados siguen ejecutando temporizadores, los listeners olvidados siguen disparando handlers y las suscripciones olvidadas siguen enviando datos — a componentes que ya no existen. Síntomas: trabajo duplicado, actualizaciones obsoletas y apps que se vuelven más lentas con el tiempo.',
  },

  challengeHint: {
    en: 'Answer first from intuition, then go back to the demos and verify.',
    es: 'Responde primero por intuición y luego vuelve a las demos para comprobarlo.',
  },
}

const FLOW = [
  {
    label: { en: 'Component mounts', es: 'El componente se monta' },
    desc: { en: 'effect runs → interval/listener created', es: 'el efecto se ejecuta → se crea el intervalo/listener' },
  },
  {
    label: { en: 'Component updates', es: 'El componente se actualiza' },
    desc: { en: 'cleanup runs FIRST, then the effect runs again', es: 'la limpieza se ejecuta PRIMERO, luego el efecto de nuevo' },
  },
  {
    label: { en: 'Component unmounts', es: 'El componente se desmonta' },
    desc: { en: 'cleanup runs one last time', es: 'la limpieza se ejecuta una última vez' },
  },
]

const CODE_BAD = `function Ticker() {
  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick');
    }, 1000);
    // ❌ no cleanup returned
  }, []);
  return <p>Ticker</p>;
}
// Unmount Ticker → the interval keeps ticking forever.`

const CODE_GOOD = `function Ticker() {
  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick');
    }, 1000);
    // ✅ cleanup: undo what the effect did
    return () => clearInterval(id);
  }, []);
  return <p>Ticker</p>;
}
// Unmount Ticker → cleanup runs → interval cleared.`

function timeNow() {
  return new Date().toLocaleTimeString()
}

function Meter({ value, max, label }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const hot = value >= 3
  return (
    <div className="my-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-bold text-[var(--text-strong)]" aria-live="polite">{value}</span>
      </div>
      <div
        className="h-3 rounded-full bg-[var(--surface-3)] overflow-hidden"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.min(value, max)}
        aria-label={label}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: hot ? 'var(--danger, #ef4444)' : 'var(--accent)',
          }}
        />
      </div>
    </div>
  )
}

function WidgetCard({ mounted, active, label, leaked }) {
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        mounted
          ? 'border-[var(--accent)] bg-[var(--surface-2)]'
          : 'border-[var(--border)] bg-[var(--surface-1)] opacity-60'
      }`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-1">
        <strong className="text-[var(--text-strong)]">{label}</strong>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            mounted ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--surface-3)] text-[var(--muted)]'
          }`}
        >
          {mounted ? '●' : '○'}
        </span>
      </div>
      <p className="text-xs text-[var(--muted)]">
        {mounted ? '● ' : '○ '}
        {label}
      </p>
      {leaked > 0 && (
        <p className="text-xs font-bold text-red-500 mt-2" role="alert">
          ⚠ {leaked} × leaked
        </p>
      )}
      <p className="text-xs text-[var(--muted)] mt-1">
        {active} {active === 1 ? 'tick' : 'ticks'} / listener responses
      </p>
    </div>
  )
}

export default function CleanupLab() {
  const { t } = useLang()

  // --- shared mode ---------------------------------------------------------
  const [withCleanup, setWithCleanup] = useState(true)

  // --- Demo A: intervals ----------------------------------------------------
  const timersRef = useRef(new Map()) // id -> interval handle
  const currentTimerId = useRef(null)
  const nextId = useRef(1)
  const [mountedA, setMountedA] = useState(false)
  const [activeIntervals, setActiveIntervals] = useState(0)
  const [totalTicks, setTotalTicks] = useState(0)
  const [tickLog, setTickLog] = useState([])

  const pushTick = (id) => {
    setTotalTicks((n) => n + 1)
    setTickLog((prev) => [...prev.slice(-11), { id, time: timeNow() }])
  }

  const mountA = () => {
    const id = nextId.current++
    const timer = setInterval(() => pushTick(id), 700)
    timersRef.current.set(id, timer)
    currentTimerId.current = id
    setActiveIntervals(timersRef.current.size)
    setMountedA(true)
  }

  const unmountA = () => {
    if (withCleanup && currentTimerId.current != null) {
      clearInterval(timersRef.current.get(currentTimerId.current))
      timersRef.current.delete(currentTimerId.current)
    }
    currentTimerId.current = null
    setActiveIntervals(timersRef.current.size)
    setMountedA(false)
  }

  // --- Demo B: listeners -----------------------------------------------------
  const listenersRef = useRef(new Map()) // id -> handler
  const currentListenerId = useRef(null)
  const [mountedB, setMountedB] = useState(false)
  const [activeListeners, setActiveListeners] = useState(0)
  const [pingLog, setPingLog] = useState([])

  const mountB = () => {
    const id = nextId.current++
    const handler = () => {
      setPingLog((prev) => [...prev.slice(-11), { id, time: timeNow() }])
    }
    listenersRef.current.set(id, handler)
    window.addEventListener('cleanup-lab-ping', handler)
    currentListenerId.current = id
    setActiveListeners(listenersRef.current.size)
    setMountedB(true)
  }

  const unmountB = () => {
    if (withCleanup && currentListenerId.current != null) {
      window.removeEventListener('cleanup-lab-ping', listenersRef.current.get(currentListenerId.current))
      listenersRef.current.delete(currentListenerId.current)
    }
    currentListenerId.current = null
    setActiveListeners(listenersRef.current.size)
    setMountedB(false)
  }

  const sendPing = () => window.dispatchEvent(new Event('cleanup-lab-ping'))

  // --- mode switch / reset ----------------------------------------------------
  const resetAll = () => {
    timersRef.current.forEach((timer) => clearInterval(timer))
    timersRef.current.clear()
    listenersRef.current.forEach((h) => window.removeEventListener('cleanup-lab-ping', h))
    listenersRef.current.clear()
    currentTimerId.current = null
    currentListenerId.current = null
    setMountedA(false)
    setMountedB(false)
    setActiveIntervals(0)
    setActiveListeners(0)
    setTotalTicks(0)
    setTickLog([])
    setPingLog([])
  }

  const switchMode = (value) => {
    resetAll()
    setWithCleanup(value)
  }

  const leakedTimers = withCleanup ? 0 : timersRef.current.size - (mountedA ? 1 : 0)
  const leakedListeners = withCleanup ? 0 : listenersRef.current.size - (mountedB ? 1 : 0)

  const quizQuestions = [
    {
      q: {
        en: 'You mount a component 3 times (unmounting between each) WITHOUT cleanup. How many intervals are ticking afterwards?',
        es: 'Montas un componente 3 veces (desmontándolo entre medias) SIN limpieza. ¿Cuántos intervalos siguen corriendo después?',
      },
      options: [{ en: '1 — only the latest', es: '1 — solo el último' }, { en: '3 — one per mount', es: '3 — uno por montaje' }, { en: '0 — React cleans them automatically', es: '0 — React los limpia automáticamente' }],
      answer: 1,
      explain: {
        en: 'Without a cleanup function nothing removes the old intervals, so every mount leaks one. With cleanup there would be exactly 0.',
        es: 'Sin función de limpieza nada elimina los intervalos antiguos: cada montaje deja una fuga. Con limpieza habría exactamente 0.',
      },
    },
    {
      q: {
        en: 'When does the cleanup function of an effect run?',
        es: '¿Cuándo se ejecuta la función de limpieza de un efecto?',
      },
      options: [
        { en: 'Only when the component unmounts', es: 'Solo cuando el componente se desmonta' },
        { en: 'Before the effect re-runs AND when the component unmounts', es: 'Antes de que el efecto se re-ejecute Y cuando el componente se desmonta' },
        { en: 'After every render', es: 'Después de cada render' },
      ],
      answer: 1,
      explain: {
        en: 'Cleanup runs before the effect runs again (to undo the previous setup) and one final time on unmount.',
        es: 'La limpieza se ejecuta antes de que el efecto vuelva a correr (para deshacer la configuración anterior) y una última vez al desmontar.',
      },
    },
  ]

  return (
    <SimulationShell
      labId="cleanup-lab"
      title={t({ en: 'Effect Cleanup Lab', es: 'Laboratorio de limpieza de efectos' })}
      intro={t(STRINGS.intro)}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <p className="text-[var(--text)] mb-4 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>
      <Callout type="warn" title={t(STRINGS.warnTitle)}>
        {t(STRINGS.warnBody)}
      </Callout>

      <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
      <FlowSteps steps={FLOW.map((s) => ({ label: t(s.label), desc: t(s.desc) }))} />

      <SectionTitle>{t(STRINGS.expTitle)}</SectionTitle>

      <div
        className="flex flex-wrap items-center gap-3 my-4 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-1)]"
        role="group"
        aria-label={t({ en: 'Cleanup mode', es: 'Modo de limpieza' })}
      >
        <button
          type="button"
          className={`btn ${withCleanup ? 'btn-primary' : ''}`}
          aria-pressed={withCleanup}
          onClick={() => switchMode(true)}
        >
          ✅ {t(STRINGS.withCleanup)}
        </button>
        <button
          type="button"
          className={`btn ${!withCleanup ? 'btn-primary' : ''}`}
          aria-pressed={!withCleanup}
          onClick={() => {
            switchMode(false)
            track('cleanup_leak_mode', { mode: 'without-cleanup' })
          }}
        >
          ❌ {t(STRINGS.withoutCleanup)}
        </button>
        <span className="text-xs text-[var(--muted)]">{t(STRINGS.cleanupHint)}</span>
        <button type="button" className="btn ml-auto" onClick={resetAll}>
          {t(STRINGS.reset)}
        </button>
      </div>

      <Compare
        cols={[
          {
            title: t(STRINGS.demo1Title),
            children: (
              <>
                <p className="text-sm text-[var(--muted)] mb-3">{t(STRINGS.demo1Desc)}</p>
                <WidgetCard
                  mounted={mountedA}
                  active={totalTicks}
                  label={t(STRINGS.mountedBadge)}
                  leaked={leakedTimers}
                />
                <Meter value={activeIntervals} max={6} label={t(STRINGS.activeIntervals)} />
                <div className="flex gap-2 mb-3">
                  <button type="button" className="btn btn-primary" disabled={mountedA} onClick={mountA}>
                    {t(STRINGS.mount)}
                  </button>
                  <button type="button" className="btn" disabled={!mountedA} onClick={unmountA}>
                    {t(STRINGS.unmount)}
                  </button>
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-strong)] mb-1">{t(STRINGS.tickLog)}</h4>
                <ul className="mono text-xs bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-2 h-36 overflow-y-auto" aria-live="polite">
                  {tickLog.length === 0 && <li className="text-[var(--muted)]">{t(STRINGS.emptyLog)}</li>}
                  {tickLog.map((e, i) => (
                    <li key={i}>
                      <span className="text-[var(--accent)]">tick</span> · interval #{e.id} · {e.time}
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            title: t(STRINGS.demo2Title),
            children: (
              <>
                <p className="text-sm text-[var(--muted)] mb-3">{t(STRINGS.demo2Desc)}</p>
                <WidgetCard
                  mounted={mountedB}
                  active={pingLog.length}
                  label={t(STRINGS.mountedBadge)}
                  leaked={leakedListeners}
                />
                <Meter value={activeListeners} max={6} label={t(STRINGS.activeListeners)} />
                <div className="flex flex-wrap gap-2 mb-3">
                  <button type="button" className="btn btn-primary" disabled={mountedB} onClick={mountB}>
                    {t(STRINGS.mount)}
                  </button>
                  <button type="button" className="btn" disabled={!mountedB} onClick={unmountB}>
                    {t(STRINGS.unmount)}
                  </button>
                  <button type="button" className="btn" onClick={sendPing}>
                    📡 {t(STRINGS.sendPing)}
                  </button>
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-strong)] mb-1">{t(STRINGS.pingLog)}</h4>
                <ul className="mono text-xs bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-2 h-36 overflow-y-auto" aria-live="polite">
                  {pingLog.length === 0 && <li className="text-[var(--muted)]">{t(STRINGS.emptyLog)}</li>}
                  {pingLog.map((e, i) => (
                    <li key={i}>
                      <span className="text-[var(--accent)]">ping</span> · listener #{e.id} · {e.time}
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
        ]}
      />

      {!withCleanup && activeIntervals + activeListeners > 0 && (
        <Callout type="danger" title={t(STRINGS.leakedBadge)}>
          {t({
            en: 'Those intervals and listeners are still alive even though their component is gone. In a real app they keep consuming CPU, firing handlers and holding memory.',
            es: 'Esos intervalos y listeners siguen vivos aunque su componente haya desaparecido. En una app real siguen consumiendo CPU, disparando handlers y reteniendo memoria.',
          })}
        </Callout>
      )}

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <Compare
        cols={[
          { title: `❌ ${t(STRINGS.codeBad)}`, children: <CodeBlock code={CODE_BAD} lang="jsx" /> },
          { title: `✅ ${t(STRINGS.codeGood)}`, children: <CodeBlock code={CODE_GOOD} lang="jsx" /> },
        ]}
      />
      <p className="text-sm text-[var(--muted)] max-w-3xl">
        <GlossaryTerm term="cleanup">
          {t({
            en: 'Rule of thumb: every effect that creates something outside React must return a cleanup that destroys it — clearInterval, removeEventListener, unsubscribe, abort.',
            es: 'Regla de oro: todo efecto que crea algo fuera de React debe devolver una limpieza que lo destruya — clearInterval, removeEventListener, unsubscribe, abort.',
          })}
        </GlossaryTerm>
      </p>

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-3">{t(STRINGS.challengeHint)}</p>
      <Quiz questions={quizQuestions} quizId="cleanup-challenge" />
    </SimulationShell>
  )
}
