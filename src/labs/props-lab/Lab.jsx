import { useState } from 'react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  Quiz,
  SectionTitle,
  Compare,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'Props are how a parent component passes data to a child — like arguments to a function. The child cannot change them; it just receives them and renders.',
    es: 'Las props son la forma en que un componente padre pasa datos a un hijo, como los argumentos de una función. El hijo no puede cambiarlas; solo las recibe y renderiza.',
  },
  flowTitle: { en: 'How props travel', es: 'Cómo viajan las props' },
  experiment: { en: 'Experiment: live props', es: 'Experimento: props en vivo' },
  experimentHint: {
    en: 'Change the inputs below. They are the props of the <UserCard> — watch the child re-render instantly.',
    es: 'Cambia los campos. Son las props de <UserCard>: observa cómo el hijo se vuelve a renderizar al instante.',
  },
  name: { en: 'name', es: 'nombre' },
  age: { en: 'age', es: 'edad' },
  role: { en: 'role', es: 'rol' },
  codeTitle: { en: 'The code React sees', es: 'El código que ve React' },
  breakTitle: { en: 'Break the component', es: 'Rompe el componente' },
  breakHint: {
    en: 'Real components receive wrong or missing props all the time. Try it and see how a resilient component behaves.',
    es: 'En la vida real los componentes reciben props incorrectas o ausentes. Pruébalo y observa cómo se comporta un componente resistente.',
  },
  removeName: { en: 'Remove the name prop', es: 'Eliminar la prop name' },
  wrongAge: { en: 'Pass age as a string', es: 'Pasar age como texto' },
  fix: { en: 'Fix the component', es: 'Arreglar el componente' },
  warnMissing: {
    en: 'name is missing → the card shows a fallback ("Anonymous") instead of crashing. Tip: use destructuring defaults: function UserCard({ name = "Anonymous" }).',
    es: 'name falta → la tarjeta muestra un valor por defecto ("Anonymous") en lugar de romperse. Consejo: usa valores por defecto al desestructurar: function UserCard({ name = "Anonymous" }).',
  },
  warnType: {
    en: 'age arrived as "thirty-two" (a string, not a number). The card refuses to guess and warns you — in a real app this is where PropTypes or TypeScript help.',
    es: 'age llegó como "thirty-two" (texto, no número). La tarjeta no adivina y te avisa; en una app real aquí ayudan PropTypes o TypeScript.',
  },
  ageLabel: { en: 'Age', es: 'Edad' },
  roleLabel: { en: 'Role', es: 'Rol' },
  anonymous: { en: 'Anonymous', es: 'Anónimo' },
  challenge: { en: 'Challenge', es: 'Reto' },
  quizTitle: { en: 'Check what you learned', es: 'Comprueba lo aprendido' },
  defaultNote: {
    en: 'Try the experiment above, then break it, then fix it — props stop being magic when you have touched them.',
    es: 'Prueba el experimento de arriba, luego rómpelo y arréglalo: las props dejan de ser magia cuando las tocas.',
  },
}

const FLOW = [
  {
    label: { en: 'Parent renders', es: 'El padre renderiza' },
    desc: { en: '<UserCard name="Alex" age={32} />', es: '<UserCard name="Alex" age={32} />' },
  },
  {
    label: { en: 'props flow down', es: 'las props bajan' },
    desc: { en: 'one-way: parent → child', es: 'en un solo sentido: padre → hijo' },
  },
  {
    label: { en: 'Child receives & renders', es: 'El hijo recibe y renderiza' },
    desc: { en: 'the child never modifies its props', es: 'el hijo nunca modifica sus props' },
  },
]

const QUIZ_QUESTIONS = [
  {
    q: { en: 'In which direction do props flow?', es: '¿En qué dirección fluyen las props?' },
    options: [
      { en: 'From parent to child', es: 'Del padre al hijo' },
      { en: 'From child to parent', es: 'Del hijo al padre' },
      { en: 'In both directions', es: 'En ambas direcciones' },
      { en: 'Randomly', es: 'Aleatoriamente' },
    ],
    answer: 0,
    explain: {
      en: 'Props are one-way: parent → child. Data flows down; events (callbacks) communicate upward.',
      es: 'Las props son unidireccionales: padre → hijo. Los datos bajan; los eventos (callbacks) comunican hacia arriba.',
    },
  },
  {
    q: { en: 'Can a child component modify its own props?', es: '¿Puede un hijo modificar sus propias props?' },
    options: [
      { en: 'Yes, freely', es: 'Sí, libremente' },
      { en: 'Only numbers', es: 'Solo los números' },
      { en: 'No — props are read-only', es: 'No: las props son de solo lectura' },
    ],
    answer: 2,
    explain: {
      en: 'Props are read-only. If the data must change, the parent updates its state and passes new props down.',
      es: 'Las props son de solo lectura. Si el dato debe cambiar, el padre actualiza su estado y pasa nuevas props.',
    },
  },
  {
    q: {
      en: 'The parent re-renders and passes a new name. What happens to the child?',
      es: 'El padre se vuelve a renderizar y pasa un nuevo nombre. ¿Qué le ocurre al hijo?',
    },
    options: [
      { en: 'It re-renders with the new name', es: 'Se vuelve a renderizar con el nuevo nombre' },
      { en: 'It keeps the old name forever', es: 'Conserva el nombre antiguo para siempre' },
      { en: 'It must be reloaded manually', es: 'Hay que recargarlo manualmente' },
    ],
    answer: 0,
    explain: {
      en: 'When props change, React re-renders the child with the new values — that is the declarative update cycle.',
      es: 'Cuando las props cambian, React vuelve a renderizar el hijo con los nuevos valores: ese es el ciclo de actualización declarativa.',
    },
  },
]

const INPUT_CLS =
  'mt-1 w-full px-3 py-2 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-sm text-[var(--text)]'
const DANGER_BTN_STYLE = { borderColor: '#f87171', color: '#f87171' }

function UserCard({ name, age, role, t }) {
  const displayName = name ?? t(STRINGS.anonymous)
  const ageIsNumber = typeof age === 'number'
  return (
    <div className="card p-5 max-w-sm w-full">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}
          aria-hidden="true"
        >
          {displayName === t(STRINGS.anonymous) ? '?' : displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-bold text-[var(--text-strong)]">{displayName}</div>
          <div className="text-sm text-[var(--muted)]">{role ?? '—'}</div>
        </div>
      </div>
      <div className="mt-4 mono text-sm">
        <span className="text-[var(--muted)]">{t(STRINGS.ageLabel)}: </span>
        {ageIsNumber ? (
          <span className="text-[var(--text-strong)]">{age}</span>
        ) : (
          <span style={{ color: '#f87171' }} className="font-semibold">
            "{String(age)}" ⚠ {t({ en: 'not a number', es: 'no es un número' })}
          </span>
        )}
      </div>
    </div>
  )
}

function codeFor(props) {
  const lines = ['<UserCard']
  if (props.name !== undefined) lines.push(`  name="${props.name}"`)
  if (props.age !== undefined)
    lines.push(typeof props.age === 'number' ? `  age={${props.age}}` : `  age="${props.age}"`)
  if (props.role !== undefined) lines.push(`  role="${props.role}"`)
  lines.push('/>')
  return lines.join('\n')
}

export default function PropsLab() {
  const { t } = useLang()
  const [props, setProps] = useState({ ...DEFAULT_PROPS })

  const set = (key) => (e) => {
    const v = e.target.value
    setProps((p) => ({ ...p, [key]: key === 'age' ? Number(v) || 0 : v }))
  }
  const broken = {
    missingName: props.name === undefined,
    wrongAge: props.age !== undefined && typeof props.age !== 'number',
  }

  return (
    <SimulationShell
      labId="props-lab"
      title={t({ en: 'Props Lab', es: 'Laboratorio de props' })}
      intro={t({
        en: 'Props carry data from parent to child. Touch them, break them, fix them.',
        es: 'Las props llevan datos del padre al hijo. Tócalas, rómpelas, arréglalas.',
      })}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <Callout type="info">
        {t(STRINGS.conceptBody)}{' '}
        <GlossaryTerm term="props">
          {t({ en: 'props', es: 'props' })}
        </GlossaryTerm>
      </Callout>

      <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
      <FlowSteps steps={FLOW} />

      <SectionTitle>{t(STRINGS.experiment)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.experimentHint)}</p>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="card p-5 space-y-4">
          <label className="block">
            <span className="mono text-sm text-[var(--muted)]">name</span>
            <input
              type="text"
              className={INPUT_CLS}
              value={props.name ?? ''}
              onChange={set('name')}
              disabled={broken.missingName}
              aria-label="name prop"
            />
          </label>
          <label className="block">
            <span className="mono text-sm text-[var(--muted)]">age</span>
            <input
              type="number"
              className={INPUT_CLS}
              value={typeof props.age === 'number' ? props.age : ''}
              onChange={set('age')}
              aria-label="age prop"
            />
          </label>
          <label className="block">
            <span className="mono text-sm text-[var(--muted)]">role</span>
            <input
              type="text"
              className={INPUT_CLS}
              value={props.role ?? ''}
              onChange={set('role')}
              aria-label="role prop"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <UserCard name={props.name} age={props.age} role={props.role} t={t} />
        </div>
      </div>

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <CodeBlock code={codeFor(props)} lang="jsx" />

      <SectionTitle>{t(STRINGS.breakTitle)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.breakHint)}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className="btn" style={DANGER_BTN_STYLE}
          onClick={() => setProps((p) => ({ ...p, name: undefined }))}
          disabled={broken.missingName}
        >
          {t(STRINGS.removeName)}
        </button>
        <button
          type="button"
          className="btn" style={DANGER_BTN_STYLE}
          onClick={() => setProps((p) => ({ ...p, age: 'thirty-two' }))}
          disabled={broken.wrongAge}
        >
          {t(STRINGS.wrongAge)}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setProps({ ...DEFAULT_PROPS })}>
          {t(STRINGS.fix)}
        </button>
      </div>
      {broken.missingName && <Callout type="warn">{t(STRINGS.warnMissing)}</Callout>}
      {broken.wrongAge && <Callout type="warn">{t(STRINGS.warnType)}</Callout>}
      {!broken.missingName && !broken.wrongAge && (
        <Callout type="tip">{t(STRINGS.defaultNote)}</Callout>
      )}

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <Compare
        cols={[
          {
            title: t({ en: 'Parent decides', es: 'El padre decide' }),
            children: (
              <p className="text-sm text-[var(--muted)]">
                {t({
                  en: 'The parent owns the data. It renders <UserCard> again with new props whenever the data changes.',
                  es: 'El padre posee los datos. Vuelve a renderizar <UserCard> con nuevas props cada vez que los datos cambian.',
                })}
              </p>
            ),
          },
          {
            title: t({ en: 'Child obeys', es: 'El hijo obedece' }),
            children: (
              <p className="text-sm text-[var(--muted)]">
                {t({
                  en: 'The child never writes to its props. It is a pure function of what it receives.',
                  es: 'El hijo nunca escribe en sus props. Es una función pura de lo que recibe.',
                })}
              </p>
            ),
          },
        ]}
      />

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={QUIZ_QUESTIONS} quizId="props-lab" />
    </SimulationShell>
  )
}
