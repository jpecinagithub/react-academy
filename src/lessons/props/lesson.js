// Lesson: Props — data, rendered by LessonRenderer (see docs/CONTRACTS.md §2)
export default {
  id: 'lesson-props',
  moduleId: 'props',
  order: 1,
  title: { en: 'Props: data flows down', es: 'Props: los datos bajan' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'A **component** is a function. **Props** are the arguments you pass when you call it. The line below is conceptually the same as calling `UserCard({ name: "Alex", age: 32 })`.',
        es: 'Un **componente** es una función. Las **props** son los argumentos que pasas al llamarla. La línea siguiente es conceptualmente lo mismo que llamar a `UserCard({ name: "Alex", age: 32 })`.',
      },
    },
    { kind: 'code', lang: 'jsx', code: '<UserCard name="Alex" age={32} />' },
    {
      kind: 'flow',
      steps: [
        { label: { en: 'Parent renders', es: 'El padre renderiza' } },
        { label: { en: 'props flow down', es: 'las props bajan' }, desc: { en: 'one-way only', es: 'solo en un sentido' } },
        { label: { en: 'Child renders with them', es: 'El hijo renderiza con ellas' } },
      ],
    },
    {
      kind: 'text',
      body: {
        en: '### Reading props\n\nDestructure them in the parameter list — it is the standard React style:\n\n- `function UserCard({ name, age })` reads `name` and `age`\n- Missing props can get defaults: `{ name = "Anonymous" }`\n- Props can be **strings** (`name="Alex"`), **numbers** (`age={32}`), **booleans**, **arrays**, **objects** — even **functions** and other components.',
        es: '### Leer props\n\nDesestructúralas en la lista de parámetros: es el estilo estándar de React:\n\n- `function UserCard({ name, age })` lee `name` y `age`\n- Las props ausentes pueden tener valores por defecto: `{ name = "Anonymous" }`\n- Las props pueden ser **textos** (`name="Alex"`), **números** (`age={32}`), **booleanos**, **arrays**, **objetos**, incluso **funciones** y otros componentes.',
      },
    },
    {
      kind: 'callout',
      type: 'warn',
      text: {
        en: 'Props are **read-only**. A child must never write to its props (`props.name = "x"` is a bug). If the data needs to change, the *parent* changes its state and passes new props down.',
        es: 'Las props son de **solo lectura**. Un hijo nunca debe escribir en sus props (`props.name = "x"` es un error). Si el dato debe cambiar, el *padre* cambia su estado y pasa nuevas props.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### The special `children` prop\n\nEverything between a component’s tags arrives as `props.children`:\n\n- `<Card><p>Hello</p></Card>` → inside `Card`, `children` is that `<p>`\n- This is how wrappers, layouts and modals are built.',
        es: '### La prop especial `children`\n\nTodo lo que hay entre las etiquetas de un componente llega como `props.children`:\n\n- `<Card><p>Hola</p></Card>` → dentro de `Card`, `children` es ese `<p>`\n- Así se construyen envoltorios, layouts y modales.',
      },
    },
    {
      kind: 'checklist',
      items: [
        { en: 'I can pass data from a parent to a child', es: 'Sé pasar datos de un padre a un hijo' },
        { en: 'I know props flow one way and are read-only', es: 'Sé que las props fluyen en un sentido y son de solo lectura' },
        { en: 'I can destructure props with defaults', es: 'Sé desestructurar props con valores por defecto' },
        { en: 'I know what the children prop is', es: 'Sé qué es la prop children' },
      ],
    },
    { kind: 'labref', labId: 'props-lab' },
  ],
}
