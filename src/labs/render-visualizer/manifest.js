// Render Visualizer — see docs/CONTRACTS.md §1
export default {
  id: 'render-visualizer',
  moduleId: 'rendering',
  title: { en: 'Render Visualizer', es: 'Visualizador de renders' },
  intro: {
    en: 'Press +1 and watch exactly which components React calls again — then memoize and watch the difference.',
    es: 'Pulsa +1 y observa exactamente qué componentes vuelve a llamar React; luego memoiza y mira la diferencia.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
