// Quiz: Rendering — components are functions React re-runs.
export default {
  id: 'rendering',
  title: { en: 'Rendering quiz', es: 'Quiz de renderizado' },
  questions: [
    {
      q: { en: 'What does "rendering" a component mean in React?', es: '¿Qué significa "renderizar" un componente en React?' },
      options: [
        { en: 'React draws pixels on the screen directly', es: 'React dibuja píxeles directamente en pantalla' },
        { en: 'React calls the component function and uses its return value to describe the UI', es: 'React llama a la función del componente y usa su valor de retorno para describir la UI' },
        { en: 'React re-downloads the component code from the server', es: 'React vuelve a descargar el código del componente del servidor' },
        { en: 'React restarts the whole application', es: 'React reinicia toda la aplicación' },
      ],
      answer: 1,
      explain: {
        en: 'Rendering just means React executes your component function; the JSX it returns is a description of the UI, not pixels.',
        es: 'Renderizar significa que React ejecuta tu función; el JSX que devuelve es una descripción de la UI, no píxeles.',
      },
    },
    {
      q: { en: 'Which of these triggers a re-render of a component?', es: '¿Cuál de estas acciones provoca un re-render de un componente?' },
      options: [
        { en: 'Calling its state setter with a new value', es: 'Llamar a su setter de estado con un valor nuevo' },
        { en: 'Changing a local variable inside the component', es: 'Cambiar una variable local dentro del componente' },
        { en: 'The user moves the mouse over the component', es: 'El usuario mueve el ratón sobre el componente' },
        { en: 'A setTimeout finishes somewhere else in the app', es: 'Un setTimeout termina en otra parte de la app' },
      ],
      answer: 0,
      explain: {
        en: 'Only three things re-run a component: its own state change, its parent re-rendering, or a context change — nothing else.',
        es: 'Solo tres cosas reejecutan un componente: cambio de su propio estado, re-render del padre o cambio de contexto; nada más.',
      },
    },
    {
      q: { en: 'A component renders, and only one word of its text changed. What does React do with the DOM?', es: 'Un componente se renderiza y solo cambió una palabra de su texto. ¿Qué hace React con el DOM?' },
      options: [
        { en: 'It deletes all DOM nodes and recreates them', es: 'Borra todos los nodos del DOM y los recrea' },
        { en: 'It updates only the DOM node whose text changed', es: 'Actualiza solo el nodo del DOM cuyo texto cambió' },
        { en: 'It reloads the page so the DOM is fresh', es: 'Recarga la página para que el DOM quede limpio' },
        { en: 'It does nothing until the next full render', es: 'No hace nada hasta el próximo render completo' },
      ],
      answer: 1,
      explain: {
        en: 'After the render, React compares the new description with the previous one (reconciliation) and touches only the DOM nodes that actually changed.',
        es: 'Tras el render, React compara la nueva descripción con la anterior (reconciliación) y toca solo los nodos del DOM que cambiaron.',
      },
    },
    {
      q: {
        en: 'Predict the output: a Counter component logs "render" every time its function runs. The user clicks the + button twice. How many times does "render" appear in the console (including the initial mount)?',
        es: 'Predice el resultado: un componente Counter muestra "render" en consola cada vez que se ejecuta su función. El usuario pulsa el botón + dos veces. ¿Cuántas veces aparece "render" en la consola (incluyendo el montaje inicial)?',
      },
      options: [
        { en: '2 times', es: '2 veces' },
        { en: '3 times', es: '3 veces' },
        { en: '4 times', es: '4 veces' },
        { en: '1 time — clicks do not re-render', es: '1 vez: los clics no re-renderizan' },
      ],
      answer: 1,
      explain: {
        en: 'One render for the initial mount, plus one re-render per state change — 1 + 2 clicks = 3 renders.',
        es: 'Un render para el montaje inicial, más un re-render por cada cambio de estado: 1 + 2 clics = 3 renders.',
      },
    },
    {
      q: { en: 'A parent component re-renders but its props and state did not change anything for its child. What happens to the child?', es: 'Un componente padre se re-renderiza, pero ni sus props ni su estado cambiaron nada para su hijo. ¿Qué le pasa al hijo?' },
      options: [
        { en: 'The child is skipped automatically', es: 'El hijo se omite automáticamente' },
        { en: 'The child re-renders too, by default', es: 'El hijo también se re-renderiza, por defecto' },
        { en: 'The child is removed from the page', es: 'El hijo se elimina de la página' },
        { en: 'The child only re-renders if it has its own state', es: 'El hijo solo se re-renderiza si tiene su propio estado' },
      ],
      answer: 1,
      explain: {
        en: 'By default, children follow the parent: when a parent renders, its children render again too. (React.memo can opt out — that comes later.)',
        es: 'Por defecto, los hijos siguen al padre: cuando un padre renderiza, sus hijos también se re-renderizan. (React.memo permite evitarlo; eso vendrá más adelante.)',
      },
    },
  ],
}
