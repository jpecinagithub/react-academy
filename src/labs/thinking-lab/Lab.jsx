import { useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  Callout,
  FlowSteps,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'
import { Check, X, RotateCcw, Eye, LayoutDashboard, MousePointerClick } from 'lucide-react'

const STRINGS = {
  tab1: { en: 'The 5-step flow', es: 'El flujo en 5 pasos' },
  tab2: { en: 'Where should state live?', es: '¿Dónde debe vivir el estado?' },
  tab3: { en: 'Component design game', es: 'Juego de diseño' },
  flowTitle: { en: 'Design any UI in five steps', es: 'Diseña cualquier UI en cinco pasos' },
  shopTitle: { en: 'Sample: a tiny shop', es: 'Ejemplo: una tiendita' },
  gameIntro: {
    en: 'For each scenario, click the component that should own the highlighted state. Rule of thumb: lift state to the closest common ancestor of every component that needs it — but no higher.',
    es: 'En cada escenario, pulsa el componente que debería poseer el estado resaltado. Regla de oro: eleva el estado al ancestro común más cercano de todos los que lo necesiten, pero ni un nivel más.',
  },
  score: { en: 'Score', es: 'Puntuación' },
  correct: { en: 'Correct!', es: '¡Correcto!' },
  wrong: { en: 'Not quite.', es: 'Casi.' },
  next: { en: 'Next scenario', es: 'Siguiente escenario' },
  restart: { en: 'Play again', es: 'Jugar de nuevo' },
  finished: { en: 'You finished all scenarios!', es: '¡Completaste todos los escenarios!' },
  designIntro: {
    en: 'This dashboard is one big blob. Click regions to mark where you would draw component boundaries, then reveal a suggested architecture and compare.',
    es: 'Este dashboard es una masa informe. Pulsa regiones para marcar dónde dibujarías los límites de los componentes y luego revela una arquitectura sugerida para comparar.',
  },
  reveal: { en: 'Reveal suggested architecture', es: 'Revelar arquitectura sugerida' },
  hide: { en: 'Hide', es: 'Ocultar' },
  clearSel: { en: 'Clear selection', es: 'Limpiar selección' },
  yourPick: { en: 'Your boundaries', es: 'Tus límites' },
  suggested: { en: 'One valid decomposition', es: 'Una descomposición válida' },
  rationaleTitle: { en: 'Why this decomposition?', es: '¿Por qué esta descomposición?' },
  howDidYouDo: { en: 'How did you do?', es: '¿Cómo te fue?' },
  selectedCount: { en: 'regions selected', es: 'regiones seleccionadas' },
}

const FLOW_5 = [
  { label: { en: '1. Look at the UI', es: '1. Mira la UI' }, desc: { en: 'start from a mock, a screenshot, or a sketch', es: 'parte de un mock, una captura o un boceto' } },
  { label: { en: '2. Break it into components', es: '2. Divídela en componentes' }, desc: { en: 'draw boxes around pieces: navbar, card, button…', es: 'dibuja cajas: navbar, tarjeta, botón…' } },
  { label: { en: '3. Define the state', es: '3. Define el estado' }, desc: { en: 'list the minimal data that changes: query, cart, filter', es: 'lista los datos mínimos que cambian: búsqueda, carrito, filtro' } },
  { label: { en: '4. Decide where state lives', es: '4. Decide dónde vive el estado' }, desc: { en: 'closest common ancestor — play the game below', es: 'el ancestro común más cercano: juega al juego de abajo' } },
  { label: { en: '5. Wire props down, events up', es: '5. Conecta props abajo, eventos arriba' }, desc: { en: 'data flows down, callbacks communicate upward', es: 'los datos bajan, los callbacks se comunican hacia arriba' } },
]

/* ---------------- Game 2: where should state live ---------------- */

const SCENARIOS = [
  {
    id: 'search',
    stateName: { en: 'search query', es: 'texto de búsqueda' },
    tree: { App: ['SearchBox', 'ResultsList'] },
    correct: 'App',
    why: {
      en: 'Both SearchBox (writes it) and ResultsList (reads it) need the query. Their closest common ancestor is App — state lives there and flows down as props.',
      es: 'Tanto SearchBox (lo escribe) como ResultsList (lo lee) necesitan la búsqueda. Su ancestro común más cercano es App: el estado vive ahí y baja como props.',
    },
    whyWrong: {
      SearchBox: {
        en: 'If the query lived in SearchBox, ResultsList — its sibling — could never read it. Siblings cannot see each other’s state.',
        es: 'Si la búsqueda viviera en SearchBox, ResultsList (su hermano) nunca podría leerla. Los hermanos no ven el estado del otro.',
      },
      ResultsList: {
        en: 'ResultsList only displays matches; the input lives in SearchBox. State must sit above both, not inside one of them.',
        es: 'ResultsList solo muestra resultados; el input vive en SearchBox. El estado debe estar por encima de ambos, no dentro de uno.',
      },
    },
  },
  {
    id: 'theme',
    stateName: { en: 'dark / light theme', es: 'tema oscuro / claro' },
    tree: { App: ['SiteHeader', 'MainContent'], SiteHeader: ['ThemeToggle'] },
    correct: 'App',
    why: {
      en: 'The theme affects the whole page — header and content. The closest ancestor shared by everyone is App. Lifting it only to SiteHeader would leave MainContent in the dark (literally).',
      es: 'El tema afecta a toda la página: cabecera y contenido. El ancestro común a todos es App. Elevarlo solo a SiteHeader dejaría a MainContent a oscuras (literalmente).',
    },
    whyWrong: {
      ThemeToggle: {
        en: 'ThemeToggle is just the switch. If theme lived there, no other component could read it — the switch would toggle nothing but itself.',
        es: 'ThemeToggle es solo el interruptor. Si el tema viviera ahí, ningún otro componente podría leerlo: el interruptor no cambiaría nada más que a sí mismo.',
      },
      SiteHeader: {
        en: 'Close, but MainContent is not inside SiteHeader — it could never receive the theme. Go one level higher.',
        es: 'Casi, pero MainContent no está dentro de SiteHeader: nunca recibiría el tema. Sube un nivel más.',
      },
      MainContent: {
        en: 'MainContent consumes the theme but the toggle lives in the header. The owner must be above both.',
        es: 'MainContent consume el tema, pero el interruptor vive en la cabecera. El dueño debe estar por encima de ambos.',
      },
    },
  },
  {
    id: 'form',
    stateName: { en: 'form draft', es: 'borrador del formulario' },
    tree: { App: ['SignupForm'], SignupForm: ['NameInput', 'LivePreview'] },
    correct: 'SignupForm',
    why: {
      en: 'NameInput writes the draft and LivePreview reads it — their closest common ancestor is SignupForm. Lifting it to App would work, but it would re-render the whole app on every keystroke. Keep state as low as possible.',
      es: 'NameInput escribe el borrador y LivePreview lo lee: su ancestro común más cercano es SignupForm. Elevarlo a App funcionaría, pero re-renderizaría toda la app con cada tecla. Mantén el estado lo más bajo posible.',
    },
    whyWrong: {
      App: {
        en: 'It would work — but it is too high. Every keystroke would re-render the entire app. State should live as low as it possibly can.',
        es: 'Funcionaría, pero está demasiado alto. Cada tecla re-renderizaría toda la app. El estado debe vivir lo más bajo posible.',
      },
      NameInput: {
        en: 'Then LivePreview, its sibling, could not read the draft. Siblings cannot share state directly.',
        es: 'Entonces LivePreview, su hermano, no podría leer el borrador. Los hermanos no comparten estado directamente.',
      },
      LivePreview: {
        en: 'LivePreview only displays — the input lives elsewhere. The owner must be their common parent.',
        es: 'LivePreview solo muestra: el input vive en otro lado. El dueño debe ser su padre común.',
      },
    },
  },
]

function TreeButtons({ tree, root, onPick, picked, disabled }) {
  const renderNode = (id, depth) => {
    const kids = tree[id] ?? []
    const isPicked = picked === id
    return (
      <div key={id}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onPick(id)}
          aria-pressed={isPicked}
          className="mono text-sm px-3 py-1.5 rounded-lg border text-left my-0.5 transition-colors disabled:cursor-default"
          style={{
            marginLeft: depth * 28,
            borderColor: isPicked ? 'var(--accent)' : 'var(--border)',
            background: isPicked ? 'var(--accent-dim)' : 'var(--surface)',
            color: 'var(--text-strong)',
            display: 'block',
          }}
        >
          &lt;{id} /&gt;
        </button>
        {kids.map((k) => renderNode(k, depth + 1))}
      </div>
    )
  }
  return <div role="group" aria-label="component tree">{renderNode(root, 0)}</div>
}

function StateGame() {
  const { t } = useLang()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(0)
  const scenario = SCENARIOS[index]
  const finished = done >= SCENARIOS.length

  const pick = (id) => {
    if (picked) return
    setPicked(id)
    setDone((d) => d + 1)
    if (id === scenario.correct) setScore((s) => s + 1)
  }

  const next = () => {
    setPicked(null)
    setIndex((i) => (i + 1) % SCENARIOS.length)
  }

  const restart = () => {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setDone(0)
  }

  if (finished) {
    return (
      <div className="text-center py-6">
        <p className="text-xl font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.finished)}</p>
        <p className="mono text-3xl font-bold text-[var(--accent)] mb-4" aria-live="polite">
          {t(STRINGS.score)}: {score}/{SCENARIOS.length}
        </p>
        <button type="button" className="btn btn-primary" onClick={restart}>
          <RotateCcw size={14} aria-hidden="true" /> {t(STRINGS.restart)}
        </button>
      </div>
    )
  }

  const isCorrect = picked === scenario.correct
  const roots = Object.keys(scenario.tree)
  const root = roots.find((r) => !Object.values(scenario.tree).flat().includes(r))

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-[var(--text)] mb-3">
          {t({ en: 'Scenario', es: 'Escenario' })} {done + 1}/{SCENARIOS.length} —{' '}
          {t({ en: 'where should', es: '¿dónde debería vivir' })}{' '}
          <strong className="text-[var(--accent)]">“{t(scenario.stateName)}”</strong>{' '}
          {t({ en: 'live?', es: '?' })}
        </p>
        <TreeButtons tree={scenario.tree} root={root} onPick={pick} picked={picked} disabled={!!picked} />
      </div>
      <div aria-live="polite">
        {!picked && (
          <p className="text-sm text-[var(--muted)] flex items-center gap-2">
            <MousePointerClick size={16} aria-hidden="true" />
            {t({ en: 'Click the component that should own this state.', es: 'Pulsa el componente que debería poseer este estado.' })}
          </p>
        )}
        {picked && (
          <div>
            <p className={`flex items-center gap-2 font-bold mb-2 ${isCorrect ? 'text-[var(--green)]' : 'text-[var(--amber)]'}`}>
              {isCorrect ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
              {isCorrect ? t(STRINGS.correct) : t(STRINGS.wrong)}
            </p>
            <Callout type={isCorrect ? 'tip' : 'warn'}>
              {isCorrect ? t(scenario.why) : t(scenario.whyWrong[picked] ?? scenario.why)}
            </Callout>
            <button type="button" className="btn btn-primary mt-2" onClick={next}>
              {t(STRINGS.next)}
            </button>
          </div>
        )}
        <p className="mono text-sm text-[var(--muted)] mt-4">
          {t(STRINGS.score)}: {score}/{done}
        </p>
      </div>
    </div>
  )
}

/* ---------------- Game 3: component design ---------------- */

const REGIONS = [
  { id: 'navbar', label: { en: 'Navbar', es: 'Barra de navegación' }, span: 'col-span-2', suggested: 'Navbar' },
  { id: 'stats', label: { en: 'Stats bar', es: 'Barra de estadísticas' }, span: 'col-span-2', suggested: 'StatsBar' },
  { id: 'filters', label: { en: 'Filters', es: 'Filtros' }, span: '', suggested: 'FilterBar' },
  { id: 'card1', label: { en: 'Card', es: 'Tarjeta' }, span: '', suggested: 'ProductCard' },
  { id: 'card2', label: { en: 'Card', es: 'Tarjeta' }, span: '', suggested: 'ProductCard' },
  { id: 'card3', label: { en: 'Card', es: 'Tarjeta' }, span: '', suggested: 'ProductCard' },
  { id: 'table', label: { en: 'Orders table', es: 'Tabla de pedidos' }, span: 'col-span-2', suggested: 'OrdersTable' },
  { id: 'footer', label: { en: 'Footer', es: 'Pie' }, span: 'col-span-2', suggested: 'Footer' },
]

const RATIONALE = [
  {
    en: 'The three cards are one reusable <ProductCard /> — same shape, different props. Never copy-paste a component three times.',
    es: 'Las tres tarjetas son un único <ProductCard /> reutilizable: misma forma, distintas props. Nunca copies un componente tres veces.',
  },
  {
    en: '<FilterBar /> owns the filter state; <OrdersTable /> just receives the filtered rows as props. Data down, events up.',
    es: '<FilterBar /> posee el estado del filtro; <OrdersTable /> solo recibe las filas filtradas como props. Datos abajo, eventos arriba.',
  },
  {
    en: '<Dashboard /> composes everything and owns the shared state (filters, orders). Presentational pieces stay dumb and reusable.',
    es: '<Dashboard /> compone todo y posee el estado compartido (filtros, pedidos). Las piezas de presentación son simples y reutilizables.',
  },
]

function DesignGame() {
  const { t } = useLang()
  const [selected, setSelected] = useState([])
  const [revealed, setRevealed] = useState(false)

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const cardsPicked = ['card1', 'card2', 'card3'].filter((c) => selected.includes(c)).length

  return (
    <div>
      <p className="text-[var(--text)] mb-4 max-w-3xl">{t(STRINGS.designIntro)}</p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 mb-4" role="group" aria-label={t(STRINGS.yourPick)}>
        <div className="grid grid-cols-2 gap-2">
          {REGIONS.map((r) => {
            const on = selected.includes(r.id)
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggle(r.id)}
                aria-pressed={on}
                className={`${r.span} rounded-lg border-2 px-3 py-4 text-sm font-medium transition-colors min-h-16`}
                style={{
                  borderColor: on ? 'var(--accent)' : 'var(--border)',
                  background: on ? 'var(--accent-dim)' : 'var(--surface-2)',
                  color: 'var(--text-strong)',
                }}
              >
                {t(r.label)}
                {on && <span className="block mono text-xs text-[var(--accent)] mt-1">&lt;… /&gt;</span>}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button type="button" className="btn" onClick={() => setSelected([])}>
          {t(STRINGS.clearSel)}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setRevealed((r) => !r)} aria-expanded={revealed}>
          <Eye size={14} aria-hidden="true" /> {revealed ? t(STRINGS.hide) : t(STRINGS.reveal)}
        </button>
        <span className="mono text-xs text-[var(--muted)]" aria-live="polite">
          {selected.length} {t(STRINGS.selectedCount)}
        </span>
      </div>

      {revealed && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.suggested)}</h3>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-4 mono text-sm text-[var(--text)] overflow-x-auto whitespace-pre">
{`<Dashboard>
  <Navbar />
  <StatsBar />
  <FilterBar />
  <ProductCard /> <ProductCard /> <ProductCard />
  <OrdersTable />
  <Footer />
</Dashboard>`}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.rationaleTitle)}</h3>
            {RATIONALE.map((r, i) => (
              <Callout key={i} type="tip">{t(r)}</Callout>
            ))}
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.howDidYouDo)}</h3>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              <li className="flex gap-2">
                {cardsPicked === 3 ? <Check size={16} className="text-[var(--green)] shrink-0 mt-0.5" aria-hidden="true" /> : <X size={16} className="text-[var(--amber)] shrink-0 mt-0.5" aria-hidden="true" />}
                {t({
                  en: `You marked ${cardsPicked}/3 cards as components — ${cardsPicked === 3 ? 'you spotted the reusable <ProductCard />!' : 'hint: identical shapes usually mean one reusable component.'}`,
                  es: `Marcaste ${cardsPicked}/3 tarjetas como componentes: ${cardsPicked === 3 ? '¡detectaste el <ProductCard /> reutilizable!' : 'pista: formas idénticas suelen significar un único componente reutilizable.'}`,
                })}
              </li>
              <li className="flex gap-2">
                {selected.includes('filters') ? <Check size={16} className="text-[var(--green)] shrink-0 mt-0.5" aria-hidden="true" /> : <X size={16} className="text-[var(--amber)] shrink-0 mt-0.5" aria-hidden="true" />}
                {t({
                  en: 'Filters as their own component — the filter state has a natural home.',
                  es: 'Filtros como componente propio: el estado del filtro tiene un hogar natural.',
                })}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- main lab ---------------- */

const TABS = [
  { id: 'flow', label: STRINGS.tab1 },
  { id: 'state', label: STRINGS.tab2 },
  { id: 'design', label: STRINGS.tab3 },
]

export default function ThinkingLab() {
  const { t, lang } = useLang()
  const [tab, setTab] = useState('flow')

  return (
    <SimulationShell
      labId="thinking-lab"
      title={t({ en: 'Thinking in React', es: 'Pensar en React' })}
      intro={t({ en: 'React is a way of thinking before it is a library. Practice the design flow, the state-placement instinct, and the component-splitting eye.', es: 'React es una forma de pensar antes que una librería. Practica el flujo de diseño, el instinto de colocación del estado y el ojo para dividir componentes.' })}
      difficulty="beginner"
    >
      <div role="tablist" aria-label={t({ en: 'Thinking games', es: 'Juegos de pensamiento' })} className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={tab === tb.id}
            type="button"
            onClick={() => setTab(tb.id)}
            className="btn"
            style={tab === tb.id ? { borderColor: 'var(--accent)', background: 'var(--accent-dim)', color: 'var(--text-strong)' } : undefined}
          >
            {t(tb.label)}
          </button>
        ))}
      </div>

      {tab === 'flow' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
            <FlowSteps steps={FLOW_5} auto={false} />
          </div>
          <div>
            <SectionTitle>{t(STRINGS.shopTitle)}</SectionTitle>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden" aria-label={t(STRINGS.shopTitle)}>
              <div className="relative px-4 py-3 bg-[var(--accent-dim)] border-b border-[var(--border)] flex items-center justify-between">
                <strong className="text-[var(--text-strong)] text-sm">Acme</strong>
                <span className="mono text-xs text-[var(--text)]">🛒 2</span>
                <span className="absolute -top-0 right-2 mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)] text-[var(--accent-ink)] font-bold" aria-hidden="true">2</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="relative">
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--faint)]">
                    {lang === 'es' ? 'Buscar… (estado: query)' : 'Search… (state: query)'}
                  </div>
                  <span className="absolute -top-2 left-2 mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--green)] text-[var(--accent-ink)] font-bold" aria-hidden="true">3·4</span>
                </div>
                <div className="relative grid grid-cols-2 gap-2">
                  {['Keyboard', 'Mouse'].map((n) => (
                    <div key={n} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2 text-sm text-[var(--text-strong)]">
                      {n}
                      <span className="block mono text-xs text-[var(--faint)]">props ↓ · onBuy ↑</span>
                    </div>
                  ))}
                  <span className="absolute -top-2 left-2 mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--amber)] text-[var(--accent-ink)] font-bold" aria-hidden="true">5</span>
                </div>
                <p className="mono text-[10px] text-[var(--faint)]">
                  <span className="text-[var(--accent)] font-bold">1</span> {lang === 'es' ? 'la UI · ' : 'the UI · '}
                  <span className="text-[var(--accent)] font-bold">2</span> {lang === 'es' ? 'componentes · ' : 'components · '}
                  <span className="text-[var(--green)] font-bold">3·4</span> {lang === 'es' ? 'estado y su hogar · ' : 'state & its home · '}
                  <span className="text-[var(--amber)] font-bold">5</span> {lang === 'es' ? 'props ↓ eventos ↑' : 'props ↓ events ↑'}
                </p>
              </div>
            </div>
            <Callout type="info">
              {t({
                en: 'Read the numbered badges against the five steps: the whole mock (1) becomes boxes (2); the search text is state (3) owned by the page (4); products receive props and report events (5).',
                es: 'Lee las insignias numeradas con los cinco pasos: el mock completo (1) se convierte en cajas (2); el texto de búsqueda es estado (3) propiedad de la página (4); los productos reciben props y reportan eventos (5).',
              })}
            </Callout>
          </div>
        </div>
      )}

      {tab === 'state' && (
        <div>
          <SectionTitle>{t(STRINGS.tab2)}</SectionTitle>
          <p className="text-[var(--muted)] text-sm mb-6 max-w-3xl">{t(STRINGS.gameIntro)}</p>
          <StateGame />
        </div>
      )}

      {tab === 'design' && (
        <div>
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <LayoutDashboard size={20} aria-hidden="true" /> {t(STRINGS.tab3)}
            </span>
          </SectionTitle>
          <DesignGame />
        </div>
      )}
    </SimulationShell>
  )
}
