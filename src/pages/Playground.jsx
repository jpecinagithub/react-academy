import { lazy, Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Play, RotateCcw, Copy, Check, Wand2, TerminalSquare, FilePlus2 } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { PageHeader } from '../components/ui.jsx'
import { getSandbox } from '../sandboxes/registry.js'
import { track } from '../utils/analytics.js'

const CodeEditor = lazy(() => import('../components/CodeEditor.jsx'))
const MultiFileRunner = lazy(() => import('../runtime/MultiFileRunner.jsx'))

const STRINGS = {
  subtitle: {
    en: 'Write real React, run it instantly, break it safely. Errors never leave this panel.',
    es: 'Escribe React real, ejecútalo al instante, rómpelo sin miedo. Los errores nunca salen de este panel.',
  },
  tabCode: { en: 'Code', es: 'Código' },
  tabPreview: { en: 'Preview', es: 'Vista previa' },
  copied: { en: 'Copied', es: 'Copiado' },
  filesLabel: { en: 'Files', es: 'Archivos' },
  templateLabel: { en: 'New from template', es: 'Nuevo desde plantilla' },
  templateBlank: { en: 'Blank component', es: 'Componente vacío' },
  templateCounter: { en: 'Counter', es: 'Contador' },
  templateFetch: { en: 'Fetch pattern', es: 'Patrón de fetch' },
  templateContext: { en: 'Context pattern', es: 'Patrón de contexto' },
  sandboxLoaded: {
    en: 'Loaded sandbox “{name}”. Reset returns to its original files.',
    es: 'Sandbox «{name}» cargado. Reset vuelve a sus archivos originales.',
  },
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

const TEMPLATES = {
  blank: () => [
    {
      name: 'App.jsx',
      code: `export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h2>Hello, React!</h2>
      <p>Edit me and press Run.</p>
    </div>
  );
}`,
    },
  ],
  counter: () => [
    {
      name: 'App.jsx',
      code: `import Counter from './Counter.jsx';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h2>Counter from a template</h2>
      <Counter />
    </div>
  );
}`,
    },
    {
      name: 'Counter.jsx',
      code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => setCount(count + 1)}
      style={{ padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}
    >
      clicked {count} times
    </button>
  );
}`,
    },
  ],
  fetch: () => [
    {
      name: 'App.jsx',
      code: `export default function App() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);

  useEffect(() => {
    setStatus('loading');
    const id = setTimeout(() => {
      setData({ message: 'Hello from the (fake) server!' });
      setStatus('success');
    }, 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h2>Fetch pattern</h2>
      {status === 'loading' && <p>⏳ Loading…</p>}
      {status === 'success' && <p>✅ {data.message}</p>}
    </div>
  );
}`,
    },
  ],
  context: () => [
    {
      name: 'ThemeContext.jsx',
      code: `import { createContext, useContext, useState } from 'react';

const ThemeCtx = createContext('light');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}`,
    },
    {
      name: 'App.jsx',
      code: `import { ThemeProvider, useTheme } from './ThemeContext.jsx';

function ThemedBox() {
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div style={{
      padding: 24, borderRadius: 12,
      background: dark ? '#0b0e11' : '#f7f9fc',
      color: dark ? '#e9f0f7' : '#141b24',
      border: '1px solid #2b3644',
    }}>
      <p>Current theme: <strong>{theme}</strong></p>
      <button
        onClick={() => setTheme(dark ? 'light' : 'dark')}
        style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}
      >
        Toggle
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h2>Context pattern</h2>
      <ThemeProvider>
        <ThemedBox />
      </ThemeProvider>
    </div>
  );
}`,
    },
  ],
}

const toFileArray = (obj) =>
  Object.entries(obj).map(([name, code]) => ({ name, code }))

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
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const sandboxParam = searchParams.get('sandbox')
  const sandbox = sandboxParam ? getSandbox(sandboxParam) : null

  // Deep link ?sandbox=<id> loads that sandbox's files; Reset returns to them.
  const initialFiles = sandbox ? sandbox.files : toFileArray(DEFAULT_FILES)
  const initialName = sandbox ? sandbox.files[0].name : 'App.jsx'

  const [files, setFiles] = useState(initialFiles)
  const [activeFile, setActiveFile] = useState(initialName)
  const [runKey, setRunKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [mobileTab, setMobileTab] = useState('code') // 'code' | 'preview'

  // If the deep link changes (e.g. user pastes another ?sandbox=), reload.
  useEffect(() => {
    setFiles(initialFiles)
    setActiveFile(initialName)
    setRunKey((k) => k + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxParam])

  const code = files.find((f) => f.name === activeFile)?.code ?? ''

  const updateFile = (value) =>
    setFiles((fs) =>
      fs.map((f) => (f.name === activeFile ? { ...f, code: value ?? '' } : f)),
    )

  const run = () => {
    setRunKey((k) => k + 1)
    track('playground_run', { file: activeFile })
  }
  const reset = () => {
    setFiles(initialFiles)
    setActiveFile(initialName)
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
  const loadTemplate = (key) => {
    if (!key || !TEMPLATES[key]) return
    const tf = TEMPLATES[key]()
    setFiles(tf)
    setActiveFile(tf[0].name)
    setRunKey((k) => k + 1)
    track('playground_template', { template: key })
  }

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <FilePlus2 size={15} aria-hidden />
        <span className="sr-only">{t(STRINGS.templateLabel)}</span>
        <select
          aria-label={t(STRINGS.templateLabel)}
          defaultValue=""
          onChange={(e) => {
            loadTemplate(e.target.value)
            e.target.value = ''
          }}
          className="btn !py-1.5 cursor-pointer"
        >
          <option value="">{t(STRINGS.templateLabel)}…</option>
          <option value="blank">{t(STRINGS.templateBlank)}</option>
          <option value="counter">{t(STRINGS.templateCounter)}</option>
          <option value="fetch">{t(STRINGS.templateFetch)}</option>
          <option value="context">{t(STRINGS.templateContext)}</option>
        </select>
      </label>
      <button type="button" className="btn btn-primary" onClick={run}>
        <Play size={15} aria-hidden />
        {t('common.run')}
      </button>
      <button type="button" className="btn" onClick={reset}>
        <RotateCcw size={15} aria-hidden />
        {t('common.reset')}
      </button>
      <button type="button" className="btn" onClick={format} title={t('common.format')}>
        <Wand2 size={15} aria-hidden />
        {t('common.format')}
      </button>
      <button type="button" className="btn" onClick={copy}>
        {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
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
        <MultiFileRunner files={files} runKey={runKey} />
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
      {sandbox && (
        <p className="text-xs text-[var(--muted)] mb-2" role="status">
          {t(STRINGS.sandboxLoaded, { name: sandbox.title[lang] })}
        </p>
      )}

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
          {files.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setActiveFile(f.name)}
              aria-current={activeFile === f.name}
              className="w-full text-left px-3 py-2 rounded-lg text-sm mono transition-colors"
              style={
                activeFile === f.name
                  ? { background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 700 }
                  : { color: 'var(--muted)' }
              }
            >
              {f.name}
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
              {files.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setActiveFile(f.name)}
                  className={activeFile === f.name ? 'btn btn-primary !text-xs' : 'btn !text-xs'}
                >
                  {f.name}
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
