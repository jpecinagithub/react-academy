import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FlaskConical, HelpCircle } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { getModule } from '../data/modules.js'
import { getLabsByModule } from '../labs/loader.js'
import { getLessonsByModule } from '../lessons/loader.js'
import LessonRenderer from '../lessons/renderer.jsx'
import { getQuiz } from '../quizzes/loader.js'
import { PageHeader, DifficultyBadge, Callout } from '../components/ui.jsx'
import { ModuleIcon } from '../utils/icons.jsx'
import { track } from '../utils/analytics.js'

export default function ModulePage() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const module = getModule(id)

  if (!module) {
    return (
      <Callout type="danger" title="404">
        {lang === 'es' ? 'Módulo no encontrado.' : 'Module not found.'}
      </Callout>
    )
  }

  const labs = getLabsByModule(id)
  const lessons = getLessonsByModule(id)
  const quiz = getQuiz(id)

  return (
    <div>
      <Link to="/modules" className="btn !py-1.5 !px-3 !text-sm mb-6 no-print">
        <ArrowLeft size={14} />
        {t('nav.modules')}
      </Link>

      <PageHeader
        title={t(module.title)}
        subtitle={t(module.blurb)}
        icon={({ size }) => <ModuleIcon name={module.icon} size={size || 26} />}
        actions={<DifficultyBadge level={module.difficulty} />}
      />

      {/* Lessons */}
      {lessons.length > 0 ? (
        <div>
          {lessons.map((lesson) => (
            <LessonRenderer key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <Callout type="info" title={t('common.comingSoon')}>
          {lang === 'es'
            ? 'Las lecciones de este módulo llegarán en la fase de contenidos.'
            : 'This module’s lessons arrive in the content phase.'}
        </Callout>
      )}

      {/* Labs */}
      {labs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[var(--text-strong)] mb-4">
            <FlaskConical size={18} className="inline mr-2 -mt-1" aria-hidden="true" />
            {lang === 'es' ? 'Laboratorios' : 'Labs'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {labs.map((lab) => (
              <Link
                key={lab.id}
                to={`/lab/${lab.id}`}
                className="card p-5 hover:border-[var(--accent)] transition-colors"
                onClick={() => track('lab_open', { labId: lab.id })}
              >
                <DifficultyBadge level={lab.difficulty} />
                <h3 className="font-bold text-[var(--text-strong)] mt-2">{t(lab.title)}</h3>
                <p className="text-sm text-[var(--muted)] mt-1">{t(lab.intro)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quiz */}
      <section className="mt-10">
        {quiz ? (
          <Link to={`/quiz/${id}`} className="card p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors" style={{ display: 'flex' }}>
            <span className="p-2.5 rounded-lg bg-[var(--violet-dim)] text-[var(--violet)]" aria-hidden="true">
              <HelpCircle size={20} />
            </span>
            <span>
              <span className="block font-bold text-[var(--text-strong)]">{t(quiz.title)}</span>
              <span className="block text-sm text-[var(--muted)]">
                {quiz.questions.length} {lang === 'es' ? 'preguntas' : 'questions'}
              </span>
            </span>
          </Link>
        ) : (
          <div className="text-sm text-[var(--faint)]">
            {lang === 'es'
              ? 'El cuestionario de este módulo llegará en la fase de contenidos.'
              : 'This module’s quiz arrives in the content phase.'}
          </div>
        )}
      </section>
    </div>
  )
}
