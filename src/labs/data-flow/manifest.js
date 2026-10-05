export default {
  id: 'data-flow',
  moduleId: 'thinking',
  title: { en: 'Data Flow Visualizer', es: 'Visualizador de flujo de datos' },
  intro: {
    en: 'Watch props flow down the tree and events bubble back up. Change the filter, buy a product, and follow the dots.',
    es: 'Observa las props bajar por el árbol y los eventos subir de vuelta. Cambia el filtro, compra un producto y sigue los puntos.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
