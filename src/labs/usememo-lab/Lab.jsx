import { useState, useMemo, useRef, useEffect, useSyncExternalStore, memo } from 'react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  Compare,
  Quiz,
  SectionTitle,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  title: { en: 'useMemo LAB: cache expensive computations', es: 'LAB de useMemo: cachea los cálculos costosos' },
  intro: {
    en: 'An artificially expensive computation, side by side: WITHOUT vs WITH useMemo. Press re-render and watch who recomputes.',
    es: 'Un cálculo artificialmente costoso, lado a lado: SIN vs CON useMemo. Pulsa re-render y observa quién recalcula.',
  },
  conceptTitle: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'useMemo caches the result of a computation between renders. React only runs your function again when one of the dependencies changes — otherwise it returns the cached value. Think of it as a performance escape hatch: it does not change what your component renders, only how much work it repeats.',
    es: 'useMemo guarda en caché el resultado de un cálculo entre renders. React solo vuelve a ejecutar tu función cuando cambia una de las dependencias; si no, devuelve el valor cacheado. Piensa en ello como una vía de escape para el rendimiento: no cambia lo que renderiza tu componente, solo cuánto trabajo repite.',
  },
  visualTitle: { en: 'What happens on an unrelated re-render', es: 'Qué pasa en un re-render no relacionado' },
  experimentTitle: { en: 'Experiment', es: 'Experimento' },
  experimentHint: {
    en: 'Set the complexity, then press "Re-render": it changes state that the computation does not depend on. Compare the recalculation counters.',
    es: 'Ajusta la complejidad y pulsa "Re-render": cambia un estado del que el cálculo no depende. Compara los contadores de recálculos.',
  },
  complexityLabel: { en: 'Complexity', es: 'Complejidad' },
  inputLabel: { en: 'Input (the dependency)', es: 'Entrada (la dependencia)' },
  decreaseInput: { en: 'Decrease input', es: 'Disminuir entrada' },
  increaseInput: { en: 'Increase input', es: 'Aumentar entrada' },
  unrelatedLabel: { en: 'Unrelated state (tick)', es: 'Estado no relacionado (tick)' },
  rerenderBtn: { en: 'Re-render (unrelated state)', es: 'Re-render (estado no relacionado)' },
  changeInputBtn: { en: 'Change input', es: 'Cambiar entrada' },
  resetBtn: { en: 'Reset counters', es: 'Reiniciar contadores' },
  withoutTitle: { en: 'WITHOUT useMemo', es: 'SIN useMemo' },
  withTitle: { en: 'WITH useMemo', es: 'CON useMemo' },
  withoutHint: {
    en: 'Recomputes on every render — even when the input did not change.',
    es: 'Recalcula en cada render, aunque la entrada no haya cambiado.',
  },
  withHint: {
    en: 'Recomputes only when the input or the complexity changes; otherwise the cached value is reused.',
    es: 'Solo recalcula cuando cambian la entrada o la complejidad; si no, reutiliza el valor cacheado.',
  },
  mRenders: { en: 'Renders', es: 'Renders' },
  mRecalcs: { en: 'Recalculations', es: 'Recálculos' },
  mMs: { en: 'Last computation', es: 'Último cálculo' },
  mValue: { en: 'Computed value', es: 'Valor calculado' },
  msNote: {
    en: 'Measured with performance.now(): the workload is artificial and its cost scales with the complexity slider.',
    es: 'Medido con performance.now(): la carga es artificial y su coste escala con el deslizador de complejidad.',
  },
  ahaTitle: { en: 'The "aha" moment', es: 'El momento «ajá»' },
  ahaBody: {
    en: 'Press "Re-render" a few times: the WITHOUT panel recomputes on every click (watch the milliseconds — the UI even stutters), while the WITH panel performs zero new computations. Now press "Change input": both panels recompute exactly once, because a real dependency changed.',
    es: 'Pulsa "Re-render" varias veces: el panel SIN recalcula en cada clic (mira los milisegundos: la UI hasta se entrecorta), mientras el panel CON hace cero cálculos nuevos. Ahora pulsa "Cambiar entrada": ambos recalculan exactamente una vez, porque cambió una dependencia real.',
  },
  codeTitle: { en: 'The code', es: 'El código' },
  codePlainCap: { en: 'Without useMemo', es: 'Sin useMemo' },
  codeMemoCap: { en: 'With useMemo', es: 'Con useMemo' },
  conclusionTitle: { en: 'Before you memoize everything', es: 'Antes de memoizarlo todo' },
  warnBody: {
    en: "useMemo is not free: React compares the dependency array on every render and keeps the cached value in memory. Don't wrap every calculation — profile first, then memoize the computations that are actually expensive (or the objects whose identity must stay stable).",
    es: 'useMemo no es gratis: React compara el array de dependencias en cada render y mantiene el valor cacheado en memoria. No envuelvas cada cálculo: perfila primero y memoiza los cálculos que de verdad sean costosos (o los objetos cuya identidad deba mantenerse estable).',
  },
  quizTitle: { en: 'Challenge', es: 'Reto' },
}

const FLOW_STEPS = [
  {
    label: { en: 'Unrelated state changes', es: 'Cambia un estado no relacionado' },
    desc: { en: 'tick: 0 → 1 — the computation does not depend on it', es: 'tick: 0 → 1: el cálculo no depende de él' },
  },
  {
    label: { en: 'The parent re-renders', es: 'El padre se re-renderiza' },
    desc: { en: 'both panels go through the render pass', es: 'ambos paneles pasan por el render' },
  },
  {
    label: { en: 'WITHOUT useMemo', es: 'SIN useMemo' },
    desc: { en: 'runs the expensive function again — wasted work', es: 'vuelve a ejecutar la función costosa: trabajo desperdiciado' },
  },
  {
    label: { en: 'WITH useMemo', es: 'CON useMemo' },
    desc: { en: 'deps [input] are unchanged → the cached value is reused', es: 'las deps [input] no cambian → se reutiliza el valor cacheado' },
  },
]

const CODE_PLAIN = `// Runs on EVERY render — even when \`input\` didn't change
function Panel({ input }) {
  const value = expensiveComputation(input); // expensive!
  return <div>{value}</div>;
}`

const CODE_MEMO = `// Runs only when \`input\` changes — otherwise the cached value is reused
function Panel({ input }) {
  const value = useMemo(() => expensiveComputation(input), [input]);
  return <div>{value}</div>;
}`

const QUIZ = [
  {
    q: { en: 'When does the value returned by useMemo get recomputed?', es: '¿Cuándo se recalcula el valor que devuelve useMemo?' },
    options: [
      { en: 'On every render, like a normal calculation', es: 'En cada render, como un cálculo normal' },
      { en: 'Only when one of its dependencies changes', es: 'Solo cuando cambia una de sus dependencias' },
      { en: 'Only when the component unmounts', es: 'Solo cuando el componente se desmonta' },
      { en: 'Never — it is computed once, forever', es: 'Nunca: se calcula una sola vez, para siempre' },
    ],
    answer: 1,
    explain: {
      en: 'useMemo re-runs the function only when a value in the dependency array changes. Otherwise the cached result is reused.',
      es: 'useMemo vuelve a ejecutar la función solo cuando cambia un valor del array de dependencias. Si no, reutiliza el resultado cacheado.',
    },
  },
  {
    q: { en: 'Is useMemo free to use everywhere?', es: '¿Es gratis usar useMemo en todas partes?' },
    options: [
      { en: 'Yes — memoizing everything is always faster', es: 'Sí: memoizar todo siempre es más rápido' },
      { en: 'No — each useMemo costs a dependency comparison and memory; reserve it for expensive computations', es: 'No: cada useMemo cuesta comparar dependencias y memoria; resérvalo para cálculos costosos' },
      { en: 'Yes — React memoizes every value automatically', es: 'Sí: React memoiza todos los valores automáticamente' },
    ],
    answer: 1,
    explain: {
      en: 'Memoization has a cost: React compares the deps on every render and holds the cached value in memory. Profile first, memoize second.',
      es: 'La memoización tiene un coste: React compara las dependencias en cada render y mantiene el valor en memoria. Primero perfila, después memoiza.',
    },
  },
]

/* Artificially expensive, deterministic computation. Cost scales linearly
   with `complexity`: complexity × 100k sqrt ops (~a few ms at 1, ~100–300ms at 100). */
const OPS_PER_UNIT = 100000

function expensiveComputation(input, complexity) {
  let acc = 0
  const n = Math.max(1, Math.round(complexity * OPS_PER_UNIT))
  for (let i = 1; i <= n; i++) acc += Math.sqrt(i + input)
  return acc
}

/* Tiny external store per panel. Panels publish their stats after each
   render; the metric view subscribes and re-renders WITHOUT re-rendering
   the panel — so displaying live counters never triggers extra computations. */
function createStatsBus() {
  let stats = { renders: 0, recalcs: 0, ms: 0, value: 0 }
  const listeners = new Set()
  return {
    getStats: () => stats,
    publish(next) {
      stats = next
      listeners.forEach((l) => l())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

function Metric({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div
        className={`mono text-xl font-bold ${accent ? 'text-[var(--accent)]' : 'text-[var(--text-strong)]'}`}
        aria-live="polite"
      >
        {value}
      </div>
    </div>
  )
}

function PanelStats({ bus, L }) {
  const stats = useSyncExternalStore(bus.subscribe, bus.getStats)
  const { lang } = useLang()
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <Metric label={L.renders} value={String(stats.renders)} />
        <Metric label={L.recalcs} value={String(stats.recalcs)} accent />
        <Metric label={L.ms} value={`${stats.ms.toFixed(1)} ms`} />
        <Metric
          label={L.value}
          value={Math.round(stats.value).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')}
        />
      </div>
      <p className="text-sm text-[var(--muted)] mt-3">{L.hint}</p>
    </div>
  )
}

/* WITHOUT useMemo: recomputes on every render. Re-renders whenever the
   parent re-renders (it receives `tick`-driven renders too). */
function PlainPanel({ input, complexity, bus, L }) {
  const counters = useRef({ renders: 0, recalcs: 0, ms: 0 })
  counters.current.renders += 1
  const t0 = performance.now()
  const value = expensiveComputation(input, complexity)
  counters.current.ms = performance.now() - t0
  counters.current.recalcs += 1
  useEffect(() => {
    bus.publish({ ...counters.current, value })
  })
  return <PanelStats bus={bus} L={L} />
}

/* WITH useMemo: the expensive function only re-runs when `input` or
   `complexity` change. Wrapped in memo() and NOT given `tick`, so an
   unrelated parent re-render doesn't even reach this component. */
const MemoPanel = memo(function MemoPanel({ input, complexity, bus, L }) {
  const counters = useRef({ renders: 0, recalcs: 0, ms: 0 })
  counters.current.renders += 1
  const value = useMemo(() => {
    const t0 = performance.now()
    const v = expensiveComputation(input, complexity)
    counters.current.ms = performance.now() - t0
    counters.current.recalcs += 1
    return v
  }, [input, complexity])
  useEffect(() => {
    bus.publish({ ...counters.current, value })
  })
  return <PanelStats bus={bus} L={L} />
})

export default function UseMemoLab() {
  const { t, lang } = useLang()
  const [complexity, setComplexity] = useState(40)
  const [input, setInput] = useState(7)
  const [tick, setTick] = useState(0)
  const [panelKey, setPanelKey] = useState(0)
  const [buses] = useState(() => ({ plain: createStatsBus(), memo: createStatsBus() }))

  const Lplain = useMemo(
    () => ({
      renders: t(STRINGS.mRenders),
      recalcs: t(STRINGS.mRecalcs),
      ms: t(STRINGS.mMs),
      value: t(STRINGS.mValue),
      hint: t(STRINGS.withoutHint),
    }),
    [t, lang],
  )
  const Lmemo = useMemo(
    () => ({
      renders: t(STRINGS.mRenders),
      recalcs: t(STRINGS.mRecalcs),
      ms: t(STRINGS.mMs),
      value: t(STRINGS.mValue),
      hint: t(STRINGS.withHint),
    }),
    [t, lang],
  )

  return (
    <SimulationShell
      labId="usememo-lab"
      title={t(STRINGS.title)}
      intro={t(STRINGS.intro)}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <p className="text-[var(--text)] leading-relaxed max-w-3xl">{t(STRINGS.conceptBody)}</p>

      <SectionTitle>{t(STRINGS.visualTitle)}</SectionTitle>
      <FlowSteps steps={FLOW_STEPS} />

      <SectionTitle>{t(STRINGS.experimentTitle)}</SectionTitle>
      <p className="text-[var(--muted)] max-w-3xl mb-4">{t(STRINGS.experimentHint)}</p>

      <div className="grid md:grid-cols-3 gap-4 my-6">
        <div className="card p-4">
          <label htmlFor="usememo-complexity" className="block text-sm font-semibold text-[var(--text-strong)] mb-2">
            {t(STRINGS.complexityLabel)}:{' '}
            <span className="mono text-[var(--accent)]" aria-live="polite">
              {complexity}
            </span>
          </label>
          <input
            id="usememo-complexity"
            type="range"
            min={1}
            max={100}
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full"
            aria-label={t(STRINGS.complexityLabel)}
          />
        </div>

        <div className="card p-4">
          <div className="text-sm font-semibold text-[var(--text-strong)] mb-2">{t(STRINGS.inputLabel)}</div>
          <div className="flex items-center gap-3">
            <button type="button" className="btn" aria-label={t(STRINGS.decreaseInput)} onClick={() => setInput((v) => Math.max(1, v - 1))}>
              −
            </button>
            <span className="mono text-xl font-bold text-[var(--text-strong)] min-w-[3ch] text-center" aria-live="polite">
              {input}
            </span>
            <button type="button" className="btn" aria-label={t(STRINGS.increaseInput)} onClick={() => setInput((v) => Math.min(99, v + 1))}>
              +
            </button>
          </div>
        </div>

        <div className="card p-4 flex flex-col gap-2">
          <button type="button" className="btn btn-primary" onClick={() => setTick((v) => v + 1)}>
            {t(STRINGS.rerenderBtn)}
          </button>
          <div className="text-sm text-[var(--muted)]">
            {t(STRINGS.unrelatedLabel)}:{' '}
            <span className="mono text-[var(--text-strong)]" aria-live="polite">
              {tick}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={() => setInput(10 + Math.floor(Math.random() * 89))}>
              {t(STRINGS.changeInputBtn)}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setTick(0)
                setPanelKey((k) => k + 1)
              }}
            >
              {t(STRINGS.resetBtn)}
            </button>
          </div>
        </div>
      </div>

      <Compare
        cols={[
          {
            title: t(STRINGS.withoutTitle),
            children: (
              <PlainPanel key={`plain-${panelKey}`} input={input} complexity={complexity} bus={buses.plain} L={Lplain} />
            ),
          },
          {
            title: t(STRINGS.withTitle),
            children: (
              <MemoPanel key={`memo-${panelKey}`} input={input} complexity={complexity} bus={buses.memo} L={Lmemo} />
            ),
          },
        ]}
      />
      <p className="text-xs text-[var(--muted)] mb-4">* {t(STRINGS.msNote)}</p>

      <Callout type="tip" title={t(STRINGS.ahaTitle)}>
        {t(STRINGS.ahaBody)}
      </Callout>

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <p className="text-sm font-semibold text-[var(--text-strong)] mb-2">{t(STRINGS.codePlainCap)}</p>
      <CodeBlock code={CODE_PLAIN} lang="jsx" />
      <p className="text-sm font-semibold text-[var(--text-strong)] mt-6 mb-2">{t(STRINGS.codeMemoCap)}</p>
      <CodeBlock code={CODE_MEMO} lang="jsx" />

      <SectionTitle>{t(STRINGS.conclusionTitle)}</SectionTitle>
      <Callout type="warn">{t(STRINGS.warnBody)}</Callout>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz quizId="usememo-lab" questions={QUIZ} />
    </SimulationShell>
  )
}
