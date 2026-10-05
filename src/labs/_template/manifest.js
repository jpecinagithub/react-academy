// TEMPLATE — copy this directory to labs/<your-lab>/ and adapt.
// manifest.js: the ONLY file the loader reads eagerly. Keep it tiny and
// synchronous: id, moduleId, bilingual title/intro, difficulty, order,
// and a lazy `load` for the Lab component.
//
// Contract (see docs/CONTRACTS.md):
//   - id: kebab-case, unique, used in /lab/<id> and progress.labs[id]
//   - moduleId: one of src/data/modules.js ids
//   - difficulty: 'beginner' | 'intermediate' | 'advanced'
//   - load: () => import('./Lab.jsx')  (React.lazy compatible)
export default {
  id: 'my-lab',
  moduleId: 'state',
  title: { en: 'My Lab', es: 'Mi laboratorio' },
  intro: {
    en: 'What the user will manipulate here, in one or two sentences.',
    es: 'Lo que el usuario manipulará aquí, en una o dos frases.',
  },
  difficulty: 'beginner',
  order: 1,
  load: () => import('./Lab.jsx'),
}
