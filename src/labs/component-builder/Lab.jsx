import { useRef, useState } from 'react'
import {
  Menu,
  Type,
  Square,
  MousePointerClick,
  User,
  PanelBottom,
  ArrowUp,
  ArrowDown,
  X,
  Trash2,
  Target,
} from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

/* ------------------------------------------------------------------ */
/* The building blocks (presentational only)                           */
/* ------------------------------------------------------------------ */

function NavbarView() {
  const { t } = useLang()
  return (
    <nav className="flex items-center justify-between rounded-lg bg-[var(--surface-3)] border border-[var(--border)] px-4 py-2.5">
      <span className="font-bold text-[var(--accent)]">MyApp</span>
      <span className="flex gap-4 text-xs text-[var(--muted)]">
        <span>{t({ en: 'Home', es: 'Inicio' })}</span>
        <span>{t({ en: 'About', es: 'Acerca de' })}</span>
        <span>{t({ en: 'Contact', es: 'Contacto' })}</span>
      </span>
    </nav>
  )
}

function HeaderView() {
  const { t } = useLang()
  return (
    <header className="rounded-lg border border-[var(--border)] bg-gradient-to-br from-[var(--accent-dim)] to-transparent px-6 py-8 text-center">
      <h3 className="text-xl font-bold text-[var(--text-strong)]">
        {t({ en: 'Welcome to my page', es: 'Bienvenido a mi página' })}
      </h3>
      <p className="text-sm text-[var(--muted)] mt-1">
        {t({ en: 'Built from small components', es: 'Construida con componentes pequeños' })}
      </p>
    </header>
  )
}

function CardView() {
  const { t } = useLang()
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <h4 className="font-bold text-[var(--text-strong)] text-sm">
        {t({ en: 'Card title', es: 'Título de tarjeta' })}
      </h4>
      <p className="text-xs text-[var(--muted)] mt-1">
        {t({ en: 'Reusable content block. Use me anywhere.', es: 'Bloque reutilizable. Úsame donde quieras.' })}
      </p>
    </div>
  )
}

function ButtonView() {
  const { t } = useLang()
  return (
    <div>
      <button type="button" className="btn btn-primary">
        {t({ en: 'Click me', es: 'Púlsame' })}
      </button>
    </div>
  )
}

function ProfileView() {
  const { t } = useLang()
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
        style={{ background: 'var(--accent)' }}
        aria-hidden="true"
      >
        J
      </div>
      <div>
        <p className="font-bold text-[var(--text-strong)] text-sm">Jon Peciña</p>
        <p className="text-xs text-[var(--muted)]">
          {t({ en: 'Frontend developer', es: 'Desarrollador frontend' })}
        </p>
      </div>
    </div>
  )
}

function FooterView() {
  const { t } = useLang()
  return (
    <footer className="rounded-lg border border-[var(--border)] bg-[var(--surface-3)] px-4 py-3 text-center text-xs text-[var(--muted)]">
      © 2026 MyApp — {t({ en: 'Built with React', es: 'Hecho con React' })}
    </footer>
  )
}

const TYPES = {
  navbar: { view: NavbarView, icon: Menu, color: '#3b82f6', tag: 'Navbar' },
  header: { view: HeaderView, icon: Type, color: '#8b5cf6', tag: 'Header' },
  card: { view: CardView, icon: Square, color: '#f59e0b', tag: 'Card' },
  button: { view: ButtonView, icon: MousePointerClick, color: '#22c55e', tag: 'Button' },
  profile: { view: ProfileView, icon: User, color: '#ec4899', tag: 'Profile' },
  footer: { view: FooterView, icon: PanelBottom, color: '#64748b', tag: 'Footer' },
}

const TYPE_LABEL = {
  navbar: { en: 'Navbar', es: 'Barra de navegación' },
  header: { en: 'Header', es: 'Cabecera' },
  card: { en: 'Card', es: 'Tarjeta' },
  button: { en: 'Button', es: 'Botón' },
  profile: { en: 'Profile', es: 'Perfil' },
  footer: { en: 'Footer', es: 'Pie de página' },
}

const CHALLENGE_TARGET = ['navbar', 'header', 'card', 'card', 'footer']

/* ------------------------------------------------------------------ */
/* Lab                                                                */
/* ------------------------------------------------------------------ */

const STRINGS = {
  concept: { en: 'Concept', es: 'Concepto' },
  conceptBody: {
    en: 'A page is not one big file — it is small components composed together. Pick pieces from the palette and add them to the page. The tree and the code update live.',
    es: 'Una página no es un fichero gigante: son componentes pequeños compuestos. Elige piezas de la paleta y añádelas a la página. El árbol y el código se actualizan en vivo.',
  },
  palette: { en: 'Palette — click to add', es: 'Paleta: pulsa para añadir' },
  canvas: { en: 'Your page', es: 'Tu página' },
  canvasEmpty: {
    en: 'Empty page. Add components from the palette above.',
    es: 'Página vacía. Añade componentes desde la paleta.',
  },
  tree: { en: 'Component tree', es: 'Árbol de componentes' },
  highlight: { en: 'Highlight component boundaries', es: 'Resaltar límites de componentes' },
  generated: { en: 'The generated JSX', es: 'El JSX generado' },
  clear: { en: 'Clear all', es: 'Limpiar todo' },
  challenge: { en: 'Challenge: recreate this layout', es: 'Reto: recrea este diseño' },
  challengeHint: {
    en: 'Build exactly this sequence in your page, then check.',
    es: 'Construye exactamente esta secuencia en tu página y comprueba.',
  },
  check: { en: 'Check my layout', es: 'Comprobar mi diseño' },
  challengeOk: {
    en: 'Perfect match! You just composed a page from five components.',
    es: '¡Coincidencia perfecta! Acabas de componer una página con cinco componentes.',
  },
  challengeKo: {
    en: 'Not quite yet — compare your tree with the target above.',
    es: 'Todavía no: compara tu árbol con el objetivo de arriba.',
  },
  moveUp: { en: 'Move up', es: 'Subir' },
  moveDown: { en: 'Move down', es: 'Bajar' },
  remove: { en: 'Remove', es: 'Eliminar' },
}

export default function ComponentBuilderLab() {
  const { t } = useLang()
  const uidRef = useRef(0)
  const [instances, setInstances] = useState([])
  const [highlight, setHighlight] = useState(false)
  const [challengeMsg, setChallengeMsg] = useState(null) // 'ok' | 'ko' | null

  const add = (type) => {
    uidRef.current += 1
    setInstances((prev) => [...prev, { uid: uidRef.current, type }])
    setChallengeMsg(null)
  }
  const remove = (uid) => {
    setInstances((prev) => prev.filter((i) => i.uid !== uid))
    setChallengeMsg(null)
  }
  const move = (uid, dir) => {
    setInstances((prev) => {
      const idx = prev.findIndex((i) => i.uid === uid)
      const j = idx + dir
      if (idx < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return next
    })
  }
  const clear = () => {
    setInstances([])
    setChallengeMsg(null)
  }

  const checkChallenge = () => {
    const actual = instances.map((i) => i.type)
    const ok =
      actual.length === CHALLENGE_TARGET.length &&
      actual.every((type, i) => type === CHALLENGE_TARGET[i])
    setChallengeMsg(ok ? 'ok' : 'ko')
  }

  const generatedCode = `function App() {\n  return (\n    <main>\n${instances
    .map((i) => `      <${TYPES[i.type].tag} />`)
    .join('\n')}\n    </main>\n  );\n}`

  return (
    <SimulationShell
      labId="component-builder"
      title={t({ en: 'Component Builder', es: 'Constructor de componentes' })}
      intro={t({
        en: 'Assemble a page from small pieces and watch the component tree grow as you build.',
        es: 'Monta una página con piezas pequeñas y observa cómo crece el árbol de componentes.',
      })}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--text)] mb-2">{t(STRINGS.conceptBody)}</p>

      <SectionTitle>{t(STRINGS.palette)}</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2" role="group" aria-label={t(STRINGS.palette)}>
        {Object.entries(TYPES).map(([key, def]) => {
          const Icon = def.icon
          return (
            <button
              key={key}
              type="button"
              className="btn justify-start"
              onClick={() => add(key)}
            >
              <Icon size={16} style={{ color: def.color }} aria-hidden="true" />
              {t(TYPE_LABEL[key])}
              <span className="mono text-xs text-[var(--faint)] ml-auto">+</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 my-6">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-strong)] cursor-pointer">
          <input
            type="checkbox"
            checked={highlight}
            onChange={(e) => setHighlight(e.target.checked)}
            className="w-4 h-4 accent-[var(--accent)]"
          />
          {t(STRINGS.highlight)}
        </label>
        <button type="button" className="btn !py-1.5 !px-3 !text-xs ml-auto" onClick={clear}>
          <Trash2 size={13} aria-hidden="true" />
          {t(STRINGS.clear)}
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Canvas */}
        <div className="lg:col-span-3">
          <h3 className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.canvas)}</h3>
          {instances.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--faint)] italic">
              {t(STRINGS.canvasEmpty)}
            </div>
          ) : (
            <div className="flex flex-col gap-5" aria-live="polite">
              {instances.map((inst, idx) => {
                const def = TYPES[inst.type]
                const View = def.view
                return (
                  <div key={inst.uid} className="relative">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="mono text-xs font-bold" style={{ color: def.color }}>
                        &lt;{def.tag} /&gt;
                      </span>
                      <span className="flex-1" />
                      <button
                        type="button"
                        className="btn !p-1.5"
                        onClick={() => move(inst.uid, -1)}
                        disabled={idx === 0}
                        aria-label={`${t(STRINGS.moveUp)} <${def.tag} />`}
                      >
                        <ArrowUp size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn !p-1.5"
                        onClick={() => move(inst.uid, 1)}
                        disabled={idx === instances.length - 1}
                        aria-label={`${t(STRINGS.moveDown)} <${def.tag} />`}
                      >
                        <ArrowDown size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn !p-1.5"
                        onClick={() => remove(inst.uid)}
                        aria-label={`${t(STRINGS.remove)} <${def.tag} />`}
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </div>
                    <div
                      className="relative rounded-lg"
                      style={
                        highlight
                          ? { outline: `2px dashed ${def.color}`, outlineOffset: '6px' }
                          : undefined
                      }
                    >
                      {highlight && (
                        <span
                          className="absolute -top-3 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ background: def.color }}
                          aria-hidden="true"
                        >
                          &lt;{def.tag} /&gt;
                        </span>
                      )}
                      <View />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tree */}
        <div className="lg:col-span-2">
          <h3 className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.tree)}</h3>
          <div className="rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] p-4 mono text-sm">
            <div className="text-[var(--accent)] font-bold">&lt;App&gt;</div>
            {instances.length === 0 && (
              <div className="text-[var(--faint)] italic text-xs mt-1">
                {t({ en: '// nothing yet', es: '// nada todavía' })}
              </div>
            )}
            {instances.map((inst, idx) => {
              const def = TYPES[inst.type]
              const last = idx === instances.length - 1
              return (
                <div key={inst.uid} className="flex gap-2">
                  <span className="text-[var(--faint)] select-none" aria-hidden="true">
                    {last ? '└──' : '├──'}
                  </span>
                  <span className="font-bold" style={{ color: def.color }}>
                    &lt;{def.tag} /&gt;
                  </span>
                </div>
              )
            })}
          </div>

          <h3 className="font-bold text-[var(--text-strong)] mt-6 mb-3">{t(STRINGS.generated)}</h3>
          <CodeBlock
            code={instances.length === 0 ? '// add components to generate code' : generatedCode}
            lang="jsx"
            maxHeight={260}
          />
        </div>
      </div>

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <div className="card p-5">
        <p className="text-sm text-[var(--muted)] mb-3">{t(STRINGS.challengeHint)}</p>
        <div className="mono text-sm mb-4 flex flex-col gap-1">
          <span className="text-[var(--accent)] font-bold">&lt;App&gt;</span>
          {CHALLENGE_TARGET.map((type, i) => (
            <span key={i} className="flex gap-2">
              <span className="text-[var(--faint)]" aria-hidden="true">
                {i === CHALLENGE_TARGET.length - 1 ? '└──' : '├──'}
              </span>
              <span className="font-bold" style={{ color: TYPES[type].color }}>
                &lt;{TYPES[type].tag} /&gt;
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={checkChallenge}>
            <Target size={15} aria-hidden="true" />
            {t(STRINGS.check)}
          </button>
          {challengeMsg && (
            <p
              role="status"
              className="text-sm font-semibold"
              style={{ color: challengeMsg === 'ok' ? 'var(--green)' : 'var(--amber)' }}
            >
              {t(challengeMsg === 'ok' ? STRINGS.challengeOk : STRINGS.challengeKo)}
            </p>
          )}
        </div>
      </div>

      <Callout type="tip">
        {t({
          en: 'Notice the tree mirrors your page exactly: composition is just components inside components. React apps of any size are built this way.',
          es: 'Fíjate: el árbol refleja tu página exactamente. La composición no es más que componentes dentro de componentes. Así se construyen apps React de cualquier tamaño.',
        })}
      </Callout>
    </SimulationShell>
  )
}
