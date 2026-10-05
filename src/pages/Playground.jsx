import { lazy, Suspense, useMemo, useState } from 'react'
import { Play, RotateCcw, Copy, Check, Wand2, TerminalSquare } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { PageHeader } from '../components/ui.jsx'
import { track } from '../utils/analytics.js'

const CodeEditor = lazy(() => import('../components/CodeEditor.jsx'))
const ReactRunner = lazy(() => import('../runtime/ReactRunner.jsx'))

const STRINGS = {
  subtitle: {
    en: 'Write real React, run it instantly, break it safely. Errors never leave this panel.',
    es: 'Escribe React real, ejecútalo al instante, rómpelo sin miedo. Los errores nunca salen de este panel.',
  },
  tabCode: { en: 'Code', es: 'Código' },
  tabPreview: { en: 'Preview', es: 'Vista previa' },
  copied: { en: 'Copied', es: 'Copiado' },
  filesLabel: { en: 'Files', es: 'Archivos' },
}

const DEFAULT_FILES = {
  'App.jsx': `function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h2>My Playground</h2>
      <Counter />
      <p>Count in App: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)}>+1 from App</button>
    </div>
  );
}`,
  'Counter.jsx': `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      border: '2px dashed #61dafb',
      borderRadius: 12,
      padding: 16,
      margin: '12px 0'
    }}>
      <p><strong>Counter.jsx</strong> — a separate component</p>
      <button onClick={() => setCount(count + 1)}>
        clicked {count} times
      </button>
    </div>
  );
}`,
  'UserCard.jsx': `function UserCard() {
  const user = { name: "Ada Lovelace", role: "Pioneer" };

  return (
    <div style={{
      background: '#161d26',
      borderRadius: 12,
      padding: 16,
      margin: '12px 0',
      color: '#e9f0f7'
    }}>
      <strong>{user.name}</strong>
      <div style={{ opacity: 0.7 }}>{user.role}</div>
    </div>
  );
}`,
}

// Multi-file assembly for the preview: later phases may teach imports; for
// now the runner concatenates the non-App files above App (each file must
// declare its component as a top-level function/class named after the file).
function assemble(files) {
  const app = files['App.jsx'] ?? ''
  const rest = Object.entries(files)
    .filter(([name]) => name !== 'App.jsx')
    .map(([, code]) => code)
    .join('\n\n')
  return `${rest}\n\n${app}`
}

// Naive "format": trim trailing whitespace, ensure final newline, normalize
// indentation of obvious blocks. Real prettier comes in a later phase if wanted.
function naiveFormat(code) {
  return code
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n'
}

export default function Playground() {
  const { t } = useLang()
  const [files, setFiles] = useState(DEFAULT_FILES)
  const [activeFile, setActiveFile] = useState('App.jsx')
  const [runKey, setRunKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [mobileTab, setMobileTab] = useState('code') // 'code' | 'preview'

  const code = files[activeFile] ?? ''
  const previewCode = useMemo(() => assemble(files), [files])

  const updateFile = (value) =>
    setFiles((f) => ({ ...f, [activeFile]: value ?? '' }))

  const run = () => {
    setRunKey((k) => k + 1)
    track('playground_run', { file: activeFile })
  }
  const reset = () => {
    setFiles(DEFAULT_FILES)
    setActiveFile('App.jsx')
    setRunKey((k) => k + 1)
  }
  const format = () => updateFile(naiveFormat(code))
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <button type="button" className="btn btn-primary" onClick={run}>
        <Play size={15} />
        {t('common.run')}
      </button>
      <button type="button" className="btn" onClick={reset}>
        <RotateCcw size={15} />
        {t('common.reset')}
      </button>
      <button type="button" className="btn" onClick={format} title={t('common.format')}>
        <Wand2 size={15} />
        {t('common.format')}
      </button>
      <button type="button" className="btn" onClick={copy}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? t(STRINGS.copied) : t('common.copy')}
      </button>
    </div>
  )

  const editorPane = (
    <Suspense fallback={<div className="p-8 text-[var(--muted)] text-sm">{t('common.loading')}</div>}>
      <CodeEditor value={code} onChange={updateFile} language="jsx" height="100%" />
    </Suspense>
  )

  const previewPane = (
    <div className="h-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 overflow-auto">
      <Suspense fallback={<div className="p-8 text-[var(--muted)] text-sm">{t('common.loading')}</div>}>
        <ReactRunner code={previewCode} runKey={runKey} />
      </Suspense>
    </div>
  )

  return (
    <div className="h-[calc(100vh-var(--header-h)-6rem)] min-h-[560px] flex flex-col">
      <PageHeader
        title={t('nav.playground')}
        subtitle={t(STRINGS.subtitle)}
        icon={TerminalSquare}
        actions={toolbar}
      />

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-2 mb-3 no-print" role="tablist" aria-label="playground view">
        {['code', 'preview'].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mobileTab === tab}
            className={mobileTab === tab ? 'btn btn-primary' : 'btn'}
            onClick={() => setMobileTab(tab)}
          >
            {t(tab === 'code' ? STRINGS.tabCode : STRINGS.tabPreview)}
          </button>
        ))}
      </div>

      {/* Desktop: files | editor | preview */}
      <div className="hidden md:grid flex-1 min-h-0 gap-4" style={{ gridTemplateColumns: '180px 1fr 1fr' }}>
        <div className="card p-3 overflow-y-auto" aria-label={t(STRINGS.filesLabel)}>
          <p className="text-xs font-bold text-[var(--faint)] uppercase tracking-wider px-2 mb-2">
            src/
          </p>
          {Object.keys(files).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveFile(name)}
              aria-current={activeFile === name}
              className="w-full text-left px-3 py-2 rounded-lg text-sm mono transition-colors"
              style={
                activeFile === name
                  ? { background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 700 }
                  : { color: 'var(--muted)' }
              }
            >
              {name}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex flex-col">
          <p className="mono text-xs text-[var(--faint)] mb-2">src/{activeFile}</p>
          <div className="flex-1 min-h-0">{editorPane}</div>
        </div>
        <div className="min-h-0 flex flex-col">
          <p className="mono text-xs text-[var(--faint)] mb-2">{t(STRINGS.tabPreview)}</p>
          <div className="flex-1 min-h-0">{previewPane}</div>
        </div>
      </div>

      {/* Mobile: single pane */}
      <div className="md:hidden flex-1 min-h-0">
        {mobileTab === 'code' ? (
          <div className="h-full flex flex-col">
            <div className="flex gap-2 mb-2 overflow-x-auto no-print" aria-label={t(STRINGS.filesLabel)}>
              {Object.keys(files).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveFile(name)}
                  className={activeFile === name ? 'btn btn-primary !text-xs' : 'btn !text-xs'}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0">{editorPane}</div>
          </div>
        ) : (
          <div className="h-full">{previewPane}</div>
        )}
      </div>
    </div>
  )
}
