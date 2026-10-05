// Lesson: JSX (Module 3).
export default {
  id: 'lesson-jsx',
  moduleId: 'jsx',
  order: 1,
  title: { en: 'JSX: JavaScript inside markup', es: 'JSX: JavaScript dentro del marcado' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### What is JSX?\n\nJSX lets you write **HTML-like code inside JavaScript**. It looks like markup, but it is JavaScript: React (via the build step) converts every tag into a `React.createElement(...)` call that describes a UI element.',
        es: '### ¿Qué es JSX?\n\nJSX permite escribir **código parecido a HTML dentro de JavaScript**. Parece marcado, pero es JavaScript: React (en el paso de compilación) convierte cada etiqueta en una llamada `React.createElement(...)` que describe un elemento de UI.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: '// What you write\nconst el = <h1 className="title">Hello</h1>;\n\n// What React understands\nconst el = React.createElement("h1", { className: "title" }, "Hello");',
    },
    {
      kind: 'text',
      body: {
        en: '### JavaScript inside JSX: curly braces\n\nAnything inside `{ }` is evaluated as JavaScript: variables, function calls, arithmetic, ternaries. This is how dynamic data reaches the screen.',
        es: '### JavaScript dentro de JSX: llaves\n\nTodo lo que va entre `{ }` se evalúa como JavaScript: variables, llamadas a funciones, aritmética, ternarios. Así es como los datos dinámicos llegan a la pantalla.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: 'const name = "Jon";\nconst unread = 3;\n\n<h1>Hello {name}!</h1>\n<p>You have {unread * 2} messages.</p>\n<p>{unread > 0 ? "Inbox full" : "All clear"}</p>',
    },
    {
      kind: 'text',
      body: {
        en: '### Attributes and `className`\n\nJSX attributes look like HTML attributes, with two famous exceptions: `class` becomes **`className`** (because `class` is a reserved word in JavaScript) and `for` becomes **`htmlFor`**. Event handlers use camelCase: `onClick`, `onChange`.',
        es: '### Atributos y `className`\n\nLos atributos JSX parecen atributos HTML, con dos excepciones famosas: `class` se convierte en **`className`** (porque `class` es palabra reservada en JavaScript) y `for` en **`htmlFor`**. Los manejadores de eventos usan camelCase: `onClick`, `onChange`.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: '<button className="primary" onClick={handleSave}>\n  Save\n</button>',
    },
    {
      kind: 'text',
      body: {
        en: '### Fragments: one root, no extra div\n\nJSX expressions must return **a single root element**. When you do not want a wrapper `<div>` polluting the DOM, use a **fragment** `<>...</>`: it groups children without adding any element.',
        es: '### Fragmentos: una raíz, sin div extra\n\nLas expresiones JSX deben devolver **un único elemento raíz**. Cuando no quieres que un `<div>` envolvente ensucie el DOM, usa un **fragmento** `<>...</>`: agrupa hijos sin añadir ningún elemento.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: 'function App() {\n  return (\n    <>\n      <h1>Title</h1>\n      <p>No wrapper div needed.</p>\n    </>\n  );\n}',
    },
    {
      kind: 'callout',
      type: 'warn',
      text: {
        en: 'The 4 JSX rules to tattoo on your brain: (1) a single root element (or fragment), (2) `{ }` for any JavaScript, (3) `className` instead of `class`, (4) self-close tags with `/>` like `<img />` and `<br />`.',
        es: 'Las 4 reglas JSX para tatuarte: (1) un único elemento raíz (o fragmento), (2) `{ }` para cualquier JavaScript, (3) `className` en vez de `class`, (4) autocierra etiquetas con `/>` como `<img />` y `<br />`.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### Try it live\n\nTwo labs wait for you: the **JSX Translator** shows what React actually sees when you write JSX (the `createElement` calls and the element tree), and the **JSX Playground** gives you a live editor with instant preview.',
        es: '### Pruébalo en vivo\n\nTe esperan dos laboratorios: el **Traductor JSX** muestra lo que React ve realmente cuando escribes JSX (las llamadas `createElement` y el árbol de elementos), y el **Playground JSX** te da un editor en vivo con vista previa instantánea.',
      },
    },
    { kind: 'labref', labId: 'jsx-translator' },
    { kind: 'labref', labId: 'jsx-playground' },
  ],
}
