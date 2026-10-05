/* Guided mini projects — Phase 9.
 * Each entry renders as an expandable guide in the Mini apps tab of /challenges.
 * starterCode opens in the Playground; playgroundLink deep-links there.
 */

export const MINIAPPS = [
  {
    id: 'miniapp-todo',
    difficulty: 'beginner',
    title: { en: 'Todo App', es: 'App de tareas' },
    goal: {
      en: 'Build a working todo list: add tasks, toggle them done, delete them, and filter by status. The classic first React app.',
      es: 'Construye una lista de tareas funcional: añadir, marcar como hechas, eliminar y filtrar por estado. La clásica primera app en React.',
    },
    steps: [
      {
        title: { en: '1. Model the state', es: '1. Modela el estado' },
        detail: {
          en: 'A todo list is an array of objects: { id, text, done }. Keep the new-task text in a second piece of state. Two useState calls — nothing more.',
          es: 'Una lista de tareas es un array de objetos: { id, text, done }. Guarda el texto de la nueva tarea en un segundo estado. Dos llamadas a useState, nada más.',
        },
        code: `const [todos, setTodos] = useState([
  { id: 1, text: "Learn JSX", done: true },
  { id: 2, text: "Master useState", done: false },
]);
const [input, setInput] = useState("");`,
      },
      {
        title: { en: '2. Render the list', es: '2. Renderiza la lista' },
        detail: {
          en: 'Map over todos. Each <li> needs a stable key={todo.id}. Use a checkbox or a click to toggle, and a button to delete.',
          es: 'Recorre todos con map. Cada <li> necesita una key estable key={todo.id}. Usa un checkbox o un clic para alternar, y un botón para eliminar.',
        },
      },
      {
        title: { en: '3. Add a task (immutably!)', es: '3. Añade una tarea (¡sin mutar!)' },
        detail: {
          en: 'Create a NEW array: setTodos([...todos, newTodo]). Never push into the old one — React compares references.',
          es: 'Crea un array NUEVO: setTodos([...todos, newTodo]). Nunca hagas push en el antiguo: React compara referencias.',
        },
      },
      {
        title: { en: '4. Toggle and delete', es: '4. Alternar y eliminar' },
        detail: {
          en: 'Toggle with map + spread: flip done only for the matching id. Delete with filter: keep every todo whose id differs.',
          es: 'Alterna con map + spread: cambia done solo para el id coincidente. Elimina con filter: conserva las tareas cuyo id sea distinto.',
        },
        code: `const toggle = (id) =>
  setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
const remove = (id) => setTodos(todos.filter((t) => t.id !== id));`,
      },
      {
        title: { en: '5. Add filters', es: '5. Añade filtros' },
        detail: {
          en: 'A filter state ("all" | "active" | "done") plus a derived constant — visibleTodos — computed during render, no extra state needed.',
          es: 'Un estado filter ("all" | "active" | "done") más una constante derivada, visibleTodos, calculada durante el render: no necesitas más estado.',
        },
      },
      {
        title: { en: '6. Stretch goals', es: '6. Retos extra' },
        detail: {
          en: 'Persist todos to localStorage with useEffect. Add an item count ("3 left"). Try inline editing of a task.',
          es: 'Persiste las tareas en localStorage con useEffect. Añade un contador ("quedan 3"). Prueba la edición en línea de una tarea.',
        },
      },
    ],
    starterCode: `function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn JSX", done: true },
    { id: 2, text: "Master useState", done: false },
  ]);
  const [input, setInput] = useState("");

  function addTodo() {
    if (!input.trim()) return;
    // TODO: create a new todo and append it immutably
  }

  return (
    <div>
      <h1>Todos</h1>
      {/* TODO: input + button, list with toggle & delete */}
    </div>
  );
}`,
    solutionHint: {
      en: 'Add: setTodos([...todos, { id: Date.now(), text: input, done: false }]); setInput(""). Toggle with map, delete with filter, filter the list with a "filter" state.',
      es: 'Añadir: setTodos([...todos, { id: Date.now(), text: input, done: false }]); setInput(""). Alterna con map, elimina con filter y filtra la lista con un estado "filter".',
    },
    playgroundLink: '/playground',
  },
  {
    id: 'miniapp-weather',
    difficulty: 'beginner',
    title: { en: 'Weather Dashboard', es: 'Panel del tiempo' },
    goal: {
      en: 'Fetch (simulated) weather data for a city, and handle the three UI states every data fetch needs: loading, success, error.',
      es: 'Obtén datos meteorológicos (simulados) de una ciudad y gestiona los tres estados que toda carga de datos necesita: cargando, éxito y error.',
    },
    steps: [
      {
        title: { en: '1. Model the fetch states', es: '1. Modela los estados de carga' },
        detail: {
          en: 'Three pieces of state: weather (null at first), loading (boolean), error (string or null). One city state for the input.',
          es: 'Tres estados: weather (null al inicio), loading (booleano) y error (string o null). Un estado city para el input.',
        },
        code: `const [city, setCity] = useState("Madrid");
const [weather, setWeather] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);`,
      },
      {
        title: { en: '2. Write the fetch function', es: '2. Escribe la función de carga' },
        detail: {
          en: 'An async function: set loading true and clear the error, await the (simulated) API, then store data or the error. Always set loading false at the end.',
          es: 'Una función async: activa loading y limpia el error, espera a la API (simulada), guarda los datos o el error. Al final, siempre desactiva loading.',
        },
      },
      {
        title: { en: '3. Fetch on mount with useEffect', es: '3. Carga al montar con useEffect' },
        detail: {
          en: 'useEffect(() => { load(); }, []) fetches once when the component mounts. The empty array is the key.',
          es: 'useEffect(() => { load(); }, []) carga una vez al montar el componente. El array vacío es la clave.',
        },
      },
      {
        title: { en: '4. Render the three states', es: '4. Renderiza los tres estados' },
        detail: {
          en: 'If loading → spinner. If error → error card with a Retry button. If weather → the dashboard. Conditional rendering in action.',
          es: 'Si loading → spinner. Si error → tarjeta de error con botón Reintentar. Si weather → el panel. Renderizado condicional en acción.',
        },
      },
      {
        title: { en: '5. City search form', es: '5. Formulario de búsqueda' },
        detail: {
          en: 'A controlled input + submit handler that calls load() with the new city. Enter key works for free with a <form>.',
          es: 'Un input controlado + manejador de submit que llama a load() con la nueva ciudad. La tecla Enter funciona gratis con un <form>.',
        },
      },
      {
        title: { en: '6. Stretch goals', es: '6. Retos extra' },
        detail: {
          en: 'Add a refresh button, a °C/°F toggle (derived value, no new state), and a fake latency slider to feel the loading state.',
          es: 'Añade un botón de actualizar, un conmutador °C/°F (valor derivado, sin estado nuevo) y un slider de latencia simulada para sentir el estado de carga.',
        },
      },
    ],
    starterCode: `// Simulated API — replace with a real fetch later
function fakeWeatherApi(city) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!city.trim()) return reject(new Error("Enter a city"));
      resolve({
        city,
        temp: Math.round(12 + Math.random() * 18),
        condition: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
      });
    }, 1200);
  });
}

function App() {
  const [city, setCity] = useState("Madrid");
  // TODO: weather, loading, error states + load() + useEffect
  return <h1>Weather Dashboard</h1>;
}`,
    solutionHint: {
      en: 'load = async () => { setLoading(true); setError(null); try { setWeather(await fakeWeatherApi(city)); } catch (e) { setError(e.message); } finally { setLoading(false); } }. Call it in useEffect once and on form submit.',
      es: 'load = async () => { setLoading(true); setError(null); try { setWeather(await fakeWeatherApi(city)); } catch (e) { setError(e.message); } finally { setLoading(false); } }. Llámala en useEffect una vez y al enviar el formulario.',
    },
    playgroundLink: '/playground',
  },
  {
    id: 'miniapp-expenses',
    difficulty: 'intermediate',
    title: { en: 'Expense Tracker', es: 'Control de gastos' },
    goal: {
      en: 'Track expenses with categories, compute totals and per-category breakdowns with derived values, and visualize spending.',
      es: 'Registra gastos con categorías, calcula totales y desgloses por categoría con valores derivados, y visualiza el gasto.',
    },
    steps: [
      {
        title: { en: '1. Model expenses', es: '1. Modela los gastos' },
        detail: {
          en: 'An array of { id, description, amount, category, date }. A form object state for the controlled inputs.',
          es: 'Un array de { id, description, amount, category, date }. Un estado de objeto para los inputs controlados del formulario.',
        },
      },
      {
        title: { en: '2. Add-expense form', es: '2. Formulario de gasto' },
        detail: {
          en: 'Controlled inputs for description, amount (number), and a <select> for category. Validate: amount must be a positive number.',
          es: 'Inputs controlados para descripción, cantidad (number) y un <select> para la categoría. Valida: la cantidad debe ser un número positivo.',
        },
      },
      {
        title: { en: '3. Derived totals (no extra state)', es: '3. Totales derivados (sin estado extra)' },
        detail: {
          en: 'total = expenses.reduce(...). Per-category totals with a second reduce. Computed during render — never stored in state.',
          es: 'total = expenses.reduce(...). Totales por categoría con otro reduce. Calculados durante el render, nunca guardados en estado.',
        },
        code: `const total = expenses.reduce((sum, e) => sum + e.amount, 0);
const byCategory = expenses.reduce((acc, e) => {
  acc[e.category] = (acc[e.category] || 0) + e.amount;
  return acc;
}, {});`,
      },
      {
        title: { en: '4. Category breakdown UI', es: '4. Desglose por categorías' },
        detail: {
          en: 'Render a row per category with a simple bar whose width is proportional to its share of the total. Pure CSS, no chart library needed.',
          es: 'Renderiza una fila por categoría con una barra simple cuyo ancho es proporcional a su parte del total. CSS puro, sin librería de gráficos.',
        },
      },
      {
        title: { en: '5. Delete + filters', es: '5. Eliminar + filtros' },
        detail: {
          en: 'Delete with filter(). Add a month/category filter state and derive the visible expenses from it.',
          es: 'Elimina con filter(). Añade un estado de filtro por mes/categoría y deriva de él los gastos visibles.',
        },
      },
      {
        title: { en: '6. Stretch goals', es: '6. Retos extra' },
        detail: {
          en: 'Persist to localStorage. Add a budget per category and warn when it is exceeded. Sort by date or amount.',
          es: 'Persiste en localStorage. Añade un presupuesto por categoría y avisa al superarlo. Ordena por fecha o cantidad.',
        },
      },
    ],
    starterCode: `const CATEGORIES = ["Food", "Transport", "Fun", "Bills"];

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: "Groceries", amount: 42.5, category: "Food" },
    { id: 2, description: "Metro card", amount: 30, category: "Transport" },
  ]);
  // TODO: form state, add/delete, derived totals, category bars
  return <h1>Expense Tracker</h1>;
}`,
    solutionHint: {
      en: 'Add with [...expenses, { id: Date.now(), ...form, amount: Number(form.amount) }]. Derive total and byCategory with reduce during render. Bars: width = (catTotal / total) * 100 + "%".',
      es: 'Añade con [...expenses, { id: Date.now(), ...form, amount: Number(form.amount) }]. Deriva total y byCategory con reduce durante el render. Barras: width = (catTotal / total) * 100 + "%".',
    },
    playgroundLink: '/playground',
  },
  {
    id: 'miniapp-movies',
    difficulty: 'intermediate',
    title: { en: 'Movie Search', es: 'Buscador de películas' },
    goal: {
      en: 'Search a (simulated) movie catalog with live filtering, debounce the input, and show detail views — a mini master/detail app.',
      es: 'Busca en un catálogo de películas (simulado) con filtrado en vivo, aplica debounce al input y muestra vistas de detalle: una mini app maestro/detalle.',
    },
    steps: [
      {
        title: { en: '1. The catalog data', es: '1. Los datos del catálogo' },
        detail: {
          en: 'A static array of ~12 movies: { id, title, year, genre, rating }. It lives outside the component — it is not state.',
          es: 'Un array estático de unas 12 películas: { id, title, year, genre, rating }. Vive fuera del componente: no es estado.',
        },
      },
      {
        title: { en: '2. Controlled search input', es: '2. Input de búsqueda controlado' },
        detail: {
          en: 'A query state bound to the input. The visible list is derived: movies filtered by title or genre, case-insensitive.',
          es: 'Un estado query vinculado al input. La lista visible es derivada: películas filtradas por título o género, sin distinguir mayúsculas.',
        },
        code: `const [query, setQuery] = useState("");
const results = MOVIES.filter((m) =>
  (m.title + m.genre).toLowerCase().includes(query.toLowerCase())
);`,
      },
      {
        title: { en: '3. Debounce with useEffect', es: '3. Debounce con useEffect' },
        detail: {
          en: 'Delay the expensive filter until the user stops typing: setTimeout in useEffect with a cleanup that clears it. The classic effect-cleanup pattern.',
          es: 'Retrasa el filtrado hasta que el usuario deja de escribir: setTimeout en useEffect con una limpieza que lo cancela. El patrón clásico de effect cleanup.',
        },
        code: `const [debounced, setDebounced] = useState(query);
useEffect(() => {
  const t = setTimeout(() => setDebounced(query), 300);
  return () => clearTimeout(t); // cleanup!
}, [query]);`,
      },
      {
        title: { en: '4. Master/detail selection', es: '4. Selección maestro/detalle' },
        detail: {
          en: 'A selectedId state. Click a result → show its details panel. Conditional rendering decides list-only vs. detail view.',
          es: 'Un estado selectedId. Clic en un resultado → muestra su panel de detalle. El renderizado condicional decide entre solo lista o vista de detalle.',
        },
      },
      {
        title: { en: '5. Empty state', es: '5. Estado vacío' },
        detail: {
          en: 'When results is empty, render a friendly "No movies found" instead of a blank list. Empty states are part of the UI.',
          es: 'Cuando results está vacío, renderiza un amable "No se encontraron películas" en vez de una lista en blanco. Los estados vacíos son parte de la UI.',
        },
      },
      {
        title: { en: '6. Stretch goals', es: '6. Retos extra' },
        detail: {
          en: 'Add genre filter chips, sort by rating/year, and a "favorites" list persisted to localStorage.',
          es: 'Añade chips de filtro por género, orden por nota/año y una lista de "favoritas" persistida en localStorage.',
        },
      },
    ],
    starterCode: `const MOVIES = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.8 },
  { id: 2, title: "Spirited Away", year: 2001, genre: "Animation", rating: 8.6 },
  { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0 },
  // TODO: add ~9 more movies
];

function App() {
  const [query, setQuery] = useState("");
  // TODO: debounced query, results, selected movie detail
  return <h1>Movie Search</h1>;
}`,
    solutionHint: {
      en: 'Debounce query with the useEffect + cleanup pattern above, then filter MOVIES by the debounced value. selectedId state drives the detail panel; derive the movie with MOVIES.find().',
      es: 'Aplica debounce a query con el patrón useEffect + cleanup de arriba y filtra MOVIES por el valor con debounce. El estado selectedId controla el panel de detalle; deriva la película con MOVIES.find().',
    },
    playgroundLink: '/playground',
  },
  {
    id: 'miniapp-shop',
    difficulty: 'intermediate',
    title: { en: 'Mini Ecommerce', es: 'Mini tienda' },
    goal: {
      en: 'A product catalog with a cart: the classic "lifted state" exercise — cart state lives in App, product cards only emit events upward.',
      es: 'Un catálogo de productos con carrito: el ejercicio clásico de "estado elevado": el carrito vive en App y las tarjetas solo emiten eventos hacia arriba.',
    },
    steps: [
      {
        title: { en: '1. Where does cart state live?', es: '1. ¿Dónde vive el estado del carrito?' },
        detail: {
          en: 'Both ProductList (add buttons) and Cart (contents) need it → lift it to their common parent: App. Data flows down, events flow up.',
          es: 'Tanto ProductList (botones de añadir) como Cart (contenido) lo necesitan: elévalo a su padre común, App. Los datos bajan, los eventos suben.',
        },
        code: `// App owns the cart:
const [cart, setCart] = useState([]); // [{ id, qty }]
<ProductList onAdd={(id) => addToCart(id)} />
<Cart items={cart} onRemove={removeFromCart} />`,
      },
      {
        title: { en: '2. Add to cart (functional updates)', es: '2. Añadir al carrito (updates funcionales)' },
        detail: {
          en: 'If the product is already in the cart, bump qty; otherwise append. Use the functional setCart form — rapid clicks must not lose updates.',
          es: 'Si el producto ya está en el carrito, aumenta qty; si no, añádelo. Usa la forma funcional de setCart: los clics rápidos no deben perder actualizaciones.',
        },
      },
      {
        title: { en: '3. Product cards are presentational', es: '3. Las tarjetas son presentacionales' },
        detail: {
          en: 'ProductCard receives product + onAdd and knows nothing about the cart. Reusable, testable, dumb — exactly how components should be.',
          es: 'ProductCard recibe product + onAdd y no sabe nada del carrito. Reutilizable, testeable y tonta: justo como deben ser los componentes.',
        },
      },
      {
        title: { en: '4. Derived cart totals', es: '4. Totales derivados del carrito' },
        detail: {
          en: 'Item count and total price are derived with reduce during render. Join cart lines with the product catalog by id.',
          es: 'La cantidad de artículos y el precio total se derivan con reduce durante el render. Une las líneas del carrito con el catálogo por id.',
        },
      },
      {
        title: { en: '5. Quantity controls + remove', es: '5. Controles de cantidad + eliminar' },
        detail: {
          en: 'Each cart row gets − / + buttons and a remove button — all calling callbacks passed down from App. Immutable updates only.',
          es: 'Cada fila del carrito tiene botones − / + y uno de eliminar, todos llamando a callbacks pasados desde App. Solo actualizaciones inmutables.',
        },
      },
      {
        title: { en: '6. Stretch goals', es: '6. Retos extra' },
        detail: {
          en: 'Add a checkout summary step, persist the cart in localStorage, and share it via Context instead of prop drilling.',
          es: 'Añade un paso de resumen de compra, persiste el carrito en localStorage y compártelo con Context en vez de prop drilling.',
        },
      },
    ],
    starterCode: `const PRODUCTS = [
  { id: 1, name: "React Hoodie", price: 39 },
  { id: 2, name: "JS Mug", price: 12 },
  { id: 3, name: "Hook Sticker Pack", price: 5 },
];

function App() {
  const [cart, setCart] = useState([]); // [{ id, qty }]
  // TODO: addToCart, removeFromCart, changeQty, derived totals
  return <h1>Mini Shop</h1>;
}`,
    solutionHint: {
      en: 'addToCart: setCart((c) => { const line = c.find((l) => l.id === id); return line ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...c, { id, qty: 1 }]; }). Totals: reduce over cart joined with PRODUCTS.',
      es: 'addToCart: setCart((c) => { const line = c.find((l) => l.id === id); return line ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...c, { id, qty: 1 }]; }). Totales: reduce sobre cart unido con PRODUCTS.',
    },
    playgroundLink: '/playground',
  },
]
