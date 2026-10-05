// Lesson: data fetching with useEffect + the hooks view of the lifecycle.
export default {
  id: 'lesson-data',
  moduleId: 'data',
  order: 1,
  title: { en: 'Fetching Data', es: 'Carga de datos' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'Components rarely own their data — it lives on a server. React has **no built-in fetcher**: you ask for data inside an **effect**, and you store the answer in **state**. That combination — `useEffect` + `useState` — is the entire data-fetching story.\n\nThe effect runs **after** the component renders, so the first paint happens instantly, with no data yet. Then the response arrives, state updates, and React renders again — this time with data.',
        es: 'Los componentes rara vez son dueños de sus datos: viven en un servidor. React **no trae un cargador incorporado**: pides los datos dentro de un **efecto** y guardas la respuesta en el **estado**. Esa combinación — `useEffect` + `useState` — es toda la historia de la carga de datos.\n\nEl efecto se ejecuta **después** de que el componente se renderice, así que el primer pintado ocurre al instante, aún sin datos. Luego llega la respuesta, el estado se actualiza y React renderiza de nuevo — esta vez con datos.',
      },
    },
    {
      kind: 'flow',
      steps: [
        { label: { en: 'Mount', es: 'Montaje' }, desc: { en: 'component renders with no data', es: 'el componente se renderiza sin datos' } },
        { label: { en: 'Effect runs', es: 'El efecto se ejecuta' }, desc: { en: 'fetch() starts, loading = true', es: 'fetch() comienza, loading = true' } },
        { label: { en: 'Response arrives', es: 'Llega la respuesta' }, desc: { en: 'setData(users) updates state', es: 'setData(users) actualiza el estado' } },
        { label: { en: 'Re-render', es: 'Re-render' }, desc: { en: 'UI shows the list', es: 'la UI muestra la lista' } },
      ],
    },
    {
      kind: 'text',
      body: {
        en: '### The tri-state\n\nEvery fetch UI is three UIs in one. Before writing the happy path, design all three:\n\n- **loading** — skeletons or spinners, rendered immediately\n- **success** — the data, rendered when it arrives\n- **error** — a message plus a way out (retry, go back)\n\nForgetting the error state is the most common beginner bug: the app just sits there, blank, when the network fails.',
        es: '### El tri-estado\n\nToda UI de petición son tres UIs en una. Antes de escribir el camino feliz, diseña las tres:\n\n- **loading** — esqueletos o spinners, renderizados al instante\n- **success** — los datos, renderizados cuando llegan\n- **error** — un mensaje más una salida (reintentar, volver)\n\nOlvidar el estado de error es el bug más común de principiantes: la app se queda ahí, en blanco, cuando falla la red.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function UserList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((users) => { setData(users); setLoading(false); })
      .catch((err) => { setError(err); setLoading(false); });
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorView error={error} onRetry={...} />;
  return <List data={data} />;
}`,
    },
    {
      kind: 'text',
      body: {
        en: '### The `ignore` cleanup\n\nWhat if the user navigates away **while** the request is in flight? The response still arrives — and calling `setState` on an unmounted component is at best wasted work, at worst a bug. The fix is a tiny cleanup: an `ignore` flag that the effect flips when it is torn down.',
        es: '### La limpieza `ignore`\n\n¿Y si el usuario navega a otra pantalla **mientras** la petición está en vuelo? La respuesta llega igual — y llamar a `setState` en un componente desmontado es, en el mejor caso, trabajo inútil y en el peor, un bug. La solución es una pequeña limpieza: una bandera `ignore` que el efecto activa al desmontarse.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `useEffect(() => {
  let ignore = false;

  fetch('/api/users')
    .then((res) => res.json())
    .then((users) => {
      if (ignore) return;   // unmounted → discard the stale response
      setData(users);
    });

  return () => { ignore = true; };  // cleanup runs on unmount
}, []);`,
    },
    {
      kind: 'callout',
      type: 'warn',
      text: {
        en: 'This also fixes **race conditions**: if two fetches overlap, the first effect\'s cleanup discards its slower response, so the UI always shows the latest request.',
        es: 'Esto también corrige las **condiciones de carrera**: si dos peticiones se solapan, la limpieza del primer efecto descarta su respuesta más lenta, y la UI siempre muestra la última petición.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### Lifecycle, the hooks way\n\nYou already know the lifecycle from the simulator: **mount → update → unmount**. With hooks there are no separate lifecycle methods — there is one idea:\n\n- `useEffect(fn, [])` → runs on **mount**; its cleanup runs on **unmount**\n- `useEffect(fn)` → runs after **every** render (every update)\n- `useEffect(fn, [x])` → runs on mount and whenever **x** changes\n\nCleanup is the unmount half of every effect. Master that pairing and the whole lifecycle clicks into place.',
        es: '### El ciclo de vida, a la manera de los hooks\n\nYa conoces el ciclo de vida del simulador: **montaje → actualización → desmontaje**. Con hooks no hay métodos de ciclo de vida separados: hay una sola idea:\n\n- `useEffect(fn, [])` → se ejecuta al **montar**; su limpieza se ejecuta al **desmontar**\n- `useEffect(fn)` → se ejecuta tras **cada** render (cada actualización)\n- `useEffect(fn, [x])` → se ejecuta al montar y cuando **x** cambie\n\nLa limpieza es la mitad de desmontaje de cada efecto. Domina esa pareja y todo el ciclo de vida encaja.',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'I can name the three states of a fetch UI', es: 'Sé nombrar los tres estados de una UI de petición' },
        { en: 'I know why data fetching belongs in an effect', es: 'Sé por qué la carga de datos va en un efecto' },
        { en: 'I can explain the ignore-flag cleanup', es: 'Sé explicar la limpieza con bandera ignore' },
        { en: 'I can map mount/update/unmount to useEffect patterns', es: 'Sé mapear montaje/actualización/desmontaje a patrones de useEffect' },
      ],
    },
    { kind: 'labref', labId: 'fetch-lab' },
    { kind: 'labref', labId: 'lifecycle-sim' },
  ],
}
