// Conditional Rendering Playground — flip state toggles, watch React pick a
// branch of the component tree, read the live code, and meet the `&&` gotcha.
import { useState } from 'react'
import {
  Bell,
  BellOff,
  Crown,
  Loader2,
  LogIn,
  RotateCcw,
  TriangleAlert,
  User,
} from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  FlowSteps,
  Quiz,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  togglesTitle: { en: '1 · Flip the state', es: '1 · Cambia el estado' },
  togglesHint: {
    en: 'These are real useState toggles. Every flip below re-renders this whole page — including the tree and the code.',
    es: 'Son interruptores useState reales. Cada cambio vuelve a renderizar toda esta página, incluido el árbol y el código.',
  },
  treeTitle: { en: '2 · Which branch does React render?', es: '2 · ¿Qué rama renderiza React?' },
  treeHint: {
    en: 'The component tree, live. The active branch glows; branches React skipped are dimmed.',
    es: 'El árbol de componentes, en vivo. La rama activa brilla; las ramas que React omitió aparecen atenuadas.',
  },
  previewTitle: { en: '3 · The resulting UI', es: '3 · La UI resultante' },
  codeTitle: { en: '4 · The code — live', es: '4 · El código, en vivo' },
  codeHint: {
    en: 'This is the actual pattern from the preview above. The comment marks the branch React is rendering right now.',
    es: 'Este es el patrón real de la vista previa. El comentario marca la rama que React está renderizando ahora mismo.',
  },
  gotchaTitle: { en: '5 · The && gotcha', es: '5 · La trampa del &&' },
  gotchaHint: {
    en: 'Try setting the count to 0 below. {count && <Badge />} does not render "nothing" — it renders the number 0.',
    es: 'Pon el contador a 0. {count && <Badge />} no renderiza «nada»: renderiza el número 0.',
  },
  challengeTitle: { en: '6 · Challenge', es: '6 · Reto' },
  // toggle labels
  tLoggedIn: { en: 'isLoggedIn', es: 'isLoggedIn' },
  tLoading: { en: 'isLoading', es: 'isLoading' },
  tError: { en: 'hasError', es: 'hasError' },
  tPremium: { en: 'isPremium', es: 'isPremium' },
  tNotifs: { en: 'notifications', es: 'notificaciones' },
  on: { en: 'on', es: 'sí' },
  off: { en: 'off', es: 'no' },
  rendering: { en: 'React is rendering:', es: 'React está renderizando:' },
  // preview strings
  welcome: { en: 'Welcome back!', es: '¡Hola de nuevo!' },
  premiumBadge: { en: 'PREMIUM', es: 'PREMIUM' },
  loginTitle: { en: 'Log in', es: 'Iniciar sesión' },
  loginBtn: { en: 'Log in as demo user', es: 'Entrar como usuario demo' },
  loginHint: {
    en: 'This button flips isLoggedIn to true — try it.',
    es: 'Este botón pone isLoggedIn a true. Pruébalo.',
  },
  emptyNotifs: {
    en: 'No notifications. Enjoy the silence.',
    es: 'Sin notificaciones. Disfruta del silencio.',
  },
  notifItem: { en: 'Notification', es: 'Notificación' },
  errorTitle: { en: 'Something went wrong', es: 'Algo salió mal' },
  errorBody: {
    en: 'The request failed. This branch replaced the whole page.',
    es: 'La petición falló. Esta rama reemplazó toda la página.',
  },
  retry: { en: 'Retry', es: 'Reintentar' },
  retryHint: {
    en: 'Retry clears hasError — watch the tree switch back.',
    es: 'Reintentar limpia hasError: observa cómo el árbol vuelve a cambiar.',
  },
  loadingLabel: { en: 'Loading…', es: 'Cargando…' },
  gotchaResult: { en: 'Rendered output:', es: 'Salida renderizada:' },
  setCount: { en: 'Set count:', es: 'Pon el contador a:' },
  badgeLabel: { en: 'new messages', es: 'mensajes nuevos' },
  calloutGotcha: {
    en: 'JavaScript’s && returns the left side when it is falsy. 0 is falsy, so {count && <Badge />} renders a stray “0” on screen. Guard it: {count > 0 && <Badge />}.',
    es: 'El && de JavaScript devuelve el lado izquierdo cuando es falsy. 0 es falsy, así que {count && <Badge />} pinta un «0» perdido en pantalla. Protégelo: {count > 0 && <Badge />}.',
  },
}

const FLOW = [
  {
    label: { en: 'State changes', es: 'El estado cambia' },
    desc: { en: 'e.g. setIsLoggedIn(true)', es: 'p. ej. setIsLoggedIn(true)' },
  },
  {
    label: { en: 'React re-renders', es: 'React vuelve a renderizar' },
    desc: { en: 'the component function runs again', es: 'la función componente se ejecuta de nuevo' },
  },
  {
    label: { en: 'Conditions are re-evaluated', es: 'Las condiciones se reevalúan' },
    desc: { en: 'ternary / && / if-return run with the new values', es: 'ternario, && o if-return se ejecutan con los nuevos valores' },
  },
  {
    label: { en: 'Only the matching branch renders', es: 'Solo se renderiza la rama correspondiente' },
    desc: { en: 'the rest of the tree is skipped', es: 'el resto del árbol se omite' },
  },
]

function Toggle({ label, checked, onChange }) {
  const { t } = useLang()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] transition-colors w-full text-left"
    >
      <code className="text-sm font-mono text-[var(--text-strong)]">{label}</code>
      <span
        aria-hidden="true"
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
        style={{ background: checked ? 'var(--green)' : 'var(--border)' }}
      >
        <span
          className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(1.4rem)' : 'translateX(0.25rem)' }}
        />
      </span>
      <span className="sr-only">{checked ? t(STRINGS.on) : t(STRINGS.off)}</span>
    </button>
  )
}

function TreeNode({ label, active, children }) {
  return (
    <div className="flex flex-col">
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm w-fit transition-all"
        style={
          active
            ? {
                borderColor: 'var(--accent)',
                background: 'var(--accent-dim)',
                color: 'var(--text-strong)',
                boxShadow: '0 0 0 3px var(--accent-dim)',
              }
            : {
                borderColor: 'var(--border)',
                color: 'var(--faint)',
                opacity: 0.45,
              }
        }
        aria-current={active ? 'true' : undefined}
      >
        <span
          aria-hidden="true"
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: active ? 'var(--green)' : 'var(--faint)' }}
        />
        {label}
      </div>
      {children && (
        <div className="ml-4 mt-1.5 pl-4 border-l-2 border-[var(--border)] flex flex-col gap-1.5">
          {children}
        </div>
      )}
    </div>
  )
}

function buildCode(s) {
  const mark = (cond) => (cond ? '  // ← React renders THIS branch now' : '')
  const L = []
  L.push('// live state:')
  L.push(`// isLoggedIn = ${s.isLoggedIn}, isLoading = ${s.isLoading}, hasError = ${s.hasError}`)
  L.push('function App() {')
  L.push(`  if (isLoading) return <Spinner />;${mark(s.isLoading)}`)
  L.push(`  if (hasError) return <ErrorBanner />;${mark(!s.isLoading && s.hasError)}`)
  L.push(`  return isLoggedIn ? <Dashboard /> : <Login />;${mark(!s.isLoading && !s.hasError)}`)
  L.push('}')
  L.push('')
  L.push('function Dashboard() {')
  L.push('  return (')
  L.push('    <main>')
  L.push(`      {isPremium && <PremiumBadge />}${mark(!s.isLoading && !s.hasError && s.isLoggedIn && s.isPremium)}`)
  L.push('      {notifications.length > 0')
  L.push(`        ? <NotificationList />${mark(!s.isLoading && !s.hasError && s.isLoggedIn && s.notifCount > 0)}`)
  L.push(`        : <EmptyState />}${mark(!s.isLoading && !s.hasError && s.isLoggedIn && s.notifCount === 0)}`)
  L.push('    </main>')
  L.push('  )')
  L.push('}')
  return L.join('\n')
}

function Preview({ s, set }) {
  const { t } = useLang()
  const branch = s.isLoading ? 'loading' : s.hasError ? 'error' : s.isLoggedIn ? 'dashboard' : 'login'

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-3)]">
        <span className="font-mono text-sm text-[var(--text-strong)]">&lt;App /&gt;</span>
        <span
          className="text-xs font-mono px-2 py-1 rounded-md"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
          aria-live="polite"
        >
          {t(STRINGS.rendering)}{' '}
          <strong>
            {branch === 'loading' && '<Spinner />'}
            {branch === 'error' && '<ErrorBanner />'}
            {branch === 'login' && '<Login />'}
            {branch === 'dashboard' && '<Dashboard />'}
          </strong>
        </span>
      </div>
      <div className="p-5 min-h-[14rem]" aria-live="polite">
        {branch === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-3 h-48 text-[var(--muted)]">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" aria-hidden="true" />
            <p className="font-mono text-sm">{t(STRINGS.loadingLabel)}</p>
          </div>
        )}
        {branch === 'error' && (
          <div className="rounded-lg border p-5 max-w-md mx-auto" style={{ borderColor: 'var(--red)', background: 'var(--red-dim)' }}>
            <p className="font-bold flex items-center gap-2" style={{ color: 'var(--red)' }}>
              <TriangleAlert size={18} aria-hidden="true" /> {t(STRINGS.errorTitle)}
            </p>
            <p className="text-sm text-[var(--text)] mt-1">{t(STRINGS.errorBody)}</p>
            <button type="button" className="btn mt-3" onClick={() => set((p) => ({ ...p, hasError: false }))}>
              <RotateCcw size={14} /> {t(STRINGS.retry)}
            </button>
            <p className="text-xs text-[var(--muted)] mt-2">{t(STRINGS.retryHint)}</p>
          </div>
        )}
        {branch === 'login' && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-3)] p-6 max-w-sm mx-auto text-center">
            <LogIn size={28} className="mx-auto text-[var(--accent)]" aria-hidden="true" />
            <h3 className="font-bold text-lg text-[var(--text-strong)] mt-2">{t(STRINGS.loginTitle)}</h3>
            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={() => set((p) => ({ ...p, isLoggedIn: true }))}
            >
              <User size={15} /> {t(STRINGS.loginBtn)}
            </button>
            <p className="text-xs text-[var(--muted)] mt-2">{t(STRINGS.loginHint)}</p>
          </div>
        )}
        {branch === 'dashboard' && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="font-bold text-lg text-[var(--text-strong)]">{t(STRINGS.welcome)}</h3>
              {s.isPremium && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}
                >
                  <Crown size={13} aria-hidden="true" /> {t(STRINGS.premiumBadge)}
                </span>
              )}
            </div>
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] p-4">
              <p className="text-sm font-semibold text-[var(--text-strong)] mb-2 flex items-center gap-2">
                {s.notifCount > 0 ? <Bell size={15} aria-hidden="true" /> : <BellOff size={15} aria-hidden="true" />}
                {t(STRINGS.tNotifs)} ({s.notifCount})
              </p>
              {s.notifCount > 0 ? (
                <ul className="space-y-2">
                  {Array.from({ length: s.notifCount }, (_, i) => (
                    <li
                      key={i}
                      className="text-sm px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]"
                    >
                      {t(STRINGS.notifItem)} #{i + 1}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted)] italic">{t(STRINGS.emptyNotifs)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function GotchaDemo() {
  const { t } = useLang()
  const [count, setCount] = useState(0)
  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-[var(--text-strong)] mb-3">{t(STRINGS.setCount)}</p>
      <div className="flex gap-2 mb-4" role="group" aria-label={t(STRINGS.setCount)}>
        {[0, 1, 3].map((n) => (
          <button
            key={n}
            type="button"
            className={count === n ? 'btn btn-primary' : 'btn'}
            onClick={() => setCount(n)}
            aria-pressed={count === n}
          >
            {n}
          </button>
        ))}
      </div>
      <CodeBlock code={`// count = ${count}\n{count && <span className="badge">{count} new messages</span>}`} lang="jsx" />
      <p className="text-sm text-[var(--muted)] mt-2">{t(STRINGS.gotchaResult)}</p>
      <div
        className="mt-1 min-h-[3rem] rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-3 font-mono text-sm"
        aria-live="polite"
      >
        {count && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
          >
            <Bell size={12} aria-hidden="true" /> {count} {t(STRINGS.badgeLabel)}
          </span>
        )}
      </div>
      <Callout type="warn">{t(STRINGS.calloutGotcha)}</Callout>
    </div>
  )
}

const QUIZ = [
  {
    q: {
      en: 'isLoggedIn is false. What does `isLoggedIn ? <Dashboard /> : <Login />` render?',
      es: 'isLoggedIn es false. ¿Qué renderiza `isLoggedIn ? <Dashboard /> : <Login />`?',
    },
    options: [
      { en: '<Dashboard />', es: '<Dashboard />' },
      { en: '<Login />', es: '<Login />' },
      { en: 'Both, one after the other', es: 'Ambos, uno tras otro' },
      { en: 'Nothing — React throws', es: 'Nada: React lanza un error' },
    ],
    answer: 1,
    explain: {
      en: 'The ternary picks exactly one branch. The other branch is not rendered at all.',
      es: 'El ternario elige exactamente una rama. La otra rama no se renderiza en absoluto.',
    },
  },
  {
    q: {
      en: 'count is 0. What appears on screen with `{count && <Badge />}`?',
      es: 'count vale 0. ¿Qué aparece en pantalla con `{count && <Badge />}`?',
    },
    options: [
      { en: 'Nothing at all', es: 'Nada en absoluto' },
      { en: 'The number 0', es: 'El número 0' },
      { en: '<Badge /> with 0', es: '<Badge /> con 0' },
      { en: 'An error', es: 'Un error' },
    ],
    answer: 1,
    explain: {
      en: '&& returns the falsy left side (0), and React renders 0 as text. Guard it: {count > 0 && <Badge />}.',
      es: '&& devuelve el lado izquierdo falsy (0), y React renderiza 0 como texto. Protégelo: {count > 0 && <Badge />}.',
    },
  },
  {
    q: {
      en: 'When does React decide which conditional branch to show?',
      es: '¿Cuándo decide React qué rama condicional mostrar?',
    },
    options: [
      { en: 'Once, when the page loads', es: 'Una vez, al cargar la página' },
      { en: 'During every render, from current state/props', es: 'En cada render, a partir del estado/props actuales' },
      { en: 'Only inside useEffect', es: 'Solo dentro de useEffect' },
      { en: 'When the user clicks something', es: 'Cuando el usuario pulsa algo' },
    ],
    answer: 1,
    explain: {
      en: 'Conditions are plain JavaScript evaluated on each render — new state, new evaluation, new branch.',
      es: 'Las condiciones son JavaScript normal evaluado en cada render: nuevo estado, nueva evaluación, nueva rama.',
    },
  },
]

export default function ConditionalLab() {
  const { t } = useLang()
  const [s, set] = useState({
    isLoggedIn: true,
    isLoading: false,
    hasError: false,
    isPremium: false,
    notifCount: 2,
  })
  const upd = (key) => (v) => set((p) => ({ ...p, [key]: v }))

  const inDashboard =
    !s.isLoading && !s.hasError && s.isLoggedIn

  return (
    <SimulationShell
      labId="conditional-lab"
      title={t({ en: 'Conditional Rendering Playground', es: 'Playground de renderizado condicional' })}
      intro={t({
        en: 'Conditions are just JavaScript — but they decide what exists on screen. Flip the switches and watch the tree.',
        es: 'Las condiciones son solo JavaScript, pero deciden qué existe en pantalla. Mueve los interruptores y observa el árbol.',
      })}
      difficulty="beginner"
    >
      <p className="text-[var(--text)] mb-6 max-w-3xl">
        <GlossaryTerm term="render">{t({ en: 'render', es: 'render' })}</GlossaryTerm>{' '}
        {t({
          en: 'is not a vague idea: it is the moment React runs your component function and evaluates every condition with the current state.',
          es: 'no es una idea vaga: es el momento en que React ejecuta tu función componente y evalúa cada condición con el estado actual.',
        })}
      </p>
      <FlowSteps steps={FLOW} />

      <SectionTitle>{t(STRINGS.togglesTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.togglesHint)}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Toggle label="isLoggedIn" checked={s.isLoggedIn} onChange={upd('isLoggedIn')} />
        <Toggle label="isLoading" checked={s.isLoading} onChange={upd('isLoading')} />
        <Toggle label="hasError" checked={s.hasError} onChange={upd('hasError')} />
        <Toggle label="isPremium" checked={s.isPremium} onChange={upd('isPremium')} />
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
          <code className="text-sm font-mono text-[var(--text-strong)]">{t(STRINGS.tNotifs)}</code>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn !px-2.5 !py-1"
              onClick={() => set((p) => ({ ...p, notifCount: Math.max(0, p.notifCount - 1) }))}
              aria-label="−1"
            >
              −
            </button>
            <span className="font-mono font-bold w-6 text-center" aria-live="polite">{s.notifCount}</span>
            <button
              type="button"
              className="btn !px-2.5 !py-1"
              onClick={() => set((p) => ({ ...p, notifCount: Math.min(5, p.notifCount + 1) }))}
              aria-label="+1"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <SectionTitle>{t(STRINGS.treeTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.treeHint)}</p>
      <div className="card p-5 overflow-x-auto">
        <TreeNode label="<App />" active>
          <TreeNode label="<Header />" active />
          <TreeNode label="{isLoading ? … : …}" active>
            <TreeNode label="<Spinner />" active={s.isLoading} />
            <TreeNode label="<ErrorBanner />" active={!s.isLoading && s.hasError} />
            <TreeNode label="isLoggedIn ? <Dashboard /> : <Login />" active={!s.isLoading && !s.hasError}>
              <TreeNode label="<Dashboard />" active={inDashboard}>
                <TreeNode label="{isPremium && <PremiumBadge />}" active={inDashboard && s.isPremium} />
                <TreeNode
                  label="notifs ? <NotificationList /> : <EmptyState />"
                  active={inDashboard}
                />
              </TreeNode>
              <TreeNode label="<Login />" active={!s.isLoading && !s.hasError && !s.isLoggedIn} />
            </TreeNode>
          </TreeNode>
        </TreeNode>
      </div>

      <SectionTitle>{t(STRINGS.previewTitle)}</SectionTitle>
      <Preview s={s} set={set} />

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-2">{t(STRINGS.codeHint)}</p>
      <CodeBlock code={buildCode(s)} lang="jsx" />

      <SectionTitle>{t(STRINGS.gotchaTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.gotchaHint)}</p>
      <GotchaDemo />

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="conditional-lab-challenge" />
    </SimulationShell>
  )
}
