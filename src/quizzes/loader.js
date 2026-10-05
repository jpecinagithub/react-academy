// Quiz registry — auto-discovers every quizzes/*/quiz.js (except _-prefixed
// template dirs). Quiz id === moduleId it belongs to.
const modules = import.meta.glob('./*/quiz.js', { eager: true })

export const QUIZZES = Object.entries(modules)
  .filter(([path]) => !path.split('/')[1].startsWith('_'))
  .map(([path, mod]) => {
    const quiz = mod.default
    if (!quiz?.id || !Array.isArray(quiz.questions)) {
      console.warn('[quizzes] invalid quiz at', path)
      return null
    }
    return { ...quiz, __path: path }
  })
  .filter(Boolean)

export function getQuiz(moduleId) {
  return QUIZZES.find((q) => q.id === moduleId)
}
