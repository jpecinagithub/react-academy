export default {
  id: 'fetch-lab',
  moduleId: 'data',
  title: { en: 'API Fetch Lab', es: 'Laboratorio de peticiones' },
  intro: {
    en: 'Simulate a real API call: control latency, force errors, and watch loading → success → error flow through a real useEffect.',
    es: 'Simula una llamada real a una API: controla la latencia, fuerza errores y observa el flujo cargando → éxito → error en un useEffect real.',
  },
  difficulty: 'intermediate',
  order: 1,
  load: () => import('./Lab.jsx'),
}
