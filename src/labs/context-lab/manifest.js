export default {
  id: 'context-lab',
  moduleId: 'context',
  title: { en: 'Prop Drilling Visualizer', es: 'Visualizador de prop drilling' },
  intro: {
    en: 'Watch the `user` prop travel down through every component — then flip the switch and let Context deliver it directly to Avatar.',
    es: 'Observa la prop `user` viajar por cada componente, y luego activa el interruptor para que Context la entregue directamente a Avatar.',
  },
  difficulty: 'intermediate',
  order: 1,
  load: () => import('./Lab.jsx'),
}
