// Sandboxes 23–25: router, useReducer, memoization.
export const items = [
  {
    id: 'router',
    title: { en: 'Router', es: 'Router' },
    difficulty: 'intermediate',
    blurb: {
      en: 'A mini SPA router: URL → component.',
      es: 'Un mini router SPA: URL → componente.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function Home() {
  return <div><h3>🏠 Home</h3><p>Welcome to our tiny SPA.</p></div>;
}
function Products() {
  return (
    <div>
      <h3>🛍️ Products</h3>
      <ul>
        {[42, 7, 99].map((id) => (
          <li key={id}>
            <NavLink to={'/products/' + id}>Product #{id}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
function ProductDetail({ id }) {
  return <div><h3>📦 Product #{id}</h3><p>Details for product {id}.</p></div>;
}
function Profile() {
  return <div><h3>👤 Profile</h3><p>This is you.</p></div>;
}
function NotFound() {
  return <div><h3>😕 404</h3><p>No route matches.</p></div>;
}

// Tiny link component: intercepts clicks, updates the "URL".
function NavLink({ to, children }) {
  return (
    <a
      href={to}
      onClick={(e) => { e.preventDefault(); navigate(to); }}
      style={{ color: '#61dafb' }}
    >
      {children}
    </a>
  );
}

// The "router": a module-level variable + subscribers. In real apps
// react-router does this for you (with the History API).
let currentPath = '/';
const listeners = new Set();
function navigate(to) {
  currentPath = to;
  listeners.forEach((fn) => fn(to));
}

function usePath() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    listeners.add(setPath);
    return () => listeners.delete(setPath);
  }, []);
  return path;
}

function App() {
  const path = usePath();

  let page;
  if (path === '/') page = <Home />;
  else if (path === '/products') page = <Products />;
  else if (path === '/profile') page = <Profile />;
  else if (path.startsWith('/products/')) page = <ProductDetail id={path.split('/')[2]} />;
  else page = <NotFound />;

  const link = { color: '#e9f0f7', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, background: '#16202c' };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, color: '#e9f0f7' }}>
      <h2>Mini Router</h2>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <NavLink to="/"><span style={link}>Home</span></NavLink>
        <NavLink to="/products"><span style={link}>Products</span></NavLink>
        <NavLink to="/profile"><span style={link}>Profile</span></NavLink>
      </nav>
      <p className="mono" style={{ fontSize: 13, opacity: 0.7 }}>URL → {path}</p>
      <div style={{ border: '1px solid #2b3644', borderRadius: 12, padding: 20, marginTop: 8, background: '#0f141b' }}>
        {page}
      </div>
      <p style={{ opacity: 0.6, fontSize: 13 }}>The page never reloads — only the component changes.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Add a route /about and its component.',
        'Try typing a bogus path — the 404 branch catches it.',
        'Real routers also sync with the browser address bar (History API).',
      ],
      es: [
        'Añade una ruta /about con su componente.',
        'Prueba una ruta inexistente: la rama 404 la captura.',
        'Los routers reales también sincronizan la barra del navegador (History API).',
      ],
    },
  },
  {
    id: 'use-reducer',
    title: { en: 'useReducer', es: 'useReducer' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Complex state updates as pure actions.',
      es: 'Actualizaciones complejas como acciones puras.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `// The reducer: (state, action) => newState. Pure and testable.
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'remove':
      return state.filter((t) => t.id !== action.id);
    case 'clear-done':
      return state.filter((t) => !t.done);
    default:
      return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, [
    { id: 1, text: 'Understand reducers', done: true },
    { id: 2, text: 'Dispatch some actions', done: false },
  ]);
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    dispatch({ type: 'add', text: text.trim() });
    setText('');
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 480, color: '#e9f0f7' }}>
      <h2>useReducer</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="New task…"
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #2b3644', background: '#0f141b', color: '#e9f0f7' }}
        />
        <button onClick={add} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: '#61dafb', fontWeight: 700, cursor: 'pointer' }}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1d2632' }}>
            <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggle', id: t.id })} />
            <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>{t.text}</span>
            <button onClick={() => dispatch({ type: 'remove', id: t.id })} style={{ border: 'none', background: 'transparent', color: '#ff6b6b', cursor: 'pointer' }}>✕</button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: 'clear-done' })} style={{ marginTop: 8, padding: '6px 14px', borderRadius: 8, border: '1px solid #2b3644', background: 'transparent', color: '#9aa7b5', cursor: 'pointer' }}>
        Clear completed
      </button>
      <p style={{ opacity: 0.6, fontSize: 13 }}>All updates go through dispatch({"{ type: … }"}) → reducer.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'The reducer is a pure function — you can test it without React.',
        'Add an action type "rename" that edits a todo’s text.',
        'Compare with the todo-list sandbox: when does useReducer pay off?',
      ],
      es: [
        'El reducer es una función pura: puedes probarla sin React.',
        'Añade una acción "rename" que edite el texto de una tarea.',
        'Compara con el sandbox todo-list: ¿cuándo compensa useReducer?',
      ],
    },
  },
  {
    id: 'memoization',
    title: { en: 'Memoization', es: 'Memoización' },
    difficulty: 'intermediate',
    blurb: {
      en: 'useMemo vs recompute: see the wasted work disappear.',
      es: 'useMemo vs recalcular: observa desaparecer el trabajo inútil.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [count, setCount] = useState(0);
  const [complexity, setComplexity] = useState(25);
  const [memoOn, setMemoOn] = useState(true);
  const recomputes = useRef(0);
  const lastMs = useRef(0);

  const compute = () => {
    const t0 = performance.now();
    let s = 0;
    const n = complexity * 200000;
    for (let i = 0; i < n; i++) s += Math.sqrt(i % 97);
    recomputes.current += 1;
    lastMs.current = performance.now() - t0;
    return Math.round(s);
  };

  // With useMemo, compute() only re-runs when 'complexity' changes.
  const result = memoOn ? useMemo(compute, [complexity]) : compute();

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 520, color: '#e9f0f7' }}>
      <h2>Memoization</h2>
      <label style={{ display: 'block', marginBottom: 12 }}>
        <input type="checkbox" checked={memoOn} onChange={(e) => setMemoOn(e.target.checked)} />
        {' '}useMemo enabled
      </label>
      <label style={{ display: 'block', marginBottom: 12 }}>
        Complexity: {complexity}
        <input type="range" min={1} max={100} value={complexity}
          onChange={(e) => setComplexity(Number(e.target.value))} style={{ width: '100%' }} />
      </label>
      <button onClick={() => setCount(count + 1)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#61dafb', fontWeight: 700, cursor: 'pointer' }}>
        Unrelated state: {count}
      </button>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <div style={stat()}>Result<span>{result}</span></div>
        <div style={stat()}>Recomputations<span>{recomputes.current}</span></div>
        <div style={stat()}>Last compute<span>{lastMs.current.toFixed(1)} ms</span></div>
      </div>
      <p style={{ opacity: 0.6, fontSize: 13 }}>
        Click the counter with useMemo ON vs OFF: OFF recomputes on every render,
        ON skips it. Memoization has a cost — use it when the work is actually expensive.
      </p>
    </div>
  );
}

function stat() {
  return { flex: 1, background: '#141b24', border: '1px solid #2b3644', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, opacity: 0.9 };
}`,
      },
    ],
    hints: {
      en: [
        'Toggle useMemo off, click the counter, and watch "Recomputations" climb.',
        'Change complexity with useMemo on: it recomputes exactly once.',
        'Memoizing cheap work can be slower than redoing it — measure first.',
      ],
      es: [
        'Desactiva useMemo, pulsa el contador y mira subir "Recomputations".',
        'Cambia la complejidad con useMemo activado: recalcula exactamente una vez.',
        'Memoizar trabajo barato puede ser más lento que repetirlo: mide primero.',
      ],
    },
  },
]
