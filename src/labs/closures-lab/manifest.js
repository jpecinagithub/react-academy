export default {
  id: 'closures-lab',
  moduleId: 'internals',
  title: { en: 'Closures + React', es: 'Closures + React' },
  intro: {
    en: 'The stale-closure trap: a timer captures an old count while the world moves on. See it, then fix it twice.',
    es: 'La trampa del closure obsoleto: un temporizador captura un count antiguo mientras el mundo avanza. Mírala y corrígela de dos formas.',
  },
  difficulty: 'advanced',
  order: 4,
  load: () => import('./Lab.jsx'),
}
