export default {
  id: 'batching-lab',
  moduleId: 'internals',
  title: { en: 'State Batching Lab', es: 'Laboratorio de batching de estado' },
  intro: {
    en: 'Three setCount calls in a row — what will count be? Predict, run, and step through the update queue.',
    es: 'Tres llamadas a setCount seguidas: ¿cuánto valdrá count? Predice, ejecuta y recorre la cola de actualizaciones.',
  },
  difficulty: 'intermediate',
  order: 3,
  load: () => import('./Lab.jsx'),
}
