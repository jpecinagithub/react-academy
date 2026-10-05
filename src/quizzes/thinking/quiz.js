export default {
  id: 'thinking',
  title: { en: 'Thinking in React quiz', es: 'Quiz de pensar en React' },
  questions: [
    {
      q: {
        en: 'What is the recommended first step when building a UI "the React way"?',
        es: '¿Cuál es el primer paso recomendado al construir una UI "a la manera React"?',
      },
      options: [
        { en: 'Write all the state logic first', es: 'Escribir primero toda la lógica de estado' },
        { en: 'Break the UI into a component hierarchy of small, single-responsibility pieces', es: 'Dividir la UI en una jerarquía de componentes pequeños, cada uno con una sola responsabilidad' },
        { en: 'Choose a styling library', es: 'Elegir una librería de estilos' },
        { en: 'Set up routing between pages', es: 'Configurar el enrutado entre páginas' },
      ],
      answer: 1,
      explain: {
        en: 'Thinking in React starts by decomposing the mockup into components and subcomponents. Structure first — state and interactivity come after.',
        es: 'Pensar en React empieza descomponiendo el diseño en componentes y subcomponentes. Primero la estructura; el estado y la interactividad vienen después.',
      },
    },
    {
      q: {
        en: 'A component holds firstName and lastName in state, plus fullName in state updated by an effect. What is wrong with this design?',
        es: 'Un componente guarda firstName y lastName en el estado, además de fullName en el estado actualizado por un efecto. ¿Qué está mal en este diseño?',
      },
      options: [
        { en: 'Nothing; keeping derived values in state is best practice', es: 'Nada; guardar valores derivados en el estado es buena práctica' },
        { en: 'fullName is redundant state: it can be computed during render from firstName and lastName, avoiding sync bugs', es: 'fullName es estado redundante: puede calcularse durante el render a partir de firstName y lastName, evitando bugs de sincronización' },
        { en: 'Effects cannot update state', es: 'Los efectos no pueden actualizar el estado' },
        { en: 'State values must always be strings', es: 'Los valores del estado siempre deben ser strings' },
      ],
      answer: 1,
      explain: {
        en: 'Keep state minimal: store only what cannot be derived. Anything computable from existing state or props should be computed in the render, not duplicated.',
        es: 'Mantén el estado mínimo: guarda solo lo que no pueda derivarse. Todo lo calculable a partir del estado o las props debe calcularse en el render, no duplicarse.',
      },
    },
    {
      q: {
        en: 'A search box and a results list both need the query text. Where should the query state live?',
        es: 'Un cuadro de búsqueda y una lista de resultados necesitan el texto de búsqueda. ¿Dónde debería vivir el estado de la búsqueda?',
      },
      options: [
        { en: 'Inside the search box, and the list reads it from the DOM', es: 'Dentro del cuadro de búsqueda, y la lista lo lee del DOM' },
        { en: 'In their closest common parent, passed down to both as props', es: 'En su padre común más cercano, pasado a ambos como props' },
        { en: 'Duplicated in both components, synced with an effect', es: 'Duplicado en ambos componentes, sincronizado con un efecto' },
        { en: 'In the results list, passed up to the search box', es: 'En la lista de resultados, pasado hacia arriba al cuadro de búsqueda' },
      ],
      answer: 1,
      explain: {
        en: 'State should live in the closest common ancestor of every component that needs it. Siblings share it via props — never duplicate it.',
        es: 'El estado debe vivir en el ancestro común más cercano de todos los componentes que lo necesitan. Los hermanos lo comparten vía props; nunca lo dupliques.',
      },
    },
    {
      q: {
        en: 'Which statement best describes data flow in React?',
        es: '¿Qué afirmación describe mejor el flujo de datos en React?',
      },
      options: [
        { en: 'Data flows in both directions automatically between parent and child', es: 'Los datos fluyen en ambas direcciones automáticamente entre padre e hijo' },
        { en: 'Data flows down via props; child-to-parent communication happens through event callbacks passed down as props', es: 'Los datos fluyen hacia abajo vía props; la comunicación hijo→padre ocurre mediante callbacks de eventos pasados como props' },
        { en: 'Children can directly modify their parent state', es: 'Los hijos pueden modificar directamente el estado de su padre' },
        { en: 'Data only flows upward, from children to parents', es: 'Los datos solo fluyen hacia arriba, de hijos a padres' },
      ],
      answer: 1,
      explain: {
        en: 'React data flow is one-way: parents pass data down. A child "talks back" by calling a function the parent gave it — the state update still happens in the parent.',
        es: 'El flujo de datos de React es unidireccional: los padres pasan datos hacia abajo. Un hijo "responde" llamando a una función que el padre le dio; la actualización del estado sigue ocurriendo en el padre.',
      },
    },
    {
      q: {
        en: 'You type in a filter input but the product list below never filters. The input keeps its own query state internally. What is the most likely cause?',
        es: 'Escribes en un input de filtro pero la lista de productos de abajo nunca se filtra. El input guarda su propio estado de búsqueda internamente. ¿Cuál es la causa más probable?',
      },
      options: [
        { en: 'The list component is broken and needs rewriting', es: 'El componente de lista está roto y hay que reescribirlo' },
        { en: 'The state lives in the wrong place: it must be lifted to the common parent so the list can receive it as a prop', es: 'El estado vive en el lugar equivocado: debe elevarse al padre común para que la lista lo reciba como prop' },
        { en: 'Inputs cannot share state with other components', es: 'Los inputs no pueden compartir estado con otros componentes' },
        { en: 'The filter logic needs useMemo to work', es: 'La lógica de filtrado necesita useMemo para funcionar' },
      ],
      answer: 1,
      explain: {
        en: 'State trapped inside the input is invisible to the list. Lifting it to their shared parent lets the input update it and the list read it — the classic Thinking in React fix.',
        es: 'El estado atrapado dentro del input es invisible para la lista. Elevarlo al padre compartido permite que el input lo actualice y la lista lo lea: la solución clásica de Thinking in React.',
      },
    },
  ],
}
