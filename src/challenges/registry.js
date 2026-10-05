/* Challenge registry — Phase 9.
 * Three types:
 *  - 'fill-blank': template code contains `____` placeholders; blanks[i] = { answer, alternatives? }
 *  - 'bug-hunt':   clickable line numbers → pick the buggy line → pick the fix from 3 options
 *  - 'predict':    4 option cards → answer → step-by-step walkthrough reveal
 * Completion is recorded via completeChallenge(id) → progress.challenges[id].
 */

export const CHALLENGES = [
  /* ================= FILL IN THE BLANK ================= */
  {
    id: 'fb-usestate-destructure',
    type: 'fill-blank',
    moduleId: 'state',
    difficulty: 'beginner',
    title: { en: 'Destructure useState', es: 'Desestructura useState' },
    prompt: {
      en: 'Complete the useState destructuring so the counter works.',
      es: 'Completa la desestructuración de useState para que el contador funcione.',
    },
    template: `function Counter() {
  const [____, ____] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
    blanks: [{ answer: 'count' }, { answer: 'setCount' }],
    explanation: {
      en: 'useState returns a pair: the current value and a function that updates it. Array destructuring gives them names — the second one conventionally starts with "set".',
      es: 'useState devuelve una pareja: el valor actual y una función para actualizarlo. La desestructuración de arrays les da nombre — la segunda por convención empieza por "set".',
    },
  },
  {
    id: 'fb-onclick-handler',
    type: 'fill-blank',
    moduleId: 'events',
    difficulty: 'beginner',
    title: { en: 'Wire up onClick', es: 'Conecta onClick' },
    prompt: {
      en: 'Complete the event handler so clicking the button likes the post.',
      es: 'Completa el manejador de eventos para que el clic marque "me gusta".',
    },
    template: `function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => ____(true)}>
      {liked ? "❤️" : "🤍"}
    </button>
  );
}`,
    blanks: [{ answer: 'setLiked' }],
    explanation: {
      en: 'The setter is the only way to change state. The arrow function wrapper means it runs on click — not during render.',
      es: 'El setter es la única forma de cambiar el estado. La función flecha hace que se ejecute al hacer clic, no durante el render.',
    },
  },
  {
    id: 'fb-map-key',
    type: 'fill-blank',
    moduleId: 'conditional-lists',
    difficulty: 'beginner',
    title: { en: 'Map a list with keys', es: 'Renderiza una lista con keys' },
    prompt: {
      en: 'Complete the list rendering: give each <li> a stable key and show the user name.',
      es: 'Completa el renderizado de la lista: dale a cada <li> una key estable y muestra el nombre.',
    },
    template: `function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={____}>{____}</li>
      ))}
    </ul>
  );
}`,
    blanks: [{ answer: 'user.id' }, { answer: 'user.name' }],
    explanation: {
      en: 'Keys let React track which item is which across renders. Use a stable, unique id from your data — never the array index for changing lists.',
      es: 'Las keys permiten a React saber qué elemento es cuál entre renders. Usa un id estable y único de tus datos, nunca el índice del array en listas que cambian.',
    },
  },
  {
    id: 'fb-ternary',
    type: 'fill-blank',
    moduleId: 'conditional-lists',
    difficulty: 'beginner',
    title: { en: 'Conditional render', es: 'Renderizado condicional' },
    prompt: {
      en: 'Show the Dashboard when logged in, otherwise show the login screen.',
      es: 'Muestra el Dashboard si hay sesión iniciada; si no, la pantalla de login.',
    },
    template: `function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? <Dashboard /> : <____ />;
}`,
    blanks: [{ answer: 'Login' }],
    explanation: {
      en: 'Conditional rendering in React is plain JavaScript — a ternary picks one of two elements. Note the capital letter: <Login /> is a component, <login /> would be an HTML tag.',
      es: 'El renderizado condicional en React es JavaScript normal: un ternario elige uno de dos elementos. Fíjate en la mayúscula: <Login /> es un componente, <login /> sería una etiqueta HTML.',
    },
  },
  {
    id: 'fb-controlled-input',
    type: 'fill-blank',
    moduleId: 'forms',
    difficulty: 'beginner',
    title: { en: 'Controlled input', es: 'Input controlado' },
    prompt: {
      en: 'Bind the input to state so React is the single source of truth for its value.',
      es: 'Vincula el input al estado para que React sea la única fuente de verdad de su valor.',
    },
    template: `function NameForm() {
  const [name, setName] = useState("");

  return (
    <input
      value={____}
      onChange={(e) => ____(e.target.value)}
    />
  );
}`,
    blanks: [{ answer: 'name' }, { answer: 'setName' }],
    explanation: {
      en: 'A controlled input gets its value from state and updates that state on every keystroke: input → onChange → setName → state → value. A full circle.',
      es: 'Un input controlado recibe su valor del estado y lo actualiza con cada tecla: input → onChange → setName → estado → value. Un círculo completo.',
    },
  },
  {
    id: 'fb-useeffect-deps',
    type: 'fill-blank',
    moduleId: 'effects',
    difficulty: 'beginner',
    title: { en: 'Choose the dependency', es: 'Elige la dependencia' },
    prompt: {
      en: 'The effect syncs the tab title with the count. When should it re-run?',
      es: 'El efecto sincroniza el título de la pestaña con el contador. ¿Cuándo debe repetirse?',
    },
    template: `function TitleUpdater({ count }) {
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [____]);

  return <p>{count}</p>;
}`,
    blanks: [{ answer: 'count' }],
    explanation: {
      en: 'The dependency array lists every reactive value the effect reads. When count changes, the effect re-runs; when it does not, it stays quiet.',
      es: 'El array de dependencias lista cada valor reactivo que el efecto lee. Cuando count cambia, el efecto se repite; cuando no, permanece en silencio.',
    },
  },
  {
    id: 'fb-context-provider',
    type: 'fill-blank',
    moduleId: 'context',
    difficulty: 'intermediate',
    title: { en: 'Provide the context', es: 'Provee el contexto' },
    prompt: {
      en: 'Share the theme with the whole tree without passing props manually.',
      es: 'Comparte el tema con todo el árbol sin pasar props manualmente.',
    },
    template: `const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("dark");

  return (
    <ThemeContext.____ value={____}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}`,
    blanks: [{ answer: 'Provider' }, { answer: 'theme' }],
    explanation: {
      en: '<Context.Provider value={...}> makes a value available to every descendant that calls useContext — no prop drilling through components in between.',
      es: '<Context.Provider value={...}> pone un valor a disposición de todos los descendientes que usen useContext, sin taladrar props por los componentes intermedios.',
    },
  },
  {
    id: 'fb-functional-setstate',
    type: 'fill-blank',
    moduleId: 'state',
    difficulty: 'intermediate',
    title: { en: 'Functional setState', es: 'setState funcional' },
    prompt: {
      en: 'Add 3 to the count with three updater calls. Use the functional form so every call sees the latest value.',
      es: 'Suma 3 al contador con tres llamadas. Usa la forma funcional para que cada llamada vea el último valor.',
    },
    template: `function Counter() {
  const [count, setCount] = useState(0);

  function addThree() {
    setCount((____) => ____ + 1);
    setCount((____) => ____ + 1);
    setCount((____) => ____ + 1);
  }

  return <button onClick={addThree}>{count}</button>;
}`,
    blanks: [
      { answer: 'prev', alternatives: ['c', 'p', 'count', 'previous'] },
      { answer: 'prev', alternatives: ['c', 'p', 'count', 'previous'] },
      { answer: 'prev', alternatives: ['c', 'p', 'count', 'previous'] },
      { answer: 'prev', alternatives: ['c', 'p', 'count', 'previous'] },
      { answer: 'prev', alternatives: ['c', 'p', 'count', 'previous'] },
      { answer: 'prev', alternatives: ['c', 'p', 'count', 'previous'] },
    ],
    explanation: {
      en: 'An updater function receives the latest queued state instead of the stale snapshot from this render. Three updaters → 1 + 1 + 1 = 3. With setCount(count + 1) three times, all three would queue the same value and you would only get +1.',
      es: 'Una función actualizadora recibe el último estado en cola en vez de la foto obsoleta de este render. Tres actualizadores → 1 + 1 + 1 = 3. Con setCount(count + 1) tres veces, las tres encolarían el mismo valor y solo sumarías 1.',
    },
  },

  /* ================= BUG HUNT ================= */
  {
    id: 'bh-infinite-effect',
    type: 'bug-hunt',
    moduleId: 'effects',
    difficulty: 'beginner',
    title: { en: 'The infinite fetch', es: 'El fetch infinito' },
    prompt: {
      en: 'This component should fetch users once on mount — but the tab freezes. Click the buggy line.',
      es: 'Este componente debería cargar los usuarios una vez al montar, pero la pestaña se congela. Haz clic en la línea con el bug.',
    },
    buggyCode: `function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, [users]);
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}`,
    bugLine: 5,
    fixes: [
      {
        en: 'Change [users] to [] so the effect runs only once after mount.',
        es: 'Cambia [users] por [] para que el efecto se ejecute solo una vez al montar.',
      },
      {
        en: 'Remove the dependency array entirely.',
        es: 'Elimina por completo el array de dependencias.',
      },
      {
        en: 'Add setUsers to the dependency array.',
        es: 'Añade setUsers al array de dependencias.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'setUsers creates a new array → the component re-renders → users "changed" → the effect runs again → another fetch… forever. The effect does not read users at all, so it should run once: []. Removing the array runs it after every render — the same trap.',
      es: 'setUsers crea un array nuevo → el componente re-renderiza → users "cambió" → el efecto se repite → otro fetch… para siempre. El efecto ni siquiera lee users, así que debe ejecutarse una vez: []. Quitar el array lo ejecuta tras cada render: la misma trampa.',
    },
  },
  {
    id: 'bh-missing-key',
    type: 'bug-hunt',
    moduleId: 'conditional-lists',
    difficulty: 'beginner',
    title: { en: 'The missing key', es: 'La key que falta' },
    prompt: {
      en: 'No crash — but React prints a console warning and list updates behave oddly. Find the guilty line.',
      es: 'No hay error visible, pero React muestra un aviso en consola y la lista se comporta raro al actualizarse. Encuentra la línea culpable.',
    },
    buggyCode: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li>{todo.text}</li>
      ))}
    </ul>
  );
}`,
    bugLine: 5,
    fixes: [
      {
        en: 'Add key={todo.id} to the <li>.',
        es: 'Añade key={todo.id} al <li>.',
      },
      {
        en: 'Add key to the <ul> instead.',
        es: 'Añade la key al <ul> en su lugar.',
      },
      {
        en: 'Add key={Math.random()} to the <li>.',
        es: 'Añade key={Math.random()} al <li>.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'Keys go on the elements inside the list, not on the list itself — and they must be stable across renders. Math.random() creates a brand-new identity on every render, which is worse than no key at all.',
      es: 'Las keys van en los elementos dentro de la lista, no en la lista, y deben ser estables entre renders. Math.random() crea una identidad nueva en cada render, peor que no tener key.',
    },
  },
  {
    id: 'bh-mutating-state',
    type: 'bug-hunt',
    moduleId: 'state',
    difficulty: 'beginner',
    title: { en: 'The silent mutation', es: 'La mutación silenciosa' },
    prompt: {
      en: 'Clicking the button does nothing on screen. Which line mutates state directly?',
      es: 'Al pulsar el botón no cambia nada en pantalla. ¿Qué línea muta el estado directamente?',
    },
    buggyCode: `function Profile() {
  const [user, setUser] = useState({ name: "Jon", role: "Developer" });
  function promote() {
    user.role = "Senior Developer";
    setUser(user);
  }
  return <button onClick={promote}>{user.role}</button>;
}`,
    bugLine: 4,
    fixes: [
      {
        en: 'Replace both lines with setUser({ ...user, role: "Senior Developer" }).',
        es: 'Sustituye ambas líneas por setUser({ ...user, role: "Senior Developer" }).',
      },
      {
        en: 'Keep the mutation, then spread: setUser({ ...user }).',
        es: 'Mantén la mutación y luego expande: setUser({ ...user }).',
      },
      {
        en: 'Call setUser(user) twice to force the update.',
        es: 'Llama a setUser(user) dos veces para forzar la actualización.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'user.role = ... changes the SAME object React already holds, so the reference never changes and React sees "nothing new". Always build a new object ({ ...user, role }) — immutability is how React detects changes.',
      es: 'user.role = ... modifica el MISMO objeto que React ya tiene, así que la referencia no cambia y React ve "nada nuevo". Construye siempre un objeto nuevo ({ ...user, role }): la inmutabilidad es como React detecta los cambios.',
    },
  },
  {
    id: 'bh-setter-in-render',
    type: 'bug-hunt',
    moduleId: 'state',
    difficulty: 'beginner',
    title: { en: 'Setter during render', es: 'Setter durante el render' },
    prompt: {
      en: '"Too many re-renders" error. Which line updates state while React is rendering?',
      es: 'Error "Too many re-renders". ¿Qué línea actualiza el estado mientras React está renderizando?',
    },
    buggyCode: `function Counter() {
  const [count, setCount] = useState(0);
  if (count < 5) {
    setCount(count + 1);
  }
  return <p>{count}</p>;
}`,
    bugLine: 4,
    fixes: [
      {
        en: 'Move the update into a useEffect with [count] as its dependency.',
        es: 'Mueve la actualización a un useEffect con [count] como dependencia.',
      },
      {
        en: 'Wrap the call in setTimeout inside the render.',
        es: 'Envuelve la llamada en un setTimeout dentro del render.',
      },
      {
        en: 'Change the condition to count <= 5.',
        es: 'Cambia la condición a count <= 5.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'Calling a setter during render schedules another render, which calls the setter again — an infinite loop. Side effects belong in useEffect, which runs after the render is committed.',
      es: 'Llamar a un setter durante el render programa otro render, que vuelve a llamar al setter: un bucle infinito. Los efectos secundarios pertenecen a useEffect, que se ejecuta después de confirmar el render.',
    },
  },
  {
    id: 'bh-onclick-call',
    type: 'bug-hunt',
    moduleId: 'events',
    difficulty: 'beginner',
    title: { en: 'Called, not passed', es: 'Llamado, no pasado' },
    prompt: {
      en: 'The app crashes with "Too many re-renders" before you even click. Which line calls the handler instead of passing it?',
      es: 'La app falla con "Too many re-renders" antes de que hagas clic. ¿Qué línea llama al manejador en vez de pasarlo?',
    },
    buggyCode: `function App() {
  const [count, setCount] = useState(0);
  function handleClick() { setCount(count + 1); }
  return (
    <button onClick={handleClick()}>
      Clicks: {count}
    </button>
  );
}`,
    bugLine: 5,
    fixes: [
      {
        en: 'onClick={handleClick} — pass the function, do not call it.',
        es: 'onClick={handleClick}: pasa la función, no la llames.',
      },
      {
        en: 'onClick="handleClick" — use a string.',
        es: 'onClick="handleClick": usa un string.',
      },
      {
        en: 'onClick={() => handleClick} — wrap it in an arrow function.',
        es: 'onClick={() => handleClick}: envuélvelo en una función flecha.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'onClick={handleClick()} runs the function during render — and since it calls setCount, every render triggers another render. Pass the reference (handleClick) or wrap the call: () => handleClick(). The third option wraps but never calls it.',
      es: 'onClick={handleClick()} ejecuta la función durante el render, y como llama a setCount, cada render dispara otro render. Pasa la referencia (handleClick) o envuelve la llamada: () => handleClick(). La tercera opción la envuelve pero nunca la llama.',
    },
  },
  {
    id: 'bh-stale-timeout',
    type: 'bug-hunt',
    moduleId: 'effects',
    difficulty: 'intermediate',
    title: { en: 'The stale timeout', es: 'El timeout obsoleto' },
    prompt: {
      en: 'Click three times quickly, wait a second… the counter only reaches 1. Which line captured a stale value?',
      es: 'Pulsa tres veces rápido, espera un segundo… el contador solo llega a 1. ¿Qué línea capturó un valor obsoleto?',
    },
    buggyCode: `function DelayedCounter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }
  return <button onClick={handleClick}>{count}</button>;
}`,
    bugLine: 5,
    fixes: [
      {
        en: 'Use the functional form: setCount((c) => c + 1).',
        es: 'Usa la forma funcional: setCount((c) => c + 1).',
      },
      {
        en: 'Add count to a useEffect dependency array.',
        es: 'Añade count a un array de dependencias de useEffect.',
      },
      {
        en: 'Store count in a ref and read ref.current instead.',
        es: 'Guarda count en un ref y lee ref.current en su lugar.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'Each timeout callback captured the count from the render when it was created — all three captured 0, so all three queued 1. The functional updater reads the latest queued value instead of the stale snapshot.',
      es: 'Cada callback del timeout capturó el count del render en que se creó: los tres capturaron 0, así que los tres encolaron 1. La forma funcional lee el último valor en cola en vez de la foto obsoleta.',
    },
  },
  {
    id: 'bh-prop-drilling',
    type: 'bug-hunt',
    moduleId: 'context',
    difficulty: 'intermediate',
    title: { en: 'The prop drill', es: 'El taladro de props' },
    prompt: {
      en: 'No crash — but only Avatar actually needs user; Layout and Dashboard just forward it. Which line shows the design smell?',
      es: 'No hay error, pero solo Avatar necesita user; Layout y Dashboard solo lo reenvían. ¿Qué línea muestra el problema de diseño?',
    },
    buggyCode: `function App() {
  const [user] = useState({ name: "Jon" });
  return <Layout user={user} />;
}
function Layout({ user }) {
  return <Dashboard user={user} />;
}
function Dashboard({ user }) {
  return <Avatar user={user} />;
}
function Avatar({ user }) {
  return <img src={user.avatar} alt={user.name} />;
}`,
    bugLine: 5,
    fixes: [
      {
        en: 'Create a UserContext and consume it directly inside Avatar.',
        es: 'Crea un UserContext y consúmelo directamente dentro de Avatar.',
      },
      {
        en: 'Pass name and avatar as separate props instead of the user object.',
        es: 'Pasa name y avatar como props separadas en vez del objeto user.',
      },
      {
        en: 'Move the useState into Layout.',
        es: 'Mueve el useState a Layout.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'Prop drilling forces middle components to carry data they never use — every rename ripples through the tree. A Context Provider at the top and useContext in Avatar removes the middlemen entirely.',
      es: 'El prop drilling obliga a los componentes intermedios a transportar datos que no usan: cada cambio se propaga por el árbol. Un Provider de contexto arriba y useContext en Avatar elimina los intermediarios.',
    },
  },
  {
    id: 'bh-inline-object',
    type: 'bug-hunt',
    moduleId: 'patterns',
    difficulty: 'intermediate',
    title: { en: 'The memo that never worked', es: 'El memo que nunca funcionó' },
    prompt: {
      en: 'Chart is wrapped in memo(), yet it re-renders on every click. Which line breaks the memoization?',
      es: 'Chart está envuelto en memo(), pero se re-renderiza con cada clic. ¿Qué línea rompe la memoización?',
    },
    buggyCode: `const Chart = memo(function Chart({ config }) {
  return <canvas data-theme={config.theme} />;
});
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Chart config={{ theme: "dark" }} />
    </>
  );
}`,
    bugLine: 9,
    fixes: [
      {
        en: "Hoist the object: const config = useMemo(() => ({ theme: 'dark' }), []) and pass config.",
        es: "Saca el objeto: const config = useMemo(() => ({ theme: 'dark' }), []) y pasa config.",
      },
      {
        en: 'Wrap App in memo() too.',
        es: 'Envuelve también App en memo().',
      },
      {
        en: 'Remove memo() from Chart — memo never helps with object props.',
        es: 'Quita memo() de Chart: memo nunca ayuda con props de tipo objeto.',
      },
    ],
    fixAnswer: 0,
    explanation: {
      en: 'memo() compares props by reference. { theme: "dark" } creates a brand-new object on every render, so the comparison always fails. useMemo keeps the same reference until its dependencies change.',
      es: 'memo() compara las props por referencia. { theme: "dark" } crea un objeto nuevo en cada render, así que la comparación siempre falla. useMemo mantiene la misma referencia hasta que cambian sus dependencias.',
    },
  },

  /* ================= PREDICT THE OUTPUT ================= */
  {
    id: 'pr-batching',
    type: 'predict',
    moduleId: 'state',
    difficulty: 'intermediate',
    title: { en: 'Three setters, one click', es: 'Tres setters, un clic' },
    prompt: {
      en: 'Study the component, then predict: the user clicks the button once. What number does it show afterwards?',
      es: 'Estudia el componente y predice: el usuario pulsa el botón una vez. ¿Qué número muestra después?',
    },
    code: `function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={handleClick}>{count}</button>;
}`,
    question: {
      en: 'What does the button display after one click?',
      es: '¿Qué muestra el botón tras un clic?',
    },
    options: [{ en: '1', es: '1' }, { en: '3', es: '3' }, { en: '0', es: '0' }, { en: 'It throws an error', es: 'Lanza un error' }],
    answer: 0,
    walkthrough: {
      en: [
        'The click handler runs once. At that moment count is 0 — a snapshot of this render.',
        'setCount(0 + 1) queues the value 1… three times, all with the same snapshot.',
        'React batches the three updates into a single re-render.',
        'Result: the button shows 1, not 3.',
        'Bonus: with setCount((c) => c + 1) each updater would read the latest queued value — and you would get 3.',
      ],
      es: [
        'El manejador se ejecuta una vez. En ese momento count vale 0: una foto de este render.',
        'setCount(0 + 1) encola el valor 1… tres veces, siempre con la misma foto.',
        'React agrupa (batching) las tres actualizaciones en un solo re-render.',
        'Resultado: el botón muestra 1, no 3.',
        'Extra: con setCount((c) => c + 1) cada actualizador leería el último valor en cola, y obtendrías 3.',
      ],
    },
  },
  {
    id: 'pr-effect-order',
    type: 'predict',
    moduleId: 'effects',
    difficulty: 'beginner',
    title: { en: 'Render first, effect after', es: 'Render primero, efecto después' },
    prompt: {
      en: 'Predict the order: what happens in the console (and the tab title) after one click?',
      es: 'Predice el orden: ¿qué ocurre en la consola (y en el título de la pestaña) tras un clic?',
    },
    code: `function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  });
  console.log("render", count);
  return <button onClick={() => setCount(1)}>Set to 1</button>;
}`,
    question: {
      en: 'After clicking the button once, what do you observe?',
      es: 'Tras pulsar el botón una vez, ¿qué observas?',
    },
    options: [
      { en: '"render 0", then "render 1"; the title becomes "Count: 1"', es: '"render 0", luego "render 1"; el título pasa a "Count: 1"' },
      { en: 'Only "render 1"; the title never changes', es: 'Solo "render 1"; el título nunca cambia' },
      { en: 'The effect runs before the first render', es: 'El efecto se ejecuta antes del primer render' },
      { en: 'An infinite loop, because the effect changes state', es: 'Un bucle infinito, porque el efecto cambia el estado' },
    ],
    answer: 0,
    walkthrough: {
      en: [
        'First render: console logs "render 0". Effects always run AFTER the browser paints.',
        'So the title becomes "Count: 0" — after the first paint.',
        'The click calls setCount(1) → React re-renders the component.',
        '"render 1" is logged. The effect has no dependency array, so it runs after EVERY render.',
        'The title becomes "Count: 1". Rule: render first, effect after.',
      ],
      es: [
        'Primer render: la consola muestra "render 0". Los efectos siempre se ejecutan DESPUÉS de pintar en el navegador.',
        'Así que el título pasa a "Count: 0", tras el primer pintado.',
        'El clic llama a setCount(1) → React re-renderiza el componente.',
        'Se registra "render 1". El efecto no tiene array de dependencias, así que se ejecuta tras CADA render.',
        'El título pasa a "Count: 1". Regla: primero el render, después el efecto.',
      ],
    },
  },
  {
    id: 'pr-closure-capture',
    type: 'predict',
    moduleId: 'state',
    difficulty: 'intermediate',
    title: { en: 'The captured value', es: 'El valor capturado' },
    prompt: {
      en: 'The user clicks twice quickly. Predict what the console shows one second later.',
      es: 'El usuario pulsa dos veces rápido. Predice qué muestra la consola un segundo después.',
    },
    code: `function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    setTimeout(() => console.log("captured:", count), 1000);
  }
  return <button onClick={handleClick}>count: {count}</button>;
}`,
    question: {
      en: 'Two quick clicks — what is logged after one second?',
      es: 'Dos clics rápidos: ¿qué se registra tras un segundo?',
    },
    options: [
      { en: '"captured: 0" then "captured: 1"', es: '"captured: 0" y luego "captured: 1"' },
      { en: '"captured: 1" then "captured: 2"', es: '"captured: 1" y luego "captured: 2"' },
      { en: '"captured: 2" twice', es: '"captured: 2" dos veces' },
      { en: '"captured: 0" twice', es: '"captured: 0" dos veces' },
    ],
    answer: 0,
    walkthrough: {
      en: [
        'First click: in this render count is 0. setCount(1) is queued, and the timeout captures count = 0.',
        'React re-renders with count = 1.',
        'Second click: in this render count is 1. setCount(2) is queued; the new timeout captures count = 1.',
        'One second later the callbacks fire with their captured snapshots: "captured: 0", then "captured: 1".',
        'Each render is a snapshot — functions created during a render keep that render\'s values. That is a (stale) closure.',
      ],
      es: [
        'Primer clic: en este render count vale 0. Se encola setCount(1) y el timeout captura count = 0.',
        'React re-renderiza con count = 1.',
        'Segundo clic: en este render count vale 1. Se encola setCount(2); el nuevo timeout captura count = 1.',
        'Un segundo después los callbacks se disparan con sus fotos capturadas: "captured: 0" y luego "captured: 1".',
        'Cada render es una foto: las funciones creadas durante un render conservan los valores de ese render. Eso es un closure (obsoleto).',
      ],
    },
  },
  {
    id: 'pr-conditional',
    type: 'predict',
    moduleId: 'conditional-lists',
    difficulty: 'beginner',
    title: { en: 'Which branch renders?', es: '¿Qué rama se renderiza?' },
    prompt: {
      en: 'No tricks — just JavaScript. Predict what the user sees on the very first render.',
      es: 'Sin trucos, solo JavaScript. Predice qué ve el usuario en el primer render.',
    },
    code: `function App() {
  const [status, setStatus] = useState("loading");
  return status === "ready" ? <Dashboard /> : <Spinner />;
}`,
    question: {
      en: 'On the first render, what appears on screen?',
      es: 'En el primer render, ¿qué aparece en pantalla?',
    },
    options: [
      { en: 'The Spinner', es: 'El Spinner' },
      { en: 'The Dashboard', es: 'El Dashboard' },
      { en: 'Nothing — a blank screen', es: 'Nada: pantalla en blanco' },
      { en: 'An error', es: 'Un error' },
    ],
    answer: 0,
    walkthrough: {
      en: [
        'useState("loading") → status starts as "loading".',
        '"loading" === "ready" evaluates to false.',
        'The ternary picks the right branch: <Spinner />.',
        'Conditional rendering is just JavaScript — the other branch never renders at all.',
      ],
      es: [
        'useState("loading") → status empieza valiendo "loading".',
        '"loading" === "ready" es falso.',
        'El ternario elige la rama derecha: <Spinner />.',
        'El renderizado condicional es JavaScript normal: la otra rama ni siquiera se renderiza.',
      ],
    },
  },
  {
    id: 'pr-key-reorder',
    type: 'predict',
    moduleId: 'conditional-lists',
    difficulty: 'beginner',
    title: { en: 'Reorder with keys', es: 'Reordenar con keys' },
    prompt: {
      en: 'The list ["A", "B", "C"] is reversed to ["C", "B", "A"]. Predict how React updates the DOM.',
      es: 'La lista ["A", "B", "C"] se invierte a ["C", "B", "A"]. Predice cómo actualiza React el DOM.',
    },
    code: `function List() {
  const [items, setItems] = useState(["A", "B", "C"]);
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
// A button calls setItems(["C", "B", "A"])`,
    question: {
      en: 'How does React update the DOM after the reversal?',
      es: '¿Cómo actualiza React el DOM tras invertir la lista?',
    },
    options: [
      { en: 'It reorders the existing <li> elements — the keys travel with them', es: 'Reordena los <li> existentes: las keys viajan con ellos' },
      { en: 'It destroys all three <li> and creates three new ones', es: 'Destruye los tres <li> y crea tres nuevos' },
      { en: 'It only changes the text inside each <li> (A→C, C→A)', es: 'Solo cambia el texto dentro de cada <li> (A→C, C→A)' },
      { en: 'It re-renders the whole <ul> from scratch', es: 'Vuelve a renderizar todo el <ul> desde cero' },
    ],
    answer: 0,
    walkthrough: {
      en: [
        'Before: keys A, B, C. After: keys C, B, A — the same keys, in a new order.',
        'Keys tell React: "this is the same element, it just moved."',
        'React moves the existing <li> DOM nodes instead of recreating them — minimal DOM work.',
        'Without keys (using the index), React would patch text in place instead — and any state inside the rows would end up attached to the wrong row.',
      ],
      es: [
        'Antes: keys A, B, C. Después: keys C, B, A. Las mismas keys, en otro orden.',
        'Las keys le dicen a React: "es el mismo elemento, solo se ha movido".',
        'React mueve los nodos <li> existentes en vez de recrearlos: trabajo mínimo en el DOM.',
        'Sin keys (usando el índice), React cambiaría el texto en su sitio, y cualquier estado dentro de las filas quedaría asociado a la fila equivocada.',
      ],
    },
  },
  {
    id: 'pr-state-snapshot',
    type: 'predict',
    moduleId: 'state',
    difficulty: 'beginner',
    title: { en: 'The alerted value', es: 'El valor del alert' },
    prompt: {
      en: 'A classic beginner surprise. Predict what the alert shows on the first click.',
      es: 'Una sorpresa clásica para principiantes. Predice qué muestra el alert en el primer clic.',
    },
    code: `function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    alert(count);
  }
  return <button onClick={handleClick}>count: {count}</button>;
}`,
    question: {
      en: 'On the first click, what does the alert display?',
      es: 'En el primer clic, ¿qué muestra el alert?',
    },
    options: [
      { en: '0', es: '0' },
      { en: '1', es: '1' },
      { en: '2', es: '2' },
      { en: 'Nothing — the alert never fires', es: 'Nada: el alert nunca se dispara' },
    ],
    answer: 0,
    walkthrough: {
      en: [
        'setCount(count + 1) does NOT change count right away — state updates are scheduled, not applied.',
        'alert(count) reads count from the current render\'s snapshot: 0.',
        'Only after the handler finishes does React re-render with count = 1.',
        'Inside an event handler, the state variable is a photograph of that render — it never changes mid-handler.',
      ],
      es: [
        'setCount(count + 1) NO cambia count al instante: las actualizaciones de estado se programan, no se aplican.',
        'alert(count) lee count de la foto del render actual: 0.',
        'Solo cuando el manejador termina, React re-renderiza con count = 1.',
        'Dentro de un manejador de eventos, la variable de estado es una fotografía de ese render: nunca cambia a mitad del manejador.',
      ],
    },
  },
]

export const CHALLENGE_COUNT = CHALLENGES.length

export function getChallenge(id) {
  return CHALLENGES.find((c) => c.id === id)
}
