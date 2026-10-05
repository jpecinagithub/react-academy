// Lesson: the problem React solves (Module 1).
export default {
  id: 'lesson-why-react',
  moduleId: 'why-react',
  order: 1,
  title: { en: 'The problem React solves', es: 'El problema que React resuelve' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### UIs used to be updated by hand\n\nBefore React, keeping a page in sync meant **imperative** DOM code: find the element, change its text, toggle a class, update the counter somewhere else, remember to clear the input… Every new feature added more manual steps, and forgetting one meant a bug.',
        es: '### Antes las UIs se actualizaban a mano\n\nAntes de React, mantener una página sincronizada exigía código DOM **imperativo**: buscar el elemento, cambiar su texto, alternar una clase, actualizar el contador en otro sitio, acordarse de limpiar el input… Cada funcionalidad añadía más pasos manuales, y olvidar uno era un bug.',
      },
    },
    {
      kind: 'code',
      lang: 'js',
      code: '// The old way: you describe HOW to update the UI\nconst el = document.querySelector("#count");\nel.textContent = String(count + 1);\ndocument.querySelector("#status").textContent = "updated";\ninput.value = ""; // don\'t forget!',
    },
    {
      kind: 'text',
      body: {
        en: '### React flips it: describe WHAT, not HOW\n\nWith React you describe **what the UI should look like for a given state**, and React figures out how to update the DOM. This is **declarative** programming — and it is the core idea of the whole library.',
        es: '### React le da la vuelta: describe QUÉ, no CÓMO\n\nCon React describes **cómo debe verse la UI para un estado dado**, y React se encarga de actualizar el DOM. Esto es programación **declarativa**, y es la idea central de toda la librería.',
      },
    },
    {
      kind: 'flow',
      steps: [
        {
          label: { en: 'Imperative', es: 'Imperativo' },
          desc: {
            en: 'find element → change it → change another → hope you got them all',
            es: 'busca el elemento → cámbialo → cambia otro → cruza los dedos',
          },
        },
        {
          label: { en: 'Declarative', es: 'Declarativo' },
          desc: {
            en: 'state changes → React renders the UI that matches',
            es: 'el estado cambia → React renderiza la UI correspondiente',
          },
        },
      ],
    },
    {
      kind: 'text',
      body: {
        en: '### UI as components\n\nReact apps are built from **components**: small, reusable pieces (a button, a card, a navbar) composed into bigger ones. Each component owns a slice of the UI and the data (state) it needs.',
        es: '### La UI como componentes\n\nLas apps React se construyen con **componentes**: piezas pequeñas y reutilizables (un botón, una tarjeta, una barra de navegación) compuestas en piezas mayores. Cada componente posee una porción de la UI y los datos (estado) que necesita.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: 'function App() {\n  return (\n    <>\n      <Navbar />\n      <ProductList />\n      <Footer />\n    </>\n  );\n}',
    },
    {
      kind: 'text',
      body: {
        en: '### Single Page Applications\n\nA React app is usually a **Single Page Application (SPA)**: one HTML page whose content React rewrites as you navigate. No full page reloads — views swap instantly because they are just components being rendered.',
        es: '### Single Page Applications\n\nUna app React suele ser una **Single Page Application (SPA)**: una sola página HTML cuyo contenido React reescribe al navegar. Sin recargas completas: las vistas cambian al instante porque son componentes renderizándose.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### React is a library, not a framework\n\nReact does one job — **rendering UI from state** — and does it well. Routing, forms, data fetching and styling come from the ecosystem. That focus is why React stays learnable: master components, props, state and effects, and you master React.',
        es: '### React es una librería, no un framework\n\nReact hace un solo trabajo — **renderizar UI a partir del estado** — y lo hace bien. El routing, los formularios, la carga de datos y los estilos vienen del ecosistema. Ese enfoque es lo que hace a React aprendible: domina componentes, props, estado y efectos, y dominarás React.',
      },
    },
    {
      kind: 'callout',
      type: 'info',
      text: {
        en: 'The best way to feel this difference is not reading about it. Open the lab and do the same task twice — once by hand, once the React way.',
        es: 'La mejor forma de notar esta diferencia no es leer sobre ella. Abre el laboratorio y haz la misma tarea dos veces: una a mano y otra al estilo React.',
      },
    },
    { kind: 'labref', labId: 'vanilla-vs-react' },
  ],
}
