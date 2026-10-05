export default {
  id: 'conditional-lab',
  moduleId: 'conditional-lists',
  title: { en: 'Conditional Rendering Playground', es: 'Playground de renderizado condicional' },
  intro: {
    en: 'Flip real state toggles and watch React choose which branch of the component tree to render — live code included.',
    es: 'Activa interruptores de estado reales y observa cómo React elige qué rama del árbol de componentes renderizar, con código en vivo.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
