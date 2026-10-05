export default {
  id: 'list-keys-lab',
  moduleId: 'conditional-lists',
  title: { en: 'List Reconciliation Lab', es: 'Laboratorio de reconciliación de listas' },
  intro: {
    en: 'Shuffle a list of stateful items with and without keys — and watch identity follow the key, not the position.',
    es: 'Reordena una lista de elementos con estado, con y sin keys, y observa cómo la identidad sigue a la key, no a la posición.',
  },
  difficulty: 'beginner',
  order: 2,
  load: () => import('./Lab.jsx'),
}
