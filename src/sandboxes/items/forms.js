// Sandboxes 06–11: forms, lists, controlled inputs.

export const items = [
  {
    id: 'todo-list',
    title: { en: 'Todo List', es: 'Lista de tareas' },
    difficulty: 'beginner',
    blurb: {
      en: 'Add, toggle and delete — arrays as state.',
      es: 'Añadir, marcar y borrar: arrays como estado.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn useState', done: true },
    { id: 2, text: 'Build a todo list', done: false },
  ]);
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  };

  const toggle = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => setTodos(todos.filter((t) => t.id !== id));

  const input = { padding: '10px 14px', borderRadius: 8, border: '1px solid #2b3644', background: '#0f141b', color: '#e9f0f7' };
  const btn = { padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#61dafb', fontWeight: 700 };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 480, color: '#e9f0f7' }}>
      <h2>Todo List</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="New task…"
          style={{ ...input, flex: 1 }}
        />
        <button onClick={add} style={btn}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', borderBottom: '1px solid #1d2632' }}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>
              {t.text}
            </span>
            <button onClick={() => remove(t.id)} style={{ ...btn, background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '4px 10px' }}>✕</button>
          </li>
        ))}
      </ul>
      <p style={{ opacity: 0.6, fontSize: 13 }}>{todos.filter((t) => !t.done).length} pending</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Every list item needs a stable key — Date.now() works for a demo.',
        'Try mutating a todo directly (t.done = true) and see why React ignores it.',
        'Add a "clear completed" button using .filter().',
      ],
      es: [
        'Cada elemento de la lista necesita una key estable: Date.now() vale para la demo.',
        'Prueba a mutar una tarea directamente (t.done = true) y observa por qué React lo ignora.',
        'Añade un botón "borrar completadas" usando .filter().',
      ],
    },
  },
  {
    id: 'shopping-cart',
    title: { en: 'Shopping Cart', es: 'Carrito de compra' },
    difficulty: 'beginner',
    blurb: {
      en: 'Derived state: quantities, totals and item counts.',
      es: 'Estado derivado: cantidades, totales y recuentos.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const PRODUCTS = [
  { id: 'react-book', name: 'React Book', price: 29 },
  { id: 'hooks-guide', name: 'Hooks Guide', price: 19 },
  { id: 'sticker', name: 'React Sticker', price: 4 },
];

function App() {
  const [cart, setCart] = useState({}); // { productId: qty }

  const add = (id) => setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
  const remove = (id) => {
    const next = { ...cart };
    if (next[id] > 1) next[id] -= 1;
    else delete next[id];
    setCart(next);
  };

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);

  const card = { border: '1px solid #2b3644', borderRadius: 12, padding: 16, background: '#141b24' };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 640, color: '#e9f0f7' }}>
      <h2>🛒 Shopping Cart <span style={{ fontSize: 14, opacity: 0.7 }}>({count} items — {total}€)</span></h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {PRODUCTS.map((p) => (
          <div key={p.id} style={card}>
            <strong>{p.name}</strong>
            <div style={{ opacity: 0.7, margin: '6px 0' }}>{p.price}€</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => remove(p.id)} style={{ padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}>−</button>
              <span>{cart[p.id] || 0}</span>
              <button onClick={() => add(p.id)} style={{ padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <p style={{ opacity: 0.6, fontSize: 13 }}>Total is <em>derived</em> from cart state — never stored separately.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Total and count are computed on every render — no need for extra state.',
        'Try adding a "clear cart" button.',
        'What would break if two products shared the same id?',
      ],
      es: [
        'Total y recuento se calculan en cada render: no hace falta estado extra.',
        'Prueba a añadir un botón "vaciar carrito".',
        '¿Qué se rompería si dos productos compartieran el mismo id?',
      ],
    },
  },
  {
    id: 'dark-mode',
    title: { en: 'Dark Mode', es: 'Modo oscuro' },
    difficulty: 'beginner',
    blurb: {
      en: 'Theme state flipping an entire UI in one line.',
      es: 'Estado de tema que cambia toda la UI en una línea.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [dark, setDark] = useState(true);

  const theme = {
    bg: dark ? '#0b0e11' : '#f7f9fc',
    fg: dark ? '#e9f0f7' : '#141b24',
    card: dark ? '#141b24' : '#ffffff',
    border: dark ? '#2b3644' : '#dbe2ea',
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, background: theme.bg, color: theme.fg, borderRadius: 12, minHeight: 300, transition: 'all .25s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Dark Mode</h2>
        <button
          onClick={() => setDark(!dark)}
          style={{ padding: '8px 16px', borderRadius: 20, cursor: 'pointer', border: '1px solid ' + theme.border, background: theme.card, color: theme.fg, fontWeight: 700 }}
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, background: theme.card, border: '1px solid ' + theme.border, borderRadius: 12, padding: 16, transition: 'all .25s' }}>
            <strong>Card {i}</strong>
            <p style={{ opacity: 0.7, fontSize: 13 }}>Theme: {dark ? 'dark' : 'light'}</p>
          </div>
        ))}
      </div>
      <p style={{ opacity: 0.6, fontSize: 13 }}>One boolean drives every color on screen.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Persist the theme with localStorage + useEffect.',
        'Move the theme object to a Context so children can read it.',
        'Try animating the transition with CSS transitions (already added!).',
      ],
      es: [
        'Persiste el tema con localStorage + useEffect.',
        'Mueve el objeto theme a un Context para que los hijos lo lean.',
        'Prueba a animar la transición con transiciones CSS (¡ya añadidas!).',
      ],
    },
  },
  {
    id: 'search-filter',
    title: { en: 'Search Filter', es: 'Filtro de búsqueda' },
    difficulty: 'beginner',
    blurb: {
      en: 'Filter a list as you type — the classic controlled input.',
      es: 'Filtra una lista mientras escribes: el input controlado clásico.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const FRAMEWORKS = [
  'React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Qwik',
  'Preact', 'Lit', 'Alpine', 'Ember', 'Backbone', 'jQuery',
];

function App() {
  const [query, setQuery] = useState('');
  const results = FRAMEWORKS.filter((f) =>
    f.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 420, color: '#e9f0f7' }}>
      <h2>Search Filter</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search frameworks…"
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #2b3644', background: '#0f141b', color: '#e9f0f7', boxSizing: 'border-box' }}
      />
      <p style={{ opacity: 0.6, fontSize: 13 }}>{results.length} result(s)</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((f) => (
          <li key={f} style={{ padding: '10px 4px', borderBottom: '1px solid #1d2632' }}>
            {highlight(f, query)}
          </li>
        ))}
        {results.length === 0 && <li style={{ opacity: 0.5 }}>No matches 😢</li>}
      </ul>
    </div>
  );
}

function highlight(text, query) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: '#61dafb', color: '#0b0e11', borderRadius: 3, padding: '0 2px' }}>
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}`,
      },
    ],
    hints: {
      en: [
        'results is derived state — computed, not stored.',
        'Add case highlighting? It is already done — study the helper.',
        'For huge lists, debounce the query with useDeferredValue.',
      ],
      es: [
        'results es estado derivado: se calcula, no se almacena.',
        '¿Resaltado de coincidencias? Ya está hecho: estudia el helper.',
        'Para listas enormes, retrasa la query con useDeferredValue.',
      ],
    },
  },
  {
    id: 'form',
    title: { en: 'Form', es: 'Formulario' },
    difficulty: 'beginner',
    blurb: {
      en: 'Controlled inputs with a live state inspector.',
      es: 'Inputs controlados con inspector de estado en vivo.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [form, setForm] = useState({ name: '', email: '', role: 'student' });

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const input = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #2b3644', background: '#0f141b', color: '#e9f0f7', boxSizing: 'border-box', marginBottom: 10 };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 460, color: '#e9f0f7' }}>
      <h2>Controlled Form</h2>
      <input value={form.name} onChange={update('name')} placeholder="Name" style={input} />
      <input value={form.email} onChange={update('email')} placeholder="Email" type="email" style={input} />
      <select value={form.role} onChange={update('role')} style={input}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="dev">Developer</option>
      </select>
      <h3>Live state</h3>
      <pre style={{ background: '#0f141b', border: '1px solid #2b3644', borderRadius: 10, padding: 14, fontSize: 13 }}>
{JSON.stringify(form, null, 2)}
      </pre>
      <p style={{ opacity: 0.6, fontSize: 13 }}>The input value always equals the state — a two-way loop.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Remove value={form.name} from one input: it becomes uncontrolled.',
        'Add validation: disable the button until the email contains "@".',
        'Try a checkbox: use checked + e.target.checked instead of value.',
      ],
      es: [
        'Quita value={form.name} de un input: se vuelve no controlado.',
        'Añade validación: desactiva el botón hasta que el email contenga "@".',
        'Prueba un checkbox: usa checked + e.target.checked en vez de value.',
      ],
    },
  },
  {
    id: 'login-ui',
    title: { en: 'Login UI', es: 'Pantalla de login' },
    difficulty: 'beginner',
    blurb: {
      en: 'Validation, submit states and conditional success.',
      es: 'Validación, estados de envío y éxito condicional.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | done
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return setError('Enter a valid email.');
    if (password.length < 6) return setError('Password needs 6+ characters.');
    setError('');
    setStatus('loading');
    setTimeout(() => setStatus('done'), 1200); // fake server
  };

  const input = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #2b3644', background: '#0f141b', color: '#e9f0f7', boxSizing: 'border-box', marginBottom: 10 };

  if (status === 'done') {
    return (
      <div style={{ fontFamily: 'system-ui', padding: 40, textAlign: 'center', color: '#e9f0f7' }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <h2>Welcome back!</h2>
        <p style={{ opacity: 0.7 }}>Logged in as {email}</p>
        <button onClick={() => { setStatus('idle'); setEmail(''); setPassword(''); }} style={{ padding: '8px 18px', borderRadius: 8, cursor: 'pointer' }}>Log out</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 380, margin: '0 auto', color: '#e9f0f7' }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={input} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" style={input} />
        {error && <p style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</p>}
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#61dafb', fontWeight: 700, cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
        >
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ opacity: 0.6, fontSize: 13 }}>Try: bad email, short password, then valid data.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'status is a tiny state machine: idle → loading → done.',
        'Add a "show password" toggle for the password field.',
        'What would you do with the credentials in a real app? (Never store plain text!)',
      ],
      es: [
        'status es una mini máquina de estados: idle → loading → done.',
        'Añade un interruptor "mostrar contraseña" para el campo.',
        '¿Qué harías con las credenciales en una app real? (¡Nunca guardarlas en texto plano!)',
      ],
    },
  },
]
