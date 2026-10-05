export default {
  id: 'devtools-sim',
  moduleId: 'tools',
  title: { en: 'React DevTools Concept Simulator', es: 'Simulador conceptual de React DevTools' },
  intro: {
    en: 'Our own educational replica of the Components panel: click the tree, inspect props and state, and watch them change as you use the demo app.',
    es: 'Nuestra réplica educativa del panel de Componentes: pulsa el árbol, inspecciona props y estado, y míralos cambiar mientras usas la app de demo.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
