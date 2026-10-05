import { useState, useRef, useEffect, createContext, useContext } from 'react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Compare,
  Quiz,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

// Real context used by the demo: in context mode the tree below is genuinely
// wrapped in this provider and Avatar reads from it with useContext.
const UserContext = createContext(null)

const STRINGS = {
  title: { en: 'Prop Drilling Visualizer', es: 'Visualizador de prop drilling' },
  intro: {
    en: 'Watch the `user` prop travel down through every component — then flip the switch and let Context deliver it directly to Avatar.',
    es: 'Observa la prop `user` viajar por cada componente, y luego activa el interruptor para que Context la entregue directamente a Avatar.',
  },
  conceptTitle: { en: 'The concept', es: 'El concepto' },
  conceptP1: {
    en: 'Props flow down the component tree. When a deeply nested child needs data, every component in between must receive it and forward it — even if it never uses it. That relay race is called prop drilling.',
    es: 'Las props fluyen hacia abajo por el árbol de componentes. Cuando un hijo muy anidado necesita datos, cada componente intermedio debe recibirlos y reenviarlos, aunque nunca los use. Esa carrera de relevos se llama prop drilling.',
  },
  conceptP2: {
    en: 'Press the button and watch the user prop hop down the tree, one component at a time. Then flip the switch: Context lets Avatar read the value directly from the provider, skipping the middlemen.',
    es: 'Pulsa el botón y observa la prop user saltar por el árbol, un componente cada vez. Luego cambia el interruptor: Context permite a Avatar leer el valor directamente del proveedor, saltándose a los intermediarios.',
  },
  vizTitle: { en: 'The visualizer', es: 'El visualizador' },
  modeLabel: { en: 'Delivery mode', es: 'Modo de entrega' },
  modeDrill: { en: 'Prop drilling', es: 'Prop drilling' },
  modeContext: { en: 'Use Context', es: 'Usar Context' },
  sendDrill: { en: 'Send `user` prop', es: 'Enviar la prop `user`' },
  sendContext: { en: 'Deliver via Context', es: 'Entregar vía Context' },
  userLabel: { en: 'User', es: 'Usuario' },
  userHint: {
    en: 'Change the user — Avatar updates live in both modes, proving the data really flows.',
    es: 'Cambia el usuario: Avatar se actualiza en directo en ambos modos, demostrando que los datos fluyen de verdad.',
  },
  ownsProp: {
    en: 'creates user "{name}"',
    es: 'crea user "{name}"',
  },
  carriesProp: {
    en: 'receives user → forwards it down',
    es: 'recibe user → lo reenvía hacia abajo',
  },
  noProp: {
    en: 'no longer carries the prop',
    es: 'ya no transporta la prop',
  },
  avatarRenders: { en: 'Avatar renders:', es: 'Avatar renderiza:' },
  providerNote: {
    en: 'wraps the app — the value is available to any component below, no forwarding needed',
    es: 'envuelve la app: el valor está disponible para cualquier componente de abajo, sin reenvíos',
  },
  directLabel: { en: 'direct', es: 'directa' },
  dotLabel: { en: 'user', es: 'user' },
  logTitle: { en: 'Event log', es: 'Registro de eventos' },
  logEmpty: {
    en: 'Press the button to send the user down the tree.',
    es: 'Pulsa el botón para enviar el usuario por el árbol.',
  },
  hopForward: {
    en: '{from} → {to}: forwarding user "{name}"',
    es: '{from} → {to}: reenviando user "{name}"',
  },
  hopReceived: {
    en: 'Avatar: received user "{name}" ✓',
    es: 'Avatar: user "{name}" recibido ✓',
  },
  ctxDelivered: {
    en: 'UserContext.Provider → Avatar: "{name}" delivered directly (single hop)',
    es: 'UserContext.Provider → Avatar: "{name}" entregado directamente (un solo salto)',
  },
  codeTitle: { en: 'The code behind it', es: 'El código detrás' },
  codeDrillTitle: { en: 'Prop drilling: every layer forwards', es: 'Prop drilling: cada capa reenvía' },
  codeCtxTitle: { en: 'Context: read it where you need it', es: 'Context: léelo donde lo necesites' },
  calloutTitle: { en: 'When NOT to use Context', es: 'Cuándo NO usar Context' },
  calloutText: {
    en: 'Props are the default: explicit, easy to trace and they keep components reusable. Reaching for Context for everything couples components to one specific tree and makes them harder to reuse or test. Use Context when drilling becomes painful — theme, locale, current user — not for data that only travels one level.',
    es: 'Las props son lo habitual: explícitas, fáciles de seguir y mantienen los componentes reutilizables. Usar Context para todo acopla los componentes a un árbol concreto y los hace más difíciles de reutilizar o probar. Usa Context cuando el drilling duela de verdad — tema, idioma, usuario actual — no para datos que solo viajan un nivel.',
  },
  quizTitle: { en: 'Check your understanding', es: 'Comprueba lo aprendido' },
  q1: {
    en: 'When does Context help the most?',
    es: '¿Cuándo ayuda más Context?',
  },
  q1o0: { en: 'When many nested components need the same data', es: 'Cuando muchos componentes anidados necesitan los mismos datos' },
  q1o1: { en: 'To style a single button', es: 'Para dar estilo a un único botón' },
  q1o2: { en: 'To make components render faster', es: 'Para que los componentes rendericen más rápido' },
  q1o3: { en: 'To replace useState everywhere', es: 'Para reemplazar useState en todas partes' },
  q1explain: {
    en: 'Context shines when data must cross layers that don’t use it — theme, locale, current user — instead of drilling it through each one.',
    es: 'Context brilla cuando los datos deben cruzar capas que no los usan — tema, idioma, usuario actual — en lugar de perforar cada una.',
  },
  q2: {
    en: 'Which statement about Context vs props is true?',
    es: '¿Qué afirmación sobre Context frente a props es verdadera?',
  },
  q2o0: { en: 'Context replaces all props', es: 'Context reemplaza todas las props' },
  q2o1: {
    en: 'Context is for data many components need; props stay the default for direct parent → child',
    es: 'Context es para datos que muchos componentes necesitan; las props siguen siendo lo habitual de padre a hijo directo',
  },
  q2o2: { en: 'Context makes components more reusable', es: 'Context hace los componentes más reutilizables' },
  q2o3: { en: 'Only class components can use Context', es: 'Solo los componentes de clase pueden usar Context' },
  q2explain: {
    en: 'Overusing Context couples components to a specific tree. Keep props as the default and reach for Context when drilling gets painful.',
    es: 'Abusar de Context acopla los componentes a un árbol concreto. Mantén las props por defecto y usa Context cuando el drilling duela.',
  },
}

const NODES = ['App', 'Layout', 'Dashboard', 'UserProfile', 'Avatar']
const USERS = ['Alex', 'Sam', 'Ada']

const DRILL_CODE = `function App() {
  const user = { name: 'Alex' };
  return <Layout user={user} />;
}

function Layout({ user }) {
  return <Dashboard user={user} />; // just passing it through
}

function Dashboard({ user }) {
  return <UserProfile user={user} />; // …and again
}

function UserProfile({ user }) {
  return <Avatar user={user} />;
}

function Avatar({ user }) {
  return <span>👤 {user.name}</span>;
}`

const CONTEXT_CODE = `const UserContext = createContext(null);

function App() {
  const user = { name: 'Alex' };
  return (
    <UserContext.Provider value={user}>
      <Layout /> {/* no user prop anywhere */}
    </UserContext.Provider>
  );
}

// Layout, Dashboard, UserProfile: unchanged, no user prop

function Avatar() {
  const user = useContext(UserContext); // read it directly
  return <span>👤 {user.name}</span>;
}`

// Drilling mode: Avatar genuinely receives the user as a prop.
function DrilledAvatar({ user }) {
  return (
    <span aria-live="polite">
      👤 {user}
    </span>
  )
}

// Context mode: Avatar genuinely reads the user from context.
function ContextAvatar() {
  const user = useContext(UserContext)
  return (
    <span aria-live="polite">
      👤 {user}
    </span>
  )
}

function useReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function ContextLab() {
  const { t } = useLang()
  const [mode, setMode] = useState('drill') // 'drill' | 'context'
  const [user, setUser] = useState('Alex')
  const [phase, setPhase] = useState('idle') // 'idle' | 'running' | 'done'
  const [hop, setHop] = useState(-1) // active/recent edge index
  const [log, setLog] = useState([]) // [{ kind, from, to, name }]
  const timers = useRef([])

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
    }
  }, [])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const resetViz = () => {
    clearTimers()
    setPhase('idle')
    setHop(-1)
    setLog([])
  }

  const switchMode = (next) => {
    if (next === mode) return
    setMode(next)
    resetViz()
  }

  const send = () => {
    clearTimers()
    setPhase('running')
    setHop(-1)
    setLog([])
    const reduced = useReducedMotion()

    if (mode === 'drill') {
      const hops = []
      for (let i = 0; i < NODES.length - 1; i += 1) {
        hops.push({ kind: 'hop', from: NODES[i], to: NODES[i + 1], name: user })
      }
      hops.push({ kind: 'received', from: 'Avatar', to: '', name: user })
      if (reduced) {
        // Reduced motion: final state + full log instantly, no timed steps.
        setLog(hops)
        setHop(NODES.length - 2)
        setPhase('done')
        return
      }
      hops.forEach((entry, i) => {
        timers.current.push(
          setTimeout(() => {
            setHop(Math.min(i, NODES.length - 2))
            setLog((prev) => [...prev, entry])
            if (i === hops.length - 1) setPhase('done')
          }, 300 + i * 600)
        )
      })
    } else {
      const entry = { kind: 'ctx', from: 'UserContext.Provider', to: 'Avatar', name: user }
      if (reduced) {
        setLog([entry])
        setHop(0)
        setPhase('done')
        return
      }
      timers.current.push(
        setTimeout(() => {
          setHop(0)
          setLog([entry])
        }, 300)
      )
      timers.current.push(setTimeout(() => setPhase('done'), 1100))
    }
  }

  const renderLogEntry = (entry) => {
    if (entry.kind === 'hop') return t(STRINGS.hopForward, { from: entry.from, to: entry.to, name: entry.name })
    if (entry.kind === 'received') return t(STRINGS.hopReceived, { name: entry.name })
    return t(STRINGS.ctxDelivered, { name: entry.name })
  }

  const renderNodeBox = (node, i) => {
    const isApp = i === 0
    const isAvatar = i === NODES.length - 1
    const dimmed = mode === 'context' && !isApp && !isAvatar
    const edgeActive = mode === 'drill' && phase !== 'idle' && hop >= i - 1
    const dotActive = mode === 'drill' && phase === 'running' && hop === i - 1

    return (
      <li key={node} style={{ listStyle: 'none' }}>
        {i > 0 && mode === 'drill' && (
          <div
            aria-hidden="true"
            style={{ marginLeft: i * 28 + 16 }}
            className="relative h-8 w-px bg-[var(--border)]"
          >
            {edgeActive && (
              <div className="absolute inset-0 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            )}
            {dotActive && (
              <span className="mono absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--accent)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--accent)]">
                {t(STRINGS.dotLabel)}
              </span>
            )}
          </div>
        )}
        {i > 0 && mode === 'context' && (
          <div
            aria-hidden="true"
            style={{ marginLeft: i * 28 + 16 }}
            className="h-8 w-px bg-[var(--border)] opacity-30"
          />
        )}
        <div
          style={{ marginLeft: i * 28 }}
          className={`rounded-lg border bg-[var(--surface-2)] px-4 py-3 transition-opacity ${
            dimmed ? 'opacity-40' : ''
          } ${
            isAvatar && phase !== 'idle'
              ? 'border-[var(--accent)] shadow-[0_0_14px_var(--accent)]'
              : 'border-[var(--border)]'
          }`}
        >
          <div className="mono font-bold text-[var(--text-strong)]">&lt;{node}&gt;</div>
          {mode === 'drill' && isApp && (
            <div className="mt-1 text-xs text-[var(--muted)]">
              {t(STRINGS.ownsProp, { name: user })}
            </div>
          )}
          {mode === 'drill' && !isApp && !isAvatar && (
            <div className="mt-1 text-xs text-[var(--muted)]">{t(STRINGS.carriesProp)}</div>
          )}
          {mode === 'context' && dimmed && (
            <div className="mt-1 text-xs italic text-[var(--muted)]">{t(STRINGS.noProp)}</div>
          )}
          {isAvatar && (
            <div className="mt-1 text-sm text-[var(--text)]">
              <span className="text-xs text-[var(--muted)]">{t(STRINGS.avatarRenders)} </span>
              <span className="text-xl font-semibold text-[var(--text-strong)]">
                {mode === 'context' ? <ContextAvatar /> : <DrilledAvatar user={user} />}
              </span>
            </div>
          )}
        </div>
      </li>
    )
  }

  const renderTree = () => (
    <ul className="m-0 p-0">
      {NODES.map((node, i) => renderNodeBox(node, i))}
    </ul>
  )

  const questions = [
    {
      q: STRINGS.q1,
      options: [STRINGS.q1o0, STRINGS.q1o1, STRINGS.q1o2, STRINGS.q1o3],
      answer: 0,
      explain: STRINGS.q1explain,
    },
    {
      q: STRINGS.q2,
      options: [STRINGS.q2o0, STRINGS.q2o1, STRINGS.q2o2, STRINGS.q2o3],
      answer: 1,
      explain: STRINGS.q2explain,
    },
  ]

  return (
    <SimulationShell
      labId="context-lab"
      title={t(STRINGS.title)}
      intro={t(STRINGS.intro)}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <p className="text-[var(--text)]">
        <GlossaryTerm term="prop drilling">prop drilling</GlossaryTerm>
        {': '}
        {t({
          en: 'is what you see below.',
          es: 'es lo que ves a continuación.',
        })}
      </p>
      <p className="mt-2 text-[var(--text)]">{t(STRINGS.conceptP1)}</p>
      <p className="mt-2 text-[var(--text)]">{t(STRINGS.conceptP2)}</p>

      <SectionTitle>{t(STRINGS.vizTitle)}</SectionTitle>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span id="mode-label" className="text-sm font-semibold text-[var(--text-strong)]">
          {t(STRINGS.modeLabel)}:
        </span>
        <div role="group" aria-labelledby="mode-label" className="flex gap-2">
          <button
            type="button"
            className={mode === 'drill' ? 'btn btn-primary' : 'btn'}
            aria-pressed={mode === 'drill'}
            onClick={() => switchMode('drill')}
          >
            {t(STRINGS.modeDrill)}
          </button>
          <button
            type="button"
            className={mode === 'context' ? 'btn btn-primary' : 'btn'}
            aria-pressed={mode === 'context'}
            onClick={() => switchMode('context')}
          >
            {t(STRINGS.modeContext)}
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={send}
          disabled={phase === 'running'}
        >
          {mode === 'drill' ? t(STRINGS.sendDrill) : t(STRINGS.sendContext)}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span id="user-label" className="text-sm font-semibold text-[var(--text-strong)]">
          {t(STRINGS.userLabel)}:
        </span>
        <div role="group" aria-labelledby="user-label" className="flex gap-2">
          {USERS.map((name) => (
            <button
              key={name}
              type="button"
              className={user === name ? 'btn btn-primary' : 'btn'}
              aria-pressed={user === name}
              onClick={() => setUser(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 text-xs text-[var(--muted)]">{t(STRINGS.userHint)}</p>

      {/* Tree */}
      {mode === 'context' ? (
        <UserContext.Provider value={user}>
          <div className="relative rounded-xl border-2 border-dashed border-[var(--accent)] p-4">
            <div className="mono mb-1 text-sm text-[var(--accent)]">
              &lt;UserContext.Provider value=&#123;user&#125;&gt;
            </div>
            <p className="mb-4 text-xs text-[var(--muted)]">{t(STRINGS.providerNote)}</p>
            {/* Direct line: provider → Avatar, drawn along the left gutter */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-16 left-[29px] top-28 w-0.5 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
            >
              {phase !== 'idle' && (
                <span
                  style={{ top: phase === 'done' ? 'calc(100% - 22px)' : '8px' }}
                  className="mono absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--accent)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--accent)] transition-all duration-500"
                >
                  {t(STRINGS.dotLabel)}
                </span>
              )}
              <span className="mono absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-wider text-[var(--accent)]">
                {t(STRINGS.directLabel)}
              </span>
            </div>
            {renderTree()}
          </div>
        </UserContext.Provider>
      ) : (
        <div className="rounded-xl border border-[var(--border)] p-4">{renderTree()}</div>
      )}

      {/* Event log */}
      <h3 className="mt-6 mb-2 text-sm font-semibold text-[var(--text-strong)]">
        {t(STRINGS.logTitle)}
      </h3>
      <div
        aria-live="polite"
        className="mono min-h-[6rem] rounded-lg border border-[var(--border)] bg-[var(--code-bg)] p-4 text-sm"
      >
        {log.length === 0 ? (
          <p className="text-[var(--muted)]">{t(STRINGS.logEmpty)}</p>
        ) : (
          <ol className="m-0 list-none space-y-1 p-0">
            {log.map((entry, i) => (
              <li key={`${i}-${entry.kind}`} className="text-[var(--text)]">
                <span className="mr-2 text-[var(--muted)]">{String(i + 1).padStart(2, '0')}</span>
                {renderLogEntry(entry)}
              </li>
            ))}
          </ol>
        )}
      </div>

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <Compare
        cols={[
          { title: t(STRINGS.codeDrillTitle), children: <CodeBlock code={DRILL_CODE} lang="jsx" /> },
          { title: t(STRINGS.codeCtxTitle), children: <CodeBlock code={CONTEXT_CODE} lang="jsx" /> },
        ]}
      />

      <Callout type="warn" title={t(STRINGS.calloutTitle)}>
        {t(STRINGS.calloutText)}
      </Callout>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={questions} quizId="context-lab" />
    </SimulationShell>
  )
}
