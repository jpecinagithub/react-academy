export default {
  id: 'effect-lab',
  moduleId: 'effects',
  title: { en: 'Effect Lab', es: 'Laboratorio de efectos' },
  intro: {
    en: 'Choose a dependency array and watch exactly when the effect runs — plus timers, fetch, listeners and the guarded infinite-loop demo.',
    es: 'Elige un array de dependencias y observa exactamente cuándo se ejecuta el efecto, con temporizadores, fetch, listeners y la demo del bucle infinito (controlada).',
  },
  difficulty: 'intermediate',
  order: 1,
  load: () => import('./Lab.jsx'),
}
