import { Link } from 'react-router-dom'
import { Boxes } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { PageHeader, Callout } from '../components/ui.jsx'

// The 25 planned mini-sandboxes (Phase 8 fills them in as runnable).
const SANDBOXES = [
  'counter', 'toggle', 'accordion', 'tabs', 'modal', 'todo-list',
  'shopping-cart', 'dark-mode', 'search-filter', 'form', 'login-ui',
  'timer', 'stopwatch', 'api-fetcher', 'weather-ui', 'pagination',
  'infinite-scroll', 'drag-drop', 'kanban', 'theme-context',
  'language-context', 'custom-hook', 'router', 'use-reducer', 'memoization',
]

const NAMES = {
  en: {
    counter: 'Counter', toggle: 'Toggle', accordion: 'Accordion', tabs: 'Tabs',
    modal: 'Modal', 'todo-list': 'Todo List', 'shopping-cart': 'Shopping Cart',
    'dark-mode': 'Dark Mode', 'search-filter': 'Search Filter', form: 'Form',
    'login-ui': 'Login UI', timer: 'Timer', stopwatch: 'Stopwatch',
    'api-fetcher': 'API Fetcher', 'weather-ui': 'Weather UI demo',
    pagination: 'Pagination', 'infinite-scroll': 'Infinite scroll simulation',
    'drag-drop': 'Drag & Drop', kanban: 'Kanban board',
    'theme-context': 'Theme Context', 'language-context': 'Language Context',
    'custom-hook': 'Custom hook', router: 'Router', 'use-reducer': 'useReducer',
    memoization: 'Memoization',
  },
  es: {
    counter: 'Contador', toggle: 'Interruptor', accordion: 'Acordeón', tabs: 'Pestañas',
    modal: 'Modal', 'todo-list': 'Lista de tareas', 'shopping-cart': 'Carrito de compra',
    'dark-mode': 'Modo oscuro', 'search-filter': 'Filtro de búsqueda', form: 'Formulario',
    'login-ui': 'Pantalla de login', timer: 'Temporizador', stopwatch: 'Cronómetro',
    'api-fetcher': 'Cargador de API', 'weather-ui': 'Demo de UI del tiempo',
    pagination: 'Paginación', 'infinite-scroll': 'Simulación de scroll infinito',
    'drag-drop': 'Arrastrar y soltar', kanban: 'Tablero kanban',
    'theme-context': 'Contexto de tema', 'language-context': 'Contexto de idioma',
    'custom-hook': 'Hook personalizado', router: 'Router', 'use-reducer': 'useReducer',
    memoization: 'Memoización',
  },
}

export default function Sandboxes() {
  const { t, lang } = useLang()
  return (
    <div>
      <PageHeader
        title={t('nav.sandboxes')}
        subtitle={
          lang === 'es'
            ? 'Pequeños sandboxes editables: ábrelos, modifícalos y observa.'
            : 'Small editable sandboxes: open them, modify them, observe.'
        }
        icon={Boxes}
      />
      <Callout type="info" title={t('common.comingSoon')}>
        {lang === 'es'
          ? 'Los sandboxes interactivos llegan en la Fase 8. Mientras tanto, experimenta en el '
          : 'Interactive sandboxes arrive in Phase 8. Meanwhile, experiment in the '}
        <Link to="/playground" className="text-[var(--accent)] underline">
          {t('nav.playground')}
        </Link>
        .
      </Callout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {SANDBOXES.map((id, i) => (
          <div key={id} className="card p-5 opacity-70">
            <p className="text-xs font-bold text-[var(--faint)]">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="font-bold text-[var(--text-strong)]">{NAMES[lang][id]}</h3>
            <p className="text-xs text-[var(--faint)] mt-1 mono">sandbox/{id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
