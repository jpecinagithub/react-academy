export default {
  id: 'render-profiler',
  moduleId: 'tools',
  title: { en: 'React Render Profiler', es: 'Profiler de renders de React' },
  intro: {
    en: 'Record a session, click around the demo store, then stop: see which components render the most and learn how to cool them down.',
    es: 'Graba una sesión, interactúa con la tienda de demo y detén la grabación: descubre qué componentes se renderizan más y cómo enfriarlos.',
  },
  difficulty: 'intermediate',
  order: 2,
  load: () => import('./Lab.jsx'),
}
