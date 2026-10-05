// Quiz: Effects — dependency arrays, timing (after render), cleanup.
export default {
  id: 'effects',
  title: { en: 'Effects quiz', es: 'Quiz de efectos' },
  questions: [
    {
      q: { en: 'When does the code inside useEffect run?', es: '¿Cuándo se ejecuta el código dentro de useEffect?' },
      options: [
        { en: 'Before the component renders, so the UI is ready', es: 'Antes de que el componente renderice, para que la UI esté lista' },
        { en: 'After the component renders and the DOM is updated', es: 'Después de que el componente renderice y el DOM se actualice' },
        { en: 'Only when the user clicks something', es: 'Solo cuando el usuario hace clic en algo' },
        { en: 'At the exact same time as the render', es: 'Al mismo tiempo exacto que el render' },
      ],
      answer: 1,
      explain: {
        en: 'Effects run after React has painted: render first, then sync with the outside world (title, network, timers).',
        es: 'Los efectos se ejecutan después de que React haya pintado: primero el render, luego la sincronización con el mundo exterior (título, red, temporizadores).',
      },
    },
    {
      q: { en: 'useEffect(() => { fetchUsers(); }, []) — when does fetchUsers run?', es: 'useEffect(() => { fetchUsers(); }, []) — ¿cuándo se ejecuta fetchUsers?' },
      options: [
        { en: 'After every render', es: 'Después de cada render' },
        { en: 'Once, after the first render (mount)', es: 'Una vez, después del primer render (montaje)' },
        { en: 'Never — the empty array disables it', es: 'Nunca: el array vacío lo desactiva' },
        { en: 'Before the first render', es: 'Antes del primer render' },
      ],
      answer: 1,
      explain: {
        en: 'An empty dependency array means "nothing I care about can change", so the effect runs once after mount and never again.',
        es: 'Un array de dependencias vacío significa "nada de lo que me importa puede cambiar", así que el efecto se ejecuta una vez tras el montaje y nunca más.',
      },
    },
    {
      q: { en: 'You want to refetch a user profile whenever `userId` changes. Which dependency array is correct?', es: 'Quieres volver a cargar el perfil de usuario cada vez que cambie `userId`. ¿Qué array de dependencias es correcto?' },
      options: [
        { en: '[]', es: '[]' },
        { en: '[userId]', es: '[userId]' },
        { en: 'No dependency array at all', es: 'Ningún array de dependencias' },
        { en: '[users]', es: '[users]' },
      ],
      answer: 1,
      explain: {
        en: 'List every value the effect reads: when userId changes, React re-runs the effect and fetches the new profile.',
        es: 'Lista cada valor que el efecto lee: cuando userId cambia, React reejecuta el efecto y carga el nuevo perfil.',
      },
    },
    {
      q: {
        en: 'Predict the outcome: useEffect(() => { console.log(count); }); with NO dependency array. The component renders 3 times. How many logs?',
        es: 'Predice el resultado: useEffect(() => { console.log(count); }); SIN array de dependencias. El componente renderiza 3 veces. ¿Cuántos logs?',
      },
      options: [
        { en: '1 — effects only run on mount', es: '1: los efectos solo se ejecutan al montar' },
        { en: '3 — the effect runs after every render', es: '3: el efecto se ejecuta después de cada render' },
        { en: '0 — a missing array means the effect never runs', es: '0: sin array, el efecto nunca se ejecuta' },
        { en: '2 — it skips the first render', es: '2: se salta el primer render' },
      ],
      answer: 1,
      explain: {
        en: 'With no array, React cannot know what the effect depends on, so it re-runs it after every single render.',
        es: 'Sin array, React no sabe de qué depende el efecto, así que lo reejecuta después de cada render.',
      },
    },
    {
      q: { en: 'An effect returns a cleanup function and has [query] as dependencies. When does the cleanup run?', es: 'Un efecto devuelve una función de limpieza y tiene [query] como dependencias. ¿Cuándo se ejecuta la limpieza?' },
      options: [
        { en: 'Only when the component unmounts', es: 'Solo cuando el componente se desmonta' },
        { en: 'Before the effect re-runs (query changed) and on unmount', es: 'Antes de que el efecto se reejecute (query cambió) y al desmontar' },
        { en: 'After the effect runs, every time', es: 'Después de que el efecto se ejecute, cada vez' },
        { en: 'Cleanup never runs for effects with dependencies', es: 'La limpieza nunca se ejecuta en efectos con dependencias' },
      ],
      answer: 1,
      explain: {
        en: 'Cleanup undoes the previous run (cancel the old fetch, clear the old timer) before the next run starts, and once more on unmount.',
        es: 'La limpieza deshace la ejecución anterior (cancela la petición vieja, limpia el temporizador) antes de que empiece la siguiente, y una vez más al desmontar.',
      },
    },
  ],
}
