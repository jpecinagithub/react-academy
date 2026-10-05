import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Trash2 } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore, selectOverallProgress } from '../state/store.js'
import { MODULES } from '../data/modules.js'
import { LABS, getLabsByModule } from '../labs/loader.js'
import { LESSONS, getLessonsByModule } from '../lessons/loader.js'
import { QUIZZES } from '../quizzes/loader.js'
import { PageHeader, ProgressRing, Callout } from '../components/ui.jsx'
import { ModuleIcon } from '../utils/icons.jsx'

const STRINGS = {
  subtitle: {
    en: 'Everything you complete is stored locally on this device. No accounts.',
    es: 'Todo lo que completas se guarda en este dispositivo. Sin cuentas.',
  },
  overall: { en: 'Overall progress', es: 'Progreso total' },
  lessonsDone: { en: 'Lessons completed', es: 'Lecciones completadas' },
  labsDone: { en: 'Labs completed', es: 'Laboratorios completados' },
  challengesDone: { en: 'Challenges completed', es: 'Retos completados' },
  quizzesDone: { en: 'Quizzes taken', es: 'Cuestionarios realizados' },
  perModule: { en: 'Progress per module', es: 'Progreso por módulo' },
  reset: { en: 'Reset progress', es: 'Reiniciar progreso' },
  resetConfirm: {
    en: 'Delete all local progress? This cannot be undone.',
    es: '¿Borrar todo el progreso local? No se puede deshacer.',
  },
  noContent: {
    en: 'Content is still being built — your progress will grow with each phase.',
    es: 'El contenido aún se está construyendo: tu progreso crecerá con cada fase.',
  },
}

function Bar({ value }) {
  return (
    <div
      className="h-2.5 rounded-full bg-[var(--surface-3)] overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export default function Dashboard() {
  const { t } = useLang()
  const progress = useStore((s) => s.progress)
  const resetProgress = useStore((s) => s.resetProgress)
  const [confirming, setConfirming] = useState(false)

  const totals = {
    lessons: LESSONS.length,
    labs: LABS.length,
    challenges: 0, // Phase 9 registers challenge ids
    quizzes: QUIZZES.length,
    sandboxes: 0, // Phase 8 registers sandbox ids
  }
  const overall = selectOverallProgress(progress, totals)

  const counts = {
    lessons: Object.keys(progress.lessons).length,
    labs: Object.keys(progress.labs).length,
    challenges: Object.keys(progress.challenges).length,
    quizzes: Object.keys(progress.quizzes).length,
  }

  return (
    <div>
      <PageHeader
        title={t('nav.dashboard')}
        subtitle={t(STRINGS.subtitle)}
        icon={LayoutDashboard}
        actions={
          confirming ? (
            <>
              <button type="button" className="btn" onClick={() => setConfirming(false)}>
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="btn"
                style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
                onClick={() => {
                  resetProgress()
                  setConfirming(false)
                }}
              >
                {t('common.confirm')}
              </button>
            </>
          ) : (
            <button type="button" className="btn" onClick={() => setConfirming(true)}>
              <Trash2 size={15} />
              {t(STRINGS.reset)}
            </button>
          )
        }
      />

      {confirming && (
        <Callout type="warn">
          {t(STRINGS.resetConfirm)}
        </Callout>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <div className="card p-5 text-center">
          <ProgressRing value={overall} size={72} label={t(STRINGS.overall)} />
          <p className="text-sm text-[var(--muted)] mt-2">{t(STRINGS.overall)}</p>
        </div>
        {[
          { k: 'lessonsDone', n: counts.lessons },
          { k: 'labsDone', n: counts.labs },
          { k: 'challengesDone', n: counts.challenges },
          { k: 'quizzesDone', n: counts.quizzes },
        ].map(({ k, n }) => (
          <div key={k} className="card p-5 text-center">
            <p className="text-3xl font-bold text-[var(--accent)]">{n}</p>
            <p className="text-sm text-[var(--muted)] mt-1">{t(STRINGS[k])}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-[var(--text-strong)] mb-4">{t(STRINGS.perModule)}</h2>
      {overall === 0 && (
        <p className="text-sm text-[var(--faint)] mb-4">{t(STRINGS.noContent)}</p>
      )}
      <div className="flex flex-col gap-3">
        {MODULES.map((m) => {
          const labs = getLabsByModule(m.id)
          const lessons = getLessonsByModule(m.id)
          const quiz = QUIZZES.find((q) => q.id === m.id)
          const done =
            lessons.filter((l) => progress.lessons[l.id]).length +
            labs.filter((l) => progress.labs[l.id]).length +
            (quiz && progress.quizzes[quiz.id] ? 1 : 0)
          const total = lessons.length + labs.length + (quiz ? 1 : 0)
          const pct = total === 0 ? 0 : (done / total) * 100
          return (
            <Link key={m.id} to={m.path} className="card p-4 hover:border-[var(--accent)] transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[var(--accent)]" aria-hidden="true">
                  <ModuleIcon name={m.icon} size={18} />
                </span>
                <span className="font-semibold text-[var(--text-strong)]">{t(m.title)}</span>
                <span className="ml-auto text-sm text-[var(--muted)]">
                  {done}/{total}
                </span>
              </div>
              <Bar value={pct} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
