import { Link } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../state/store.js'
import { MODULES } from '../data/modules.js'
import { getLabsByModule } from '../labs/loader.js'
import { getLessonsByModule } from '../lessons/loader.js'
import { PageHeader, DifficultyBadge, ProgressRing } from '../components/ui.jsx'
import { ModuleIcon } from '../utils/icons.jsx'

export default function Modules() {
  const { t } = useLang()
  const progress = useStore((s) => s.progress)

  return (
    <div>
      <PageHeader
        title={t('nav.modules')}
        subtitle={t('home.modulesSub')}
        icon={LayoutGrid}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m) => {
          const labs = getLabsByModule(m.id)
          const lessons = getLessonsByModule(m.id)
          const done =
            labs.filter((l) => progress.labs[l.id]).length +
            lessons.filter((l) => progress.lessons[l.id]).length
          const total = labs.length + lessons.length
          const pct = total === 0 ? 0 : Math.round((done / total) * 100)
          return (
            <Link
              key={m.id}
              to={m.path}
              className="card p-5 hover:border-[var(--accent)] transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="p-2.5 rounded-lg bg-[var(--accent-dim)] text-[var(--accent)] group-hover:scale-105 transition-transform">
                  <ModuleIcon name={m.icon} />
                </span>
                {total > 0 && <ProgressRing value={pct} size={40} />}
              </div>
              <p className="text-xs font-bold text-[var(--faint)] mt-3">
                {String(m.order).padStart(2, '0')}
              </p>
              <h2 className="font-bold text-[var(--text-strong)] group-hover:text-[var(--accent)] transition-colors">
                {t(m.title)}
              </h2>
              <p className="text-sm text-[var(--muted)] mt-1 mb-3">{t(m.blurb)}</p>
              <div className="flex items-center gap-2">
                <DifficultyBadge level={m.difficulty} />
                <span className="text-xs text-[var(--faint)]">
                  {lessons.length}L · {labs.length} labs
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
