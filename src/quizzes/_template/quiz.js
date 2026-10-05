// TEMPLATE — copy to quizzes/<module-id>/quiz.js and adapt.
// Quiz id MUST equal the module id (Quizzes page links /quiz/<moduleId>).
// Question: { q: {en,es}, options: [{en,es} × n], answer: index, explain?: {en,es} }
export default {
  id: 'my-module',
  title: { en: 'My module quiz', es: 'Quiz de mi módulo' },
  questions: [
    {
      q: { en: 'What does useState return?', es: '¿Qué devuelve useState?' },
      options: [
        { en: 'The current value only', es: 'Solo el valor actual' },
        { en: 'A [value, setter] pair', es: 'Un par [valor, setter]' },
        { en: 'A render function', es: 'Una función de render' },
      ],
      answer: 1,
      explain: {
        en: 'useState returns an array: the current value and the function that updates it.',
        es: 'useState devuelve un array: el valor actual y la función que lo actualiza.',
      },
    },
  ],
}
