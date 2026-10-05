import { useEffect, useRef, useState } from 'react'
import {
  SimulationShell,
  CodeBlock,
  Callout,
  Quiz,
  Compare,
  SectionTitle,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  intro: {
    en: '`useRef` returns a mutable box — `{ current: … }` — that persists across renders. Writing to it never tells React to re-render. That single fact unlocks DOM access, timers, and "memory" without renders.',
    es: '`useRef` devuelve una caja mutable — `{ current: … }` — que persiste entre renders. Escribir en ella nunca le dice a React que re-renderice. Ese simple hecho desbloquea acceso al DOM, temporizadores y "memoria" sin renders.',
  },
  conceptTitle: { en: '1 · Concept: the box that survives', es: '1 · Concepto: la caja que sobrevive' },
  conceptBody: {
    en: 'State is for values that **drive the UI**: changing it re-renders. A ref is for values React **doesn\'t need to display**: DOM nodes, interval ids, previous values. Change a ref and nothing visually happens — until the next render for another reason reveals it.',
    es: 'El estado es para valores que **gobiernan la UI**: cambiarlo re-renderiza. Un ref es para valores que React **no necesita mostrar**: nodos del DOM, ids de intervalos, valores previos. Cambia un ref y visualmente no pasa nada — hasta que el próximo render por otro motivo lo revela.',
  },
  expTitle: { en: '2 · Experiment: state vs ref', es: '2 · Experimento: estado frente a ref' },
  expHint: {
    en: 'Press +1 on both sides. On the left, every press re-renders (watch the render counter). On the right, nothing happens — the value changes silently. Press "Force re-render" to reveal what the ref was hiding.',
    es: 'Pulsa +1 en ambos lados. A la izquierda, cada pulsación re-renderiza (mira el contador de renders). A la derecha no pasa nada: el valor cambia en silencio. Pulsa "Forzar re-render" para revelar lo que el ref ocultaba.',
  },
  stateSide: { en: 'LEFT — useState', es: 'IZQUIERDA — useState' },
  refSide: { en: 'RIGHT — useRef', es: 'DERECHA — useRef' },
  stateFlow: { en: 'State change → render', es: 'Cambio de estado → render' },
  refFlow: { en: 'Ref change → NO render', es: 'Cambio de ref → SIN render' },
  renders: { en: 'renders', es: 'renders' },
  value: { en: 'value', es: 'valor' },
  forceRender: { en: 'Force re-render', es: 'Forzar re-render' },
  revealed: { en: 'Revealed! The ref kept counting silently.', es: '¡Revelado! El ref siguió contando en silencio.' },

  domTitle: { en: '3 · Demo: reaching the DOM', es: '3 · Demo: alcanzar el DOM' },
  domDesc: {
    en: 'Refs also hold DOM nodes. Type in the input, then press the button: React hands you the real DOM element and you call `.focus()` on it directly.',
    es: 'Los refs también guardan nodos del DOM. Escribe en el input y pulsa el botón: React te entrega el elemento DOM real y llamas a `.focus()` directamente.',
  },
  focusBtn: { en: 'Focus the input', es: 'Enfocar el input' },
  inputLabel: { en: 'Your name', es: 'Tu nombre' },
  prevTitle: { en: '4 · Demo: remembering the previous value', es: '4 · Demo: recordar el valor anterior' },
  prevDesc: {
    en: 'State always shows the present. A ref updated inside an effect keeps the past: type and watch "previous" lag one step behind "current".',
    es: 'El estado siempre muestra el presente. Un ref actualizado dentro de un efecto guarda el pasado: escribe y observa cómo "anterior" va un paso por detrás de "actual".',
  },
  current: { en: 'current', es: 'actual' },
  previous: { en: 'previous', es: 'anterior' },

  codeTitle: { en: '5 · The code', es: '5 · El código' },
  codeCompare: { en: 'State vs ref, side by side', es: 'Estado frente a ref, lado a lado' },
  codeDom: { en: 'DOM access with a ref', es: 'Acceso al DOM con un ref' },
  codePrev: { en: 'Previous value with a ref', es: 'Valor anterior con un ref' },
  challengeTitle: { en: '6 · Challenge', es: '6 · Reto' },
  boxCallout: {
    en: 'Think of a ref as a sticky note taped to the component: React never reads it to decide what to render, so changing it never notifies React. The component only re-reads the note when it renders for another reason.',
    es: 'Piensa en un ref como una nota adhesiva pegada al componente: React nunca la lee para decidir qué renderizar, así que cambiarla nunca avisa a React. El componente solo relee la nota cuando renderiza por otro motivo.',
  },
}

const CODE_COMPARE = `// useState: change → render
function StateCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>
    {count}
  </button>;
}

// useRef: change → silence
function RefCounter() {
  const countRef = useRef(0);
  return <button onClick={() => {
    countRef.current += 1; // no render happens!
  }}>
    {countRef.current /* frozen until something else renders */}
  </button>;
}`

const CODE_DOM = `function NameForm() {
  const inputRef = useRef(null);   // starts empty

  const focusInput = () => {
    inputRef.current.focus();      // the real DOM node!
  };

  return (
    <>
      <input ref={inputRef} placeholder="name" />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}`

const CODE_PREV = `function Tracker({ value }) {
  const prevRef = useRef();         // survives renders

  useEffect(() => {
    prevRef.current = value;       // update AFTER render…
  });                              // …so during render it holds the PAST

  return <p>now: {value}, before: {prevRef.current}</p>;
}`

function StateCounter({ t }) {
  const [count, setCount] = useState(0)
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">{t(STRINGS.stateFlow)}</p>
      <button type="button" className="btn btn-primary text-xl px-6" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
      <p className="mono text-2xl font-bold text-[var(--accent)] mt-3" aria-live="polite">
        {t(STRINGS.value)} = {count}
      </p>
      <p className="mono text-sm text-[var(--muted)] mt-1">
        {renders.current} {t(STRINGS.renders)}
      </p>
    </div>
  )
}

function RefCounter({ t }) {
  const countRef = useRef(0)
  const renders = useRef(0)
  const [, force] = useState(0)
  const [revealed, setRevealed] = useState(false)
  renders.current += 1

  const bump = () => {
    countRef.current += 1 // silent: no render
  }
  const forceRender = () => {
    setRevealed(true)
    force((n) => n + 1)
  }

  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">{t(STRINGS.refFlow)}</p>
      <div className="flex gap-2 justify-center">
        <button type="button" className="btn text-xl px-6" onClick={bump}>
          +1
        </button>
        <button type="button" className="btn" onClick={forceRender}>
          👁 {t(STRINGS.forceRender)}
        </button>
      </div>
      <p className="mono text-2xl font-bold text-[var(--text-strong)] mt-3" aria-live="polite">
        {t(STRINGS.value)} = {countRef.current}
      </p>
      <p className="mono text-sm text-[var(--muted)] mt-1">
        {renders.current} {t(STRINGS.renders)}
      </p>
      {revealed && <p className="text-xs text-emerald-500 mt-2">✨ {t(STRINGS.revealed)}</p>}
    </div>
  )
}

function DomDemo({ t }) {
  const inputRef = useRef(null)
  const [name, setName] = useState('')
  return (
    <div className="card p-5">
      <p className="text-sm text-[var(--muted)] mb-3">{t(STRINGS.domDesc)}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="useref-name" className="text-sm font-semibold text-[var(--text-strong)]">
          {t(STRINGS.inputLabel)}
        </label>
        <input
          id="useref-name"
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada"
          className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text)]"
        />
        <button type="button" className="btn btn-primary" onClick={() => inputRef.current?.focus()}>
          🎯 {t(STRINGS.focusBtn)}
        </button>
      </div>
    </div>
  )
}

function PrevDemo({ t }) {
  const [text, setText] = useState('')
  const prevRef = useRef('')
  useEffect(() => {
    prevRef.current = text
  })
  return (
    <div className="card p-5">
      <p className="text-sm text-[var(--muted)] mb-3">{t(STRINGS.prevDesc)}</p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="type…"
        aria-label={t(STRINGS.current)}
        className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text)] w-full max-w-sm mb-3"
      />
      <div className="flex gap-6 mono text-sm">
        <p>
          <span className="text-[var(--muted)]">{t(STRINGS.current)}: </span>
          <strong className="text-[var(--accent)]" aria-live="polite">"{text}"</strong>
        </p>
        <p>
          <span className="text-[var(--muted)]">{t(STRINGS.previous)}: </span>
          <strong className="text-[var(--text-strong)]" aria-live="polite">"{prevRef.current}"</strong>
        </p>
      </div>
    </div>
  )
}

export default function UseRefLab() {
  const { t } = useLang()

  const quizQuestions = [
    {
      q: {
        en: 'You do `ref.current += 1`. What happens on screen?',
        es: 'Haces `ref.current += 1`. ¿Qué ocurre en pantalla?',
      },
      options: [
        { en: 'Nothing — until something else causes a render', es: 'Nada — hasta que otra cosa provoque un render' },
        { en: 'The component re-renders immediately', es: 'El componente se re-renderiza al instante' },
        { en: 'React throws an error', es: 'React lanza un error' },
      ],
      answer: 0,
      explain: {
        en: 'Mutating a ref never notifies React. The new value sits in the box, invisible, until the next render for another reason.',
        es: 'Mutar un ref nunca avisa a React. El nuevo valor queda en la caja, invisible, hasta el próximo render por otro motivo.',
      },
    },
    {
      q: {
        en: 'Which of these is a GOOD use for useRef?',
        es: '¿Cuál de estos es un BUEN uso de useRef?',
      },
      options: [
        { en: 'Storing a value that must appear on screen when it changes', es: 'Guardar un valor que debe aparecer en pantalla cuando cambie' },
        { en: 'Holding a DOM node or an interval id across renders', es: 'Guardar un nodo del DOM o un id de intervalo entre renders' },
        { en: 'Replacing useState everywhere to avoid renders', es: 'Reemplazar useState en todas partes para evitar renders' },
      ],
      answer: 1,
      explain: {
        en: 'Refs are for values React doesn\'t render: DOM nodes, timers, subscriptions, previous values. Values shown on screen belong in state.',
        es: 'Los refs son para valores que React no renderiza: nodos del DOM, temporizadores, suscripciones, valores previos. Los valores mostrados en pantalla van en el estado.',
      },
    },
  ]

  return (
    <SimulationShell
      labId="useref-lab"
      title={t({ en: 'useRef Lab', es: 'Laboratorio useRef' })}
      intro={t(STRINGS.intro)}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <p className="text-[var(--text)] mb-4 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>
      <Callout type="info">
        <GlossaryTerm term="ref">{t(STRINGS.boxCallout)}</GlossaryTerm>
      </Callout>

      <SectionTitle>{t(STRINGS.expTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4 max-w-3xl">{t(STRINGS.expHint)}</p>
      <Compare
        cols={[
          { title: t(STRINGS.stateSide), children: <StateCounter t={t} /> },
          { title: t(STRINGS.refSide), children: <RefCounter t={t} /> },
        ]}
      />

      <SectionTitle>{t(STRINGS.domTitle)}</SectionTitle>
      <DomDemo t={t} />

      <SectionTitle>{t(STRINGS.prevTitle)}</SectionTitle>
      <PrevDemo t={t} />

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-strong)] mb-2 text-sm">{t(STRINGS.codeCompare)}</h3>
          <CodeBlock code={CODE_COMPARE} lang="jsx" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-strong)] mb-2 text-sm">{t(STRINGS.codeDom)}</h3>
          <CodeBlock code={CODE_DOM} lang="jsx" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-strong)] mb-2 text-sm">{t(STRINGS.codePrev)}</h3>
          <CodeBlock code={CODE_PREV} lang="jsx" />
        </div>
      </div>

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <Quiz questions={quizQuestions} quizId="useref-challenge" />
    </SimulationShell>
  )
}
