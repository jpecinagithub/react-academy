export default {
  id: 'cleanup-lab',
  moduleId: 'effects',
  title: { en: 'Effect Cleanup Lab', es: 'Laboratorio de limpieza de efectos' },
  intro: {
    en: 'Mount and unmount components with and without cleanup, and watch leaked intervals and listeners pile up in real time.',
    es: 'Monta y desmonta componentes con y sin limpieza, y observa cómo se acumulan intervalos y listeners olvidados en tiempo real.',
  },
  difficulty: 'intermediate',
  order: 2,
  load: () => import('./Lab.jsx'),
}
