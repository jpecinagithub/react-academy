// Props Lab — see docs/CONTRACTS.md §1
export default {
  id: 'props-lab',
  moduleId: 'props',
  title: { en: 'Props Lab', es: 'Laboratorio de props' },
  intro: {
    en: 'Edit props live, watch the child update, then break it on purpose to see what happens.',
    es: 'Edita props en vivo, observa cómo se actualiza el hijo y luego rómpelo a propósito para ver qué ocurre.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
