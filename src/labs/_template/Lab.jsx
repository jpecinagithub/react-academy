// TEMPLATE — copy this directory to labs/<your-lab>/ and adapt.
// Lab.jsx: the interactive lab itself. ALWAYS wrap in <SimulationShell>
// (handles title, intro, difficulty badge and the "Mark lab complete" button).
// Feature strings live in the local STRINGS constant — never in i18n/en.js.
import { useState } from 'react'
import { SimulationShell } from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'
// Pull more primitives as you need them:
// import { FlowSteps, CodeBlock, Callout, GlossaryTerm, Compare, Quiz } from '../../components/ui.jsx'
// Heavy pieces (editors, runners, charts) MUST be lazy so the lab page
// stays light. Example:
// const ReactRunner = lazy(() => import('../../runtime/ReactRunner.jsx'))

const STRINGS = {
  section: { en: 'Try it', es: 'Pruébalo' },
  hint: {
    en: 'Change the code, press buttons, break things — then observe.',
    es: 'Cambia el código, pulsa botones, rompe cosas y observa.',
  },
}

export default function Lab() {
  const { t } = useLang()
  const [count, setCount] = useState(0)

  return (
    <SimulationShell
      labId="my-lab"
      title={t({ en: 'My Lab', es: 'Mi laboratorio' })}
      intro={t({ en: 'One or two sentences.', es: 'Una o dos frases.' })}
      difficulty="beginner"
    >
      <h2 className="text-lg font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.section)}</h2>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.hint)}</p>

      {/* Your interactive content here. Use <GlossaryTerm term="state"> to
          annotate key vocabulary when tooltip mode is on. */}
      <button type="button" className="btn btn-primary" onClick={() => setCount((c) => c + 1)}>
        count = {count}
      </button>
    </SimulationShell>
  )
}
