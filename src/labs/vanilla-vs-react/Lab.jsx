import { useEffect, useRef, useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Compare,
  FlowSteps,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

/* ------------------------------------------------------------------ */
/* Step log                                                           */
/* ------------------------------------------------------------------ */

function useStepLog() {
  const [entries, setEntries] = useState([])
  const log = (en, es) =>
    setEntries((prev) => [...prev.slice(-59), { en, es }])
  return { entries, log }
}

function StepLog({ entries, title, empty }) {
  const { t } = useLang()
  const boxRef = useRef(null)
  useEffect(() => {
    const el = boxRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries.length])
  return (
    <div className="mt-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
        {t(title)}
      </p>
      <ol
        ref={boxRef}
        aria-live="polite"
        className="mono text-xs leading-relaxed h-40 overflow-y-auto rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] p-3"
      >
        {entries.length === 0 && (
          <li className="text-[var(--faint)] italic">{t(empty)}</li>
        )}
        {entries.map((e, i) => (
          <li key={i} className="py-0.5 border-b border-[var(--code-border)]/40 last:border-0">
            <span className="text-[var(--accent)] font-bold mr-2">{i + 1}.</span>
            {t(e)}
          </li>
        ))}
      </ol>
    </div>
  )
}

function Side({ title, tag, children }) {
  return (
    <section className="card p-5 flex flex-col" aria-label={title}>
      <h3 className="font-bold text-[var(--text-strong)] mb-1">{title}</h3>
      <p className="mono text-xs text-[var(--accent)] mb-4">{tag}</p>
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* DEMO 1 — Counter                                                    */
/* ------------------------------------------------------------------ */

function VanillaCounter() {
  const { t } = useLang()
  const { entries, log } = useStepLog()
  const countRef = useRef(null)
  const statusRef = useRef(null)
  const btnRef = useRef(null)

  const click = () => {
    const el = countRef.current
    log(
      'Find the node: document.querySelector(\'[data-node="count"]\')',
      'Buscar el nodo: document.querySelector(\'[data-node="count"]\')',
    )
    const prev = el.textContent
    const next = String(Number(prev) + 1)
    el.textContent = next
    log(
      `Read + write: el.textContent = "${prev}" → "${next}"`,
      `Leer + escribir: el.textContent = "${prev}" → "${next}"`,
    )
    statusRef.current.textContent = t({
      en: `updated manually at ${new Date().toLocaleTimeString()}`,
      es: `actualizado a mano a las ${new Date().toLocaleTimeString()}`,
    })
    log(
      'Find ANOTHER node and update the status message',
      'Buscar OTRO nodo y actualizar el mensaje de estado',
    )
    btnRef.current.classList.add('bump')
    setTimeout(() => btnRef.current?.classList.remove('bump'), 300)
    log(
      'Toggle a class on the button for feedback: classList.add("bump")',
      'Alternar una clase en el botón: classList.add("bump")',
    )
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <button ref={btnRef} type="button" className="btn btn-primary text-lg px-5" onClick={click}>
          +1
        </button>
        <div className="mono text-2xl font-bold text-[var(--accent)]" data-node="count" ref={countRef}>
          0
        </div>
      </div>
      <p ref={statusRef} className="text-xs text-[var(--muted)] mt-2 h-4">
        {t({ en: 'not updated yet', es: 'aún sin actualizar' })}
      </p>
      <StepLog
        entries={entries}
        title={{ en: 'Imperative steps log', es: 'Registro de pasos imperativos' }}
        empty={{ en: 'Press +1 and watch every manual step.', es: 'Pulsa +1 y observa cada paso manual.' }}
      />
    </>
  )
}

const REACT_COUNTER_CODE = `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      count = {count}
    </button>
  );
}`

function ReactCounter() {
  const { t } = useLang()
  const { entries, log } = useStepLog()
  const [count, setCount] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const renders = useRef(0)

  useEffect(() => {
    renders.current += 1
    const n = renders.current
    log(
      `React re-renders <Counter /> — render #${n}`,
      `React vuelve a renderizar <Counter /> — render #${n}`,
    )
    log(
      'React diffs and updates the DOM for you',
      'React compara y actualiza el DOM por ti',
    )
  }, [count]) // eslint-disable-line react-hooks/exhaustive-deps

  const click = () => {
    log(
      `setCount(${count} → ${count + 1}) — state changes`,
      `setCount(${count} → ${count + 1}) — el estado cambia`,
    )
    setCount(count + 1)
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <button type="button" className="btn btn-primary text-lg px-5" onClick={click}>
          +1
        </button>
        <div className="mono text-2xl font-bold text-[var(--accent)]" aria-live="polite">
          {count}
        </div>
      </div>
      <button
        type="button"
        className="btn !py-1.5 !px-3 !text-xs mt-3 self-start"
        onClick={() => setShowCode((s) => !s)}
        aria-expanded={showCode}
      >
        {showCode
          ? t({ en: 'Hide code', es: 'Ocultar código' })
          : t({ en: 'Show the React code', es: 'Ver el código React' })}
      </button>
      {showCode && <CodeBlock code={REACT_COUNTER_CODE} lang="jsx" />}
      <StepLog
        entries={entries}
        title={{ en: 'Declarative steps log', es: 'Registro de pasos declarativos' }}
        empty={{ en: 'Press +1 — you only change state.', es: 'Pulsa +1: tú solo cambias el estado.' }}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* DEMO 2 — Todo list                                                  */
/* ------------------------------------------------------------------ */

function VanillaTodos() {
  const { t } = useLang()
  const { entries, log } = useStepLog()
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const countRef = useRef(null)
  const emptyRef = useRef(null)

  const add = () => {
    const input = inputRef.current
    log(
      'Find the input: document.querySelector(\'[data-node="todo-input"]\')',
      'Buscar el input: document.querySelector(\'[data-node="todo-input"]\')',
    )
    const text = input.value.trim()
    log(
      `Read its value: "${text || '(empty)'}"`,
      `Leer su valor: "${text || '(vacío)'}"`,
    )
    if (!text) {
      log('Empty — bail out manually', 'Vacío: salir manualmente')
      return
    }
    const li = document.createElement('li')
    log('Create a node: document.createElement("li")', 'Crear un nodo: document.createElement("li")')
    li.textContent = text
    li.className = 'vanilla-li'
    listRef.current.appendChild(li)
    log('Set text + insert: li.textContent = …; list.appendChild(li)', 'Poner texto e insertar: li.textContent = …; list.appendChild(li)')
    const n = listRef.current.children.length
    countRef.current.textContent = t({ en: `${n} items`, es: `${n} elementos` })
    log('Update the counter node manually', 'Actualizar el nodo del contador a mano')
    input.value = ''
    log('Clear the input manually: input.value = ""', 'Limpiar el input a mano: input.value = ""')
    if (n === 1) {
      emptyRef.current.style.display = 'none'
      log('Hide the "empty" message: msg.style.display = "none"', 'Ocultar el mensaje de "vacío": msg.style.display = "none"')
    }
  }

  return (
    <>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="flex gap-2 mb-3">
          <input
            ref={inputRef}
            data-node="todo-input"
            type="text"
            className="flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm"
            placeholder={t({ en: 'New task…', es: 'Nueva tarea…' })}
            aria-label={t({ en: 'New task', es: 'Nueva tarea' })}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button type="button" className="btn btn-primary" onClick={add}>
            {t({ en: 'Add', es: 'Añadir' })}
          </button>
        </div>
        <p ref={emptyRef} className="text-sm text-[var(--faint)] italic mb-2">
          {t({ en: 'No tasks yet.', es: 'Sin tareas todavía.' })}
        </p>
        <ul ref={listRef} className="flex flex-col gap-1.5 mb-2" />
        <p className="mono text-xs text-[var(--muted)]">
          <span ref={countRef}>0 {t({ en: 'items', es: 'elementos' })}</span>
        </p>
      </div>
      <StepLog
        entries={entries}
        title={{ en: 'Imperative steps log', es: 'Registro de pasos imperativos' }}
        empty={{ en: 'Add a task and count the manual steps.', es: 'Añade una tarea y cuenta los pasos manuales.' }}
      />
    </>
  )
}

const REACT_TODOS_CODE = `function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    setTodos([...todos, text]); // state changes…
    setText("");               // …React re-renders
  };

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
    </>
  );
}`

function ReactTodos() {
  const { t } = useLang()
  const { entries, log } = useStepLog()
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [showCode, setShowCode] = useState(false)
  const renders = useRef(0)

  useEffect(() => {
    renders.current += 1
    const n = renders.current
    log(
      `React re-renders <TodoList /> — render #${n}`,
      `React vuelve a renderizar <TodoList /> — render #${n}`,
    )
    log('React diffs and updates the DOM for you', 'React compara y actualiza el DOM por ti')
  }, [todos]) // eslint-disable-line react-hooks/exhaustive-deps

  const add = () => {
    if (!text.trim()) return
    log(
      `setTodos([...todos, "${text.trim()}"]) — state changes`,
      `setTodos([...todos, "${text.trim()}"]) — el estado cambia`,
    )
    setTodos([...todos, text.trim()])
    setText('')
  }

  return (
    <>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            className="flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm"
            placeholder={t({ en: 'New task…', es: 'Nueva tarea…' })}
            aria-label={t({ en: 'New task', es: 'Nueva tarea' })}
          />
          <button type="button" className="btn btn-primary" onClick={add}>
            {t({ en: 'Add', es: 'Añadir' })}
          </button>
        </div>
        {todos.length === 0 ? (
          <p className="text-sm text-[var(--faint)] italic mb-2">
            {t({ en: 'No tasks yet.', es: 'Sin tareas todavía.' })}
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5 mb-2" aria-live="polite">
            {todos.map((todo) => (
              <li key={todo} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm bg-[var(--surface-1)]">
                {todo}
              </li>
            ))}
          </ul>
        )}
        <p className="mono text-xs text-[var(--muted)]">
          {todos.length} {t({ en: 'items', es: 'elementos' })}
        </p>
      </div>
      <button
        type="button"
        className="btn !py-1.5 !px-3 !text-xs mt-3 self-start"
        onClick={() => setShowCode((s) => !s)}
        aria-expanded={showCode}
      >
        {showCode
          ? t({ en: 'Hide code', es: 'Ocultar código' })
          : t({ en: 'Show the React code', es: 'Ver el código React' })}
      </button>
      {showCode && <CodeBlock code={REACT_TODOS_CODE} lang="jsx" />}
      <StepLog
        entries={entries}
        title={{ en: 'Declarative steps log', es: 'Registro de pasos declarativos' }}
        empty={{ en: 'Add a task — you only change state.', es: 'Añade una tarea: tú solo cambias el estado.' }}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* DEMO 3 — Cart                                                        */
/* ------------------------------------------------------------------ */

const PRICE = 19

function VanillaCart() {
  const { t } = useLang()
  const { entries, log } = useStepLog()
  const qtyRef = useRef(null)
  const totalRef = useRef(null)
  const badgeRef = useRef(null)

  const change = (delta) => {
    const qtyEl = qtyRef.current
    log(
      'Find the quantity node: document.querySelector(\'[data-node="qty"]\')',
      'Buscar el nodo de cantidad: document.querySelector(\'[data-node="qty"]\')',
    )
    const next = Math.max(0, Number(qtyEl.textContent) + delta)
    qtyEl.textContent = String(next)
    log(`Write the new quantity: ${next}`, `Escribir la nueva cantidad: ${next}`)
    totalRef.current.textContent = `€${next * PRICE}`
    log('Recompute + update the TOTAL node yourself', 'Recalcular y actualizar TÚ el nodo del TOTAL')
    badgeRef.current.textContent = t({ en: `${next} in cart`, es: `${next} en el carrito` })
    log('Update the cart badge attribute/text', 'Actualizar el texto del distintivo del carrito')
  }

  return (
    <>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="font-semibold text-[var(--text-strong)] text-sm">
              {t({ en: 'React Hoodie', es: 'Sudadera React' })}
            </p>
            <p className="mono text-xs text-[var(--muted)]">€{PRICE}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn !px-3" onClick={() => change(-1)} aria-label="−1">−</button>
            <span ref={qtyRef} data-node="qty" className="mono text-xl font-bold w-8 text-center">0</span>
            <button type="button" className="btn !px-3" onClick={() => change(1)} aria-label="+1">+</button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span ref={badgeRef} className="text-xs text-[var(--muted)]">
            {t({ en: '0 in cart', es: '0 en el carrito' })}
          </span>
          <span className="mono font-bold text-[var(--accent)]">
            {t({ en: 'Total:', es: 'Total:' })} <span ref={totalRef}>€0</span>
          </span>
        </div>
      </div>
      <StepLog
        entries={entries}
        title={{ en: 'Imperative steps log', es: 'Registro de pasos imperativos' }}
        empty={{ en: 'Change the quantity — every node is yours to update.', es: 'Cambia la cantidad: cada nodo lo actualizas tú.' }}
      />
    </>
  )
}

const REACT_CART_CODE = `function Cart() {
  const [qty, setQty] = useState(0);
  const PRICE = 19;

  return (
    <>
      <button onClick={() => setQty(qty - 1)}>−</button>
      <span>{qty}</span>
      <button onClick={() => setQty(qty + 1)}>+</button>
      <p>Total: €{qty * PRICE}</p> {/* derived, not stored! */}
    </>
  );
}`

function ReactCart() {
  const { t } = useLang()
  const { entries, log } = useStepLog()
  const [qty, setQty] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const renders = useRef(0)

  useEffect(() => {
    renders.current += 1
    const n = renders.current
    log(
      `React re-renders <Cart /> — render #${n}`,
      `React vuelve a renderizar <Cart /> — render #${n}`,
    )
    log('Total is DERIVED from qty — nothing to update by hand', 'El total se DERIVA de qty: nada que actualizar a mano')
  }, [qty]) // eslint-disable-line react-hooks/exhaustive-deps

  const change = (delta) => {
    const next = Math.max(0, qty + delta)
    log(
      `setQty(${qty} → ${next}) — state changes`,
      `setQty(${qty} → ${next}) — el estado cambia`,
    )
    setQty(next)
  }

  return (
    <>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="font-semibold text-[var(--text-strong)] text-sm">
              {t({ en: 'React Hoodie', es: 'Sudadera React' })}
            </p>
            <p className="mono text-xs text-[var(--muted)]">€{PRICE}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn !px-3" onClick={() => change(-1)} aria-label="−1">−</button>
            <span className="mono text-xl font-bold w-8 text-center" aria-live="polite">{qty}</span>
            <button type="button" className="btn !px-3" onClick={() => change(1)} aria-label="+1">+</button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span className="text-xs text-[var(--muted)]">
            {qty} {t({ en: 'in cart', es: 'en el carrito' })}
          </span>
          <span className="mono font-bold text-[var(--accent)]">
            {t({ en: 'Total:', es: 'Total:' })} €{qty * PRICE}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="btn !py-1.5 !px-3 !text-xs mt-3 self-start"
        onClick={() => setShowCode((s) => !s)}
        aria-expanded={showCode}
      >
        {showCode
          ? t({ en: 'Hide code', es: 'Ocultar código' })
          : t({ en: 'Show the React code', es: 'Ver el código React' })}
      </button>
      {showCode && <CodeBlock code={REACT_CART_CODE} lang="jsx" />}
      <StepLog
        entries={entries}
        title={{ en: 'Declarative steps log', es: 'Registro de pasos declarativos' }}
        empty={{ en: 'Change the quantity — the total derives itself.', es: 'Cambia la cantidad: el total se deriva solo.' }}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Lab                                                                */
/* ------------------------------------------------------------------ */

const STRINGS = {
  intro: {
    en: 'Same task, two philosophies. On the left you do everything by hand; on the right you describe the desired state and React syncs the DOM.',
    es: 'La misma tarea, dos filosofías. A la izquierda lo haces todo a mano; a la derecha describes el estado deseado y React sincroniza el DOM.',
  },
  tabs: {
    counter: { en: 'Counter', es: 'Contador' },
    todos: { en: 'Todo list', es: 'Lista de tareas' },
    cart: { en: 'Shopping cart', es: 'Carrito' },
  },
  vanilla: { en: 'Vanilla JS', es: 'JavaScript puro' },
  react: { en: 'React', es: 'React' },
  vanillaTag: {
    en: 'imperative: you touch the DOM',
    es: 'imperativo: tú tocas el DOM',
  },
  reactTag: {
    en: 'declarative: you describe the state',
    es: 'declarativo: describes el estado',
  },
  reset: { en: 'Reset demo', es: 'Reiniciar demo' },
  compareTitle: { en: 'Compare the two philosophies', es: 'Compara las dos filosofías' },
  imperativeTitle: { en: 'Imperative (vanilla)', es: 'Imperativo (puro)' },
  declarativeTitle: { en: 'Declarative (React)', es: 'Declarativo (React)' },
}

const IMPERATIVE_FLOW = [
  { label: { en: 'Find the element', es: 'Encuentra el elemento' } },
  { label: { en: 'Read its current value', es: 'Lee su valor actual' } },
  { label: { en: 'Modify the element', es: 'Modifica el elemento' } },
  { label: { en: 'Update another element', es: 'Actualiza otro elemento' } },
  { label: { en: 'Update a third element…', es: 'Actualiza un tercer elemento…' } },
  { label: { en: 'Hope you got them all', es: 'Cruza los dedos' } },
]

const DECLARATIVE_FLOW = [
  { label: { en: 'State changes', es: 'El estado cambia' } },
  { label: { en: 'React renders the UI that matches', es: 'React renderiza la UI correspondiente' } },
  { label: { en: 'Done. Every node is in sync.', es: 'Listo. Todo sincronizado.' } },
]

const DEMOS = {
  counter: { vanilla: VanillaCounter, react: ReactCounter },
  todos: { vanilla: VanillaTodos, react: ReactTodos },
  cart: { vanilla: VanillaCart, react: ReactCart },
}

export default function VanillaVsReactLab() {
  const { t } = useLang()
  const [demo, setDemo] = useState('counter')
  const [resetKey, setResetKey] = useState(0)
  const { vanilla: VanillaDemo, react: ReactDemo } = DEMOS[demo]

  return (
    <SimulationShell
      labId="vanilla-vs-react"
      title={t({ en: 'Vanilla JS vs React', es: 'JavaScript puro vs React' })}
      intro={t(STRINGS.intro)}
      difficulty="beginner"
    >
      <div className="flex flex-wrap items-center gap-2 mb-6" role="tablist" aria-label={t({ en: 'Demo', es: 'Demo' })}>
        {Object.keys(DEMOS).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={demo === key}
            className={demo === key ? 'btn btn-primary' : 'btn'}
            onClick={() => setDemo(key)}
          >
            {t(STRINGS.tabs[key])}
          </button>
        ))}
        <button
          type="button"
          className="btn ml-auto"
          onClick={() => setResetKey((k) => k + 1)}
        >
          {t(STRINGS.reset)}
        </button>
      </div>

      <div key={`${demo}-${resetKey}`} className="grid lg:grid-cols-2 gap-4">
        <Side title={t(STRINGS.vanilla)} tag={t(STRINGS.vanillaTag)}>
          <VanillaDemo />
        </Side>
        <Side title={t(STRINGS.react)} tag={t(STRINGS.reactTag)}>
          <ReactDemo />
        </Side>
      </div>

      <SectionTitle>{t(STRINGS.compareTitle)}</SectionTitle>
      <Compare
        cols={[
          {
            title: t(STRINGS.imperativeTitle),
            children: <FlowSteps steps={IMPERATIVE_FLOW} auto={false} />,
          },
          {
            title: t(STRINGS.declarativeTitle),
            children: <FlowSteps steps={DECLARATIVE_FLOW} auto={false} />,
          },
        ]}
      />

      <Callout type="tip">
        {t({
          en: 'Imperative code answers HOW: which node, which attribute, in which order. Declarative code answers WHAT: given this state, this is the UI. React owns the "how" — so it can never forget a node.',
          es: 'El código imperativo responde CÓMO: qué nodo, qué atributo, en qué orden. El declarativo responde QUÉ: dado este estado, esta es la UI. React es dueño del "cómo", así que nunca olvida un nodo.',
        })}
      </Callout>
    </SimulationShell>
  )
}
