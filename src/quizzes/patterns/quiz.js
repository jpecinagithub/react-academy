export default {
  id: 'patterns',
  title: { en: 'Patterns quiz', es: 'Quiz de patrones' },
  questions: [
    {
      q: {
        en: 'What makes a function a "custom hook" in React?',
        es: '¿Qué convierte a una función en un "custom hook" en React?',
      },
      options: [
        { en: 'It must be defined inside a component', es: 'Debe definirse dentro de un componente' },
        { en: 'Its name starts with "use" and it can call other hooks inside it', es: 'Su nombre empieza por "use" y puede llamar a otros hooks dentro' },
        { en: 'It must return JSX', es: 'Debe devolver JSX' },
        { en: 'It must be placed in a file named hooks.js', es: 'Debe estar en un fichero llamado hooks.js' },
      ],
      answer: 1,
      explain: {
        en: 'The "use" prefix tells React to apply the rules of hooks to the function. Custom hooks extract reusable stateful logic — unlike components, they do not need to return JSX.',
        es: 'El prefijo "use" indica a React que aplique las reglas de los hooks a la función. Los custom hooks extraen lógica con estado reutilizable; a diferencia de los componentes, no necesitan devolver JSX.',
      },
    },
    {
      q: {
        en: 'Two sibling components need to share and stay in sync with the same state. Where should that state live?',
        es: 'Dos componentes hermanos necesitan compartir el mismo estado y mantenerse sincronizados. ¿Dónde debería vivir ese estado?',
      },
      options: [
        { en: 'Duplicated in each sibling with useState', es: 'Duplicado en cada hermano con useState' },
        { en: 'In a global variable outside React', es: 'En una variable global fuera de React' },
        { en: 'Lifted up to their closest common parent, passed down as props', es: 'Elevado a su padre común más cercano, pasado hacia abajo como props' },
        { en: 'Inside whichever sibling renders first', es: 'Dentro del hermano que se renderice primero' },
      ],
      answer: 2,
      explain: {
        en: 'Lifting state up gives both siblings a single source of truth: the parent owns the state and passes it down, so both always see the same value.',
        es: 'Elevar el estado da a ambos hermanos una única fuente de verdad: el padre posee el estado y lo pasa hacia abajo, así ambos ven siempre el mismo valor.',
      },
    },
    {
      q: {
        en: 'A Layout component renders a header, then {children}, then a footer. Different pages pass different content as children. What is the main benefit of this composition pattern?',
        es: 'Un componente Layout renderiza un encabezado, luego {children} y después un pie. Distintas páginas pasan distinto contenido como children. ¿Cuál es el principal beneficio de este patrón de composición?',
      },
      options: [
        { en: 'It makes the pages render faster', es: 'Hace que las páginas se rendericen más rápido' },
        { en: 'It lets Layout reuse its structure while each page decides its own content — Layout does not need to know what it wraps', es: 'Permite a Layout reutilizar su estructura mientras cada página decide su contenido: Layout no necesita saber qué envuelve' },
        { en: 'It removes the need for props', es: 'Elimina la necesidad de props' },
        { en: 'Children are the only way to nest components', es: 'Children es la única forma de anidar componentes' },
      ],
      answer: 1,
      explain: {
        en: 'Composition with children separates structure from content. The wrapper stays generic and reusable; the caller controls what goes inside.',
        es: 'La composición con children separa la estructura del contenido. El contenedor sigue siendo genérico y reutilizable; quien lo usa controla qué va dentro.',
      },
    },
    {
      q: {
        en: 'What is the conceptual difference between a controlled and an uncontrolled input?',
        es: '¿Cuál es la diferencia conceptual entre un input controlado y uno no controlado?',
      },
      options: [
        { en: 'Controlled inputs are faster; uncontrolled inputs are slower', es: 'Los inputs controlados son más rápidos; los no controlados, más lentos' },
        { en: 'In a controlled input React state is the source of truth (via value + onChange); in an uncontrolled input the DOM itself holds the value', es: 'En un input controlado el estado de React es la fuente de verdad (vía value + onChange); en uno no controlado el propio DOM guarda el valor' },
        { en: 'Controlled inputs cannot be edited by the user', es: 'Los inputs controlados no pueden ser editados por el usuario' },
        { en: 'Uncontrolled inputs do not work in React', es: 'Los inputs no controlados no funcionan en React' },
      ],
      answer: 1,
      explain: {
        en: 'Controlled = React drives the value, so validation, formatting and instant feedback are easy. Uncontrolled = the DOM drives it; you read it via a ref when needed, with less code.',
        es: 'Controlado = React dirige el valor, así la validación, el formato y la respuesta inmediata son fáciles. No controlado = el DOM lo dirige; lo lees con una ref cuando lo necesitas, con menos código.',
      },
    },
    {
      q: {
        en: 'You extract a "useWindowWidth" custom hook used by three different components. Each component instance calls the hook. How many independent width states exist?',
        es: 'Extraes un custom hook "useWindowWidth" usado por tres componentes distintos. Cada instancia del componente llama al hook. ¿Cuántos estados de ancho independientes existen?',
      },
      options: [
        { en: 'One — the hook shares a single state across all components', es: 'Uno: el hook comparte un único estado entre todos los componentes' },
        { en: 'Three — each hook call creates its own independent state', es: 'Tres: cada llamada al hook crea su propio estado independiente' },
        { en: 'None — custom hooks cannot hold state', es: 'Ninguno: los custom hooks no pueden guardar estado' },
      ],
      answer: 1,
      explain: {
        en: 'Custom hooks share LOGIC, not state. Every call gets its own isolated hook state — reuse the behavior without coupling the components.',
        es: 'Los custom hooks comparten LÓGICA, no estado. Cada llamada obtiene su propio estado aislado: reutilizas el comportamiento sin acoplar los componentes.',
      },
    },
  ],
}
