import { useState, useCallback, useRef, memo } from 'react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  Compare,
  Quiz,
  GlossaryTerm,
  SectionTitle,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  title: { en: 'useCallback LAB', es: 'LAB de useCallback' },
  intro: {
    en: 'Every render creates a brand-new function. Watch a memoized child re-render because of it — then stabilize the reference with useCallback.',
    es: 'Cada render crea una función nueva. Observa cómo un hijo memoizado re-renderiza por ello, y luego estabiliza la referencia con useCallback.',
  },
  conceptTitle: {
    en: 'The problem: a new function every render',
    es: 'El problema: una función nueva en cada render',
  },
  conceptP1: {
    en: 'In JavaScript, running the line `() => {}` creates a brand-new function object — every single time. When a component re-renders, its whole function body runs again, so every inline arrow function inside it is a different object than in the previous render, even if the code is identical.',
    es: 'En JavaScript, ejecutar la línea `() => {}` crea un objeto función completamente nuevo, cada vez. Cuando un componente re-renderiza, todo su cuerpo se ejecuta de nuevo, así que cada función flecha definida dentro es un objeto distinto al del render anterior, aunque el código sea idéntico.',
  },
  conceptP2a: { en: 'That breaks', es: 'Esto rompe' },
  conceptP2b: {
    en: ' — a memoized child re-renders only when its props change, and “change” is checked by reference (Object.is). A fresh onClick identity looks like a changed prop, so the child re-renders even though nothing meaningful changed.',
    es: ' — un hijo memoizado solo re-renderiza si sus props cambian, y «cambiar» se comprueba por referencia (Object.is). Una identidad nueva de onClick parece una prop cambiada, así que el hijo re-renderiza aunque nada relevante haya cambiado.',
  },
  flowTitle: {
    en: 'Without useCallback: the chain reaction',
    es: 'Sin useCallback: la reacción en cadena',
  },
  experimentTitle: {
    en: 'Experiment: stabilize the reference',
    es: 'Experimento: estabiliza la referencia',
  },
  experimentHint: {
    en: 'Start with useCallback OFF and press “Re-render parent” a few times — watch the child’s render count climb. Then switch useCallback ON and repeat: the function identity freezes and the child stays quiet. The child’s panel border turns green when memo() skips it, amber when it re-renders.',
    es: 'Empieza con useCallback en OFF y pulsa «Re-renderizar padre» varias veces: observa cómo sube el contador de renders del hijo. Luego pon useCallback en ON y repite: la identidad de la función se congela y el hijo se queda quieto. El borde del panel del hijo se vuelve verde cuando memo() lo omite, ámbar cuando re-renderiza.',
  },
  parentTitle: { en: 'Parent', es: 'Padre' },
  on: { en: 'ON', es: 'ON' },
  off: { en: 'OFF', es: 'OFF' },
  rerenderBtn: {
    en: 'Re-render parent (unrelated state)',
    es: 'Re-renderizar padre (estado no relacionado)',
  },
  resetDemo: { en: 'Reset demo', es: 'Reiniciar demo' },
  parentRenders: { en: 'Parent renders', es: 'Renders del padre' },
  fnIdentity: { en: 'handleClick identity', es: 'Identidad de handleClick' },
  childClicks: {
    en: 'Button clicks (via onClick)',
    es: 'Clics del botón (vía onClick)',
  },
  childTitle: {
    en: 'Child — memoized with memo()',
    es: 'Hijo — memoizado con memo()',
  },
  childRenders: { en: 'Child renders', es: 'Renders del hijo' },
  receivedFn: { en: 'onClick received', es: 'onClick recibido' },
  childBtn: { en: 'Call onClick', es: 'Llamar a onClick' },
  evRerendered: { en: 'child re-rendered', es: 'el hijo re-renderizó' },
  evSkipped: { en: 'child skipped', es: 'hijo omitido' },
  logTitle: { en: 'Event log', es: 'Registro de eventos' },
  logHint: {
    en: 'The last 8 parent renders — newest at the bottom.',
    es: 'Los últimos 8 renders del padre; el más reciente, al final.',
  },
  logEmpty: {
    en: 'Nothing logged yet — press “Re-render parent” or toggle useCallback.',
    es: 'Nada registrado aún: pulsa «Re-renderizar padre» o cambia useCallback.',
  },
  clearLog: { en: 'Clear', es: 'Limpiar' },
  logLine: {
    en: 'Parent #{parent} → fn #{fn} → Child #{child}',
    es: 'Padre #{parent} → fn #{fn} → Hijo #{child}',
  },
  reasonManual: {
    en: 'unrelated parent state',
    es: 'estado no relacionado del padre',
  },
  reasonToggle: { en: 'useCallback toggled', es: 'useCallback conmutado' },
  reasonChild: {
    en: 'child button called onClick',
    es: 'el botón hijo llamó a onClick',
  },
  codeTitle: {
    en: 'The code: one line changes everything',
    es: 'El código: una línea lo cambia todo',
  },
  codeWithout: { en: 'Without useCallback', es: 'Sin useCallback' },
  codeWith: { en: 'With useCallback', es: 'Con useCallback' },
  codeNote: {
    en: 'Identical components — the only difference is how handleClick is created. (In the live demo above, the same idea runs behind an ON/OFF switch; note that hooks are never conditional: useCallback is always called.)',
    es: 'Componentes idénticos: la única diferencia es cómo se crea handleClick. (En la demo de arriba, la misma idea funciona tras un interruptor ON/OFF; fíjate en que los hooks nunca son condicionales: useCallback siempre se llama.)',
  },
  conclusionTitle: { en: 'Key idea', es: 'Idea clave' },
  conclusion: {
    en: 'useCallback is about referential stability — keeping the same function identity for memoized children and effect dependency arrays — not about speed. The function still runs whenever it is called. And every useCallback has a cost, so don’t wrap every handler: use it where identity actually matters.',
    es: 'useCallback trata de estabilidad referencial: mantener la misma identidad de función para hijos memoizados y arrays de dependencias de efectos, no de velocidad. La función sigue ejecutándose cada vez que se la llama. Y cada useCallback tiene un coste, así que no envuelvas cada manejador: úsalo donde la identidad importe de verdad.',
  },
  quizTitle: { en: 'Check your understanding', es: 'Comprueba lo aprendido' },
  q1: {
    en: 'What does useCallback(fn, deps) preserve across re-renders?',
    es: '¿Qué conserva useCallback(fn, deps) entre renders?',
  },
  q1Options: [
    {
      en: 'The value the function returns',
      es: 'El valor que devuelve la función',
    },
    {
      en: 'The function’s identity (its reference), while deps stay the same',
      es: 'La identidad de la función (su referencia), mientras las dependencias no cambien',
    },
    {
      en: 'The component’s state at the time it was created',
      es: 'El estado del componente en el momento de su creación',
    },
    {
      en: 'It stops the function from ever running again',
      es: 'Impide que la función vuelva a ejecutarse',
    },
  ],
  q1Explain: {
    en: 'useCallback hands back the same function object on every render unless a dependency changed. Calling it still runs the code — only the reference is stable.',
    es: 'useCallback devuelve el mismo objeto función en cada render salvo que cambie una dependencia. Llamarla sigue ejecutando el código: solo la referencia es estable.',
  },
  q2: {
    en: 'When is useCallback actually useful?',
    es: '¿Cuándo es realmente útil useCallback?',
  },
  q2Options: [
    {
      en: 'On every event handler, to make the app faster',
      es: 'En cada manejador de eventos, para que la app sea más rápida',
    },
    {
      en: 'When the function is passed to a memoized child or listed in an effect’s dependency array',
      es: 'Cuando la función se pasa a un hijo memoizado o aparece en el array de dependencias de un efecto',
    },
    { en: 'Only inside class components', es: 'Solo en componentes de clase' },
    {
      en: 'When you want the function to run later',
      es: 'Cuando quieres que la función se ejecute más tarde',
    },
  ],
  q2Explain: {
    en: 'Its value is referential stability: it lets memo() skip renders and keeps effect dependencies from changing pointlessly. Wrapping every handler adds overhead with no benefit.',
    es: 'Su valor es la estabilidad referencial: permite que memo() omita renders y evita que las dependencias de efectos cambien sin motivo. Envolver cada manejador añade coste sin beneficio.',
  },
}

const FLOW_STEPS = [
  {
    label: { en: 'Parent re-renders', es: 'El padre re-renderiza' },
    desc: {
      en: 'some unrelated state changes',
      es: 'cambia un estado no relacionado',
    },
  },
  {
    label: {
      en: 'const handleClick = () => {} runs again',
      es: 'const handleClick = () => {} se ejecuta de nuevo',
    },
    desc: {
      en: 'a brand-new function object is born',
      es: 'nace un objeto función nuevo',
    },
  },
  {
    label: {
      en: 'Child receives a new onClick reference',
      es: 'El hijo recibe una nueva referencia onClick',
    },
  },
  {
    label: {
      en: 'memo() compares: old fn !== new fn',
      es: 'memo() compara: fn anterior !== fn nueva',
    },
    desc: {
      en: 'check fails → child re-renders for nothing',
      es: 'falla la comprobación → el hijo re-renderiza sin motivo',
    },
  },
]

const CODE_WITHOUT = `function Parent() {
  const [tick, setTick] = useState(0)

  // Runs on EVERY render -> a new function object each time
  const handleClick = () => {
    console.log('clicked')
  }

  // New reference every time, so memo() can never skip this:
  return <Child onClick={handleClick} />
}

const Child = memo(function Child({ onClick }) {
  console.log('Child rendered')
  return <button onClick={onClick}>Click me</button>
})`

const CODE_WITH = `function Parent() {
  const [tick, setTick] = useState(0)

  // Same function object across renders (deps never change)
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  // Stable reference -> memo() skips the child when tick changes
  return <Child onClick={handleClick} />
}

const Child = memo(function Child({ onClick }) {
  console.log('Child rendered')
  return <button onClick={onClick}>Click me</button>
})`

const QUIZ_QUESTIONS = [
  {
    q: STRINGS.q1,
    options: STRINGS.q1Options,
    answer: 1,
    explain: STRINGS.q1Explain,
  },
  {
    q: STRINGS.q2,
    options: STRINGS.q2Options,
    answer: 1,
    explain: STRINGS.q2Explain,
  },
]

const LOG_MAX = 8
const REASONS = {
  manual: STRINGS.reasonManual,
  toggle: STRINGS.reasonToggle,
  child: STRINGS.reasonChild,
}

// Module level: defining it inside the parent would create a new component
// type on every render and memo() could never work.
const Child = memo(function Child({ onClick, fnId, onLog, counterRef }) {
  const { t } = useLang()
  counterRef.current += 1
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <dl className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <dt className="text-xs text-[var(--muted)] mb-1">
            {t(STRINGS.childRenders)}
          </dt>
          <dd
            className="mono text-2xl font-bold text-[var(--accent)]"
            aria-live="polite"
          >
            {counterRef.current}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--muted)] mb-1">
            {t(STRINGS.receivedFn)}
          </dt>
          <dd
            className="mono text-2xl font-bold text-[var(--text-strong)]"
            aria-live="polite"
          >
            #{fnId}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        className="btn"
        onClick={() => {
          onLog()
          onClick()
        }}
      >
        {t(STRINGS.childBtn)}
      </button>
    </div>
  )
})

function UseCallbackDemo() {
  const { t } = useLang()
  const [, setTick] = useState(0) // unrelated state: re-renders the parent
  const [clicks, setClicks] = useState(0)
  const [log, setLog] = useState([])
  const [useCb, setUseCb] = useState(false)

  const parentRendersRef = useRef(0)
  const lastFnRef = useRef(null)
  const fnIdRef = useRef(0)
  const childRendersRef = useRef(0)
  const useCbRef = useRef(useCb)

  // Hooks are never conditional: both functions exist on every render,
  // the switch only picks which one is passed down.
  const stableFn = useCallback(() => {
    setClicks((c) => c + 1)
  }, [])
  const freshFn = () => {
    setClicks((c) => c + 1)
  }
  const handleClick = useCb ? stableFn : freshFn

  // Render-phase bookkeeping. These refs are only read during the render
  // that wrote them (or inside event handlers predicting the next render),
  // so the display is always consistent — no useEffect mirror is needed and
  // no extra renders are triggered.
  parentRendersRef.current += 1
  useCbRef.current = useCb
  if (handleClick !== lastFnRef.current) {
    lastFnRef.current = handleClick
    fnIdRef.current += 1
  }
  const fnId = fnIdRef.current

  const logEvent = useCallback((reason, useCbValue) => {
    const value = useCbValue ?? useCbRef.current
    // Toggling always swaps the function object; otherwise the identity
    // only changes when useCallback is OFF.
    const identityChanges = reason === 'toggle' || !value
    setLog((prev) => [
      ...prev.slice(-(LOG_MAX - 1)),
      {
        parent: parentRendersRef.current + 1,
        fn: fnIdRef.current + (identityChanges ? 1 : 0),
        child: childRendersRef.current + (identityChanges ? 1 : 0),
        rerendered: identityChanges,
        reason,
      },
    ])
  }, [])

  const handleManualRender = () => {
    logEvent('manual', useCb)
    setTick((x) => x + 1)
  }

  const handleToggle = (next) => {
    logEvent('toggle', next)
    setUseCb(next)
  }

  // Stable reference: safe to pass to the memoized child.
  const handleChildAction = useCallback(() => {
    logEvent('child')
  }, [logEvent])

  const lastEntry = log[log.length - 1]
  const childBorder = !lastEntry
    ? 'border-[var(--border)]'
    : lastEntry.rerendered
      ? 'border-[var(--amber)]'
      : 'border-[var(--green)]'

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Parent panel */}
        <section
          aria-label={t(STRINGS.parentTitle)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5"
        >
          <h3 className="font-bold text-[var(--text-strong)] mb-4">
            {t(STRINGS.parentTitle)}
          </h3>

          <label className="inline-flex items-center gap-3 cursor-pointer select-none mb-4">
            <span className="relative inline-flex w-11 h-6 shrink-0">
              <input
                type="checkbox"
                role="switch"
                aria-checked={useCb}
                checked={useCb}
                onChange={(e) => handleToggle(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[var(--border)] peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)] transition-colors"
              />
              <span
                aria-hidden="true"
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
              />
            </span>
            <span className="mono text-sm text-[var(--text-strong)]">
              useCallback
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                useCb
                  ? 'bg-[var(--green-dim)] text-[var(--green)]'
                  : 'text-[var(--muted)] border border-[var(--border)]'
              }`}
            >
              {useCb ? t(STRINGS.on) : t(STRINGS.off)}
            </span>
          </label>

          <div className="mb-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleManualRender}
            >
              {t(STRINGS.rerenderBtn)}
            </button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">
                {t(STRINGS.parentRenders)}
              </dt>
              <dd
                className="mono text-2xl font-bold text-[var(--accent)]"
                aria-live="polite"
              >
                {parentRendersRef.current}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">
                {t(STRINGS.fnIdentity)}
              </dt>
              <dd
                className="mono text-2xl font-bold text-[var(--text-strong)]"
                aria-live="polite"
              >
                #{fnId}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">
              <dt className="text-xs text-[var(--muted)]">
                {t(STRINGS.childClicks)}
              </dt>
              <dd
                className="mono text-2xl font-bold text-[var(--text-strong)]"
                aria-live="polite"
              >
                {clicks}
              </dd>
            </div>
          </dl>
        </section>

        {/* Child panel */}
        <section
          aria-label={t(STRINGS.childTitle)}
          className={`rounded-xl border bg-[var(--surface-2)] p-5 transition-colors ${childBorder}`}
        >
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-bold text-[var(--text-strong)]">
              {t(STRINGS.childTitle)}
            </h3>
            {lastEntry && (
              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  lastEntry.rerendered
                    ? 'bg-[var(--amber-dim)] text-[var(--amber)]'
                    : 'bg-[var(--green-dim)] text-[var(--green)]'
                }`}
              >
                {t(lastEntry.rerendered ? STRINGS.evRerendered : STRINGS.evSkipped)}
              </span>
            )}
          </div>
          <Child
            onClick={handleClick}
            fnId={fnId}
            onLog={handleChildAction}
            counterRef={childRendersRef}
          />
        </section>
      </div>

      {/* Event log */}
      <h3 className="text-lg font-bold text-[var(--text-strong)] mt-8 mb-3">
        {t(STRINGS.logTitle)}
      </h3>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <p className="text-sm text-[var(--muted)]">{t(STRINGS.logHint)}</p>
          {log.length > 0 && (
            <button type="button" className="btn" onClick={() => setLog([])}>
              {t(STRINGS.clearLog)}
            </button>
          )}
        </div>
        {log.length === 0 ? (
          <p className="text-sm text-[var(--muted)] italic">
            {t(STRINGS.logEmpty)}
          </p>
        ) : (
          <ol
            aria-live="polite"
            aria-label={t(STRINGS.logTitle)}
            className="flex flex-col gap-2"
          >
            {log.map((entry, i) => (
              <li
                key={`${entry.parent}-${i}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-[var(--border)] px-3 py-2"
              >
                <span className="mono text-sm text-[var(--text-strong)]">
                  {t(STRINGS.logLine, {
                    parent: entry.parent,
                    fn: entry.fn,
                    child: entry.child,
                  })}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    entry.rerendered
                      ? 'bg-[var(--amber-dim)] text-[var(--amber)]'
                      : 'bg-[var(--green-dim)] text-[var(--green)]'
                  }`}
                >
                  {t(entry.rerendered ? STRINGS.evRerendered : STRINGS.evSkipped)}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {t(REASONS[entry.reason])}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default function UseCallbackLab() {
  const { t } = useLang()
  const [demoKey, setDemoKey] = useState(0)

  return (
    <SimulationShell
      labId="usecallback-lab"
      title={t(STRINGS.title)}
      intro={t(STRINGS.intro)}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <div className="flex flex-col gap-3 text-[var(--text)] max-w-3xl">
        <p>{t(STRINGS.conceptP1)}</p>
        <p>
          {t(STRINGS.conceptP2a)}{' '}
          <GlossaryTerm term="memoization">
            <code className="mono text-[0.9em]">React.memo()</code>
          </GlossaryTerm>
          {t(STRINGS.conceptP2b)}
        </p>
      </div>

      <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
      <FlowSteps steps={FLOW_STEPS} />

      <SectionTitle>{t(STRINGS.experimentTitle)}</SectionTitle>
      <Callout type="tip">{t(STRINGS.experimentHint)}</Callout>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          className="btn"
          onClick={() => setDemoKey((k) => k + 1)}
        >
          {t(STRINGS.resetDemo)}
        </button>
      </div>
      <UseCallbackDemo key={demoKey} />

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <Compare
        cols={[
          {
            title: t(STRINGS.codeWithout),
            children: <CodeBlock code={CODE_WITHOUT} lang="jsx" />,
          },
          {
            title: t(STRINGS.codeWith),
            children: <CodeBlock code={CODE_WITH} lang="jsx" />,
          },
        ]}
      />
      <p className="text-sm text-[var(--muted)] max-w-3xl">
        {t(STRINGS.codeNote)}
      </p>

      <Callout type="info" title={t(STRINGS.conclusionTitle)}>
        {t(STRINGS.conclusion)}
      </Callout>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={QUIZ_QUESTIONS} quizId="usecallback-lab" />
    </SimulationShell>
  )
}
