export default {
  id: 'props',
  title: { en: 'Props quiz', es: 'Quiz de props' },
  questions: [
    {
      q: {
        en: 'Data flows in React in which direction via props?',
        es: '¿En qué dirección fluyen los datos en React a través de las props?',
      },
      options: [
        { en: 'Child to parent', es: 'De hijo a padre' },
        { en: 'Parent to child (one-way)', es: 'De padre a hijo (unidireccional)' },
        { en: 'Both directions automatically', es: 'En ambas direcciones automáticamente' },
        { en: 'Sideways between siblings', es: 'Lateralmente entre hermanos' },
      ],
      answer: 1,
      explain: {
        en: 'Props flow down. A child communicates upward by calling a callback function the parent passed as a prop.',
        es: 'Las props fluyen hacia abajo. Un hijo se comunica hacia arriba llamando a un callback que el padre le pasó como prop.',
      },
    },
    {
      q: {
        en: 'Why should a component never do `props.name = "Ana"`?',
        es: '¿Por qué un componente nunca debería hacer `props.name = "Ana"`?',
      },
      options: [
        { en: 'It is slower than setState', es: 'Es más lento que setState' },
        { en: 'Props are read-only; mutating them breaks React\'s data flow and causes bugs', es: 'Las props son de solo lectura; mutarlas rompe el flujo de datos de React y causa bugs' },
        { en: 'It only works in class components', es: 'Solo funciona en componentes de clase' },
        { en: 'It is fine — React encourages it', es: 'Está bien: React lo recomienda' },
      ],
      answer: 1,
      explain: {
        en: 'Props belong to the parent. The child must treat them as immutable and ask for changes via callbacks or state.',
        es: 'Las props pertenecen al padre. El hijo debe tratarlas como inmutables y pedir cambios vía callbacks o estado.',
      },
    },
    {
      q: {
        en: 'What is the `children` prop?',
        es: '¿Qué es la prop `children`?',
      },
      options: [
        { en: 'A list of all components in the app', es: 'Una lista de todos los componentes de la app' },
        { en: 'Whatever JSX is nested between a component\'s opening and closing tags', es: 'El JSX anidado entre las etiquetas de apertura y cierre del componente' },
        { en: 'Only text content, never elements', es: 'Solo contenido de texto, nunca elementos' },
        { en: 'A prop React adds automatically to every DOM node', es: 'Una prop que React añade automáticamente a cada nodo DOM' },
      ],
      answer: 1,
      explain: {
        en: 'In <Card>...</Card>, the ... becomes props.children. It powers composition: wrappers that render content they don\'t own.',
        es: 'En <Card>...</Card>, el ... se convierte en props.children. Permite composición: contenedores que renderizan contenido que no les pertenece.',
      },
    },
    {
      q: {
        en: 'A Button needs a label and a click behavior. Which is the more flexible design?',
        es: 'Un Button necesita una etiqueta y un comportamiento de clic. ¿Cuál es el diseño más flexible?',
      },
      options: [
        { en: '<Button label="Save" onClick={save} /> — data in, behavior in via props', es: '<Button label="Save" onClick={save} />: datos y comportamiento entran vía props' },
        { en: 'Hardcode the label and behavior inside Button', es: 'Fijar la etiqueta y el comportamiento dentro de Button' },
        { en: 'Make Button read a global variable for the label', es: 'Hacer que Button lea una variable global para la etiqueta' },
        { en: 'Copy Button into SaveButton with its own logic', es: 'Copiar Button en SaveButton con su propia lógica' },
      ],
      answer: 0,
      explain: {
        en: 'Configurable via props beats hardcoded: one Button serves every label and action in the app.',
        es: 'Configurable vía props vence a lo fijo: un Button sirve para cada etiqueta y acción de la app.',
      },
    },
    {
      q: {
        en: 'Predict: `<Greeting name="Luz" />` where Greeting renders `<h1>Hola, {name}</h1>` with destructured props. What shows?',
        es: 'Predice: `<Greeting name="Luz" />` donde Greeting renderiza `<h1>Hola, {name}</h1>` con props desestructuradas. ¿Qué se muestra?',
      },
      options: [
        { en: 'Hola, {name}', es: 'Hola, {name}' },
        { en: 'Hola, Luz', es: 'Hola, Luz' },
        { en: 'Hola, undefined', es: 'Hola, undefined' },
        { en: 'Nothing renders', es: 'No se renderiza nada' },
      ],
      answer: 1,
      explain: {
        en: 'The parent passes name="Luz" down as a prop; the child reads it and interpolates the value into the JSX.',
        es: 'El padre pasa name="Luz" como prop; el hijo la lee e interpola el valor en el JSX.',
      },
    },
  ],
}
