import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { getModule } from '../data/modules.js'
import { getQuiz } from '../quizzes/loader.js'
import { PageHeader, Quiz, Callout } from '../components/ui.jsx'

export default function QuizPage() {
  const { moduleId } = useParams()
  const { t, lang } = useLang()
  const module = getModule(moduleId)
  const quiz = getQuiz(moduleId)

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={module ? module.path : '/modules'} className="btn !py-1.5 !px-3 !text-sm mb-6 no-print">
        <ArrowLeft size={14} />
        {module ? t(module.title) : t('nav.modules')}
      </Link>
      <PageHeader
        title={quiz ? t(quiz.title) : t('nav.challenges')}
        subtitle={
          module
            ? t(module.title)
            : lang === 'es'
              ? 'Cuestionario'
              : 'Quiz'
        }
        icon={HelpCircle}
      />
      {quiz ? (
        <Quiz questions={quiz.questions} quizId={quiz.id} />
      ) : (
        <Callout type="info" title={t('common.comingSoon')}>
          {lang === 'es'
            ? 'Este cuestionario llegará en la fase de contenidos.'
            : 'This quiz arrives in the content phase.'}
        </Callout>
      )}
    </div>
  )
}
