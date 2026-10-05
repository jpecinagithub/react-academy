import { useRef, useState } from 'react'
import {
  SimulationShell,
  CodeBlock,
  Callout,
  Quiz,
  SectionTitle,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  intro: {
    en: 'A component is born, it changes, and it dies. In modern React, all three moments are expressed with effects — this simulator makes each one visible.',
    es: 'Un componente nace, cambia y muere. En React moderno, los tres momentos se expresan con efectos: este simulador hace visible cada uno.',
  },
  conceptTitle: { en: '1 · Concept: three moments', es: '1 · Concepto: tres momentos' },
  conceptBody: {
    en: 'Every component goes through three phases. **Mount**: React creates it and shows it for the first time. **Update**: state or props change and React re-renders it. **Unmount**: it is removed forever. Effects let you hook into these moments: run something after mount, and clean it up before unmount.',
    es: 'Todo componente pasa por tres fases. **Montaje**: React lo crea y lo muestra por primera vez. **Actualización**: el estado o las props cambian y React lo re-renderiza. **Desmontaje**: se elimina para siempre. Los efectos te permiten engancharte a estos momentos: ejecutar algo tras el montaje y limpiarlo antes del desmontaje.',
  },
  simTitle: { en: '2 · The simulator', es: '2 · El simulador' },
  simHint: {
    en: 'Press the buttons in order and watch the timeline. The demo component on the right really mounts, updates and unmounts.',
    es: 'Pulsa los botones en orden y observa la línea de tiempo. El componente demo de la derecha realmente se monta, se actualiza y se desmonta.',
  },
  mountBtn: { en: 'Mount component', es: 'Montar componente' },
  updateBtn: { en: 'Update state', es: 'Actualizar estado' },
  unmountBtn: { en: 'Unmount component', es: 'Desmontar componente' },
  timelineTitle: { en: 'Lifecycle timeline', es: 'Línea de tiempo del ciclo de vida' },
  logTitle: { en: 'Event log', es: 'Registro de eventos' },
  emptyLog: { en: 'Press “Mount component” to begin the lifecycle.', es: 'Pulsa «Montar componente» para empezar el ciclo de vida.' },
  demoTitle: { en: 'Demo component', es: 'Componente demo' },
  demoGone: { en: 'Nothing here — the component was unmounted.', es: 'Nada aquí — el componente fue desmontado.' },
  codeTitle: { en: '3 · Lifecycle, in hooks', es: '3 · El ciclo de vida, con hooks' },
  challengeTitle: { en: '4 · Challenge', es: '4 · Reto' },
  hooksNote: {
    en: 'In class components these were three separate methods (componentDidMount / componentDidUpdate / componentWillUnmount). With hooks there is just one idea: an effect that runs, and optionally a cleanup that undoes it.',
    es: 'En los componentes de clase eran tres métodos separados (componentDidMount / componentDidUpdate / componentWillUnmount). Con hooks hay una sola idea: un efecto que se ejecuta y, opcionalmente, una limpieza que lo deshace.',
  },
}

const PHASES = ['mount', 'render', 'effect', 'update', 'cleanup', 'unmount']

const PHASE_LABEL = {
  mount: { en: 'Mount', es: 'Montaje' },
  render: { en: 'Render', es: 'Render' },
  effect: { en: 'Effect', es: 'Efecto' },
  update: { en: 'Update', es: 'Actualización' },
  cleanup: { en: 'Cleanup', es: 'Limpieza' },
  unmount: { en: 'Unmount', es: 'Desmontaje' },
}

const CODE_LIFECYCLE = `function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 🟢 MOUNT: runs after the first render
    const id = setInterval(() => setTime(new Date()), 1000);

    return () => {
      // 🔴 UNMOUNT: runs before removal
      clearInterval(id);
    };
  }, []); // [] = only on mount / unmount

  // 🟡 UPDATE: every setTime() re-renders this function
  return <p>{time.toLocaleTimeString()}</p>;
}`

const CODE_MAP = `// Class lifecycle  →  Hooks equivalent
componentDidMount()      →  useEffect(() => { … }, [])
componentDidUpdate()     →  useEffect(() => { … })        // no array
componentWillUnmount()   →  useEffect(() => {
                               return () => { … }         // cleanup
                             }, [])`

function DemoComponent({ count }) {
  return (
    <div className="rounded-xl border-2 border-[var(--accent)] bg-[var(--surface-2)] p-5 text-center">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">&lt;DemoComponent /&gt;</p>
      <p className="mono text-3xl font-bold text-[var(--accent)]" aria-live="polite">
        count = {count}
      </p>
      <p className="text-xs text-[var(--muted)] mt-1">alive and rendering ✨</p>
    </div>
  )
}

export default function LifecycleSim() {
  const { t } = useLang()
  const [status, setStatus] = useState('idle') // idle | mounted | unmounted
  const [count, setCount] = useState(0)
  const [events, setEvents] = useState([])
  const [activePhase, setActivePhase] = useState(null)
  const seqRef = useRef(0)
  const logId = useRef(1)

  const pushEvent = (phase, text) => {
    const id = logId.current++
    setActivePhase(phase)
    setEvents((prev) => [...prev.slice(-15), { id, phase, text, time: new Date().toLocaleTimeString() }])
  }

  // Run a sequence of [phase, textKey] with a small stagger so the
  // timeline lights up step by step.
  const runSequence = (steps, done) => {
    const seq = ++seqRef.current
    steps.forEach(([phase, text], i) => {
      setTimeout(() => {
        if (seqRef.current !== seq) return
        pushEvent(phase, text)
        if (i === steps.length - 1 && done) done()
      }, i * 450)
    })
  }

  const doMount = () => {
    setCount(0)
    setStatus('mounted')
    runSequence([
      ['mount', t({ en: 'React creates <DemoComponent />', es: 'React crea <DemoComponent />' })],
      ['render', t({ en: 'Component function runs → JSX produced', es: 'La función se ejecuta → produce JSX' })],
      ['effect', t({ en: 'useEffect(fn, []) runs after mount', es: 'useEffect(fn, []) se ejecuta tras el montaje' })],
    ])
  }

  const doUpdate = () => {
    const next = count + 1
    setCount(next)
    runSequence([
      ['update', t({ en: `state changed: count ${count} → ${next}`, es: `estado cambiado: count ${count} → ${next}` })],
      ['render', t({ en: 'Component function re-runs with new state', es: 'La función se re-ejecuta con el nuevo estado' })],
    ])
  }

  const doUnmount = () => {
    runSequence(
      [
        ['cleanup', t({ en: 'Effect cleanup runs (return () => …)', es: 'La limpieza del efecto se ejecuta (return () => …)' })],
        ['unmount', t({ en: '<DemoComponent /> removed from the UI', es: '<DemoComponent /> eliminado de la UI' })],
      ],
      () => {
        setStatus('unmounted')
        setActivePhase(null)
      },
    )
  }

  const phaseColor = (phase) => {
    if (phase === activePhase) return { bg: 'var(--accent)', fg: '#fff', glow: true }
    const seen = events.some((e) => e.phase === phase)
    if (seen) return { bg: 'var(--accent-soft)', fg: 'var(--accent)', glow: false }
    return { bg: 'var(--surface-2)', fg: 'var(--muted)', glow: false }
  }

  const quizQuestions = [
    {
      q: {
        en: 'Which hook pattern runs something ONLY on mount and cleans it up ONLY on unmount?',
        es: '¿Qué patrón de hook ejecuta algo SOLO al montar y lo limpia SOLO al desmontar?',
      },
      options: [
        { en: 'useEffect(() => { … }, [])', es: 'useEffect(() => { … }, [])' },
        { en: 'useEffect(() => { … })', es: 'useEffect(() => { … })' },
        { en: 'useState(() => { … })', es: 'useState(() => { … })' },
      ],
      answer: 0,
      explain: {
        en: 'An empty dependency array means "run once after mount". The returned cleanup then runs once before unmount.',
        es: 'Un array de dependencias vacío significa "ejecutar una vez tras el montaje". La limpieza devuelta se ejecuta una vez antes del desmontaje.',
      },
    },
    {
      q: {
        en: 'What does "update" mean in a component\'s lifecycle?',
        es: '¿Qué significa "actualización" en el ciclo de vida de un componente?',
      },
      options: [
        { en: 'The component function re-runs because state or props changed', es: 'La función del componente se re-ejecuta porque el estado o las props cambiaron' },
        { en: 'React downloads a new version of the component', es: 'React descarga una nueva versión del componente' },
        { en: 'The component is unmounted and mounted again', es: 'El componente se desmonta y se vuelve a montar' },
      ],
      answer: 0,
      explain: {
        en: 'An update is a re-render: the same component function runs again with new state/props. No unmount happens.',
        es: 'Una actualización es un re-render: la misma función se ejecuta de nuevo con nuevo estado/props. No hay desmontaje.',
      },
    },
  ]

  return (
    <SimulationShell
      labId="lifecycle-sim"
      title={t({ en: 'Component Lifecycle Simulator', es: 'Simulador de ciclo de vida' })}
      intro={t(STRINGS.intro)}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <p className="text-[var(--text)] mb-4 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>
      <Callout type="info">{t(STRINGS.hooksNote)}</Callout>

      <SectionTitle>{t(STRINGS.simTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.simHint)}</p>

      <div className="flex flex-wrap gap-3 mb-6" role="group" aria-label={t(STRINGS.simTitle)}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          disabled={status === 'mounted'}
          onClick={doMount}
        >
          🟢 {t(STRINGS.mountBtn)}
        </button>
        <button
          type="button"
          className="btn btn-lg"
          disabled={status !== 'mounted'}
          onClick={doUpdate}
        >
          🟡 {t(STRINGS.updateBtn)}
        </button>
        <button
          type="button"
          className="btn btn-lg"
          disabled={status !== 'mounted'}
          onClick={doUnmount}
        >
          🔴 {t(STRINGS.unmountBtn)}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.timelineTitle)}</h3>
          <ol className="relative border-l-2 border-[var(--border)] ml-2 space-y-1">
            {PHASES.map((phase) => {
              const c = phaseColor(phase)
              return (
                <li key={phase} className="pl-6 py-2 relative">
                  <span
                    className="absolute -left-[9px] top-3 w-4 h-4 rounded-full border-2 transition-all"
                    style={{
                      background: c.bg,
                      borderColor: c.fg,
                      boxShadow: c.glow ? '0 0 12px var(--accent)' : 'none',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className={`font-semibold text-sm transition-colors ${phase === activePhase ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}
                    aria-current={phase === activePhase ? 'step' : undefined}
                  >
                    {t(PHASE_LABEL[phase])}
                  </span>
                  {phase === activePhase && (
                    <span className="ml-2 text-xs text-[var(--accent)] animate-pulse">●</span>
                  )}
                </li>
              )
            })}
          </ol>

          <h3 className="font-bold text-[var(--text-strong)] mb-2 mt-6">{t(STRINGS.logTitle)}</h3>
          <ul className="mono text-xs bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-3 h-44 overflow-y-auto" aria-live="polite">
            {events.length === 0 && <li className="text-[var(--muted)]">{t(STRINGS.emptyLog)}</li>}
            {events.map((e) => (
              <li key={e.id}>
                <span className="text-[var(--muted)]">{e.time}</span>{' '}
                <span className="text-[var(--accent)] font-semibold">[{t(PHASE_LABEL[e.phase])}]</span>{' '}
                {e.text}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.demoTitle)}</h3>
          {status === 'mounted' ? (
            <DemoComponent count={count} />
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
              {t(STRINGS.demoGone)}
            </div>
          )}
          <div className="mt-4 text-xs text-[var(--muted)] space-y-1">
            <p>
              <span className="font-semibold text-[var(--text-strong)]">status:</span>{' '}
              <span className="mono">{status}</span>
            </p>
            <p>
              <span className="font-semibold text-[var(--text-strong)]">renders so far:</span>{' '}
              <span className="mono">{events.filter((e) => e.phase === 'render').length}</span>
            </p>
          </div>
        </div>
      </div>

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4">
        <CodeBlock code={CODE_LIFECYCLE} lang="jsx" />
        <CodeBlock code={CODE_MAP} lang="jsx" />
      </div>

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <Quiz questions={quizQuestions} quizId="lifecycle-challenge" />
    </SimulationShell>
  )
}
