export default {
  id: 'lesson-context',
  moduleId: 'context',
  order: 1,
  title: { en: 'Context: sharing data without prop drilling', es: 'Context: compartir datos sin prop drilling' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### The prop drilling problem\n\nSometimes data is needed deep in the tree. To reach it, **every intermediate component must forward the prop** — even components that never use it.\n\nThat chain is called **prop drilling**. It makes refactors painful: add one level, and every component in between changes.',
        es: '### El problema del prop drilling\n\nA veces un dato se necesita en lo profundo del árbol. Para llegar allí, **cada componente intermedio debe reenviar la prop** — incluso los que nunca la usan.\n\nEsa cadena se llama **prop drilling**. Hace dolorosas las refactorizaciones: añade un nivel y cada componente intermedio cambia.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: "function App() {\n  const user = { name: 'Ada' }\n  return <Layout user={user} />   // Layout doesn't use user\n}\n\nfunction Layout({ user }) {\n  return <Dashboard user={user} /> // Dashboard doesn't use user either\n}\n\nfunction Dashboard({ user }) {\n  return <Avatar user={user} />    // only Avatar uses it\n}",
    },
    {
      kind: 'text',
      body: {
        en: '### Context in 3 steps\n\n**1. Create** a context with `createContext(defaultValue)`.\n\n**2. Provide** a value near the top of the tree with `<MyContext.Provider value={...}>`.\n\n**3. Consume** it anywhere below with `useContext(MyContext)` — no props needed in between.',
        es: '### Context en 3 pasos\n\n**1. Crea** un contexto con `createContext(defaultValue)`.\n\n**2. Provee** un valor cerca de la raíz del árbol con `<MyContext.Provider value={...}>`.\n\n**3. Consume** el valor en cualquier componente de abajo con `useContext(MyContext)` — sin props intermedias.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: "const UserContext = createContext(null)\n\nfunction App() {\n  const user = { name: 'Ada' }\n  return (\n    <UserContext.Provider value={user}>\n      <Layout />   // no user prop needed\n    </UserContext.Provider>\n  )\n}\n\nfunction Layout() {\n  return <Dashboard />\n}\n\nfunction Dashboard() {\n  const user = useContext(UserContext)\n  return <Avatar name={user.name} />\n}",
    },
    {
      kind: 'callout',
      type: 'warn',
      text: {
        en: '**When NOT to use context.** Props remain the default for direct parent → child communication. Overusing context couples components to a specific tree and hurts reuse. Do not use it for everything.',
        es: '**Cuándo NO usar context.** Las props siguen siendo la opción por defecto para la comunicación directa padre → hijo. Abusar del contexto acopla los componentes a un árbol concreto y dificulta reutilizarlos. No lo uses para todo.',
      },
    },
    {
      kind: 'flow',
      steps: [
        {
          label: { en: 'Provider value set', es: 'Valor del Provider' },
          desc: { en: 'The Provider receives a value prop at the top of the tree.', es: 'El Provider recibe una prop value cerca de la raíz del árbol.' },
        },
        {
          label: { en: 'Consumers subscribe', es: 'Los consumidores se suscriben' },
          desc: { en: 'Components below call useContext(MyContext) to read it.', es: 'Los componentes de abajo llaman a useContext(MyContext) para leerlo.' },
        },
        {
          label: { en: 'Value changes', es: 'El valor cambia' },
          desc: { en: 'When the Provider re-renders with a new value, React notifies subscribers.', es: 'Cuando el Provider se re-renderiza con un nuevo valor, React avisa a los suscriptores.' },
        },
        {
          label: { en: 'Consumers re-render', es: 'Los consumidores se re-renderizan' },
          desc: { en: 'Every subscribed component re-renders with the new value. Intermediate components skip untouched.', es: 'Cada componente suscrito se re-renderiza con el nuevo valor. Los intermedios quedan intactos.' },
        },
      ],
    },
    { kind: 'labref', labId: 'context-lab' },
    {
      kind: 'checklist',
      items: [
        {
          en: 'I can explain why prop drilling makes deep trees hard to change.',
          es: 'Puedo explicar por qué el prop drilling dificulta cambiar árboles profundos.',
        },
        {
          en: 'I can wire up createContext, Provider and useContext from memory.',
          es: 'Sé conectar createContext, Provider y useContext de memoria.',
        },
        {
          en: 'I can say when context is the wrong tool and props are better.',
          es: 'Sé decir cuándo el contexto es la herramienta equivocada y las props son mejores.',
        },
      ],
    },
  ],
}
