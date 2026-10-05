export default {
  id: 'component-builder',
  moduleId: 'components',
  title: { en: 'Component Builder', es: 'Constructor de componentes' },
  intro: {
    en: 'Assemble a page from small pieces and watch the component tree grow as you build.',
    es: 'Monta una página con piezas pequeñas y observa cómo crece el árbol de componentes.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
