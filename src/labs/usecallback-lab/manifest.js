export default {
  id: 'usecallback-lab',
  moduleId: 'hooks',
  title: { en: 'useCallback LAB', es: 'LAB de useCallback' },
  intro: {
    en: 'Every render creates a brand-new function. Watch a memoized child re-render because of it — then stabilize the reference with useCallback.',
    es: 'Cada render crea una función nueva. Observa cómo un hijo memoizado re-renderiza por ello, y luego estabiliza la referencia con useCallback.',
  },
  difficulty: 'intermediate',
  order: 3,
  load: () => import('./Lab.jsx'),
}
