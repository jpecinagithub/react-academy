import { useEffect, useRef, useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  Callout,
  FlowSteps,
  Quiz,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'
import { ArrowDown, ArrowUp, ShoppingCart, Search } from 'lucide-react'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'React has **one-way data flow**. Data travels **down** the tree as props — a parent hands values to its children. Children never mutate their parents: to communicate **up**, they call a **callback** the parent passed down. Blue dots are props going down; green dots are events going up.',
    es: 'React tiene **flujo de datos unidireccional**. Los datos viajan **hacia abajo** como props: un padre entrega valores a sus hijos. Los hijos nunca mutan a sus padres: para comunicarse **hacia arriba**, llaman a un **callback** que el padre les pasó. Los puntos azules son props bajando; los verdes, eventos subiendo.',
  },
  experiment: { en: 'Experiment: move data yourself', es: 'Experimento: mueve los datos tú' },
  experimentHint: {
    en: 'Type in the filter (App state → props flow down). Click Buy (event flows up, then fresh props flow down).',
    es: 'Escribe en el filtro (estado de App → las props bajan). Pulsa Comprar (el evento sube y luego bajan props nuevas).',
  },
  buy: { en: 'Buy', es: 'Comprar' },
  filterPlaceholder: { en: 'Filter products…', es: 'Filtrar productos…' },
  filterLabel: { en: 'Search filter (App state)', es: 'Filtro de búsqueda (estado de App)' },
  logTitle: { en: 'Flow log', es: 'Registro del flujo' },
  takeaway: { en: 'Data flows down. Events communicate upward.', es: 'Los datos fluyen hacia abajo. Los eventos se comunican hacia arriba.' },
  selectProduct: { en: 'Select a product to inspect it as <Product>', es: 'Selecciona un producto para inspeccionarlo como <Product>' },
  downLabel: { en: 'props ↓', es: 'props ↓' },
  upLabel: { en: 'event ↑', es: 'evento ↑' },
  quizTitle: { en: 'Check your mental model', es: 'Comprueba tu modelo mental' },
  rerenderFlash: { en: 're-rendered', es: 're-renderizado' },
  stateLabel: { en: 'state', es: 'estado' },
  propsLabel: { en: 'props received', es: 'props recibidas' },
}

const PRODUCTS = [
  { id: 'p1', name: { en: 'Keyboard', es: 'Teclado' }, price: 49 },
  { id: 'p2', name: { en: 'Mouse', es: 'Ratón' }, price: 29 },
  { id: 'p3', name: { en: 'Monitor', es: 'Monitor' }, price: 199 },
  { id: 'p4', name: { en: 'Headphones', es: 'Auriculares' }, price: 89 },
]

const FLOW_BUY = [
  { label: { en: 'User clicks Buy in <Product>', es: 'El usuario pulsa Comprar en <Product>' } },
  { label: { en: 'Product calls onBuy(product)', es: 'Product llama a onBuy(product)' }, desc: { en: 'the callback prop travels UP', es: 'la prop callback viaja HACIA ARRIBA' } },
  { label: { en: 'App runs setCart([...])', es: 'App ejecuta setCart([...])' }, desc: { en: 'state lives in App — only App can change it', es: 'el estado vive en App: solo App puede cambiarlo' } },
  { label: { en: 'App re-renders', es: 'App se re-renderiza' }, desc: { en: 'fresh props flow DOWN again', es: 'props nuevas fluyen HACIA ABAJO otra vez' } },
]

function NodeBox({ name, color, children, flash }) {
  return (
    <div
      className="rounded-xl border-2 bg-[var(--surface-2)] p-4 transition-shadow"
      style={{
        borderColor: color,
        boxShadow: flash ? `0 0 0 4px ${color}55` : 'none',
      }}
    >
      <p className="mono font-bold text-[var(--text-strong)] mb-3" style={{ color }}>
        &lt;{name} /&gt;
      </p>
      {children}
    </div>
  )
}

function FlowEdge({ active, dir, label }) {
  return (
    <div className="relative flex justify-center" aria-hidden={!active}>
      <div className="relative w-10 h-16">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[var(--border)]" />
        {active &&
          [0, 1, 2].map((i) => (
            <span
              key={i}
              className={dir === 'down' ? 'df-dot-down' : 'df-dot-up'}
              style={{ animationDelay: `${i * 220}ms` }}
            />
          ))}
      </div>
      <span
        className={`mono absolute left-1/2 top-1/2 -translate-y-1/2 ml-8 text-xs px-2 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] whitespace-nowrap transition-opacity ${
          active ? 'opacity-100' : 'opacity-60'
        }`}
        style={{ color: dir === 'up' ? 'var(--green)' : 'var(--accent)' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function DataFlowLab() {
  const { t, lang } = useLang()
  const [filter, setFilter] = useState('')
  const [cart, setCart] = useState([])
  const [selectedId, setSelectedId] = useState('p1')
  const [pulse, setPulse] = useState(null) // { id, dir, edges:[], labels:{} }
  const [flash, setFlash] = useState(null) // node name to highlight
  const [log, setLog] = useState([])
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  const pushLog = (entry) => setLog((l) => [{ ...entry, at: l.length + 1 }, ...l].slice(0, 10))

  const firePulse = (dir, edges, labels, ms = 1500) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPulse({ id: Date.now(), dir, edges, labels })
    later(() => setPulse(null), ms)
  }

  const onFilterChange = (value) => {
    setFilter(value)
    firePulse('down', ['app-pl'], { 'app-pl': `filter="${value}"` })
    pushLog({
      en: `↓ props: App passes filter="${value}" down to <ProductList>`,
      es: `↓ props: App pasa filter="${value}" hacia <ProductList>`,
    })
  }

  const buy = (product) => {
    // 1. event flows UP
    firePulse('up', ['pl-p', 'app-pl'], { 'pl-p': `onBuy("${product.name[lang]}")`, 'app-pl': `onBuy("${product.name[lang]}")` })
    pushLog({
      en: `↑ event: <Product> calls onBuy("${product.name.en}") — the callback travels up`,
      es: `↑ evento: <Product> llama a onBuy("${product.name.es}"): el callback viaja hacia arriba`,
    })
    // 2. App updates state, re-renders, fresh props flow DOWN
    later(() => {
      setCart((c) => {
        const next = [...c, product.name[lang]]
        pushLog({
          en: `↓ props: App state changed (cart: ${next.length}) → re-render → fresh props flow down`,
          es: `↓ props: el estado de App cambió (carrito: ${next.length}) → re-render → bajan props nuevas`,
        })
        return next
      })
      firePulse('down', ['app-pl', 'pl-p'], { 'app-pl': 're-render ↓', 'pl-p': 're-render ↓' }, 1200)
      setFlash('all')
      later(() => setFlash(null), 1200)
    }, 1400)
  }

  const filtered = PRODUCTS.filter((p) => p.name[lang].toLowerCase().includes(filter.toLowerCase()))
  const selected = PRODUCTS.find((p) => p.id === selectedId) ?? PRODUCTS[0]

  const edgeActive = (id) => pulse?.edges.includes(id)
  const edgeDir = () => pulse?.dir ?? 'down'

  const QUIZ = [
    {
      q: { en: 'In React, how does data move between components?', es: 'En React, ¿cómo se mueven los datos entre componentes?' },
      options: [
        { en: 'Both directions freely — any component can change any other', es: 'En ambas direcciones libremente: cualquier componente puede cambiar a otro' },
        { en: 'Down as props; up only through callbacks the parent provided', es: 'Hacia abajo como props; hacia arriba solo mediante callbacks que dio el padre' },
        { en: 'Up as props; down through events', es: 'Hacia arriba como props; hacia abajo mediante eventos' },
      ],
      answer: 1,
      explain: { en: 'One-way data flow: props down, events up. That single rule makes React UIs predictable.', es: 'Flujo unidireccional: props abajo, eventos arriba. Esa única regla hace las UIs de React predecibles.' },
    },
    {
      q: { en: '<Product> wants to add itself to the cart owned by <App>. What must happen?', es: '<Product> quiere añadirse al carrito que pertenece a <App>. ¿Qué debe ocurrir?' },
      options: [
        { en: 'Product mutates App’s state directly', es: 'Product muta directamente el estado de App' },
        { en: 'App passes an onBuy callback down; Product calls it, App updates its own state', es: 'App pasa un callback onBuy hacia abajo; Product lo llama y App actualiza su propio estado' },
        { en: 'Product keeps its own copy of the cart', es: 'Product guarda su propia copia del carrito' },
      ],
      answer: 1,
      explain: { en: 'State lives in one place (App). Children request changes by calling callbacks — they never reach up and mutate.', es: 'El estado vive en un solo lugar (App). Los hijos piden cambios llamando a callbacks: nunca suben a mutar.' },
    },
  ]

  return (
    <SimulationShell
      labId="data-flow"
      title={t({ en: 'Data Flow Visualizer', es: 'Visualizador de flujo de datos' })}
      intro={t({ en: 'One rule runs every React app: props flow down, events flow up. Move data through the tree and watch it happen.', es: 'Una regla gobierna cada app React: las props fluyen hacia abajo, los eventos hacia arriba. Mueve datos por el árbol y míralo ocurrir.' })}
      difficulty="beginner"
    >
      <style>{`
        .df-dot-down, .df-dot-up {
          position: absolute; left: 50%; width: 10px; height: 10px;
          margin-left: -5px; border-radius: 9999px;
          animation-duration: 1.05s; animation-timing-function: ease-in-out;
          animation-iteration-count: 1; animation-fill-mode: both;
        }
        .df-dot-down { background: var(--accent); box-shadow: 0 0 8px var(--accent); animation-name: df-down; }
        .df-dot-up { background: var(--green); box-shadow: 0 0 8px var(--green); animation-name: df-up; }
        @keyframes df-down { from { top: -5px; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } to { top: calc(100% - 5px); opacity: 0; } }
        @keyframes df-up { from { top: calc(100% - 5px); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } to { top: -5px; opacity: 0; } }
      `}</style>

      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--text)] mb-4 max-w-3xl">{t(STRINGS.conceptBody)}</p>
      <FlowSteps steps={FLOW_BUY} auto={false} />

      <SectionTitle>{t(STRINGS.experiment)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-6">{t(STRINGS.experimentHint)}</p>

      <div className="max-w-xl mx-auto">
        <NodeBox name="App" color="var(--accent)" flash={flash === 'all'}>
          <p className="mono text-xs text-[var(--muted)] mb-2">
            {t(STRINGS.stateLabel)}: {'{'} filter: "{filter}", cart: [{cart.join(', ')}] {'}'}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="df-filter" className="sr-only">{t(STRINGS.filterLabel)}</label>
            <div className="relative flex-1">
              <Search size={14} aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--faint)]" />
              <input
                id="df-filter"
                type="text"
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder={t(STRINGS.filterPlaceholder)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)]"
              />
            </div>
            <span className="inline-flex items-center gap-1 text-sm text-[var(--text)]" aria-live="polite">
              <ShoppingCart size={16} aria-hidden="true" />
              <span className="mono font-bold">{cart.length}</span>
            </span>
          </div>
        </NodeBox>

        <FlowEdge
          active={edgeActive('app-pl')}
          dir={edgeDir()}
          label={pulse?.labels['app-pl'] ?? t(STRINGS.downLabel)}
        />

        <NodeBox name="ProductList" color="var(--amber)" flash={flash === 'all'}>
          <p className="mono text-xs text-[var(--muted)] mb-2">
            {t(STRINGS.propsLabel)}: {'{'} filter: "{filter}", products: [{filtered.map((p) => `"${p.name[lang]}"`).join(', ')}] {'}'}
          </p>
          <ul className="space-y-1.5">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  aria-pressed={selectedId === p.id}
                  className="w-full text-left text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]"
                  style={selectedId === p.id ? { borderColor: 'var(--green)' } : undefined}
                >
                  {p.name[lang]} <span className="mono text-[var(--faint)]">${p.price}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-sm text-[var(--faint)]">—</li>
            )}
          </ul>
          <p className="text-xs text-[var(--faint)] mt-2">{t(STRINGS.selectProduct)}</p>
        </NodeBox>

        <FlowEdge
          active={edgeActive('pl-p')}
          dir={edgeDir()}
          label={pulse?.labels['pl-p'] ?? `${t(STRINGS.downLabel)} product`}
        />

        <NodeBox name="Product" color="var(--green)" flash={flash === 'all'}>
          <p className="mono text-xs text-[var(--muted)] mb-2">
            {t(STRINGS.propsLabel)}: {'{'} name: "{selected.name[lang]}", price: {selected.price}, onBuy: fn {'}'}
          </p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-[var(--text-strong)]">{selected.name[lang]}</p>
              <p className="mono text-sm text-[var(--muted)]">${selected.price}</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => buy(selected)}>
              <ArrowUp size={14} aria-hidden="true" /> {t(STRINGS.buy)}
            </button>
          </div>
          <p className="mono text-xs mt-2" style={{ color: 'var(--green)' }}>
            {t(STRINGS.upLabel)}: onBuy(product)
          </p>
        </NodeBox>
      </div>

      <div
        className="my-8 rounded-2xl border-2 p-6 text-center"
        style={{ borderColor: 'var(--accent)', background: 'var(--accent-dim)' }}
        role="note"
        aria-label={t(STRINGS.takeaway)}
      >
        <p className="flex items-center justify-center gap-3 text-lg md:text-2xl font-bold text-[var(--text-strong)]">
          <ArrowDown size={22} aria-hidden="true" className="text-[var(--accent)]" />
          {t(STRINGS.takeaway)}
          <ArrowUp size={22} aria-hidden="true" className="text-[var(--green)]" />
        </p>
      </div>

      <SectionTitle>{t(STRINGS.logTitle)}</SectionTitle>
      {log.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">—</p>
      ) : (
        <ol className="space-y-2" aria-live="polite">
          {log.map((entry, i) => (
            <li key={`${entry.at}-${i}`} className="mono text-xs rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-[var(--text)]">
              <span className="text-[var(--faint)] mr-2">#{entry.at}</span>{t(entry)}
            </li>
          ))}
        </ol>
      )}

      <Callout type="tip">
        {t({
          en: 'Notice the asymmetry: props flow down automatically on every render, but nothing flows up by itself. A child that wants to change the world must call a function its parent trusted it with.',
          es: 'Fíjate en la asimetría: las props bajan automáticamente en cada render, pero nada sube por sí solo. Un hijo que quiera cambiar el mundo debe llamar a una función que su padre le confió.',
        })}
      </Callout>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="data-flow" />
    </SimulationShell>
  )
}
