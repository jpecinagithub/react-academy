export default {
  id: 'hooks',
  title: { en: 'Hooks quiz', es: 'Quiz de hooks' },
  questions: [
    {
      q: {
        en: 'Why must hooks always be called at the top level of a component, never inside conditions or loops?',
        es: '¿Por qué los hooks deben llamarse siempre en el nivel superior del componente, nunca dentro de condiciones o bucles?',
      },
      options: [
        { en: 'Because hooks are slower inside conditions', es: 'Porque los hooks son más lentos dentro de condiciones' },
        { en: 'Because React identifies each hook by its call order, which must be identical on every render', es: 'Porque React identifica cada hook por su orden de llamada, que debe ser idéntico en cada render' },
        { en: 'Because hooks cannot access props inside a loop', es: 'Porque los hooks no pueden acceder a las props dentro de un bucle' },
        { en: 'There is no such rule; hooks work anywhere in the function', es: 'No existe esa regla; los hooks funcionan en cualquier parte de la función' },
      ],
      answer: 1,
      explain: {
        en: 'React tracks hooks by position in the call sequence. Skipping one on a render would shift everything and attach state to the wrong hook.',
        es: 'React identifica los hooks por su posición en la secuencia de llamadas. Omitir uno en un render desplazaría todo y asociaría el estado al hook equivocado.',
      },
    },
    {
      q: {
        en: 'What happens when you update a value stored in useRef?',
        es: '¿Qué ocurre cuando actualizas un valor guardado en useRef?',
      },
      options: [
        { en: 'The component re-renders, like with useState', es: 'El componente se re-renderiza, como con useState' },
        { en: 'The value updates silently and the component does NOT re-render', es: 'El valor se actualiza en silencio y el componente NO se re-renderiza' },
        { en: 'The value is lost on the next render', es: 'El valor se pierde en el siguiente render' },
        { en: 'React throws an error because refs are read-only', es: 'React lanza un error porque las refs son de solo lectura' },
      ],
      answer: 1,
      explain: {
        en: 'useRef persists a mutable box across renders without triggering a re-render. It is ideal for DOM nodes, timers, or values you need to keep but not display.',
        es: 'useRef conserva una caja mutable entre renders sin provocar un re-render. Es ideal para nodos del DOM, temporizadores o valores que necesitas guardar pero no mostrar.',
      },
    },
    {
      q: {
        en: 'What does useMemo do?',
        es: '¿Qué hace useMemo?',
      },
      options: [
        { en: 'It memoizes a component so it never re-renders', es: 'Memoriza un componente para que nunca se re-renderice' },
        { en: 'It caches the RESULT of an expensive computation and only recomputes it when its dependencies change', es: 'Guarda en caché el RESULTADO de un cálculo costoso y solo lo recalcula cuando cambian sus dependencias' },
        { en: 'It caches a function so its identity stays stable', es: 'Guarda en caché una función para que su identidad se mantenga estable' },
        { en: 'It stores a value in localStorage', es: 'Guarda un valor en localStorage' },
      ],
      answer: 1,
      explain: {
        en: 'useMemo remembers a computed value between renders. Pass the values it depends on in the dependency array so it recomputes only when they change.',
        es: 'useMemo recuerda un valor calculado entre renders. Pasa los valores de los que depende en el array de dependencias para que solo se recalcule cuando cambien.',
      },
    },
    {
      q: {
        en: 'A component passes an inline arrow function as a prop to a child wrapped in React.memo. The child re-renders on every parent render. Why does useCallback help here?',
        es: 'Un componente pasa una función flecha en línea como prop a un hijo envuelto en React.memo. El hijo se re-renderiza en cada render del padre. ¿Por qué ayuda useCallback aquí?',
      },
      options: [
        { en: 'useCallback makes the function run faster', es: 'useCallback hace que la función se ejecute más rápido' },
        { en: 'useCallback keeps the same function identity between renders, so React.memo sees an unchanged prop and skips the re-render', es: 'useCallback mantiene la misma identidad de la función entre renders, así React.memo ve una prop sin cambios y omite el re-render' },
        { en: 'useCallback prevents the parent from re-rendering', es: 'useCallback evita que el padre se re-renderice' },
        { en: 'It does not help; memo components always re-render with new props', es: 'No ayuda; los componentes memo siempre se re-renderizan con props nuevas' },
      ],
      answer: 1,
      explain: {
        en: 'React.memo compares props by reference. An inline function is a new reference each render; useCallback returns a stable one unless its dependencies change.',
        es: 'React.memo compara las props por referencia. Una función en línea es una referencia nueva en cada render; useCallback devuelve una estable salvo que cambien sus dependencias.',
      },
    },
    {
      q: {
        en: 'When should you NOT add useMemo or useCallback?',
        es: '¿Cuándo NO deberías usar useMemo o useCallback?',
      },
      options: [
        { en: 'When the computation is expensive and runs on every render', es: 'Cuando el cálculo es costoso y se ejecuta en cada render' },
        { en: 'When a memoized child depends on a stable function identity', es: 'Cuando un hijo memorizado depende de una identidad de función estable' },
        { en: 'When the value is cheap to compute and no child depends on its identity — memoization itself has a cost', es: 'Cuando el valor es barato de calcular y ningún hijo depende de su identidad: la propia memorización tiene un coste' },
        { en: 'You should always memoize everything for performance', es: 'Siempre deberías memorizar todo por rendimiento' },
      ],
      answer: 2,
      explain: {
        en: 'Memoization trades memory and comparison work for skipped recomputation. For cheap values it adds overhead with no benefit — optimize only what you measured.',
        es: 'La memorización cambia memoria y trabajo de comparación por cálculos omitidos. Para valores baratos añade coste sin beneficio: optimiza solo lo que hayas medido.',
      },
    },
  ],
}
