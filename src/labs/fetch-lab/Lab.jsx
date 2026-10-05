import { useEffect, useRef, useState } from 'react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  Quiz,
  SectionTitle,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  intro: {
    en: 'No network needed: this lab uses a simulated API so you can inject latency, errors and empty responses on demand.',
    es: 'Sin red: este laboratorio usa una API simulada para que puedas inyectar latencia, errores y respuestas vacías a voluntad.',
  },
  conceptTitle: { en: '1 · Concept: the fetch tri-state', es: '1 · Concepto: el tri-estado de la petición' },
  conceptBody: {
    en: 'Fetching data is asynchronous: the UI must look right **before** the data exists, **while** it travels, **when** it arrives, and **if** something fails. That means every fetch UI is really three UIs in one: `loading`, `success` and `error` — all driven by state.',
    es: 'Cargar datos es asíncrono: la UI debe verse bien **antes** de que existan los datos, **mientras** viajan, **cuando** llegan y **si** algo falla. Por eso cada UI de petición son en realidad tres UIs en una: `loading`, `success` y `error` — todas gobernadas por el estado.',
  },
  flowTitle: { en: '2 · The fetch flow', es: '2 · El flujo de la petición' },
  expTitle: { en: '3 · Experiment: the API simulator', es: '3 · Experimento: el simulador de API' },
  codeTitle: { en: '4 · The canonical pattern', es: '4 · El patrón canónico' },
  challengeTitle: { en: '5 · Challenge', es: '5 · Reto' },

  latency: { en: 'Latency', es: 'Latencia' },
  forceError: { en: 'Force error', es: 'Forzar error' },
  emptyResponse: { en: 'Empty response', es: 'Respuesta vacía' },
  fetchBtn: { en: 'Fetch data', es: 'Pedir datos' },
  retryBtn: { en: 'Retry', es: 'Reintentar' },
  mountedToggle: { en: 'Component mounted', es: 'Componente montado' },
  mountedHint: {
    en: 'Uncheck this mid-flight (with high latency) to see the response arrive after unmount — and get safely ignored.',
    es: 'Desmárcalo a mitad de vuelo (con latencia alta) para ver la respuesta llegar tras el desmontaje — e ignorarse de forma segura.',
  },
  liveState: { en: 'Live state', es: 'Estado en vivo' },
  eventLog: { en: 'Event log', es: 'Registro de eventos' },
  emptyLog: { en: 'Press “Fetch data” to start.', es: 'Pulsa «Pedir datos» para empezar.' },

  panelLoading: { en: 'Loading', es: 'Cargando' },
  panelSuccess: { en: 'Success', es: 'Éxito' },
  panelError: { en: 'Error', es: 'Error' },
  loadingSkeleton: { en: 'Skeleton placeholders…', es: 'Esqueletos de carga…' },
  idlePanel: { en: 'idle — nothing requested yet', es: 'inactivo — nada pedido aún' },
  emptyList: { en: 'The API returned an empty list. Your UI must handle this too.', es: 'La API devolvió una lista vacía. Tu UI debe manejar esto también.' },
  errorMsg: { en: 'Network request failed. Show a message and a way out.', es: 'La petición falló. Muestra un mensaje y una salida.' },

  ignoreCallout: {
    en: 'The `ignore` flag is the simplest cleanup for fetches: if the component unmounts before the response arrives, the flag flips to `true` and the stale response is discarded instead of calling `setState` on a dead component.',
    es: 'La bandera `ignore` es la limpieza más simple para peticiones: si el componente se desmonta antes de que llegue la respuesta, la bandera pasa a `true` y la respuesta obsoleta se descarta en lugar de llamar a `setState` en un componente muerto.',
  },
  raceCallout: {
    en: 'Race condition bonus: fire two fetches quickly. The `ignore` flag on the first effect run also discards the slower, outdated response — the UI always shows the latest request.',
    es: 'Extra: condición de carrera. Dispara dos peticiones seguidas. La bandera `ignore` del primer efecto también descarta la respuesta más lenta y obsoleta: la UI siempre muestra la última petición.',
  },
}

const USERS = [
  { id: 1, name: 'Ada Lovelace', role: { en: 'Pioneer of computing', es: 'Pionera de la computación' } },
  { id: 2, name: 'Alan Turing', role: { en: 'Father of computer science', es: 'Padre de la informática' } },
  { id: 3, name: 'Grace Hopper', role: { en: 'Compiler inventor', es: 'Inventora del compilador' } },
  { id: 4, name: 'Linus Torvalds', role: { en: 'Linux creator', es: 'Creador de Linux' } },
]

function fakeFetch({ latencyMs, fail, empty }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('NetworkError: failed to fetch'))
      else resolve(empty ? [] : USERS)
    }, latencyMs)
  })
}

const FLOW = [
  { label: { en: 'Component mounts', es: 'El componente se monta' } },
  {
    label: { en: 'loading = true', es: 'loading = true' },
    desc: { en: 'skeleton UI renders immediately', es: 'la UI de esqueleto se renderiza al instante' },
  },
  { label: { en: 'fetch() starts', es: 'fetch() comienza' } },
  {
    label: { en: 'response arrives', es: 'llega la respuesta' },
    desc: { en: 'or the request fails', es: 'o la petición falla' },
  },
  {
    label: { en: 'setData() / setError()', es: 'setData() / setError()' },
    desc: { en: 'state updates', es: 'el estado se actualiza' },
  },
  { label: { en: 'UI re-renders', es: 'La UI se re-renderiza' } },
]

const CODE_FETCH = `function UserList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;               // 👈 the cleanup flag

    setLoading(true);
    setError(null);
    fetch('/api/users')
      .then((res) => res.json())
      .then((users) => {
        if (ignore) return;           // unmounted → discard
        setData(users);
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err);
        setLoading(false);
      });

    return () => { ignore = true; };  // 👈 cleanup on unmount
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorView error={error} />;
  return <List data={data} />;
}`

function StatePanel({ title, active, children, tone }) {
  const ring =
    tone === 'loading' ? 'border-sky-400' : tone === 'success' ? 'border-emerald-400' : 'border-red-400'
  return (
    <div
      className={`rounded-xl border p-4 bg-[var(--surface-1)] transition-all ${
        active ? `${ring} ring-2 ${ring.replace('border-', 'ring-')}` : 'border-[var(--border)] opacity-50'
      }`}
      aria-live="polite"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${active ? 'animate-pulse' : ''}`}
          style={{ background: active ? 'var(--accent)' : 'var(--muted)' }}
          aria-hidden="true"
        />
        <h3 className="font-bold text-[var(--text-strong)] text-sm">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function UserListDemo({ latencyMs, fail, empty, runKey, onEvent, onRetry, t }) {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    onEvent({ type: 'mount', text: 'effect ran' })
    setStatus('loading')
    setError(null)
    onEvent({ type: 'loading', text: 'loading = true → skeleton' })
    fakeFetch({ latencyMs, fail, empty })
      .then((users) => {
        if (ignore) {
          onEvent({ type: 'ignored', text: 'response arrived after unmount → IGNORED' })
          return
        }
        onEvent({ type: 'response', text: `response: ${users.length} users` })
        setData(users)
        setStatus('success')
        onEvent({ type: 'render', text: 'setData() → re-render' })
      })
      .catch((err) => {
        if (ignore) {
          onEvent({ type: 'ignored', text: 'error arrived after unmount → IGNORED' })
          return
        }
        onEvent({ type: 'response', text: 'request failed' })
        setError(err.message)
        setStatus('error')
        onEvent({ type: 'render', text: 'setError() → re-render' })
      })
    return () => {
      ignore = true
      onEvent({ type: 'cleanup', text: 'cleanup ran → ignore = true' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey])

  const lang = t({ en: 'en', es: 'es' }) === 'es' ? 'es' : 'en'

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-3 my-4">
        <StatePanel title={t(STRINGS.panelLoading)} active={status === 'loading'} tone="loading">
          {status === 'loading' ? (
            <div className="space-y-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 rounded bg-[var(--surface-3)] animate-pulse" />
              ))}
              <p className="text-xs text-[var(--muted)]">{t(STRINGS.loadingSkeleton)}</p>
            </div>
          ) : (
            <p className="text-xs text-[var(--muted)]">{t(STRINGS.idlePanel)}</p>
          )}
        </StatePanel>

        <StatePanel title={t(STRINGS.panelSuccess)} active={status === 'success'} tone="success">
          {status === 'success' && data ? (
            data.length === 0 ? (
              <p className="text-xs text-amber-500">{t(STRINGS.emptyList)}</p>
            ) : (
              <ul className="space-y-2">
                {data.map((u) => (
                  <li key={u.id} className="text-sm">
                    <strong className="text-[var(--text-strong)]">{u.name}</strong>
                    <span className="text-[var(--muted)]"> — {u.role[lang]}</span>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className="text-xs text-[var(--muted)]">{t(STRINGS.idlePanel)}</p>
          )}
        </StatePanel>

        <StatePanel title={t(STRINGS.panelError)} active={status === 'error'} tone="error">
          {status === 'error' ? (
            <>
              <p className="mono text-xs text-red-500 mb-2">{error}</p>
              <p className="text-xs text-[var(--muted)] mb-2">{t(STRINGS.errorMsg)}</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
                🔄 {t(STRINGS.retryBtn)}
              </button>
            </>
          ) : (
            <p className="text-xs text-[var(--muted)]">{t(STRINGS.idlePanel)}</p>
          )}
        </StatePanel>
      </div>

      <h4 className="text-sm font-semibold text-[var(--text-strong)] mb-1">{t(STRINGS.liveState)}</h4>
      <pre className="mono text-xs bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-3 overflow-x-auto" aria-live="polite">
        {JSON.stringify({ loading: status === 'loading', error, data: data ? `${data.length} users` : null }, null, 2)}
      </pre>
    </div>
  )
}

export default function FetchLab() {
  const { t } = useLang()
  const [latency, setLatency] = useState(1)
  const [forceError, setForceError] = useState(false)
  const [emptyResponse, setEmptyResponse] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const [mounted, setMounted] = useState(true)
  const [log, setLog] = useState([])
  const logId = useRef(1)

  const pushLog = (entry) => {
    const id = logId.current++
    setLog((prev) => [...prev.slice(-13), { ...entry, id, time: new Date().toLocaleTimeString() }])
  }

  const startFetch = () => {
    if (!mounted) setMounted(true)
    setLog([])
    setRunKey((k) => k + 1)
  }

  const toggleMounted = (value) => {
    setMounted(value)
    if (!value) pushLog({ type: 'unmounted', text: 'component unmounted by user' })
  }

  const eventColor = (type) =>
    type === 'ignored'
      ? 'text-amber-500'
      : type === 'cleanup'
        ? 'text-[var(--muted)]'
        : type === 'response'
          ? 'text-emerald-500'
          : 'text-[var(--accent)]'

  const quizQuestions = [
    {
      q: {
        en: 'What does the `ignore` cleanup flag prevent?',
        es: '¿Qué evita la bandera de limpieza `ignore`?',
      },
      options: [
        { en: 'Calling setState after the component unmounted', es: 'Llamar a setState después de que el componente se desmontó' },
        { en: 'The fetch from ever starting', es: 'Que la petición llegue a empezar' },
        { en: 'The loading skeleton from rendering', es: 'Que se renderice el esqueleto de carga' },
      ],
      answer: 0,
      explain: {
        en: 'When the effect cleans up (unmount), ignore flips to true and any late response is discarded instead of updating state on a dead component.',
        es: 'Cuando el efecto se limpia (desmontaje), ignore pasa a true y cualquier respuesta tardía se descarta en lugar de actualizar el estado de un componente muerto.',
      },
    },
    {
      q: {
        en: 'A fetch UI should always handle which three states?',
        es: '¿Qué tres estados debe manejar siempre una UI de petición?',
      },
      options: [
        { en: 'mount / update / unmount', es: 'montaje / actualización / desmontaje' },
        { en: 'loading / success / error', es: 'cargando / éxito / error' },
        { en: 'props / state / context', es: 'props / estado / contexto' },
      ],
      answer: 1,
      explain: {
        en: 'Loading, success and error are the complete tri-state. Forgetting the error state is the most common beginner bug.',
        es: 'Cargando, éxito y error son el tri-estado completo. Olvidar el estado de error es el bug más común de principiantes.',
      },
    },
  ]

  return (
    <SimulationShell
      labId="fetch-lab"
      title={t({ en: 'API Fetch Lab', es: 'Laboratorio de peticiones' })}
      intro={t(STRINGS.intro)}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <p className="text-[var(--text)] mb-4 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>

      <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
      <FlowSteps key={runKey} steps={FLOW.map((s) => ({ label: t(s.label), desc: s.desc && t(s.desc) }))} />

      <SectionTitle>{t(STRINGS.expTitle)}</SectionTitle>

      <div className="card p-5 my-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="latency" className="text-sm font-semibold text-[var(--text-strong)]">
              {t(STRINGS.latency)}: <span className="mono text-[var(--accent)]">{latency.toFixed(1)}s</span>
            </label>
            <input
              id="latency"
              type="range"
              min={0}
              max={3}
              step={0.5}
              value={latency}
              onChange={(e) => setLatency(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-[var(--muted)]">
              <span>0s</span>
              <span>3s</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={forceError} onChange={(e) => setForceError(e.target.checked)} className="w-4 h-4" />
              {t(STRINGS.forceError)}
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={emptyResponse} onChange={(e) => setEmptyResponse(e.target.checked)} className="w-4 h-4" />
              {t(STRINGS.emptyResponse)}
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={mounted} onChange={(e) => toggleMounted(e.target.checked)} className="w-4 h-4" />
              {t(STRINGS.mountedToggle)}
            </label>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] mb-3">💡 {t(STRINGS.mountedHint)}</p>
        <button type="button" className="btn btn-primary" onClick={startFetch}>
          🚀 {t(STRINGS.fetchBtn)}
        </button>
      </div>

      {mounted ? (
        <UserListDemo
          key={`userlist-${mounted}`}
          latencyMs={latency * 1000}
          fail={forceError}
          empty={emptyResponse}
          runKey={runKey}
          onEvent={pushLog}
          onRetry={startFetch}
          t={t}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)] my-4">
          {t({ en: 'Component unmounted — its effect was cleaned up.', es: 'Componente desmontado — su efecto fue limpiado.' })}
        </div>
      )}

      <h4 className="text-sm font-semibold text-[var(--text-strong)] mb-1 mt-4">{t(STRINGS.eventLog)}</h4>
      <ul className="mono text-xs bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-3 h-40 overflow-y-auto" aria-live="polite">
        {log.length === 0 && <li className="text-[var(--muted)]">{t(STRINGS.emptyLog)}</li>}
        {log.map((e) => (
          <li key={e.id}>
            <span className="text-[var(--muted)]">{e.time}</span>{' '}
            <span className={eventColor(e.type)}>▸</span> {e.text}
          </li>
        ))}
      </ul>

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <CodeBlock code={CODE_FETCH} lang="jsx" />
      <Callout type="tip">
        <GlossaryTerm term="cleanup">{t(STRINGS.ignoreCallout)}</GlossaryTerm>
      </Callout>
      <Callout type="info">{t(STRINGS.raceCallout)}</Callout>

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <Quiz questions={quizQuestions} quizId="fetch-challenge" />
    </SimulationShell>
  )
}
