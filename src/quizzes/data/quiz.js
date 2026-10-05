// Quiz: Data fetching — loading/success/error states, latency, race conditions.
export default {
  id: 'data',
  title: { en: 'Data fetching quiz', es: 'Quiz de carga de datos' },
  questions: [
    {
      q: { en: 'Where should the fetch() call live in a React component?', es: '¿Dónde debería vivir la llamada fetch() en un componente React?' },
      options: [
        { en: 'Directly in the component body, during render', es: 'Directamente en el cuerpo del componente, durante el render' },
        { en: 'Inside a useEffect, storing the result in state', es: 'Dentro de un useEffect, guardando el resultado en el estado' },
        { en: 'Inside the event handler of every button', es: 'Dentro del manejador de evento de cada botón' },
        { en: 'In the JSX return statement', es: 'En la sentencia return del JSX' },
      ],
      answer: 1,
      explain: {
        en: 'Fetching during render would fire on every render (a loop). The effect runs once after mount; state holds the answer and triggers one re-render.',
        es: 'Cargar datos durante el render dispararía la petición en cada render (un bucle). El efecto se ejecuta una vez tras el montaje; el estado guarda la respuesta y provoca un re-render.',
      },
    },
    {
      q: { en: 'Why does a fetch UI need loading, success AND error states?', es: '¿Por qué una UI de carga necesita estados de loading, success Y error?' },
      options: [
        { en: 'React requires all three or it shows a warning', es: 'React exige los tres o muestra una advertencia' },
        { en: 'The network takes time and can fail — the UI must represent "waiting", "got it" and "it broke"', es: 'La red tarda y puede fallar: la UI debe representar "esperando", "lo tengo" y "se rompió"' },
        { en: 'To make the component file longer', es: 'Para que el archivo del componente sea más largo' },
        { en: 'Only loading is needed; the other two are optional decoration', es: 'Solo loading es necesario; los otros dos son decoración opcional' },
      ],
      answer: 1,
      explain: {
        en: 'Every fetch UI is three UIs in one: users need feedback while waiting, the data when it arrives, and a message when it fails.',
        es: 'Cada UI de carga son tres UIs en una: el usuario necesita feedback mientras espera, los datos cuando llegan y un mensaje cuando falla.',
      },
    },
    {
      q: {
        en: 'Predict the outcome: a component fetches users in useEffect with [userId] deps. The user clicks user 2, then quickly user 3. The response for user 2 arrives AFTER the response for user 3. What does the screen show?',
        es: 'Predice el resultado: un componente carga usuarios en un useEffect con dependencias [userId]. El usuario pulsa el usuario 2 y luego rápido el 3. La respuesta del usuario 2 llega DESPUÉS que la del 3. ¿Qué muestra la pantalla?',
      },
      options: [
        { en: 'User 3 — React always keeps the latest request', es: 'El usuario 3: React siempre conserva la petición más reciente' },
        { en: 'User 2 — the last response to arrive wins and overwrites the state', es: 'El usuario 2: la última respuesta en llegar gana y sobrescribe el estado' },
        { en: 'Both users mixed together', es: 'Ambos usuarios mezclados' },
        { en: 'An error screen', es: 'Una pantalla de error' },
      ],
      answer: 1,
      explain: {
        en: 'This is a race condition: each response blindly calls setState, so the slowest (stale) one wins. Cleanup or request tracking fixes it.',
        es: 'Esto es una condición de carrera: cada respuesta llama a setState sin más, así que la más lenta (obsoleta) gana. La limpieza o el seguimiento de peticiones lo soluciona.',
      },
    },
    {
      q: { en: 'The fetch fails (server is down). With only `data` and `loading` state, what does the user see?', es: 'La petición falla (el servidor está caído). Con solo estado `data` y `loading`, ¿qué ve el usuario?' },
      options: [
        { en: 'A clear error message explaining the problem', es: 'Un mensaje de error claro que explica el problema' },
        { en: 'A spinner forever, or a blank/empty area — there is no state to represent the failure', es: 'Un spinner eterno o un área vacía: no hay estado que represente el fallo' },
        { en: 'The data from the previous successful fetch', es: 'Los datos de la última carga exitosa' },
        { en: 'The app automatically retries until it works', es: 'La app reintenta automáticamente hasta que funciona' },
      ],
      answer: 1,
      explain: {
        en: 'Without an error state, a failed fetch is invisible: loading turns off, data stays empty, and the user has no idea what happened.',
        es: 'Sin estado de error, una petición fallida es invisible: loading se apaga, data queda vacío y el usuario no sabe qué pasó.',
      },
    },
    {
      q: { en: 'Why does the first paint of a data-fetching component happen with NO data?', es: '¿Por qué el primer pintado de un componente que carga datos ocurre SIN datos?' },
      options: [
        { en: 'Because the effect — and therefore the fetch — runs after the first render', es: 'Porque el efecto, y por tanto la petición, se ejecuta después del primer render' },
        { en: 'Because React blocks rendering until fetch completes', es: 'Porque React bloquea el render hasta que fetch termina' },
        { en: 'Because the data is cached and skipped', es: 'Porque los datos están en caché y se omiten' },
        { en: 'It does not — data is always there on first paint', es: 'No es así: los datos siempre están en el primer pintado' },
      ],
      answer: 0,
      explain: {
        en: 'The component renders immediately with empty state, then the effect fires the fetch; when the response arrives, state updates and React renders again with data.',
        es: 'El componente renderiza al instante con el estado vacío; luego el efecto lanza la petición; cuando llega la respuesta, el estado se actualiza y React renderiza de nuevo con datos.',
      },
    },
  ],
}
