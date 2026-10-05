export default {
  id: 'internals',
  title: { en: 'Internals quiz', es: 'Quiz de interioridades' },
  questions: [
    {
      q: {
        en: 'On re-render, React sees the same component type at the same position with the same key as before. What does it do?',
        es: 'En un re-render, React ve el mismo tipo de componente en la misma posición y con la misma key que antes. ¿Qué hace?',
      },
      options: [
        { en: 'It unmounts the old one and mounts a fresh one', es: 'Desmonta el antiguo y monta uno nuevo' },
        { en: 'It updates the existing instance in place, preserving its state', es: 'Actualiza la instancia existente en su lugar, conservando su estado' },
        { en: 'It skips rendering that subtree entirely', es: 'Omite por completo el render de ese subárbol' },
      ],
      answer: 1,
      explain: {
        en: 'Same type + same key at the same position means "the same element": React updates props and re-renders, but the component instance and its state survive.',
        es: 'Mismo tipo + misma key en la misma posición significa "el mismo elemento": React actualiza las props y re-renderiza, pero la instancia del componente y su estado sobreviven.',
      },
    },
    {
      q: {
        en: 'A toggle switches between rendering <input> and <textarea> at the same position. The user typed text, then toggled. What happens to the typed text?',
        es: 'Un interruptor alterna entre renderizar <input> y <textarea> en la misma posición. El usuario escribió texto y luego alternó. ¿Qué pasa con el texto escrito?',
      },
      options: [
        { en: 'It is preserved, because the position is the same', es: 'Se conserva, porque la posición es la misma' },
        { en: 'It is lost: different element types cause an unmount and a fresh remount', es: 'Se pierde: tipos de elemento distintos provocan desmontaje y un montaje nuevo' },
        { en: 'It moves to the new element automatically', es: 'Se traslada al nuevo elemento automáticamente' },
      ],
      answer: 1,
      explain: {
        en: 'React treats different types as entirely different elements. It tears down the old tree (losing its state) and builds the new one from scratch.',
        es: 'React trata los tipos distintos como elementos completamente diferentes. Derriba el árbol antiguo (perdiendo su estado) y construye el nuevo desde cero.',
      },
    },
    {
      q: {
        en: 'What is the Virtual DOM?',
        es: '¿Qué es el Virtual DOM?',
      },
      options: [
        { en: 'A copy of the real DOM kept in the browser for backup', es: 'Una copia del DOM real guardada en el navegador como respaldo' },
        { en: 'A lightweight JavaScript description of the UI that React diffs against the previous one before touching the real DOM', es: 'Una descripción ligera en JavaScript de la UI que React compara con la anterior antes de tocar el DOM real' },
        { en: 'A faster replacement for the browser DOM used by React apps', es: 'Un sustituto más rápido del DOM del navegador usado por las apps React' },
        { en: 'The HTML file that React renders into', es: 'El fichero HTML en el que React renderiza' },
      ],
      answer: 1,
      explain: {
        en: 'React renders to a plain JS object tree, compares ("diffs") it with the previous tree, and applies only the minimal real-DOM changes — that batching is reconciliation.',
        es: 'React renderiza a un árbol de objetos JS, lo compara ("diff") con el árbol anterior y aplica solo los cambios mínimos al DOM real: ese proceso es la reconciliación.',
      },
    },
    {
      q: {
        en: 'Why do list items need stable, unique keys?',
        es: '¿Por qué los elementos de una lista necesitan keys estables y únicas?',
      },
      options: [
        { en: 'Keys make the list render faster by skipping the diff', es: 'Las keys hacen la lista más rápida al omitir la comparación' },
        { en: 'Keys let React match each item across renders, so reordered items keep their state instead of being mixed up', es: 'Las keys permiten a React identificar cada elemento entre renders, así los elementos reordenados conservan su estado en lugar de mezclarse' },
        { en: 'Keys are only a linting convention with no runtime effect', es: 'Las keys son solo una convención del linter sin efecto en ejecución' },
      ],
      answer: 1,
      explain: {
        en: 'Without keys, React matches items by position. After a reorder, state "sticks" to the wrong item. A stable key (like an id) ties state to the right item.',
        es: 'Sin keys, React identifica elementos por posición. Tras un reorden, el estado "se pega" al elemento equivocado. Una key estable (como un id) vincula el estado al elemento correcto.',
      },
    },
    {
      q: {
        en: 'A todo list uses the array index as key. Each row has a checkbox with local state. The user checks the first todo, then deletes it. What will they see?',
        es: 'Una lista de tareas usa el índice del array como key. Cada fila tiene un checkbox con estado local. El usuario marca la primera tarea y luego la elimina. ¿Qué verá?',
      },
      options: [
        { en: 'The checkbox state disappears with the deleted todo, as expected', es: 'El estado del checkbox desaparece con la tarea eliminada, como se espera' },
        { en: 'The checkmark "moves" to the next todo, because the state was tied to position 0, not to the todo', es: 'La marca "se mueve" a la siguiente tarea, porque el estado estaba ligado a la posición 0, no a la tarea' },
        { en: 'React throws a duplicate key error', es: 'React lanza un error de key duplicada' },
      ],
      answer: 1,
      explain: {
        en: 'Index keys identify items by position. When the first item is removed, the old item at index 1 becomes index 0 and inherits the checked state. Use stable ids as keys.',
        es: 'Las keys por índice identifican elementos por posición. Al eliminar el primero, el antiguo elemento del índice 1 pasa al 0 y hereda el estado marcado. Usa ids estables como keys.',
      },
    },
  ],
}
