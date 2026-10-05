export default {
  id: 'vanilla-vs-react',
  moduleId: 'why-react',
  title: { en: 'Vanilla JS vs React', es: 'JavaScript puro vs React' },
  intro: {
    en: 'Do the same task twice: update the DOM by hand (imperative), then describe the state and let React do it (declarative).',
    es: 'Haz la misma tarea dos veces: actualiza el DOM a mano (imperativo) y luego describe el estado dejando que React lo haga (declarativo).',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
