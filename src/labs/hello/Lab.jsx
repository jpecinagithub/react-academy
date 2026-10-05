import { useState, lazy, Suspense } from 'react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  GlossaryTerm,
  SectionTitle,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const ReactRunner = lazy(() => import('../../runtime/ReactRunner.jsx'))

const STRINGS = {
  intro: {
    en: 'Every lab follows the same arc: concept → visual explanation → experiment → code → challenge. Press the button below and watch the machine.',
    es: 'Cada laboratorio sigue el mismo arco: concepto → explicación visual → experimento → código → reto. Pulsa el botón y observa la máquina.',
  },
  flowTitle: { en: 'What happens when you press +1', es: 'Qué ocurre al pulsar +1' },
  experiment: { en: 'Experiment', es: 'Experimento' },
  codeTitle: { en: 'The code behind it', es: 'El código detrás' },
  sandbox: { en: 'Now break it (safely)', es: 'Ahora rómpelo (sin miedo)' },
  sandboxHint: {
    en: 'Edit the code below and press Run. Errors appear here — the academy never crashes.',
    es: 'Edita el código y pulsa Ejecutar. Los errores aparecen aquí: la academia nunca se rompe.',
  },
}

const FLOW = [
  { label: { en: 'User clicks +1', es: 'El usuario pulsa +1' } },
  { label: { en: 'setCount(count + 1)', es: 'setCount(count + 1)' } },
  {
    label: { en: 'State changes', es: 'El estado cambia' },
    desc: { en: 'count: 0 → 1', es: 'count: 0 → 1' },
  },
  {
    label: { en: 'React renders again', es: 'React renderiza de nuevo' },
    desc: { en: 'the component function runs again', es: 'la función componente se ejecuta de nuevo' },
  },
  { label: { en: 'UI updates', es: 'La UI se actualiza' } },
]

const CODE = `function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>count = {count}</button>;
}`

const SANDBOX_DEFAULT = `function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <strong>count = {count}</strong>
      <button onClick={() => setCount(0)}>reset</button>
    </div>
  );
}`

function MiniCounter() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex items-center gap-4 p-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
      <button type="button" className="btn btn-primary text-xl px-5" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
      <div className="mono text-2xl font-bold text-[var(--accent)]" aria-live="polite">
        count = {count}
      </div>
      <button type="button" className="btn" onClick={() => setCount(0)}>
        reset
      </button>
    </div>
  )
}

export default function HelloLab() {
  const { t } = useLang()
  const [code, setCode] = useState(SANDBOX_DEFAULT)
  const [runKey, setRunKey] = useState(0)

  return (
    <SimulationShell
      labId="hello-lab"
      title={t({ en: 'Hello Lab: your first state', es: 'Hola Lab: tu primer estado' })}
      intro={t(STRINGS.intro)}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.experiment)}</SectionTitle>
      <MiniCounter />

      <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
      <FlowSteps steps={FLOW} />

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <CodeBlock code={CODE} lang="jsx" />

      <SectionTitle>{t(STRINGS.sandbox)}</SectionTitle>
      <Callout type="tip">{t(STRINGS.sandboxHint)}</Callout>
      <Suspense fallback={<p className="text-[var(--muted)] text-sm">…</p>}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <textarea
              className="mono w-full h-64 p-3 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-sm text-[var(--text)]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              aria-label="sandbox code"
            />
            <div className="flex gap-2 mt-2">
              <button type="button" className="btn btn-primary" onClick={() => setRunKey((k) => k + 1)}>
                {t('common.run')}
              </button>
              <button type="button" className="btn" onClick={() => setCode(SANDBOX_DEFAULT)}>
                {t('common.reset')}
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 min-h-[16rem]">
            <Suspense fallback={null}>
              <ReactRunner code={code} runKey={runKey} />
            </Suspense>
          </div>
        </div>
      </Suspense>

      <p className="text-sm text-[var(--muted)] mt-6">
        <GlossaryTerm term="state">
          {t({ en: 'state', es: 'estado' })}
        </GlossaryTerm>{' '}
        {t({
          en: 'is data that changes. Changing it is the only thing that re-renders a component.',
          es: 'son datos que cambian. Cambiarlos es lo único que vuelve a renderizar un componente.',
        })}
      </p>
    </SimulationShell>
  )
}
