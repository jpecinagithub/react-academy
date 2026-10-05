export default {
  id: 'reconciliation-lab',
  moduleId: 'internals',
  title: { en: 'Reconciliation Lab', es: 'Laboratorio de reconciliación' },
  intro: {
    en: 'Change a tree and watch React decide: keep, update, move — or tear down and rebuild.',
    es: 'Cambia un árbol y observa la decisión de React: conservar, actualizar, mover… o demoler y reconstruir.',
  },
  difficulty: 'advanced',
  order: 2,
  load: () => import('./Lab.jsx'),
}
