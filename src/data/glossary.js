// Glossary data — drives the Glossary page, the Concept Map node panel and
// the <GlossaryTerm> learning-mode tooltips.
// TERMS: [{ id, term:{en,es}, def:{en,es}, example?: string, lesson: moduleId }]
export const TERMS = [
  {
    id: 'component',
    term: { en: 'component', es: 'componente' },
    def: {
      en: 'A reusable, self-contained piece of UI: a JavaScript function that returns JSX.',
      es: 'Una pieza de UI reutilizable y autocontenida: una función JavaScript que devuelve JSX.',
    },
    example: 'function Button() { return <button>Hi</button> }',
    lesson: 'components',
  },
  {
    id: 'jsx',
    term: { en: 'JSX', es: 'JSX' },
    def: {
      en: 'A syntax extension that lets you write markup-like code inside JavaScript. React turns it into element-creation calls.',
      es: 'Una extensión de sintaxis para escribir código parecido al marcado dentro de JavaScript. React lo convierte en llamadas de creación de elementos.',
    },
    example: '<h1>Hello {name}</h1>',
    lesson: 'jsx',
  },
  {
    id: 'props',
    term: { en: 'props', es: 'props' },
    def: {
      en: 'Inputs a parent component passes to a child. Read-only: the child must never mutate them.',
      es: 'Entradas que un componente padre pasa a un hijo. De solo lectura: el hijo nunca debe mutarlas.',
    },
    example: '<UserCard name="Alex" age={32} />',
    lesson: 'props',
  },
  {
    id: 'state',
    term: { en: 'state', es: 'estado' },
    def: {
      en: 'Data owned by a component that can change over time. Changing it tells React to render the component again.',
      es: 'Datos propios de un componente que pueden cambiar con el tiempo. Cambiarlos indica a React que debe renderizar el componente de nuevo.',
    },
    example: 'const [count, setCount] = useState(0)',
    lesson: 'state',
  },
  {
    id: 'hook',
    term: { en: 'hook', es: 'hook' },
    def: {
      en: 'A special function (useState, useEffect, …) that lets a component "hook into" React features like state and lifecycle.',
      es: 'Una función especial (useState, useEffect, …) que permite a un componente «engancharse» a funciones de React como el estado o el ciclo de vida.',
    },
    example: 'const [count, setCount] = useState(0)',
    lesson: 'hooks',
  },
  {
    id: 'render',
    term: { en: 'render', es: 'render' },
    def: {
      en: 'What happens when React executes your component function to compute what the UI should look like right now.',
      es: 'Lo que ocurre cuando React ejecuta tu función componente para calcular cómo debe verse la UI ahora mismo.',
    },
    example: 'setCount(c => c + 1) // triggers a re-render',
    lesson: 'rendering',
  },
  {
    id: 'effect',
    term: { en: 'effect', es: 'efecto' },
    def: {
      en: 'Side work a component performs after rendering — fetching data, subscriptions, timers — declared with useEffect.',
      es: 'Trabajo secundario que un componente realiza después de renderizar (pedir datos, suscripciones, temporizadores), declarado con useEffect.',
    },
    example: 'useEffect(() => { … }, [count])',
    lesson: 'effects',
  },
  {
    id: 'ref',
    term: { en: 'ref', es: 'ref' },
    def: {
      en: 'A mutable container (useRef) that persists across renders without causing a new render when changed.',
      es: 'Un contenedor mutable (useRef) que persiste entre renders sin provocar un nuevo render al cambiar.',
    },
    example: 'const inputRef = useRef(null)',
    lesson: 'hooks',
  },
  {
    id: 'context',
    term: { en: 'context', es: 'contexto' },
    def: {
      en: 'A way to share data through the component tree without passing props through every level.',
      es: 'Una forma de compartir datos a través del árbol de componentes sin pasar props por cada nivel.',
    },
    example: '<ThemeContext.Provider value="dark">',
    lesson: 'context',
  },
  {
    id: 'key',
    term: { en: 'key', es: 'key' },
    def: {
      en: 'A stable identifier you give list items so React can tell them apart between renders.',
      es: 'Un identificador estable que das a los elementos de una lista para que React los distinga entre renders.',
    },
    example: 'users.map(u => <li key={u.id}>{u.name}</li>)',
    lesson: 'conditional-lists',
  },
  {
    id: 'virtual-dom',
    term: { en: 'virtual DOM', es: 'DOM virtual' },
    def: {
      en: 'A conceptual model: React keeps a lightweight description of the UI in memory and compares snapshots to compute minimal updates.',
      es: 'Un modelo conceptual: React mantiene en memoria una descripción ligera de la UI y compara instantáneas para calcular actualizaciones mínimas.',
    },
    lesson: 'internals',
  },
  {
    id: 'reconciliation',
    term: { en: 'reconciliation', es: 'reconciliación' },
    def: {
      en: 'The algorithm React uses to compare two UI descriptions and decide what actually changed in the DOM.',
      es: 'El algoritmo que usa React para comparar dos descripciones de la UI y decidir qué cambió realmente en el DOM.',
    },
    lesson: 'internals',
  },
  {
    id: 'memoization',
    term: { en: 'memoization', es: 'memoización' },
    def: {
      en: 'Caching an expensive result (useMemo) or a stable reference (useCallback, memo) so it is not recomputed on every render.',
      es: 'Almacenar en caché un resultado costoso (useMemo) o una referencia estable (useCallback, memo) para no recalcularlo en cada render.',
    },
    example: 'const total = useMemo(() => compute(cart), [cart])',
    lesson: 'hooks',
  },
  {
    id: 'batching',
    term: { en: 'batching', es: 'batching' },
    def: {
      en: 'React groups multiple state updates from the same event into a single render for performance.',
      es: 'React agrupa varias actualizaciones de estado del mismo evento en un solo render por rendimiento.',
    },
    example: 'setCount(c => c + 1); setCount(c => c + 1)',
    lesson: 'hooks',
  },
  {
    id: 'closure',
    term: { en: 'closure', es: 'clausura' },
    def: {
      en: 'A function that "remembers" the variables from the render where it was created — the source of stale values in timers and effects.',
      es: 'Una función que «recuerda» las variables del render donde se creó: el origen de los valores obsoletos en temporizadores y efectos.',
    },
    lesson: 'hooks',
  },
  {
    id: 'immutability',
    term: { en: 'immutability', es: 'inmutabilidad' },
    def: {
      en: 'Updating state by creating a new object/array instead of mutating the old one, so React can detect the change.',
      es: 'Actualizar el estado creando un objeto/array nuevo en lugar de mutar el anterior, para que React detecte el cambio.',
    },
    example: 'setUser({ ...user, name: "Alex" })',
    lesson: 'hooks',
  },
  {
    id: 'lifting-state',
    term: { en: 'lifting state up', es: 'elevar el estado' },
    def: {
      en: 'Moving shared state to the closest common parent so sibling components can use it via props.',
      es: 'Mover el estado compartido al padre común más cercano para que los hermanos lo usen vía props.',
    },
    lesson: 'thinking',
  },
  {
    id: 'controlled',
    term: { en: 'controlled component', es: 'componente controlado' },
    def: {
      en: 'A form input whose value is driven by React state (value + onChange), not by the DOM.',
      es: 'Un input de formulario cuyo valor lo controla el estado de React (value + onChange), no el DOM.',
    },
    example: '<input value={name} onChange={e => setName(e.target.value)} />',
    lesson: 'forms',
  },
  {
    id: 'mount',
    term: { en: 'mount', es: 'montaje' },
    def: {
      en: 'The moment a component is created and inserted into the DOM for the first time.',
      es: 'El momento en que un componente se crea y se inserta en el DOM por primera vez.',
    },
    lesson: 'effects',
  },
  {
    id: 'unmount',
    term: { en: 'unmount', es: 'desmontaje' },
    def: {
      en: 'The moment a component is removed from the DOM. Effects can return a cleanup function that runs here.',
      es: 'El momento en que un componente se elimina del DOM. Los efectos pueden devolver una función de limpieza que se ejecuta aquí.',
    },
    example: 'useEffect(() => { return () => clearInterval(id) }, [])',
    lesson: 'effects',
  },
  {
    id: 'prop-drilling',
    term: { en: 'prop drilling', es: 'prop drilling' },
    def: {
      en: 'Passing props through many intermediate components that do not use them, just to reach a deeply nested child.',
      es: 'Pasar props a través de muchos componentes intermedios que no las usan, solo para llegar a un hijo profundo.',
    },
    lesson: 'context',
  },
  {
    id: 'spa',
    term: { en: 'SPA', es: 'SPA' },
    def: {
      en: 'Single-Page Application: one HTML page whose content React swaps as you navigate, without full page reloads.',
      es: 'Single-Page Application: una sola página HTML cuyo contenido React intercambia al navegar, sin recargas completas.',
    },
    lesson: 'why-react',
  },
  {
    id: 'declarative',
    term: { en: 'declarative', es: 'declarativo' },
    def: {
      en: 'Describing what the UI should look like for a given state; React handles the how.',
      es: 'Describir cómo debe verse la UI para un estado dado; React se encarga del cómo.',
    },
    lesson: 'why-react',
  },
  {
    id: 'imperative',
    term: { en: 'imperative', es: 'imperativo' },
    def: {
      en: 'Describing step by step how to update the UI (find element, change it) — the vanilla-JS way.',
      es: 'Describir paso a paso cómo actualizar la UI (buscar elemento, cambiarlo): la forma del JS tradicional.',
    },
    lesson: 'why-react',
  },
]

export function termDef(id, lang = 'en') {
  const t = TERMS.find((x) => x.id === id)
  if (!t) return null
  return {
    id: t.id,
    term: t.term[lang] ?? t.term.en,
    def: t.def[lang] ?? t.def.en,
    example: t.example,
    lesson: t.lesson,
  }
}
