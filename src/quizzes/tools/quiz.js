export default {
  id: 'tools',
  title: { en: 'Tools quiz', es: 'Quiz de herramientas' },
  questions: [
    {
      q: {
        en: 'What does the React DevTools Profiler tell you?',
        es: '¿Qué te dice el Profiler de React DevTools?',
      },
      options: [
        { en: 'Which files are the largest in the bundle', es: 'Qué ficheros son los más grandes del bundle' },
        { en: 'Which components re-rendered, how long each took, and why they re-rendered', es: 'Qué componentes se re-renderizaron, cuánto tardó cada uno y por qué se re-renderizaron' },
        { en: 'How many users visited the page', es: 'Cuántos usuarios visitaron la página' },
        { en: 'The network requests made by the app', es: 'Las peticiones de red hechas por la app' },
      ],
      answer: 1,
      explain: {
        en: 'The Profiler records a render session: it highlights re-rendered components, shows their render durations, and explains the trigger (props, state, or context change).',
        es: 'El Profiler graba una sesión de render: resalta los componentes re-renderizados, muestra cuánto tardó cada uno y explica el motivo (cambio de props, estado o contexto).',
      },
    },
    {
      q: {
        en: 'In the DevTools Components tab you select a component in the tree. What can you inspect and do there?',
        es: 'En la pestaña Components de DevTools seleccionas un componente del árbol. ¿Qué puedes inspeccionar y hacer ahí?',
      },
      options: [
        { en: 'Only its rendered HTML output', es: 'Solo su HTML renderizado' },
        { en: 'Its current props, state, and hooks — and even edit their values live to test behavior', es: 'Sus props, estado y hooks actuales, e incluso editar sus valores en vivo para probar el comportamiento' },
        { en: 'The component source code with syntax highlighting', es: 'El código fuente del componente con resaltado de sintaxis' },
        { en: 'Nothing; the tab is read-only documentation', es: 'Nada; la pestaña es documentación de solo lectura' },
      ],
      answer: 1,
      explain: {
        en: 'The Components inspector shows the live props, state, and hook values of the selected component. Editing them triggers a re-render, which is great for quick experiments.',
        es: 'El inspector de Components muestra las props, el estado y los valores de hooks en vivo del componente seleccionado. Editarlos provoca un re-render, ideal para experimentos rápidos.',
      },
    },
    {
      q: {
        en: 'What does an error boundary do?',
        es: '¿Qué hace un error boundary?',
      },
      options: [
        { en: 'It prevents all errors from ever happening', es: 'Evita que los errores ocurran jamás' },
        { en: 'It catches JavaScript errors during rendering (and lifecycle) in its child tree and shows a fallback UI instead of crashing the whole app', es: 'Captura errores de JavaScript durante el render (y el ciclo de vida) en su árbol hijo y muestra una UI alternativa en lugar de romper toda la app' },
        { en: 'It catches errors inside event handlers', es: 'Captura errores dentro de los manejadores de eventos' },
        { en: 'It logs errors to the server automatically', es: 'Registra los errores en el servidor automáticamente' },
      ],
      answer: 1,
      explain: {
        en: 'An error boundary is a class component with getDerivedStateFromError / componentDidCatch. It isolates render crashes to a section of the UI — but event-handler errors must be handled with try/catch.',
        es: 'Un error boundary es un componente de clase con getDerivedStateFromError / componentDidCatch. Aísla los fallos de render a una sección de la UI, pero los errores de manejadores de eventos requieren try/catch.',
      },
    },
    {
      q: {
        en: 'In development with Strict Mode on, an effect that fetches data runs twice. Why?',
        es: 'En desarrollo con Strict Mode activado, un efecto que carga datos se ejecuta dos veces. ¿Por qué?',
      },
      options: [
        { en: 'It is a bug in React that duplicates every effect', es: 'Es un bug de React que duplica cada efecto' },
        { en: 'Strict Mode intentionally mounts, unmounts, and remounts components to surface effects that are not resilient to re-running', es: 'Strict Mode monta, desmonta y vuelve a montar los componentes a propósito para revelar efectos que no toleran re-ejecutarse' },
        { en: 'The fetch promise resolved twice', es: 'La promesa del fetch se resolvió dos veces' },
        { en: 'Effects always run twice, in production too', es: 'Los efectos siempre se ejecutan dos veces, también en producción' },
      ],
      answer: 1,
      explain: {
        en: 'Strict Mode double-invokes effects in dev only, simulating a remount. It exposes missing cleanups and duplicate side effects before they bite in production.',
        es: 'Strict Mode invoca los efectos dos veces solo en desarrollo, simulando un remontaje. Expone limpiezas ausentes y efectos duplicados antes de que causen problemas en producción.',
      },
    },
    {
      q: {
        en: 'The Profiler shows a component re-rendering with the reason "Hook 2 changed". What does that mean and what is the sensible next step?',
        es: 'El Profiler muestra un componente re-renderizándose con el motivo "Hook 2 changed". ¿Qué significa y cuál es el siguiente paso sensato?',
      },
      options: [
        { en: 'The second hook called in that component produced a new value; check whether that update was necessary or avoidable', es: 'El segundo hook llamado en ese componente produjo un valor nuevo; comprueba si esa actualización era necesaria o evitable' },
        { en: 'The component has a bug on line 2 of its file', es: 'El componente tiene un bug en la línea 2 de su fichero' },
        { en: 'Two hooks were added; remove one to fix it', es: 'Se añadieron dos hooks; elimina uno para arreglarlo' },
        { en: 'It means nothing actionable; ignore the Profiler', es: 'No significa nada accionable; ignora el Profiler' },
      ],
      answer: 0,
      explain: {
        en: 'The Profiler identifies hooks by call order ("Hook 2" = the second hook). Count your hooks from the top to find it, then decide if its change was needed — e.g. stabilize it with useMemo/useCallback or lift it.',
        es: 'El Profiler identifica los hooks por orden de llamada ("Hook 2" = el segundo hook). Cuenta tus hooks desde arriba para localizarlo y decide si su cambio era necesario: por ejemplo, estabilízalo con useMemo/useCallback o elévalo.',
      },
    },
  ],
}
