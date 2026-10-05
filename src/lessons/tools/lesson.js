// Lesson: tools — reading component trees, profilers, real DevTools, StrictMode.
export default {
  id: 'lesson-tools',
  moduleId: 'tools',
  order: 1,
  title: { en: 'DevTools & Profiler: see inside your app', es: 'DevTools y profiler: mira dentro de tu app' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'So far you have learned React by watching simulations. Real apps need real X-ray vision: **which components exist, what props and state each one holds, and how often each one renders**. That is what React DevTools and the Profiler give you.\n\n### Reading a component tree\n\nOpen the Components tab and you see your UI as React sees it: a tree of components, not DOM nodes. Select any component to inspect its **props** (what its parent gave it), its **state** (what it owns) and its **hooks**.\n\n- A component with unexpected props? Follow the tree **up** — the parent passed them.\n- A component rendering too often? Check **why it rendered**: did its props change, or did its parent re-render?\n- Stale UI? Compare the props in DevTools with what you expected — a mutated object looks identical here, which is exactly the trap from the Immutability Lab.',
        es: 'Hasta ahora has aprendido React observando simulaciones. Las apps reales necesitan visión de rayos X de verdad: **qué componentes existen, qué props y estado tiene cada uno y con qué frecuencia se renderiza cada uno**. Eso es lo que te dan React DevTools y el Profiler.\n\n### Leer un árbol de componentes\n\nAbre la pestaña Components y verás tu UI como la ve React: un árbol de componentes, no de nodos DOM. Selecciona cualquier componente para inspeccionar sus **props** (lo que le dio su padre), su **estado** (lo que posee) y sus **hooks**.\n\n- ¿Un componente con props inesperadas? Sigue el árbol **hacia arriba**: el padre se las pasó.\n- ¿Un componente que se renderiza demasiado? Comprueba **por qué se renderizó**: ¿cambiaron sus props o se re-renderizó su padre?\n- ¿UI obsoleta? Compara las props en DevTools con lo que esperabas: un objeto mutado se ve idéntico aquí, que es exactamente la trampa del Laboratorio de inmutabilidad.',
      },
    },
    { kind: 'labref', labId: 'devtools-sim' },
    {
      kind: 'text',
      body: {
        en: '### Why profilers matter\n\nRendering is fast — until it is not. A profiler records a **session** while you interact with the app, then ranks components by render count and time. The pattern you are hunting is always the same:\n\n- **One hot component** rendering far more than its siblings.\n- A parent re-rendering **children whose props never changed**.\n- State living **too high**, so a keystroke re-renders the whole page.\n\nThe fixes are the ones you already know: `memo` for stable props, **splitting** big components so hot spots are isolated, and **moving state down** to where it is used.',
        es: '### Por qué importan los profilers\n\nRenderizar es rápido, hasta que deja de serlo. Un profiler graba una **sesión** mientras interactúas con la app y luego ordena los componentes por número de renders y tiempo. El patrón que buscas es siempre el mismo:\n\n- **Un componente caliente** que se renderiza mucho más que sus hermanos.\n- Un padre que re-renderiza **hijos cuyas props nunca cambiaron**.\n- Estado **demasiado alto**, de modo que cada tecla re-renderiza toda la página.\n\nLas soluciones son las que ya conoces: `memo` para props estables, **dividir** componentes grandes para aislar los puntos calientes y **bajar el estado** hasta donde se usa.',
      },
    },
    { kind: 'labref', labId: 'render-profiler' },
    {
      kind: 'text',
      body: {
        en: '### Using the real React DevTools\n\n1. Install the **React Developer Tools** browser extension (Chrome, Firefox, Edge).\n2. Open any React app and press F12: you will see two new tabs, **Components** and **Profiler**.\n3. In Components, click the ⚛ icon and hover the page — DevTools highlights the component under your cursor.\n4. In Profiler, press record, interact, stop — then click any bar to see **why each component rendered**.\n\n### A word on StrictMode\n\nIn development, React’s `<StrictMode>` intentionally **double-invokes** renders, effects and updaters to surface impure code. If your console shows double logs or effects running twice locally, that is StrictMode doing its job — production builds render once.',
        es: '### Usar las React DevTools reales\n\n1. Instala la extensión **React Developer Tools** en tu navegador (Chrome, Firefox, Edge).\n2. Abre cualquier app React y pulsa F12: verás dos pestañas nuevas, **Components** y **Profiler**.\n3. En Components, pulsa el icono ⚛ y pasa el cursor por la página: DevTools resalta el componente bajo el cursor.\n4. En Profiler, pulsa grabar, interactúa, detén, y luego pulsa cualquier barra para ver **por qué se renderizó cada componente**.\n\n### Una palabra sobre StrictMode\n\nEn desarrollo, `<StrictMode>` de React **invoca dos veces** a propósito los renders, efectos y actualizadores para revelar código impuro. Si tu consola muestra logs duplicados o efectos que se ejecutan dos veces en local, es StrictMode haciendo su trabajo; en producción se renderiza una sola vez.',
      },
    },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: 'Debugging mantra: props come from above, state lives inside, renders come from either. When something looks wrong, ask the tree — not the DOM.',
        es: 'Mantra de depuración: las props vienen de arriba, el estado vive dentro, los renders vienen de ambos. Cuando algo se ve mal, pregunta al árbol, no al DOM.',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'I can read a component tree and find where a prop came from', es: 'Sé leer un árbol de componentes y encontrar de dónde vino una prop' },
        { en: 'I can inspect a component’s props, state and hooks in DevTools', es: 'Sé inspeccionar las props, el estado y los hooks de un componente en DevTools' },
        { en: 'I can record a Profiler session and name the hottest component', es: 'Sé grabar una sesión del Profiler y nombrar el componente más caliente' },
        { en: 'I know the three classic fixes: memo, split, move state down', es: 'Conozco las tres soluciones clásicas: memo, dividir, bajar el estado' },
      ],
    },
  ],
}
