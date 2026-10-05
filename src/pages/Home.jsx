import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical, Atom } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { MODULES } from '../data/modules.js'
import { track } from '../utils/analytics.js'

/* ---------- Live mini-demos (manipulable from the landing) ---------- */
function DemoCounter() {
  const [count, setCount] = useState(3)
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="btn btn-primary !px-4"
        onClick={() => setCount((c) => c + 1)}
        aria-label="increment"
      >
        +
      </button>
      <span className="mono text-xl font-bold text-[var(--accent)]" aria-live="polite">
        count = {count}
      </span>
    </div>
  )
}

function DemoButton() {
  const [pressed, setPressed] = useState(0)
  return (
    <button
      type="button"
      className="btn btn-primary mono"
      onClick={() => setPressed((p) => p + 1)}
    >
      {'<Button />'} {pressed > 0 && `· ${pressed}`}
    </button>
  )
}

function DemoEffect() {
  const [renders, setRenders] = useState(1)
  return (
    <button
      type="button"
      className="btn mono"
      onClick={() => setRenders((r) => r + 1)}
    >
      Render #{renders} → Effect ✓
    </button>
  )
}

function DemoProps() {
  const [name, setName] = useState('Ada')
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="mono text-[var(--accent)]">Parent</span>
        <span aria-hidden="true">→</span>
        <span className="mono text-[var(--violet)]">Child</span>
        <span className="mono font-bold">"{name}"</span>
      </div>
      <input
        className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-sm w-40"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="child prop name"
        maxLength={16}
      />
    </div>
  )
}

const DEMOS = [
  { key: 'demoComponent', Demo: DemoButton },
  { key: 'demoState', Demo: DemoCounter },
  { key: 'demoEffect', Demo: DemoEffect },
  { key: 'demoProps', Demo: DemoProps },
]

export default function Home() {
  const { t } = useLang()

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="text-center py-14 md:py-20">
        <div
          className="inline-flex p-4 rounded-2xl border border-[var(--border)] bg-[var(--accent-dim)] text-[var(--accent)] mb-6"
          aria-hidden="true"
        >
          <Atom size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-strong)] max-w-3xl mx-auto">
          {t('home.heroTitle')}
        </h1>
        <p className="mt-5 text-lg text-[var(--muted)] max-w-2xl mx-auto">{t('home.heroSub')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/modules"
            className="btn btn-primary !px-6 !py-3 !text-base"
            onClick={() => track('cta_start_learning', {})}
          >
            {t('common.startLearning')}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            to="/playground"
            className="btn !px-6 !py-3 !text-base"
            onClick={() => track('playground_open', { from: 'home' })}
          >
            <FlaskConical size={18} aria-hidden="true" />
            {t('common.openPlayground')}
          </Link>
        </div>
      </section>

      {/* ---------- Live demos ---------- */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14" aria-label="live demos">
        {DEMOS.map(({ key, Demo }) => (
          <div key={key} className="card p-5 flex flex-col gap-3">
            <p className="text-xs font-bold tracking-widest text-[var(--faint)]">{t(`home.${key}`)}</p>
            <Demo />
            <p className="text-xs text-[var(--faint)] mt-auto">
              {key === 'demoComponent' ? '<Button />' : key === 'demoState' ? 'useState' : key === 'demoEffect' ? 'useEffect' : 'props ↓'}
            </p>
          </div>
        ))}
      </section>

      {/* ---------- Why ---------- */}
      <section className="card p-8 mb-14 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-strong)] mb-6">
          {t('home.whyTitle')}
        </h2>
        <ul className="flex flex-col md:flex-row justify-center gap-4 text-[var(--muted)]">
          {t('home.whyPoints').map((point, i) => (
            <li key={i} className="flex-1 max-w-xs mx-auto">
              <span className="text-[var(--accent)] font-bold mr-2" aria-hidden="true">
                {i + 1}.
              </span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Modules ---------- */}
      <section className="mb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-strong)] mb-2">
          {t('home.modulesTitle')}
        </h2>
        <p className="text-[var(--muted)] mb-6">{t('home.modulesSub')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <Link
              key={m.id}
              to={m.path}
              className="card p-5 hover:border-[var(--accent)] transition-colors group"
            >
              <p className="text-xs font-bold text-[var(--faint)] mb-1">
                {String(m.order).padStart(2, '0')}
              </p>
              <h3 className="font-bold text-[var(--text-strong)] group-hover:text-[var(--accent)] transition-colors">
                {t(m.title)}
              </h3>
              <p className="text-sm text-[var(--muted)] mt-1">{t(m.blurb)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Stats strip ---------- */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { n: MODULES.length, k: 'modules' },
          { n: '30+', k: 'labs' },
          { n: 25, k: 'sandboxes' },
          { n: '40+', k: 'challenges' },
        ].map(({ n, k }) => (
          <div key={k} className="card p-5 text-center">
            <p className="text-3xl font-bold text-[var(--accent)]">{n}</p>
            <p className="text-sm text-[var(--muted)]">{t(`home.stats.${k}`)}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
