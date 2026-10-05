// Module registry — the single source of truth for the curriculum.
// Later phases add labs/lessons/quizzes per module; this file defines order,
// icons (lucide component names as strings), difficulty and bilingual titles.
// Route for each module: /module/<id>
export const MODULES = [
  {
    id: 'before-react',
    order: 0,
    icon: 'Rocket',
    difficulty: 'beginner',
    path: '/module/before-react',
    title: { en: 'Before React', es: 'Antes de React' },
    blurb: {
      en: 'HTML, CSS, JS, DOM, events and functions — a React readiness check.',
      es: 'HTML, CSS, JS, DOM, eventos y funciones: un chequeo de preparación.',
    },
  },
  {
    id: 'why-react',
    order: 1,
    icon: 'HelpCircle',
    difficulty: 'beginner',
    path: '/module/why-react',
    title: { en: 'Why React?', es: '¿Por qué React?' },
    blurb: {
      en: 'Imperative vs declarative: vanilla JS side-by-side with React.',
      es: 'Imperativo vs declarativo: JavaScript puro frente a React.',
    },
  },
  {
    id: 'components',
    order: 2,
    icon: 'Boxes',
    difficulty: 'beginner',
    path: '/module/components',
    title: { en: 'Components', es: 'Componentes' },
    blurb: {
      en: 'Break big UIs into small reusable pieces. Component Builder included.',
      es: 'Divide interfaces grandes en piezas reutilizables. Con Component Builder.',
    },
  },
  {
    id: 'jsx',
    order: 3,
    icon: 'Code2',
    difficulty: 'beginner',
    path: '/module/jsx',
    title: { en: 'JSX', es: 'JSX' },
    blurb: {
      en: 'JavaScript inside markup: expressions, attributes and the JSX translator.',
      es: 'JavaScript dentro del marcado: expresiones, atributos y el traductor JSX.',
    },
  },
  {
    id: 'props',
    order: 4,
    icon: 'ArrowDownToLine',
    difficulty: 'beginner',
    path: '/module/props',
    title: { en: 'Props', es: 'Props' },
    blurb: {
      en: 'Data flows down from parent to child. Props Lab with live editing.',
      es: 'Los datos bajan del padre al hijo. Props Lab con edición en vivo.',
    },
  },
  {
    id: 'state',
    order: 5,
    icon: 'Database',
    difficulty: 'beginner',
    path: '/module/state',
    title: { en: 'State', es: 'Estado' },
    blurb: {
      en: 'useState visualized: event → setState → render → updated UI.',
      es: 'useState visualizado: evento → setState → render → UI actualizada.',
    },
  },
  {
    id: 'rendering',
    order: 6,
    icon: 'RefreshCw',
    difficulty: 'beginner',
    path: '/module/rendering',
    title: { en: 'Rendering', es: 'Renderizado' },
    blurb: {
      en: 'Components are functions React re-executes. Watch renders happen.',
      es: 'Los componentes son funciones que React reejecuta. Observa los renders.',
    },
  },
  {
    id: 'events',
    order: 7,
    icon: 'MousePointerClick',
    difficulty: 'beginner',
    path: '/module/events',
    title: { en: 'Events', es: 'Eventos' },
    blurb: {
      en: 'onClick, onChange, onSubmit: the full event → render flow.',
      es: 'onClick, onChange, onSubmit: el flujo completo evento → render.',
    },
  },
  {
    id: 'conditional-lists',
    order: 8,
    icon: 'ListChecks',
    difficulty: 'beginner',
    path: '/module/conditional-lists',
    title: { en: 'Conditionals & Lists', es: 'Condicionales y listas' },
    blurb: {
      en: 'Branching UIs and why keys matter for list reconciliation.',
      es: 'Interfaces ramificadas y por qué las keys importan en las listas.',
    },
  },
  {
    id: 'forms',
    order: 9,
    icon: 'FormInput',
    difficulty: 'beginner',
    path: '/module/forms',
    title: { en: 'Forms', es: 'Formularios' },
    blurb: {
      en: 'Controlled inputs: every keystroke as state, visualized live.',
      es: 'Inputs controlados: cada pulsación como estado, en vivo.',
    },
  },
  {
    id: 'effects',
    order: 10,
    icon: 'Zap',
    difficulty: 'intermediate',
    path: '/module/effects',
    title: { en: 'useEffect & Lifecycle', es: 'useEffect y ciclo de vida' },
    blurb: {
      en: 'When effects run, cleanup, mount/update/unmount — made visual.',
      es: 'Cuándo se ejecutan los efectos, limpieza, montaje y desmontaje.',
    },
  },
  {
    id: 'data',
    order: 11,
    icon: 'CloudDownload',
    difficulty: 'intermediate',
    path: '/module/data',
    title: { en: 'Data Fetching', es: 'Carga de datos' },
    blurb: {
      en: 'Loading, success, error: simulate latency and failures.',
      es: 'Cargando, éxito, error: simula latencia y fallos.',
    },
  },
  {
    id: 'hooks',
    order: 12,
    icon: 'Anchor',
    difficulty: 'intermediate',
    path: '/module/hooks',
    title: { en: 'Hooks Deep Dive', es: 'Hooks a fondo' },
    blurb: {
      en: 'useRef, useMemo, useCallback, batching, closures and immutability labs.',
      es: 'useRef, useMemo, useCallback, batching, closures e inmutabilidad.',
    },
  },
  {
    id: 'context',
    order: 13,
    icon: 'Network',
    difficulty: 'intermediate',
    path: '/module/context',
    title: { en: 'Context & Prop Drilling', es: 'Context y prop drilling' },
    blurb: {
      en: 'Watch props travel down the tree, then eliminate drilling with Context.',
      es: 'Mira las props bajar por el árbol y elimina el drilling con Context.',
    },
  },
  {
    id: 'patterns',
    order: 14,
    icon: 'Puzzle',
    difficulty: 'intermediate',
    path: '/module/patterns',
    title: { en: 'Patterns & Custom Hooks', es: 'Patrones y custom hooks' },
    blurb: {
      en: 'Lifting state up, composition, custom hooks and the React Router simulator.',
      es: 'Elevar el estado, composición, custom hooks y simulador de Router.',
    },
  },
  {
    id: 'internals',
    order: 15,
    icon: 'Cpu',
    difficulty: 'advanced',
    path: '/module/internals',
    title: { en: 'Internals: VDOM & Reconciliation', es: 'Internos: VDOM y reconciliación' },
    blurb: {
      en: 'Virtual DOM diffing and reconciliation, visualized honestly.',
      es: 'Diffing del Virtual DOM y reconciliación, visualizados con rigor.',
    },
  },
  {
    id: 'tools',
    order: 16,
    icon: 'Wrench',
    difficulty: 'intermediate',
    path: '/module/tools',
    title: { en: 'DevTools & Profiler', es: 'DevTools y profiler' },
    blurb: {
      en: 'Inspect components, props, state and renders with our own tools.',
      es: 'Inspecciona componentes, props, estado y renders con nuestras herramientas.',
    },
  },
  {
    id: 'thinking',
    order: 17,
    icon: 'Brain',
    difficulty: 'intermediate',
    path: '/module/thinking',
    title: { en: 'Thinking in React', es: 'Pensar en React' },
    blurb: {
      en: 'The mental model: data down, events up, and where state should live.',
      es: 'El modelo mental: datos abajo, eventos arriba y dónde vive el estado.',
    },
  },
]

export function getModule(id) {
  return MODULES.find((m) => m.id === id)
}
