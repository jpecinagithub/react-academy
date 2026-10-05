export default {
  id: 'immutability-lab',
  moduleId: 'internals',
  title: { en: 'Immutability Lab', es: 'Laboratorio de inmutabilidad' },
  intro: {
    en: 'Mutate an object and React shrugs. Replace it and React renders. See why object identity decides everything.',
    es: 'Muta un objeto y a React le da igual. Reemplázalo y React renderiza. Descubre por qué la identidad del objeto lo decide todo.',
  },
  difficulty: 'intermediate',
  order: 5,
  load: () => import('./Lab.jsx'),
}
