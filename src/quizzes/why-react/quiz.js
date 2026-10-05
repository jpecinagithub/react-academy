export default {
  id: 'why-react',
  title: { en: 'Why React quiz', es: 'Quiz de por qué React' },
  questions: [
    {
      q: {
        en: 'In the imperative approach you write `list.appendChild(li)` for every change. What does React\'s declarative approach do instead?',
        es: 'En el enfoque imperativo escribes `list.appendChild(li)` por cada cambio. ¿Qué hace en cambio el enfoque declarativo de React?',
      },
      options: [
        { en: 'You describe what the UI should look like for a given state; React updates the DOM for you', es: 'Describes cómo debe verse la UI para un estado dado; React actualiza el DOM por ti' },
        { en: 'You write the same appendChild calls but shorter', es: 'Escribes las mismas llamadas appendChild pero más cortas' },
        { en: 'React removes the need for JavaScript', es: 'React elimina la necesidad de JavaScript' },
        { en: 'You describe the DOM in CSS', es: 'Describes el DOM en CSS' },
      ],
      answer: 0,
      explain: {
        en: 'Declarative UI: you declare UI = f(state). When state changes, React figures out the minimal DOM updates.',
        es: 'UI declarativa: declaras UI = f(estado). Cuando el estado cambia, React calcula las actualizaciones mínimas del DOM.',
      },
    },
    {
      q: {
        en: 'What core problem does React solve as apps grow?',
        es: '¿Qué problema central resuelve React a medida que las apps crecen?',
      },
      options: [
        { en: 'Making pages load without a server', es: 'Hacer que las páginas carguen sin servidor' },
        { en: 'Keeping the UI consistent with changing data without manual, error-prone DOM syncing', es: 'Mantener la UI consistente con datos cambiantes sin sincronización manual y propensa a errores del DOM' },
        { en: 'Replacing CSS entirely', es: 'Reemplazar CSS por completo' },
        { en: 'Making JavaScript run faster than the browser', es: 'Hacer que JavaScript corra más rápido que el navegador' },
      ],
      answer: 1,
      explain: {
        en: 'Manually syncing DOM with data gets tangled fast. React owns that syncing so UI always reflects state.',
        es: 'Sincronizar el DOM con los datos a mano se enreda rápido. React se encarga de esa sincronización para que la UI siempre refleje el estado.',
      },
    },
    {
      q: {
        en: 'A component receives new state. What happens next?',
        es: 'Un componente recibe nuevo estado. ¿Qué ocurre después?',
      },
      options: [
        { en: 'Nothing, until you call render manually', es: 'Nada, hasta que llames a render manualmente' },
        { en: 'React re-renders the component and updates only what changed in the DOM', es: 'React re-renderiza el componente y actualiza solo lo que cambió en el DOM' },
        { en: 'The whole page reloads', es: 'Toda la página se recarga' },
        { en: 'The component is destroyed and recreated from HTML', es: 'El componente se destruye y se recrea desde HTML' },
      ],
      answer: 1,
      explain: {
        en: 'State changes trigger re-renders. React diffs the result and patches the real DOM efficiently.',
        es: 'Los cambios de estado provocan re-renders. React compara el resultado y actualiza el DOM real de forma eficiente.',
      },
    },
    {
      q: {
        en: 'What is a Single Page Application (SPA)?',
        es: '¿Qué es una Single Page Application (SPA)?',
      },
      options: [
        { en: 'A site with only one visible section', es: 'Un sitio con una sola sección visible' },
        { en: 'An app that loads once and updates views client-side without full page reloads', es: 'Una app que carga una vez y actualiza las vistas en el cliente sin recargas completas' },
        { en: 'A page that cannot use JavaScript', es: 'Una página que no puede usar JavaScript' },
        { en: 'An app with a single component', es: 'Una app con un único componente' },
      ],
      answer: 1,
      explain: {
        en: 'SPAs load one HTML shell, then JavaScript swaps views in place — fast navigation, no full reloads.',
        es: 'Las SPA cargan una sola base HTML y JavaScript cambia las vistas en su lugar: navegación rápida sin recargas completas.',
      },
    },
    {
      q: {
        en: 'Two counters on a page are each built as a <Counter /> component. Why is this better than duplicating the code twice?',
        es: 'Dos contadores en una página se construyen como componentes <Counter />. ¿Por qué es mejor que duplicar el código dos veces?',
      },
      options: [
        { en: 'It is not better; duplication is clearer', es: 'No es mejor; la duplicación es más clara' },
        { en: 'Each instance keeps its own state and the logic is defined once, so fixes apply everywhere', es: 'Cada instancia mantiene su propio estado y la lógica se define una vez, así los arreglos aplican en todas partes' },
        { en: 'React only allows one copy of each element', es: 'React solo permite una copia de cada elemento' },
        { en: 'It makes the bundle smaller but harder to debug', es: 'Hace el bundle más pequeño pero más difícil de depurar' },
      ],
      answer: 1,
      explain: {
        en: 'Components are reusable blueprints: define once, render many times, each with independent state.',
        es: 'Los componentes son plantillas reutilizables: se definen una vez, se renderizan muchas veces, cada uno con estado independiente.',
      },
    },
  ],
}
