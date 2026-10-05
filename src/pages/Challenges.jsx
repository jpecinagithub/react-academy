import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Swords,
  PencilLine,
  Bug,
  BrainCircuit,
  LayoutGrid,
  Rocket,
  Check,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Flag,
} from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../state/store.js'
import { getModule } from '../data/modules.js'
import { CHALLENGES, CHALLENGE_COUNT } from '../challenges/registry.js'
import ChallengeView from '../challenges/ChallengeView.jsx'
import { MINIAPPS } from '../miniapps/data.js'
import { PageHeader, Callout, CodeBlock, DifficultyBadge, ProgressRing } from '../components/ui.jsx'

const STRINGS = {
  subtitle: {
    en: 'Complete code, hunt bugs, predict outputs — then build real mini apps.',
    es: 'Completa código, caza bugs, predice resultados y construye mini apps reales.',
  },
  tabs: {
    all: { en: 'All', es: 'Todos' },
    'fill-blank': { en: 'Complete the code', es: 'Completa el código' },
    'bug-hunt': { en: 'Bug hunt', es: 'Caza el bug' },
    predict: { en: 'Predict', es: 'Predice' },
    miniapps: { en: 'Mini apps', es: 'Mini apps' },
  },
  done: { en: 'done', es: 'listo' },
  start: { en: 'Start', es: 'Empezar' },
  review: { en: 'Review', es: 'Repasar' },
  goal: { en: 'Goal', es: 'Objetivo' },
  steps: { en: 'Build steps', es: 'Pasos de construcción' },
  starter: { en: 'Starter code', es: 'Código inicial' },
  hint: { en: 'Solution hint', es: 'Pista de solución' },
  openPlayground: { en: 'Open in Playground', es: 'Abrir en el Playground' },
  emptyType: {
    en: 'All challenges in this category are complete. Pick another tab!',
    es: 'Has completado todos los retos de esta categoría. ¡Elige otra pestaña!',
  },
}

const TYPE_ICON = {
  'fill-blank': PencilLine,
  'bug-hunt': Bug,
  predict: BrainCircuit,
}

function TypeTabs({ active, onChange }) {
  const { t } = useLang()
  const tabs = [
    { id: 'all', icon: LayoutGrid },
    { id: 'fill-blank', icon: PencilLine },
    { id: 'bug-hunt', icon: Bug },
    { id: 'predict', icon: BrainCircuit },
    { id: 'miniapps', icon: Rocket },
  ]
  return (
    <div className="flex flex-wrap gap-2 my-6 no-print" role="tablist" aria-label={t(STRINGS.subtitle)}>
      {tabs.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          onClick={() => onChange(id)}
          className="btn !py-2 !px-3.5 !text-sm inline-flex items-center gap-2"
          style={
            active === id
              ? { borderColor: 'var(--accent)', background: 'var(--accent-dim)', color: 'var(--accent)' }
              : undefined
          }
        >
          <Icon size={15} aria-hidden="true" />
          {t(STRINGS.tabs[id])}
        </button>
      ))}
    </div>
  )
}

function ChallengeCard({ challenge, completed }) {
  const { t } = useLang()
  const Icon = TYPE_ICON[challenge.type]
  const module = getModule(challenge.moduleId)
  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="card p-5 flex flex-col gap-3 hover:border-[var(--accent)] transition-colors group"
      style={completed ? { borderColor: 'var(--green)' } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex p-2.5 rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]"
          aria-hidden="true"
        >
          <Icon size={20} />
        </span>
        {completed && (
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: 'var(--green-dim)', color: 'var(--green)' }}
          >
            <Check size={12} aria-hidden="true" /> {t(STRINGS.done)}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-bold text-[var(--text-strong)] group-hover:text-[var(--accent)] transition-colors">
          {t(challenge.title)}
        </h3>
        <p className="text-xs text-[var(--muted)] mt-1">{module ? t(module.title) : challenge.moduleId}</p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <DifficultyBadge level={challenge.difficulty} />
        <span className="text-sm font-semibold text-[var(--accent)]">
          {completed ? t(STRINGS.review) : t(STRINGS.start)} →
        </span>
      </div>
    </Link>
  )
}

function MiniAppGuide({ app, open, onToggle }) {
  const { t } = useLang()
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <span
          className="inline-flex p-2.5 rounded-xl bg-[var(--accent-dim)] text-[var(--accent)] shrink-0"
          aria-hidden="true"
        >
          <Rocket size={20} />
        </span>
        <span className="flex-1">
          <span className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[var(--text-strong)]">{t(app.title)}</h3>
            <DifficultyBadge level={app.difficulty} />
          </span>
          <p className="text-sm text-[var(--muted)] mt-1">{t(app.goal)}</p>
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="shrink-0 mt-1 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : undefined, color: 'var(--muted)' }}
        />
      </button>
      {open && (
        <div className="px-5 pb-6 border-t border-[var(--border)] pt-5">
          <h4 className="font-bold text-[var(--text-strong)] mb-3 flex items-center gap-2">
            <Flag size={15} aria-hidden="true" /> {t(STRINGS.steps)}
          </h4>
          <ol className="flex flex-col gap-4">
            {app.steps.map((step, i) => (
              <li key={i}>
                <p className="font-semibold text-sm text-[var(--text-strong)]">{t(step.title)}</p>
                <p className="text-sm text-[var(--muted)] mt-1">{t(step.detail)}</p>
                {step.code && <CodeBlock code={step.code} lang="jsx" />}
              </li>
            ))}
          </ol>
          <h4 className="font-bold text-[var(--text-strong)] mt-6 mb-1">{t(STRINGS.starter)}</h4>
          <CodeBlock code={app.starterCode} lang="jsx" />
          <Callout type="tip" title={t(STRINGS.hint)}>
            {t(app.solutionHint)}
          </Callout>
          <Link to={app.playgroundLink} className="btn btn-primary mt-4">
            <ExternalLink size={15} aria-hidden="true" /> {t(STRINGS.openPlayground)}
          </Link>
        </div>
      )}
    </div>
  )
}

function ChallengesList() {
  const { t } = useLang()
  const doneIds = useStore((s) => s.progress.challenges)
  const [tab, setTab] = useState('all')
  const [openApp, setOpenApp] = useState(null)

  const doneCount = CHALLENGES.filter((c) => doneIds[c.id]).length
  const visible =
    tab === 'all' ? CHALLENGES : tab === 'miniapps' ? [] : CHALLENGES.filter((c) => c.type === tab)

  return (
    <div>
      <PageHeader
        title={t('nav.challenges')}
        subtitle={t(STRINGS.subtitle)}
        icon={Swords}
        actions={
          <span className="inline-flex items-center gap-3">
            <ProgressRing value={(doneCount / CHALLENGE_COUNT) * 100} size={52} />
            <span className="text-sm font-semibold text-[var(--text-strong)]">
              {doneCount} / {CHALLENGE_COUNT}
            </span>
          </span>
        }
      />
      <TypeTabs active={tab} onChange={setTab} />

      {tab === 'miniapps' ? (
        <div className="flex flex-col gap-4">
          <Callout type="info" title={t(STRINGS.tabs.miniapps)}>
            {t({
              en: 'Five guided projects. Read the steps, then build each one in the Playground — the starter code is ready to paste.',
              es: 'Cinco proyectos guiados. Lee los pasos y construye cada uno en el Playground: el código inicial está listo para pegar.',
            })}
          </Callout>
          {MINIAPPS.map((app) => (
            <MiniAppGuide
              key={app.id}
              app={app}
              open={openApp === app.id}
              onToggle={() => setOpenApp((o) => (o === app.id ? null : app.id))}
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Callout type="tip" title={t(STRINGS.emptyType)} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((c) => (
            <ChallengeCard key={c.id} challenge={c} completed={!!doneIds[c.id]} />
          ))}
        </div>
      )}

      <p className="text-sm text-[var(--muted)] mt-8 flex items-center gap-2">
        <Lightbulb size={15} aria-hidden="true" />
        {t({
          en: 'Stuck on a concept? Every challenge links back to its module and shows why the answer works.',
          es: '¿Atascado con un concepto? Cada reto enlaza con su módulo y explica por qué la respuesta funciona.',
        })}
      </p>
    </div>
  )
}

export default function Challenges() {
  const { id } = useParams()
  if (id) {
    return (
      <div className="max-w-3xl mx-auto">
        <ChallengeView key={id} id={id} />
      </div>
    )
  }
  return <ChallengesList />
}
