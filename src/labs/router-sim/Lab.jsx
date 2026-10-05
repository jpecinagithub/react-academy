import { useState, useMemo } from 'react'
import { Lock, Home, Package, User, Globe } from 'lucide-react'
import {
  SimulationShell,
  FlowSteps,
  CodeBlock,
  Callout,
  Quiz,
  SectionTitle,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  title: { en: 'React Router Simulator', es: 'Simulador de React Router' },
  intro: {
    en: 'Type a URL and watch the Router match a Route and render its component — no page reload. This is the heart of a Single Page Application.',
    es: 'Escribe una URL y mira cómo el Router encuentra su Route y renderiza el componente, sin recargar la página. Así funciona una SPA.',
  },
  conceptTitle: { en: 'The idea', es: 'La idea' },
  concept: {
    en: 'A single-page application (SPA) ships one HTML file. When the URL changes, the Router reads it, finds the matching <Route>, and React swaps which component is on screen — the browser never reloads the page.',
    es: 'Una SPA envía un único archivo HTML. Cuando la URL cambia, el Router la lee, encuentra el <Route> que coincide y React cambia el componente en pantalla: el navegador nunca recarga la página.',
  },
  addressBarLabel: { en: 'Address bar (simulated)', es: 'Barra de direcciones (simulada)' },
  go: { en: 'Go', es: 'Ir' },
  tryThese: { en: 'Try these URLs:', es: 'Prueba estas URLs:' },
  notFoundDemo: { en: 'broken link (404)', es: 'enlace roto (404)' },
  matchedRoute: { en: 'Matched route', es: 'Ruta coincidente' },
  paramsTitle: {
    en: 'params from useParams()',
    es: 'parámetros de useParams()',
  },
  noMatch: { en: 'no match → renders the 404 page', es: 'sin coincidencia → renderiza la página 404' },
  navDemoTitle: { en: '<Link> demo', es: 'Demo de <Link>' },
  navDemoNote: {
    en: 'These buttons behave like React Router\'s <Link>: they change the URL and re-render — no page reload.',
    es: 'Estos botones se comportan como <Link> de React Router: cambian la URL y re-renderizan, sin recargar la página.',
  },
  flowTitle: { en: 'What happens on every navigation', es: 'Qué ocurre en cada navegación' },
  viewportTitle: { en: 'The viewport', es: 'La ventana' },
  renderedPage: { en: 'Rendered page:', es: 'Página renderizada:' },
  codeTitle: { en: 'The Routes declaration', es: 'La declaración de Routes' },
  codeHint: {
    en: 'This is the real React Router code this simulation imitates. The Router walks this list top to bottom and picks the first <Route> whose path matches the URL.',
    es: 'Este es el código real de React Router que imita esta simulación. El Router recorre esta lista de arriba abajo y elige el primer <Route> cuya ruta coincide con la URL.',
  },
  // page names
  homeName: { en: 'Home', es: 'Inicio' },
  productsName: { en: 'Products', es: 'Productos' },
  detailName: { en: 'Product detail', es: 'Detalle de producto' },
  profileName: { en: 'Profile', es: 'Perfil' },
  notFoundName: { en: 'Not found', es: 'No encontrada' },
  // page contents
  homeWelcome: { en: 'Welcome to the shop!', es: '¡Bienvenido a la tienda!' },
  homeHint: {
    en: 'Pick a link to travel to another page. Watch the address bar: the page never reloads.',
    es: 'Elige un enlace para ir a otra página. Mira la barra de direcciones: la página nunca se recarga.',
  },
  productsTitle: { en: 'Our products', es: 'Nuestros productos' },
  viewDetail: { en: 'View', es: 'Ver' },
  detailTitle: { en: 'Product detail', es: 'Detalle de producto' },
  detailBody: {
    en: 'The :id part of the URL became a parameter. This component reads it with useParams().',
    es: 'La parte :id de la URL se convirtió en un parámetro. Este componente lo lee con useParams().',
  },
  profileTitle: { en: 'Your profile', es: 'Tu perfil' },
  profileRole: { en: 'Frontend explorer', es: 'Explorador frontend' },
  profileLevel: { en: 'Level', es: 'Nivel' },
  profileLevelValue: { en: 'Router padawan', es: 'Padawan del Router' },
  notFoundTitle: { en: '404 — page not found', es: '404 — página no encontrada' },
  notFoundBody: {
    en: 'The Router checked every <Route> and found no match, so it rendered the fallback page.',
    es: 'El Router revisó cada <Route> y no encontró coincidencia, así que renderizó la página de reserva.',
  },
  backHome: { en: 'Back home', es: 'Volver al inicio' },
  // quiz
  quizTitle: { en: 'Check yourself', es: 'Comprueba lo aprendido' },
}

const ROUTES = [
  { path: '/', name: 'homeName' },
  { path: '/products', name: 'productsName' },
  { path: '/products/:id', name: 'detailName' },
  { path: '/profile', name: 'profileName' },
]

const PRESETS = ['/', '/products', '/products/42', '/profile', '/nope']

const PRODUCTS = [
  { id: '42', name: { en: 'Neon keyboard', es: 'Teclado neón' }, price: '€49' },
  { id: '7', name: { en: 'Silent mouse', es: 'Ratón silencioso' }, price: '€25' },
  { id: '13', name: { en: 'USB-C hub', es: 'Hub USB-C' }, price: '€39' },
]

function matchRoute(path) {
  const segs = path.split('/').filter(Boolean)
  for (const route of ROUTES) {
    const rSegs = route.path.split('/').filter(Boolean)
    if (rSegs.length !== segs.length) continue
    const params = {}
    let ok = true
    for (let i = 0; i < rSegs.length; i++) {
      if (rSegs[i].startsWith(':')) {
        params[rSegs[i].slice(1)] = segs[i]
      } else if (rSegs[i] !== segs[i]) {
        ok = false
        break
      }
    }
    if (ok) return { route, params }
  }
  return { route: null, params: {} }
}

const CODE = `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function ProductDetail() {
  const { id } = useParams() // /products/42 → { id: '42' }
  return <h1>Product #{id}</h1>
}`

function ViewportPage({ route, params, t, navigate }) {
  if (!route) {
    return (
      <div className="text-center py-8">
        <p className="text-5xl font-bold text-[var(--accent)] mono">404</p>
        <p className="mt-2 font-semibold text-[var(--text-strong)]">{t(STRINGS.notFoundTitle)}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{t(STRINGS.notFoundBody)}</p>
        <button type="button" className="btn btn-primary mt-4" onClick={() => navigate('/')}>
          {t(STRINGS.backHome)}
        </button>
      </div>
    )
  }
  if (route.path === '/') {
    return (
      <div className="py-6 text-center">
        <p className="text-2xl font-bold text-[var(--text-strong)]">{t(STRINGS.homeWelcome)}</p>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-md mx-auto">{t(STRINGS.homeHint)}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn" onClick={() => navigate('/products')}>
            <Package size={14} /> {t(STRINGS.productsName)}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/profile')}>
            <User size={14} /> {t(STRINGS.profileName)}
          </button>
        </div>
      </div>
    )
  }
  if (route.path === '/products') {
    return (
      <div className="py-4">
        <p className="font-bold text-[var(--text-strong)] mb-3">{t(STRINGS.productsTitle)}</p>
        <ul className="space-y-2">
          {PRODUCTS.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]"
            >
              <span className="text-sm text-[var(--text-strong)]">
                {t(p.name)} <span className="text-[var(--muted)] mono">{p.price}</span>
              </span>
              <button
                type="button"
                className="btn text-xs"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                {t(STRINGS.viewDetail)} →
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (route.path === '/products/:id') {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-[var(--muted)]">{t(STRINGS.detailTitle)}</p>
        <p className="text-3xl font-bold text-[var(--accent)] mono mt-1">
          Product #{params.id}
        </p>
        <p className="mt-3 text-sm text-[var(--muted)] max-w-md mx-auto">{t(STRINGS.detailBody)}</p>
        <button type="button" className="btn mt-4" onClick={() => navigate('/products')}>
          ← {t(STRINGS.productsName)}
        </button>
      </div>
    )
  }
  // /profile
  return (
    <div className="py-6 flex justify-center">
      <div className="px-6 py-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-xl">
          J
        </div>
        <p className="mt-2 font-bold text-[var(--text-strong)]">Jon Peciña</p>
        <p className="text-sm text-[var(--muted)]">{t(STRINGS.profileRole)}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          {t(STRINGS.profileLevel)}: <span className="font-semibold text-[var(--accent)]">{t(STRINGS.profileLevelValue)}</span>
        </p>
      </div>
    </div>
  )
}

export default function RouterSimLab() {
  const { t } = useLang()
  const [path, setPath] = useState('/')
  const [input, setInput] = useState('/')

  const navigate = (next) => {
    const clean = next.trim() || '/'
    setPath(clean)
    setInput(clean)
  }

  const { route, params } = useMemo(() => matchRoute(path), [path])
  const matchedName = route ? t(STRINGS[route.name]) : t(STRINGS.notFoundName)

  const flowSteps = useMemo(
    () => [
      {
        label: { en: 'URL typed: ' + path, es: 'URL escrita: ' + path },
        desc: { en: 'you (or a <Link>) changed the address bar', es: 'tú (o un <Link>) cambiaste la barra de direcciones' },
      },
      {
        label: { en: 'Router reads the URL', es: 'El Router lee la URL' },
        desc: { en: 'no page reload happens', es: 'no hay recarga de página' },
      },
      {
        label: route
          ? { en: `Route matched: ${route.path}`, es: `Route coincidente: ${route.path}` }
          : { en: 'No route matched', es: 'Ninguna ruta coincide' },
        desc: route
          ? { en: `params: ${JSON.stringify(params)}`, es: `params: ${JSON.stringify(params)}` }
          : { en: 'falls through to the * (404) route', es: 'cae en la ruta * (404)' },
      },
      {
        label: { en: 'Component rendered: ' + matchedName, es: 'Componente renderizado: ' + matchedName },
      },
    ],
    [path, route, params, matchedName],
  )

  const quizQuestions = [
    {
      q: {
        en: 'What does the Router do with the URL?',
        es: '¿Qué hace el Router con la URL?',
      },
      options: [
        {
          en: 'It asks the server for a new HTML page and reloads the browser',
          es: 'Pide al servidor una nueva página HTML y recarga el navegador',
        },
        {
          en: 'It finds the matching <Route> and renders its component, without reloading',
          es: 'Encuentra el <Route> que coincide y renderiza su componente, sin recargar',
        },
        {
          en: 'It changes the URL but always shows the same component',
          es: 'Cambia la URL pero siempre muestra el mismo componente',
        },
      ],
      answer: 1,
      explain: {
        en: 'The Router maps the URL to a component client-side. That swap — not a server round-trip — is what makes it a single-page app.',
        es: 'El Router asocia la URL con un componente en el cliente. Ese intercambio —no una petición al servidor— es lo que la convierte en una SPA.',
      },
    },
    {
      q: {
        en: 'What does useParams() return for the URL /products/42?',
        es: '¿Qué devuelve useParams() para la URL /products/42?',
      },
      options: [
        { en: '{ id: 42 } (a number)', es: '{ id: 42 } (un número)' },
        { en: '{ id: "42" } (a string)', es: '{ id: "42" } (una cadena)' },
        { en: '{ product: "42" }', es: '{ product: "42" }' },
      ],
      answer: 1,
      explain: {
        en: 'URL segments are always strings. The :id placeholder in path="/products/:id" captures "42" as a string.',
        es: 'Los segmentos de la URL siempre son cadenas. El marcador :id en path="/products/:id" captura "42" como cadena.',
      },
    },
  ]

  return (
    <SimulationShell
      labId="router-sim"
      title={t(STRINGS.title)}
      intro={t(STRINGS.intro)}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.conceptTitle)}</SectionTitle>
      <p className="text-[var(--text)] leading-relaxed max-w-3xl">{t(STRINGS.concept)}</p>

      {/* Address bar */}
      <SectionTitle>{t(STRINGS.addressBarLabel)}</SectionTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          navigate(input)
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="flex items-center flex-1 gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
          <Lock size={14} className="text-[var(--muted)] shrink-0" aria-hidden="true" />
          <label htmlFor="router-url" className="sr-only">
            {t(STRINGS.addressBarLabel)}
          </label>
          <input
            id="router-url"
            className="mono flex-1 min-w-0 bg-transparent outline-none text-sm text-[var(--text-strong)]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            placeholder="/"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {t(STRINGS.go)} →
        </button>
      </form>
      <p className="mt-3 text-sm text-[var(--muted)]">{t(STRINGS.tryThese)}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`btn mono text-xs ${p === path ? 'btn-primary' : ''}`}
            onClick={() => navigate(p)}
            aria-pressed={p === path}
          >
            {p === '/nope' ? t(STRINGS.notFoundDemo) + ' → /nope' : p}
          </button>
        ))}
      </div>

      {/* Match result */}
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{t(STRINGS.matchedRoute)}</p>
          <p className="mono text-lg font-bold text-[var(--accent)] mt-1">
            {route ? route.path : t(STRINGS.noMatch)}
          </p>
        </div>
        <div className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{t(STRINGS.paramsTitle)}</p>
          <p className="mono text-lg font-bold text-[var(--accent)] mt-1">
            {'{'} {Object.keys(params).length === 0 ? '—' : Object.entries(params).map(([k, v]) => `${k}: '${v}'`).join(', ')} {'}'}
          </p>
        </div>
      </div>

      {/* Flow */}
      <SectionTitle>{t(STRINGS.flowTitle)}</SectionTitle>
      <FlowSteps key={path} steps={flowSteps} />

      {/* Viewport */}
      <SectionTitle>{t(STRINGS.viewportTitle)}</SectionTitle>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border)]">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="mono text-xs text-[var(--muted)] truncate flex items-center gap-1.5">
            <Globe size={12} aria-hidden="true" /> myshop.dev{path}
          </span>
        </div>
        {/* <Link> demo nav */}
        <div className="px-4 py-2 border-b border-[var(--border)] flex flex-wrap items-center gap-1 bg-[var(--surface)]">
          <button type="button" className="btn text-xs" onClick={() => navigate('/')}>
            <Home size={12} /> {t(STRINGS.homeName)}
          </button>
          <button type="button" className="btn text-xs" onClick={() => navigate('/products')}>
            <Package size={12} /> {t(STRINGS.productsName)}
          </button>
          <button type="button" className="btn text-xs" onClick={() => navigate('/profile')}>
            <User size={12} /> {t(STRINGS.profileName)}
          </button>
          <span className="text-xs text-[var(--muted)] ml-1">&lt;nav&gt;</span>
        </div>
        <div
          className="px-5 py-4 min-h-[14rem] bg-[var(--surface)]"
          role="region"
          aria-live="polite"
          aria-label={`${t(STRINGS.renderedPage)} ${matchedName}`}
        >
          <ViewportPage route={route} params={params} t={t} navigate={navigate} />
        </div>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{t(STRINGS.navDemoNote)}</p>

      {/* Code */}
      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-3 max-w-3xl">{t(STRINGS.codeHint)}</p>
      <CodeBlock code={CODE} lang="jsx" />

      {/* SPA callout */}
      <div className="mt-6">
        <Callout type="info" title={t({ en: 'One HTML file', es: 'Un único HTML' })}>
          {t({
            en: 'In a SPA the server sends one HTML file once. After that, every "page change" is just the Router picking a component and React swapping it in — fast, with no white flash of a reload.',
            es: 'En una SPA el servidor envía un único HTML una vez. Después, cada "cambio de página" es solo el Router eligiendo un componente y React sustituyéndolo: rápido y sin el parpadeo blanco de una recarga.',
          })}
        </Callout>
      </div>

      {/* Quiz */}
      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <Quiz questions={quizQuestions} quizId="router-sim" />
    </SimulationShell>
  )
}
