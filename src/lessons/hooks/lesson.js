// Lesson: what a hook is, the Rules of Hooks, and the six-hooks map.
export default {
  id: 'lesson-hooks',
  moduleId: 'hooks',
  order: 1,
  title: { en: 'What Is a Hook?', es: '¿Qué es un hook?' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'A **hook** is a special function that lets a component "hook into" React features: state, effects, context, memoization. They all start with `use` — `useState`, `useEffect`, `useRef` — and they only work **inside** React components (or inside other hooks).\n\nThink of hooks as the component\'s senses: `useState` gives it memory, `useEffect` lets it act on the world, `useRef` gives it a private notebook, `useContext` lets it listen to distant ancestors.',
        es: 'Un **hook** es una función especial que permite a un componente "engancharse" a funcionalidades de React: estado, efectos, contexto, memoización. Todos empiezan por `use` — `useState`, `useEffect`, `useRef` — y solo funcionan **dentro** de componentes de React (o dentro de otros hooks).\n\nPiensa en los hooks como los sentidos del componente: `useState` le da memoria, `useEffect` le permite actuar sobre el mundo, `useRef` le da un cuaderno privado, `useContext` le permite escuchar a ancestros lejanos.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function Counter() {
  //            👇 a hook: called at the top, every render, same order
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
    },
    {
      kind: 'text',
      body: {
        en: '### The Rules of Hooks\n\nReact identifies each hook **by the order it is called**. That is why there are two iron rules:',
        es: '### Las reglas de los hooks\n\nReact identifica cada hook **por el orden en que se llama**. Por eso hay dos reglas de hierro:',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'Only call hooks at the top level — never inside ifs, loops or nested functions', es: 'Llama a los hooks solo en el nivel superior — nunca dentro de ifs, bucles o funciones anidadas' },
        { en: 'Only call hooks from React functions — components or custom hooks, never plain JS', es: 'Llama a los hooks solo desde funciones de React — componentes o custom hooks, nunca JS plano' },
      ],
    },
    {
      kind: 'text',
      body: {
        en: 'Break the first rule and the order shifts between renders — React hands the state of hook #2 to hook #3, and everything silently corrupts. This is not a style suggestion; it is how React\'s internals work.',
        es: 'Si rompes la primera regla, el orden cambia entre renders: React entrega el estado del hook #2 al hook #3 y todo se corrompe en silencio. No es una sugerencia de estilo; es como funcionan las tripas de React.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `// ❌ WRONG: hook inside a condition
function Profile({ user }) {
  if (!user) return null;
  const [editing, setEditing] = useState(false); // order changes!
  ...
}

// ✅ RIGHT: hooks first, always in the same order
function Profile({ user }) {
  const [editing, setEditing] = useState(false);
  if (!user) return null;
  ...
}`,
    },
    {
      kind: 'callout',
      type: 'danger',
      text: {
        en: 'Conditional hooks are the #1 hooks bug. The linter rule `react-hooks/rules-of-hooks` catches it — never disable it.',
        es: 'Los hooks condicionales son el bug #1 de los hooks. La regla del linter `react-hooks/rules-of-hooks` lo detecta: nunca la desactives.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### The six hooks map\n\nYou already met three of them. Here is the full starter set and where each one lives in this academy:',
        es: '### El mapa de los seis hooks\n\nYa conoces tres de ellos. Aquí está el set inicial completo y dónde vive cada uno en esta academia:',
      },
    },
    {
      kind: 'text',
      body: {
        en: '- **`useState`** — component memory. Change it → re-render. *(State module)*\n- **`useEffect`** — side effects after render: fetching, subscriptions, timers. *(Effects module)*\n- **`useRef`** — a mutable box that survives renders without causing them: DOM nodes, ids, previous values.\n- **`useMemo`** — cache an expensive calculation between renders. *(Performance lab)*\n- **`useCallback`** — cache a function identity between renders. *(Performance lab)*\n- **`useContext`** — read shared data without prop drilling. *(Context module)*\n\nEverything else in React is built from these ideas. Learn them deeply and the advanced patterns become vocabulary, not magic.',
        es: '- **`useState`** — memoria del componente. Cambiarlo → re-render. *(Módulo Estado)*\n- **`useEffect`** — efectos secundarios tras el render: peticiones, suscripciones, temporizadores. *(Módulo Efectos)*\n- **`useRef`** — una caja mutable que sobrevive a los renders sin provocarlos: nodos DOM, ids, valores previos.\n- **`useMemo`** — cachea un cálculo costoso entre renders. *(Laboratorio de rendimiento)*\n- **`useCallback`** — cachea la identidad de una función entre renders. *(Laboratorio de rendimiento)*\n- **`useContext`** — lee datos compartidos sin prop drilling. *(Módulo Context)*\n\nTodo lo demás en React se construye con estas ideas. Apréndelas a fondo y los patrones avanzados se vuelven vocabulario, no magia.',
      },
    },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: 'Custom hooks are just functions that call other hooks — `useLocalStorage`, `useWindowSize`, `useFetch`. If logic uses hooks and is reused, extract it. You will build your own in the Patterns module.',
        es: 'Los custom hooks son solo funciones que llaman a otros hooks: `useLocalStorage`, `useWindowSize`, `useFetch`. Si una lógica usa hooks y se reutiliza, extráela. Construirás los tuyos en el módulo Patrones.',
      },
    },
    { kind: 'labref', labId: 'useref-lab' },
  ],
}
