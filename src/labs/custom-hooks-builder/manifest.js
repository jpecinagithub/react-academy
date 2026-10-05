export default {
  id: 'custom-hooks-builder',
  moduleId: 'patterns',
  title: { en: 'Custom Hook Builder', es: 'Constructor de custom hooks' },
  intro: {
    en: 'Pick features, watch the hook assemble itself, and see it run live. Custom hooks extract stateful logic — not UI.',
    es: 'Elige funcionalidades, mira cómo el hook se ensambla solo y velo funcionar en vivo. Los custom hooks extraen lógica con estado, no UI.',
  },
  difficulty: 'intermediate',
  order: 1,
  load: () => import('./Lab.jsx'),
}
