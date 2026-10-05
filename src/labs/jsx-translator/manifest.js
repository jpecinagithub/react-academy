export default {
  id: 'jsx-translator',
  moduleId: 'jsx',
  title: { en: 'JSX Translator', es: 'Traductor JSX' },
  intro: {
    en: 'Type JSX and see what React actually understands: the createElement calls and the element tree.',
    es: 'Escribe JSX y mira lo que React entiende de verdad: las llamadas createElement y el árbol de elementos.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
