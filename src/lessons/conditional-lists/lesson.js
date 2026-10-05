// Lesson: conditionals (ternary, &&, if-return) + lists (map) + keys.
export default {
  id: 'lesson-conditional-lists',
  moduleId: 'conditional-lists',
  order: 1,
  title: { en: 'Conditionals & Lists', es: 'Condicionales y listas' },
  sections: [
    {
      kind: 'text',
      body: {
        en: '### UI is a function of state\n\nA React component is a function that returns UI. **Conditional rendering** is just using JavaScript conditions — `if`, ternaries, `&&` — to decide *which* UI that function returns.\n\nWhen state changes, React runs your function again, re-evaluates the conditions with the new values, and shows the matching branch. The other branches are not rendered at all.',
        es: '### La UI es una función del estado\n\nUn componente React es una función que devuelve UI. El **renderizado condicional** consiste en usar condiciones de JavaScript — `if`, ternarios, `&&` — para decidir *qué* UI devuelve esa función.\n\nCuando el estado cambia, React ejecuta tu función de nuevo, reevalúa las condiciones con los nuevos valores y muestra la rama correspondiente. Las demás ramas no se renderizan en absoluto.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function Greeting({ isLoggedIn }) {
  return isLoggedIn ? <Dashboard /> : <Login />;
  //     condition       ^ true branch    ^ false branch
}`,
    },
    {
      kind: 'text',
      body: {
        en: '### The `&&` shortcut\n\nWhen you only need the “true” branch, `&&` is the idiomatic shortcut. If the left side is falsy, React renders nothing — with one famous exception.',
        es: '### El atajo `&&`\n\nCuando solo necesitas la rama «verdadera», `&&` es el atajo idiomático. Si el lado izquierdo es falsy, React no renderiza nada, con una famosa excepción.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function Cart({ items }) {
  return (
    <div>
      {items.length > 0 && <p>{items.length} items</p>}
      {isPremium && <PremiumBadge />}
    </div>
  );
}`,
    },
    {
      kind: 'callout',
      type: 'warn',
      text: {
        en: '**The `&&` gotcha:** `{count && <Badge />}` with `count = 0` renders a stray `0` on screen, because `&&` returns the falsy left side and React renders `0` as text. Guard it: `{count > 0 && <Badge />}`.',
        es: '**La trampa del `&&`:** `{count && <Badge />}` con `count = 0` pinta un `0` perdido en pantalla, porque `&&` devuelve el lado izquierdo falsy y React renderiza `0` como texto. Protégelo: `{count > 0 && <Badge />}`.',
      },
    },
    {
      kind: 'text',
      body: {
        en: '### Early returns\n\nFor complex branching, return early before the main JSX. It reads like plain JavaScript — because it is.',
        es: '### Retornos tempranos\n\nPara ramificaciones complejas, retorna antes del JSX principal. Se lee como JavaScript normal, porque lo es.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function Profile({ user, isLoading, error }) {
  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!user) return <LoginPrompt />;
  return <Dashboard user={user} />;
}`,
    },
    {
      kind: 'text',
      body: {
        en: '### Lists: `map()`\n\nTo render a list, transform data into elements with `map()`. One element per item — React renders the resulting array.',
        es: '### Listas: `map()`\n\nPara renderizar una lista, transforma datos en elementos con `map()`. Un elemento por item: React renderiza el array resultante.',
      },
    },
    {
      kind: 'code',
      lang: 'jsx',
      code: `function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
    },
    {
      kind: 'text',
      body: {
        en: '### Keys: React’s ID system\n\nThat `key` is how React tells list items apart between renders. Same key → same component instance, updated in place. New key → a fresh mount. Missing key → unmount.\n\nUse a **stable, unique id from your data** (database id, slug). Keys only need to be unique among siblings.',
        es: '### Keys: el sistema de identificación de React\n\nEsa `key` es como React distingue los elementos de una lista entre renders. Misma key → misma instancia del componente, actualizada en su sitio. Key nueva → montaje desde cero. Key ausente → desmontaje.\n\nUsa un **id estable y único de tus datos** (id de base de datos, slug). Las keys solo deben ser únicas entre hermanos.',
      },
    },
    {
      kind: 'callout',
      type: 'danger',
      text: {
        en: '**Never** use the array index as key when the order can change (add / remove / reorder): identity gets glued to the *position* and state sticks to the wrong item. And never `key={Math.random()}` — a new key every render forces React to destroy and recreate every item each time.',
        es: '**Nunca** uses el índice del array como key cuando el orden puede cambiar (añadir / quitar / reordenar): la identidad se pega a la *posición* y el estado queda en el elemento equivocado. Y jamás `key={Math.random()}`: una key nueva en cada render obliga a React a destruir y recrear cada elemento cada vez.',
      },
    },
    {
      kind: 'flow',
      steps: [
        {
          label: { en: 'State changes', es: 'El estado cambia' },
          desc: { en: 'e.g. a new item is added', es: 'p. ej. se añade un elemento' },
        },
        {
          label: { en: 'map() produces keyed elements', es: 'map() produce elementos con key' },
          desc: { en: 'one element per item, each with its key', es: 'un elemento por item, cada uno con su key' },
        },
        {
          label: { en: 'React matches keys old → new', es: 'React empareja keys (antes → ahora)' },
          desc: { en: 'same key: update · new key: mount · gone key: unmount', es: 'misma key: actualizar · key nueva: montar · key ausente: desmontar' },
        },
        {
          label: { en: 'Only the difference hits the DOM', es: 'Solo la diferencia llega al DOM' },
          desc: { en: 'unchanged items are left alone', es: 'los elementos sin cambios se dejan intactos' },
        },
      ],
    },
    { kind: 'labref', labId: 'conditional-lab' },
    { kind: 'labref', labId: 'list-keys-lab' },
    { kind: 'quizref', quizId: 'conditional-lists' },
  ],
}
