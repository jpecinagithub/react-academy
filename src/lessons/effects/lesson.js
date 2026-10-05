// Lesson: what useEffect is for, its anatomy, the three dependency-array
// modes, effects run after render, cleanup intro.
export default {
  id: 'lesson-effects',
  moduleId: 'effects',
  order: 1,
  title: { en: 'useEffect: Syncing with the Outside World', es: 'useEffect: sincronizar con el mundo exterior' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### Not everything lives in React\n\nState, props and JSX live inside React. But real apps also touch the **outside world**: the document title, timers, the network, `localStorage`, window events.\n\n`useEffect` is the bridge: it lets your component *synchronize* with those external systems. Think “when X changes, keep Y in sync” — not “do stuff on render”.',
        es: '### No todo vive en React\n\nEl estado, las props y el JSX viven dentro de React. Pero las apps reales también tocan el **mundo exterior**: el título del documento, temporizadores, la red, `localStorage`, eventos de ventana.\n\n`useEffect` es el puente: permite a tu componente *sincronizarse* con esos sistemas externos. Piensa «cuando X cambie, mantén Y sincronizado», no «haz cosas al renderizar».',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `useEffect(() => {
  // the effect: sync with something outside React
  document.title = \`Hello, \${name}\`;

  return () => {
    // the cleanup (optional): undo it before the next run or on unmount
  };
}, [name]); // the dependency array: "re-run when these change"`,
    },
    {
      kind: 'text',
      body: {
        en: '### The three dependency modes\n\nThe second argument answers one question after every render: *“did anything I care about change?”*',
        es: '### Los tres modos de dependencias\n\nEl segundo argumento responde a una pregunta tras cada render: *«¿cambió algo de lo que me importa?»*',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `// 1 — No array: runs after EVERY render
useEffect(() => { console.log('render happened'); });

// 2 — Empty array: runs ONCE, after mount
useEffect(() => { console.log('mounted'); }, []);

// 3 — With deps: runs when a dep CHANGES
useEffect(() => { console.log('count is now', count); }, [count]);`,
    },
    {
      kind: 'callout',
      type: 'info',
      text: {
        en: '**Effects run AFTER render.** React first runs your component function and paints the UI; only then do effects fire. That ordering is why effects are safe for DOM measurements, network calls and timers — the screen is already up to date.',
        es: '**Los efectos se ejecutan DESPUÉS del render.** React primero ejecuta tu función componente y pinta la UI; solo entonces se disparan los efectos. Ese orden es lo que hace seguros a los efectos para medir el DOM, llamar a la red o usar temporizadores: la pantalla ya está actualizada.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### Cleanup: the return function\n\nWhatever the effect starts, the cleanup stops: clear the interval, remove the listener, abort the fetch. React runs the previous cleanup *before* re-running the effect, and one last time on unmount.\n\nA missing cleanup is how apps leak: duplicate timers, stacked event listeners, setState on unmounted components.',
        es: '### Limpieza: la función de retorno\n\nLo que el efecto inicia, la limpieza lo detiene: limpia el intervalo, elimina el listener, aborta la petición. React ejecuta la limpieza anterior *antes* de repetir el efecto, y una última vez al desmontar.\n\nUna limpieza ausente es como las apps gotean: temporizadores duplicados, listeners apilados, setState en componentes desmontados.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `useEffect(() => {
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id); // cleanup: stop the timer
}, [running]);`,
    },
    {
      kind: 'callout',
      type: 'danger',
      text: {
        en: '**Infinite loop trap:** an effect with no dependency array that calls `setState` runs after *every* render — and each run triggers another render. Forever. Fix it with a real dependency array, a condition, or both.',
        es: '**Trampa del bucle infinito:** un efecto sin array de dependencias que llama a `setState` se ejecuta tras *cada* render, y cada ejecución dispara otro render. Para siempre. Arrégalo con un array de dependencias real, una condición, o ambas.',
      },
    },
    {
      kind: 'checklist',
      items: [
        {
          en: 'useEffect synchronizes your component with systems outside React.',
          es: 'useEffect sincroniza tu componente con sistemas fuera de React.',
        },
        {
          en: 'No array → every render. [] → once on mount. [deps] → when deps change.',
          es: 'Sin array → cada render. [] → una vez al montar. [deps] → cuando cambian las deps.',
        },
        {
          en: 'Effects run after React renders and paints.',
          es: 'Los efectos se ejecutan después de que React renderiza y pinta.',
        },
        {
          en: 'The returned function cleans up before the next run and on unmount.',
          es: 'La función devuelta limpia antes de la siguiente ejecución y al desmontar.',
        },
        {
          en: 'setState inside a dep-less effect = infinite loop.',
          es: 'setState dentro de un efecto sin dependencias = bucle infinito.',
        },
      ],
    },
    { kind: 'labref', labId: 'effect-lab' },
    { kind: 'quizref', quizId: 'effects' },
  ],
}
