import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { termDef } from '../data/glossary.js'
import { getModule } from '../data/modules.js'
import { PageHeader } from '../components/ui.jsx'

// Interactive concept map: 11 core concepts as SVG nodes with edges.
// Click a node -> definition panel (from glossary data).
const NODES = [
  { id: 'component', x: 400, y: 60 },
  { id: 'jsx', x: 160, y: 170 },
  { id: 'props', x: 400, y: 170 },
  { id: 'state', x: 640, y: 170 },
  { id: 'render', x: 280, y: 300 },
  { id: 'effect', x: 520, y: 300 },
  { id: 'hook', x: 400, y: 420 },
  { id: 'context', x: 160, y: 430 },
  { id: 'key', x: 640, y: 430 },
  { id: 'virtual-dom', x: 280, y: 550 },
  { id: 'reconciliation', x: 520, y: 550 },
]

const EDGES = [
  ['component', 'jsx'],
  ['component', 'props'],
  ['component', 'state'],
  ['props', 'render'],
  ['state', 'render'],
  ['render', 'effect'],
  ['render', 'hook'],
  ['component', 'context'],
  ['render', 'key'],
  ['render', 'virtual-dom'],
  ['virtual-dom', 'reconciliation'],
  ['key', 'reconciliation'],
]

const STRINGS = {
  subtitle: {
    en: 'How the core ideas connect. Select a node to see its definition.',
    es: 'Cómo se conectan las ideas centrales. Selecciona un nodo para ver su definición.',
  },
  openLesson: { en: 'Open lesson', es: 'Abrir lección' },
}

export default function ConceptMap() {
  const { t, lang } = useLang()
  const [selected, setSelected] = useState('component')

  const nodeById = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), [])
  const def = termDef(selected, lang)
  const lesson = def?.lesson ? getModule(def.lesson) : null

  return (
    <div>
      <PageHeader title={t('nav.concepts')} subtitle={t(STRINGS.subtitle)} icon={Share2} />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="card p-2 overflow-x-auto">
          <svg
            viewBox="0 0 800 640"
            className="w-full min-w-[560px] h-auto"
            role="img"
            aria-label={t('nav.concepts')}
          >
            {EDGES.map(([a, b]) => {
              const A = nodeById[a]
              const B = nodeById[b]
              return (
                <line
                  key={`${a}-${b}`}
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke="var(--border-strong)"
                  strokeWidth="1.5"
                />
              )
            })}
            {NODES.map((n) => {
              const d = termDef(n.id, lang)
              const active = selected === n.id
              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={active ? 52 : 46}
                    fill={active ? 'var(--accent-dim)' : 'var(--surface-2)'}
                    stroke={active ? 'var(--accent)' : 'var(--border-strong)'}
                    strokeWidth={active ? 3 : 1.5}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelected(n.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelected(n.id)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={d.term}
                    aria-pressed={active}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dy=".35em"
                    fontSize="13"
                    fontWeight="700"
                    fill="var(--text)"
                    className="pointer-events-none select-none"
                  >
                    {d.term}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-20" aria-live="polite">
          {def && (
            <>
              <h2 className="text-xl font-bold text-[var(--accent)] mb-2">{def.term}</h2>
              <p className="text-[var(--text)]">{def.def}</p>
              {def.example && (
                <pre className="mono text-sm mt-4 p-3 rounded-lg bg-[var(--code-bg)] border border-[var(--code-border)] overflow-x-auto">
                  {def.example}
                </pre>
              )}
              {lesson && (
                <Link to={lesson.path} className="btn btn-primary mt-4">
                  {t(STRINGS.openLesson)}: {t(lesson.title)}
                </Link>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
