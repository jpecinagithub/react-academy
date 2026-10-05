import { lazy, Suspense, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useLang } from '../i18n/index.jsx'
import { getLab } from '../labs/loader.js'
import { Callout } from '../components/ui.jsx'
import { track } from '../utils/analytics.js'

// Loads the lab's manifest load() lazily — heavy deps (editors, runners,
// charts) only download when a lab actually opens.
export default function LabPage() {
  const { labId } = useParams()
  const { t } = useLang()
  const lab = getLab(labId)

  const LabComponent = useMemo(() => {
    if (!lab) return null
    track('lab_open', { labId })
    return lazy(lab.load)
  }, [lab, labId])

  if (!lab) {
    return (
      <Callout type="danger" title="404">
        {t({ en: 'Lab not found.', es: 'Laboratorio no encontrado.' })}
      </Callout>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24 text-[var(--muted)]">
          {t('common.loading')}
        </div>
      }
    >
      <LabComponent />
    </Suspense>
  )
}
