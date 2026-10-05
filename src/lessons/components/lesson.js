// Lesson: components (Module 2).
export default {
  id: 'lesson-components',
  moduleId: 'components',
  order: 1,
  title: { en: 'Components: small pieces, big UIs', es: 'Componentes: piezas pequeñas, UIs grandes' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### What is a component?\n\nA component is a **reusable piece of UI**: a JavaScript function that returns what should appear on screen. Instead of one giant HTML file, you split the page into named pieces — `Navbar`, `Card`, `Button` — and compose them like LEGO bricks.',
        es: '### ¿Qué es un componente?\n\nUn componente es una **pieza reutilizable de UI**: una función JavaScript que devuelve lo que debe aparecer en pantalla. En lugar de un fichero HTML gigante, divides la página en piezas con nombre — `Navbar`, `Card`, `Button` — y las compones como piezas de LEGO.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: '// A function component: function in, UI out\nfunction Welcome() {\n  return <h1>Hello, React!</h1>;\n}',
    },
    {
      kind: 'text',
      body: {
        en: '### Function components\n\nModern React uses **function components** — plain functions whose name starts with a capital letter. React calls them, takes the returned UI description, and puts it on screen. When data changes, React calls them **again** (that re-execution is called a *render*).',
        es: '### Componentes de función\n\nEl React moderno usa **componentes de función**: funciones normales cuyo nombre empieza en mayúscula. React las llama, toma la descripción de UI devuelta y la pone en pantalla. Cuando los datos cambian, React las vuelve a llamar (esa re-ejecución se llama *render*).',
      },
    },
    {
      kind: 'callout',
      type: 'warn',
      text: {
        en: 'Capital letter matters: <button> is an HTML tag, <Button> is your component. React tells them apart by that first letter.',
        es: 'La mayúscula importa: <button> es una etiqueta HTML, <Button> es tu componente. React los distingue por esa primera letra.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### Reusability\n\nWrite it once, use it everywhere. The same `Button` component can appear in a form, a card and a modal — each usage (called an **instance**) can receive different data through props.',
        es: '### Reutilización\n\nEscríbelo una vez, úsalo en todas partes. El mismo componente `Button` puede aparecer en un formulario, una tarjeta y un modal; cada uso (llamado **instancia**) puede recibir datos distintos mediante props.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: 'function App() {\n  return (\n    <>\n      <Button label="Save" />\n      <Button label="Cancel" />\n      <Button label="Delete" />\n    </>\n  );\n}',
    },
    {
      kind: 'text',
      body: {
        en: '### Composition and hierarchy\n\nComponents nest inside each other, forming a **component tree**. `App` renders `Header` and `Main`; `Main` renders `Card`s; each `Card` renders a `Button`. Data flows down this tree; events bubble up through callbacks.',
        es: '### Composición y jerarquía\n\nLos componentes se anidan unos dentro de otros formando un **árbol de componentes**. `App` renderiza `Header` y `Main`; `Main` renderiza `Card`s; cada `Card` renderiza un `Button`. Los datos bajan por este árbol; los eventos suben mediante callbacks.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: '// The component tree behind a page\n<App>\n  <Navbar />\n  <Header />\n  <Card>\n    <Button />\n  </Card>\n  <Footer />\n</App>',
    },
    {
      kind: 'text',
      body: {
        en: '### Thinking in components\n\nThe React skill that matters most is **decomposition**: looking at a design and seeing the pieces. Ask three questions: *what repeats?* (→ reusable component), *what belongs together?* (→ one component), *what changes independently?* (→ separate component).',
        es: '### Pensar en componentes\n\nLa habilidad React que más importa es la **descomposición**: mirar un diseño y ver las piezas. Hazte tres preguntas: *¿qué se repite?* (→ componente reutilizable), *¿qué va junto?* (→ un componente), *¿qué cambia por separado?* (→ componente aparte).',
      },
    },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: 'In the Component Builder lab you will assemble a page from pieces yourself — and watch the component tree grow as you build.',
        es: 'En el laboratorio Component Builder montarás tú mismo una página con piezas, y verás crecer el árbol de componentes mientras construyes.',
      },
    },
    { kind: 'labref', labId: 'component-builder' },
  ],
}
