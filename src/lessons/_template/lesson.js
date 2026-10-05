// TEMPLATE — copy to lessons/<module-id>/<lesson-slug>/lesson.js and adapt.
// A lesson is data, not JSX: sections render through <LessonRenderer>.
// Section kinds: text | code | callout | flow | checklist | labref | quizref
//
//   { kind: 'text', body: { en, es } }        // markdown-lite (utils/markdown.jsx)
//   { kind: 'code', code: '...', lang: 'jsx' }
//   { kind: 'callout', type: 'info|warn|tip|danger', text: { en, es } }
//   { kind: 'flow', steps: [{ label: {en,es}, desc?: {en,es} }] }
//   { kind: 'checklist', items: [{ en, es }] }
//   { kind: 'labref', labId: 'state-lab' }    // card linking to a lab
//   { kind: 'quizref', quizId: 'state' }       // card linking to module quiz
export default {
  id: 'my-lesson',
  moduleId: 'state',
  order: 1,
  title: { en: 'My lesson', es: 'Mi lección' },
  sections: [
    {
      kind: 'text',
      body: {
        en: 'Short paragraphs. Keep them brief — **bold** key terms and use `code` for identifiers.\n\n- one idea per paragraph\n- experiment over explanation',
        es: 'Párrafos cortos. Sé breve: **negrita** para términos clave y `code` para identificadores.\n\n- una idea por párrafo\n- experimento antes que explicación',
      },
    },
    { kind: 'code', lang: 'jsx', code: 'const [count, setCount] = useState(0)' },
    { kind: 'labref', labId: 'my-lab' },
  ],
}
