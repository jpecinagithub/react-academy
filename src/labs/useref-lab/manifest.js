export default {
  id: 'useref-lab',
  moduleId: 'hooks',
  title: { en: 'useRef Lab', es: 'Laboratorio useRef' },
  intro: {
    en: 'A ref is a box that survives renders without causing them. Change state vs change a ref, side by side, and feel the difference.',
    es: 'Un ref es una caja que sobrevive a los renders sin provocarlos. Cambia el estado frente a cambiar un ref, lado a lado, y siente la diferencia.',
  },
  difficulty: 'intermediate',
  order: 1,
  load: () => import('./Lab.jsx'),
}
