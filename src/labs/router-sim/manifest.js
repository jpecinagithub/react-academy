export default {
  id: 'router-sim',
  moduleId: 'patterns',
  title: { en: 'React Router Simulator', es: 'Simulador de React Router' },
  intro: {
    en: 'Type a URL and watch the Router match a Route and render its component — no page reload. This is the heart of a Single Page Application.',
    es: 'Escribe una URL y mira cómo el Router encuentra su Route y renderiza el componente, sin recargar la página. Así funciona una SPA.',
  },
  difficulty: 'beginner',
  order: 2,
  load: () => import('./Lab.jsx'),
}
