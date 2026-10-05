export default {
  id: 'controlled-form-lab',
  moduleId: 'forms',
  title: { en: 'Controlled Input Lab', es: 'Laboratorio de inputs controlados' },
  intro: {
    en: 'Type in an input and watch every keystroke travel through onChange → setState → value. Controlled vs uncontrolled, side by side.',
    es: 'Escribe en un input y observa cada pulsación viajar por onChange → setState → value. Controlado frente a no controlado, cara a cara.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
