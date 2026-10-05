export default {
  id: 'context',
  title: { en: 'Context quiz', es: 'Quiz de context' },
  questions: [
    {
      q: {
        en: 'What problem does React Context solve?',
        es: '¿Qué problema resuelve React Context?',
      },
      options: [
        { en: 'It makes components render faster', es: 'Hace que los componentes se rendericen más rápido' },
        { en: 'It lets components deep in the tree receive data without passing props through every intermediate level', es: 'Permite que componentes profundos en el árbol reciban datos sin pasar props por cada nivel intermedio' },
        { en: 'It replaces the need for components entirely', es: 'Elimina por completo la necesidad de componentes' },
        { en: 'It stores data in the browser permanently', es: 'Guarda datos en el navegador de forma permanente' },
      ],
      answer: 1,
      explain: {
        en: 'Context solves "prop drilling": instead of threading a value through components that do not need it, any consumer below the Provider can read it directly.',
        es: 'Context resuelve el "prop drilling": en lugar de pasar un valor por componentes que no lo necesitan, cualquier consumidor bajo el Provider puede leerlo directamente.',
      },
    },
    {
      q: {
        en: 'A component calls useContext(ThemeContext) but it is NOT rendered inside any ThemeContext.Provider. What value does it receive?',
        es: 'Un componente llama a useContext(ThemeContext) pero NO está renderizado dentro de ningún ThemeContext.Provider. ¿Qué valor recibe?',
      },
      options: [
        { en: 'null, always', es: 'null, siempre' },
        { en: 'It throws an error', es: 'Lanza un error' },
        { en: 'The default value passed to createContext', es: 'El valor por defecto pasado a createContext' },
        { en: 'The value from the nearest sibling Provider', es: 'El valor del Provider hermano más cercano' },
      ],
      answer: 2,
      explain: {
        en: 'Without a matching Provider above it, a consumer falls back to the default value given to createContext. Only ancestors in the tree count — siblings do not.',
        es: 'Sin un Provider coincidente por encima, el consumidor usa el valor por defecto dado a createContext. Solo cuentan los ancestros del árbol, no los hermanos.',
      },
    },
    {
      q: {
        en: 'When is Context overkill and plain props the better choice?',
        es: '¿Cuándo es Context excesivo y las props simples son mejor opción?',
      },
      options: [
        { en: 'When many deeply nested components need the same data', es: 'Cuando muchos componentes anidados necesitan los mismos datos' },
        { en: 'When the data changes often and is needed across the app', es: 'Cuando los datos cambian a menudo y se necesitan en toda la app' },
        { en: 'When only one or two levels need the data — passing a prop is simpler and keeps the data flow visible', es: 'Cuando solo uno o dos niveles necesitan los datos: pasar una prop es más simple y mantiene visible el flujo de datos' },
        { en: 'Context is never overkill; always use it instead of props', es: 'Context nunca es excesivo; úsalo siempre en lugar de props' },
      ],
      answer: 2,
      explain: {
        en: 'Context adds indirection: it is harder to see where data comes from. For short distances, an explicit prop is clearer and easier to refactor.',
        es: 'Context añade indirección: es más difícil ver de dónde vienen los datos. Para distancias cortas, una prop explícita es más clara y fácil de refactorizar.',
      },
    },
    {
      q: {
        en: 'The value passed to a Context Provider changes. What happens to the components that consume that context?',
        es: 'El valor pasado a un Context Provider cambia. ¿Qué les ocurre a los componentes que consumen ese contexto?',
      },
      options: [
        { en: 'Nothing — they keep the old value until they re-render for another reason', es: 'Nada: conservan el valor antiguo hasta re-renderizarse por otro motivo' },
        { en: 'All consumers below that Provider re-render with the new value', es: 'Todos los consumidores bajo ese Provider se re-renderizan con el nuevo valor' },
        { en: 'Only the Provider itself re-renders', es: 'Solo el propio Provider se re-renderiza' },
        { en: 'The whole app unmounts and remounts', es: 'Toda la app se desmonta y vuelve a montar' },
      ],
      answer: 1,
      explain: {
        en: 'A context value change re-renders every consumer under that Provider, even if intermediate components do not use the context. This is why large, frequently changing values in context can hurt performance.',
        es: 'Un cambio en el valor del contexto re-renderiza cada consumidor bajo ese Provider, aunque los componentes intermedios no lo usen. Por eso, valores grandes que cambian a menudo pueden dañar el rendimiento.',
      },
    },
    {
      q: {
        en: 'Two separate Providers of the same context exist in different parts of the tree, each with a different value. A component under the second Provider reads the context. Which value does it get?',
        es: 'Existen dos Providers separados del mismo contexto en distintas partes del árbol, cada uno con un valor diferente. Un componente bajo el segundo Provider lee el contexto. ¿Qué valor recibe?',
      },
      options: [
        { en: 'A merge of both values', es: 'Una fusión de ambos valores' },
        { en: 'The value from the Provider directly above it (the nearest ancestor Provider)', es: 'El valor del Provider justo encima de él (el Provider ancestro más cercano)' },
        { en: 'Whichever Provider was rendered first', es: 'El Provider que se haya renderizado primero' },
        { en: 'It is impossible to have two Providers of the same context', es: 'Es imposible tener dos Providers del mismo contexto' },
      ],
      answer: 1,
      explain: {
        en: 'A consumer always reads from its nearest ancestor Provider. This lets you scope different values to different sections of the UI, like nested themes.',
        es: 'Un consumidor siempre lee del Provider ancestro más cercano. Esto permite asignar valores distintos a distintas secciones de la UI, como temas anidados.',
      },
    },
  ],
}
