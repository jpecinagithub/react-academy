import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Trophy,
  RotateCcw,
  MousePointerClick,
  ListOrdered,
  Sparkles,
} from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../state/store.js'
import { getModule } from '../data/modules.js'
import { CHALLENGES, getChallenge } from './registry.js'
import { Callout, CodeBlock, DifficultyBadge, PageHeader } from '../components/ui.jsx'
import { track } from '../utils/analytics.js'

const STRINGS = {
  blank: { en: 'blank', es: 'hueco' },
  checkAnswer: { en: 'Check answer', es: 'Comprobar' },
  tryAgain: { en: 'Try again', es: 'Intentar de nuevo' },
  reset: { en: 'Reset', es: 'Reiniciar' },
  correct: { en: 'Perfect — every blank is correct!', es: '¡Perfecto, todos los huecos correctos!' },
  someWrong: {
    en: 'Some blanks are still wrong — the red ones. Give it another try!',
    es: 'Aún hay huecos incorrectos (en rojo). ¡Inténtalo de nuevo!',
  },
  explanation: { en: 'Why it works', es: 'Por qué funciona' },
  nextChallenge: { en: 'Next challenge', es: 'Siguiente reto' },
  allChallenges: { en: 'All challenges', es: 'Todos los retos' },
  completed: { en: 'Challenge completed!', es: '¡Reto superado!' },
  pickLine: {
    en: 'Click the line number where you think the bug is.',
    es: 'Haz clic en el número de la línea donde crees que está el bug.',
  },
  wrongLine: {
    en: 'Not that line — read the code once more and try again.',
    es: 'Esa línea no es: lee el código otra vez e inténtalo de nuevo.',
  },
  rightLine: {
    en: 'Found it! Now pick the correct fix:',
    es: '¡Lo encontraste! Ahora elige la corrección correcta:',
  },
  wrongFix: {
    en: 'That fix would not solve it — think about why, then try another.',
    es: 'Esa corrección no lo resolvería: piensa por qué y prueba otra.',
  },
  fixTitle: { en: 'Choose the fix', es: 'Elige la corrección' },
  fixExplanation: { en: 'Why this is the fix', es: 'Por qué esta es la solución' },
  chooseOption: { en: 'Choose an option', es: 'Elige una opción' },
  wrongPredict: {
    en: 'Not quite — re-read the code and try again.',
    es: 'Casi: relee el código e inténtalo de nuevo.',
  },
  rightPredict: {
    en: 'Correct! Now watch step by step what really happens:',
    es: '¡Correcto! Ahora mira paso a paso lo que ocurre de verdad:',
  },
  revealStep: { en: 'Reveal next step', es: 'Revelar siguiente paso' },
  stepOf: { en: 'Step', es: 'Paso' },
  reviewModule: { en: 'Review the module', es: 'Repasar el módulo' },
  notFound: { en: 'Challenge not found.', es: 'Reto no encontrado.' },
}

function normalizeAnswer(s) {
  return s.trim().replace(/\s+/g, ' ')
}

/* ================= Fill in the blank ================= */

function FillBlankCode({ template, values, results, onChange, disabled }) {
  const parts = useMemo(() => template.split('____'), [template])
  return (
    <div className="rounded-xl border border-[var(--code-border)] overflow-hidden my-4 bg-[var(--code-bg)]">
      <div className="px-4 py-2 border-b border-[var(--code-border)]">
        <span className="text-xs font-mono text-[var(--muted)]">jsx</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-loose">
        <code>
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < values.length && (
                <input
                  value={values[i]}
                  disabled={disabled}
                  onChange={(e) => onChange(i, e.target.value)}
                  aria-label={`${STRINGS.blank.en} ${i + 1}`}
                  spellCheck={false}
                  autoComplete="off"
                  className="mono mx-0.5 px-2 py-0.5 rounded-md border text-sm align-baseline"
                  style={{
                    width: `${Math.max(6, values[i]?.length + 2 || 8)}ch`,
                    minWidth: '5ch',
                    maxWidth: '22ch',
                    borderColor:
                      results[i] === true
                        ? 'var(--green)'
                        : results[i] === false
                          ? 'var(--red)'
                          : 'var(--accent)',
                    background:
                      results[i] === true
                        ? 'var(--green-dim)'
                        : results[i] === false
                          ? 'var(--red-dim)'
                          : 'var(--accent-dim)',
                    color: 'var(--text-strong)',
                  }}
                />
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

function FillBlankView({ challenge, onSuccess }) {
  const { t } = useLang()
  const n = challenge.blanks.length
  const [values, setValues] = useState(() => Array(n).fill(''))
  const [results, setResults] = useState(() => Array(n).fill(null))
  const [done, setDone] = useState(false)

  const setValue = (i, v) => {
    if (done) return
    setValues((p) => p.map((x, j) => (j === i ? v : x)))
    setResults((p) => p.map((x, j) => (j === i ? null : x)))
  }

  const check = () => {
    const r = challenge.blanks.map((b, i) => {
      const v = normalizeAnswer(values[i] || '')
      return v === b.answer || (b.alternatives || []).includes(v)
    })
    setResults(r)
    if (r.every(Boolean)) {
      setDone(true)
      onSuccess()
    }
  }

  const reset = () => {
    setValues(Array(n).fill(''))
    setResults(Array(n).fill(null))
    setDone(false)
  }

  return (
    <div>
      <p className="text-[var(--muted)] mb-2">{t(challenge.prompt)}</p>
      <FillBlankCode
        template={challenge.template}
        values={values}
        results={results}
        onChange={setValue}
        disabled={done}
      />
      {!done ? (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={check}>
            <Check size={16} /> {t(STRINGS.checkAnswer)}
          </button>
          <button type="button" className="btn" onClick={reset}>
            <RotateCcw size={14} /> {t(STRINGS.reset)}
          </button>
          {results.some((r) => r === false) && (
            <p className="text-sm text-[var(--red)] w-full">{t(STRINGS.someWrong)}</p>
          )}
        </div>
      ) : (
        <Callout type="tip" title={t(STRINGS.correct)}>
          {t(challenge.explanation)}
        </Callout>
      )}
    </div>
  )
}

/* ================= Bug hunt ================= */

function BugHuntView({ challenge, onSuccess }) {
  const { t } = useLang()
  const lines = useMemo(() => challenge.buggyCode.split('\n'), [challenge.buggyCode])
  const [stage, setStage] = useState('find') // find | fix | done
  const [lineMsg, setLineMsg] = useState(null) // null | 'wrong'
  const [fixMsg, setFixMsg] = useState(null) // null | 'wrong'

  const pickLine = (n) => {
    if (n === challenge.bugLine) {
      setStage('fix')
      setLineMsg(null)
    } else {
      setLineMsg('wrong')
    }
  }

  const pickFix = (i) => {
    if (i === challenge.fixAnswer) {
      setStage('done')
      setFixMsg(null)
      onSuccess()
    } else {
      setFixMsg('wrong')
    }
  }

  return (
    <div>
      <p className="text-[var(--muted)] mb-2">{t(challenge.prompt)}</p>
      <div className="rounded-xl border border-[var(--code-border)] overflow-hidden my-4 bg-[var(--code-bg)]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--code-border)]">
          <span className="text-xs font-mono text-[var(--muted)]">jsx</span>
          <span className="text-xs text-[var(--muted)] inline-flex items-center gap-1">
            <MousePointerClick size={12} aria-hidden="true" /> {t(STRINGS.pickLine)}
          </span>
        </div>
        <pre className="p-0 overflow-x-auto text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => {
              const n = i + 1
              const isBug = stage !== 'find' && n === challenge.bugLine
              return (
                <div
                  key={n}
                  className="flex items-stretch hover:bg-[var(--accent-dim)]"
                  style={isBug ? { background: 'var(--red-dim)' } : undefined}
                >
                  <button
                    type="button"
                    disabled={stage !== 'find'}
                    onClick={() => pickLine(n)}
                    aria-label={`line ${n}`}
                    className="shrink-0 w-12 py-1 text-right pr-3 font-mono text-xs select-none border-r border-[var(--code-border)]"
                    style={{
                      color: isBug ? 'var(--red)' : 'var(--faint)',
                      cursor: stage === 'find' ? 'pointer' : 'default',
                    }}
                  >
                    {n}
                  </button>
                  <span className="px-4 py-1 whitespace-pre">{line || ' '}</span>
                </div>
              )
            })}
          </code>
        </pre>
      </div>
      {stage === 'find' && lineMsg === 'wrong' && (
        <p className="text-sm text-[var(--red)] mb-3" role="alert">
          {t(STRINGS.wrongLine)}
        </p>
      )}
      {stage !== 'find' && (
        <div className="mt-4">
          <h3 className="font-bold text-[var(--text-strong)] mb-3 flex items-center gap-2">
            <ListOrdered size={16} aria-hidden="true" />
            {stage === 'done' ? t(STRINGS.rightLine) : t(STRINGS.fixTitle)}
          </h3>
          <div className="flex flex-col gap-2" role="list">
            {challenge.fixes.map((fix, i) => {
              const isAnswer = i === challenge.fixAnswer
              return (
                <button
                  key={i}
                  type="button"
                  role="listitem"
                  disabled={stage === 'done'}
                  onClick={() => pickFix(i)}
                  className="text-left px-4 py-3 rounded-lg border transition-colors"
                  style={{
                    borderColor: stage === 'done' && isAnswer ? 'var(--green)' : 'var(--border)',
                    background:
                      stage === 'done' && isAnswer ? 'var(--green-dim)' : 'var(--surface-2)',
                  }}
                >
                  <span className="font-mono text-xs text-[var(--faint)] mr-2">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {t(fix)}
                  {stage === 'done' && isAnswer && (
                    <Check size={14} className="inline ml-2" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
          {pickedWrong && (
            <p className="text-sm text-[var(--red)] mt-3" role="alert">
              {t(STRINGS.wrongFix)}
            </p>
          )}
          {stage === 'done' && (
            <Callout type="tip" title={t(STRINGS.fixExplanation)}>
              {t(challenge.explanation)}
            </Callout>
          )}
        </div>
      )}
    </div>
  )
}

/* ================= Predict the output ================= */

function PredictView({ challenge, onSuccess }) {
  const { t, lang } = useLang()
  const [picked, setPicked] = useState(null)
  const [state, setState] = useState('answering') // answering | revealed | walking | done
  const [revealed, setRevealed] = useState(0)
  const [wrongAttempt, setWrongAttempt] = useState(false)
  const steps = challenge.walkthrough[lang]

  const onCheck = () => {
    if (picked === challenge.answer) {
      setRevealed(1)
      setState(steps.length > 1 ? 'walking' : 'done')
      setWrongAttempt(false)
      onSuccess()
    } else {
      setWrongAttempt(true)
    }
  }

  const nextStep = () => {
    const n = revealed + 1
    setRevealed(n)
    if (n >= steps.length) setState('done')
    else setState('walking')
  }

  return (
    <div>
      <p className="text-[var(--muted)] mb-2">{t(challenge.prompt)}</p>
      <CodeBlock code={challenge.code} lang="jsx" />
      <p className="font-semibold text-[var(--text-strong)] mb-3">{t(challenge.question)}</p>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={t(challenge.question)}>
        {challenge.options.map((opt, i) => {
          const selected = picked === i
          const isAnswer = i === challenge.answer
          const showResult = state !== 'answering'
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={showResult}
              onClick={() => setPicked(i)}
              className="text-left px-4 py-2.5 rounded-lg border transition-colors"
              style={{
                borderColor:
                  showResult && isAnswer
                    ? 'var(--green)'
                    : selected
                      ? 'var(--accent)'
                      : 'var(--border)',
                background:
                  showResult && isAnswer
                    ? 'var(--green-dim)'
                    : selected
                      ? 'var(--accent-dim)'
                      : 'var(--surface-2)',
              }}
            >
              <span className="font-mono text-xs text-[var(--faint)] mr-2">
                {String.fromCharCode(65 + i)}
              </span>
              {t(opt)}
              {showResult && isAnswer && (
                <Check size={14} className="inline ml-2" aria-label={t(STRINGS.correct)} />
              )}
            </button>
          )
        })}
      </div>
      {state === 'answering' && (
        <div className="mt-4">
          <button
            type="button"
            className="btn btn-primary"
            disabled={picked === null}
            onClick={() => {
              setWrongAttempt(false)
              onCheck()
            }}
          >
            <Check size={16} /> {t(STRINGS.checkAnswer)}
          </button>
          {wrongAttempt && (
            <p className="text-sm text-[var(--red)] mt-3" role="alert">
              {t(STRINGS.wrongPredict)}
            </p>
          )}
        </div>
      )}
      {state !== 'answering' && (
        <div className="mt-6">
          <Callout type="tip" title={t(STRINGS.rightPredict)} />
          <ol className="mt-4 flex flex-col gap-3">
            {steps.slice(0, revealed).map((step, i) => (
              <li
                key={i}
                className="card p-4 text-sm text-[var(--text)] flex gap-3"
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {state !== 'done' && (
            <button type="button" className="btn mt-4" onClick={nextStep}>
              <Sparkles size={14} />
              {t(STRINGS.revealStep)} ({revealed + 1}/{steps.length})
            </button>
          )}
          {state === 'done' && (
            <p className="text-sm text-[var(--muted)] mt-4">
              {t(STRINGS.stepOf)} {steps.length}/{steps.length} ✓
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/* ================= Shared shell ================= */

export default function ChallengeView({ id }) {
  const { t } = useLang()
  const completeChallenge = useStore((s) => s.completeChallenge)
  const doneIds = useStore((s) => s.progress.challenges)
  const [celebrated, setCelebrated] = useState(false)

  const challenge = getChallenge(id)
  if (!challenge) {
    return (
      <Callout type="warn" title={t(STRINGS.notFound)}>
        <Link to="/challenges" className="text-[var(--accent)] underline">
          {t(STRINGS.allChallenges)}
        </Link>
      </Callout>
    )
  }

  const onSuccess = () => {
    completeChallenge(challenge.id)
    track('challenge_complete', { challengeId: challenge.id, type: challenge.type })
    setCelebrated(true)
  }

  const idx = CHALLENGES.findIndex((c) => c.id === id)
  const next = CHALLENGES[idx + 1]
  const module = getModule(challenge.moduleId)

  return (
    <div>
      <Link to="/challenges" className="btn !py-1.5 !px-3 !text-sm mb-6 no-print">
        <ArrowLeft size={14} /> {t(STRINGS.allChallenges)}
      </Link>
      <PageHeader
        title={t(challenge.title)}
        subtitle={module ? t(module.title) : undefined}
        actions={<DifficultyBadge level={challenge.difficulty} />}
      />
      {challenge.type === 'fill-blank' && <FillBlankView challenge={challenge} onSuccess={onSuccess} />}
      {challenge.type === 'bug-hunt' && <BugHuntView challenge={challenge} onSuccess={onSuccess} />}
      {challenge.type === 'predict' && <PredictView challenge={challenge} onSuccess={onSuccess} />}

      {celebrated && (
        <div
          className="card p-6 mt-8 text-center border-2"
          style={{ borderColor: 'var(--green)' }}
          role="status"
        >
          <span
            className="inline-flex p-3 rounded-full mb-3"
            style={{ background: 'var(--green-dim)', color: 'var(--green)' }}
            aria-hidden="true"
          >
            <Trophy size={28} />
          </span>
          <h3 className="text-xl font-bold text-[var(--text-strong)]">{t(STRINGS.completed)}</h3>
          <p className="text-sm text-[var(--muted)] mt-1">
            {Object.keys(doneIds).length} / {CHALLENGES.length}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5 no-print">
            {module && (
              <Link to={module.path} className="btn">
                {t(STRINGS.reviewModule)}
              </Link>
            )}
            {next ? (
              <Link to={`/challenges/${next.id}`} className="btn btn-primary">
                {t(STRINGS.nextChallenge)} <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/challenges" className="btn btn-primary">
                {t(STRINGS.allChallenges)}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
