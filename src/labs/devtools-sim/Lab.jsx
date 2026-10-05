import { useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  Callout,
  CodeBlock,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'
import { ShoppingCart, Plus, Trash2, ChevronDown, Package, MousePointerClick } from 'lucide-react'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'React DevTools lets you **see inside a running app**: its component tree, the props each component received, the state it holds, and how often it rendered. This lab is our own educational replica — the left side is a real (tiny) app, the right side is the inspector.',
    es: 'React DevTools te permite **ver dentro de una app en ejecución**: su árbol de componentes, las props que recibe cada uno, el estado que guarda y cuántas veces se renderizó. Este laboratorio es nuestra réplica educativa: a la izquierda hay una app real (pequeña); a la derecha, el inspector.',
  },
  demoTitle: { en: 'Demo app: Acme Store', es: 'App de demo: Acme Store' },
  demoHint: {
    en: 'Use the store: add products, clear the cart, expand it. Then watch the inspector update.',
    es: 'Usa la tienda: añade productos, vacía el carrito, expándelo. Y observa cómo se actualiza el inspector.',
  },
  panelTitle: { en: 'Components', es: 'Componentes' },
  treeTitle: { en: 'Component tree', es: 'Árbol de componentes' },
  treeHint: {
    en: 'Click any node to inspect it.',
    es: 'Pulsa cualquier nodo para inspeccionarlo.',
  },
  inspector: { en: 'Inspector', es: 'Inspector' },
  propsLabel: { en: 'props', es: 'props' },
  stateLabel: { en: 'state', es: 'estado' },
  rendersLabel: { en: 'renders', es: 'renders' },
  childrenLabel: { en: 'children', es: 'hijos' },
  typeLabel: { en: 'type', es: 'tipo' },
  fnComponent: { en: 'function component', es: 'componente función' },
  logTitle: { en: 'Render log', es: 'Registro de renders' },
  logEmpty: {
    en: 'Nothing yet — interact with the store above.',
    es: 'Nada todavía: interactúa con la tienda de arriba.',
  },
  addToCart: { en: 'Add', es: 'Añadir' },
  clear: { en: 'Clear', es: 'Vaciar' },
  cartEmpty: { en: 'Cart is empty', es: 'El carrito está vacío' },
  items: { en: 'items', es: 'artículos' },
  total: { en: 'Total', es: 'Total' },
  realNote: {
    en: 'This is a simplified teaching model with simulated render counts. The real React DevTools browser extension shows this same panel — with true props, state and render timings — for any React app you open. Look for the Components tab.',
    es: 'Esto es un modelo didáctico simplificado con contadores de render simulados. La extensión real de React DevTools para el navegador muestra este mismo panel —con props, estado y tiempos de render reales— para cualquier app React que abras. Busca la pestaña Components.',
  },
  challenge: { en: 'Try to answer', es: 'Intenta responder' },
  challengeQ: {
    en: 'Add the same product twice, then select ProductCard in the tree. Why did its render count not change, while Cart re-rendered?',
    es: 'Añade el mismo producto dos veces y selecciona ProductCard en el árbol. ¿Por qué su contador de renders no cambió mientras Cart sí se re-renderizó?',
  },
  challengeA: {
    en: 'ProductCard’s props never changed, so in our model it skips re-rendering. Cart re-rendered because its items prop is a new array reference — new badge, new render. References decide, again.',
    es: 'Las props de ProductCard nunca cambiaron, así que en nuestro modelo omite el re-render. Cart sí se re-renderizó porque su prop items es un array con referencia nueva: insignia nueva, render nuevo. Las referencias deciden, una vez más.',
  },
  showAnswer: { en: 'Show explanation', es: 'Mostrar explicación' },
  storeName: { en: 'Acme Store', es: 'Tienda Acme' },
}

const PRODUCTS = [
  { id: 'p1', name: { en: 'Keyboard', es: 'Teclado' }, price: 49 },
  { id: 'p2', name: { en: 'Mouse', es: 'Ratón' }, price: 29 },
  { id: 'p3', name: { en: 'Monitor', es: 'Monitor' }, price: 199 },
]

// Static tree shape; dynamic data (props/state/renders) is computed per node.
const TREE = {
  App: { children: ['Header', 'ProductList', 'Cart', 'Footer'] },
  Header: { children: [] },
  ProductList: { children: ['card-0', 'card-1', 'card-2'] },
  'card-0': { label: 'ProductCard', children: [] },
  'card-1': { label: 'ProductCard', children: [] },
  'card-2': { label: 'ProductCard', children: [] },
  Cart: { children: [] },
  Footer: { children: [] },
}

const DISPLAY = {
  App: 'App',
  Header: 'Header',
  ProductList: 'ProductList',
  'card-0': 'ProductCard',
  'card-1': 'ProductCard',
  'card-2': 'ProductCard',
  Cart: 'Cart',
  Footer: 'Footer',
}

function fmt(obj) {
  return JSON.stringify(obj, null, 1)
}

/* ---------- Demo app (the thing being inspected) ---------- */

function DemoHeader({ title, cartCount }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-t-xl bg-[var(--accent-dim)] border-b border-[var(--border)]">
      <strong className="text-[var(--text-strong)]">{title}</strong>
      <span className="inline-flex items-center gap-1.5 text-sm text-[var(--text)]" aria-live="polite">
        <ShoppingCart size={16} aria-hidden="true" />
        <span className="mono font-bold">{cartCount}</span>
      </span>
    </div>
  )
}

function DemoProductCard({ name, price, onAdd, addLabel }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 flex flex-col gap-2">
      <span className="inline-flex items-center gap-2 text-[var(--text-strong)] font-medium">
        <Package size={16} className="text-[var(--faint)]" aria-hidden="true" /> {name}
      </span>
      <span className="mono text-sm text-[var(--muted)]">${price}</span>
      <button type="button" className="btn btn-primary self-start" onClick={onAdd}>
        <Plus size={14} aria-hidden="true" /> {addLabel}
      </button>
    </div>
  )
}

function DemoCart({ items, onClear, onToggleLocal, clearLabel, emptyLabel, itemsLabel, totalLabel }) {
  const [expanded, setExpanded] = useState(false)
  const total = items.reduce((s, it) => s + it.price, 0)
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 font-medium text-[var(--text-strong)]"
          onClick={() => { setExpanded((e) => !e); onToggleLocal() }}
          aria-expanded={expanded}
        >
          <ChevronDown size={16} aria-hidden="true" className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'} />
          <ShoppingCart size={16} aria-hidden="true" />
          Cart · {items.length} {itemsLabel}
        </button>
        {items.length > 0 && (
          <button type="button" className="btn" onClick={onClear}>
            <Trash2 size={14} aria-hidden="true" /> {clearLabel}
          </button>
        )}
      </div>
      {expanded && (
        <div className="mt-2 text-sm">
          {items.length === 0 ? (
            <p className="text-[var(--muted)]">{emptyLabel}</p>
          ) : (
            <ul className="space-y-1">
              {items.map((it, i) => (
                <li key={i} className="flex justify-between text-[var(--text)]">
                  <span>{it.name}</span>
                  <span className="mono">${it.price}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-semibold text-[var(--text-strong)]">
            {totalLabel}: <span className="mono">${total}</span>
          </p>
        </div>
      )}
    </div>
  )
}

function DemoFooter({ year }) {
  return (
    <p className="text-center text-xs text-[var(--faint)] py-2 border-t border-[var(--border)]">
      © {year}
    </p>
  )
}

/* ---------- Tree + inspector ---------- */

function TreeNode({ id, depth, selected, onSelect, prefix }) {
  const kids = TREE[id].children
  const label = DISPLAY[id]
  const isSel = selected === id
  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(id)}
        aria-current={isSel}
        className="mono flex items-center gap-1 text-sm px-2 py-1 rounded-md w-full text-left hover:bg-[var(--surface-2)] focus-visible:outline-2"
        style={isSel ? { background: 'var(--accent-dim)', color: 'var(--accent)' } : { color: 'var(--text)' }}
      >
        <span aria-hidden="true" className="text-[var(--faint)] whitespace-pre">{prefix}</span>
        <span className="text-[var(--accent)]" aria-hidden="true">{'<'}</span>
        <span className="font-semibold">{label}</span>
        <span className="text-[var(--accent)]" aria-hidden="true">{' />'}</span>
      </button>
      <div role="group" aria-label={label}>
        {kids.map((kid, i) => {
          const last = i === kids.length - 1
          const childPrefix = prefix.replace(/─/g, ' ').replace(/├/g, '│').replace(/└/g, ' ')
          return (
            <TreeNode
              key={kid}
              id={kid}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
              prefix={childPrefix + (last ? '└─' : '├─')}
            />
          )
        })}
      </div>
    </div>
  )
}

function InspectorBlock({ label, children }) {
  return (
    <div className="mb-3">
      <p className="text-xs uppercase tracking-wider text-[var(--faint)] font-semibold mb-1">{label}</p>
      <div className="rounded-lg bg-[var(--code-bg)] border border-[var(--code-border)] p-3 mono text-xs text-[var(--text)] overflow-x-auto whitespace-pre">
        {children}
      </div>
    </div>
  )
}

export default function DevtoolsSimLab() {
  const { t, lang } = useLang()
  const [cart, setCart] = useState([])
  const [selected, setSelected] = useState('App')
  const [renders, setRenders] = useState({ App: 1, Header: 1, ProductList: 1, 'card-0': 1, 'card-1': 1, 'card-2': 1, Cart: 1, Footer: 1 })
  const [log, setLog] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)

  const bump = (ids, message) => {
    setRenders((r) => {
      const next = { ...r }
      ids.forEach((id) => { next[id] = (next[id] ?? 0) + 1 })
      return next
    })
    setLog((l) => [{ ...message, at: l.length + 1 }, ...l].slice(0, 8))
  }

  const addToCart = (product) => {
    setCart((c) => [...c, { name: product.name[lang], price: product.price }])
    bump(['App', 'Header', 'Cart'], {
      en: `added "${product.name.en}" → App, Header, Cart re-rendered (ProductCard props unchanged → skipped)`,
      es: `añadido "${product.name.es}" → App, Header y Cart se re-renderizaron (props de ProductCard sin cambios → omitido)`,
    })
  }

  const clearCart = () => {
    setCart([])
    bump(['App', 'Header', 'Cart'], {
      en: 'cart cleared → App, Header, Cart re-rendered',
      es: 'carrito vaciado → App, Header y Cart se re-renderizaron',
    })
  }

  const toggleCartLocal = () => {
    bump(['Cart'], {
      en: 'Cart toggled its own expanded state → only Cart re-rendered',
      es: 'Cart cambió su propio estado expanded → solo Cart se re-renderizó',
    })
  }

  // Inspector data for the selected node (computed from live lab state)
  const nodeInfo = (() => {
    const year = 2026
    switch (selected) {
      case 'App':
        return {
          props: {},
          state: { cart: cart.map((i) => i.name) },
          children: TREE.App.children.map((c) => `<${DISPLAY[c]} />`),
        }
      case 'Header':
        return {
          props: { title: t(STRINGS.storeName), cartCount: cart.length },
          state: {},
          children: [],
        }
      case 'ProductList':
        return {
          props: { products: PRODUCTS.map((p) => p.name[lang]) },
          state: {},
          children: ['<ProductCard />', '<ProductCard />', '<ProductCard />'],
        }
      case 'card-0':
      case 'card-1':
      case 'card-2': {
        const p = PRODUCTS[Number(selected.split('-')[1])]
        return {
          props: { name: p.name[lang], price: p.price },
          state: {},
          children: [],
        }
      }
      case 'Cart':
        return {
          props: { items: `${cart.length} item(s)` },
          state: { expanded: '(local — toggle it in the demo)' },
          children: [],
        }
      case 'Footer':
        return {
          props: { year },
          state: {},
          children: [],
        }
      default:
        return { props: {}, state: {}, children: [] }
    }
  })()

  return (
    <SimulationShell
      labId="devtools-sim"
      title={t({ en: 'React DevTools Concept Simulator', es: 'Simulador conceptual de React DevTools' })}
      intro={t({ en: 'An educational replica of the Components panel. Use the store on the left, then inspect what changed on the right.', es: 'Una réplica educativa del panel Components. Usa la tienda de la izquierda e inspecciona qué cambió a la derecha.' })}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--text)] mb-6 max-w-3xl">{t(STRINGS.conceptBody)}</p>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* ---- Demo app ---- */}
        <section aria-label={t(STRINGS.demoTitle)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <DemoHeader title={t(STRINGS.storeName)} cartCount={cart.length} />
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRODUCTS.map((p) => (
                <DemoProductCard
                  key={p.id}
                  name={p.name[lang]}
                  price={p.price}
                  addLabel={t(STRINGS.addToCart)}
                  onAdd={() => addToCart(p)}
                />
              ))}
            </div>
            <DemoCart
              items={cart}
              onClear={clearCart}
              onToggleLocal={toggleCartLocal}
              clearLabel={t(STRINGS.clear)}
              emptyLabel={t(STRINGS.cartEmpty)}
              itemsLabel={t(STRINGS.items)}
              totalLabel={t(STRINGS.total)}
            />
            <DemoFooter year={2026} />
          </div>
          <p className="px-4 pb-3 text-xs text-[var(--faint)] flex items-center gap-1.5">
            <MousePointerClick size={14} aria-hidden="true" /> {t(STRINGS.demoHint)}
          </p>
        </section>

        {/* ---- DevTools panel ---- */}
        <section aria-label={t(STRINGS.panelTitle)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center gap-2">
            <span className="text-[var(--accent)] font-bold" aria-hidden="true">⚛</span>
            <strong className="text-sm text-[var(--text-strong)]">{t(STRINGS.panelTitle)}</strong>
            <span className="ml-auto text-xs text-[var(--faint)] mono">acme-store.jsx</span>
          </div>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--faint)] font-semibold mb-2">{t(STRINGS.treeTitle)}</p>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2 mb-1">
              <TreeNode id="App" depth={0} selected={selected} onSelect={setSelected} prefix="" />
            </div>
            <p className="text-xs text-[var(--faint)] mb-4">{t(STRINGS.treeHint)}</p>

            <p className="text-xs uppercase tracking-wider text-[var(--faint)] font-semibold mb-2">
              {t(STRINGS.inspector)} — <span className="mono text-[var(--accent)]">&lt;{DISPLAY[selected]} /&gt;</span>
            </p>
            <InspectorBlock label={t(STRINGS.typeLabel)}>{t(STRINGS.fnComponent)}</InspectorBlock>
            <InspectorBlock label={t(STRINGS.propsLabel)}>
              {Object.keys(nodeInfo.props).length ? fmt(nodeInfo.props) : '—'}
            </InspectorBlock>
            <InspectorBlock label={t(STRINGS.stateLabel)}>
              {Object.keys(nodeInfo.state).length ? fmt(nodeInfo.state) : '—'}
            </InspectorBlock>
            <InspectorBlock label={t(STRINGS.rendersLabel)}>
              <span className="text-base font-bold text-[var(--accent)]">{renders[selected] ?? 0}</span>
              {'  '}<span className="text-[var(--faint)]">(simulated)</span>
            </InspectorBlock>
            <InspectorBlock label={t(STRINGS.childrenLabel)}>
              {nodeInfo.children.length ? nodeInfo.children.join('\n') : '—'}
            </InspectorBlock>
          </div>
        </section>
      </div>

      <SectionTitle>{t(STRINGS.logTitle)}</SectionTitle>
      {log.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{t(STRINGS.logEmpty)}</p>
      ) : (
        <ol className="space-y-2" aria-live="polite">
          {log.map((entry, i) => (
            <li key={`${entry.at}-${i}`} className="mono text-xs rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-[var(--text)]">
              <span className="text-[var(--faint)] mr-2">#{entry.at}</span>{t(entry)}
            </li>
          ))}
        </ol>
      )}

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <p className="text-[var(--text)] mb-3 max-w-3xl">{t(STRINGS.challengeQ)}</p>
      <button type="button" className="btn" onClick={() => setShowAnswer((s) => !s)} aria-expanded={showAnswer}>
        {t(STRINGS.showAnswer)}
      </button>
      {showAnswer && <Callout type="tip">{t(STRINGS.challengeA)}</Callout>}

      <Callout type="info" title={t({ en: 'About the real DevTools', es: 'Sobre las DevTools reales' })}>
        {t(STRINGS.realNote)}
      </Callout>

      <SectionTitle>{t({ en: 'Reading a tree', es: 'Leer un árbol' })}</SectionTitle>
      <CodeBlock
        lang="jsx"
        code={`<App>                          ← owns the cart state
 ├─ <Header cartCount={2} />   ← re-renders when the badge changes
 ├─ <ProductList>
 │   ├─ <ProductCard name="Keyboard" />   ← props unchanged → skipped
 │   └─ …
 ├─ <Cart items={[...]} />     ← new array reference → re-renders
 └─ <Footer />`}
      />
    </SimulationShell>
  )
}
