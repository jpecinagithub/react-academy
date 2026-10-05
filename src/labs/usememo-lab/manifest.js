export default {
  id: 'usememo-lab',
  moduleId: 'hooks',
  title: { en: 'useMemo LAB', es: 'LAB de useMemo' },
  intro: {
    en: 'A simulated expensive computation, side by side: WITHOUT vs WITH useMemo. Press re-render and watch who recomputes.',
    es: 'Un cálculo simulado costoso, lado a lado: SIN vs CON useMemo. Pulsa re-render y observa quién recalcula.',
  },
  difficulty: 'intermediate',
  order: 2,
  load: () => import('./Lab.jsx'),
}
