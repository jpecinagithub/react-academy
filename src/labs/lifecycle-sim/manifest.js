export default {
  id: 'lifecycle-sim',
  moduleId: 'data',
  title: { en: 'Component Lifecycle Simulator', es: 'Simulador de ciclo de vida' },
  intro: {
    en: 'Mount, update and unmount a component yourself, and watch its lifecycle — mount → render → effect → cleanup → unmount — light up on a timeline.',
    es: 'Monta, actualiza y desmonta un componente tú mismo, y observa su ciclo de vida — montaje → render → efecto → limpieza → desmontaje — iluminarse en una línea de tiempo.',
  },
  difficulty: 'beginner',
  order: 2,
  load: () => import('./Lab.jsx'),
}
