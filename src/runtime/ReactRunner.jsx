import { Component, useMemo, useState } from 'react'
import * as React from 'react'
import { transform } from 'sucrase'
import { useLang } from '../i18n/index.jsx'

const STRINGS = {
  sandboxError: {
    en: 'Your code produced an error',
    es: 'Tu código produjo un error',
  },
  fixHint: {
    en: 'Fix the code above and press Run again.',
    es: 'Corrige el código y pulsa Ejecutar de nuevo.',
  },
  emptyHint: {
    en: 'Nothing to render yet — write a component and press Run.',
    es: 'Nada que renderizar todavía: escribe un componente y pulsa Ejecutar.',
  },
}

// Hooks exposed to user code inside the sandbox.
const HOOK_SCOPE = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  useContext: React.useContext,
  createContext: React.createContext,
  memo: React.memo,
  Fragment: React.Fragment,
}

/* ---------- Error boundary: render errors never crash the app ---------- */
class SandboxBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Never let user code break the shell; log locally for debugging.
    console.error('[sandbox]', error)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null, errorInfo: null })
    }
  }
  render() {
    if (this.state.error) {
      return <SandboxError error={this.state.error} />
    }
    return this.props.children
  }
}

export function SandboxError({ error }) {
  const { t } = useLang()
  const message = error?.message || String(error)
  const name = error?.name || 'Error'
  return (
    <div
      role="alert"
      className="rounded-xl border p-5"
      style={{ borderColor: 'var(--red)', background: 'var(--red-dim)' }}
    >
      <p className="font-bold text-[var(--red)] mb-2">
        ⚠ {t(STRINGS.sandboxError)}: {name}
      </p>
      <pre className="mono text-sm whitespace-pre-wrap text-[var(--text)]">{message}</pre>
      <p className="text-sm text-[var(--muted)] mt-3">{t(STRINGS.fixHint)}</p>
    </div>
  )
}

/* ---------- ReactRunner ---------- */
// Renders user-authored JSX safely.
//   <ReactRunner code={code} scope={{ extraThing }} runKey={n} />
// - sucrase transforms JSX -> React.createElement calls (classic runtime).
// - new Function('React','useState',...,'scope', body + '\nreturn App;')
// - executed in try/catch; render wrapped in <SandboxBoundary>.
// - "App" must be the default-exported or top-level function/class named App,
//   or the code may `return` a component. We look for: export default X,
//   function App, const App, class App.
// - runKey re-runs the transform; errors show <SandboxError>, never crash.
function compile(code, scope) {
  // Normalize: allow `export default function App` / `export default App`.
  let src = code.replace(/export\s+default\s+/g, '')
  const out = transform(src, { transforms: ['jsx'] }).code
  const scopeNames = Object.keys(scope)
  const factory = new Function(
    ...scopeNames,
    'React',
    `${out}\n;return (typeof App !== 'undefined' ? App : (typeof __App !== 'undefined' ? __App : null));`,
  )
  const AppComp = factory(...scopeNames.map((k) => scope[k]), React)
  if (!AppComp) {
    throw new Error(
      'No component named "App" found. Define function App() { ... } in your code.',
    )
  }
  return AppComp
}

export default function ReactRunner({ code, scope = {}, runKey = 0 }) {
  const { t } = useLang()
  const fullScope = useMemo(() => ({ ...HOOK_SCOPE, ...scope }), [scope])

  const { AppComp, error } = useMemo(() => {
    try {
      // runKey in the dep array forces recompilation on demand.
      void runKey
      return { AppComp: compile(code, fullScope), error: null }
    } catch (err) {
      return { AppComp: null, error: err }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, runKey, fullScope])

  if (error) return <SandboxError error={error} />
  if (!AppComp) {
    return (
      <p className="text-[var(--muted)] text-sm p-4">{t(STRINGS.emptyHint)}</p>
    )
  }
  return (
    <SandboxBoundary resetKey={runKey}>
      <AppComp />
    </SandboxBoundary>
  )
}

// Re-export so sandbox pages can force a re-run from outside.
export function useSandboxControls() {
  const [runKey, setRunKey] = useState(0)
  return { runKey, rerun: () => setRunKey((k) => k + 1) }
}
