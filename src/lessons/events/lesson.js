// Lesson: Events — data, rendered by LessonRenderer (see docs/CONTRACTS.md §2)
export default {
  id: 'lesson-events',
  moduleId: 'events',
  order: 1,
  title: { en: 'Events: the user talks to React', es: 'Eventos: el usuario habla con React' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'React events look like HTML attributes, but they are **camelCase** and receive **functions**, not strings:\n\n- `onClick` — the user clicks\n- `onChange` — an input’s value changes\n- `onSubmit` — a form is submitted\n- `onKeyDown` — a keyboard key is pressed\n\nYou describe *what should happen*; React wires the browser event for you.',
        es: 'Los eventos de React parecen atributos HTML, pero son **camelCase** y reciben **funciones**, no textos:\n\n- `onClick`: el usuario hace clic\n- `onChange`: cambia el valor de un campo\n- `onSubmit`: se envía un formulario\n- `onKeyDown`: se pulsa una tecla\n\nTú describes *qué debe ocurrir*; React conecta el evento del navegador por ti.',
      },
    },
    { kind: 'code', lang: 'jsx', code: 'function handleClick() {\n  setCount(count + 1);\n}\n\n<button onClick={handleClick}>+1</button>' },
    {
      kind: 'text',
      body: {
        en: '### Handler naming\n\nBy convention handlers are named `handle` + event: `handleClick`, `handleChange`, `handleSubmit`. It is just a convention — but every React developer expects it.\n\n### Passing arguments\n\nNeed data in the handler? Wrap it in an arrow function:\n\n- `onClick={() => removeItem(id)}`\n- Never `onClick={removeItem(id)}` — that *calls* it during render.',
        es: '### Nombres de manejadores\n\nPor convención se llaman `handle` + evento: `handleClick`, `handleChange`, `handleSubmit`. Es solo una convención, pero todo desarrollador React la espera.\n\n### Pasar argumentos\n\n¿Necesitas datos en el manejador? Envuélvelo en una arrow function:\n\n- `onClick={() => removeItem(id)}`\n- Nunca `onClick={removeItem(id)}`: eso lo *llama* durante el render.',
      },
    },
    {
      kind: 'flow',
      steps: [
        { label: { en: 'User acts', es: 'El usuario actúa' } },
        { label: { en: 'onClick fires', es: 'onClick se dispara' } },
        { label: { en: 'handleClick() runs', es: 'handleClick() se ejecuta' } },
        { label: { en: 'setState()', es: 'setState()' } },
        { label: { en: 'React renders', es: 'React renderiza' } },
      ],
    },
    {
      kind: 'callout',
      type: 'warn',
      text: {
        en: 'Native form submission **reloads the page**. In a React app you almost always want `e.preventDefault()` in `onSubmit` and handle the data with state instead.',
        es: 'El envío nativo de un formulario **recarga la página**. En una app React casi siempre querrás `e.preventDefault()` en `onSubmit` y gestionar los datos con estado.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### The event object\n\nHandlers receive a **synthetic event** — React’s normalized wrapper around the browser event, identical in every browser:\n\n- `e.target.value` — what was typed in an input\n- `e.key` — which keyboard key was pressed\n- `e.preventDefault()` — stop the browser’s default behavior',
        es: '### El objeto del evento\n\nLos manejadores reciben un **evento sintético**: el envoltorio normalizado de React sobre el evento del navegador, idéntico en todos los navegadores:\n\n- `e.target.value`: lo que se escribió en un campo\n- `e.key`: qué tecla se pulsó\n- `e.preventDefault()`: detiene el comportamiento por defecto del navegador',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'I can attach onClick, onChange, onSubmit and onKeyDown', es: 'Sé usar onClick, onChange, onSubmit y onKeyDown' },
        { en: 'I pass a function reference, not a call', es: 'Paso una referencia a función, no una llamada' },
        { en: 'I can pass arguments with an arrow function', es: 'Sé pasar argumentos con una arrow function' },
        { en: 'I know when to use preventDefault', es: 'Sé cuándo usar preventDefault' },
      ],
    },
    { kind: 'labref', labId: 'event-flow' },
  ],
}
