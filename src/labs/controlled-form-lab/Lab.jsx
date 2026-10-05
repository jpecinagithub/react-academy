// Controlled Input Lab — every keystroke visualized as
// input → onChange → setState → state → value={...}, plus uncontrolled
// contrast and live validation.
import { useRef, useState } from 'react'
import { Send, Eraser, Eye } from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Compare,
  Quiz,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  intro2: {
    en: 'In a controlled input, React owns the value. Type below and watch each keystroke complete a full loop before it appears on screen.',
    es: 'En un input controlado, React es dueño del valor. Escribe y observa cómo cada pulsación completa un ciclo entero antes de aparecer en pantalla.',
  },
  flowTitle: { en: '1 · The keystroke loop', es: '1 · El ciclo de cada pulsación' },
  flowHint: {
    en: 'The loop replays on every keystroke. Nothing is instant: the character appears only after state updates and React re-renders.',
    es: 'El ciclo se repite con cada pulsación. Nada es instantáneo: el carácter aparece solo después de que el estado se actualiza y React re-renderiza.',
  },
  formTitle: { en: '2 · The form', es: '2 · El formulario' },
  nameLabel: { en: 'Name', es: 'Nombre' },
  emailLabel: { en: 'Email', es: 'Email' },
  countryLabel: { en: 'Country', es: 'País' },
  countryPh: { en: 'Select…', es: 'Elige…' },
  stateTitle: { en: '3 · Live state', es: '3 · Estado en vivo' },
  stateHint: {
    en: 'This JSON is the single source of truth. The inputs above are just mirrors of it.',
    es: 'Este JSON es la única fuente de verdad. Los inputs son solo espejos de él.',
  },
  codeTitle: { en: '4 · The code', es: '4 · El código' },
  validationTitle: { en: '5 · Live validation', es: '5 · Validación en vivo' },
  emailError: {
    en: 'That email does not look valid yet.',
    es: 'Ese email aún no parece válido.',
  },
  submit: { en: 'Submit', es: 'Enviar' },
  clear: { en: 'Clear', es: 'Limpiar' },
  submitError: {
    en: 'Fix the highlighted fields before submitting.',
    es: 'Corrige los campos marcados antes de enviar.',
  },
  submitOk: {
    en: 'Submitted! In a real app this state object would travel to your API.',
    es: '¡Enviado! En una app real este objeto viajaría a tu API.',
  },
  unTitle: { en: '6 · The uncontrolled alternative', es: '6 · La alternativa no controlada' },
  unHint: {
    en: 'No value, no onChange. React does not track this input — you read it from the DOM with a ref, only when you need it.',
    es: 'Sin value ni onChange. React no rastrea este input: lo lees del DOM con una ref, solo cuando lo necesitas.',
  },
  readValue: { en: 'Read value via ref', es: 'Leer valor con la ref' },
  readResult: { en: 'ref.current.value =', es: 'ref.current.value =' },
  compareTitle: { en: '7 · When to use each', es: '7 · Cuándo usar cada uno' },
  challengeTitle: { en: '8 · Challenge', es: '8 · Reto' },
  tabControlled: { en: 'Controlled', es: 'Controlado' },
  tabUncontrolled: { en: 'Uncontrolled', es: 'No controlado' },
  controlledWins: {
    en: 'Live validation, formatting as you type, disabling submit until valid, instant feedback — all trivial when React owns the value.',
    es: 'Validación en vivo, formateo al escribir, bloquear el envío hasta que sea válido, feedback instantáneo: todo trivial cuando React es dueño del valor.',
  },
}

const FLOW_STEPS = [
  { label: { en: 'key pressed in <input>', es: 'tecla pulsada en <input>' } },
  { label: { en: 'onChange fires', es: 'onChange se dispara' } },
  { label: { en: 'setForm({ …form, name })', es: 'setForm({ …form, name })' } },
  { label: { en: 'state updates → re-render', es: 'el estado se actualiza → re-render' } },
  { label: { en: 'value={form.name} paints the char', es: 'value={form.name} pinta el carácter' } },
]

const COUNTRIES = [
  { en: 'Spain', es: 'España' },
  { en: 'Mexico', es: 'México' },
  { en: 'Argentina', es: 'Argentina' },
  { en: 'Colombia', es: 'Colombia' },
  { en: 'United States', es: 'Estados Unidos' },
  { en: 'Other', es: 'Otro' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CONTROLLED_CODE = `function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', country: '' });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <form>
      <input
        value={form.name}          // React owns the value
        onChange={update('name')}  // every keystroke → state
      />
      <input value={form.email} onChange={update('email')} />
    </form>
  );
}`

const UNCONTROLLED_CODE = `function QuickSearch() {
  const inputRef = useRef(null);   // a handle to the DOM node

  const search = () => {
    alert(inputRef.current.value); // read it only when needed
  };

  return (
    <>
      <input ref={inputRef} placeholder="type…" />
      <button onClick={search}>Search</button>
    </>
  );
}`

function PulseFlow({ pulseKey }) {
  return (
    <ol className="flex flex-col items-stretch my-4" aria-label="keystroke flow">
      {FLOW_STEPS.map((s, i) => (
        <li key={`${pulseKey}-${i}`} className="flex flex-col items-center">
          <div
            className="flow-step card px-4 py-2.5 text-center w-full max-w-md font-mono text-sm font-semibold text-[var(--text-strong)]"
            style={{ animationDelay: `${i * 0.28}s` }}
          >
            <FlowLabel step={s} />
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <div className="py-0.5 text-[var(--accent)] text-lg leading-none" aria-hidden="true">
              ↓
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}

function FlowLabel({ step }) {
  const { t } = useLang()
  return <>{t(step.label)}</>
}

const QUIZ = [
  {
    q: {
      en: 'What makes an input “controlled”?',
      es: '¿Qué hace que un input sea «controlado»?',
    },
    options: [
      { en: 'It has a ref attached', es: 'Tiene una ref asociada' },
      {
        en: 'Its value comes from state and every change goes through setState',
        es: 'Su valor viene del estado y cada cambio pasa por setState',
      },
      { en: 'It is inside a <form>', es: 'Está dentro de un <form>' },
      { en: 'It has a placeholder', es: 'Tiene un placeholder' },
    ],
    answer: 1,
    explain: {
      en: 'value={state} + onChange={setState}: React is the single source of truth.',
      es: 'value={estado} + onChange={setState}: React es la única fuente de verdad.',
    },
  },
  {
    q: {
      en: 'You type “a” in a controlled input. What happens first?',
      es: 'Escribes «a» en un input controlado. ¿Qué ocurre primero?',
    },
    options: [
      { en: 'The character appears on screen', es: 'El carácter aparece en pantalla' },
      { en: 'onChange fires with the new value', es: 'onChange se dispara con el nuevo valor' },
      { en: 'The form submits', es: 'El formulario se envía' },
      { en: 'useEffect runs', es: 'useEffect se ejecuta' },
    ],
    answer: 1,
    explain: {
      en: 'The DOM event fires first; the character only paints after state updates and React re-renders.',
      es: 'El evento del DOM se dispara primero; el carácter solo se pinta tras actualizar el estado y re-renderizar.',
    },
  },
  {
    q: {
      en: 'When is an uncontrolled input (ref) the pragmatic choice?',
      es: '¿Cuándo es pragmático un input no controlado (ref)?',
    },
    options: [
      {
        en: 'Reading a value once on submit, with no live validation needs',
        es: 'Leer un valor una vez al enviar, sin necesidad de validación en vivo',
      },
      { en: 'Live character-by-character validation', es: 'Validación en vivo carácter a carácter' },
      { en: 'Formatting input as the user types', es: 'Formatear el input mientras el usuario escribe' },
      { en: 'Disabling submit until the form is valid', es: 'Bloquear el envío hasta que el formulario sea válido' },
    ],
    answer: 0,
    explain: {
      en: 'Uncontrolled shines for “read once” cases; controlled wins whenever the UI must react to every keystroke.',
      es: 'Lo no controlado brilla para «leer una vez»; lo controlado gana cuando la UI debe reaccionar a cada pulsación.',
    },
  },
]

export default function ControlledFormLab() {
  const { t, lang } = useLang()
  const [tab, setTab] = useState('controlled')
  const [form, setForm] = useState({ name: '', email: '', country: '' })
  const [pulse, setPulse] = useState(0)
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)
  const [uncontrolledVal, setUncontrolledVal] = useState(null)
  const inputRef = useRef(null)

  const update = (field) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [field]: v }))
    setPulse((p) => p + 1)
    setSent(false)
  }

  const emailInvalid = form.email !== '' && !EMAIL_RE.test(form.email)
  const formValid = form.name.trim() !== '' && EMAIL_RE.test(form.email)

  const submit = (e) => {
    e.preventDefault()
    setTried(true)
    setSent(formValid)
  }

  const inputCls = (invalid) =>
    `w-full px-3 py-2 rounded-lg border bg-[var(--surface-3)] text-[var(--text-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
      invalid ? 'border-[var(--red)]' : 'border-[var(--border)]'
    }`

  return (
    <SimulationShell
      labId="controlled-form-lab"
      title={t({ en: 'Controlled Input Lab', es: 'Laboratorio de inputs controlados' })}
      intro={t({
        en: 'The input you are about to type in is a mirror: it shows exactly what React state holds — nothing more.',
        es: 'El input en el que vas a escribir es un espejo: muestra exactamente lo que guarda el estado de React, ni más ni menos.',
      })}
      difficulty="beginner"
    >
      <div className="flex gap-2 mb-6" role="tablist" aria-label={t({ en: 'Input modes', es: 'Modos de input' })}>
        {[
          { id: 'controlled', label: STRINGS.tabControlled },
          { id: 'uncontrolled', label: STRINGS.tabUncontrolled },
        ].map((tb) => (
          <button
            key={tb.id}
            type="button"
            role="tab"
            aria-selected={tab === tb.id}
            onClick={() => setTab(tb.id)}
            className={tab === tb.id ? 'btn btn-primary' : 'btn'}
          >
            {t(tb.label)}
          </button>
        ))}
      </div>

      {tab === 'controlled' && (
        <>
          <p className="text-[var(--text)] mb-4 max-w-3xl">
            <GlossaryTerm term="controlled component">
              {t({ en: 'controlled component', es: 'componente controlado' })}
            </GlossaryTerm>{' '}
            {t({
              en: 'means the rendered value always equals state. Type in the name field and follow the loop.',
              es: 'significa que el valor renderizado siempre es igual al estado. Escribe en el campo de nombre y sigue el ciclo.',
            })}
          </p>

          <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
          <p className="text-sm text-[var(--muted)] mb-2">{t(STRINGS.flowHint)}</p>
          <PulseFlow pulseKey={pulse} />

          <SectionTitle>{t(STRINGS.formTitle)}</SectionTitle>
          <form onSubmit={submit} noValidate className="card p-5 max-w-xl">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ctl-name" className="block text-sm font-semibold text-[var(--text-strong)] mb-1.5">
                  {t(STRINGS.nameLabel)}
                </label>
                <input
                  id="ctl-name"
                  type="text"
                  className={inputCls(tried && form.name.trim() === '')}
                  value={form.name}
                  onChange={update('name')}
                  placeholder={lang === 'es' ? 'Ada' : 'Ada'}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="ctl-email" className="block text-sm font-semibold text-[var(--text-strong)] mb-1.5">
                  {t(STRINGS.emailLabel)}
                </label>
                <input
                  id="ctl-email"
                  type="email"
                  className={inputCls(emailInvalid || (tried && !EMAIL_RE.test(form.email)))}
                  value={form.email}
                  onChange={update('email')}
                  placeholder="ada@lovelace.dev"
                  autoComplete="email"
                  aria-invalid={emailInvalid}
                  aria-describedby="ctl-email-err"
                />
                {emailInvalid && (
                  <p id="ctl-email-err" role="alert" className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                    {t(STRINGS.emailError)}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="ctl-country" className="block text-sm font-semibold text-[var(--text-strong)] mb-1.5">
                {t(STRINGS.countryLabel)}
              </label>
              <select id="ctl-country" className={inputCls(false)} value={form.country} onChange={update('country')}>
                <option value="">{t(STRINGS.countryPh)}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.en} value={c.en}>
                    {t(c)}
                  </option>
                ))}
              </select>
            </div>

            <SectionTitle>{t(STRINGS.validationTitle)}</SectionTitle>
            <p className="text-sm text-[var(--muted)] -mt-2 mb-4">{t(STRINGS.controlledWins)}</p>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary">
                <Send size={15} /> {t(STRINGS.submit)}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setForm({ name: '', email: '', country: '' })
                  setTried(false)
                  setSent(false)
                  setPulse((p) => p + 1)
                }}
              >
                <Eraser size={15} /> {t(STRINGS.clear)}
              </button>
            </div>
            {tried && !formValid && (
              <p role="alert" className="text-sm mt-3 font-semibold" style={{ color: 'var(--red)' }}>
                {t(STRINGS.submitError)}
              </p>
            )}
            {sent && (
              <Callout type="tip">
                {t(STRINGS.submitOk)}
                <CodeBlock code={JSON.stringify(form, null, 2)} lang="json" />
              </Callout>
            )}
          </form>

          <SectionTitle>{t(STRINGS.stateTitle)}</SectionTitle>
          <p className="text-sm text-[var(--muted)] mb-2">{t(STRINGS.stateHint)}</p>
          <CodeBlock code={JSON.stringify(form, null, 2)} lang="json" />

          <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
          <CodeBlock code={CONTROLLED_CODE} lang="jsx" />
        </>
      )}

      {tab === 'uncontrolled' && (
        <>
          <p className="text-[var(--text)] mb-4 max-w-3xl">{t(STRINGS.unHint)}</p>
          <div className="card p-5 max-w-xl">
            <label htmlFor="unctl" className="block text-sm font-semibold text-[var(--text-strong)] mb-1.5">
              {t({ en: 'Nickname (uncontrolled)', es: 'Apodo (no controlado)' })}
            </label>
            <input
              id="unctl"
              ref={inputRef}
              type="text"
              defaultValue=""
              placeholder={lang === 'es' ? 'escribe algo…' : 'type something…'}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] text-[var(--text-strong)]"
            />
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={() => setUncontrolledVal(inputRef.current?.value ?? '')}
            >
              <Eye size={15} /> {t(STRINGS.readValue)}
            </button>
            {uncontrolledVal !== null && (
              <p className="mt-3 font-mono text-sm text-[var(--text-strong)]" aria-live="polite">
                {t(STRINGS.readResult)} <strong style={{ color: 'var(--accent)' }}>“{uncontrolledVal}”</strong>
              </p>
            )}
          </div>
          <CodeBlock code={UNCONTROLLED_CODE} lang="jsx" />

          <SectionTitle>{t(STRINGS.compareTitle)}</SectionTitle>
          <Compare
            cols={[
              {
                title: t(STRINGS.tabControlled),
                children: (
                  <ul className="text-sm text-[var(--text)] space-y-1.5 list-disc pl-5">
                    <li>{t({ en: 'value={state} + onChange', es: 'value={estado} + onChange' })}</li>
                    <li>{t({ en: 'React re-renders on every keystroke', es: 'React re-renderiza con cada pulsación' })}</li>
                    <li>{t({ en: 'Live validation & formatting', es: 'Validación y formateo en vivo' })}</li>
                    <li>{t({ en: 'Default choice for forms', es: 'Opción por defecto para formularios' })}</li>
                  </ul>
                ),
              },
              {
                title: t(STRINGS.tabUncontrolled),
                children: (
                  <ul className="text-sm text-[var(--text)] space-y-1.5 list-disc pl-5">
                    <li>{t({ en: 'ref + defaultValue', es: 'ref + defaultValue' })}</li>
                    <li>{t({ en: 'No re-render while typing', es: 'Sin re-render al escribir' })}</li>
                    <li>{t({ en: 'Read once via ref.current.value', es: 'Leer una vez con ref.current.value' })}</li>
                    <li>{t({ en: 'Good for: file inputs, “read on submit”', es: 'Ideal para: inputs de fichero, «leer al enviar»' })}</li>
                  </ul>
                ),
              },
            ]}
          />
        </>
      )}

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="controlled-form-lab-challenge" />
    </SimulationShell>
  )
}
