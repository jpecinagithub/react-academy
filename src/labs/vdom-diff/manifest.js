export default {
  id: 'vdom-diff',
  moduleId: 'internals',
  title: { en: 'Virtual DOM Diff Visualizer', es: 'Visualizador del diff del DOM virtual' },
  intro: {
    en: 'Edit two UI descriptions, run the diff, and watch React touch only the node that changed.',
    es: 'Edita dos descripciones de la UI, ejecuta el diff y observa cómo React toca solo el nodo que cambió.',
  },
  difficulty: 'intermediate',
  order: 1,
  load: () => import('./Lab.jsx'),
}
