export default {
  id: 'components',
  title: { en: 'Components quiz', es: 'Quiz de componentes' },
  questions: [
    {
      q: {
        en: 'A page shows the same product card 12 times with different data. What is the React way?',
        es: 'Una página muestra la misma tarjeta de producto 12 veces con datos distintos. ¿Cuál es la forma React?',
      },
      options: [
        { en: 'Copy-paste the card markup 12 times', es: 'Copiar y pegar el markup de la tarjeta 12 veces' },
        { en: 'Build one ProductCard component and render it 12 times with different props', es: 'Crear un componente ProductCard y renderizarlo 12 veces con distintas props' },
        { en: 'Write 12 separate components', es: 'Escribir 12 componentes separados' },
        { en: 'Generate the HTML on the server', es: 'Generar el HTML en el servidor' },
      ],
      answer: 1,
      explain: {
        en: 'Composition beats duplication: one component, many instances, each driven by its props.',
        es: 'La composición vence a la duplicación: un componente, muchas instancias, cada una guiada por sus props.',
      },
    },
    {
      q: {
        en: 'What does "thinking in a component tree" mean?',
        es: '¿Qué significa "pensar en un árbol de componentes"?',
      },
      options: [
        { en: 'Nesting HTML tags deeply', es: 'Anidar etiquetas HTML profundamente' },
        { en: 'Breaking the UI into nested, independent pieces where parents render children', es: 'Dividir la UI en piezas anidadas e independientes donde los padres renderizan hijos' },
        { en: 'Drawing the UI on paper first', es: 'Dibujar la UI en papel primero' },
        { en: 'Using only one component per file', es: 'Usar un solo componente por archivo' },
      ],
      answer: 1,
      explain: {
        en: 'UIs are trees: App renders Header and Main, Main renders cards, and so on. Each node owns its piece.',
        es: 'Las UIs son árboles: App renderiza Header y Main, Main renderiza tarjetas, etc. Cada nodo posee su parte.',
      },
    },
    {
      q: {
        en: 'Which is a sign of a GOOD component boundary?',
        es: '¿Cuál es una señal de un BUEN límite de componente?',
      },
      options: [
        { en: 'It mixes layout, data fetching, and business rules all together', es: 'Mezcla layout, fetching de datos y reglas de negocio todo junto' },
        { en: 'It has one clear responsibility and a simple props interface', es: 'Tiene una responsabilidad clara y una interfaz de props simple' },
        { en: 'It is as large as possible to reduce file count', es: 'Es lo más grande posible para reducir el número de archivos' },
        { en: 'It reaches into its parent to change state', es: 'Accede a su padre para cambiar el estado' },
      ],
      answer: 1,
      explain: {
        en: 'Good boundaries: single responsibility, clear props in, UI out. Easy to reuse, test, and reason about.',
        es: 'Buenos límites: una sola responsabilidad, props claras de entrada, UI de salida. Fácil de reutilizar, probar y razonar.',
      },
    },
    {
      q: {
        en: 'A SearchBar needs to show results that live in its parent. Where should the search state live?',
        es: 'Un SearchBar necesita mostrar resultados que viven en su padre. ¿Dónde debería vivir el estado de búsqueda?',
      },
      options: [
        { en: 'Inside SearchBar only', es: 'Solo dentro de SearchBar' },
        { en: 'In the parent, passed down to both SearchBar and the results list', es: 'En el padre, pasado a SearchBar y a la lista de resultados' },
        { en: 'In a global variable', es: 'En una variable global' },
        { en: 'Duplicated in both components', es: 'Duplicado en ambos componentes' },
      ],
      answer: 1,
      explain: {
        en: 'Lift state up to the closest common parent so every component that needs it reads the same source of truth.',
        es: 'Eleva el estado al padre común más cercano para que cada componente que lo necesite lea la misma fuente de verdad.',
      },
    },
    {
      q: {
        en: 'Predict: you render <Avatar /> three times on a page. How many independent component instances exist?',
        es: 'Predice: renderizas <Avatar /> tres veces en una página. ¿Cuántas instancias independientes del componente existen?',
      },
      options: [
        { en: 'One shared instance', es: 'Una instancia compartida' },
        { en: 'Three independent instances, each with its own state', es: 'Tres instancias independientes, cada una con su propio estado' },
        { en: 'Zero — JSX is just HTML', es: 'Cero: JSX es solo HTML' },
        { en: 'It depends on the browser', es: 'Depende del navegador' },
      ],
      answer: 1,
      explain: {
        en: 'Each usage is a separate instance with its own state and lifecycle. That is what makes components reusable.',
        es: 'Cada uso es una instancia separada con su propio estado y ciclo de vida. Eso es lo que hace reutilizables a los componentes.',
      },
    },
  ],
}
