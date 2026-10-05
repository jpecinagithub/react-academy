import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  Callout,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'
import { Circle, Square, ShoppingCart, Plus, Trash2, ChevronDown, Package } from 'lucide-react'

// Heavy chart: lazy so the lab page stays light.
const RenderBars = lazy(() =>
  import('recharts').then((mod) => {
    const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } = mod
    function Bars({ data, label }) {
      return (
        <div role="img" aria-label={label}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="renders" radius={[0, 6, 6, 0]}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
    return { default: Bars }
  }),
)

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'A profiler answers one question: **which components render, and how often?** Rendering is not evil — but a component that renders 40 times while its siblings render twice is a smell worth investigating.',
    es: 'Un profiler responde una pregunta: **¿qué componentes se renderizan y con qué frecuencia?** Renderizar no es malo, pero un componente que se renderiza 40 veces mientras sus hermanos lo hacen dos veces es una señal que conviene investigar.',
  },
  recordTitle: { en: 'Record a profiling session', es: 'Graba una sesión de profiling' },
  recordHint: {
    en: 'Press record, interact with the store (add items, toggle the cart), then stop. Every interaction is one "commit".',
    es: 'Pulsa grabar, interactúa con la tienda (añade artículos, expande el carrito) y detén la grabación. Cada interacción es un "commit".',
  },
  record: { en: 'Record', es: 'Grabar' },
  stop: { en: 'Stop', es: 'Detener' },
  reset: { en: 'Reset session', es: 'Reiniciar sesión' },
  recording: { en: 'Recording…', es: 'Grabando…' },
  commits: { en: 'commits', es: 'commits' },
  tableTitle: { en: 'Render totals', es: 'Totales de render' },
  componentCol: { en: 'Component', es: 'Componente' },
  rendersCol: { en: 'Renders', es: 'Renders' },
  chartTitle: { en: 'Render counts per component', es: 'Renders por componente' },
  flameTitle: { en: 'Hottest components', es: 'Componentes más calientes' },
  logTitle: { en: 'Commit log', es: 'Registro de commits' },
  empty: {
    en: 'Press Record and interact with the store to collect data.',
    es: 'Pulsa Grabar e interactúa con la tienda para recoger datos.',
  },
  tipsTitle: { en: 'How to cool down the hot ones', es: 'Cómo enfriar los más calientes' },
  honest: {
    en: 'Honest note: this is a simplified teaching model — the counts follow a plausible simulation, not real instrumentation. The real React Profiler (in React DevTools) records actual commit timings and flamegraphs, and tells you why each component rendered.',
    es: 'Nota honesta: esto es un modelo didáctico simplificado; los contadores siguen una simulación plausible, no instrumentación real. El Profiler real (en React DevTools) registra tiempos de commit reales y flamegraphs, y te dice por qué se renderizó cada componente.',
  },
  addToCart: { en: 'Add', es: 'Añadir' },
  clear: { en: 'Clear', es: 'Vaciar' },
  cartEmpty: { en: 'Cart is empty', es: 'El carrito está vacío' },
  items: { en: 'items', es: 'artículos' },
  total: { en: 'Total', es: 'Total' },
  storeName: { en: 'Acme Store', es: 'Tienda Acme' },
  chartAria: { en: 'Bar chart of render counts per component', es: 'Gráfico de barras de renders por componente' },
}

const PRODUCTS = [
  { id: 'p1', name: { en: 'Keyboard', es: 'Teclado' }, price: 49 },
  { id: 'p2', name: { en: 'Mouse', es: 'Ratón' }, price: 29 },
]

const COMPONENTS = ['App', 'Header', 'ProductList', 'ProductCard', 'Cart', 'Footer']

const ZERO = () => ({ App: 0, Header: 0, ProductList: 0, ProductCard: 0, Cart: 0, Footer: 0 })

/* ---------- tiny demo store ---------- */

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

function DemoCart({ items, onClear, onToggle, clearLabel, emptyLabel, itemsLabel, totalLabel }) {
  const [expanded, setExpanded] = useState(false)
  const total = items.reduce((s, it) => s + it.price, 0)
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 font-medium text-[var(--text-strong)]"
          onClick={() => { setExpanded((e) => !e); onToggle?.() }}
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

function heatFill(renders, max) {
  if (max === 0) return '#3ddc97'
  const ratio = renders / max
  if (ratio >= 0.66) return '#ff6b6b'
  if (ratio >= 0.33) return '#ffb454'
  return '#3ddc97'
}

export default function RenderProfilerLab() {
  const { t, lang } = useLang()
  const [cart, setCart] = useState([])
  const [recording, setRecording] = useState(false)
  const [commits, setCommits] = useState([])
  const commitId = useRef(0)
  const recordingRef = useRef(false)
  recordingRef.current = recording

  const record = (label, counts) => {
    if (!recordingRef.current) return
    commitId.current += 1
    setCommits((cs) => [...cs, { id: commitId.current, label, counts }])
  }

  // Mount commit, recorded once if the user starts recording afterwards? No:
  // record the mount only while recording. Start recording automatically on mount.
  useEffect(() => {
    setRecording(true)
    recordingRef.current = true
    commitId.current += 1
    setCommits([{ id: commitId.current, label: { en: 'initial mount', es: 'montaje inicial' }, counts: { App: 1, Header: 1, ProductList: 1, ProductCard: 2, Cart: 1, Footer: 1 } }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startRecording = () => {
    commitId.current = 0
    setCommits([])
    setRecording(true)
    commitId.current += 1
    setCommits([{ id: 1, label: { en: 'initial mount', es: 'montaje inicial' }, counts: { App: 1, Header: 1, ProductList: 1, ProductCard: 2, Cart: 1, Footer: 1 } }])
  }

  const addToCart = (product) => {
    setCart((c) => [...c, { name: product.name[lang], price: product.price }])
    record(
      { en: `added "${product.name.en}"`, es: `añadido "${product.name.es}"` },
      { App: 1, Header: 1, ProductList: 0, ProductCard: 0, Cart: 1, Footer: 0 },
    )
  }

  const clearCart = () => {
    setCart([])
    record(
      { en: 'cart cleared', es: 'carrito vaciado' },
      { App: 1, Header: 1, ProductList: 0, ProductCard: 0, Cart: 1, Footer: 0 },
    )
  }

  const toggleCart = () => {
    record(
      { en: 'cart toggled expanded (local state)', es: 'carrito expandido/contraído (estado local)' },
      { App: 0, Header: 0, ProductList: 0, ProductCard: 0, Cart: 1, Footer: 0 },
    )
  }
  const totals = useMemo(() => {
    const acc = ZERO()
    commits.forEach((c) => {
      COMPONENTS.forEach((k) => { acc[k] += c.counts[k] ?? 0 })
    })
    return acc
  }, [commits])

  const ranked = useMemo(
    () => COMPONENTS.map((name) => ({ name, renders: totals[name] })).sort((a, b) => b.renders - a.renders),
    [totals],
  )
  const maxRenders = ranked[0]?.renders ?? 0
  const chartData = useMemo(
    () => ranked.map((r) => ({ ...r, fill: heatFill(r.renders, maxRenders) })),
    [ranked, maxRenders],
  )

  const TIPS = [
    {
      title: { en: 'memo: skip what did not change', es: 'memo: omite lo que no cambió' },
      body: {
        en: 'ProductCard rendered 0 times after mount here because its props never changed — that is what React.memo does for you in real apps. Wrap components whose props rarely change.',
        es: 'ProductCard se renderizó 0 veces tras el montaje porque sus props nunca cambiaron: eso es lo que hace React.memo por ti en apps reales. Memoriza componentes cuyas props cambian poco.',
      },
    },
    {
      title: { en: 'Split components: isolate the hot spot', es: 'Divide componentes: aísla el punto caliente' },
      body: {
        en: 'Header re-renders on every cart change only because the badge lives inside it. Extract a tiny <CartBadge /> so the rest of the header stays cool.',
        es: 'Header se re-renderiza con cada cambio del carrito solo porque la insignia vive dentro de él. Extrae un <CartBadge /> diminuto para que el resto del header no se entere.',
      },
    },
    {
      title: { en: 'Move state down', es: 'Baja el estado' },
      body: {
        en: 'Cart’s expanded toggle only re-rendered Cart — its state lives where it is used. If it lived in App, every component would render on each toggle.',
        es: 'El desplegable de Cart solo re-renderizó Cart: su estado vive donde se usa. Si viviera en App, cada componente se renderizaría con cada clic.',
      },
    },
  ]

  return (
    <SimulationShell
      labId="render-profiler"
      title={t({ en: 'React Render Profiler', es: 'Profiler de renders de React' })}
      intro={t({ en: 'A simplified, educational profiler. Record a session, click around the store, then study which components run hottest.', es: 'Un profiler educativo y simplificado. Graba una sesión, interactúa con la tienda y estudia qué componentes se calientan más.' })}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--text)] mb-6 max-w-3xl">{t(STRINGS.conceptBody)}</p>

      <SectionTitle>{t(STRINGS.recordTitle)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.recordHint)}</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {!recording ? (
          <button type="button" className="btn btn-primary" onClick={startRecording}>
            <Circle size={14} aria-hidden="true" className="text-[var(--red)]" fill="currentColor" /> {t(STRINGS.record)}
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setRecording(false)}>
            <Square size={14} aria-hidden="true" /> {t(STRINGS.stop)}
          </button>
        )}
        <button type="button" className="btn" onClick={startRecording}>{t(STRINGS.reset)}</button>
        <span className="mono text-sm text-[var(--muted)]" aria-live="polite">
          {recording && <span className="text-[var(--red)] font-bold">● {t(STRINGS.recording)} </span>}
          {commits.length} {t(STRINGS.commits)}
        </span>
      </div>

      {/* demo store */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden mb-8">
        <DemoHeader title={t(STRINGS.storeName)} cartCount={cart.length} />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[var(--text-strong)] font-medium">
                  <Package size={16} className="text-[var(--faint)]" aria-hidden="true" /> {p.name[lang]}
                  <span className="mono text-sm text-[var(--muted)]">${p.price}</span>
                </span>
                <button type="button" className="btn btn-primary" onClick={() => addToCart(p)}>
                  <Plus size={14} aria-hidden="true" /> {t(STRINGS.addToCart)}
                </button>
              </div>
            ))}
          </div>
          <DemoCart
            items={cart}
            onClear={clearCart}
            onToggle={toggleCart}
            clearLabel={t(STRINGS.clear)}
            emptyLabel={t(STRINGS.cartEmpty)}
            itemsLabel={t(STRINGS.items)}
            totalLabel={t(STRINGS.total)}
          />
        </div>
      </div>

      {commits.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{t(STRINGS.empty)}</p>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.tableTitle)}</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--faint)]">
                    <th scope="col" className="py-2 pr-4 font-semibold">{t(STRINGS.componentCol)}</th>
                    <th scope="col" className="py-2 font-semibold text-right">{t(STRINGS.rendersCol)}</th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((r) => (
                    <tr key={r.name} className="border-t border-[var(--border)]">
                      <td className="py-2 pr-4 mono text-[var(--text)]">&lt;{r.name} /&gt;</td>
                      <td className="py-2 text-right mono font-bold text-[var(--text-strong)]">{r.renders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="font-bold text-[var(--text-strong)] mt-8 mb-3">{t(STRINGS.flameTitle)}</h3>
              <ol className="space-y-2" aria-label={t(STRINGS.flameTitle)}>
                {ranked.map((r) => (
                  <li key={r.name}>
                    <div className="flex items-center gap-2 text-xs mono mb-1">
                      <span className="w-28 truncate text-[var(--text)]">&lt;{r.name} /&gt;</span>
                      <span className="text-[var(--faint)]">{r.renders}</span>
                    </div>
                    <div className="h-3 rounded-full bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${maxRenders ? (r.renders / maxRenders) * 100 : 0}%`,
                          background: heatFill(r.renders, maxRenders),
                          transition: 'width 400ms ease',
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.chartTitle)}</h3>
              <Suspense fallback={<p className="text-sm text-[var(--muted)]">…</p>}>
                <RenderBars data={chartData} label={t(STRINGS.chartAria)} />
              </Suspense>

              <h3 className="font-bold text-[var(--text-strong)] mt-8 mb-3">{t(STRINGS.logTitle)}</h3>
              <ol className="space-y-2 max-h-64 overflow-y-auto pr-1" aria-live="polite">
                {commits.map((c) => (
                  <li key={c.id} className="mono text-xs rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-[var(--text)]">
                    <span className="text-[var(--faint)] mr-2">#{c.id}</span>
                    {t(c.label)}
                    <span className="block mt-1 text-[var(--faint)]">
                      {COMPONENTS.filter((k) => c.counts[k] > 0).map((k) => `${k}×${c.counts[k]}`).join(' · ')}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <SectionTitle>{t(STRINGS.tipsTitle)}</SectionTitle>
          {TIPS.map((tip, i) => (
            <Callout key={i} type={i === 0 ? 'tip' : 'info'} title={t(tip.title)}>
              {t(tip.body)}
            </Callout>
          ))}
        </>
      )}

      <Callout type="info" title={t({ en: 'About the real Profiler', es: 'Sobre el Profiler real' })}>
        {t(STRINGS.honest)}
      </Callout>
    </SimulationShell>
  )
}
