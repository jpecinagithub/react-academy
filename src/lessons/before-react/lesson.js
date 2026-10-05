// Lesson: what React assumes you already know (Module 0).
// Short prerequisites map — each item is 2-3 lines + code, ending in the
// readiness-check lab.
export default {
  id: 'lesson-before-react',
  moduleId: 'before-react',
  order: 1,
  title: { en: 'What React assumes you know', es: 'Lo que React da por sabido' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### React is JavaScript doing UI\n\nReact does not teach you JavaScript — it **assumes** it. Almost everything in React is plain JavaScript: functions that return values, arrays transformed with `map`, and objects passed around as data.\n\nIf the six ideas below feel familiar, you are ready. If any feels new, pause on it — React will be ten times easier afterwards.',
        es: '### React es JavaScript haciendo UI\n\nReact no te enseña JavaScript: **lo da por sabido**. Casi todo en React es JavaScript puro: funciones que devuelven valores, arrays transformados con `map` y objetos que viajan como datos.\n\nSi las seis ideas de abajo te resultan familiares, estás listo. Si alguna es nueva, detente en ella: React será diez veces más fácil después.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### 1. Expressions and functions\n\nReact components **are functions**. They take inputs and return what the UI should look like. Arrow functions are the usual syntax.',
        es: '### 1. Expresiones y funciones\n\nLos componentes de React **son funciones**. Reciben entradas y devuelven cómo debe verse la UI. Las arrow functions son la sintaxis habitual.',
      },
    },
    {
      kind: 'code',
      lang: 'js',
      code: 'const double = (n) => n * 2;\ndouble(4); // 8',
    },
    {
      kind: 'text',
      body: {
        en: '### 2. `map()` turns arrays into lists\n\nThis is the single most-used JavaScript method in React. `map` transforms every item of an array — React uses it to render lists of elements.',
        es: '### 2. `map()` convierte arrays en listas\n\nEs el método de JavaScript más usado en React. `map` transforma cada elemento de un array; React lo usa para renderizar listas de elementos.',
      },
    },
    {
      kind: 'code',
      lang: 'js',
      code: 'const names = ["Ada", "Jon", "Mara"];\nconst items = names.map((n) => `<li>${n}</li>`);\n// ["<li>Ada</li>", "<li>Jon</li>", "<li>Mara</li>"]',
    },
    {
      kind: 'text',
      body: {
        en: '### 3. Destructuring unpacks objects\n\nProps and state arrive as objects. Destructuring pulls out exactly the fields you need, in one line.',
        es: '### 3. Destructuring desempaqueta objetos\n\nLas props y el estado llegan como objetos. Destructuring extrae justo los campos que necesitas, en una línea.',
      },
    },
    {
      kind: 'code',
      lang: 'js',
      code: 'const user = { name: "Ada", age: 36, role: "Dev" };\nconst { name, role } = user;\n// name === "Ada", role === "Dev"',
    },
    {
      kind: 'text',
      body: {
        en: '### 4. Callbacks: functions passed as arguments\n\nEvent handlers in React are callbacks: you hand a function to `onClick`, and React calls it later when the user clicks.',
        es: '### 4. Callbacks: funciones pasadas como argumentos\n\nLos manejadores de eventos en React son callbacks: entregas una función a `onClick` y React la llama más tarde, cuando el usuario hace clic.',
      },
    },
    {
      kind: 'code',
      lang: 'js',
      code: 'button.addEventListener("click", () => {\n  console.log("clicked!");\n});',
    },
    {
      kind: 'text',
      body: {
        en: '### 5. Spread copies (immutability)\n\nReact state must be replaced, not mutated. The spread operator `...` creates fresh copies of arrays and objects with changes applied.',
        es: '### 5. Spread copia (inmutabilidad)\n\nEl estado en React se reemplaza, no se muta. El operador spread `...` crea copias nuevas de arrays y objetos con los cambios aplicados.',
      },
    },
    {
      kind: 'code',
      lang: 'js',
      code: 'const user = { name: "Ada", age: 36 };\nconst older = { ...user, age: 37 };\n// user is untouched; older is a new object',
    },
    {
      kind: 'text',
      body: {
        en: '### 6. Modules: `import` / `export`\n\nReact apps are split into files. Each file exports components and imports what it needs from others.',
        es: '### 6. Módulos: `import` / `export`\n\nLas apps React se dividen en ficheros. Cada fichero exporta componentes e importa lo que necesita de otros.',
      },
    },
    {
      kind: 'code',
      lang: 'js',
      code: '// Button.jsx\nexport function Button() { /* ... */ }\n\n// App.jsx\nimport { Button } from "./Button.jsx";',
    },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: 'You do not need async/await, classes, or the DOM API memorized. You need to *read* small functions, *transform* arrays with map, and *pass* functions around. That is the whole foundation.',
        es: 'No necesitas memorizar async/await, clases ni la API del DOM. Necesitas *leer* funciones pequeñas, *transformar* arrays con map y *pasar* funciones como argumentos. Esa es toda la base.',
      },
    },
    { kind: 'labref', labId: 'readiness-check' },
  ],
}
