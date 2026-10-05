// Example lab: proves the SimulationShell + loader + LabPage contract works
// end-to-end. Later phases replace/extend with the ~30 real labs.
export default {
  id: 'hello-lab',
  moduleId: 'state',
  title: { en: 'Hello Lab: your first state', es: 'Hola Lab: tu primer estado' },
  intro: {
    en: 'Press the button and watch state → render → UI. This lab proves the lab contract works.',
    es: 'Pulsa el botón y observa estado → render → UI. Este lab demuestra que el contrato funciona.',
  },
  difficulty: 'beginner',
  order: 0,
  load: () => import('./Lab.jsx'),
}
