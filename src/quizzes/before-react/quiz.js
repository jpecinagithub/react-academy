export default {
  id: 'before-react',
  title: { en: 'JavaScript readiness quiz', es: 'Quiz de preparación en JavaScript' },
  questions: [
    {
      q: {
        en: 'You have an array of users. In React, how do you most commonly render one <li> per user?',
        es: 'Tienes un array de usuarios. En React, ¿cuál es la forma más común de renderizar un <li> por usuario?',
      },
      options: [
        { en: 'Loop with for and push strings', es: 'Iterar con for y concatenar strings' },
        { en: 'array.map(user => <li>{user.name}</li>)', es: 'array.map(user => <li>{user.name}</li>)' },
        { en: 'array.filter(user => user.name)', es: 'array.filter(user => user.name)' },
        { en: 'JSON.stringify the array', es: 'Hacer JSON.stringify del array' },
      ],
      answer: 1,
      explain: {
        en: 'map() transforms each item into an element. It is the standard way to render lists from data in React.',
        es: 'map() transforma cada elemento en un componente. Es la forma estándar de renderizar listas desde datos en React.',
      },
    },
    {
      q: {
        en: 'What does `const { name, age } = user;` do?',
        es: '¿Qué hace `const { name, age } = user;`?',
      },
      options: [
        { en: 'Creates a new object', es: 'Crea un objeto nuevo' },
        { en: 'Destructures: extracts name and age from user', es: 'Destructura: extrae name y age de user' },
        { en: 'Compares name and age', es: 'Compara name y age' },
        { en: 'Deletes name and age', es: 'Elimina name y age' },
      ],
      answer: 1,
      explain: {
        en: 'Destructuring pulls named properties out of an object. React uses it constantly, e.g. `function Card({ title }) {}`.',
        es: 'La desestructuración extrae propiedades nombradas de un objeto. React la usa constantemente, p. ej. `function Card({ title }) {}`.',
      },
    },
    {
      q: {
        en: 'Why are arrow functions like `() => deleteTodo(id)` preferred as event handlers with arguments?',
        es: '¿Por qué se prefieren las arrow functions como `() => deleteTodo(id)` en manejadores de eventos con argumentos?',
      },
      options: [
        { en: 'They run faster', es: 'Se ejecutan más rápido' },
        { en: 'deleteTodo(id) alone would run immediately during render; the arrow delays it until the click', es: 'deleteTodo(id) solo se ejecutaría de inmediato durante el render; la flecha lo retrasa hasta el clic' },
        { en: 'React requires all handlers to be arrows', es: 'React exige que todos los manejadores sean flechas' },
        { en: 'They create a new id each render', es: 'Crean un nuevo id en cada render' },
      ],
      answer: 1,
      explain: {
        en: 'Writing onClick={deleteTodo(id)} calls the function right away. Wrapping it in an arrow makes it run only when the event fires.',
        es: 'Escribir onClick={deleteTodo(id)} llama a la función de inmediato. Envolverla en una flecha hace que solo se ejecute cuando ocurre el evento.',
      },
    },
    {
      q: {
        en: 'A component fetches data. Why do you need a "loading" state even though the fetch itself is simple?',
        es: 'Un componente obtiene datos. ¿Por qué necesitas un estado de "cargando" aunque el fetch sea simple?',
      },
      options: [
        { en: 'Because async work finishes later — the UI must describe what to show while waiting', es: 'Porque el trabajo asíncrono termina después: la UI debe describir qué mostrar mientras espera' },
        { en: 'Because fetch throws without it', es: 'Porque fetch lanza un error sin él' },
        { en: 'Because React forbids async code', es: 'Porque React prohíbe el código asíncrono' },
        { en: 'It is optional decoration only', es: 'Es solo decoración opcional' },
      ],
      answer: 0,
      explain: {
        en: 'Async operations complete after the first render. The UI needs a defined state for the "not yet arrived" moment.',
        es: 'Las operaciones asíncronas terminan después del primer render. La UI necesita un estado definido para el momento de "aún no llegó".',
      },
    },
    {
      q: {
        en: 'Predict the output: `const add = (a, b) => a + b; console.log(add(2, 3));`',
        es: 'Predice la salida: `const add = (a, b) => a + b; console.log(add(2, 3));`',
      },
      options: [
        { en: '5', es: '5' },
        { en: 'undefined', es: 'undefined' },
        { en: 'NaN', es: 'NaN' },
        { en: 'It throws an error', es: 'Lanza un error' },
      ],
      answer: 0,
      explain: {
        en: 'Arrow functions with a single expression return it implicitly. add(2, 3) returns 5.',
        es: 'Las arrow functions con una sola expresión la devuelven implícitamente. add(2, 3) devuelve 5.',
      },
    },
  ],
}
