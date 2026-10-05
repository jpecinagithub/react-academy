import { useEffect, useState } from 'react'
import { Printer, FileText } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { PageHeader, Callout } from '../components/ui.jsx'

// 8 real cheat sheets. Each row: { code, en, es }.
// The global Print button prints every sheet; each sheet also has its own
// Print button (hides the other sheets via .print-dim under @media print).
const SHEETS = [
  {
    id: 'usestate',
    title: { en: 'useState', es: 'useState' },
    blurb: {
      en: 'Local component state: a value that survives renders, plus the function that changes it.',
      es: 'Estado local del componente: un valor que sobrevive a los renders, más la función que lo cambia.',
    },
    rows: [
      {
        code: 'const [count, setCount] = useState(0)',
        en: 'Declares state: the current value and its updater. 0 is the initial value.',
        es: 'Declara el estado: el valor actual y su función de actualización. 0 es el valor inicial.',
      },
      {
        code: 'setCount(5)',
        en: 'Sets a new value. React re-renders the component with the new value.',
        es: 'Asigna un nuevo valor. React vuelve a renderizar el componente con el nuevo valor.',
      },
      {
        code: 'setCount(c => c + 1)',
        en: 'Functional update: uses the latest value. Safe inside batches, timers and rapid events.',
        es: 'Actualización funcional: usa el valor más reciente. Segura en batches, temporizadores y eventos rápidos.',
      },
      {
        code: 'useState(() => expensive())',
        en: 'Lazy initial value: the function runs only once, on the first render.',
        es: 'Valor inicial perezoso: la función se ejecuta solo una vez, en el primer render.',
      },
      {
        code: 'const [user, setUser] = useState({ name: "Ada" })',
        en: 'State can hold objects and arrays too.',
        es: 'El estado también puede guardar objetos y arrays.',
      },
      {
        code: 'setUser({ ...user, name: "Grace" })',
        en: 'Update immutably: create a NEW object so React detects the change.',
        es: 'Actualiza de forma inmutable: crea un objeto NUEVO para que React detecte el cambio.',
      },
    ],
    tip: {
      en: 'Never call the setter during render. Multiple setState calls in one event may be batched.',
      es: 'Nunca llames al setter durante el render. Varias llamadas en un mismo evento pueden agruparse (batching).',
    },
  },
  {
    id: 'useeffect',
    title: { en: 'useEffect', es: 'useEffect' },
    blurb: {
      en: 'Synchronize your component with the outside world after rendering: fetch, DOM, timers, subscriptions.',
      es: 'Sincroniza tu componente con el mundo exterior después de renderizar: fetch, DOM, temporizadores, suscripciones.',
    },
    rows: [
      {
        code: 'useEffect(() => { … })',
        en: 'No array: runs after EVERY render.',
        es: 'Sin array: se ejecuta después de CADA render.',
      },
      {
        code: 'useEffect(() => { … }, [])',
        en: 'Empty array: runs ONCE after the first render (mount).',
        es: 'Array vacío: se ejecuta UNA VEZ después del primer render (montaje).',
      },
      {
        code: 'useEffect(() => { … }, [count])',
        en: 'With deps: runs after mount and whenever count changes.',
        es: 'Con dependencias: se ejecuta tras el montaje y cuando count cambia.',
      },
      {
        code: 'useEffect(() => {\n  const id = setInterval(tick, 1000)\n  return () => clearInterval(id)\n}, [])',
        en: 'Return a cleanup function: it runs before the next effect and on unmount.',
        es: 'Devuelve una función de limpieza: se ejecuta antes del siguiente efecto y al desmontar.',
      },
      {
        code: 'useEffect(() => {\n  fetchUser(userId)\n}, [userId])',
        en: 'Every value from the component used inside must be listed as a dependency.',
        es: 'Todo valor del componente usado dentro debe aparecer como dependencia.',
      },
    ],
    tip: {
      en: 'Effects run AFTER the render is painted. If you can compute it during render, you don’t need an effect.',
      es: 'Los efectos se ejecutan DESPUÉS de pintar el render. Si puedes calcularlo durante el render, no necesitas un efecto.',
    },
  },
  {
    id: 'jsx',
    title: { en: 'JSX', es: 'JSX' },
    blurb: {
      en: 'JavaScript-flavoured markup. It compiles to React.createElement() calls — it is not HTML.',
      es: 'Marcado con sabor a JavaScript. Se compila a llamadas React.createElement(): no es HTML.',
    },
    rows: [
      {
        code: '<h1>Hello {name}</h1>',
        en: 'Curly braces embed any JavaScript expression.',
        es: 'Las llaves incrustan cualquier expresión JavaScript.',
      },
      {
        code: '<div className="card">',
        en: 'Use className instead of class; htmlFor instead of for.',
        es: 'Usa className en vez de class; htmlFor en vez de for.',
      },
      {
        code: '<>\n  <p>A</p>\n  <p>B</p>\n</>',
        en: 'One parent required: wrap siblings in a fragment.',
        es: 'Se requiere un único padre: envuelve hermanos en un fragment.',
      },
      {
        code: '<img src={url} alt="pic" />',
        en: 'Attributes accept strings or {expressions}. Self-close void elements.',
        es: 'Los atributos aceptan strings o {expresiones}. Autocierra los elementos vacíos.',
      },
      {
        code: '{isLoggedIn ? <Dash /> : <Login />}',
        en: 'Conditional rendering inline with ternary or &&.',
        es: 'Renderizado condicional en línea con ternario o &&.',
      },
      {
        code: '{items.map(i =>\n  <li key={i.id}>{i.name}</li>)}',
        en: 'Lists: map data to elements, each with a stable unique key.',
        es: 'Listas: mapea datos a elementos, cada uno con una key única y estable.',
      },
      {
        code: '{/* comment */}',
        en: 'Comments inside JSX use this brace syntax.',
        es: 'Los comentarios dentro de JSX usan esta sintaxis con llaves.',
      },
    ],
    tip: {
      en: 'JSX rule of thumb: if it looks like HTML but behaves like JS, that’s the point.',
      es: 'Regla de oro de JSX: si parece HTML pero se comporta como JS, esa es la idea.',
    },
  },
  {
    id: 'events',
    title: { en: 'Events', es: 'Eventos' },
    blurb: {
      en: 'User actions flow into handlers: User → event → handler → setState → render.',
      es: 'Las acciones del usuario llegan a los manejadores: usuario → evento → manejador → setState → render.',
    },
    rows: [
      {
        code: '<button onClick={handleClick}>',
        en: 'Pass the function itself — don’t call it (no parentheses).',
        es: 'Pasa la función tal cual, sin llamarla (sin paréntesis).',
      },
      {
        code: '<button onClick={() => remove(id)}>',
        en: 'Need an argument? Wrap it in an arrow function.',
        es: '¿Necesitas un argumento? Envuélvelo en una arrow function.',
      },
      {
        code: 'onChange={e => setName(e.target.value)}',
        en: 'Read input values from the event object.',
        es: 'Lee los valores de los inputs desde el objeto del evento.',
      },
      {
        code: 'onSubmit={e => {\n  e.preventDefault()\n  save()\n}}',
        en: 'preventDefault() stops the browser’s default (e.g. page reload on submit).',
        es: 'preventDefault() detiene el comportamiento por defecto (p. ej. recargar al enviar).',
      },
      {
        code: 'onKeyDown={e => {\n  if (e.key === "Enter") send()\n}}',
        en: 'Keyboard handling via e.key.',
        es: 'Manejo de teclado mediante e.key.',
      },
    ],
    tip: {
      en: 'Naming convention: handle* for the function, on* for the prop that receives it.',
      es: 'Convención de nombres: handle* para la función, on* para la prop que la recibe.',
    },
  },
  {
    id: 'arrays',
    title: { en: 'Arrays & Keys', es: 'Arrays y keys' },
    blurb: {
      en: 'Render lists from data. Keys tell React which item is which across renders.',
      es: 'Renderiza listas desde datos. Las keys le dicen a React qué elemento es cuál entre renders.',
    },
    rows: [
      {
        code: '{users.map(u =>\n  <li key={u.id}>{u.name}</li>)}',
        en: 'Turn an array into elements with .map().',
        es: 'Convierte un array en elementos con .map().',
      },
      {
        code: 'key={user.id}  // not key={index}',
        en: 'Keys must be stable and unique (a database id). Index breaks on reorder.',
        es: 'Las keys deben ser estables y únicas (un id). El índice falla al reordenar.',
      },
      {
        code: 'setList([...list, newItem])',
        en: 'Add immutably: spread into a new array.',
        es: 'Añade de forma inmutable: expande en un array nuevo.',
      },
      {
        code: 'setList(list.filter(t => !t.done))',
        en: 'Remove immutably with filter.',
        es: 'Elimina de forma inmutable con filter.',
      },
      {
        code: 'setList(list.map(t =>\n  t.id === id ? { ...t, done: true } : t))',
        en: 'Update one item immutably with map.',
        es: 'Actualiza un elemento de forma inmutable con map.',
      },
    ],
    tip: {
      en: 'Wrong keys = wrong UI: inputs lose focus, state sticks to the wrong row.',
      es: 'Keys incorrectas = UI incorrecta: los inputs pierden el foco, el estado se pega a la fila equivocada.',
    },
  },
  {
    id: 'forms',
    title: { en: 'Forms', es: 'Formularios' },
    blurb: {
      en: 'Controlled inputs: React state is the single source of truth for what the user typed.',
      es: 'Inputs controlados: el estado de React es la única fuente de verdad de lo que escribe el usuario.',
    },
    rows: [
      {
        code: '<input\n  value={name}\n  onChange={e => setName(e.target.value)}\n/>',
        en: 'Controlled input: value comes from state, every keystroke updates it.',
        es: 'Input controlado: el value viene del estado, cada tecla lo actualiza.',
      },
      {
        code: '<textarea value={bio}\n  onChange={…} />',
        en: 'Textarea and select follow the same value + onChange pattern.',
        es: 'Textarea y select siguen el mismo patrón value + onChange.',
      },
      {
        code: '<input type="checkbox"\n  checked={ok}\n  onChange={e => setOk(e.target.checked)}\n/>',
        en: 'Checkboxes use checked (not value).',
        es: 'Los checkboxes usan checked (no value).',
      },
      {
        code: 'onChange={e => setForm({\n  ...form, [e.target.name]: e.target.value\n})}',
        en: 'One state object for many fields, keyed by input name.',
        es: 'Un solo objeto de estado para muchos campos, indexado por name.',
      },
      {
        code: '<form onSubmit={handleSubmit}>',
        en: 'Validate on submit; keep error messages in state.',
        es: 'Valida al enviar; guarda los mensajes de error en el estado.',
      },
    ],
    tip: {
      en: 'Typing does nothing? You set value without onChange — React made it read-only.',
      es: '¿No escribe nada? Pusiste value sin onChange: React lo volvió de solo lectura.',
    },
  },
  {
    id: 'router',
    title: { en: 'React Router', es: 'React Router' },
    blurb: {
      en: 'Client-side navigation: the URL decides which component renders — no page reload.',
      es: 'Navegación en el cliente: la URL decide qué componente se renderiza, sin recargar.',
    },
    rows: [
      {
        code: '<Routes>\n  <Route path="/" element={<Home />} />\n  <Route path="/about" element={<About />} />\n</Routes>',
        en: 'Map URL paths to components.',
        es: 'Mapea rutas URL a componentes.',
      },
      {
        code: '<Route path="/users/:id"\n  element={<User />} />',
        en: ':id is a dynamic segment of the URL.',
        es: ':id es un segmento dinámico de la URL.',
      },
      {
        code: 'const { id } = useParams()',
        en: 'Read dynamic segments inside the component.',
        es: 'Lee los segmentos dinámicos dentro del componente.',
      },
      {
        code: '<Link to="/about">About</Link>',
        en: 'Navigate without a full page reload (use instead of <a>).',
        es: 'Navega sin recargar la página (úsalo en vez de <a>).',
      },
      {
        code: 'const nav = useNavigate()\nnav("/done")',
        en: 'Navigate from code, e.g. after a form submits.',
        es: 'Navega desde el código, p. ej. tras enviar un formulario.',
      },
      {
        code: '<Route path="*"\n  element={<NotFound />} />',
        en: 'Catch-all route for 404 pages.',
        es: 'Ruta comodín para páginas 404.',
      },
    ],
    tip: {
      en: 'Mental model: URL → Router → Route → Component.',
      es: 'Modelo mental: URL → Router → Route → Componente.',
    },
  },
  {
    id: 'hooks',
    title: { en: 'Hooks overview', es: 'Resumen de hooks' },
    blurb: {
      en: 'Functions that plug your component into React features. Rules first, catalogue second.',
      es: 'Funciones que conectan tu componente con las funciones de React. Primero las reglas, luego el catálogo.',
    },
    rows: [
      {
        code: 'useState(initial)',
        en: 'Local state that triggers a re-render when changed.',
        es: 'Estado local que provoca un re-render al cambiar.',
      },
      {
        code: 'useEffect(fn, deps)',
        en: 'Side effects after render: fetch, timers, subscriptions.',
        es: 'Efectos secundarios tras el render: fetch, temporizadores, suscripciones.',
      },
      {
        code: 'useRef(initial)',
        en: 'A mutable box that persists across renders WITHOUT re-rendering.',
        es: 'Una caja mutable que persiste entre renders SIN re-renderizar.',
      },
      {
        code: 'useMemo(() => calc(a, b), [a, b])',
        en: 'Caches an expensive computed value.',
        es: 'Memoriza un valor calculado costoso.',
      },
      {
        code: 'useCallback(fn, deps)',
        en: 'Keeps a stable function identity across renders.',
        es: 'Mantiene una identidad de función estable entre renders.',
      },
      {
        code: 'useContext(MyContext)',
        en: 'Reads the nearest Provider’s value — no prop drilling.',
        es: 'Lee el valor del Provider más cercano, sin prop drilling.',
      },
      {
        code: 'function useWindowSize() { … }',
        en: 'Custom hooks (use* prefix) extract reusable stateful logic.',
        es: 'Los hooks personalizados (prefijo use*) extraen lógica con estado reutilizable.',
      },
      {
        code: '// Rules of hooks',
        en: 'Call hooks at the top level only, in the same order, inside components or custom hooks.',
        es: 'Llama a los hooks solo en el nivel superior, en el mismo orden, dentro de componentes o hooks propios.',
      },
    ],
    tip: {
      en: 'Don’t memoize everything: memoization has a cost. Measure first.',
      es: 'No memorices todo: la memorización tiene un coste. Mide primero.',
    },
  },
]

const STRINGS = {
  subtitle: {
    en: 'Quick-reference cards. Print one or all of them with your browser — the layout is print-ready.',
    es: 'Fichas de referencia rápida. Imprime una o todas con tu navegador: el diseño está listo para impresión.',
  },
  printAll: { en: 'Print all', es: 'Imprimir todas' },
  printOne: { en: 'Print', es: 'Imprimir' },
  tipLabel: { en: 'Tip', es: 'Consejo' },
}

function SheetCard({ sheet, dimmed, onPrint }) {
  const { t, lang } = useLang()
  return (
    <section
      aria-label={t(sheet.title)}
      className={`card print-sheet p-6 md:p-8 ${dimmed ? 'print-dim' : ''}`}
      style={{ breakInside: 'avoid' }}
    >
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-xl font-bold text-[var(--text-strong)] flex items-center gap-2">
          <FileText size={20} className="text-[var(--accent)]" aria-hidden="true" />
          {t(sheet.title)}
        </h2>
        <button type="button" className="btn !py-1.5 !px-3 !text-sm no-print" onClick={onPrint}>
          <Printer size={14} aria-hidden="true" />
          {t(STRINGS.printOne)}
        </button>
      </div>
      <p className="text-sm text-[var(--muted)] mb-4">{t(sheet.blurb)}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {sheet.rows.map((row, i) => (
              <tr key={i} className="border-t border-[var(--border)] align-top">
                <td className="py-2.5 pr-4 mono text-[13px] leading-relaxed text-[var(--accent)] whitespace-pre-wrap break-words w-[44%] min-w-[200px]">
                  {row.code}
                </td>
                <td className="py-2.5 text-[var(--muted)]">{lang === 'es' ? row.es : row.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout type="tip" title={t(STRINGS.tipLabel)}>
        {t(sheet.tip)}
      </Callout>
    </section>
  )
}

export default function CheatSheets() {
  const { t } = useLang()
  const [printId, setPrintId] = useState(null)

  useEffect(() => {
    const done = () => setPrintId(null)
    window.addEventListener('afterprint', done)
    return () => window.removeEventListener('afterprint', done)
  }, [])

  const printSheet = (id) => {
    setPrintId(id)
    // Let React apply the .print-dim classes before opening the dialog.
    setTimeout(() => window.print(), 60)
  }

  return (
    <div>
      <div className={printId ? 'no-print' : ''}>
        <PageHeader
          title={t('nav.cheatsheets')}
          subtitle={t(STRINGS.subtitle)}
          icon={FileText}
          actions={
            <button type="button" className="btn no-print" onClick={() => window.print()}>
              <Printer size={15} aria-hidden="true" />
              {t(STRINGS.printAll)}
            </button>
          }
        />
      </div>
      <div className="flex flex-col gap-6">
        {SHEETS.map((s) => (
          <SheetCard
            key={s.id}
            sheet={s}
            dimmed={printId !== null && printId !== s.id}
            onPrint={() => printSheet(s.id)}
          />
        ))}
      </div>
    </div>
  )
}
