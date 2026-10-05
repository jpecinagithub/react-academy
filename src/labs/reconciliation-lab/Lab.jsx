import { useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
  Quiz,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: '**Reconciliation** is the algorithm React uses to compare two descriptions of the UI and decide, for every node: **keep** it, **update** it, **move** it, or **replace** it (unmount + remount). The rules are simple and mechanical — this lab makes each one visible.',
    es: 'La **reconciliación** es el algoritmo que React usa para comparar dos descripciones de la UI y decidir, para cada nodo: **conservarlo**, **actualizarlo**, **moverlo** o **reemplazarlo** (desmontar + remontar). Las reglas son simples y mecánicas; este laboratorio hace visible cada una.',
  },
  tabType: { en: '1 · Element type', es: '1 · Tipo de elemento' },
  tabProps: { en: '2 · Same type, new props', es: '2 · Mismo tipo, nuevas props' },
  tabKeys: { en: '3 · Reorder: keys vs index', es: '3 · Reordenar: keys vs índice' },
  tabComponent: { en: '4 · Component type', es: '4 · Tipo de componente' },
  before: { en: 'Before', es: 'Antes' },
  after: { en: 'After', es: 'Después' },
  decision: { en: 'React’s decision', es: 'Decisión de React' },
  keep: { en: 'KEEP', es: 'CONSERVAR' },
  update: { en: 'UPDATE', es: 'ACTUALIZAR' },
  replace: { en: 'REPLACE', es: 'REEMPLAZAR' },
  move: { en: 'MOVE', es: 'MOVER' },
  unmount: { en: 'UNMOUNT + MOUNT', es: 'DESMONTAR + MONTAR' },
  stateLost: { en: 'state lost!', es: '¡estado perdido!' },
  typeBody: {
    en: 'The element type changed (`div` → `span`). React does not try to morph one into the other: it **destroys the old DOM node and creates a new one**. Anything inside — DOM state, focus, animations — is gone.',
    es: 'El tipo de elemento cambió (`div` → `span`). React no intenta transformarlo: **destruye el nodo DOM anterior y crea uno nuevo**. Todo lo de dentro — estado del DOM, foco, animaciones — desaparece.',
  },
  propsBody: {
    en: 'Same element type, different props. React **keeps the DOM node** and only changes what differs — here, the `disabled` attribute. This is the cheapest possible update.',
    es: 'Mismo tipo de elemento, distintas props. React **conserva el nodo DOM** y solo cambia lo que difiere — aquí, el atributo `disabled`. Es la actualización más barata posible.',
  },
  keysBody: {
    en: 'Press **Shuffle** and watch what happens to each item’s private counter. With **stable keys**, React knows each item’s identity and **moves** the DOM nodes — counters travel with their item. With **index keys**, identity comes from the position: React keeps the node in place and pours new content into it — the counters stay at their positions and get mixed up. Keys are how React recognizes “the same item” across renders.',
    es: 'Pulsa **Mezclar** y observa qué pasa con el contador privado de cada elemento. Con **keys estables**, React conoce la identidad de cada elemento y **mueve** los nodos DOM: los contadores viajan con su elemento. Con **keys de índice**, la identidad viene de la posición: React conserva el nodo en su sitio y vierte el contenido nuevo en él — los contadores se quedan en su posición y se mezclan. Las keys son la forma en que React reconoce «el mismo elemento» entre renders.',
  },
  useKeys: { en: 'Stable keys', es: 'Keys estables' },
  useIndex: { en: 'Index as key', es: 'Índice como key' },
  shuffle: { en: 'Shuffle', es: 'Mezclar' },
  reset: { en: 'Reset', es: 'Restablecer' },
  componentBody: {
    en: 'Press **Switch wrapper**. `PanelA` and `PanelB` are different component types at the same position, so React **unmounts the whole subtree and mounts a fresh one** — the counter inside resets to zero. Component identity, not position, decides whether state survives.',
    es: 'Pulsa **Cambiar contenedor**. `PanelA` y `PanelB` son tipos de componente distintos en la misma posición, así que React **desmonta todo el subárbol y monta uno nuevo**: el contador interior vuelve a cero. La identidad del componente —no su posición— decide si el estado sobrevive.',
  },
  switchWrapper: { en: 'Switch wrapper', es: 'Cambiar contenedor' },
  challenge: { en: 'Challenge', es: 'Reto' },
}

const CODE_TYPE = `// before
<div className="box">Hello</div>
// after — same position, different TYPE
<span className="box">Hello</span>
// => React replaces the DOM node entirely`

const CODE_PROPS = `// before
<button disabled={false}>Save</button>
// after — same type, different prop
<button disabled={true}>Save</button>
// => React keeps the node, flips the attribute`

function Badge({ kind, children }) {
  const colors = {
    keep: 'var(--green)',
    update: 'var(--accent)',
    replace: 'var(--red)',
    move: 'var(--accent)',
    unmount: 'var(--red)',
  }
  return (
    <span
      className="mono inline-block text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: colors[kind], color: '#fff' }}
    >
      {children}
    </span>
  )
}

function NodeBox({ tag, children, faded }) {
  return (
    <div
      className="mono text-sm rounded-lg border p-3 bg-[var(--code-bg)]"
      style={{ borderColor: 'var(--code-border)', opacity: faded ? 0.45 : 1 }}
    >
      <span className="text-[var(--accent)]">{`<${tag}>`}</span>
      <span className="text-[var(--text-strong)]"> {children} </span>
      <span className="text-[var(--accent)]">{`</${tag}>`}</span>
    </div>
  )
}

function BeforeAfter({ before, after, badge, badgeKind, body, code }) {
  const { t } = useLang()
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="mono text-xs uppercase tracking-wide text-[var(--muted)] mb-2">{t(STRINGS.before)}</p>
          {before}
        </div>
        <div>
          <p className="mono text-xs uppercase tracking-wide text-[var(--muted)] mb-2">{t(STRINGS.after)}</p>
          {after}
        </div>
      </div>
      <p className="mb-3">
        <span className="text-sm text-[var(--muted)] mr-2">{t(STRINGS.decision)}:</span>
        <Badge kind={badgeKind}>{badge}</Badge>
      </p>
      <p className="text-sm text-[var(--muted)] max-w-3xl mb-4">{t(body)}</p>
      {code && <CodeBlock code={code} lang="jsx" />}
    </div>
  )
}

/* ---------- Scenario 3: keys vs index, with stateful items ---------- */
function KeyedCounter({ label, color }) {
  const [n, setN] = useState(0)
  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
    >
      <span className="mono font-bold" style={{ color }}>
        {label}
      </span>
      <span className="mono text-sm text-[var(--muted)]" aria-live="polite">
        n={n}
      </span>
      <button type="button" className="btn text-xs px-2 py-1" onClick={() => setN((x) => x + 1)}>
        +1
      </button>
    </div>
  )
}

const ITEMS = [
  { id: 'a', label: 'A', color: 'var(--accent)' },
  { id: 'b', label: 'B', color: 'var(--green)' },
  { id: 'c', label: 'C', color: 'var(--red)' },
]

function KeysDemo() {
  const { t } = useLang()
  const [order, setOrder] = useState(['a', 'b', 'c'])
  const [stable, setStable] = useState(true)

  const shuffle = () => setOrder((o) => [...o].sort(() => Math.random() - 0.5))
  const reset = () => setOrder(['a', 'b', 'c'])
  const byId = Object.fromEntries(ITEMS.map((it) => [it.id, it]))

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="key mode">
        <button
          type="button"
          className={`btn ${stable ? 'btn-primary' : ''}`}
          aria-pressed={stable}
          onClick={() => setStable(true)}
        >
          {t(STRINGS.useKeys)}
        </button>
        <button
          type="button"
          className={`btn ${!stable ? 'btn-primary' : ''}`}
          aria-pressed={!stable}
          onClick={() => setStable(false)}
        >
          {t(STRINGS.useIndex)}
        </button>
        <span className="w-px bg-[var(--border)] mx-1" aria-hidden="true" />
        <button type="button" className="btn" onClick={shuffle}>
          {t(STRINGS.shuffle)}
        </button>
        <button type="button" className="btn" onClick={reset}>
          {t(STRINGS.reset)}
        </button>
      </div>

      <div className="card p-4 mb-4">
        <div className="flex flex-col gap-2 max-w-xs">
          {order.map((id, i) => (
            <KeyedCounter key={stable ? id : `idx-${i}`} label={byId[id].label} color={byId[id].color} />
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 mono">
          key={'{'}
          {stable ? 'item.id  // A is always A' : 'index  // position 0 is “the first item”'}
          {'}'}
        </p>
      </div>

      <p className="mb-3">
        <span className="text-sm text-[var(--muted)] mr-2">{t(STRINGS.decision)}:</span>
        {stable ? (
          <Badge kind="move">{t(STRINGS.move)}</Badge>
        ) : (
          <Badge kind="update">{t(STRINGS.update)}</Badge>
        )}
        <span className="text-sm text-[var(--muted)] ml-2">
          {stable
            ? t({ en: 'nodes move with their identity (counters travel along)', es: 'los nodos se mueven con su identidad (los contadores viajan con ellos)' })
            : t({ en: 'nodes stay at their position; content is poured in (counters stay put)', es: 'los nodos se quedan en su posición; se vierte el contenido nuevo (los contadores no se mueven)' })}
        </span>
      </p>
      <p className="text-sm text-[var(--muted)] max-w-3xl">{t(STRINGS.keysBody)}</p>
    </div>
  )
}

/* ---------- Scenario 4: component type change loses state ---------- */
function PanelA() {
  const [n, setN] = useState(0)
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="mono text-sm mb-2">
        <span className="text-[var(--accent)]">{'<PanelA>'}</span>
      </p>
      <p className="text-sm mb-2">
        n = <strong className="mono">{n}</strong>
      </p>
      <button type="button" className="btn text-sm" onClick={() => setN((x) => x + 1)}>
        +1
      </button>
    </div>
  )
}

function PanelB() {
  const [n, setN] = useState(0)
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="mono text-sm mb-2">
        <span className="text-[var(--accent)]">{'<PanelB>'}</span>
      </p>
      <p className="text-sm mb-2">
        n = <strong className="mono">{n}</strong>
      </p>
      <button type="button" className="btn text-sm" onClick={() => setN((x) => x + 1)}>
        +1
      </button>
    </div>
  )
}

function ComponentDemo() {
  const { t } = useLang()
  const [useA, setUseA] = useState(true)
  return (
    <div>
      <div className="card p-4 mb-4 max-w-sm">
        {useA ? <PanelA /> : <PanelB />}
      </div>
      <button type="button" className="btn btn-primary mb-4" onClick={() => setUseA((v) => !v)}>
        {t(STRINGS.switchWrapper)}
      </button>
      <p className="mb-3">
        <span className="text-sm text-[var(--muted)] mr-2">{t(STRINGS.decision)}:</span>
        <Badge kind="unmount">{t(STRINGS.unmount)}</Badge>{' '}
        <Badge kind="replace">{t(STRINGS.stateLost)}</Badge>
      </p>
      <p className="text-sm text-[var(--muted)] max-w-3xl">{t(STRINGS.componentBody)}</p>
    </div>
  )
}

const QUIZ = [
  {
    q: {
      en: 'The element type changes from <div> to <span> at the same position. What does React do?',
      es: 'El tipo de elemento cambia de <div> a <span> en la misma posición. ¿Qué hace React?',
    },
    options: [
      { en: 'Keeps the DOM node and renames the tag', es: 'Conserva el nodo DOM y renombra la etiqueta' },
      { en: 'Destroys the old node and creates a new one', es: 'Destruye el nodo anterior y crea uno nuevo' },
      { en: 'Moves the node elsewhere in the tree', es: 'Mueve el nodo a otro lugar del árbol' },
    ],
    answer: 1,
    explain: {
      en: 'Different type ⇒ replace. React never morphs one element type into another.',
      es: 'Tipo distinto ⇒ reemplazar. React nunca transforma un tipo de elemento en otro.',
    },
  },
  {
    q: {
      en: 'You reorder a list rendered with index keys. Where does each item’s state end up?',
      es: 'Reordenas una lista renderizada con keys de índice. ¿Dónde acaba el estado de cada elemento?',
    },
    options: [
      { en: 'It travels with the item to its new position', es: 'Viaja con el elemento a su nueva posición' },
      { en: 'It stays at the old position, attached to the new item there', es: 'Se queda en la posición anterior, ligado al nuevo elemento' },
      { en: 'It is always reset to the initial value', es: 'Siempre se restablece al valor inicial' },
    ],
    answer: 1,
    explain: {
      en: 'Index keys identify by position, so state stays glued to positions — the classic key bug. Stable keys fix it.',
      es: 'Las keys de índice identifican por posición, así que el estado queda pegado a las posiciones: el bug clásico de las keys. Las keys estables lo evitan.',
    },
  },
]

const TABS = ['type', 'props', 'keys', 'component']

export default function ReconciliationLab() {
  const { t } = useLang()
  const [tab, setTab] = useState('type')

  const tabLabel = {
    type: t(STRINGS.tabType),
    props: t(STRINGS.tabProps),
    keys: t(STRINGS.tabKeys),
    component: t(STRINGS.tabComponent),
  }

  return (
    <SimulationShell
      labId="reconciliation-lab"
      title={t({ en: 'Reconciliation Lab', es: 'Laboratorio de reconciliación' })}
      intro={t({
        en: 'Four scenarios, four decisions. Change something and see exactly what React keeps — and what it throws away.',
        es: 'Cuatro escenarios, cuatro decisiones. Cambia algo y mira exactamente qué conserva React… y qué desecha.',
      })}
      difficulty="advanced"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="text-[var(--text-strong)]">{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>

      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="reconciliation scenarios">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`btn ${tab === id ? 'btn-primary' : ''}`}
            onClick={() => setTab(id)}
          >
            {tabLabel[id]}
          </button>
        ))}
      </div>

      {tab === 'type' && (
        <BeforeAfter
          before={<NodeBox tag="div">Hello</NodeBox>}
          after={<NodeBox tag="span">Hello</NodeBox>}
          badge={t(STRINGS.replace)}
          badgeKind="replace"
          body={STRINGS.typeBody}
          code={CODE_TYPE}
        />
      )}
      {tab === 'props' && (
        <BeforeAfter
          before={<NodeBox tag="button">Save</NodeBox>}
          after={<NodeBox tag="button">Save (disabled)</NodeBox>}
          badge={t(STRINGS.update)}
          badgeKind="update"
          body={STRINGS.propsBody}
          code={CODE_PROPS}
        />
      )}
      {tab === 'keys' && <KeysDemo />}
      {tab === 'component' && <ComponentDemo />}

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="reconciliation-lab" />

      <Callout type="tip" title={t({ en: 'Rule of thumb', es: 'Regla práctica' })}>
        {t({
          en: 'Same type + same key ⇒ keep/update. Different type ⇒ replace. Keys tell React which item is which — never use the index when the order can change.',
          es: 'Mismo tipo + misma key ⇒ conservar/actualizar. Tipo distinto ⇒ reemplazar. Las keys dicen a React qué elemento es cuál: nunca uses el índice si el orden puede cambiar.',
        })}
      </Callout>
    </SimulationShell>
  )
}
