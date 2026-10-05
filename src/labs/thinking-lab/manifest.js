export default {
  id: 'thinking-lab',
  moduleId: 'thinking',
  title: { en: 'Thinking in React', es: 'Pensar en React' },
  intro: {
    en: 'Three mini-games: follow the 5-step design flow, decide where state should live, and draw component boundaries on a dashboard.',
    es: 'Tres minijuegos: sigue el flujo de diseño en 5 pasos, decide dónde debe vivir el estado y dibuja límites de componentes en un dashboard.',
  },
  difficulty: 'beginner',
  order: 2,
  load: () => import('./Lab.jsx'),
}
