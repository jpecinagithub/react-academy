import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Play, RotateCcw, Copy, Check } from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  Callout,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const CodeEditor = lazy(() => import('../../components/CodeEditor.jsx'))
const ReactRunner = lazy(() => import('../../runtime/ReactRunner.jsx'))

const PRESETS = [
  {
    key: 'greeting',
    label: { en: 'Greeting (scope vars)', es: 'Saludo (vars de scope)' },
    code: `function App() {
  return (
    <div>
      <h1>Hello {userName}!</h1>
      <p>You have {likes} likes.</p>
      {showDetails && <p>Details are visible.</p>}
    </div>
  );
}`,
  },
  {
    key: 'counter',
    label: { en: 'Counter (state)', es: 'Contador (estado)' },
    code: `function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <strong>count = {count}</strong>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`,
  },
  {
    key: 'list',
    label: { en: 'List (map)', es: 'Lista (map)' },
    code: `function App() {
  const items = ["Components", "Props", "State", "Hooks"];

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}`,
  },
]

const STRINGS = {
  concept: { en: 'Concept', es: 'Concepto' },
  conceptBody: {
    en: 'This is real JSX running in your browser. Edit the code — the preview updates live (debounced). The panel below injects variables straight into your code’s scope: change them without typing a line.',
    es: 'Esto es JSX real corriendo en tu navegador. Edita el código: la vista previa se actualiza en vivo. El panel inyecta variables directamente en el scope de tu código: cámbialas sin escribir ni una línea.',
  },
  presets: { en: 'Snippets', es: 'Fragmentos' },
  scopeTitle: { en: 'Injected variables', es: 'Variables inyectadas' },
  scopeHint: {
    en: 'These live in your code’s scope. The Greeting snippet uses all three — try breaking it by renaming one.',
    es: 'Viven en el scope de tu código. El fragmento Saludo usa las tres: prueba a romperlo renombrando una.',
  },
  varName: { en: 'userName', es: 'userName' },
  varLikes: { en: 'likes', es: 'likes' },
  varDetails: { en: 'showDetails', es: 'showDetails' },
  tabCode: { en: 'Code', es: 'Código' },
  tabPreview: { en: 'Preview', es: 'Vista previa' },
  run: { en: 'Run now', es: 'Ejecutar ya' },
  liveNote: {
    en: 'Live: the preview re-runs ~0.6 s after you stop typing.',
    es: 'En vivo: la vista previa se re-ejecuta ~0,6 s después de dejar de escribir.',
  },
}

export default function JsxPlaygroundLab() {
  const { t } = useLang()
  const [presetKey, setPresetKey] = useState('greeting')
  const preset = PRESETS.find((p) => p.key === presetKey)
  const [code, setCode] = useState(preset.code)
  const [runKey, setRunKey] = useState(0)
  const [mobileTab, setMobileTab] = useState('code')
  const [copied, setCopied] = useState(false)

  // Injected scope variables
  const [userName, setUserName] = useState('Jon')
  const [likes, setLikes] = useState(42)
  const [showDetails, setShowDetails] = useState(true)

  const scope = useMemo(
    () => ({ userName, likes, showDetails }),
    [userName, likes, showDetails],
  )

  // Debounced live run
  useEffect(() => {
    const id = setTimeout(() => setRunKey((k) => k + 1), 600)
    return () => clearTimeout(id)
  }, [code])

  const pickPreset = (key) => {
    const p = PRESETS.find((x) => x.key === key)
    setPresetKey(key)
    setCode(p.code)
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  const editorPane = (
    <div className="flex flex-col min-h-0">
      <Suspense fallback={<p className="text-sm text-[var(--muted)]">…</p>}>
        <CodeEditor value={code} onChange={setCode} language="jsx" height={380} />
      </Suspense>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button type="button" className="btn btn-primary !text-xs" onClick={() => setRunKey((k) => k + 1)}>
          <Play size={13} aria-hidden="true" />
          {t(STRINGS.run)}
        </button>
        <button type="button" className="btn !text-xs" onClick={() => setCode(preset.code)}>
          <RotateCcw size={13} aria-hidden="true" />
          {t('common.reset')}
        </button>
        <button type="button" className="btn !text-xs" onClick={onCopy}>
          {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
          {copied ? t('common.copied') : t('common.copy')}
        </button>
        <span className="text-xs text-[var(--faint)] ml-auto">{t(STRINGS.liveNote)}</span>
      </div>
    </div>
  )

  const previewPane = (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5 min-h-[380px]">
      <Suspense fallback={<p className="text-sm text-[var(--muted)]">…</p>}>
        <ReactRunner code={code} scope={scope} runKey={runKey} />
      </Suspense>
    </div>
  )

  return (
    <SimulationShell
      labId="jsx-playground"
      title={t({ en: 'JSX Playground', es: 'Playground JSX' })}
      intro={t({
        en: 'A live JSX editor with instant preview: tweak the code or the injected variables and watch React respond.',
        es: 'Un editor JSX en vivo con vista previa instantánea: cambia el código o las variables inyectadas y mira cómo responde React.',
      })}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--text)] mb-2">{t(STRINGS.conceptBody)}</p>

      <div className="flex flex-wrap gap-2 my-4" role="group" aria-label={t(STRINGS.presets)}>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={p.key === presetKey ? 'btn btn-primary !text-xs' : 'btn !text-xs'}
            onClick={() => pickPreset(p.key)}
          >
            {t(p.label)}
          </button>
        ))}
      </div>

      <div className="card p-5 mb-6">
        <h3 className="font-bold text-[var(--text-strong)] mb-1">{t(STRINGS.scopeTitle)}</h3>
        <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.scopeHint)}</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--text-strong)]">
            <span className="mono text-[var(--accent)]">{t(STRINGS.varName)}</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--text-strong)]">
            <span className="mono text-[var(--accent)]">{t(STRINGS.varLikes)}</span>
            <input
              type="number"
              value={likes}
              onChange={(e) => setLikes(Number(e.target.value))}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-strong)] cursor-pointer">
            <input
              type="checkbox"
              checked={showDetails}
              onChange={(e) => setShowDetails(e.target.checked)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            <span className="mono text-[var(--accent)]">{t(STRINGS.varDetails)}</span>
          </label>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-2 mb-3" role="tablist" aria-label="playground view">
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

      {/* Desktop: side by side / Mobile: tabbed */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        {editorPane}
        {previewPane}
      </div>
      <div className="md:hidden">
        {mobileTab === 'code' ? editorPane : previewPane}
      </div>

      <Callout type="tip">
        {t({
          en: 'Errors never break the academy: they appear inside the preview panel. Try deleting a closing tag or referencing an unknown variable and watch what happens.',
          es: 'Los errores nunca rompen la academia: aparecen dentro del panel de vista previa. Prueba a borrar una etiqueta de cierre o a referenciar una variable desconocida.',
        })}
      </Callout>
    </SimulationShell>
  )
}
