import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Single persisted store: rfa-store-v1 (localStorage).
// progress:
//   lessons:    { [lessonId]: true }
//   labs:       { [labId]: timestamp }
//   challenges: { [challengeId]: true }
//   quizzes:    { [moduleId]: { score, total, at } }
//   sandboxes:  { [sandboxId]: true }
const initialState = {
  lang: 'en',
  theme: 'dark', // 'dark' | 'light'
  tooltipMode: false,
  progress: {
    lessons: {},
    labs: {},
    challenges: {},
    quizzes: {},
    sandboxes: {},
  },
}

export const useStore = create(
  persist(
    (set, _get) => ({
      ...initialState,

      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTooltipMode: (on) => set({ tooltipMode: !!on }),

      completeLesson: (lessonId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            lessons: { ...s.progress.lessons, [lessonId]: true },
          },
        })),

      visitLab: (labId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            labs: { ...s.progress.labs, [labId]: Date.now() },
          },
        })),

      completeChallenge: (challengeId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            challenges: { ...s.progress.challenges, [challengeId]: true },
          },
        })),

      recordQuiz: (moduleId, score, total) =>
        set((s) => {
          const prev = s.progress.quizzes[moduleId]
          const best = !prev || score > prev.score ? { score, total, at: Date.now() } : prev
          return {
            progress: {
              ...s.progress,
              quizzes: { ...s.progress.quizzes, [moduleId]: best },
            },
          }
        }),

      visitSandbox: (sandboxId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            sandboxes: { ...s.progress.sandboxes, [sandboxId]: true },
          },
        })),

      // Phase 8: explicit "mark explored" action (same progress bucket as
      // visitSandbox, kept separate for semantic clarity).
      exploreSandbox: (sandboxId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            sandboxes: { ...s.progress.sandboxes, [sandboxId]: true },
          },
        })),

      resetProgress: () =>
        set({
          progress: {
            lessons: {},
            labs: {},
            challenges: {},
            quizzes: {},
            sandboxes: {},
          },
        }),
    }),
    {
      name: 'rfa-store-v1',
      // Persist everything except nothing; actions are not serialized by zustand.
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        tooltipMode: s.tooltipMode,
        progress: s.progress,
      }),
    },
  ),
)

// Selectors used by dashboards (kept here so every phase computes identically).
export function selectOverallProgress(progress, totals) {
  const done =
    Object.keys(progress.lessons).length +
    Object.keys(progress.labs).length +
    Object.keys(progress.challenges).length +
    Object.keys(progress.quizzes).length +
    Object.keys(progress.sandboxes).length
  const total =
    totals.lessons + totals.labs + totals.challenges + totals.quizzes + totals.sandboxes
  return total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100))
}

// Theme side-effect helper (called from Layout).
export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0b0e11' : '#f7f9fc')
}
