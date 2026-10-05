// Quiz: Forms — controlled inputs, single source of truth, submit handling.
export default {
  id: 'forms',
  title: { en: 'Forms quiz', es: 'Quiz de formularios' },
  questions: [
    {
      q: { en: 'What makes an input "controlled" in React?', es: '¿Qué hace que un input sea "controlado" en React?' },
      options: [
        { en: 'It has both value={state} and onChange wired to update that state', es: 'Tiene value={state} y onChange conectados para actualizar ese estado' },
        { en: 'It has a ref attached to it', es: 'Tiene una ref asociada' },
        { en: 'It is inside a <form> element', es: 'Está dentro de un elemento <form>' },
        { en: 'It has the required attribute', es: 'Tiene el atributo required' },
      ],
      answer: 0,
      explain: {
        en: 'A controlled input gets its value from state and reports every change back to state — React owns what is displayed.',
        es: 'Un input controlado recibe su valor del estado y reporta cada cambio de vuelta al estado: React es dueño de lo que se muestra.',
      },
    },
    {
      q: {
        en: 'Predict the outcome: <input value={name} /> with NO onChange, where name is useState(""). The user types "x". What happens?',
        es: 'Predice el resultado: <input value={name} /> SIN onChange, donde name es useState(""). El usuario escribe "x". ¿Qué ocurre?',
      },
      options: [
        { en: 'The input shows "x"', es: 'El input muestra "x"' },
        { en: 'The input stays empty — it looks frozen', es: 'El input se queda vacío: parece congelado' },
        { en: 'React throws an error immediately', es: 'React lanza un error de inmediato' },
        { en: 'The input shows "x" but name stays ""', es: 'El input muestra "x" pero name sigue siendo ""' },
      ],
      answer: 1,
      explain: {
        en: 'With value fixed to state and no onChange to update it, every keystroke re-renders with the same value — the field cannot change.',
        es: 'Con value fijado al estado y sin onChange que lo actualice, cada tecla re-renderiza con el mismo valor: el campo no puede cambiar.',
      },
    },
    {
      q: { en: 'Why is state called the "single source of truth" for a controlled form?', es: '¿Por qué se dice que el estado es la "única fuente de verdad" de un formulario controlado?' },
      options: [
        { en: 'Because the DOM input holds the real value and state copies it', es: 'Porque el input del DOM guarda el valor real y el estado lo copia' },
        { en: 'Because every input reads from and writes to the same state — one place decides the value', es: 'Porque cada input lee y escribe el mismo estado: un solo lugar decide el valor' },
        { en: 'Because only one form per page is allowed', es: 'Porque solo se permite un formulario por página' },
        { en: 'Because state is stored in the browser database', es: 'Porque el estado se guarda en la base de datos del navegador' },
      ],
      answer: 1,
      explain: {
        en: 'The input never owns its value; it mirrors state. Validation, submit and display all read the same source, so they can never disagree.',
        es: 'El input nunca es dueño de su valor; refleja el estado. La validación, el envío y la vista leen la misma fuente, así que nunca pueden contradecirse.',
      },
    },
    {
      q: { en: 'A form has several controlled inputs and one onSubmit. Why is onSubmit the right place to read the values?', es: 'Un formulario tiene varios inputs controlados y un onSubmit. ¿Por qué onSubmit es el lugar correcto para leer los valores?' },
      options: [
        { en: 'Because inputs cannot be read from their onChange handlers', es: 'Porque los valores no se pueden leer desde sus onChange' },
        { en: 'Because all the state is already up to date there — submit reads the finished form in one place', es: 'Porque todo el estado ya está actualizado ahí: el envío lee el formulario completo en un solo lugar' },
        { en: 'Because the browser blocks reading state elsewhere', es: 'Porque el navegador bloquea leer el estado en otros sitios' },
        { en: 'Because onSubmit runs before any onChange', es: 'Porque onSubmit se ejecuta antes que cualquier onChange' },
      ],
      answer: 1,
      explain: {
        en: 'Controlled inputs keep state current on every keystroke, so at submit time the state already holds the complete, validated form.',
        es: 'Los inputs controlados mantienen el estado al día con cada tecla, así que al enviar, el estado ya contiene el formulario completo y validado.',
      },
    },
    {
      q: { en: 'In a controlled form’s handleSubmit, what does e.preventDefault() prevent?', es: 'En el handleSubmit de un formulario controlado, ¿qué impide e.preventDefault()?' },
      options: [
        { en: 'The user clicking submit twice', es: 'Que el usuario pulse enviar dos veces' },
        { en: 'The browser’s native page reload on form submission', es: 'La recarga nativa de la página que hace el navegador al enviar' },
        { en: 'Empty fields from being submitted', es: 'Que se envíen campos vacíos' },
        { en: 'The onChange handlers from firing again', es: 'Que los onChange se disparen de nuevo' },
      ],
      answer: 1,
      explain: {
        en: 'Native form submission navigates/reloads the page, wiping React state. preventDefault() keeps your app — and its state — alive.',
        es: 'El envío nativo navega/recarga la página, borrando el estado de React. preventDefault() mantiene viva tu app y su estado.',
      },
    },
  ],
}
