// Lesson: Rendering — data, rendered by LessonRenderer (see docs/CONTRACTS.md §2)
export default {
  id: 'lesson-rendering',
  moduleId: 'rendering',
  order: 1,
  title: { en: 'Rendering: React calls your function again', es: 'Render: React vuelve a llamar a tu función' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'A React component is **a function**. “Rendering” means **React calls that function** and uses what it returns to describe the UI.\n\n- First render: when the component appears on screen.\n- Re-render: every time React calls it again.',
        es: 'Un componente React es **una función**. «Renderizar» significa que **React llama a esa función** y usa lo que devuelve para describir la UI.\n\n- Primer render: cuando el componente aparece en pantalla.\n- Re-render: cada vez que React la vuelve a llamar.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### What triggers a re-render?\n\n- **Its own state changes** (`setCount` with a new value)\n- **Its parent re-renders** — children follow the parent by default\n- **Its context value changes** (you will meet Context later)\n\nThat is the whole list. Nothing else re-runs your component.',
        es: '### ¿Qué provoca un re-render?\n\n- **Cambia su propio estado** (`setCount` con un valor nuevo)\n- **Su padre se vuelve a renderizar**: los hijos siguen al padre por defecto\n- **Cambia su valor de contexto** (verás Context más adelante)\n\nEsa es toda la lista. Nada más vuelve a ejecutar tu componente.',
      },
    },
    {
      kind: 'callout',
      type: 'info',
      text: {
        en: 'Render ≠ browser repaint. After React calls your function, it compares the new description with the previous one (reconciliation) and updates only the DOM nodes that actually changed.',
        es: 'Render ≠ repintado del navegador. Después de llamar a tu función, React compara la nueva descripción con la anterior (reconciliación) y actualiza solo los nodos del DOM que realmente cambiaron.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### Render vs commit vs paint (the simple version)\n\n- **Render**: React calls your function and computes the new UI description. Fast, pure, happens in JavaScript.\n- **Commit**: React writes the differences to the real DOM.\n- **Paint**: the browser draws pixels on screen.\n\nWhen you press +1 in a counter, all three happen — but your code only controls the first one.',
        es: '### Render vs commit vs paint (versión sencilla)\n\n- **Render**: React llama a tu función y calcula la nueva descripción de la UI. Rápido, puro, ocurre en JavaScript.\n- **Commit**: React escribe las diferencias en el DOM real.\n- **Paint**: el navegador dibuja píxeles en pantalla.\n\nAl pulsar +1 en un contador ocurren los tres, pero tu código solo controla el primero.',
      },
    },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: 'If a component re-renders “too much”, the fix is usually *less* work: memoize it (React.memo), move state down, or derive values instead of storing them.',
        es: 'Si un componente se vuelve a renderizar «demasiado», la solución suele ser *menos* trabajo: memoízalo (React.memo), baja el estado o deriva valores en lugar de almacenarlos.',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'I can explain render as “React calling my function again”', es: 'Sé explicar el render como «React llamando a mi función de nuevo»' },
        { en: 'I know the three triggers of a re-render', es: 'Conozco los tres desencadenantes de un re-render' },
        { en: 'I can distinguish render, commit and paint', es: 'Sé distinguir render, commit y paint' },
      ],
    },
    { kind: 'labref', labId: 'render-visualizer' },
  ],
}
