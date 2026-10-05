import { lazy, Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Boxes, Check, Copy, FlaskConical, Hash, ToggleLeft,
  ListCollapse, PanelTop, AppWindow, ShoppingCart, Moon, Search,
  FormInput, LogIn, Timer, Watch, ArrowDownToLine, CloudSun,
  ListOrdered, Infinity as InfinityIcon, Move, Columns3, Palette,
  Languages, Plug, Route, Braces, Zap, Play, RotateCcw, Lightbulb,
} from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../state/store.js'
import { PageHeader, DifficultyBadge, Callout } from '../components/ui.jsx'
import { SANDBOXES, getSandbox } from '../sandboxes/registry.js'
import { track } from '../utils/analytics.js'

const CodeEditor = lazy(() => import('../components/CodeEditor.jsx'))
const MultiFileRunner = lazy(() => import('../runtime/MultiFileRunner.jsx'))

const ICONS = {
  counter: Hash, toggle: ToggleLeft, accordion: ListCollapse, tabs: PanelTop,
  modal: AppWindow, 'todo-list': ListCollapse, 'shopping-cart': ShoppingCart,
  'dark-mode': Moon, 'search-filter': Search, form: FormInput, 'login-ui': LogIn,
  timer: Timer, stopwatch: Watch, 'api-fetcher': ArrowDownToLine,
  'weather-ui': CloudSun, pagination: ListOrdered, 'infinite-scroll': InfinityIcon,
  'drag-drop': Move, kanban: Columns3, 'theme-context': Palette,
  'language-context': Languages, 'custom-hook': Plug, router: Route,
  'use-reducer': Braces, memoization: Zap,
}

const STRINGS = {
  subtitle: {
    en: 'Small editable sandboxes: open them, modify them, observe.',
    es: 'Pequeños sandboxes editables: ábrelos, modifícalos y observa.',
  },
  searchPlaceholder: { en: 'Search sandboxes…', es: 'Buscar sandboxes…' },
  filterAll: { en: 'All levels', es: 'Todos los niveles' },
  explored: { en: 'Explored', es: 'Explorado' },
  markExplored: { en: 'Mark explored', es: 'Marcar como explorado' },
  back: { en: 'Back to library', es: 'Volver a la biblioteca' },
  hintsTitle: { en: 'Try these', es: 'Prueba esto' },
  tabCode: { en: 'Code', es: 'Código' },
  tabPreview: { en: 'Preview', es: 'Vista previa' },
  copied: { en: 'Copied', es: 'Copiado' },
  filesLabel: { en: 'Files', es: 'Archivos' },
  noResults: {
    en: 'No sandboxes match your search.',
    es: 'Ningún sandbox coincide con tu búsqueda.',
  },
  sandboxNotFound: {
    en: 'Sandbox not found.',
    es: 'Sandbox no encontrado.',
  },
  count: { en: '{n} sandboxes', es: '{n} sandboxes' },
}

function SandboxIcon({ id, size = 22 }) {
  const Icon = ICONS[id] ?? FlaskConical
  return <Icon size={size} aria-hidden />
}

export default function Sandboxes() {
  const { t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('all')

  const selectedId = searchParams.get('sandbox')
  const selected = selectedId ? getSandbox(selectedId) : null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SANDBOXES.filter((s) => {
      if (level !== 'all' && s.difficulty !== level) return false
      if (!q) return true
      return (
        s.title.en.toLowerCase().includes(q) ||
        s.title.es.toLowerCase().includes(q) ||
        s.blurb.en.toLowerCase().includes(q) ||
        s.blurb.es.toLowerCase().includes(q)
      )
    })
  }, [query, level])

  const open = (id) => {
    track('sandbox_open', { id })
    setSearchParams({ sandbox: id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const close = () => setSearchParams({})

  return (
    <div>
      <PageHeader
        title={t('nav.sandboxes')}
        subtitle={t(STRINGS.subtitle)}
        icon={Boxes}
      />
      {selected ? (
        <SandboxDetail key={selected.id} sandbox={selected} onBack={close} />
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-2 items-center no-print">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                size={16}
                aria-hidden
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(STRINGS.searchPlaceholder)}
                aria-label={t(STRINGS.searchPlaceholder)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm"
              />
            </div>
            <div className="flex gap-2" role="group" aria-label={t(STRINGS.filterAll)}>
              {['all', 'beginner', 'intermediate'].map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={level === l}
                  onClick={() => setLevel(l)}
                  className={level === l ? 'btn btn-primary !text-xs' : 'btn !text-xs'}
                >
                  {l === 'all' ? t(STRINGS.filterAll) : l === 'beginner' ? '🟢 Beginner' : '🟡 Intermediate'}
                </button>
              ))}
            </div>
            <span className="text-xs text-[var(--faint)] ml-auto">
              {t(STRINGS.count, { n: filtered.length })}
            </span>
          </div>

          {selectedId && !selected && (
            <Callout type="warn" title={t(STRINGS.sandboxNotFound)} />
          )}

          {filtered.length === 0 ? (
            <p className="text-[var(--muted)] mt-8">{t(STRINGS.noResults)}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filtered.map((s, i) => (
                <SandboxCard key={s.id} sandbox={s} index={i} onOpen={open} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SandboxCard({ sandbox, index, onOpen }) {
  const { t, lang } = useLang()
  const explored = useStore((s) => !!s.progress.sandboxes[sandbox.id])
  return (
    <button
      type="button"
      onClick={() => onOpen(sandbox.id)}
      className="card p-5 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-2"
      aria-label={`${sandbox.title[lang]} — ${t(STRINGS.explored)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="p-2 rounded-lg" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
          <SandboxIcon id={sandbox.id} />
        </span>
        {explored ? (
          <span className="text-xs font-bold text-[var(--green)] flex items-center gap-1">
            <Check size={13} aria-hidden /> {t(STRINGS.explored)}
          </span>
        ) : (
          <span className="text-xs font-bold text-[var(--faint)] mono">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>
      <h3 className="font-bold text-[var(--text-strong)] mt-3">{sandbox.title[lang]}</h3>
      <p className="text-sm text-[var(--muted)] mt-1">{sandbox.blurb[lang]}</p>
      <div className="mt-3">
        <DifficultyBadge level={sandbox.difficulty} />
      </div>
    </button>
  )
}

function SandboxDetail({ sandbox, onBack }) {
  const { t, lang } = useLang()
  const exploreSandbox = useStore((s) => s.exploreSandbox)
  const explored = useStore((s) => !!s.progress.sandboxes[sandbox.id])

  const [files, setFiles] = useState(sandbox.files)
  const [activeFile, setActiveFile] = useState(sandbox.files[0].name)
  const [runKey, setRunKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [mobileTab, setMobileTab] = useState('code')

  const code = files.find((f) => f.name === activeFile)?.code ?? ''
  const updateFile = (value) =>
    setFiles((fs) => fs.map((f) => (f.name === activeFile ? { ...f, code: value ?? '' } : f)))

  const run = () => {
    setRunKey((k) => k + 1)
    track('sandbox_run', { id: sandbox.id })
  }
  const reset = () => {
    setFiles(sandbox.files)
    setActiveFile(sandbox.files[0].name)
    setRunKey((k) => k + 1)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }
  const markExplored = () => {
    exploreSandbox(sandbox.id)
    track('sandbox_explored', { id: sandbox.id })
  }

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <button type="button" className="btn btn-primary" onClick={run}>
        <Play size={15} aria-hidden />
        {t('common.run')}
      </button>
      <button type="button" className="btn" onClick={reset}>
        <RotateCcw size={15} aria-hidden />
        {t('common.reset')}
      </button>
      <button type="button" className="btn" onClick={copy}>
        {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
        {copied ? t(STRINGS.copied) : t('common.copy')}
      </button>
      {explored ? (
        <span className="text-xs font-bold text-[var(--green)] flex items-center gap-1 ml-1">
          <Check size={14} aria-hidden /> {t(STRINGS.explored)}
        </span>
      ) : (
        <button type="button" className="btn" onClick={markExplored}>
          <FlaskConical size={15} aria-hidden />
          {t(STRINGS.markExplored)}
        </button>
      )}
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
    <div>
      <button type="button" onClick={onBack} className="btn mb-4 no-print">
        <ArrowLeft size={15} aria-hidden />
        {t(STRINGS.back)}
      </button>
      <PageHeader
        title={sandbox.title[lang]}
        subtitle={sandbox.blurb[lang]}
        icon={() => <SandboxIcon id={sandbox.id} size={26} />}
        actions={toolbar}
      />
      <div className="mb-4">
        <DifficultyBadge level={sandbox.difficulty} />
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-2 mb-3 no-print" role="tablist" aria-label="sandbox view">
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
      <div className="hidden md:grid gap-4" style={{ gridTemplateColumns: '180px 1fr 1fr', minHeight: 480 }}>
        <div className="card p-3 overflow-y-auto" aria-label={t(STRINGS.filesLabel)}>
          <p className="text-xs font-bold text-[var(--faint)] uppercase tracking-wider px-2 mb-2">src/</p>
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
        <div className="min-h-[480px] flex flex-col">
          <p className="mono text-xs text-[var(--faint)] mb-2">src/{activeFile}</p>
          <div className="flex-1 min-h-0">{editorPane}</div>
        </div>
        <div className="min-h-[480px] flex flex-col">
          <p className="mono text-xs text-[var(--faint)] mb-2">{t(STRINGS.tabPreview)}</p>
          <div className="flex-1 min-h-0">{previewPane}</div>
        </div>
      </div>

      {/* Mobile: single pane */}
      <div className="md:hidden min-h-[420px]">
        {mobileTab === 'code' ? (
          <div className="h-[420px] flex flex-col">
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
          <div className="min-h-[420px]">{previewPane}</div>
        )}
      </div>

      {/* Hints */}
      <div className="card p-5 mt-6">
        <h3 className="font-bold text-[var(--text-strong)] flex items-center gap-2 mb-3">
          <Lightbulb size={17} aria-hidden className="text-[var(--accent)]" />
          {t(STRINGS.hintsTitle)}
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--muted)]">
          {sandbox.hints[lang].map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
