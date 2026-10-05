export default {
  id: 'jsx',
  title: { en: 'JSX quiz', es: 'Quiz de JSX' },
  questions: [
    {
      q: {
        en: 'What do the curly braces do in `<p>Total: {price * qty}</p>`?',
        es: '¿Qué hacen las llaves en `<p>Total: {price * qty}</p>`?',
      },
      options: [
        { en: 'They render the literal text "price * qty"', es: 'Renderizan el texto literal "price * qty"' },
        { en: 'They embed a JavaScript expression that gets evaluated', es: 'Insertan una expresión JavaScript que se evalúa' },
        { en: 'They create a CSS block', es: 'Crean un bloque CSS' },
        { en: 'They are required around all text', es: 'Son obligatorias alrededor de todo texto' },
      ],
      answer: 1,
      explain: {
        en: 'Inside JSX, {} drops you back into JavaScript: any expression — math, variables, function calls — gets evaluated.',
        es: 'Dentro de JSX, las {} te devuelven a JavaScript: cualquier expresión (matemática, variables, llamadas) se evalúa.',
      },
    },
    {
      q: {
        en: 'Why does this fail? `return <h1>Hi</h1> <p>Bye</p>`',
        es: '¿Por qué falla esto? `return <h1>Hola</h1> <p>Adiós</p>`',
      },
      options: [
        { en: 'JSX expressions must have a single root — wrap them in one parent or a fragment', es: 'Las expresiones JSX deben tener una sola raíz: envuélvelas en un padre o un fragment' },
        { en: 'You cannot return two elements ever', es: 'Nunca puedes devolver dos elementos' },
        { en: 'h1 and p cannot be siblings', es: 'h1 y p no pueden ser hermanos' },
        { en: 'The strings are missing quotes', es: 'A los strings les faltan comillas' },
      ],
      answer: 0,
      explain: {
        en: 'A component returns one JSX element. Use a wrapper div or <>...</> (fragment) to group siblings without extra markup.',
        es: 'Un componente devuelve un solo elemento JSX. Usa un div contenedor o <>...</> (fragment) para agrupar hermanos sin markup extra.',
      },
    },
    {
      q: {
        en: 'In JSX, why do you write `className` instead of `class`?',
        es: 'En JSX, ¿por qué escribes `className` en lugar de `class`?',
      },
      options: [
        { en: 'It is just a style preference', es: 'Es solo una preferencia de estilo' },
        { en: '`class` is a reserved word in JavaScript, so JSX uses className', es: '`class` es palabra reservada en JavaScript, así que JSX usa className' },
        { en: 'className loads faster', es: 'className carga más rápido' },
        { en: '`class` is deprecated in HTML', es: '`class` está obsoleto en HTML' },
      ],
      answer: 1,
      explain: {
        en: 'JSX is JavaScript, where `class` declares classes. React maps className to the HTML class attribute for you.',
        es: 'JSX es JavaScript, donde `class` declara clases. React mapea className al atributo class de HTML por ti.',
      },
    },
    {
      q: {
        en: 'Predict: what renders from `<button disabled={isAdmin}>Save</button>` when isAdmin is false?',
        es: 'Predice: ¿qué se renderiza con `<button disabled={isAdmin}>Guardar</button>` cuando isAdmin es false?',
      },
      options: [
        { en: 'A disabled button', es: 'Un botón deshabilitado' },
        { en: 'An enabled button — false removes the attribute', es: 'Un botón habilitado: false elimina el atributo' },
        { en: 'The button disappears', es: 'El botón desaparece' },
        { en: 'It throws an error', es: 'Lanza un error' },
      ],
      answer: 1,
      explain: {
        en: 'JSX attributes accept expressions. false/null/undefined omit the attribute, so the button stays enabled.',
        es: 'Los atributos JSX aceptan expresiones. false/null/undefined omiten el atributo, así el botón queda habilitado.',
      },
    },
    {
      q: {
        en: 'Which statement about JSX is TRUE?',
        es: '¿Qué afirmación sobre JSX es VERDADERA?',
      },
      options: [
        { en: 'JSX is an HTML string that React parses', es: 'JSX es un string HTML que React parsea' },
        { en: 'JSX compiles to React.createElement calls — plain JavaScript objects describing UI', es: 'JSX se compila a llamadas React.createElement: objetos JavaScript que describen la UI' },
        { en: 'Browsers understand JSX natively', es: 'Los navegadores entienden JSX de forma nativa' },
        { en: 'JSX only works with TypeScript', es: 'JSX solo funciona con TypeScript' },
      ],
      answer: 1,
      explain: {
        en: 'JSX is syntactic sugar. The build step turns it into function calls that produce lightweight element objects.',
        es: 'JSX es azúcar sintáctico. El paso de build lo convierte en llamadas que producen objetos ligeros de elementos.',
      },
    },
  ],
}
