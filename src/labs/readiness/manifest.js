export default {
  id: 'readiness-check',
  moduleId: 'before-react',
  title: { en: 'Are you ready for React?', es: '¿Estás listo para React?' },
  intro: {
    en: 'A hands-on check of the JavaScript you need: run each snippet, then take the quiz.',
    es: 'Un chequeo práctico del JavaScript que necesitas: ejecuta cada fragmento y haz el quiz.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
