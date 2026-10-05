import { useState } from 'react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  Quiz,
  SectionTitle,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  anatomy: { en: 'Anatomy of useState', es: 'Anatomía de useState' },
  anatomyBody: {
    en: 'One line of code gives you three things. The counter below is wired to these exact pieces — the value badge updates live.',
    es: 'Una línea de código te da tres cosas. El contador está conectado a estas piezas exactas: la insignia del valor se actualiza en vivo.',
  },
  valLabel: { en: 'count', es: 'count' },
  valDesc: { en: 'the current value', es: 'el valor actual' },
  fnLabel: { en: 'setCount', es: 'setCount' },
  fnDesc: { en: 'the function that changes it', es: 'la función que lo cambia' },
  initLabel: { en: '0', es: '0' },
  initDesc: { en: 'the initial value', es: 'el valor inicial' },
  machine: { en: 'The state machine', es: 'La máquina de estado' },
  machineHint: {
    en: 'Every click replays the full cycle. Watch each node light up in order.',
    es: 'Cada clic repite el ciclo completo. Observa cómo se ilumina cada nodo en orden.',
  },
  examples: { en: 'Same pattern, five flavors', es: 'Mismo patrón, cinco sabores' },
  examplesHint: {
    en: 'Counter, toggle, text, cart, dark mode — every one is just useState + an event + a render.',
    es: 'Contador, interruptor, texto, carrito, modo oscuro: todo es useState + un evento + un render.',
  },
  theCode: { en: 'The code', es: 'El código' },
  quizTitle: { en: 'Check what you learned', es: 'Comprueba lo aprendido' },
}

function flowSteps(prev) {
  return [
    { label: { en: 'Event', es: 'Evento' }, desc: { en: 'user pressed +1', es: 'el usuario pulsó +1' } },
    {
      label: { en: 'setCount(count + 1)', es: 'setCount(count + 1)' },
      desc: { en: 'you ask React to change the value', es: 'pides a React que cambie el valor' },
    },
    {
      label: { en: 'State changes', es: 'El estado cambia' },
      desc: { en: `count: ${prev} → ${prev + 1}`, es: `count: ${prev} → ${prev + 1}` },
    },
    {
      label: { en: 'Render triggered', es: 'Render provocado' },
      desc: { en: 'React runs your component function again', es: 'React ejecuta tu función componente de nuevo' },
    },
    {
      label: { en: 'DOM updated', es: 'DOM actualizado' },
      desc: { en: 'only the changed text is touched', es: 'solo se toca el texto cambiado' },
    },
  ]
}

const INPUT_CLS =
  'w-full px-3 py-2 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-sm text-[var(--text)]'

function ExampleCounter({ t }) {
  const [count, setCount] = useState(0)
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button type="button" className="btn btn-primary text-xl px-4" onClick={() => setCount((c) => c - 1)} aria-label="-1">−</button>
      <div className="mono text-2xl font-bold text-[var(--accent)] min-w-[6rem] text-center" aria-live="polite">
        {count}
      </div>
      <button type="button" className="btn btn-primary text-xl px-4" onClick={() => setCount((c) => c + 1)} aria-label="+1">+</button>
      <button type="button" className="btn" onClick={() => setCount(0)}>{t({ en: 'Reset', es: 'Reiniciar' })}</button>
    </div>
  )
}

function ExampleToggle({ t }) {
  const [on, setOn] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className="w-16 h-9 rounded-full p-1 transition-colors"
        style={{ background: on ? 'var(--accent)' : 'var(--border)' }}
        aria-label={t({ en: 'Toggle', es: 'Interruptor' })}
      >
        <span
          className="block w-7 h-7 rounded-full bg-white transition-transform"
          style={{ transform: on ? 'translateX(28px)' : 'translateX(0)' }}
        />
      </button>
      <span className="mono font-bold text-[var(--text-strong)]" aria-live="polite">
        {on ? t({ en: 'ON', es: 'ENCENDIDO' }) : t({ en: 'OFF', es: 'APAGADO' })}
      </span>
    </div>
  )
}

function ExampleText({ t }) {
  const [text, setText] = useState('')
  return (
    <div className="space-y-3 max-w-md">
      <input
        type="text"
        className={INPUT_CLS}
        placeholder={t({ en: 'Type something…', es: 'Escribe algo…' })}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label={t({ en: 'Mirror input', es: 'Campo espejo' })}
      />
      <p className="text-sm text-[var(--muted)]" aria-live="polite">
        {t({ en: 'Mirror:', es: 'Espejo:' })}{' '}
        <strong className="text-[var(--text-strong)]">{text || '…'}</strong>{' '}
        <span className="mono">({text.length})</span>
      </p>
    </div>
  )
}

function ExampleCart({ t }) {
  const [items, setItems] = useState([])
  const add = (name, price) => setItems((xs) => [...xs, { id: Date.now() + Math.random(), name, price }])
  const remove = (id) => setItems((xs) => xs.filter((x) => x.id !== id))
  const total = items.reduce((s, x) => s + x.price, 0)
  return (
    <div className="max-w-md space-y-3">
      <div className="flex gap-2 flex-wrap">
        <button type="button" className="btn" onClick={() => add(t({ en: 'Apple', es: 'Manzana' }), 1)}>
          + {t({ en: 'Apple', es: 'Manzana' })} ($1)
        </button>
        <button type="button" className="btn" onClick={() => add(t({ en: 'Bread', es: 'Pan' }), 2)}>
          + {t({ en: 'Bread', es: 'Pan' })} ($2)
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{t({ en: 'Cart is empty', es: 'Carrito vacío' })}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between text-sm card px-3 py-1.5">
              <span>{it.name} <span className="mono text-[var(--muted)]">${it.price}</span></span>
              <button type="button" className="btn px-2 py-0.5 text-xs" onClick={() => remove(it.id)} aria-label={`${t({ en: 'Remove', es: 'Quitar' })} ${it.name}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mono font-bold text-[var(--text-strong)]" aria-live="polite">
        {t({ en: 'Total', es: 'Total' })}: ${total}
      </p>
    </div>
  )
}

function ExampleDark({ t }) {
  const [dark, setDark] = useState(false)
  return (
    <div className="space-y-3">
      <button type="button" className="btn" onClick={() => setDark((d) => !d)} aria-pressed={dark}>
        {dark ? t({ en: '☀ Light mode', es: '☀ Modo claro' }) : t({ en: '🌙 Dark mode', es: '🌙 Modo oscuro' })}
      </button>
      <div
        className="rounded-xl border p-5 transition-colors"
        style={{
          background: dark ? '#0f172a' : '#f8fafc',
          borderColor: 'var(--border)',
          color: dark ? '#f1f5f9' : '#0f172a',
        }}
        aria-live="polite"
      >
        {t({ en: 'This panel reads the same boolean state.', es: 'Este panel lee el mismo estado booleano.' })}
      </div>
    </div>
  )
}

const EXAMPLES = [
  {
    id: 'counter',
    tab: { en: 'Counter', es: 'Contador' },
    code: `const [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>\n  {count}\n</button>`,
    render: (t) => <ExampleCounter t={t} />,
  },
  {
    id: 'toggle',
    tab: { en: 'Toggle', es: 'Interruptor' },
    code: `const [on, setOn] = useState(false);\n\n<button onClick={() => setOn(!on)}>\n  {on ? 'ON' : 'OFF'}\n</button>`,
    render: (t) => <ExampleToggle t={t} />,
  },
  {
    id: 'text',
    tab: { en: 'Text mirror', es: 'Espejo de texto' },
    code: `const [text, setText] = useState('');\n\n<input value={text} onChange={e => setText(e.target.value)} />\n<p>{text}</p>`,
    render: (t) => <ExampleText t={t} />,
  },
  {
    id: 'cart',
    tab: { en: 'Shopping cart', es: 'Carrito' },
    code: `const [items, setItems] = useState([]);\n\n// never mutate: create a NEW array\nsetItems([...items, newItem]);`,
    render: (t) => <ExampleCart t={t} />,
  },
  {
    id: 'dark',
    tab: { en: 'Dark mode', es: 'Modo oscuro' },
    code: `const [dark, setDark] = useState(false);\n\n<div className={dark ? 'dark' : 'light'}>\n  …\n</div>`,
    render: (t) => <ExampleDark t={t} />,
  },
]

const QUIZ_QUESTIONS = [
  {
    q: { en: 'Why do we call setCount instead of changing the variable directly?', es: '¿Por qué llamamos a setCount en lugar de cambiar la variable directamente?' },
    options: [
      { en: 'React only re-renders when the setter is called', es: 'React solo vuelve a renderizar cuando se llama al setter' },
      { en: 'It is faster to type', es: 'Es más rápido de escribir' },
      { en: 'Variables cannot hold numbers', es: 'Las variables no pueden contener números' },
    ],
    answer: 0,
    explain: {
      en: 'Changing a plain variable does not notify React. The setter schedules a re-render with the new value.',
      es: 'Cambiar una variable normal no avisa a React. El setter programa un nuevo render con el nuevo valor.',
    },
  },
  {
    q: { en: 'What triggers a re-render of a component?', es: '¿Qué provoca que un componente se vuelva a renderizar?' },
    options: [
      { en: 'Calling the state setter with a new value', es: 'Llamar al setter con un valor nuevo' },
      { en: 'Reading the state variable', es: 'Leer la variable de estado' },
      { en: 'Declaring useState', es: 'Declarar useState' },
    ],
    answer: 0,
    explain: {
      en: 'setCount(newValue) tells React the state changed, so React calls your component function again.',
      es: 'setCount(nuevoValor) dice a React que el estado cambió, así React vuelve a llamar a tu función componente.',
    },
  },
  {
    q: { en: 'In useState(0), what is the 0?', es: 'En useState(0), ¿qué es el 0?' },
    options: [
      { en: 'The initial value of the state', es: 'El valor inicial del estado' },
      { en: 'The maximum value allowed', es: 'El valor máximo permitido' },
      { en: 'The number of re-renders', es: 'El número de renders' },
    ],
    answer: 0,
    explain: {
      en: 'The argument to useState is the initial value — used only on the first render.',
      es: 'El argumento de useState es el valor inicial, usado solo en el primer render.',
    },
  },
]

export default function StateLab() {
  const { t } = useLang()
  const [count, setCount] = useState(0)
  const [prev, setPrev] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [tab, setTab] = useState('counter')

  const active = EXAMPLES.find((e) => e.id === tab)

  return (
    <SimulationShell
      labId="state-lab"
      title={t({ en: 'State Machine Lab', es: 'Laboratorio de estado' })}
      intro={t({
        en: 'State is memory. Change it and React re-runs your component.',
        es: 'El estado es memoria. Cámbialo y React vuelve a ejecutar tu componente.',
      })}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.anatomy)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.anatomyBody)}</p>
      <CodeBlock code="const [count, setCount] = useState(0);" lang="jsx" />
      <div className="grid sm:grid-cols-3 gap-3 my-4">
        {[
          { label: STRINGS.valLabel, desc: STRINGS.valDesc, badge: String(count), live: true },
          { label: STRINGS.fnLabel, desc: STRINGS.fnDesc, badge: 'ƒ()', live: false },
          { label: STRINGS.initLabel, desc: STRINGS.initDesc, badge: '0', live: false },
        ].map((c) => (
          <div key={t(c.label)} className="card p-4 text-center">
            <div className="mono text-xl font-bold text-[var(--accent)]">{c.badge}</div>
            <div className="text-sm text-[var(--text-strong)] mt-1">{t(c.label)}</div>
            <div className="text-xs text-[var(--muted)] mt-1">{t(c.desc)}</div>
            {c.live && (
              <div className="mono text-xs mt-2 text-[var(--muted)]">
                {t({ en: 'live value', es: 'valor en vivo' })}
              </div>
            )}
          </div>
        ))}
      </div>

      <SectionTitle>{t(STRINGS.machine)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.machineHint)}</p>
      <div className="flex items-center gap-4 flex-wrap mb-2">
        <button
          type="button"
          className="btn btn-primary text-xl px-5"
          onClick={() => {
            setPrev(count)
            setCount((c) => c + 1)
            setClicks((k) => k + 1)
          }}
        >
          +1
        </button>
        <div className="mono text-2xl font-bold text-[var(--accent)]" aria-live="polite">
          count = {count}
        </div>
      </div>
      <FlowSteps key={clicks} steps={flowSteps(prev)} />

      <SectionTitle>{t(STRINGS.examples)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.examplesHint)}</p>
      <div role="tablist" aria-label={t(STRINGS.examples)} className="flex gap-2 flex-wrap mb-4">
        {EXAMPLES.map((e) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={tab === e.id}
            className={`btn ${tab === e.id ? 'btn-primary' : ''}`}
            onClick={() => setTab(e.id)}
          >
            {t(e.tab)}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <div className="card p-5 min-h-[12rem]">{active.render(t)}</div>
        <div>
          <p className="text-xs text-[var(--muted)] mb-2">{t(STRINGS.theCode)}</p>
          <CodeBlock code={active.code} lang="jsx" />
        </div>
      </div>
      <Callout type="tip">
        <GlossaryTerm term="state">{t({ en: 'state', es: 'estado' })}</GlossaryTerm>{' '}
        {t({
          en: 'is local memory of a component. When it changes, only that component (and its children) re-render — the rest of the page is untouched.',
          es: 'es la memoria local de un componente. Cuando cambia, solo ese componente (y sus hijos) se vuelven a renderizar; el resto de la página no se toca.',
        })}
      </Callout>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={QUIZ_QUESTIONS} quizId="state-lab" />
    </SimulationShell>
  )
}
