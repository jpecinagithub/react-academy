// Lesson: controlled vs uncontrolled inputs, multi-input state, submit,
// validation basics.
export default {
  id: 'lesson-forms',
  moduleId: 'forms',
  order: 1,
  title: { en: 'Forms & Controlled Inputs', es: 'Formularios e inputs controlados' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### Who owns the value?\n\nA plain HTML input keeps its own value in the DOM. A **controlled input** hands that job to React: the rendered value always equals state, and every keystroke flows through `setState` first.\n\nThat single decision unlocks live validation, formatting as you type, and submit buttons that enable themselves when the form is valid.',
        es: '### ¿Quién es dueño del valor?\n\nUn input HTML normal guarda su propio valor en el DOM. Un **input controlado** entrega ese trabajo a React: el valor renderizado siempre es igual al estado, y cada pulsación pasa primero por `setState`.\n\nEsa sola decisión desbloquea la validación en vivo, el formateo al escribir y botones de envío que se activan solos cuando el formulario es válido.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function NameField() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}                    // React owns the value…
      onChange={(e) => setName(e.target.value)}  // …and every change
    />
  );
}`,
    },
    {
      kind: 'flow',
      steps: [
        {
          label: { en: 'Key pressed', es: 'Tecla pulsada' },
          desc: { en: 'the DOM input receives it', es: 'el input del DOM la recibe' },
        },
        {
          label: { en: 'onChange fires', es: 'onChange se dispara' },
          desc: { en: 'with e.target.value', es: 'con e.target.value' },
        },
        {
          label: { en: 'setName(value)', es: 'setName(value)' },
          desc: { en: 'state updates', es: 'el estado se actualiza' },
        },
        {
          label: { en: 'Re-render', es: 'Re-render' },
          desc: { en: 'value={name} paints the character', es: 'value={name} pinta el carácter' },
        },
      ],
    },
    {
      kind: 'text',
      body: {
        en: '### One state object for the whole form\n\nInstead of one `useState` per field, keep a single object and update it immutably with the spread operator. The `[field]` syntax is a *computed property name* — it lets one handler serve every input.',
        es: '### Un objeto de estado para todo el formulario\n\nEn lugar de un `useState` por campo, guarda un solo objeto y actualízalo de forma inmutable con el operador spread. La sintaxis `[field]` es un *nombre de propiedad computado*: permite que un solo manejador sirva a todos los inputs.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `const [form, setForm] = useState({ name: '', email: '', country: '' });

const update = (field) => (e) =>
  setForm((f) => ({ ...f, [field]: e.target.value }));

<input value={form.name} onChange={update('name')} />
<input value={form.email} onChange={update('email')} />
<select value={form.country} onChange={update('country')}>…</select>`,
    },
    {
      kind: 'text',
      body: {
        en: '### The uncontrolled alternative\n\nSometimes you just need to *read* a value once — on submit, for example. Then a `ref` is the pragmatic choice: no `value`, no `onChange`, no re-render while typing. You read `ref.current.value` when you need it.\n\nFile inputs are the classic case: they cannot be controlled anyway.',
        es: '### La alternativa no controlada\n\nA veces solo necesitas *leer* un valor una vez, al enviar por ejemplo. Entonces una `ref` es la opción pragmática: sin `value`, sin `onChange`, sin re-render al escribir. Lees `ref.current.value` cuando lo necesitas.\n\nLos inputs de fichero son el caso clásico: ni siquiera pueden ser controlados.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function QuickSearch() {
  const inputRef = useRef(null);

  const search = () => {
    console.log(inputRef.current.value); // read once, on demand
  };

  return (
    <>
      <input ref={inputRef} placeholder="type…" />
      <button onClick={search}>Search</button>
    </>
  );
}`,
    },
    {
      kind: 'callout',
      type: 'tip',
      text: {
        en: '**Validation rule of thumb:** if the UI must react to every keystroke (error messages, character counts, disabling submit), go controlled. If you only need the value at submit time, uncontrolled with a ref is simpler and renders less.',
        es: '**Regla práctica de validación:** si la UI debe reaccionar a cada pulsación (mensajes de error, conteo de caracteres, bloquear el envío), usa controlado. Si solo necesitas el valor al enviar, no controlado con ref es más simple y renderiza menos.',
      },
    },
    {
      kind: 'checklist',
      items: [
        {
          en: 'A controlled input renders value={state} and updates it via onChange.',
          es: 'Un input controlado renderiza value={estado} y lo actualiza con onChange.',
        },
        {
          en: 'The character appears only after state updates and React re-renders.',
          es: 'El carácter aparece solo después de que el estado se actualiza y React re-renderiza.',
        },
        {
          en: 'One state object + one generic handler scales to whole forms.',
          es: 'Un objeto de estado + un manejador genérico escala a formularios enteros.',
        },
        {
          en: 'Uncontrolled inputs (refs) are for “read once” cases like submit or file inputs.',
          es: 'Los inputs no controlados (refs) son para casos de «leer una vez» como el envío o los ficheros.',
        },
      ],
    },
    { kind: 'labref', labId: 'controlled-form-lab' },
    { kind: 'quizref', quizId: 'forms' },
  ],
}
