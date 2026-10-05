// State Machine Lab — see docs/CONTRACTS.md §1
export default {
  id: 'state-lab',
  moduleId: 'state',
  title: { en: 'State Machine Lab', es: 'Laboratorio de estado' },
  intro: {
    en: 'Dissect useState, then press +1 and watch the event → setState → render → UI machine light up.',
    es: 'Disecciona useState, pulsa +1 y observa cómo se ilumina la máquina evento → setState → render → UI.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
