import { Link } from 'react-router-dom'
import { FlaskConical, HelpCircle, Check } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../state/store.js'
import { getLab } from '../labs/loader.js'
import { CodeBlock, Callout, FlowSteps } from '../components/ui.jsx'
import { Markdown } from '../utils/markdown.jsx'

// Renders a lesson data object (see lessons/_template/lesson.js).
// Section kinds: text | code | callout | flow | checklist | labref | quizref
export default function LessonRenderer({ lesson }) {
  const { t, lang } = useLang()
  const completeLesson = useStore((s) => s.completeLesson)
  const done = useStore((s) => !!s.progress.lessons[lesson.id])

  return (
    <article className="card p-5 md:p-8 mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-strong)]">{t(lesson.title)}</h2>
        <button
          type="button"
          className={done ? 'btn' : 'btn btn-primary'}
          onClick={() => completeLesson(lesson.id)}
          disabled={done}
        >
          <Check size={15} />
          {done
            ? t('common.completed')
            : lang === 'es'
              ? 'Marcar lección como completada'
              : 'Mark lesson complete'}
        </button>
      </div>

      {lesson.sections.map((section, i) => (
        <LessonSection key={i} section={section} />
      ))}
    </article>
  )
}

function LessonSection({ section }) {
  const { t, lang } = useLang()
  switch (section.kind) {
    case 'text':
      return <Markdown text={t(section.body)} />
    case 'code':
      return <CodeBlock code={section.code} lang={section.lang || 'jsx'} />
    case 'callout':
      return (
        <Callout type={section.type || 'info'}>
          <Markdown text={t(section.text)} />
        </Callout>
      )
    case 'flow':
      return <FlowSteps steps={section.steps} />
    case 'checklist':
      return (
        <ul className="my-4 space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check size={16} className="text-[var(--green)] mt-1 shrink-0" aria-hidden="true" />
              <span>{t(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'labref': {
      const lab = getLab(section.labId)
      if (!lab) return null
      return (
        <Link
          to={`/lab/${lab.id}`}
          className="card p-5 my-4 flex items-center gap-4 hover:border-[var(--accent)] transition-colors no-underline"
          style={{ display: 'flex' }}
        >
          <span className="p-2.5 rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]" aria-hidden="true">
            <FlaskConical size={20} />
          </span>
          <span>
            <span className="block font-bold text-[var(--text-strong)]">{t(lab.title)}</span>
            <span className="block text-sm text-[var(--muted)]">{t(lab.intro)}</span>
          </span>
        </Link>
      )
    }
    case 'quizref':
      return (
        <Link
          to={`/quiz/${section.quizId}`}
          className="card p-5 my-4 flex items-center gap-4 hover:border-[var(--accent)] transition-colors"
          style={{ display: 'flex' }}
        >
          <span className="p-2.5 rounded-lg bg-[var(--violet-dim)] text-[var(--violet)]" aria-hidden="true">
            <HelpCircle size={20} />
          </span>
          <span>
            <span className="block font-bold text-[var(--text-strong)]">
              {lang === 'es' ? 'Cuestionario del módulo' : 'Module quiz'}
            </span>
            <span className="block text-sm text-[var(--muted)]">
              {lang === 'es' ? 'Comprueba lo que has aprendido.' : 'Check what you learned.'}
            </span>
          </span>
        </Link>
      )
    default:
      return null
  }
}
