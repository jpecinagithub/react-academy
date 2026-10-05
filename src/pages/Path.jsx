import { Link } from 'react-router-dom'
import { Route as RouteIcon } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../state/store.js'
import { MODULES } from '../data/modules.js'
import { getLabsByModule } from '../labs/loader.js'
import { getLessonsByModule } from '../lessons/loader.js'
import { PageHeader, DifficultyBadge } from '../components/ui.jsx'
import { ModuleIcon } from '../utils/icons.jsx'

const STRINGS = {
  subtitle: {
    en: 'Follow the road from JavaScript to thinking in React. Click any node.',
    es: 'Sigue el camino desde JavaScript hasta pensar en React. Pulsa cualquier nodo.',
  },
  youAreHere: { en: 'next up', es: 'siguiente' },
  done: { en: 'done', es: 'hecho' },
}

export default function Path() {
  const { t } = useLang()
  const progress = useStore((s) => s.progress)

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title={t('nav.path')} subtitle={t(STRINGS.subtitle)} icon={RouteIcon} />

      <ol className="relative flex flex-col" aria-label={t('nav.path')}>
        {MODULES.map((m, i) => {
          const labs = getLabsByModule(m.id)
          const lessons = getLessonsByModule(m.id)
          const doneCount =
            labs.filter((l) => progress.labs[l.id]).length +
            lessons.filter((l) => progress.lessons[l.id]).length
          const total = labs.length + lessons.length
          const complete = total > 0 && doneCount === total
          const isLast = i === MODULES.length - 1
          return (
            <li key={m.id} className="relative flex gap-4 pb-2">
              {/* rail */}
              <div className="flex flex-col items-center" aria-hidden="true">
                <Link
                  to={m.path}
                  tabIndex={-1}
                  className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: complete ? 'var(--green)' : 'var(--accent)',
                    background: complete ? 'var(--green-dim)' : 'var(--accent-dim)',
                    color: complete ? 'var(--green)' : 'var(--accent)',
                  }}
                >
                  <ModuleIcon name={m.icon} size={20} />
                </Link>
                {!isLast && (
                  <div
                    className="w-0.5 flex-1 min-h-[28px]"
                    style={{ background: 'var(--border-strong)' }}
                  />
                )}
              </div>
              <div className={isLast ? 'pb-6' : 'pb-8'}>
                <Link to={m.path} className="group">
                  <p className="text-xs font-bold text-[var(--faint)]">
                    {String(m.order).padStart(2, '0')}
                    {complete && (
                      <span className="ml-2 text-[var(--green)]">✓ {t(STRINGS.done)}</span>
                    )}
                  </p>
                  <h2 className="font-bold text-[var(--text-strong)] group-hover:text-[var(--accent)] transition-colors">
                    {t(m.title)}
                  </h2>
                  <p className="text-sm text-[var(--muted)]">{t(m.blurb)}</p>
                  <span className="inline-block mt-1.5">
                    <DifficultyBadge level={m.difficulty} />
                  </span>
                </Link>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
