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
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'Events are how the user talks to React. You describe what should happen (onClick={handleClick}); React wires the browser event and calls your handler when it fires.',
    es: 'Los eventos son la forma en que el usuario habla con React. Describes qué debe ocurrir (onClick={handleClick}); React conecta el evento del navegador y llama a tu manejador cuando se dispara.',
  },
  fire: { en: 'Fire an event', es: 'Dispara un evento' },
  fireHint: {
    en: 'Use the controls below — each one fires a real event. The flow diagram replays and the log records every step with a timestamp.',
    es: 'Usa los controles: cada uno dispara un evento real. El diagrama se repite y el registro anota cada paso con su hora.',
  },
  live: { en: 'Live state', es: 'Estado en vivo' },
  log: { en: 'Event log', es: 'Registro de eventos' },
  logEmpty: { en: 'No events yet — fire one above.', es: 'Sin eventos todavía: dispara uno arriba.' },
  clear: { en: 'Clear log', es: 'Limpiar registro' },
  handlerCode: { en: 'The handler code', es: 'El código del manejador' },
  pitfallTitle: { en: 'The classic mistake', es: 'El error clásico' },
  pitfallBody: {
    en: 'onClick={handleClick} passes the function to React. onClick={handleClick()} CALLS it during render — usually an infinite loop. When you need arguments: onClick={() => handleClick(id)}.',
    es: 'onClick={handleClick} pasa la función a React. onClick={handleClick()} la LLAMA durante el render, normalmente un bucle infinito. Si necesitas argumentos: onClick={() => handleClick(id)}.',
  },
  pitfallNote: {
    en: 'React events are “synthetic”: React normalizes them so they behave the same in every browser.',
    es: 'Los eventos de React son «sintéticos»: React los normaliza para que se comporten igual en todos los navegadores.',
  },
  challenge: { en: 'Mini challenge: spot the bug', es: 'Mini reto: encuentra el error' },
  challengeHint: {
    en: 'Look at this button. Predict what happens when the page renders, then reveal the answer.',
    es: 'Mira este botón. Predice qué ocurre al renderizar la página y luego revela la respuesta.',
  },
  reveal: { en: 'Reveal what happens', es: 'Revelar qué ocurre' },
  hide: { en: 'Hide', es: 'Ocultar' },
  challengeAnswer: {
    en: 'setCount(count + 1) runs DURING render. Each render calls the setter again → another render → infinite loop. React will warn you. Fix: onClick={() => setCount(count + 1)}.',
    es: 'setCount(count + 1) se ejecuta DURANTE el render. Cada render llama al setter → otro render → bucle infinito. React te avisará. Solución: onClick={() => setCount(count + 1)}.',
  },
  quizTitle: { en: 'Check what you learned', es: 'Comprueba lo aprendido' },
}

const EVENTS = {
  click: {
    tab: { en: 'onClick', es: 'onClick' },
    code: `function handleClick() {\n  setCount(count + 1);\n}\n\n<button onClick={handleClick}>\n  count = {count}\n</button>`,
    steps: () => [
      { label: { en: 'User clicks', es: 'El usuario hace clic' } },
      { label: { en: 'onClick fires', es: 'onClick se dispara' } },
      { label: { en: 'handleClick() runs', es: 'handleClick() se ejecuta' } },
      { label: { en: 'setCount(count + 1)', es: 'setCount(count + 1)' } },
      { label: { en: 'React renders → UI updates', es: 'React renderiza → la UI se actualiza' } },
    ],
    logMsg: (t) => t({ en: 'click → handleClick → setCount', es: 'clic → handleClick → setCount' }),
  },
  change: {
    tab: { en: 'onChange', es: 'onChange' },
    code: `function handleChange(e) {\n  setText(e.target.value);\n}\n\n<input value={text} onChange={handleChange} />`,
    steps: () => [
      { label: { en: 'User types', es: 'El usuario escribe' } },
      { label: { en: 'onChange fires', es: 'onChange se dispara' } },
      { label: { en: 'handleChange(e) runs', es: 'handleChange(e) se ejecuta' }, desc: { en: 'e.target.value = the new text', es: 'e.target.value = el texto nuevo' } },
      { label: { en: 'setText(value)', es: 'setText(value)' } },
      { label: { en: 'React renders → input mirrors', es: 'React renderiza → el campo refleja' } },
    ],
    logMsg: (t) => t({ en: 'change → handleChange → setText', es: 'cambio → handleChange → setText' }),
  },
  submit: {
    tab: { en: 'onSubmit', es: 'onSubmit' },
    code: `function handleSubmit(e) {\n  e.preventDefault();   // stop the page reload!\n  setSent(true);\n}\n\n<form onSubmit={handleSubmit}>…</form>`,
    steps: () => [
      { label: { en: 'User submits the form', es: 'El usuario envía el formulario' } },
      { label: { en: 'onSubmit fires', es: 'onSubmit se dispara' } },
      { label: { en: 'handleSubmit(e) runs', es: 'handleSubmit(e) se ejecuta' }, desc: { en: 'e.preventDefault() stops the reload', es: 'e.preventDefault() evita la recarga' } },
      { label: { en: 'setSent(true)', es: 'setSent(true)' } },
      { label: { en: 'React renders → confirmation', es: 'React renderiza → confirmación' } },
    ],
    logMsg: (t) => t({ en: 'submit → handleSubmit → setSent', es: 'envío → handleSubmit → setSent' }),
  },
  keydown: {
    tab: { en: 'onKeyDown', es: 'onKeyDown' },
    code: `function handleKeyDown(e) {\n  if (e.key === 'Enter') setSent(true);\n}\n\n<input onKeyDown={handleKeyDown} />`,
    steps: () => [
      { label: { en: 'User presses a key', es: 'El usuario pulsa una tecla' } },
      { label: { en: 'onKeyDown fires', es: 'onKeyDown se dispara' } },
      { label: { en: 'handleKeyDown(e) runs', es: 'handleKeyDown(e) se ejecuta' }, desc: { en: 'e.key tells you which key', es: 'e.key indica qué tecla' } },
      { label: { en: 'setState(...)', es: 'setState(...)' } },
      { label: { en: 'React renders → UI updates', es: 'React renderiza → la UI se actualiza' } },
    ],
    logMsg: (t) => t({ en: 'keydown → handleKeyDown → setState', es: 'tecla → handleKeyDown → setState' }),
  },
}

const QUIZ_QUESTIONS = [
  {
    q: { en: 'What does onClick={handleClick} do?', es: '¿Qué hace onClick={handleClick}?' },
    options: [
      { en: 'Passes the function so React calls it on click', es: 'Pasa la función para que React la llame al hacer clic' },
      { en: 'Calls handleClick immediately', es: 'Llama a handleClick inmediatamente' },
      { en: 'Disables the button', es: 'Desactiva el botón' },
    ],
    answer: 0,
    explain: {
      en: 'Without parentheses you pass a reference. React stores it and calls it when the event fires.',
      es: 'Sin paréntesis pasas una referencia. React la guarda y la llama cuando el evento se dispara.',
    },
  },
  {
    q: { en: 'What is wrong with onClick={setCount(count + 1)}?', es: '¿Qué está mal en onClick={setCount(count + 1)}?' },
    options: [
      { en: 'It runs during render — usually an infinite loop', es: 'Se ejecuta durante el render: normalmente un bucle infinito' },
      { en: 'Nothing, it is the recommended pattern', es: 'Nada, es el patrón recomendado' },
      { en: 'It only works for strings', es: 'Solo funciona con textos' },
    ],
    answer: 0,
    explain: {
      en: 'Parentheses call the function immediately. Each render triggers setState, which triggers another render…',
      es: 'Los paréntesis llaman a la función de inmediato. Cada render dispara setState, que dispara otro render…',
    },
  },
  {
    q: { en: 'Why do we call e.preventDefault() in a form submit handler?', es: '¿Por qué llamamos a e.preventDefault() en el manejador de envío?' },
    options: [
      { en: 'To stop the browser from reloading the page', es: 'Para evitar que el navegador recargue la página' },
      { en: 'To make the form submit faster', es: 'Para que el formulario se envíe más rápido' },
      { en: 'To clear the inputs', es: 'Para limpiar los campos' },
    ],
    answer: 0,
    explain: {
      en: 'Native form submission reloads the page. In a React SPA we handle the data ourselves with state.',
      es: 'El envío nativo recarga la página. En una SPA de React gestionamos los datos nosotros con el estado.',
    },
  },
]

const BUG_CODE = `// ❌ Spot the bug:
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={setCount(count + 1)}>
      {count}
    </button>
  );
}`

export default function EventFlow() {
  const { t } = useLang()
  const [active, setActive] = useState('click')
  const [runKey, setRunKey] = useState(0)
  const [log, setLog] = useState([])
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [reveal, setReveal] = useState(false)

  const pushLog = (msg) => {
    const time = new Date().toLocaleTimeString()
    setLog((xs) => [{ time, msg }, ...xs].slice(0, 8))
  }

  const fire = (key) => {
    setActive(key)
    if (key === 'click') setCount((c) => c + 1)
    if (key === 'submit') setSent(true)
    pushLog(EVENTS[key].logMsg(t))
    setRunKey((k) => k + 1)
  }

  const ev = EVENTS[active]

  return (
    <SimulationShell
      labId="event-flow"
      title={t({ en: 'Event Flow Simulator', es: 'Simulador de flujo de eventos' })}
      intro={t({
        en: 'Every event is a journey: user → handler → state → render.',
        es: 'Cada evento es un viaje: usuario → manejador → estado → render.',
      })}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <Callout type="info">
        <GlossaryTerm term="event">{t({ en: 'events', es: 'eventos' })}</GlossaryTerm>{' '}
        {t(STRINGS.conceptBody)}
      </Callout>

      <SectionTitle>{t(STRINGS.fire)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.fireHint)}</p>

      <div role="tablist" aria-label={t(STRINGS.fire)} className="flex gap-2 flex-wrap mb-4">
        {Object.entries(EVENTS).map(([key, e]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={`btn ${active === key ? 'btn-primary' : ''}`}
            onClick={() => fire(key)}
          >
            <span className="mono">{t(e.tab)}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-start mb-2">
        <div className="card p-5 space-y-4">
          <div>
            <p className="text-xs text-[var(--muted)] mb-2">{t({ en: 'Try the real controls:', es: 'Prueba los controles reales:' })}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <button type="button" className="btn btn-primary" onClick={() => fire('click')}>
                {t({ en: 'Click me', es: 'Haz clic' })} ({count})
              </button>
              <input
                type="text"
                className="px-3 py-2 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-sm text-[var(--text)] w-40"
                placeholder="onChange…"
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  fire('change')
                }}
                aria-label="onChange demo"
              />
              <input
                type="text"
                className="px-3 py-2 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-sm text-[var(--text)] w-40"
                placeholder="onKeyDown…"
                onKeyDown={() => fire('keydown')}
                aria-label="onKeyDown demo"
              />
            </div>
          </div>
          <form
            className="flex items-center gap-3 flex-wrap border-t border-[var(--border)] pt-4"
            onSubmit={(e) => {
              e.preventDefault()
              fire('submit')
            }}
          >
            <button type="submit" className="btn">
              {t({ en: 'Submit form', es: 'Enviar formulario' })}
            </button>
            {sent && (
              <span className="text-sm text-[var(--accent)] font-semibold" aria-live="polite">
                ✓ {t({ en: 'submitted — no page reload!', es: 'enviado: ¡sin recargar la página!' })}
              </span>
            )}
          </form>
          <div className="border-t border-[var(--border)] pt-4">
            <p className="text-xs text-[var(--muted)] mb-2">{t(STRINGS.live)}</p>
            <CodeBlock
              code={`{\n  "count": ${count},\n  "text": "${text}",\n  "sent": ${sent}\n}`}
              lang="json"
            />
          </div>
        </div>

        <div>
          <FlowSteps key={runKey} steps={ev.steps()} />
        </div>
      </div>

      <SectionTitle>{t(STRINGS.handlerCode)}</SectionTitle>
      <CodeBlock code={ev.code} lang="jsx" />

      <SectionTitle>{t(STRINGS.log)}</SectionTitle>
      {log.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{t(STRINGS.logEmpty)}</p>
      ) : (
        <>
          <ul className="space-y-1 my-2" aria-live="polite">
            {log.map((entry, i) => (
              <li key={`${entry.time}-${i}`} className="mono text-xs card px-3 py-1.5 flex gap-3">
                <span className="text-[var(--accent)]">{entry.time}</span>
                <span className="text-[var(--text)]">{entry.msg}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn text-xs" onClick={() => setLog([])}>
            {t(STRINGS.clear)}
          </button>
        </>
      )}

      <Callout type="warn" title={t(STRINGS.pitfallTitle)}>
        <CodeBlock code={'onClick={handleClick}   // ✅ pass the function\nonClick={handleClick()}  // ❌ CALLS it during render'} lang="jsx" />
        <p className="mt-2">{t(STRINGS.pitfallBody)}</p>
        <p className="mt-2 text-[var(--muted)]">{t(STRINGS.pitfallNote)}</p>
      </Callout>

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-3">{t(STRINGS.challengeHint)}</p>
      <CodeBlock code={BUG_CODE} lang="jsx" />
      <button type="button" className="btn mt-3" onClick={() => setReveal((r) => !r)} aria-expanded={reveal}>
        {reveal ? t(STRINGS.hide) : t(STRINGS.reveal)}
      </button>
      {reveal && <Callout type="danger">{t(STRINGS.challengeAnswer)}</Callout>}

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={QUIZ_QUESTIONS} quizId="event-flow" />
    </SimulationShell>
  )
}
