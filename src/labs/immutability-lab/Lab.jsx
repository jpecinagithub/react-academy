import { memo, useRef, useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Compare,
  FlowSteps,
  Quiz,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'React decides whether your UI changed by comparing **references**, not values. If you hand `setState` the very same object it already holds, React sees no change — even if you mutated its insides.',
    es: 'React decide si tu UI cambió comparando **referencias**, no valores. Si le pasas a `setState` el mismo objeto que ya tenía, React no ve ningún cambio — aunque hayas mutado su interior.',
  },
  flowWrongTitle: { en: 'The wrong way: mutate', es: 'La forma incorrecta: mutar' },
  flowRightTitle: { en: 'The right way: replace', es: 'La forma correcta: reemplazar' },
  experiment: { en: 'Experiment: watch the references', es: 'Experimento: observa las referencias' },
  experimentHint: {
    en: 'Every object below carries an identity badge (Object #A, #B…). React only trusts the badge.',
    es: 'Cada objeto lleva una insignia de identidad (Objeto #A, #B…). React solo confía en la insignia.',
  },
  wrongPanel: { en: 'WRONG: mutate, then set the same object', es: 'MAL: mutar y pasar el mismo objeto' },
  rightPanel: { en: 'RIGHT: create a new object', es: 'BIEN: crear un objeto nuevo' },
  step1Mutate: { en: '1. Mutate the object', es: '1. Muta el objeto' },
  step2Set: { en: '2. Call setUser with the same object', es: '2. Llama a setUser con el mismo objeto' },
  step3Force: { en: '3. Force a parent re-render (unrelated)', es: '3. Fuerza un re-render del padre (no relacionado)' },
  reset: { en: 'Reset', es: 'Reiniciar' },
  updateImmutable: { en: 'Update name (immutable)', es: 'Actualizar nombre (inmutable)' },
  sameRef: { en: 'Same reference', es: 'Misma referencia' },
  newRef: { en: 'New reference', es: 'Nueva referencia' },
  reactSees: { en: 'React compares', es: 'React compara' },
  renderCount: { en: 'child renders', es: 'renders del hijo' },
  uiShows: { en: 'UI shows', es: 'La UI muestra' },
  actually: { en: 'Object actually holds', es: 'El objeto contiene' },
  skipped: {
    en: 'prevUser === nextUser → true. Same badge, no change detected — React skips the re-render.',
    es: 'prevUser === nextUser → true. Misma insignia, ningún cambio detectado: React omite el re-render.',
  },
  skippedMemo: {
    en: 'The memoized child only re-renders when its props change by reference. You mutated the inside, but the badge never changed — the UI stays stale forever.',
    es: 'El hijo memorizado solo se re-renderiza cuando sus props cambian por referencia. Mutaste el interior, pero la insignia nunca cambió: la UI queda obsoleta para siempre.',
  },
  rendered: {
    en: 'prevUser === nextUser → false. New badge, change detected — React re-renders and the UI updates.',
    es: 'prevUser === nextUser → false. Nueva insignia, cambio detectado: React re-renderiza y la UI se actualiza.',
  },
  nested: { en: 'Nested objects: spread at every level', es: 'Objetos anidados: spread en cada nivel' },
  nestedBody: {
    en: 'Spread is **shallow**. If you only copy the top level, the nested object keeps its old badge — and any component reading it stays stale.',
    es: 'El spread es **superficial**. Si solo copias el nivel superior, el objeto anidado conserva su insignia vieja, y cualquier componente que lo lea queda obsoleto.',
  },
  nestedMutateBtn: { en: 'Mutate nested + shallow copy', es: 'Mutar anidado + copia superficial' },
  nestedSpreadBtn: { en: 'Spread at both levels', es: 'Spread en ambos niveles' },
  nestedStale: {
    en: 'prefs badge unchanged → the memoized PrefsView never re-rendered. The theme label is stale.',
    es: 'Insignia de prefs sin cambios → el PrefsView memorizado nunca se re-renderizó. La etiqueta del tema está obsoleta.',
  },
  nestedFresh: {
    en: 'Both badges are new → PrefsView re-renders with the fresh value.',
    es: 'Ambas insignias son nuevas → PrefsView se re-renderiza con el valor actualizado.',
  },
  immer: {
    en: 'Libraries like Immer let you write mutable-looking code that produces immutable updates — same result, less spreading.',
    es: 'Librerías como Immer permiten escribir código que *parece* mutar pero produce actualizaciones inmutables: el mismo resultado, menos spreads.',
  },
  codeTitle: { en: 'The code behind it', es: 'El código' },
  challenge: { en: 'Challenge: prove you got it', es: 'Reto: demuestra que lo entendiste' },
  idLabel: { en: 'Object', es: 'Objeto' },
  rerenderFrozen: { en: 'renders (frozen)', es: 'renders (congelado)' },
}

const CODE_WRONG = `// ❌ WRONG
user.name = "Alex";   // mutate the inside
setUser(user);        // same reference!
// React: prevUser === nextUser → true → skip render`

const CODE_RIGHT = `// ✅ RIGHT
setUser({ ...user, name: "Alex" });
// React: prevUser === nextUser → false → render!`

const CODE_NESTED = `// ❌ shallow copy of a nested object
user.prefs.theme = "light";
setUser({ ...user });            // prefs still the same object!

// ✅ spread at EVERY level you change
setUser({
  ...user,
  prefs: { ...user.prefs, theme: "light" },
});`

function ObjectBadge({ id }) {
  return (
    <span
      className="mono inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold"
      style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border)' }}
      aria-label={id}
    >
      {id}
    </span>
  )
}

function RefCard({ id, fields, stale = false }) {
  const { t } = useLang()
  return (
    <div
      className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 mono text-sm"
      style={stale ? { opacity: 0.85 } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-[var(--text-strong)]">
          {t(STRINGS.idLabel)} <ObjectBadge id={id} />
        </span>
        {stale && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--amber-dim)] text-[var(--amber)] font-sans font-semibold">
            stale UI
          </span>
        )}
      </div>
      <dl className="space-y-1">
        {Object.entries(fields).map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="text-[var(--faint)]">{k}:</dt>
            <dd className="text-[var(--text-strong)] font-semibold">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// Memoized child: only re-renders when its `user` prop changes by reference.
// Exactly the optimization that mutation silently breaks.
const UserView = memo(function UserView({ user }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-4">
      <p className="text-sm text-[var(--muted)] mb-1">memoized child — name:</p>
      <p className="text-2xl font-bold text-[var(--text-strong)]">{user.name}</p>
      <p className="mono text-xs text-[var(--faint)] mt-2">
        renders: <strong className="text-[var(--accent)]">{renders.current}</strong>
      </p>
    </div>
  )
})

const PrefsView = memo(function PrefsView({ prefs }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-4">
      <p className="text-sm text-[var(--muted)] mb-1">memoized PrefsView — theme:</p>
      <p className="text-2xl font-bold text-[var(--text-strong)]">{prefs.theme}</p>
      <p className="mono text-xs text-[var(--faint)] mt-2">
        renders: <strong className="text-[var(--accent)]">{renders.current}</strong>
      </p>
    </div>
  )
})

const FLOW_WRONG = [
  { label: { en: 'Mutate the object', es: 'Mutar el objeto' }, desc: { en: 'user.name = "Alex" — the inside changes, the badge stays #A', es: 'user.name = "Alex": el interior cambia, la insignia sigue siendo #A' } },
  { label: { en: 'setUser(user)', es: 'setUser(user)' }, desc: { en: 'you pass the very same reference back', es: 'devuelves exactamente la misma referencia' } },
  { label: { en: 'React compares references', es: 'React compara referencias' }, desc: { en: 'prevUser === nextUser → true', es: 'prevUser === nextUser → true' } },
  { label: { en: 'Render skipped', es: 'Render omitido' }, desc: { en: 'no new badge, no change detected, stale UI', es: 'sin insignia nueva, sin cambio detectado, UI obsoleta' } },
]

const FLOW_RIGHT = [
  { label: { en: 'Create a new object', es: 'Crear un objeto nuevo' }, desc: { en: '{ ...user, name: "Alex" } — a fresh object with badge #B', es: '{ ...user, name: "Alex" }: un objeto nuevo con insignia #B' } },
  { label: { en: 'setUser(newObject)', es: 'setUser(newObject)' } },
  { label: { en: 'React compares references', es: 'React compara referencias' }, desc: { en: 'prevUser === nextUser → false', es: 'prevUser === nextUser → false' } },
  { label: { en: 'Render fires', es: 'El render se dispara' }, desc: { en: 'new badge, change detected, UI updates', es: 'insignia nueva, cambio detectado, la UI se actualiza' } },
]

export default function ImmutabilityLab() {
  const { t } = useLang()

  // ---- WRONG panel: stable identity, mutated inside ----
  const [wrongUser] = useState(() => ({ name: 'Jon', age: 30 }))
  const [wrongId] = useState('Object #A')
  const [wrongStep, setWrongStep] = useState(0) // 0 idle, 1 mutated, 2 set-called, 3 parent forced
  const [, setForceTick] = useState(0)

  const resetWrong = () => {
    wrongUser.name = 'Jon'
    wrongUser.age = 30
    setWrongStep(0)
  }

  // ---- RIGHT panel: real immutable updates ----
  const idCounter = useRef(66) // 'A' = 65
  const [rightState, setRightState] = useState({ id: 'Object #A', user: { name: 'Jon', age: 30 } })
  const [rightHistory, setRightHistory] = useState(['Object #A'])

  const updateRight = () => {
    idCounter.current += 1
    const newId = `Object #${String.fromCharCode(idCounter.current)}`
    const next = rightState.user.name === 'Alex' ? 'Jon' : 'Alex'
    setRightState({ id: newId, user: { ...rightState.user, name: next } })
    setRightHistory((h) => [...h, newId])
  }

  // ---- Nested demo ----
  const [profile, setProfile] = useState({ id: 'P#A', prefs: { id: 'N#A', theme: 'dark' } })
  const [nestedNote, setNestedNote] = useState(null) // 'stale' | 'fresh'

  const nestedMutate = () => {
    profile.prefs.theme = profile.prefs.theme === 'dark' ? 'light' : 'dark'
    setProfile({ ...profile }) // shallow: prefs keeps its badge
    setNestedNote('stale')
  }
  const nestedSpread = () => {
    const next = profile.prefs.theme === 'dark' ? 'light' : 'dark'
    setProfile({
      ...profile,
      id: profile.id + '′',
      prefs: { ...profile.prefs, id: profile.prefs.id + '′', theme: next },
    })
    setNestedNote('fresh')
  }

  const QUIZ = [
    {
      q: { en: 'You run user.name = "Alex"; setUser(user). What does React do?', es: 'Ejecutas user.name = "Alex"; setUser(user). ¿Qué hace React?' },
      options: [
        { en: 'Re-renders, because a field changed', es: 'Re-renderiza, porque un campo cambió' },
        { en: 'Skips the render: same reference, no change detected', es: 'Omite el render: misma referencia, ningún cambio detectado' },
        { en: 'Throws an error', es: 'Lanza un error' },
      ],
      answer: 1,
      explain: { en: 'setState compares by reference. Same object = same badge = no render.', es: 'setState compara por referencia. Mismo objeto = misma insignia = sin render.' },
    },
    {
      q: { en: 'Why does mutation break memoized components?', es: '¿Por qué la mutación rompe los componentes memorizados?' },
      options: [
        { en: 'Memo compares props by reference; a mutated object has the same reference', es: 'Memo compara props por referencia; un objeto mutado tiene la misma referencia' },
        { en: 'Memoized components cannot read objects', es: 'Los componentes memorizados no pueden leer objetos' },
        { en: 'Mutation deletes the component', es: 'La mutación elimina el componente' },
      ],
      answer: 0,
      explain: { en: 'React.memo skips rendering when props are unchanged — and "unchanged" means the same reference.', es: 'React.memo omite el render cuando las props no cambian, y "sin cambios" significa la misma referencia.' },
    },
    {
      q: { en: 'To update a nested field immutably you must…', es: 'Para actualizar un campo anidado de forma inmutable debes…' },
      options: [
        { en: 'Spread only the top level', es: 'Hacer spread solo del nivel superior' },
        { en: 'Spread every level you change, so each gets a new reference', es: 'Hacer spread de cada nivel que cambies, para que cada uno tenga una referencia nueva' },
        { en: 'Mutate it and call setState twice', es: 'Mutarlo y llamar a setState dos veces' },
      ],
      answer: 1,
      explain: { en: 'Spread is shallow — nested objects keep their old identity unless you copy them too.', es: 'El spread es superficial: los objetos anidados conservan su identidad salvo que también los copies.' },
    },
  ]

  return (
    <SimulationShell
      labId="immutability-lab"
      title={t({ en: 'Immutability Lab', es: 'Laboratorio de inmutabilidad' })}
      intro={t({ en: 'Why does React ignore your mutation? Because it watches references, not values. Compare the two panels and watch the identity badges.', es: '¿Por qué React ignora tu mutación? Porque vigila referencias, no valores. Compara los dos paneles y observa las insignias de identidad.' })}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--text)] mb-6 max-w-3xl">
        {t({
          en: 'React decides whether your UI changed by comparing references, not values. If you hand setState the very same object it already holds, React sees no change — even if you mutated its insides.',
          es: 'React decide si tu UI cambió comparando referencias, no valores. Si le pasas a setState el mismo objeto que ya tenía, React no ve ningún cambio, aunque hayas mutado su interior.',
        })}
      </p>
      <Compare
        cols={[
          { title: t(STRINGS.flowWrongTitle), children: <FlowSteps steps={FLOW_WRONG} /> },
          { title: t(STRINGS.flowRightTitle), children: <FlowSteps steps={FLOW_RIGHT} /> },
        ]}
      />

      <SectionTitle>{t(STRINGS.experiment)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.experimentHint)}</p>

      <Compare
        cols={[
          {
            title: t(STRINGS.wrongPanel),
            children: (
              <div className="space-y-4">
                <CodeBlock code={CODE_WRONG} lang="jsx" />
                <RefCard id={wrongId} fields={{ name: wrongUser.name, age: wrongUser.age }} stale={wrongStep >= 2} />
                <UserView user={wrongUser} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn" disabled={wrongStep !== 0} onClick={() => { wrongUser.name = 'Alex'; setWrongStep(1) }}>
                    {t(STRINGS.step1Mutate)}
                  </button>
                  <button type="button" className="btn" disabled={wrongStep !== 1} onClick={() => setWrongStep(2)}>
                    {t(STRINGS.step2Set)}
                  </button>
                  <button type="button" className="btn" disabled={wrongStep !== 2} onClick={() => { setForceTick((x) => x + 1); setWrongStep(3) }}>
                    {t(STRINGS.step3Force)}
                  </button>
                  <button type="button" className="btn" onClick={resetWrong}>{t(STRINGS.reset)}</button>
                </div>
                {wrongStep >= 2 && (
                  <Callout type="danger" title={t({ en: 'prevUser === nextUser → true', es: 'prevUser === nextUser → true' })}>
                    {t(STRINGS.skipped)}
                    {wrongStep >= 3 && <p className="mt-2">{t(STRINGS.skippedMemo)}</p>}
                  </Callout>
                )}
                {wrongStep >= 1 && (
                  <p className="mono text-xs text-[var(--muted)]">
                    {t(STRINGS.uiShows)} <strong className="text-[var(--amber)]">name = "Jon" (stale)</strong>
                    {' · '}
                    {t(STRINGS.actually)} <strong className="text-[var(--text-strong)]">name = "{wrongUser.name}"</strong>
                  </p>
                )}
              </div>
            ),
          },
          {
            title: t(STRINGS.rightPanel),
            children: (
              <div className="space-y-4">
                <CodeBlock code={CODE_RIGHT} lang="jsx" />
                <RefCard id={rightState.id} fields={{ name: rightState.user.name, age: rightState.user.age }} />
                <UserView user={rightState.user} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-primary" onClick={updateRight}>
                    {t(STRINGS.updateImmutable)}
                  </button>
                </div>
                <Callout type="tip" title={t({ en: 'prevUser === nextUser → false', es: 'prevUser === nextUser → false' })}>
                  {t(STRINGS.rendered)}
                </Callout>
                <p className="mono text-xs text-[var(--muted)]">
                  {t({ en: 'Identity history:', es: 'Historial de identidades:' })}{' '}
                  {rightHistory.join(' → ')}
                </p>
              </div>
            ),
          },
        ]}
      />

      <SectionTitle>{t(STRINGS.nested)}</SectionTitle>
      <p className="text-[var(--text)] mb-4 max-w-3xl">
        {t({
          en: 'Spread is shallow. If you only copy the top level, the nested object keeps its old badge — and any component reading it stays stale.',
          es: 'El spread es superficial. Si solo copias el nivel superior, el objeto anidado conserva su insignia vieja, y cualquier componente que lo lea queda obsoleto.',
        })}
      </p>
      <CodeBlock code={CODE_NESTED} lang="jsx" />
      <div className="grid md:grid-cols-2 gap-4 my-4">
        <div>
          <p className="mono text-sm mb-2">
            {t(STRINGS.idLabel)} <ObjectBadge id={profile.id} /> → prefs <ObjectBadge id={profile.prefs.id} />
          </p>
          <PrefsView prefs={profile.prefs} />
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={nestedMutate}>{t(STRINGS.nestedMutateBtn)}</button>
            <button type="button" className="btn btn-primary" onClick={nestedSpread}>{t(STRINGS.nestedSpreadBtn)}</button>
          </div>
          {nestedNote === 'stale' && (
            <Callout type="danger">{t(STRINGS.nestedStale)}</Callout>
          )}
          {nestedNote === 'fresh' && (
            <Callout type="tip">{t(STRINGS.nestedFresh)}</Callout>
          )}
        </div>
      </div>
      <Callout type="info">{t(STRINGS.immer)}</Callout>

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="immutability-lab" />
    </SimulationShell>
  )
}
