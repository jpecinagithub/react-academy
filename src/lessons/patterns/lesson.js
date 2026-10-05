export default {
  id: 'lesson-patterns',
  moduleId: 'patterns',
  order: 1,
  title: { en: 'Patterns: custom hooks, composition & routing', es: 'Patrones: custom hooks, composición y routing' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### Custom hooks\n\nA **custom hook** extracts reusable **stateful logic** into a plain function that starts with `use`.\n\nIt holds no UI — it returns data and callbacks. Two components using the same hook each get their **own independent state**.',
        es: '### Custom hooks\n\nUn **custom hook** extrae la **lógica con estado** reutilizable en una función que empieza por `use`.\n\nNo contiene UI — devuelve datos y callbacks. Dos componentes que usan el mismo hook tienen su **propio estado independiente**.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: "function useToggle(initial = false) {\n  const [on, setOn] = useState(initial)\n  const toggle = () => setOn((v) => !v)\n  return [on, toggle]   // same shape as useState\n}\n\nfunction Light() {\n  const [on, toggle] = useToggle()\n  return <button onClick={toggle}>{on ? 'On' : 'Off'}</button>\n}",
    },
    {
      kind: 'text',
      body: {
        en: '### Composition\n\nInstead of drilling config props down, pass elements through the **`children` prop**. Build **layout components** once and drop any page inside them.\n\nComposition keeps parents flexible: the parent does not need to know what it renders.',
        es: '### Composición\n\nEn vez de taladrar props de configuración, pasa elementos mediante la **prop `children`**. Construye **componentes de layout** una vez y mete cualquier página dentro.\n\nLa composición mantiene flexibles a los padres: el padre no necesita saber qué renderiza.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: "function Layout({ children }) {\n  return (\n    <div className=\"page\">\n      <header>My App</header>\n      <main>{children}</main>\n    </div>\n  )\n}\n\nfunction DashboardPage() {\n  return (\n    <Layout>\n      <Page />   // Page knows nothing about the layout\n    </Layout>\n  )\n}",
    },
    {
      kind: 'text',
      body: {
        en: '### Routing: the SPA idea\n\nA **single-page app** loads one page. A **router** maps the URL to a component and swaps it in — **no full reload**.\n\nClicking a link changes the URL and the visible screen, but the app keeps its state.',
        es: '### Routing: la idea de la SPA\n\nUna **single-page app** carga una sola página. Un **router** mapea la URL a un componente y lo intercambia — **sin recargar la página**.\n\nAl hacer clic en un enlace cambian la URL y la pantalla visible, pero la app conserva su estado.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: "function App() {\n  return (\n    <Routes>\n      <Route path=\"/\" element={<Home />} />\n      <Route path=\"/about\" element={<About />} />\n      <Route path=\"/users/:id\" element={<Profile />} />\n    </Routes>\n  )\n}",
    },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: '**Composition over configuration.** Put logic in hooks, UI in components, and structure in composition. Reach for context and routing only when the app genuinely needs shared data or multiple screens.',
        es: '**Composición antes que configuración.** Pon la lógica en hooks, la UI en componentes y la estructura en composición. Usa contexto y routing solo cuando la app necesite de verdad datos compartidos o múltiples pantallas.',
      },
    },
    { kind: 'labref', labId: 'custom-hooks-builder' },
    { kind: 'labref', labId: 'router-sim' },
    {
      kind: 'checklist',
      items: [
        {
          en: 'I can write a custom hook that extracts stateful logic from a component.',
          es: 'Sé escribir un custom hook que extraiga la lógica con estado de un componente.',
        },
        {
          en: 'I can use children to compose layouts instead of drilling config props.',
          es: 'Sé usar children para componer layouts en vez de taladrar props de configuración.',
        },
        {
          en: 'I can explain how a router maps a URL to a component without reloading the page.',
          es: 'Sé explicar cómo un router mapea una URL a un componente sin recargar la página.',
        },
      ],
    },
  ],
}
