import { useState } from 'react'
import { ChevronDown, FlaskConical } from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Quiz,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'
import JsConsole from '../../runtime/JsConsole.jsx'

const STRINGS = {
  intro: {
    en: 'React assumes six JavaScript ideas. Expand each one, run the snippet in the console, and make sure it clicks before you move on.',
    es: 'React da por sabidas seis ideas de JavaScript. Expande cada una, ejecuta el fragmento en la consola y asegúrate de entenderla antes de seguir.',
  },
  checklist: { en: 'The checklist', es: 'La lista de chequeo' },
  tryIt: { en: 'Try it in the console', es: 'Pruébalo en la consola' },
  quizTitle: { en: 'The readiness quiz', es: 'El quiz de preparación' },
  quizHint: {
    en: 'Six questions, instant feedback. Answer all of them, then check your result below.',
    es: 'Seis preguntas con feedback instantáneo. Responde todas y mira tu resultado abajo.',
  },
  resultReady: { en: 'You are ready for React!', es: '¡Estás listo para React!' },
  resultReadyBody: {
    en: 'Solid JavaScript foundations. Move on to Module 1 and see why React exists.',
    es: 'Base sólida de JavaScript. Pasa al módulo 1 y descubre por qué existe React.',
  },
  resultAlmost: { en: 'Almost there', es: 'Casi lo tienes' },
  resultAlmostBody: {
    en: 'Review the highlighted topics above, then retake the quiz.',
    es: 'Repasa los temas destacados arriba y vuelve a hacer el quiz.',
  },
  resultReview: { en: 'Review these topics first', es: 'Repasa estos temas primero' },
  resultReviewBody: {
    en: 'React will feel much easier once these click. Click a topic to jump back to it.',
    es: 'React será mucho más fácil cuando los entiendas. Pulsa un tema para volver a él.',
  },
  retake: { en: 'Retake the quiz', es: 'Repetir el quiz' },
}

const TOPICS = [
  {
    key: 'map',
    title: { en: 'map()', es: 'map()' },
    blurb: {
      en: 'Transforms every item of an array and returns a NEW array. React renders lists with it constantly.',
      es: 'Transforma cada elemento de un array y devuelve un array NUEVO. React lo usa sin parar para renderizar listas.',
    },
    code: 'const nums = [1, 2, 3];\nconst doubled = nums.map((n) => n * 2);\nconsole.log(doubled); // [2, 4, 6]\nconsole.log(nums);    // [1, 2, 3] — untouched',
    demo: 'const nums = [1, 2, 3];\nconst doubled = nums.map((n) => n * 2);\nconsole.log("doubled:", doubled);\nconsole.log("original:", nums);',
  },
  {
    key: 'destructuring',
    title: { en: 'Destructuring', es: 'Destructuring' },
    blurb: {
      en: 'Pulls named fields out of an object in one line. Props and state arrive as objects — you will destructure them daily.',
      es: 'Extrae campos con nombre de un objeto en una línea. Las props y el estado llegan como objetos: harás destructuring a diario.',
    },
    code: 'const user = { name: "Ada", age: 36 };\nconst { name, age } = user;\nconsole.log(name); // "Ada"',
    demo: 'const user = { name: "Ada", age: 36, role: "Dev" };\nconst { name, role } = user;\nconsole.log(name, "-", role);',
  },
  {
    key: 'arrow',
    title: { en: 'Arrow functions', es: 'Arrow functions' },
    blurb: {
      en: 'Short function syntax: (args) => result. With a single expression, the result is returned automatically.',
      es: 'Sintaxis corta de función: (args) => resultado. Con una sola expresión, el resultado se devuelve automáticamente.',
    },
    code: 'const add = (a, b) => a + b;\nconst greet = (name) => `Hello, ${name}!`;\nconsole.log(add(2, 3));      // 5\nconsole.log(greet("Jon"));   // "Hello, Jon!"',
    demo: 'const add = (a, b) => a + b;\nconst greet = (name) => "Hello, " + name + "!";\nconsole.log(add(2, 3));\nconsole.log(greet("Jon"));',
  },
  {
    key: 'callback',
    title: { en: 'Callbacks', es: 'Callbacks' },
    blurb: {
      en: 'A function passed as an argument, to be called later. Every onClick handler in React is a callback.',
      es: 'Una función pasada como argumento para ser llamada más tarde. Cada manejador onClick en React es un callback.',
    },
    code: 'function runTwice(fn) {\n  fn();\n  fn();\n}\nrunTwice(() => console.log("hi"));',
    demo: 'function runTwice(fn) {\n  fn();\n  fn();\n}\nrunTwice(() => console.log("hi from the callback"));',
  },
  {
    key: 'spread',
    title: { en: 'Spread (...)', es: 'Spread (...)' },
    blurb: {
      en: 'Copies arrays and objects with changes applied. React state is replaced, never mutated — spread is how you do it.',
      es: 'Copia arrays y objetos aplicando cambios. El estado en React se reemplaza, nunca se muta: spread es la forma de hacerlo.',
    },
    code: 'const user = { name: "Ada", age: 36 };\nconst older = { ...user, age: 37 };\nconsole.log(user.age);  // 36 — untouched\nconsole.log(older.age); // 37',
    demo: 'const nums = [1, 2, 3];\nconst more = [...nums, 4];\nconsole.log("copy:", more);\nconsole.log("original:", nums);',
  },
  {
    key: 'modules',
    title: { en: 'import / export', es: 'import / export' },
    blurb: {
      en: 'React apps are split into files. Each file exports components and imports what it needs. (No console demo — modules live in files, not snippets.)',
      es: 'Las apps React se dividen en ficheros. Cada fichero exporta componentes e importa lo que necesita. (Sin demo de consola: los módulos viven en ficheros, no en fragmentos.)',
    },
    code: '// Button.jsx\nfunction Button() { /* ... */ }\nexport default Button;\n\n// App.jsx\nimport Button from "./Button.jsx";',
    demo: null,
  },
]

const QUIZ_QUESTIONS = [
  {
    q: {
      en: 'What does [1, 2, 3].map((n) => n * 2) return?',
      es: '¿Qué devuelve [1, 2, 3].map((n) => n * 2)?',
    },
    options: [
      { en: '[2, 4, 6]', es: '[2, 4, 6]' },
      { en: '[1, 2, 3]', es: '[1, 2, 3]' },
      { en: '12', es: '12' },
      { en: 'It throws an error', es: 'Lanza un error' },
    ],
    answer: 0,
    explain: {
      en: 'map returns a NEW array with the function applied to each item.',
      es: 'map devuelve un array NUEVO con la función aplicada a cada elemento.',
    },
    topic: 'map',
  },
  {
    q: {
      en: 'After const { name } = { name: "Ada", age: 36 }; — what is name?',
      es: 'Tras const { name } = { name: "Ada", age: 36 }; — ¿qué vale name?',
    },
    options: [
      { en: '"Ada"', es: '"Ada"' },
      { en: '{ name: "Ada", age: 36 }', es: '{ name: "Ada", age: 36 }' },
      { en: 'undefined', es: 'undefined' },
      { en: 'It throws an error', es: 'Lanza un error' },
    ],
    answer: 0,
    explain: {
      en: 'Destructuring pulls the named property out of the object.',
      es: 'Destructuring extrae la propiedad nombrada del objeto.',
    },
    topic: 'destructuring',
  },
  {
    q: {
      en: 'Which is a valid arrow function that adds two numbers?',
      es: '¿Cuál es una arrow function válida que suma dos números?',
    },
    options: [
      { en: 'const add = (a, b) => a + b;', es: 'const add = (a, b) => a + b;' },
      { en: 'const add = (a, b) -> a + b;', es: 'const add = (a, b) -> a + b;' },
      { en: 'function add = (a, b) => a + b;', es: 'function add = (a, b) => a + b;' },
      { en: 'add(a, b) => return a + b;', es: 'add(a, b) => return a + b;' },
    ],
    answer: 0,
    explain: {
      en: 'Arrow functions use =>. With a single expression, the result is returned implicitly.',
      es: 'Las arrow functions usan =>. Con una sola expresión, el resultado se devuelve implícitamente.',
    },
    topic: 'arrow',
  },
  {
    q: {
      en: 'In setTimeout(() => console.log("hi"), 1000); the arrow function is…',
      es: 'En setTimeout(() => console.log("hi"), 1000); la arrow function es…',
    },
    options: [
      { en: 'a callback', es: 'un callback' },
      { en: 'a promise', es: 'una promesa' },
      { en: 'a React hook', es: 'un hook de React' },
      { en: 'a component', es: 'un componente' },
    ],
    answer: 0,
    explain: {
      en: 'A callback is a function you pass to be called later — here, after 1000 ms.',
      es: 'Un callback es una función que pasas para ser llamada más tarde; aquí, tras 1000 ms.',
    },
    topic: 'callback',
  },
  {
    q: {
      en: 'What does const b = [...a, 4]; do?',
      es: '¿Qué hace const b = [...a, 4];?',
    },
    options: [
      {
        en: "Creates a new array with a's items plus 4",
        es: 'Crea un array nuevo con los elementos de a más el 4',
      },
      { en: 'Mutates a by pushing 4 into it', es: 'Muta a añadiéndole el 4' },
      { en: 'Creates [[...], 4], a nested array', es: 'Crea [[...], 4], un array anidado' },
      { en: 'Copies a by reference', es: 'Copia a por referencia' },
    ],
    answer: 0,
    explain: {
      en: 'Spread copies the items into a brand-new array — the original is untouched.',
      es: 'Spread copia los elementos en un array totalmente nuevo: el original no se toca.',
    },
    topic: 'spread',
  },
  {
    q: {
      en: 'How do you import the default export from ./Button.jsx?',
      es: '¿Cómo importas el export por defecto de ./Button.jsx?',
    },
    options: [
      { en: 'import Button from "./Button.jsx";', es: 'import Button from "./Button.jsx";' },
      { en: 'import { Button } from "./Button.jsx";', es: 'import { Button } from "./Button.jsx";' },
      { en: 'from "./Button.jsx" import Button;', es: 'from "./Button.jsx" import Button;' },
      { en: 'require Button from "./Button.jsx";', es: 'require Button from "./Button.jsx";' },
    ],
    answer: 0,
    explain: {
      en: 'Default imports have no braces; named imports use braces matching the export name.',
      es: 'Los imports por defecto no llevan llaves; los nombrados usan llaves con el nombre del export.',
    },
    topic: 'modules',
  },
]

export default function ReadinessLab() {
  const { t } = useLang()
  const [open, setOpen] = useState(new Set(['map']))
  const [result, setResult] = useState(null)
  const [quizKey, setQuizKey] = useState(0)

  const toggle = (key) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const jumpToTopic = (key) => {
    setOpen((prev) => new Set(prev).add(key))
    requestAnimationFrame(() => {
      document.getElementById(`topic-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const failedTopics = result
    ? [...new Set(QUIZ_QUESTIONS.map((q, i) => (result.picked[i] === q.answer ? null : q.topic)).filter(Boolean))]
    : []

  return (
    <SimulationShell
      labId="readiness-check"
      title={t({ en: 'Are you ready for React?', es: '¿Estás listo para React?' })}
      intro={t({
        en: 'A hands-on check of the JavaScript you need: run each snippet, then take the quiz.',
        es: 'Un chequeo práctico del JavaScript que necesitas: ejecuta cada fragmento y haz el quiz.',
      })}
      difficulty="beginner"
    >
      <p className="text-[var(--text)] mb-2">{t(STRINGS.intro)}</p>

      <SectionTitle>{t(STRINGS.checklist)}</SectionTitle>
      <div className="flex flex-col gap-3">
        {TOPICS.map((topic) => {
          const isOpen = open.has(topic.key)
          return (
            <div
              key={topic.key}
              id={`topic-${topic.key}`}
              className="card overflow-hidden scroll-mt-24"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`panel-${topic.key}`}
                onClick={() => toggle(topic.key)}
              >
                <span className="font-bold text-[var(--text-strong)]">
                  <span className="mono text-[var(--accent)] mr-2">{TOPICS.indexOf(topic) + 1}.</span>
                  {t(topic.title)}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div id={`panel-${topic.key}`} className="px-5 pb-5">
                  <p className="text-sm text-[var(--muted)] mb-3">{t(topic.blurb)}</p>
                  <CodeBlock code={topic.code} lang="js" />
                  {topic.demo && (
                    <>
                      <p className="text-sm font-semibold text-[var(--text-strong)] mt-4">
                        {t(STRINGS.tryIt)}
                      </p>
                      <JsConsole code={topic.demo} />
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <SectionTitle>{t(STRINGS.quizTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-2">{t(STRINGS.quizHint)}</p>
      <Quiz
        key={quizKey}
        quizId="readiness-check"
        questions={QUIZ_QUESTIONS}
        onFinish={(r) => setResult(r)}
      />

      {result && (
        <div className="card p-6 mt-6" role="status">
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical size={22} className="text-[var(--accent)]" aria-hidden="true" />
            <h3 className="text-lg font-bold text-[var(--text-strong)]">
              {result.score >= 5
                ? t(STRINGS.resultReady)
                : result.score >= 3
                  ? t(STRINGS.resultAlmost)
                  : t(STRINGS.resultReview)}
            </h3>
          </div>
          <p className="text-sm text-[var(--muted)] mb-4">
            {result.score >= 5
              ? t(STRINGS.resultReadyBody)
              : result.score >= 3
                ? t(STRINGS.resultAlmostBody)
                : t(STRINGS.resultReviewBody)}
          </p>
          {failedTopics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {failedTopics.map((key) => {
                const topic = TOPICS.find((x) => x.key === key)
                return (
                  <button
                    key={key}
                    type="button"
                    className="btn !py-1.5 !px-3 !text-xs"
                    onClick={() => jumpToTopic(key)}
                  >
                    ↩ {t(topic.title)}
                  </button>
                )
              })}
            </div>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => {
              setResult(null)
              setQuizKey((k) => k + 1)
            }}
          >
            {t(STRINGS.retake)}
          </button>
        </div>
      )}

      <Callout type="tip">
        {t({
          en: 'React is mostly these six ideas applied to UI. If they feel solid, the rest of the academy will feel like play.',
          es: 'React son estas seis ideas aplicadas a la UI. Si las dominas, el resto de la academia será un juego.',
        })}
      </Callout>
    </SimulationShell>
  )
}
