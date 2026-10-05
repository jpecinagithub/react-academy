// List Reconciliation Lab — the same stateful items, shuffled with stable keys
// vs positional (index) keys. Watch identity follow the key, not the slot.
import { useRef, useState } from 'react'
import { Plus, Minus, Shuffle, ArrowLeftRight, Trash2, RotateCcw, KeyRound } from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Compare,
  Quiz,
  GlossaryTerm,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  intro2: {
    en: 'Each card below is a real component with its own internal state (a counter). Shuffle the list in both modes and watch where the counters go.',
    es: 'Cada tarjeta es un componente real con su propio estado interno (un contador). Reordena la lista en ambos modos y observa a dónde van los contadores.',
  },
  modeTitle: { en: '1 · Key strategy', es: '1 · Estrategia de keys' },
  modeHint: {
    en: 'Switching strategy remounts every item — React cannot match old keys to a new scheme. That reset is itself a lesson.',
    es: 'Cambiar de estrategia desmonta todos los elementos: React no puede emparejar keys antiguas con un esquema nuevo. Ese reinicio ya es una lección.',
  },
  withKeys: { en: 'With keys', es: 'Con keys' },
  withoutKeys: { en: 'Without keys (index)', es: 'Sin keys (índice)' },
  withKeysDesc: {
    en: 'key={item.id} — stable identity',
    es: 'key={item.id}: identidad estable',
  },
  withoutKeysDesc: {
    en: 'key={index} — identity = position',
    es: 'key={index}: identidad = posición',
  },
  controlsTitle: { en: '2 · Mutate the list', es: '2 · Muta la lista' },
  add: { en: 'Add', es: 'Añadir' },
  remove: { en: 'Remove last', es: 'Quitar último' },
  shuffle: { en: 'Shuffle', es: 'Mezclar' },
  reverse: { en: 'Reverse', es: 'Invertir' },
  resetDemo: { en: 'Reset demo', es: 'Reiniciar demo' },
  listTitle: { en: '3 · The list', es: '3 · La lista' },
  keyChip: { en: 'key', es: 'key' },
  instance: { en: 'component instance', es: 'instancia del componente' },
  clicks: { en: 'internal clicks', es: 'clics internos' },
  explainTitle: { en: '4 · What just happened?', es: '4 · ¿Qué acaba de pasar?' },
  explainKeys: {
    en: 'With stable keys, React matches each rendered card to the same component instance across renders — like an ID badge. Shuffle the order and every counter travels with its card, because the key travels with it.',
    es: 'Con keys estables, React empareja cada tarjeta con la misma instancia del componente entre renders, como una credencial. Al mezclar, cada contador viaja con su tarjeta porque la key viaja con ella.',
  },
  explainIndex: {
    en: 'With index keys, React matches by position: slot 0 keeps instance #1 no matter which item moved there. The counters stayed put while the labels moved — state got attached to the wrong item. That is the bug.',
    es: 'Con keys de índice, React empareja por posición: la ranura 0 conserva la instancia n.º 1 sin importar qué elemento llegó allí. Los contadores se quedaron quietos mientras las etiquetas se movían: el estado se pegó al elemento equivocado. Ese es el bug.',
  },
  antiTitle: {
    en: 'Never use these as keys',
    es: 'Nunca uses esto como keys',
  },
  antiBody: {
    en: 'Array index when the order can change (add / remove / reorder), and key={Math.random()} — a new random key every render forces React to destroy and recreate every item on every render, losing all internal state.',
    es: 'El índice del array cuando el orden puede cambiar (añadir / quitar / reordenar), y key={Math.random()}: una key aleatoria nueva en cada render obliga a React a destruir y recrear cada elemento en cada render, perdiendo todo el estado interno.',
  },
  codeTitle: { en: '5 · The code', es: '5 · El código' },
  challengeTitle: { en: '6 · Challenge', es: '6 · Reto' },
  tipTitle: {
    en: 'Keys only need to be unique among siblings',
    es: 'Las keys solo deben ser únicas entre hermanos',
  },
  tipBody: {
    en: 'Use a stable id from your data (database id, slug…). React uses the key to decide: same key → update in place; new key → mount; missing key → unmount.',
    es: 'Usa un id estable de tus datos (id de base de datos, slug…). React usa la key para decidir: misma key → actualizar; key nueva → montar; key ausente → desmontar.',
  },
}

const PALETTE = ['#61dafb', '#3ddc97', '#ffb454', '#c792ea', '#ff8a80', '#82aaff', '#f07178']

const INITIAL = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
  { id: 'c', label: 'C' },
]

let mountSeq = 0
let idSeq = 0

function StatefulItem({ label, reactKey, color }) {
  const [clicks, setClicks] = useState(0)
  const inst = useRef(0)
  if (inst.current === 0) inst.current = ++mountSeq
  const { t } = useLang()
  return (
    <div
      className="rounded-xl border-2 p-4 flex flex-col gap-3 bg-[var(--surface-3)] min-w-[11rem]"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <span
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-black text-[var(--accent-ink)]"
          style={{ background: color }}
          aria-hidden="true"
        >
          {label}
        </span>
        <code
          className="text-[11px] font-mono px-2 py-1 rounded-md"
          style={{ background: 'var(--code-bg)', color: 'var(--accent)' }}
          title={t(STRINGS.keyChip)}
        >
          key={typeof reactKey === 'string' ? `"${reactKey}"` : `{${reactKey}}`}
        </code>
      </div>
      <p className="text-xs text-[var(--muted)]">
        {t(STRINGS.instance)} <strong className="text-[var(--text-strong)] font-mono">#{inst.current}</strong>
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-[var(--muted)]">{t(STRINGS.clicks)}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="btn !px-2 !py-1"
            onClick={() => setClicks((c) => c - 1)}
            aria-label={`${label} −1`}
          >
            <Minus size={13} />
          </button>
          <span className="font-mono font-bold w-7 text-center text-[var(--text-strong)]" aria-live="polite">
            {clicks}
          </span>
          <button
            type="button"
            className="btn !px-2 !py-1"
            onClick={() => setClicks((c) => c + 1)}
            aria-label={`${label} +1`}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const QUIZ = [
  {
    q: {
      en: 'What are keys for?',
      es: '¿Para qué sirven las keys?',
    },
    options: [
      { en: 'Styling list items', es: 'Dar estilo a los elementos' },
      {
        en: 'Helping React match elements between renders (identity)',
        es: 'Ayudar a React a emparejar elementos entre renders (identidad)',
      },
      { en: 'Sorting the list automatically', es: 'Ordenar la lista automáticamente' },
      { en: 'Making renders faster by magic', es: 'Acelerar renders por arte de magia' },
    ],
    answer: 1,
    explain: {
      en: 'Keys are React’s ID system: same key → same component instance, updated in place.',
      es: 'Las keys son el sistema de identificación de React: misma key → misma instancia, actualizada en su sitio.',
    },
  },
  {
    q: {
      en: 'When does key={index} break?',
      es: '¿Cuándo rompe key={index}?',
    },
    options: [
      { en: 'Never — it is always safe', es: 'Nunca: siempre es seguro' },
      { en: 'When the list order can change', es: 'Cuando el orden de la lista puede cambiar' },
      { en: 'When the list has more than 10 items', es: 'Cuando la lista tiene más de 10 elementos' },
      { en: 'Only in production builds', es: 'Solo en builds de producción' },
    ],
    answer: 1,
    explain: {
      en: 'Index keys bind identity to position. Reorder, insert or remove and state sticks to the wrong item.',
      es: 'Las keys de índice atan la identidad a la posición. Reordena, inserta o elimina y el estado se pega al elemento equivocado.',
    },
  },
  {
    q: {
      en: 'What does key={Math.random()} do?',
      es: '¿Qué hace key={Math.random()}?',
    },
    options: [
      { en: 'Gives every item a unique, stable key', es: 'Da a cada elemento una key única y estable' },
      {
        en: 'Creates a new key every render → React remounts everything, losing state',
        es: 'Crea una key nueva en cada render → React desmonta todo y se pierde el estado',
      },
      { en: 'Nothing — React ignores it', es: 'Nada: React la ignora' },
      { en: 'Speeds up reconciliation', es: 'Acelera la reconciliación' },
    ],
    answer: 1,
    explain: {
      en: 'A key that changes every render is worse than an index: every item is destroyed and recreated every time.',
      es: 'Una key que cambia en cada render es peor que un índice: cada elemento se destruye y se recrea cada vez.',
    },
  },
]

export default function ListKeysLab() {
  const { t } = useLang()
  const [mode, setMode] = useState('keys') // 'keys' | 'index'
  const [items, setItems] = useState(INITIAL)
  const [order, setOrder] = useState(INITIAL.map((i) => i.id))

  const resetAll = (nextMode = mode) => {
    setMode(nextMode)
    setItems(INITIAL)
    setOrder(INITIAL.map((i) => i.id))
  }

  const switchMode = (m) => {
    if (m !== mode) resetAll(m)
  }

  const add = () => {
    idSeq += 1
    const id = `n${idSeq}`
    const label = String.fromCharCode(68 + idSeq - 1) // D, E, F…
    setItems((it) => [...it, { id, label }])
    setOrder((o) => [...o, id])
  }
  const remove = () => {
    if (order.length <= 1) return
    const id = order[order.length - 1]
    setOrder((o) => o.slice(0, -1))
    setItems((it) => it.filter((i) => i.id !== id))
  }

  const byId = Object.fromEntries(items.map((i) => [i.id, i]))
  const colorOf = (id) => {
    const idx = items.findIndex((i) => i.id === id)
    return PALETTE[idx % PALETTE.length]
  }

  const CODE = `// ${mode === 'keys' ? 'stable keys — identity follows the item' : 'index keys — identity follows the POSITION'}
// ${mode === 'keys' ? 'keys estables: la identidad sigue al elemento' : 'keys de índice: la identidad sigue a la POSICIÓN'}
<ul>
  {order.map((id${mode === 'index' ? ', index' : ''}) => (
    <StatefulItem
      key={${mode === 'keys' ? 'id' : 'index'}}
      label={items[id].label}
    />
  ))}
</ul>`

  return (
    <SimulationShell
      labId="list-keys-lab"
      title={t({ en: 'List Reconciliation Lab', es: 'Laboratorio de reconciliación de listas' })}
      intro={t({
        en: 'Keys are how React tells your list items apart. Give each item a stable key, or a positional one — then shuffle and see what React believes.',
        es: 'Las keys son como React distingue los elementos de tu lista. Dale a cada elemento una key estable o una posicional, mezcla y mira qué cree React.',
      })}
      difficulty="beginner"
    >
      <p className="text-[var(--text)] mb-6 max-w-3xl">
        <GlossaryTerm term="key">{t({ en: 'key', es: 'key' })}</GlossaryTerm>{' '}
        {t({
          en: 'is the identity card React pins on each list item. Same key between renders → same component, updated in place. New key → a fresh mount.',
          es: 'es la credencial que React prende a cada elemento de la lista. Misma key entre renders → mismo componente, actualizado en su sitio. Key nueva → montaje desde cero.',
        })}
      </p>

      <SectionTitle>{t(STRINGS.modeTitle)}</SectionTitle>
      <p className="text-sm text-[var(--muted)] mb-4">{t(STRINGS.modeHint)}</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-2" role="group" aria-label={t(STRINGS.modeTitle)}>
        {[
          { id: 'keys', title: STRINGS.withKeys, desc: STRINGS.withKeysDesc },
          { id: 'index', title: STRINGS.withoutKeys, desc: STRINGS.withoutKeysDesc },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => switchMode(m.id)}
            aria-pressed={mode === m.id}
            className="text-left px-4 py-3 rounded-xl border-2 transition-colors"
            style={{
              borderColor: mode === m.id ? 'var(--accent)' : 'var(--border)',
              background: mode === m.id ? 'var(--accent-dim)' : 'var(--surface-2)',
            }}
          >
            <span className="font-bold text-[var(--text-strong)] flex items-center gap-2">
              <KeyRound size={15} aria-hidden="true" /> {t(m.title)}
            </span>
            <span className="text-xs font-mono text-[var(--muted)]">{t(m.desc)}</span>
          </button>
        ))}
      </div>

      <SectionTitle>{t(STRINGS.controlsTitle)}</SectionTitle>
      <div className="flex flex-wrap gap-2 mb-6">
        <button type="button" className="btn btn-primary" onClick={add}>
          <Plus size={15} /> {t(STRINGS.add)}
        </button>
        <button type="button" className="btn" onClick={remove}>
          <Trash2 size={15} /> {t(STRINGS.remove)}
        </button>
        <button type="button" className="btn" onClick={() => setOrder((o) => shuffled(o))}>
          <Shuffle size={15} /> {t(STRINGS.shuffle)}
        </button>
        <button type="button" className="btn" onClick={() => setOrder((o) => [...o].reverse())}>
          <ArrowLeftRight size={15} /> {t(STRINGS.reverse)}
        </button>
        <button type="button" className="btn" onClick={() => resetAll()}>
          <RotateCcw size={15} /> {t(STRINGS.resetDemo)}
        </button>
      </div>

      <SectionTitle>{t(STRINGS.listTitle)}</SectionTitle>
      <div className="flex flex-wrap gap-4" aria-live="polite">
        {order.map((id, i) => (
          <StatefulItem
            key={mode === 'keys' ? id : i}
            label={byId[id]?.label ?? '?'}
            reactKey={mode === 'keys' ? id : i}
            color={colorOf(id)}
          />
        ))}
      </div>
      {mode === 'index' && (
        <Callout type="danger" title={t({ en: 'Watch the counters', es: 'Observa los contadores' })}>
          {t({
            en: 'Click +1 on a card, then Shuffle. The counters did not move with their letters — they stayed in their slots. State is now attached to the wrong item.',
            es: 'Pulsa +1 en una tarjeta y luego Mezclar. Los contadores no se movieron con sus letras: se quedaron en su ranura. El estado quedó pegado al elemento equivocado.',
          })}
        </Callout>
      )}

      <SectionTitle>{t(STRINGS.explainTitle)}</SectionTitle>
      <Compare
        cols={[
          {
            title: t(STRINGS.withKeys),
            children: <p className="text-sm text-[var(--text)]">{t(STRINGS.explainKeys)}</p>,
          },
          {
            title: t(STRINGS.withoutKeys),
            children: <p className="text-sm text-[var(--text)]">{t(STRINGS.explainIndex)}</p>,
          },
        ]}
      />
      <Callout type="danger" title={t(STRINGS.antiTitle)}>
        {t(STRINGS.antiBody)}
      </Callout>
      <Callout type="tip" title={t(STRINGS.tipTitle)}>
        {t(STRINGS.tipBody)}
      </Callout>

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <CodeBlock code={CODE} lang="jsx" />

      <SectionTitle>{t(STRINGS.challengeTitle)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="list-keys-lab-challenge" />
    </SimulationShell>
  )
}
