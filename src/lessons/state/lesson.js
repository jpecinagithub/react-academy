// Lesson: State — data, rendered by LessonRenderer (see docs/CONTRACTS.md §2)
export default {
  id: 'lesson-state',
  moduleId: 'state',
  order: 1,
  title: { en: 'State: memory that re-renders', es: 'Estado: memoria que vuelve a renderizar' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '**State** is a component’s memory. A normal variable is forgotten on every render; state survives between renders — and changing it asks React to render again.',
        es: 'El **estado** es la memoria de un componente. Una variable normal se olvida en cada render; el estado sobrevive entre renders, y cambiarlo pide a React que vuelva a renderizar.',
      },
    },
    { kind: 'code', lang: 'jsx', code: 'const [count, setCount] = useState(0);' },
    {
      kind: 'text',
      body: {
        en: 'Three pieces in one line:\n\n- `count` — the **current value**\n- `setCount` — the **function** that changes it\n- `0` — the **initial value** (used only on the first render)',
        es: 'Tres piezas en una línea:\n\n- `count`: el **valor actual**\n- `setCount`: la **función** que lo cambia\n- `0`: el **valor inicial** (usado solo en el primer render)',
      },
    },
    {
      kind: 'flow',
      steps: [
        { label: { en: 'Event', es: 'Evento' } },
        { label: { en: 'setCount(count + 1)', es: 'setCount(count + 1)' } },
        { label: { en: 'State changes', es: 'El estado cambia' } },
        { label: { en: 'React renders again', es: 'React vuelve a renderizar' } },
        { label: { en: 'UI updates', es: 'La UI se actualiza' } },
      ],
    },
    {
      kind: 'callout',
      type: 'danger',
      text: {
        en: 'Never mutate state directly. `count = count + 1` (or `items.push(x)`) does not notify React — nothing re-renders. Always go through the setter: `setCount(count + 1)`, `setItems([...items, x])`.',
        es: 'Nunca mutes el estado directamente. `count = count + 1` (o `items.push(x)`) no avisa a React: nada se vuelve a renderizar. Usa siempre el setter: `setCount(count + 1)`, `setItems([...items, x])`.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### State vs plain variables\n\n- **Plain variable**: recalculated on every render, lost afterwards. Use for values derived from props or state.\n- **State**: persists between renders and triggers a re-render when updated. Use for anything the user can change and the UI must reflect.\n\n### Multiple states\n\nCall `useState` as many times as you need — each call is an independent piece of memory:\n\n- `const [name, setName] = useState("")`\n- `const [dark, setDark] = useState(false)`\n- Keep them small and focused: one state per independent fact.',
        es: '### Estado frente a variables normales\n\n- **Variable normal**: se recalcula en cada render y se pierde después. Úsala para valores derivados de props o estado.\n- **Estado**: persiste entre renders y provoca un re-render al actualizarse. Úsalo para lo que el usuario pueda cambiar y la UI deba reflejar.\n\n### Múltiples estados\n\nLlama a `useState` tantas veces como necesites: cada llamada es una pieza independiente de memoria:\n\n- `const [name, setName] = useState("")`\n- `const [dark, setDark] = useState(false)`\n- Mantenlos pequeños y enfocados: un estado por cada dato independiente.',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'I can explain the three parts of useState', es: 'Sé explicar las tres partes de useState' },
        { en: 'I know why direct mutation does not re-render', es: 'Sé por qué la mutación directa no re-renderiza' },
        { en: 'I can choose between state and a plain variable', es: 'Sé elegir entre estado y variable normal' },
      ],
    },
    { kind: 'labref', labId: 'state-lab' },
  ],
}
