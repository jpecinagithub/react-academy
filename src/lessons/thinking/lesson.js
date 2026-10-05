// Lesson: thinking — Thinking in React, one-way data flow, lifting state up,
// presentational vs container (modern framing).
export default {
  id: 'lesson-thinking',
  moduleId: 'thinking',
  order: 1,
  title: { en: 'Thinking in React', es: 'Pensar en React' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'React is a way of **thinking** before it is a library. The official React docs teach it as a five-step design flow you can apply to any UI, from a button to a dashboard:\n\n### The five steps\n\n1. **Look at the UI** — start from a mock, a screenshot, a sketch.\n2. **Break it into components** — draw boxes around the pieces.\n3. **Define the state** — list the minimal data that changes over time.\n4. **Decide where state lives** — the closest common ancestor of everyone who needs it.\n5. **Wire props down, events up** — data flows down, callbacks communicate upward.\n\nSteps 1–3 are design; steps 4–5 are where most bugs are born — and where this module’s games train you.',
        es: 'React es una forma de **pensar** antes que una librería. La documentación oficial de React lo enseña como un flujo de diseño en cinco pasos aplicable a cualquier UI, desde un botón hasta un dashboard:\n\n### Los cinco pasos\n\n1. **Mira la UI**: parte de un mock, una captura, un boceto.\n2. **Divídela en componentes**: dibuja cajas alrededor de las piezas.\n3. **Define el estado**: lista los datos mínimos que cambian con el tiempo.\n4. **Decide dónde vive el estado**: el ancestro común más cercano de quienes lo necesiten.\n5. **Conecta props abajo, eventos arriba**: los datos bajan, los callbacks se comunican hacia arriba.\n\nLos pasos 1–3 son diseño; los pasos 4–5 son donde nacen la mayoría de los bugs, y donde te entrenan los juegos de este módulo.',
      },
    },
    {
      kind: 'flow',
      steps: [
        { label: { en: 'UI', es: 'UI' }, desc: { en: 'the mock', es: 'el mock' } },
        { label: { en: 'Components', es: 'Componentes' }, desc: { en: 'draw the boxes', es: 'dibuja las cajas' } },
        { label: { en: 'State', es: 'Estado' }, desc: { en: 'minimal changing data', es: 'datos mínimos que cambian' } },
        { label: { en: 'State home', es: 'Hogar del estado' }, desc: { en: 'closest common ancestor', es: 'ancestro común más cercano' } },
        { label: { en: 'Props ↓ events ↑', es: 'Props ↓ eventos ↑' } },
      ],
    },
    {
      kind: 'text',
      body: {
        en: '### One-way data flow\n\nState lives in **one** component. That component passes values **down** as props. Children that want change call **callbacks** the parent passed down. Nothing ever flows up by itself.\n\nThis single rule is why React UIs stay predictable: to understand any piece of UI, you only need to look at its props and the state above it — never at some distant component mutating things behind your back.',
        es: '### Flujo de datos unidireccional\n\nEl estado vive en **un** componente. Ese componente pasa valores **hacia abajo** como props. Los hijos que quieren cambios llaman a **callbacks** que el padre les pasó. Nada fluye hacia arriba por sí solo.\n\nEsta única regla es la que mantiene predecibles las UIs de React: para entender cualquier pieza de UI solo necesitas mirar sus props y el estado que tiene encima, nunca un componente lejano mutando cosas a tus espaldas.',
      },
    },
    { kind: 'labref', labId: 'data-flow' },
    {
      kind: 'text',
      body: {
        en: '### Lifting state up\n\nWhen two siblings need the same data, the state moves to their **closest common parent**, which passes it down to both. That move has a name: *lifting state up*.\n\nBut there is a second half to the rule that beginners miss: **do not lift higher than necessary**. State in `App` that only a form uses will re-render the whole app on every keystroke. The home of a piece of state is the *lowest* component that is still an ancestor of everyone who needs it.',
        es: '### Elevar el estado (lifting state up)\n\nCuando dos hermanos necesitan los mismos datos, el estado se mueve a su **padre común más cercano**, que se lo pasa a ambos. Ese movimiento tiene nombre: *lifting state up*.\n\nPero hay una segunda mitad de la regla que los principiantes pasan por alto: **no eleves más de lo necesario**. Un estado en `App` que solo usa un formulario re-renderizará toda la app con cada tecla. El hogar de un estado es el componente *más bajo* que siga siendo ancestro de todos los que lo necesitan.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `// ❌ too high: every keystroke re-renders the whole app
function App() {
  const [draft, setDraft] = useState('');
  return <><Header /><SignupForm draft={draft} setDraft={setDraft} /></>;
}

// ✅ as low as possible: only the form re-renders
function App() {
  return <><Header /><SignupForm /></>;
}
function SignupForm() {
  const [draft, setDraft] = useState('');
  return <><NameInput draft={draft} setDraft={setDraft} /><LivePreview draft={draft} /></>;
}`,
    },
    {
      kind: 'text',
      body: {
        en: '### Presentational vs container — a modern framing\n\nYou may meet the old terms *presentational* and *container* components. The modern version of the idea is simpler: separate **what things look like** from **where the state lives**.\n\n- **Presentational pieces** (`<ProductCard />`, `<Button />`): receive props, render UI, call callbacks. Easy to reuse, easy to test.\n- **State owners** (`<Dashboard />`, `<SignupForm />`): hold state, pass props down, handle events coming up.\n\nYou do not need a strict architecture or special folders — just the habit of asking, for every component: *does this need to own state, or just receive props?*',
        es: '### Presentacional vs contenedor: una visión moderna\n\nQuizá encuentres los términos clásicos *presentational* y *container*. La versión moderna de la idea es más simple: separa **cómo se ven las cosas** de **dónde vive el estado**.\n\n- **Piezas de presentación** (`<ProductCard />`, `<Button />`): reciben props, renderizan UI, llaman a callbacks. Fáciles de reutilizar y de probar.\n- **Dueños del estado** (`<Dashboard />`, `<SignupForm />`): guardan el estado, pasan props hacia abajo, gestionan los eventos que suben.\n\nNo necesitas una arquitectura estricta ni carpetas especiales, solo el hábito de preguntar ante cada componente: *¿esto necesita poseer estado o basta con recibir props?*',
      },
    },
    { kind: 'labref', labId: 'thinking-lab' },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: 'The whole mental model in one sentence: break the UI into components, put each piece of state in its lowest common ancestor, pass data down as props and changes up as events.',
        es: 'Todo el modelo mental en una frase: divide la UI en componentes, coloca cada estado en su ancestro común más bajo, pasa los datos abajo como props y los cambios arriba como eventos.',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'I can apply the 5-step Thinking in React flow to a mock', es: 'Sé aplicar el flujo de 5 pasos a un mock' },
        { en: 'I can explain one-way data flow: props down, events up', es: 'Sé explicar el flujo unidireccional: props abajo, eventos arriba' },
        { en: 'I place state at the closest common ancestor — no higher', es: 'Coloco el estado en el ancestro común más cercano, ni más alto' },
        { en: 'I separate presentational pieces from state owners', es: 'Separo las piezas de presentación de los dueños del estado' },
      ],
    },
  ],
}
