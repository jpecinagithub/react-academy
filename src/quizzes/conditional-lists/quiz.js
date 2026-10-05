// Quiz: Conditional rendering & lists — ternary vs &&, .map(), and why keys exist.
export default {
  id: 'conditional-lists',
  title: { en: 'Conditionals & lists quiz', es: 'Quiz de condicionales y listas' },
  questions: [
    {
      q: { en: 'You want to show a spinner while loading, or the content otherwise. Which pattern is best?', es: 'Quieres mostrar un spinner mientras carga, o el contenido en caso contrario. ¿Qué patrón es mejor?' },
      options: [
        { en: 'loading && <Spinner /> — with a separate <Content /> after it', es: 'loading && <Spinner /> — con un <Content /> separado después' },
        { en: '{loading ? <Spinner /> : <Content />}', es: '{loading ? <Spinner /> : <Content />}' },
        { en: 'Two components: <Spinner /> and <Content /> always rendered', es: 'Dos componentes: <Spinner /> y <Content /> siempre renderizados' },
        { en: '{loading || <Spinner />}', es: '{loading || <Spinner />}' },
      ],
      answer: 1,
      explain: {
        en: 'A ternary expresses "one or the other" cleanly. && is best for "show this extra thing, or nothing".',
        es: 'El ternario expresa "una cosa u otra" de forma limpia. && es mejor para "muestra esto extra, o nada".',
      },
    },
    {
      q: {
        en: 'Predict the outcome: {count && <p>You have {count} items</p>} when count is 0. What renders?',
        es: 'Predice el resultado: {count && <p>You have {count} items</p>} cuando count es 0. ¿Qué se renderiza?',
      },
      options: [
        { en: 'The paragraph "You have 0 items"', es: 'El párrafo "You have 0 items"' },
        { en: 'Nothing at all', es: 'Nada en absoluto' },
        { en: 'A stray "0" on the screen', es: 'Un "0" suelto en la pantalla' },
        { en: 'An error crashes the app', es: 'Un error rompe la app' },
      ],
      answer: 2,
      explain: {
        en: '&& returns the first falsy value: 0 && <p>…</p> evaluates to 0, and React renders the number 0 as text. Guard with count > 0 instead.',
        es: '&& devuelve el primer valor falsy: 0 && <p>…</p> se evalúa a 0, y React renderiza el número 0 como texto. Mejor comprobar con count > 0.',
      },
    },
    {
      q: { en: 'Why does React ask for a `key` when you render a list with .map()?', es: '¿Por qué React pide una `key` cuando renderizas una lista con .map()?' },
      options: [
        { en: 'To make the list render faster by skipping .map()', es: 'Para que la lista renderice más rápido saltándose .map()' },
        { en: 'So React can tell which item is which across renders — its identity', es: 'Para que React sepa qué elemento es cuál entre renders: su identidad' },
        { en: 'To sort the list alphabetically', es: 'Para ordenar la lista alfabéticamente' },
        { en: 'Keys are just for debugging in DevTools', es: 'Las keys solo sirven para depurar en DevTools' },
      ],
      answer: 1,
      explain: {
        en: 'Keys give each item a stable identity. Without them React cannot match old items to new ones, so state and input values get mixed up.',
        es: 'Las keys dan a cada elemento una identidad estable. Sin ellas, React no puede emparejar elementos viejos con nuevos, y el estado y los valores de los inputs se mezclan.',
      },
    },
    {
      q: { en: 'Each row of a todo list contains an <input>. You reverse the list order without keys. What breaks?', es: 'Cada fila de una lista de tareas contiene un <input>. Inviertes el orden de la lista sin keys. ¿Qué se rompe?' },
      options: [
        { en: 'Nothing — React handles it automatically', es: 'Nada: React lo gestiona automáticamente' },
        { en: 'The typed text stays with the row position instead of following its todo', es: 'El texto escrito se queda en la posición de la fila en vez de seguir a su tarea' },
        { en: 'The inputs disappear from the screen', es: 'Los inputs desaparecen de la pantalla' },
        { en: 'The app throws a "missing key" error and stops', es: 'La app lanza un error de "missing key" y se detiene' },
      ],
      answer: 1,
      explain: {
        en: 'React reuses DOM nodes by position when there are no keys, so the input’s state sticks to the row slot rather than moving with the item.',
        es: 'Sin keys, React reutiliza los nodos del DOM por posición, así que el estado del input se queda en la ranura de la fila en lugar de moverse con el elemento.',
      },
    },
    {
      q: { en: 'What makes a good `key` for a list of users fetched from an API?', es: '¿Qué es una buena `key` para una lista de usuarios traída de una API?' },
      options: [
        { en: 'The array index: key={i}', es: 'El índice del array: key={i}' },
        { en: 'A random number generated during render', es: 'Un número aleatorio generado durante el render' },
        { en: 'A stable unique id from the data: key={user.id}', es: 'Un id único y estable de los datos: key={user.id}' },
        { en: 'The user’s name', es: 'El nombre del usuario' },
      ],
      answer: 2,
      explain: {
        en: 'A stable, unique id survives reorders, inserts and deletes. Indexes break on reorder; random values change identity every render; names may repeat.',
        es: 'Un id único y estable sobrevive a reordenados, inserciones y borrados. Los índices fallan al reordenar; los aleatorios cambian de identidad en cada render; los nombres pueden repetirse.',
      },
    },
  ],
}
