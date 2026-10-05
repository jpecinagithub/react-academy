import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Printer } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore, selectOverallProgress } from '../state/store.js'
import { LABS } from '../labs/loader.js'
import { LESSONS } from '../lessons/loader.js'
import { QUIZZES } from '../quizzes/loader.js'
import { PageHeader } from '../components/ui.jsx'
import { ProgressRing } from '../components/ui.jsx'

const THRESHOLD = 60
const AUTHOR = 'Jon Peciña Iturbe'

const STRINGS = {
  subtitle: {
    en: `Finish ${THRESHOLD}% of the academy to unlock your certificate. Generated locally — no backend.`,
    es: `Completa el ${THRESHOLD}% de la academia para desbloquear tu certificado. Generado en local, sin backend.`,
  },
  locked: {
    en: 'Keep going — complete more lessons, labs and quizzes to unlock your certificate.',
    es: 'Sigue así: completa más lecciones, laboratorios y cuestionarios para desbloquear tu certificado.',
  },
  nameLabel: { en: 'Your name', es: 'Tu nombre' },
  namePlaceholder: { en: 'e.g. Ada Lovelace', es: 'p. ej. Ada Lovelace' },
  certTitle: { en: 'Certificate of Completion', es: 'Certificado de finalización' },
  certLine1: {
    en: 'This certifies that',
    es: 'Certifica que',
  },
  certLine2: {
    en: 'has completed the React Fundamentals Academy curriculum with a score of',
    es: 'ha completado el plan de estudios de React Fundamentals Academy con una puntuación de',
  },
  academyName: { en: 'React Fundamentals Academy', es: 'React Fundamentals Academy' },
  dateLabel: { en: 'Date', es: 'Fecha' },
  scoreLabel: { en: 'Score', es: 'Puntuación' },
  viewDashboard: { en: 'View my progress', es: 'Ver mi progreso' },
}

export default function Certificate() {
  const { t, lang } = useLang()
  const progress = useStore((s) => s.progress)
  const [name, setName] = useState('')

  const totals = {
    lessons: LESSONS.length,
    labs: LABS.length,
    challenges: 0,
    quizzes: QUIZZES.length,
    sandboxes: 0,
  }
  const score = selectOverallProgress(progress, totals)
  const unlocked = score >= THRESHOLD
  const today = new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title={t('nav.certificate')} subtitle={t(STRINGS.subtitle)} icon={Award} />

      <div className="card p-6 mb-6 flex items-center gap-5">
        <ProgressRing value={score} size={84} />
        <div>
          <p className="font-bold text-[var(--text-strong)] text-lg">{score}%</p>
          <p className="text-sm text-[var(--muted)]">
            {unlocked ? t(STRINGS.certTitle) : t(STRINGS.locked)}
          </p>
          {!unlocked && (
            <Link to="/dashboard" className="btn mt-3">
              {t(STRINGS.viewDashboard)}
            </Link>
          )}
        </div>
      </div>

      {unlocked && (
        <>
          <div className="card p-5 mb-6 no-print">
            <label htmlFor="cert-name" className="block text-sm font-semibold mb-2">
              {t(STRINGS.nameLabel)}
            </label>
            <input
              id="cert-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(STRINGS.namePlaceholder)}
              maxLength={60}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]"
            />
          </div>

          {/* Printable certificate */}
          <div className="print-sheet card p-10 md:p-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-3 border-2 rounded-xl pointer-events-none"
              style={{ borderColor: 'var(--accent)' }}
              aria-hidden="true"
            />
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--faint)] mb-4">
              {t(STRINGS.academyName)}
            </p>
            <Award size={48} className="mx-auto mb-4 text-[var(--accent)]" aria-hidden="true" />
            <h2 className="text-3xl font-bold text-[var(--text-strong)] mb-6">
              {t(STRINGS.certTitle)}
            </h2>
            <p className="text-[var(--muted)]">{t(STRINGS.certLine1)}</p>
            <p className="text-2xl font-bold text-[var(--text-strong)] my-3 underline underline-offset-8 decoration-[var(--accent)]">
              {name.trim() || '—'}
            </p>
            <p className="text-[var(--muted)] max-w-md mx-auto">
              {t(STRINGS.certLine2)} <strong className="text-[var(--text-strong)]">{score}%</strong>.
            </p>
            <div className="flex justify-center gap-10 mt-8 text-sm">
              <div>
                <p className="text-[var(--faint)]">{t(STRINGS.dateLabel)}</p>
                <p className="font-semibold text-[var(--text-strong)]">{today}</p>
              </div>
              <div>
                <p className="text-[var(--faint)]">{t(STRINGS.scoreLabel)}</p>
                <p className="font-semibold text-[var(--text-strong)]">{score}%</p>
              </div>
            </div>
            <p className="mt-8 text-sm text-[var(--faint)]">{AUTHOR}</p>
          </div>

          <div className="text-center mt-6 no-print">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={15} />
              {t('common.print')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
