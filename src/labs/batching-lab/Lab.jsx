import { useRef, useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Quiz,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'Calling a state setter does **not** change state immediately. It **schedules an update** — a small instruction placed in a queue. When your event handler finishes, React processes the whole queue and renders **once**. And crucially: every render works with a **snapshot** — the state values are frozen for that render, so `count` inside the handler is still the old value on all three lines.',
    es: 'Llamar a un setter de estado **no** cambia el estado al instante. **Programa una actualización**: una pequeña instrucción que entra en una cola. Cuando tu manejador termina, React procesa toda la cola y renderiza **una sola vez**. Y lo crucial: cada render trabaja con una **instantánea** — los valores del estado están congelados para ese render, así que `count` dentro del manejador sigue siendo el valor antiguo en las tres líneas.',
  },
  exp1: { en: 'Experiment 1 · the classic trap', es: 'Experimento 1 · la trampa clásica' },
  exp2: { en: 'Experiment 2 · the functional fix', es: 'Experimento 2 · la solución funcional' },
  predict: { en: 'What will count be after one click?', es: '¿Cuánto valdrá count tras un clic?' },
  run: { en: 'Run it', es: 'Ejecutarlo' },
  live: { en: 'Live proof with real React', es: 'Prueba en vivo con React real' },
  liveHint: {
    en: 'This counter runs the exact code above in real React. Click once and watch the render counter.',
    es: 'Este contador ejecuta el código exacto de arriba en React real. Pulsa una vez y observa el contador de renders.',
  },
  queue: { en: 'The update queue, step by step', es: 'La cola de actualizaciones, paso a paso' },
  nextUpdate: { en: 'Process next update', es: 'Procesar siguiente actualización' },
  resetQueue: { en: 'Reset queue', es: 'Reiniciar cola' },
  renders: { en: 'renders', es: 'renders' },
  result: { en: 'Result', es: 'Resultado' },
  correct: { en: 'Correct!', es: '¡Correcto!' },
  wrong: { en: 'Not quite — run it and see.', es: 'Casi… ejecútalo y mira.' },
  exp1Explain: {
    en: 'All three updates read the same snapshot (`count = 0`), so all three schedule the value `1`. React batches them into a single render: count goes 0 → 1. The setter never mutates state in place; it only enqueues “what the next state should be”.',
    es: 'Las tres actualizaciones leen la misma instantánea (`count = 0`), así que las tres programan el valor `1`. React las agrupa en un solo render: count pasa de 0 a 1. El setter nunca muta el estado en el momento; solo encola «cuál debería ser el próximo estado».',
  },
  exp2Explain: {
    en: 'Updater functions don’t read the stale snapshot — each one receives the result of the previous update in the queue: 0 → 1 → 2 → 3. Still a single render, but now the updates chain correctly. Use the functional form whenever the next state depends on the previous one.',
    es: 'Las funciones actualizadoras no leen la instantánea obsoleta: cada una recibe el resultado de la actualización anterior en la cola: 0 → 1 → 2 → 3. Sigue siendo un solo render, pero ahora las actualizaciones se encadenan bien. Usa la forma funcional siempre que el próximo estado dependa del anterior.',
  },
  batchNote: {
    en: 'Batching is automatic: since React 18, updates are batched in every context (events, timeouts, promises). One handler ⇒ one render, no matter how many setters you call.',
    es: 'El batching es automático: desde React 18, las actualizaciones se agrupan en todos los contextos (eventos, timeouts, promesas). Un manejador ⇒ un render, sin importar cuántos setters llames.',
  },
  challenge: { en: 'Challenge', es: 'Reto' },
}

const CODE_TRAP = `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  // ...
}`

const CODE_FIX = `function handleClick() {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}`

function Predict({ options, value, onPick, t }) {
  return (
    <div className="flex gap-2 my-3" role="group" aria-label={t(STRINGS.predict)}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`btn mono text-lg px-5 ${value === opt ? 'btn-primary' : ''}`}
          aria-pressed={value === opt}
          onClick={() => onPick(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function LiveDemo({ functional, label }) {
  const { t } = useLang()
  const [count, setCount] = useState(0)
  const renders = useRef(0)
  renders.current += 1

  const run = () => {
    if (functional) {
      setCount((c) => c + 1)
      setCount((c) => c + 1)
      setCount((c) => c + 1)
    } else {
      setCount(count + 1)
      setCount(count + 1)
      setCount(count + 1)
    }
  }

  return (
    <div className="card p-4 mb-4">
      <p className="text-sm font-semibold text-[var(--text-strong)] mb-1">{label}</p>
      <p className="text-xs text-[var(--muted)] mb-3">{t(STRINGS.liveHint)}</p>
      <div className="flex items-center gap-4 flex-wrap">
        <button type="button" className="btn btn-primary" onClick={run}>
          {t(STRINGS.run)}
        </button>
        <div className="mono text-xl" aria-live="polite">
          count = <strong className="text-[var(--accent)]">{count}</strong>
        </div>
        <div className="mono text-sm text-[var(--muted)]" aria-live="polite">
          {t(STRINGS.renders)}: <strong className="text-[var(--text-strong)]">{renders.current}</strong>
        </div>
        <button
          type="button"
          className="btn text-sm"
          onClick={() => {
            setCount(0)
            renders.current = 0
          }}
        >
          {t({ en: 'Reset', es: 'Reiniciar' })}
        </button>
      </div>
    </div>
  )
}

function QueueStepper({ functional }) {
  const { t } = useLang()
  const [step, setStep] = useState(0) // 0..3 processed, 4 = rendered
  const total = 3

  const processed = Math.min(step, total)
  const done = step >= total + 1

  // value carried through the queue
  let carried = 0
  const rows = []
  for (let i = 0; i < total; i++) {
    const reads = functional ? carried : 0
    const writes = reads + 1
    carried = writes
    rows.push({ i, reads, writes })
  }
  const finalValue = functional ? 3 : 1

  return (
    <div className="card p-4 mb-4">
      <p className="text-sm font-semibold text-[var(--text-strong)] mb-3">{t(STRINGS.queue)}</p>
      <div className="mono text-sm rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] p-3 mb-3">
        <div className="text-[var(--muted)]">
          {'// snapshot for this render: count = 0'}
        </div>
        {rows.map((r) => {
          const isDone = r.i < processed
          const isNext = r.i === processed && !done
          return (
            <div
              key={r.i}
              className="flex items-center gap-2 py-1.5 px-2 rounded"
              style={{
                background: isNext ? 'var(--accent-dim)' : 'transparent',
                opacity: isDone || isNext ? 1 : 0.45,
              }}
            >
              <span
                className="inline-block w-5 h-5 rounded-full text-[10px] leading-5 text-center font-bold"
                style={{
                  background: isDone ? 'var(--green)' : 'var(--border)',
                  color: isDone ? '#fff' : 'var(--muted)',
                }}
                aria-hidden="true"
              >
                {isDone ? '✓' : r.i + 1}
              </span>
              <code className="text-[var(--text)]">
                {functional ? 'setCount(c => c + 1)' : 'setCount(count + 1)'}
              </code>
              {(isDone || done) && (
                <span className="text-[var(--muted)] text-xs">
                  → {t({ en: 'reads', es: 'lee' })} {r.reads} → {t({ en: 'queues', es: 'encola' })} {r.writes}
                </span>
              )}
            </div>
          )
        })}
        {done && (
          <div
            className="mt-2 pt-2 font-bold text-[var(--text-strong)]"
            style={{ borderTop: '1px solid var(--border)' }}
            aria-live="polite"
          >
            {t({ en: 'React renders ONCE → count = ', es: 'React renderiza UNA vez → count = ' })}
            <span className="text-[var(--accent)] text-lg">{finalValue}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-primary"
          disabled={done}
          onClick={() => setStep((s) => Math.min(s + 1, total + 1))}
        >
          {done
            ? t(STRINGS.result)
            : step < total
              ? t(STRINGS.nextUpdate)
              : t({ en: 'Render!', es: '¡Renderizar!' })}
        </button>
        <button type="button" className="btn" onClick={() => setStep(0)}>
          {t(STRINGS.resetQueue)}
        </button>
      </div>
    </div>
  )
}

function Experiment({ code, functional, predictKey, liveLabel, explain, t }) {
  const [prediction, setPrediction] = useState(null)
  const expected = functional ? 3 : 1

  return (
    <div className="mb-10">
      <CodeBlock code={code} lang="jsx" />
      <p className="font-semibold text-[var(--text-strong)] mt-4">{t(STRINGS.predict)}</p>
      <Predict options={[1, 2, 3]} value={prediction} onPick={setPrediction} t={t} />
      <LiveDemo key={predictKey} functional={functional} label={liveLabel} />
      {prediction !== null && (
        <p className={`text-sm font-semibold mb-2 ${prediction === expected ? 'text-[var(--green)]' : 'text-[var(--red)]'}`} aria-live="polite">
          {prediction === expected ? t(STRINGS.correct) : t(STRINGS.wrong)}
        </p>
      )}
      <QueueStepper functional={functional} />
      <Callout type="info">{t(explain)}</Callout>
    </div>
  )
}

const QUIZ = [
  {
    q: {
      en: 'Why does count become 1 and not 3 in experiment 1?',
      es: '¿Por qué count vale 1 y no 3 en el experimento 1?',
    },
    options: [
      { en: 'React ignores the second and third calls', es: 'React ignora la segunda y tercera llamada' },
      { en: 'All three calls read the same snapshot (count = 0), so all queue the value 1', es: 'Las tres llamadas leen la misma instantánea (count = 0), así que todas encolan el valor 1' },
      { en: 'setCount can only be called once per handler', es: 'setCount solo puede llamarse una vez por manejador' },
    ],
    answer: 1,
    explain: {
      en: 'State is a snapshot per render. The three setters all compute from the same frozen value.',
      es: 'El estado es una instantánea por render. Los tres setters calculan a partir del mismo valor congelado.',
    },
  },
  {
    q: {
      en: 'How many times does React render after the three functional updates?',
      es: '¿Cuántas veces renderiza React tras las tres actualizaciones funcionales?',
    },
    options: [
      { en: 'Three times — one per setter', es: 'Tres veces: una por setter' },
      { en: 'Once — updates are batched automatically', es: 'Una vez: las actualizaciones se agrupan automáticamente' },
      { en: 'Zero — nothing changed', es: 'Cero: nada cambió' },
    ],
    answer: 1,
    explain: {
      en: 'Batching is automatic in React 18+: one handler, one render, chained queue values 0 → 1 → 2 → 3.',
      es: 'El batching es automático desde React 18: un manejador, un render, valores encadenados 0 → 1 → 2 → 3.',
    },
  },
]

export default function BatchingLab() {
  const { t } = useLang()

  return (
    <SimulationShell
      labId="batching-lab"
      title={t({ en: 'State Batching Lab', es: 'Laboratorio de batching de estado' })}
      intro={t({
        en: 'The most educational three lines in React: predict the result, watch the queue, understand the snapshot.',
        es: 'Las tres líneas más educativas de React: predice el resultado, observa la cola, entiende la instantánea.',
      })}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-6 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="text-[var(--text-strong)]">{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>

      <SectionTitle>{t(STRINGS.exp1)}</SectionTitle>
      <Experiment
        code={CODE_TRAP}
        functional={false}
        predictKey="trap"
        liveLabel={t(STRINGS.live)}
        explain={STRINGS.exp1Explain}
        t={t}
      />

      <SectionTitle>{t(STRINGS.exp2)}</SectionTitle>
      <Experiment
        code={CODE_FIX}
        functional
        predictKey="fix"
        liveLabel={t(STRINGS.live)}
        explain={STRINGS.exp2Explain}
        t={t}
      />

      <Callout type="tip" title={t({ en: 'Good to know', es: 'Conviene saber' })}>
        {t(STRINGS.batchNote)}
      </Callout>

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="batching-lab" />
    </SimulationShell>
  )
}
