import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, FlaskConical, Info, AlertTriangle, Lightbulb, OctagonAlert, RotateCcw } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../state/store.js'
import { termDef } from '../data/glossary.js'
import { track } from '../utils/analytics.js'

/* ================= PageHeader ================= */
// Props: title, subtitle, icon (lucide component), actions (node). Strings must
// already be translated by the caller (t()).
export function PageHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className="p-3 rounded-xl border border-[var(--border)] bg-[var(--accent-dim)] text-[var(--accent)] shrink-0"
            aria-hidden="true"
          >
            <Icon size={26} />
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-strong)]">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-[var(--muted)] max-w-2xl">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

/* ================= DifficultyBadge ================= */
const DIFFICULTY_STYLES = {
  beginner: { bg: 'var(--green-dim)', fg: 'var(--green)' },
  intermediate: { bg: 'var(--amber-dim)', fg: 'var(--amber)' },
  advanced: { bg: 'var(--red-dim)', fg: 'var(--red)' },
}
const DIFFICULTY_LABEL = {
  en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
  es: { beginner: 'Inicial', intermediate: 'Intermedio', advanced: 'Avanzado' },
}
export function DifficultyBadge({ level = 'beginner' }) {
  const { lang } = useLang()
  const style = DIFFICULTY_STYLES[level] || DIFFICULTY_STYLES.beginner
  const dot = level === 'beginner' ? '🟢' : level === 'intermediate' ? '🟡' : '🔴'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: style.bg, color: style.fg }}
    >
      <span aria-hidden="true">{dot}</span>
      {DIFFICULTY_LABEL[lang][level] || DIFFICULTY_LABEL.en[level]}
    </span>
  )
}

/* ================= SectionTitle ================= */
export function SectionTitle({ children, id }) {
  return (
    <h2
      id={id}
      className="text-xl md:text-2xl font-bold text-[var(--text-strong)] mt-10 mb-4 scroll-mt-24"
    >
      {children}
    </h2>
  )
}

/* ================= Callout ================= */
const CALLOUT_STYLES = {
  info: { icon: Info, bg: 'var(--blue-dim)', fg: 'var(--blue)' },
  warn: { icon: AlertTriangle, bg: 'var(--amber-dim)', fg: 'var(--amber)' },
  tip: { icon: Lightbulb, bg: 'var(--green-dim)', fg: 'var(--green)' },
  danger: { icon: OctagonAlert, bg: 'var(--red-dim)', fg: 'var(--red)' },
}
export function Callout({ type = 'info', title, children }) {
  const { icon: Icon, bg, fg } = CALLOUT_STYLES[type] || CALLOUT_STYLES.info
  return (
    <div
      role="note"
      className="rounded-xl border border-[var(--border)] p-4 my-4 flex gap-3"
      style={{ background: bg }}
    >
      <Icon size={20} style={{ color: fg }} className="shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold mb-1" style={{ color: fg }}>{title}</p>}
        <div className="text-sm text-[var(--text)]">{children}</div>
      </div>
    </div>
  )
}

/* ================= Compare (two-column cards) ================= */
export function Compare({ cols = [] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 my-6">
      {cols.map((col, i) => (
        <div key={i} className="card p-5">
          {col.title && (
            <h3 className="font-bold text-[var(--text-strong)] mb-3">{col.title}</h3>
          )}
          {col.children}
        </div>
      ))}
    </div>
  )
}

/* ================= CodeBlock (regex tokenizer, no deps) ================= */
function tokenize(code) {
  const tokens = []
  // Order matters: comments, strings, numbers, keywords, tags, attrs, punctuation.
  const re =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d[\d_]*(?:\.\d+)?)\b|\b(const|let|var|function|return|if|else|for|while|import|from|export|default|new|typeof|in|of|try|catch|finally|throw|switch|case|break|continue|do|class|extends|super|this|true|false|null|undefined|async|await)\b|(<\/?[A-Za-z][\w.]*|\/?>)|([\w$]+)(?==)|([{}()[\];:.,])/g
  let last = 0
  let m
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: null })
    const [full, comment, str, num, kw, tag, attr, punct] = m
    const cls = comment
      ? 'tok-com'
      : str
        ? 'tok-str'
        : num
          ? 'tok-num'
          : kw
            ? 'tok-kw'
            : tag
              ? 'tok-tag'
              : attr
                ? 'tok-attr'
                : punct
                  ? null
                  : null
    tokens.push({ text: full, cls })
    last = m.index + full.length
  }
  if (last < code.length) tokens.push({ text: code.slice(last), cls: null })
  return tokens
}

const TOK_COLOR = {
  'tok-com': 'var(--tok-com)',
  'tok-str': 'var(--tok-str)',
  'tok-num': 'var(--tok-num)',
  'tok-kw': 'var(--tok-kw)',
  'tok-tag': 'var(--tok-tag)',
  'tok-attr': 'var(--tok-attr)',
}

export function CodeBlock({ code = '', lang = 'jsx', maxHeight }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const tokens = useMemo(() => tokenize(code), [code])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="rounded-xl border border-[var(--code-border)] overflow-hidden my-4 bg-[var(--code-bg)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--code-border)]">
        <span className="text-xs font-mono text-[var(--muted)]">{lang}</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          aria-label={t('common.copy')}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? t('common.copied') : t('common.copy')}
        </button>
      </div>
      <pre
        className="p-4 overflow-x-auto text-sm leading-relaxed"
        style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
      >
        <code>
          {tokens.map((tok, i) =>
            tok.cls ? (
              <span key={i} style={{ color: TOK_COLOR[tok.cls] }}>
                {tok.text}
              </span>
            ) : (
              <span key={i}>{tok.text}</span>
            ),
          )}
        </code>
      </pre>
    </div>
  )
}

/* ================= FlowSteps (animated sequential diagram) ================= */
// steps: [{ label: {en,es} | string, desc?: {en,es} | string }]
// Nodes light up one after another via CSS animation-delay. Respects
// prefers-reduced-motion (animation becomes instant via CSS).
export function FlowSteps({ steps = [], auto = true }) {
  const { t } = useLang()
  const [runKey, setRunKey] = useState(0)
  return (
    <div className="my-6">
      <ol className="flex flex-col items-stretch" aria-label="flow">
        {steps.map((step, i) => (
          <li key={runKey + '-' + i} className="flex flex-col items-center">
            <div
              className="flow-step card px-5 py-3 text-center w-full max-w-md"
              style={{ animationDelay: auto ? `${i * 1.6}s` : '0s' }}
            >
              <div className="font-semibold text-[var(--text-strong)]">
                {t(step.label)}
              </div>
              {step.desc && (
                <div className="text-sm text-[var(--muted)] mt-0.5">{t(step.desc)}</div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="py-1 text-[var(--accent)] text-xl leading-none" aria-hidden="true">
                ↓
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="text-center mt-3">
        <button
          type="button"
          className="btn"
          onClick={() => setRunKey((k) => k + 1)}
          aria-label={t('common.replay')}
        >
          <RotateCcw size={14} />
          {t('common.replay')}
        </button>
      </div>
    </div>
  )
}

/* ================= SimulationShell ================= */
// Wraps EVERY lab. Contract:
//   <SimulationShell labId="state-lab" title={t(STRINGS.title)} intro={...}
//                    difficulty="beginner" onDone={...}>
//     ... lab UI ...
//   </SimulationShell>
// Footer includes "Mark lab complete" -> visitLab(labId) + analytics.
export function SimulationShell({ labId, title, intro, difficulty = 'beginner', children, onDone }) {
  const { t } = useLang()
  const visitLab = useStore((s) => s.visitLab)
  const done = useStore((s) => !!s.progress.labs[labId])

  const markDone = () => {
    visitLab(labId)
    track('lab_complete', { labId })
    onDone?.()
  }

  return (
    <article className="max-w-[var(--max-w)] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <DifficultyBadge level={difficulty} />
        {done && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--green-dim)] text-[var(--green)]">
            <Check size={12} />
            {t('common.completed')}
          </span>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-strong)] mb-3">
        {title}
      </h1>
      {intro && <p className="text-[var(--muted)] max-w-3xl mb-8">{intro}</p>}

      <div className="card p-4 md:p-8">{children}</div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-8">
        <Link to="/modules" className="btn no-print">
          ← {t('nav.modules')}
        </Link>
        <button
          type="button"
          className={done ? 'btn' : 'btn btn-primary'}
          onClick={markDone}
          disabled={done}
        >
          <FlaskConical size={16} />
          {done ? t('common.completed') : t('common.markComplete')}
        </button>
      </div>
    </article>
  )
}

/* ================= Quiz ================= */
// questions: [{ q: {en,es}|string, options: [{en,es}|string ...], answer: index,
//               explain?: {en,es}|string }]
// quizId -> recordQuiz(moduleId-ish id, score, total).
export function Quiz({ questions = [], quizId = 'quiz', onFinish }) {
  const { t, lang } = useLang()
  const recordQuiz = useStore((s) => s.recordQuiz)
  const [picked, setPicked] = useState({}) // qIndex -> optionIndex
  const [revealed, setRevealed] = useState(false)

  const score = questions.reduce(
    (acc, q, i) => acc + (picked[i] === q.answer ? 1 : 0),
    0,
  )
  const allAnswered = questions.every((_, i) => picked[i] !== undefined)

  const finish = () => {
    setRevealed(true)
    recordQuiz(quizId, score, questions.length)
    track('quiz_finish', { quizId, score, total: questions.length })
    onFinish?.({ score, total: questions.length })
  }

  if (questions.length === 0) {
    return (
      <Callout type="info" title={t('common.comingSoon')}>
        {lang === 'es'
          ? 'Este cuestionario estará disponible en una fase posterior.'
          : 'This quiz will be available in a later phase.'}
      </Callout>
    )
  }

  return (
    <div className="my-6">
      {questions.map((q, qi) => {
        const isCorrect = revealed && picked[qi] === q.answer
        const isWrong = revealed && picked[qi] !== undefined && picked[qi] !== q.answer
        return (
          <fieldset
            key={qi}
            className="card p-5 mb-4"
            style={
              revealed
                ? { borderColor: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : undefined }
                : undefined
            }
          >
            <legend className="sr-only">{`${t('common.yourAnswer')} ${qi + 1}`}</legend>
            <p className="font-semibold text-[var(--text-strong)] mb-3">
              <span className="text-[var(--faint)] mr-2">{qi + 1}.</span>
              {t(q.q)}
            </p>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label={t(q.q)}>
              {q.options.map((opt, oi) => {
                const selected = picked[qi] === oi
                const correctOne = revealed && oi === q.answer
                return (
                  <button
                    key={oi}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={revealed}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    className="text-left px-4 py-2.5 rounded-lg border transition-colors"
                    style={{
                      borderColor: correctOne
                        ? 'var(--green)'
                        : selected
                          ? 'var(--accent)'
                          : 'var(--border)',
                      background: correctOne
                        ? 'var(--green-dim)'
                        : selected
                          ? 'var(--accent-dim)'
                          : 'var(--surface-2)',
                    }}
                  >
                    {t(opt)}
                    {revealed && correctOne && (
                      <Check size={14} className="inline ml-2" aria-label={t('common.correct')} />
                    )}
                  </button>
                )
              })}
            </div>
            {revealed && q.explain && (
              <p className="text-sm text-[var(--muted)] mt-3">{t(q.explain)}</p>
            )}
            {revealed && (
              <p
                className="text-sm font-semibold mt-2"
                style={{ color: isCorrect ? 'var(--green)' : 'var(--red)' }}
              >
                {isCorrect ? t('common.correct') : t('common.incorrect')}
              </p>
            )}
          </fieldset>
        )
      })}
      {!revealed ? (
        <button type="button" className="btn btn-primary" disabled={!allAnswered} onClick={finish}>
          {t('common.check')}
        </button>
      ) : (
        <div className="card p-5 text-center">
          <p className="text-lg font-bold text-[var(--text-strong)]">
            {score} / {questions.length}
          </p>
          <p className="text-sm text-[var(--muted)]">
            {Math.round((score / questions.length) * 100)}%
          </p>
        </div>
      )}
    </div>
  )
}

/* ================= ProgressRing ================= */
export function ProgressRing({ value = 0, size = 44, label }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className="inline-flex items-center gap-2"
      role="img"
      aria-label={label || `${Math.round(pct)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          fontSize={size * 0.28}
          fontWeight="700"
          fill="var(--text)"
        >
          {Math.round(pct)}
        </text>
      </svg>
    </div>
  )
}

/* ================= GlossaryTerm (learning-mode tooltip) ================= */
export function GlossaryTerm({ term, children }) {
  const { lang } = useLang()
  const tooltipMode = useStore((s) => s.tooltipMode)
  if (!tooltipMode) return <>{children || termDef(term, lang)?.term || term}</>
  const def = termDef(term, lang)
  if (!def) return <>{children || term}</>
  return (
    <span className="relative inline group">
      <span className="border-b border-dotted border-[var(--accent)] cursor-help">
        {children || def.term}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute z-50 hidden group-hover:block group-focus-within:block w-64 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] text-sm text-[var(--text)] shadow-xl bottom-full left-1/2 -translate-x-1/2 mb-2"
      >
        <span className="font-bold text-[var(--accent)] block mb-1">{def.term}</span>
        {def.def}
      </span>
    </span>
  )
}
