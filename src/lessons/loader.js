// Lesson registry — auto-discovers every lessons/*/lesson.js (except
// _-prefixed template dirs).
const modules = import.meta.glob('./*/lesson.js', { eager: true })

export const LESSONS = Object.entries(modules)
  .filter(([path]) => !path.split('/')[1].startsWith('_'))
  .map(([path, mod]) => {
    const lesson = mod.default
    if (!lesson?.id || !lesson?.moduleId || !Array.isArray(lesson.sections)) {
      console.warn('[lessons] invalid lesson at', path)
      return null
    }
    return { ...lesson, __path: path }
  })
  .filter(Boolean)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

export function getLessonsByModule(moduleId) {
  return LESSONS.filter((l) => l.moduleId === moduleId)
}
