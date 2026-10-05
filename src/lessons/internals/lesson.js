export default {
  id: 'lesson-internals',
  moduleId: 'internals',
  order: 1,
  title: {
    en: 'How React really updates the UI',
    es: 'Cómo React actualiza la UI de verdad',
  },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'You already know the surface: state changes → React re-renders → the UI updates. This lesson opens the hood. Four ideas explain almost everything that happens between `setState` and pixels: the **virtual DOM** (a description React compares), **reconciliation** (the rules for keep vs replace), **batching** (why three setters mean one render), and **closures** (why each render is a snapshot).\n\nEach idea has a hands-on lab. Read briefly, then go break things.',
        es: 'Ya conoces la superficie: el estado cambia → React re-renderiza → la UI se actualiza. Esta lección abre el capó. Cuatro ideas explican casi todo lo que ocurre entre `setState` y los píxeles: el **DOM virtual** (una descripción que React compara), la **reconciliación** (las reglas de conservar vs reemplazar), el **batching** (por qué tres setters son un render) y los **closures** (por qué cada render es una instantánea).\n\nCada idea tiene un laboratorio práctico. Lee brevemente y luego ve a romper cosas.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### 1 · Virtual DOM: a description, compared\n\nWhen state changes, React builds a new description of what the UI should look like and **diffs** it against the previous description. Only the nodes that differ are touched in the real DOM.\n\nBe precise here: “virtual DOM” is a **conceptual model** — React’s description of the UI at a point in time — not a second browser DOM living in memory. The diff is what produces minimal updates.',
        es: '### 1 · DOM virtual: una descripción, comparada\n\nCuando el estado cambia, React construye una nueva descripción de cómo debería verse la UI y la **compara** (diff) con la descripción anterior. Solo los nodos que difieren se tocan en el DOM real.\n\nSé preciso aquí: el «DOM virtual» es un **modelo conceptual** —la descripción que React tiene de la UI en un momento dado—, no un segundo DOM del navegador viviendo en memoria. El diff es lo que produce actualizaciones mínimas.',
      },
    },
    {
      kind: 'flow',
      steps: [
        { label: { en: 'Previous description', es: 'Descripción anterior' }, desc: { en: 'what React rendered last time', es: 'lo que React renderizó la última vez' } },
        { label: { en: 'Next description', es: 'Descripción siguiente' }, desc: { en: 'built from the new state', es: 'construida a partir del nuevo estado' } },
        { label: { en: 'Diff', es: 'Diff' }, desc: { en: 'node-by-node comparison', es: 'comparación nodo a nodo' } },
        { label: { en: 'Minimal DOM update', es: 'Actualización mínima del DOM' }, desc: { en: 'only what changed', es: 'solo lo que cambió' } },
      ],
    },
    { kind: 'labref', labId: 'vdom-diff' },
    {
      kind: 'text',
      body: {
        en: '### 2 · Reconciliation: keep, update, move, replace\n\nThe diff follows mechanical rules:\n\n- **Same element type, same key** → keep the DOM node, update what changed (cheapest).\n- **Different element type** → destroy the old node, create a new one. State inside is lost.\n- **Different component type at the same position** → unmount the whole subtree, mount a fresh one.\n- **Lists** → keys tell React which item is which. Stable keys let nodes *move* with their identity; index keys glue identity to the position (the classic key bug).',
        es: '### 2 · Reconciliación: conservar, actualizar, mover, reemplazar\n\nEl diff sigue reglas mecánicas:\n\n- **Mismo tipo de elemento, misma key** → conserva el nodo DOM, actualiza lo que cambió (lo más barato).\n- **Tipo de elemento distinto** → destruye el nodo anterior, crea uno nuevo. El estado interior se pierde.\n- **Tipo de componente distinto en la misma posición** → desmonta todo el subárbol y monta uno nuevo.\n- **Listas** → las keys dicen a React qué elemento es cuál. Las keys estables permiten que los nodos se *muevan* con su identidad; las keys de índice pegan la identidad a la posición (el bug clásico de las keys).',
      },
    },
    { kind: 'labref', labId: 'reconciliation-lab' },
    {
      kind: 'text',
      body: {
        en: '### 3 · Batching: one handler, one render\n\nSetters don’t mutate state — they **enqueue updates**. When the handler finishes, React processes the queue and renders once. And because each render is a **snapshot**, this:\n\n`setCount(count + 1); setCount(count + 1); setCount(count + 1);`\n\n…queues the value `1` three times (all three read the same frozen `count`). The updater form `setCount(c => c + 1)` chains correctly to `3`. Batching is automatic in React 18+.',
        es: '### 3 · Batching: un manejador, un render\n\nLos setters no mutan el estado: **encolan actualizaciones**. Cuando el manejador termina, React procesa la cola y renderiza una vez. Y como cada render es una **instantánea**, esto:\n\n`setCount(count + 1); setCount(count + 1); setCount(count + 1);`\n\n…encola el valor `1` tres veces (las tres leen el mismo `count` congelado). La forma actualizadora `setCount(c => c + 1)` se encadena correctamente hasta `3`. El batching es automático desde React 18.',
      },
    },
    { kind: 'labref', labId: 'batching-lab' },
    {
      kind: 'text',
      body: {
        en: '### 4 · Closures: every render is a snapshot\n\nFunctions created during a render **close over that render’s values**. A `setTimeout` scheduled in render #3 still sees render #3’s `count` — even if the user clicked twice since. That’s the stale-closure trap.\n\nTwo fixes: the **updater form** `setCount(c => c + 1)` when you only need to change state, and a **ref mirror** (`countRef.current`) when you need to read the freshest value from async code.',
        es: '### 4 · Closures: cada render es una instantánea\n\nLas funciones creadas durante un render **capturan los valores de ese render**. Un `setTimeout` programado en el render #3 sigue viendo el `count` del render #3, aunque el usuario haya pulsado dos veces desde entonces. Esa es la trampa del closure obsoleto.\n\nDos soluciones: la **forma actualizadora** `setCount(c => c + 1)` cuando solo necesitas cambiar el estado, y un **espejo con ref** (`countRef.current`) cuando necesitas leer el valor más fresco desde código asíncrono.',
      },
    },
    { kind: 'labref', labId: 'closures-lab' },
    {
      kind: 'checklist',
      items: [
        { en: 'I can explain the virtual DOM as “a description React diffs”, not a DOM copy', es: 'Puedo explicar el DOM virtual como «una descripción que React compara», no como una copia del DOM' },
        { en: 'I know when React keeps, updates, moves or replaces a node', es: 'Sé cuándo React conserva, actualiza, mueve o reemplaza un nodo' },
        { en: 'I can predict the result of three setCount calls — and fix it with the updater form', es: 'Puedo predecir el resultado de tres llamadas a setCount, y corregirlo con la forma actualizadora' },
        { en: 'I can spot a stale closure and fix it with an updater or a ref', es: 'Puedo detectar un closure obsoleto y corregirlo con un actualizador o un ref' },
      ],
    },
  ],
}
