import { Component } from 'react'
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
}

/* ---------- Error boundary: render errors never crash the app ---------- */
export class SandboxBoundary extends Component {
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
