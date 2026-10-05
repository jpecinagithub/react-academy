export default {
  id: 'state',
  title: { en: 'State quiz', es: 'Quiz de estado' },
  questions: [
    {
      q: {
        en: 'What does `const [count, setCount] = useState(0);` give you?',
        es: '¿Qué te da `const [count, setCount] = useState(0);`?',
      },
      options: [
        { en: 'A value and the function that updates it', es: 'Un valor y la función que lo actualiza' },
        { en: 'Two independent states', es: 'Dos estados independientes' },
        { en: 'A value and a render function', es: 'Un valor y una función de render' },
        { en: 'A getter and a DOM node', es: 'Un getter y un nodo DOM' },
      ],
      answer: 0,
      explain: {
        en: 'useState returns a pair: the current state value and its setter. Calling the setter schedules a re-render.',
        es: 'useState devuelve un par: el valor actual del estado y su setter. Llamar al setter programa un re-render.',
      },
    },
    {
      q: {
        en: 'What happens when you call a state setter like setCount(5)?',
        es: '¿Qué ocurre cuando llamas a un setter de estado como setCount(5)?',
      },
      options: [
        { en: 'The variable count changes instantly and synchronously', es: 'La variable count cambia al instante y de forma síncrona' },
        { en: 'React schedules a re-render with the new value; the current render keeps the old value', es: 'React programa un re-render con el nuevo valor; el render actual conserva el valor viejo' },
        { en: 'The component unmounts', es: 'El componente se desmonta' },
        { en: 'Nothing until the page reloads', es: 'Nada hasta que la página se recarga' },
      ],
      answer: 1,
      explain: {
        en: 'Setters don\'t mutate in place — they tell React "re-render me with this value". That\'s why logging right after shows the old value.',
        es: 'Los setters no mutan en el acto: le dicen a React "re-renderízame con este valor". Por eso un log justo después muestra el valor viejo.',
      },
    },
    {
      q: {
        en: 'Predict: count is 0. A handler calls setCount(count + 1) three times in a row. What is count after the re-render?',
        es: 'Predice: count vale 0. Un manejador llama a setCount(count + 1) tres veces seguidas. ¿Cuánto vale count tras el re-render?',
      },
      options: [
        { en: '3', es: '3' },
        { en: '1 — all three calls saw the same stale count (0) and React batches them', es: '1: las tres llamadas vieron el mismo count obsoleto (0) y React las agrupa' },
        { en: '0', es: '0' },
        { en: 'It throws an error', es: 'Lanza un error' },
      ],
      answer: 1,
      explain: {
        en: 'Each call computed 0 + 1 from the stale render value. React batches them into one update: 1. Functional updates fix this.',
        es: 'Cada llamada calculó 0 + 1 desde el valor obsoleto del render. React las agrupa en una actualización: 1. Las actualizaciones funcionales lo corrigen.',
      },
    },
    {
      q: {
        en: 'Which update is safe when the new state depends on the previous state?',
        es: '¿Qué actualización es segura cuando el nuevo estado depende del estado anterior?',
      },
      options: [
        { en: 'setCount(count + 1)', es: 'setCount(count + 1)' },
        { en: 'setCount(c => c + 1) — the functional form always receives the latest value', es: 'setCount(c => c + 1): la forma funcional siempre recibe el valor más reciente' },
        { en: 'count = count + 1', es: 'count = count + 1' },
        { en: 'setCount(count++)', es: 'setCount(count++)' },
      ],
      answer: 1,
      explain: {
        en: 'The updater function receives the freshest state at apply time, so chained or batched updates never use stale values.',
        es: 'La función actualizadora recibe el estado más fresco al aplicarse, así las actualizaciones encadenadas o agrupadas nunca usan valores obsoletos.',
      },
    },
    {
      q: {
        en: 'Why must you never do `items.push(newItem)` on a state array?',
        es: '¿Por qué nunca debes hacer `items.push(newItem)` sobre un array de estado?',
      },
      options: [
        { en: 'push is too slow', es: 'push es demasiado lento' },
        { en: 'It mutates the existing array, so React sees the same reference and may skip the re-render', es: 'Muta el array existente, así React ve la misma referencia y puede saltarse el re-render' },
        { en: 'Arrays cannot be state', es: 'Los arrays no pueden ser estado' },
        { en: 'It works fine — mutation is recommended', es: 'Funciona bien: la mutación es recomendada' },
      ],
      answer: 1,
      explain: {
        en: 'React detects changes by comparing references. Create a new array instead: setItems([...items, newItem]).',
        es: 'React detecta cambios comparando referencias. Crea un array nuevo: setItems([...items, newItem]).',
      },
    },
  ],
}
