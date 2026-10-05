// Quiz: Events — onClick/onChange/onSubmit, handlers as functions, synthetic events.
export default {
  id: 'events',
  title: { en: 'Events quiz', es: 'Quiz de eventos' },
  questions: [
    {
      q: { en: 'What is the difference between onClick={handleClick} and onClick={handleClick()}?', es: '¿Cuál es la diferencia entre onClick={handleClick} y onClick={handleClick()}?' },
      options: [
        { en: 'They are identical; the parentheses are optional', es: 'Son idénticos; los paréntesis son opcionales' },
        { en: 'The first passes the function to run on click; the second runs it immediately during render', es: 'El primero pasa la función para ejecutarla al hacer clic; el segundo la ejecuta de inmediato durante el render' },
        { en: 'The second one is faster', es: 'El segundo es más rápido' },
        { en: 'The first only works for onClick, the second for all events', es: 'El primero solo funciona con onClick; el segundo, con todos los eventos' },
      ],
      answer: 1,
      explain: {
        en: 'Event props expect a function reference. Adding () calls it right away during render — usually an infinite-render bug.',
        es: 'Las props de evento esperan una referencia a función. Poner () la llama de inmediato durante el render, lo que suele causar un bug de renders infinitos.',
      },
    },
    {
      q: { en: 'You want a button to delete item 5: onClick needs an argument. Which is correct?', es: 'Quieres que un botón borre el elemento 5: onClick necesita un argumento. ¿Cuál es la forma correcta?' },
      options: [
        { en: 'onClick={deleteItem(5)}', es: 'onClick={deleteItem(5)}' },
        { en: 'onClick={() => deleteItem(5)}', es: 'onClick={() => deleteItem(5)}' },
        { en: 'onClick="deleteItem(5)"', es: 'onClick="deleteItem(5)"' },
        { en: 'onClick={deleteItem}', es: 'onClick={deleteItem}' },
      ],
      answer: 1,
      explain: {
        en: 'Wrap the call in an arrow function so deleteItem(5) only runs when the click happens, not during render.',
        es: 'Envuelve la llamada en una función flecha para que deleteItem(5) solo se ejecute al hacer clic, no durante el render.',
      },
    },
    {
      q: {
        en: 'Predict the outcome: <input onChange={e => setName(e.target.value)} />. The user types "Ana". What happens?',
        es: 'Predice el resultado: <input onChange={e => setName(e.target.value)} />. El usuario escribe "Ana". ¿Qué ocurre?',
      },
      options: [
        { en: 'setName runs once with "Ana"', es: 'setName se ejecuta una vez con "Ana"' },
        { en: 'setName runs three times: "A", "An", "Ana"', es: 'setName se ejecuta tres veces: "A", "An", "Ana"' },
        { en: 'Nothing happens until the user presses Enter', es: 'No pasa nada hasta que el usuario pulse Enter' },
        { en: 'The input is cleared after each keystroke', es: 'El input se borra tras cada tecla' },
      ],
      answer: 1,
      explain: {
        en: 'onChange fires on every keystroke, so each character triggers a state update and a re-render with the current text.',
        es: 'onChange se dispara con cada tecla, así que cada carácter provoca una actualización de estado y un re-render con el texto actual.',
      },
    },
    {
      q: { en: 'React event handlers like onClick and onChange are written in…', es: 'Los manejadores de eventos de React, como onClick y onChange, se escriben en…' },
      options: [
        { en: 'lowercase, like HTML: onclick', es: 'minúsculas, como en HTML: onclick' },
        { en: 'camelCase: onClick, onChange, onSubmit', es: 'camelCase: onClick, onChange, onSubmit' },
        { en: 'UPPERCASE: ONCLICK', es: 'mayúsculas: ONCLICK' },
        { en: 'kebab-case: on-click', es: 'kebab-case: on-click' },
      ],
      answer: 1,
      explain: {
        en: 'React uses camelCase event names (onClick, onChange, onSubmit) — lowercase onclick will simply be ignored.',
        es: 'React usa nombres de eventos en camelCase (onClick, onChange, onSubmit): onclick en minúsculas simplemente se ignora.',
      },
    },
    {
      q: { en: 'A form has onSubmit={handleSubmit}. Inside handleSubmit, why do we usually call e.preventDefault()?', es: 'Un formulario tiene onSubmit={handleSubmit}. Dentro de handleSubmit, ¿por qué solemos llamar a e.preventDefault()?' },
      options: [
        { en: 'To make the submit button look disabled', es: 'Para que el botón de envío parezca deshabilitado' },
        { en: 'To stop the browser from reloading the page, so React can handle the data itself', es: 'Para impedir que el navegador recargue la página y que React gestione los datos por sí mismo' },
        { en: 'To validate the form fields automatically', es: 'Para validar los campos del formulario automáticamente' },
        { en: 'To clear the form inputs after submit', es: 'Para limpiar los inputs del formulario tras el envío' },
      ],
      answer: 1,
      explain: {
        en: 'A native form submit reloads the page. preventDefault() cancels that default behavior so your React code stays in control.',
        es: 'El envío nativo de un formulario recarga la página. preventDefault() cancela ese comportamiento por defecto para que tu código React mantenga el control.',
      },
    },
  ],
}
