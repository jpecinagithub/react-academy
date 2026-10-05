// Event Flow Simulator — see docs/CONTRACTS.md §1
export default {
  id: 'event-flow',
  moduleId: 'events',
  title: { en: 'Event Flow Simulator', es: 'Simulador de flujo de eventos' },
  intro: {
    en: 'Fire click, change, submit and keyboard events — and watch each one travel from the user to setState to render.',
    es: 'Dispara eventos de clic, cambio, envío y teclado, y observa cómo cada uno viaja del usuario a setState y al render.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
