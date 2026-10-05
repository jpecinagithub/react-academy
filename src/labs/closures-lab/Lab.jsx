import { useEffect, useRef, useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Quiz,
  Compare,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'Every render is a **snapshot**: the component function runs again with fresh values, and every function created during that render — including event handlers and timeout callbacks — **closes over the values of that render**. A `setTimeout` callback scheduled during render #3 still sees render #3’s `count`, even if the user clicks twice before it fires. That captured-but-outdated value is a **stale closure**.',
    es: 'Cada render es una **instantánea**: la función componente se ejecuta de nuevo con valores frescos, y cada función creada durante ese render —incluidos manejadores y callbacks de timeouts— **captura los valores de ese render**. Un callback de `setTimeout` programado durante el render #3 sigue viendo el `count` del render #3, aunque el usuario pulse dos veces antes de que se dispare. Ese valor capturado pero desactualizado es un **closure obsoleto**.',
  },
  trap: { en: 'The trap: log count in 3 seconds', es: 'La trampa: registrar count en 3 segundos' },
  trapHint: {
    en: 'Click +1 twice, then press “Log in 3s” immediately. The timeout callback captured count at schedule time — watch what it logs versus the live value.',
    es: 'Pulsa +1 dos veces y luego «Registrar en 3 s» al instante. El callback del timeout capturó count al programarse: observa lo que registra frente al valor en vivo.',
  },
  schedule: { en: 'Log count in 3s', es: 'Registrar count en 3 s' },
  captured: { en: 'captured value', es: 'valor capturado' },
  liveValue: { en: 'current value', es: 'valor actual' },
  pending: { en: 'Pending timeouts', es: 'Temporizadores pendientes' },
  log: { en: 'Timeout log', es: 'Registro de timeouts' },
  stale: { en: 'stale!', es: '¡obsoleto!' },
  fresh: { en: 'fresh', es: 'fresco' },
  snapshots: { en: 'Each render’s closure', es: 'El closure de cada render' },
  snapshotsHint: {
    en: 'Every render creates a fresh closure over its own snapshot of count. Click +1 and watch a new snapshot card appear.',
    es: 'Cada render crea un closure nuevo sobre su propia instantánea de count. Pulsa +1 y observa aparecer una nueva tarjeta de instantánea.',
  },
  renderN: { en: 'Render', es: 'Render' },
  closedOver: { en: 'closed over count =', es: 'capturó count =' },
  fix1: { en: 'Fix 1 · functional update', es: 'Solución 1 · actualización funcional' },
  fix1Body: {
    en: 'If the timeout only needs to *change* state, use the updater form: `setCount(c => c + 1)` always receives the latest queued value — no snapshot is read, so nothing can go stale.',
    es: 'Si el timeout solo necesita *cambiar* el estado, usa la forma actualizadora: `setCount(c => c + 1)` siempre recibe el último valor encolado; no lee ninguna instantánea, así que nada puede quedar obsoleto.',
  },
  fix1Btn: { en: '+1 in 3s (functional)', es: '+1 en 3 s (funcional)' },
  fix2: { en: 'Fix 2 · ref mirror', es: 'Solución 2 · espejo con ref' },
  fix2Body: {
    en: 'If the timeout needs to *read* the latest value, mirror it into a ref. Refs are mutable boxes shared across renders — `countRef.current` always holds the freshest count, and reading it never triggers a render.',
    es: 'Si el timeout necesita *leer* el último valor, refléjalo en un ref. Los refs son cajas mutables compartidas entre renders: `countRef.current` siempre guarda el count más fresco, y leerlo nunca provoca un render.',
  },
  fix2Btn: { en: 'Log ref in 3s', es: 'Registrar ref en 3 s' },
  refValue: { en: 'ref value (live)', es: 'valor del ref (en vivo)' },
  challenge: { en: 'Challenge', es: 'Reto' },
}

const CODE_TRAP = `function Counter() {
  const [count, setCount] = useState(0);

  function handleLog() {
    const captured = count; // snapshot of THIS render
    setTimeout(() => {
      console.log(captured); // still the old value!
    }, 3000);
  }
  // ...
}`

const CODE_FIXES = `// Fix 1: updater form — always chains on the latest value
setTimeout(() => setCount((c) => c + 1), 3000);

// Fix 2: ref mirror — read the freshest value on demand
const countRef = useRef(count);
useEffect(() => { countRef.current = count; });
setTimeout(() => console.log(countRef.current), 3000);`

const QUIZ = [
  {
    q: {
      en: 'You click +1 twice, then immediately schedule “log count in 3s”. What gets logged?',
      es: 'Pulsas +1 dos veces e inmediatamente programas «registrar count en 3 s». ¿Qué se registra?',
    },
    options: [
      { en: 'The count at the moment the timeout fires (the fresh value)', es: 'El count en el momento en que se dispara el timeout (el valor fresco)' },
      { en: 'The count at the moment the timeout was scheduled (the stale value)', es: 'El count en el momento en que se programó el timeout (el valor obsoleto)' },
      { en: 'Always 0', es: 'Siempre 0' },
    ],
    answer: 1,
    explain: {
      en: 'The callback closed over the render’s snapshot at schedule time. Later clicks create new renders — new snapshots — but the old callback keeps its own.',
      es: 'El callback capturó la instantánea del render al programarse. Los clics posteriores crean renders nuevos —instantáneas nuevas—, pero el callback antiguo conserva la suya.',
    },
  },
  {
    q: {
      en: 'Which fix guarantees the timeout works with the latest count when it only needs to increment?',
      es: '¿Qué solución garantiza que el timeout trabaje con el count más reciente si solo necesita incrementar?',
    },
    options: [
      { en: 'setTimeout(() => setCount(count + 1), 3000)', es: 'setTimeout(() => setCount(count + 1), 3000)' },
      { en: 'setTimeout(() => setCount((c) => c + 1), 3000)', es: 'setTimeout(() => setCount((c) => c + 1), 3000)' },
      { en: 'Reading count from a global variable', es: 'Leer count de una variable global' },
    ],
    answer: 1,
    explain: {
      en: 'The updater form receives the latest queued value instead of reading the stale snapshot.',
      es: 'La forma actualizadora recibe el último valor encolado en lugar de leer la instantánea obsoleta.',
    },
  },
]

let nextId = 1

function StaleTrapDemo() {
  const { t } = useLang()
  const [count, setCount] = useState(0)
  const [pending, setPending] = useState([]) // {id, captured}
  const [logs, setLogs] = useState([]) // {id, captured, live}
  const [snaps, setSnaps] = useState([{ render: 1, count: 0 }])
  const timers = useRef({})
  const liveRef = useRef(0)
  liveRef.current = count

  // record a snapshot card for each committed render
  const renderNo = useRef(1)
  useEffect(() => {
    renderNo.current += 1
    const n = renderNo.current
    setSnaps((s) => [...s.slice(-5), { render: n, count }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  const schedule = () => {
    const id = nextId++
    const captured = count
    setPending((p) => [...p, { id, captured }])
    timers.current[id] = setTimeout(() => {
      const live = liveRef.current
      delete timers.current[id]
      setPending((p) => p.filter((x) => x.id !== id))
      setLogs((l) => [...l.slice(-4), { id, captured, live }])
    }, 3000)
  }

  return (
    <div>
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap mb-4">
          <button type="button" className="btn text-xl px-4" onClick={() => setCount((c) => c + 1)}>
            +1
          </button>
          <div className="mono text-xl" aria-live="polite">
            count = <strong className="text-[var(--accent)]">{count}</strong>
          </div>
          <button type="button" className="btn btn-primary" onClick={schedule}>
            {t(STRINGS.schedule)}
          </button>
        </div>

        <Compare
          cols={[
            {
              title: t(STRINGS.captured),
              children: (
                <p className="mono text-sm text-[var(--muted)]">
                  {pending.length === 0
                    ? t({ en: 'no timeout scheduled yet', es: 'ningún timeout programado aún' })
                    : pending.map((p) => (
                      <span key={p.id} className="inline-block mr-2 mb-1 px-2 py-1 rounded bg-[var(--code-bg)] border border-[var(--code-border)]">
                        #{p.id} → <strong className="text-[var(--text-strong)]">{p.captured}</strong>
                      </span>
                    ))}
                </p>
              ),
            },
            {
              title: t(STRINGS.liveValue),
              children: (
                <p className="mono text-2xl font-bold text-[var(--green)]" aria-live="polite">
                  {count}
                </p>
              ),
            },
          ]}
        />
      </div>

      {logs.length > 0 && (
        <div className="card p-4 mb-4">
          <p className="text-sm font-semibold text-[var(--text-strong)] mb-2">{t(STRINGS.log)}</p>
          <ul className="mono text-sm flex flex-col gap-1.5">
            {logs.map((l) => {
              const isStale = l.captured !== l.live
              return (
                <li key={l.id} className="flex items-center gap-2 flex-wrap">
                  <span className="text-[var(--muted)]">#{l.id}</span>
                  <span>
                    {t({ en: 'logged', es: 'registró' })} <strong>{l.captured}</strong>
                  </span>
                  <span className="text-[var(--muted)]">
                    · {t(STRINGS.liveValue)}: <strong className="text-[var(--text-strong)]">{l.live}</strong>
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{ background: isStale ? 'var(--red)' : 'var(--green)', color: '#fff' }}
                  >
                    {isStale ? t(STRINGS.stale) : t(STRINGS.fresh)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <p className="text-sm font-semibold text-[var(--text-strong)] mt-6 mb-1">{t(STRINGS.snapshots)}</p>
      <p className="text-xs text-[var(--muted)] mb-3">{t(STRINGS.snapshotsHint)}</p>
      <div className="flex flex-wrap gap-2 mb-2" aria-live="polite">
        {snaps.map((s) => (
          <div
            key={s.render}
            className="mono text-xs rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] px-3 py-2"
          >
            <span className="text-[var(--muted)]">
              {t(STRINGS.renderN)} #{s.render}
            </span>
            <br />
            <span className="text-[var(--text-strong)]">
              {t(STRINGS.closedOver)} <strong className="text-[var(--accent)]">{s.count}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FixDemos() {
  const { t } = useLang()
  const [countA, setCountA] = useState(0)
  const [countB, setCountB] = useState(0)
  const [refLog, setRefLog] = useState(null)
  const countRef = useRef(0)
  const timers = useRef([])

  useEffect(() => {
    countRef.current = countB
  }, [countB])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn) => {
    timers.current.push(setTimeout(fn, 3000))
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div className="card p-4">
        <p className="font-semibold text-[var(--text-strong)] mb-2">{t(STRINGS.fix1)}</p>
        <p className="text-xs text-[var(--muted)] mb-3">{t(STRINGS.fix1Body)}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" className="btn text-sm" onClick={() => setCountA((c) => c + 1)}>
            +1 {t({ en: 'now', es: 'ahora' })}
          </button>
          <button type="button" className="btn btn-primary text-sm" onClick={() => later(() => setCountA((c) => c + 1))}>
            {t(STRINGS.fix1Btn)}
          </button>
          <span className="mono" aria-live="polite">
            count = <strong className="text-[var(--accent)]">{countA}</strong>
          </span>
        </div>
      </div>
      <div className="card p-4">
        <p className="font-semibold text-[var(--text-strong)] mb-2">{t(STRINGS.fix2)}</p>
        <p className="text-xs text-[var(--muted)] mb-3">{t(STRINGS.fix2Body)}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" className="btn text-sm" onClick={() => setCountB((c) => c + 1)}>
            +1
          </button>
          <button type="button" className="btn btn-primary text-sm" onClick={() => later(() => setRefLog(countRef.current))}>
            {t(STRINGS.fix2Btn)}
          </button>
          <span className="mono text-sm" aria-live="polite">
            {t(STRINGS.refValue)}: <strong className="text-[var(--green)]">{countRef.current}</strong>
            {refLog !== null && (
              <span className="text-[var(--muted)]"> · {t({ en: 'logged', es: 'registró' })}: <strong>{refLog}</strong></span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ClosuresLab() {
  const { t } = useLang()

  return (
    <SimulationShell
      labId="closures-lab"
      title={t({ en: 'Closures + React', es: 'Closures + React' })}
      intro={t({
        en: 'State values are snapshots; functions remember the snapshot they were born in. Watch a timer betray you — then fix it.',
        es: 'Los valores del estado son instantáneas; las funciones recuerdan la instantánea en la que nacieron. Mira cómo un temporizador te traiciona… y luego corrígelo.',
      })}
      difficulty="advanced"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="text-[var(--text-strong)]">{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>
      <CodeBlock code={CODE_TRAP} lang="jsx" />

      <SectionTitle>{t(STRINGS.trap)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.trapHint)}</p>
      <StaleTrapDemo />

      <SectionTitle>{t({ en: 'The fixes', es: 'Las soluciones' })}</SectionTitle>
      <FixDemos />
      <CodeBlock code={CODE_FIXES} lang="jsx" />

      <Callout type="tip" title={t({ en: 'Mental model', es: 'Modelo mental' })}>
        {t({
          en: 'Don’t think “the variable count changed under the function”. Think “each render created a new count, and the function kept the one from its own render”. Snapshots, not mutations.',
          es: 'No pienses «la variable count cambió bajo la función». Piensa «cada render creó un count nuevo, y la función conservó el de su propio render». Instantáneas, no mutaciones.',
        })}
      </Callout>

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="closures-lab" />
    </SimulationShell>
  )
}
