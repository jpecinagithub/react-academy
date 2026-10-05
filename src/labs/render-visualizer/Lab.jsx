import { useState } from 'react'
import {
  SimulationShell,
  CodeBlock,
  Callout,
  Quiz,
  SectionTitle,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  tree: { en: 'The component tree', es: 'El árbol de componentes' },
  treeHint: {
    en: 'Press +1 inside Counter. Nodes that re-render flash and their Render # badge increments. The card on the right explains why.',
    es: 'Pulsa +1 dentro de Counter. Los nodos que se vuelven a renderizar parpadean y su insignia Render # aumenta. La tarjeta de la derecha explica por qué.',
  },
  memo: { en: 'Memoize Header & Footer (React.memo)', es: 'Memoizar Header y Footer (React.memo)' },
  memoHint: {
    en: 'With memo on, Header and Footer skip the re-render because their props did not change. The state change still re-runs App and Counter.',
    es: 'Con memo activado, Header y Footer se saltan el render porque sus props no cambiaron. El cambio de estado sigue re-ejecutando App y Counter.',
  },
  why: { en: 'Why did each node re-render?', es: '¿Por qué se volvió a renderizar cada nodo?' },
  badge: { en: 'Render', es: 'Render' },
  takeaway: { en: 'The key takeaway', es: 'La idea clave' },
  takeawayBody: {
    en: 'A React component is a function that React calls again. Every re-render is just React executing your function with the latest state and props.',
    es: 'Un componente React es una función que React vuelve a llamar. Cada re-render es simplemente React ejecutando tu función con el estado y las props más recientes.',
  },
  rulesTitle: { en: 'Render rules of thumb', es: 'Reglas prácticas del render' },
  quizTitle: { en: 'Check what you learned', es: 'Comprueba lo aprendido' },
}

const NODES = ['app', 'header', 'counter', 'card', 'footer']

const NODE_META = {
  app: { en: 'App', es: 'App', note: { en: 'owns the count state → re-runs', es: 'posee el estado count → se re-ejecuta' } },
  header: { en: 'Header', es: 'Header', note: { en: 'child of App → re-runs with its parent (unless memoized)', es: 'hijo de App → se re-ejecuta con su padre (salvo memo)' } },
  counter: { en: 'Counter', es: 'Counter', note: { en: 'its own state changed → re-runs', es: 'su propio estado cambió → se re-ejecuta' } },
  card: { en: 'UserCard', es: 'UserCard', note: { en: 'child of App → re-runs with its parent', es: 'hijo de App → se re-ejecuta con su padre' } },
  footer: { en: 'Footer', es: 'Footer', note: { en: 'child of App → re-runs with its parent (unless memoized)', es: 'hijo de App → se re-ejecuta con su padre (salvo memo)' } },
}

const RULES = [
  {
    en: 'A component re-renders when its own state changes.',
    es: 'Un componente se vuelve a renderizar cuando cambia su propio estado.',
  },
  {
    en: 'It also re-renders when its parent re-renders (children follow the parent).',
    es: 'También cuando su padre se vuelve a renderizar (los hijos siguen al padre).',
  },
  {
    en: 'React.memo lets a component skip re-renders when its props are unchanged.',
    es: 'React.memo permite a un componente saltarse renders cuando sus props no cambian.',
  },
  {
    en: 'Re-render ≠ DOM update: React compares first and touches only what changed.',
    es: 'Re-render ≠ actualización del DOM: React compara primero y solo toca lo que cambió.',
  },
]

const QUIZ_QUESTIONS = [
  {
    q: { en: 'What does “render” mean in React?', es: '¿Qué significa «render» en React?' },
    options: [
      { en: 'React calls your component function again', es: 'React vuelve a llamar a tu función componente' },
      { en: 'The browser repaints the whole page', es: 'El navegador repinta toda la página' },
      { en: 'Your code file is saved', es: 'Tu archivo de código se guarda' },
    ],
    answer: 0,
    explain: {
      en: 'Render = React executing the component function. The DOM is only touched afterwards, and only where the output changed.',
      es: 'Render = React ejecutando la función componente. El DOM solo se toca después, y solo donde la salida cambió.',
    },
  },
  {
    q: {
      en: 'App holds the state and re-renders. What happens to its children by default?',
      es: 'App tiene el estado y se vuelve a renderizar. ¿Qué les pasa a sus hijos por defecto?',
    },
    options: [
      { en: 'They re-render too', es: 'También se vuelven a renderizar' },
      { en: 'They never re-render', es: 'Nunca se vuelven a renderizar' },
      { en: 'Only the first child re-renders', es: 'Solo se vuelve a renderizar el primer hijo' },
    ],
    answer: 0,
    explain: {
      en: 'By default, when a parent re-renders, React re-runs all its children — unless a child is memoized and its props are unchanged.',
      es: 'Por defecto, cuando un padre se vuelve a renderizar, React re-ejecuta todos sus hijos, salvo que un hijo esté memoizado y sus props no hayan cambiado.',
    },
  },
  {
    q: { en: 'What does React.memo do?', es: '¿Qué hace React.memo?' },
    options: [
      { en: 'Skips re-rendering when props are unchanged', es: 'Evita el re-render cuando las props no cambian' },
      { en: 'Makes state persist between pages', es: 'Hace que el estado persista entre páginas' },
      { en: 'Speeds up the initial page load', es: 'Acelera la carga inicial de la página' },
    ],
    answer: 0,
    explain: {
      en: 'memo compares the new props with the previous ones and skips calling the component when they are equal.',
      es: 'memo compara las nuevas props con las anteriores y evita llamar al componente cuando son iguales.',
    },
  },
]

function TreeNode({ id, renders, flashed, children, t }) {
  return (
    <div
      className={`card p-3 text-center min-w-[7rem] transition-all ${flashed ? 'flash' : ''}`}
      style={flashed ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-dim)' } : undefined}
    >
      <div className="font-semibold text-[var(--text-strong)] text-sm">{t(NODE_META[id])}</div>
      <div className="mt-2">
        <span key={renders} className="mono text-xs px-2 py-1 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] font-bold render-pop">
          {t(STRINGS.badge)} #{renders}
        </span>
      </div>
      <div className="text-[11px] text-[var(--muted)] mt-2 leading-snug">{t(NODE_META[id].note)}</div>
      {children}
    </div>
  )
}

export default function RenderVisualizer() {
  const { t } = useLang()
  const [renders, setRenders] = useState({ app: 1, header: 1, counter: 1, card: 1, footer: 1 })
  const [memo, setMemo] = useState(false)
  const [flashed, setFlashed] = useState([])

  const increment = () => {
    const next = { ...renders }
    const hit = ['app', 'counter', 'card']
    if (!memo) hit.push('header', 'footer')
    hit.forEach((id) => {
      next[id] += 1
    })
    setRenders(next)
    setFlashed(hit)
    window.clearTimeout(increment._t)
    increment._t = window.setTimeout(() => setFlashed([]), 900)
  }

  const code = memo
    ? `// Header and Footer are memoized:\n// their props never change, so React skips them.\nconst Header = memo(function Header() { … });\nconst Footer = memo(function Footer() { … });\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  // +1 → App, Counter and UserCard re-run.\n  // Header & Footer are skipped.\n}`
    : `function App() {\n  const [count, setCount] = useState(0);\n  // +1 → App re-runs, and by default\n  // ALL its children re-run too.\n  return (\n    <>\n      <Header />\n      <Counter />\n      <UserCard />\n      <Footer />\n    </>\n  );\n}`

  return (
    <SimulationShell
      labId="render-visualizer"
      title={t({ en: 'Render Visualizer', es: 'Visualizador de renders' })}
      intro={t({
        en: 'See render as what it really is: React calling your functions again.',
        es: 'Mira el render como lo que realmente es: React llamando a tus funciones de nuevo.',
      })}
      difficulty="beginner"
    >
      <style>{`
        @keyframes renderPop { 0% { transform: scale(1.35); } 100% { transform: scale(1); } }
        .render-pop { display: inline-block; animation: renderPop 0.45s ease-out; }
        @keyframes nodeFlash { 0%,100% { } 50% { background: var(--accent-dim); } }
        .flash { animation: nodeFlash 0.9s ease-in-out; }
        @media (prefers-reduced-motion: reduce) { .render-pop, .flash { animation: none; } }
      `}</style>

      <SectionTitle>{t(STRINGS.tree)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.treeHint)}</p>

      <div className="flex flex-col items-center gap-2 my-6">
        <TreeNode id="app" renders={renders.app} flashed={flashed.includes('app')} t={t} />
        <div className="text-[var(--accent)] text-xl leading-none" aria-hidden="true">↓</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
          <TreeNode id="header" renders={renders.header} flashed={flashed.includes('header')} t={t} />
          <TreeNode id="counter" renders={renders.counter} flashed={flashed.includes('counter')} t={t}>
            <button type="button" className="btn btn-primary mt-2 w-full" onClick={increment}>
              +1
            </button>
          </TreeNode>
          <TreeNode id="card" renders={renders.card} flashed={flashed.includes('card')} t={t} />
          <TreeNode id="footer" renders={renders.footer} flashed={flashed.includes('footer')} t={t} />
        </div>
      </div>

      <label className="card p-4 flex items-start gap-3 cursor-pointer my-4">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4"
          checked={memo}
          onChange={(e) => setMemo(e.target.checked)}
        />
        <span>
          <span className="font-semibold text-[var(--text-strong)] text-sm">{t(STRINGS.memo)}</span>
          <span className="block text-xs text-[var(--muted)] mt-1">{t(STRINGS.memoHint)}</span>
        </span>
      </label>

      <div className="grid md:grid-cols-2 gap-4 items-start">
        <div>
          <SectionTitle>{t(STRINGS.why)}</SectionTitle>
          <ul className="space-y-2">
            {NODES.map((id) => (
              <li key={id} className="text-sm card px-3 py-2 flex justify-between gap-2">
                <span className="text-[var(--text-strong)] font-medium">{t(NODE_META[id])}</span>
                <span className="mono text-[var(--muted)]">{t(STRINGS.badge)} #{renders[id]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <CodeBlock code={code} lang="jsx" />
        </div>
      </div>

      <SectionTitle>{t(STRINGS.rulesTitle)}</SectionTitle>
      <ul className="space-y-2 my-2">
        {RULES.map((r, i) => (
          <li key={i} className="flex gap-2 text-sm text-[var(--text)]">
            <span className="text-[var(--accent)]" aria-hidden="true">▸</span>
            <span>{t(r)}</span>
          </li>
        ))}
      </ul>

      <Callout type="info">
        <strong>{t(STRINGS.takeaway)}: </strong>
        <GlossaryTerm term="render">{t({ en: 'render', es: 'render' })}</GlossaryTerm>{' — '}
        {t(STRINGS.takeawayBody)}
      </Callout>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={QUIZ_QUESTIONS} quizId="render-visualizer" />
    </SimulationShell>
  )
}
