import { useState } from 'react'
import {
  SimulationShell,
  SectionTitle,
  FlowSteps,
  CodeBlock,
  Callout,
  Quiz,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const STRINGS = {
  concept: { en: 'The concept', es: 'El concepto' },
  conceptBody: {
    en: 'React does not touch the real DOM directly on every change. Instead, it keeps a **description of what the UI should look like** — a plain tree of elements — and when something changes it builds a **new description**, compares the two, and updates only the real DOM nodes that actually differ.',
    es: 'React no toca el DOM real directamente con cada cambio. En su lugar mantiene una **descripción de cómo debería verse la UI** — un árbol de elementos — y cuando algo cambia construye una **nueva descripción**, compara ambas y actualiza solo los nodos reales del DOM que difieren.',
  },
  honestTitle: {
    en: 'Honest framing: the Virtual DOM is a model, not a machine',
    es: 'Con rigor: el DOM virtual es un modelo, no una máquina',
  },
  honestBody: {
    en: '“Virtual DOM” is a conceptual model: React’s description of the UI at a point in time. React compares the previous description with the next one and updates only what changed. It is a simplification to say “React always keeps a full in-memory copy of the DOM” — the real implementation (the fiber tree and its work loop) is an internal detail. What matters for you: React diffs descriptions, not pixels.',
    es: '«DOM virtual» es un modelo conceptual: la descripción que React tiene de la UI en un momento dado. React compara la descripción anterior con la siguiente y actualiza solo lo que cambió. Decir «React mantiene siempre una copia completa del DOM en memoria» es una simplificación: la implementación real (el árbol de fibras y su bucle de trabajo) es un detalle interno. Lo importante para ti: React compara descripciones, no píxeles.',
  },
  experiment: { en: 'Experiment: describe, then diff', es: 'Experimento: describe y compara' },
  experimentHint: {
    en: 'Edit the text of the items in the “before” and “after” descriptions, then run the diff.',
    es: 'Edita el texto de los elementos en las descripciones «antes» y «después», y luego ejecuta el diff.',
  },
  before: { en: 'Previous description', es: 'Descripción anterior' },
  after: { en: 'Next description', es: 'Descripción siguiente' },
  item: { en: 'item', es: 'elemento' },
  runDiff: { en: 'Run the diff', es: 'Ejecutar el diff' },
  comparison: { en: 'Comparison', es: 'Comparación' },
  changed: { en: 'changed', es: 'cambió' },
  unchanged: { en: 'unchanged', es: 'sin cambios' },
  domTitle: { en: 'Real DOM update', es: 'Actualización del DOM real' },
  domBody: {
    en: 'React touches exactly the nodes that differ — nothing else. The flashing node below is the only real DOM update.',
    es: 'React toca exactamente los nodos que difieren, nada más. El nodo parpadeante es la única actualización real del DOM.',
  },
  nodesUpdated: { en: 'real DOM nodes updated', es: 'nodos reales del DOM actualizados' },
  pipeline: { en: 'The diff pipeline', es: 'El pipeline del diff' },
  codeTitle: { en: 'The code behind it', es: 'El código detrás' },
  challenge: { en: 'Challenge', es: 'Reto' },
}

const CODE = `// Two descriptions of the same list, at two points in time
const before = (
  <ul>
    <li>A</li>
    <li>B</li>
  </ul>
);
const after = (
  <ul>
    <li>A</li>
    <li>C</li>   // <- only this changed
  </ul>
);
// React diffs before vs after and updates a single <li> in the real DOM.`

const FLOW = [
  {
    label: { en: 'Previous tree', es: 'Árbol anterior' },
    desc: { en: 'React’s description of the UI before the change', es: 'La descripción de la UI antes del cambio' },
  },
  {
    label: { en: 'Comparison', es: 'Comparación' },
    desc: { en: 'walk both trees node by node; mark what differs', es: 'recorre ambos árboles nodo a nodo; marca lo que difiere' },
  },
  {
    label: { en: 'Next tree', es: 'Árbol siguiente' },
    desc: { en: 'the new description, after the state change', es: 'la nueva descripción, tras el cambio de estado' },
  },
  {
    label: { en: 'DOM update', es: 'Actualización del DOM' },
    desc: { en: 'only the changed <li> is touched in the real DOM', es: 'solo el <li> cambiado se toca en el DOM real' },
  },
]

const QUIZ = [
  {
    q: {
      en: 'What is the “virtual DOM” in this lab?',
      es: '¿Qué es el «DOM virtual» en este laboratorio?',
    },
    options: [
      {
        en: 'A full in-memory copy of the real DOM that React keeps synced at all times',
        es: 'Una copia completa del DOM real en memoria que React mantiene sincronizada siempre',
      },
      {
        en: 'React’s description of what the UI should look like at a point in time',
        es: 'La descripción que React tiene de cómo debería verse la UI en un momento dado',
      },
      {
        en: 'A faster browser DOM implementation shipped with React',
        es: 'Una implementación más rápida del DOM del navegador incluida con React',
      },
    ],
    answer: 1,
    explain: {
      en: 'It is a conceptual model: a description React compares. The diff — not a DOM copy — is what drives minimal updates.',
      es: 'Es un modelo conceptual: una descripción que React compara. El diff — no una copia del DOM — es lo que produce actualizaciones mínimas.',
    },
  },
  {
    q: {
      en: 'If only item B → C changes and A stays the same, how many real DOM nodes must React touch?',
      es: 'Si solo cambia el elemento B → C y A sigue igual, ¿cuántos nodos reales del DOM debe tocar React?',
    },
    options: [{ en: '0', es: '0' }, { en: '1', es: '1' }, { en: '2', es: '2' }, { en: 'The whole list', es: 'Toda la lista' }],
    answer: 1,
    explain: {
      en: 'Exactly one: the <li> whose content differs. Unchanged nodes are left alone.',
      es: 'Exactamente uno: el <li> cuyo contenido difiere. Los nodos sin cambios se dejan intactos.',
    },
  },
]

function TreeBox({ caption, items, highlight = [], dim = [], flash = [] }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 flex-1 min-w-0">
      <p className="mono text-xs uppercase tracking-wide text-[var(--muted)] mb-3">{caption}</p>
      <div className="mono text-sm rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] p-3">
        <div className="text-[var(--accent)]">{'<ul>'}</div>
        <div className="pl-5 flex flex-col gap-1.5 py-1.5">
          {items.map((text, i) => {
            const isHl = highlight.includes(i)
            const isDim = dim.includes(i)
            const isFlash = flash.includes(i)
            return (
              <div
                key={i}
                className={isFlash ? 'node-live' : undefined}
                style={{
                  border: '1px solid',
                  borderColor: isHl || isFlash ? 'var(--accent)' : 'var(--border)',
                  borderRadius: 8,
                  padding: '4px 10px',
                  background: isHl || isFlash ? 'var(--accent-dim)' : 'transparent',
                  opacity: isDim ? 0.45 : 1,
                  transition: 'opacity .3s',
                }}
              >
                {'<li>'}
                <strong className="text-[var(--text-strong)]">{text || '…'}</strong>
                {'</li>'}
                {isHl && (
                  <span
                    className="ml-2 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    diff
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <div className="text-[var(--accent)]">{'</ul>'}</div>
      </div>
    </div>
  )
}

export default function VdomDiffLab() {
  const { t } = useLang()
  const [before, setBefore] = useState(['A', 'B'])
  const [after, setAfter] = useState(['A', 'C'])
  const [diffed, setDiffed] = useState(false)

  const changedIdx = before.map((v, i) => (v !== after[i] ? i : -1)).filter((i) => i >= 0)
  const unchangedIdx = before.map((v, i) => (v === after[i] ? i : -1)).filter((i) => i >= 0)

  const edit = (setter, i) => (e) => {
    setter((arr) => arr.map((v, j) => (j === i ? e.target.value : v)))
    setDiffed(false)
  }

  return (
    <SimulationShell
      labId="vdom-diff"
      title={t({ en: 'Virtual DOM Diff Visualizer', es: 'Visualizador del diff del DOM virtual' })}
      intro={t({
        en: 'Before vs after: two descriptions of the same list, one diff, one minimal DOM update.',
        es: 'Antes vs después: dos descripciones de la misma lista, un diff, una actualización mínima del DOM.',
      })}
      difficulty="intermediate"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4 max-w-3xl">
        {t(STRINGS.conceptBody).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="text-[var(--text-strong)]">{part}</strong> : <span key={i}>{part}</span>,
        )}
      </p>
      <Callout type="warn" title={t(STRINGS.honestTitle)}>
        {t(STRINGS.honestBody)}
      </Callout>

      <SectionTitle>{t(STRINGS.experiment)}</SectionTitle>
      <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.experimentHint)}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="card p-4">
          <p className="font-semibold text-[var(--text-strong)] mb-3">{t(STRINGS.before)}</p>
          {before.map((v, i) => (
            <label key={i} className="flex items-center gap-2 mb-2 text-sm">
              <span className="mono text-[var(--muted)] w-14">{t(STRINGS.item)} {i + 1}</span>
              <input
                className="mono flex-1 px-2 py-1.5 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-[var(--text)]"
                value={v}
                maxLength={12}
                onChange={edit(setBefore, i)}
                aria-label={`${t(STRINGS.before)} ${t(STRINGS.item)} ${i + 1}`}
              />
            </label>
          ))}
        </div>
        <div className="card p-4">
          <p className="font-semibold text-[var(--text-strong)] mb-3">{t(STRINGS.after)}</p>
          {after.map((v, i) => (
            <label key={i} className="flex items-center gap-2 mb-2 text-sm">
              <span className="mono text-[var(--muted)] w-14">{t(STRINGS.item)} {i + 1}</span>
              <input
                className="mono flex-1 px-2 py-1.5 rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] text-[var(--text)]"
                value={v}
                maxLength={12}
                onChange={edit(setAfter, i)}
                aria-label={`${t(STRINGS.after)} ${t(STRINGS.item)} ${i + 1}`}
              />
            </label>
          ))}
        </div>
      </div>

      <button type="button" className="btn btn-primary mb-6" onClick={() => setDiffed(true)}>
        {t(STRINGS.runDiff)}
      </button>

      {diffed && (
        <>
          <SectionTitle>{t(STRINGS.comparison)}</SectionTitle>
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <TreeBox caption="<ul> — before" items={before} highlight={changedIdx} dim={unchangedIdx} />
            <TreeBox caption="<ul> — after" items={after} highlight={changedIdx} dim={unchangedIdx} />
          </div>
          <p className="text-sm text-[var(--muted)] mb-6" aria-live="polite">
            {changedIdx.length === 0
              ? t({ en: 'No differences: React would update nothing.', es: 'Sin diferencias: React no actualizaría nada.' })
              : t({
                  en: `Changed: item ${changedIdx.map((i) => i + 1).join(', ')} (${t(STRINGS.changed)}). The rest is ${t(STRINGS.unchanged)}.`,
                  es: `Cambió: elemento ${changedIdx.map((i) => i + 1).join(', ')} (${t(STRINGS.changed)}). El resto está ${t(STRINGS.unchanged)}.`,
                })}
          </p>

          <SectionTitle>{t(STRINGS.pipeline)}</SectionTitle>
          <FlowSteps steps={FLOW} />

          <SectionTitle>{t(STRINGS.domTitle)}</SectionTitle>
          <p className="text-[var(--muted)] text-sm mb-4">{t(STRINGS.domBody)}</p>
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <TreeBox caption="real DOM <ul>" items={after} flash={changedIdx} />
            <div className="card p-4 flex items-center justify-center min-w-[12rem]">
              <div className="text-center">
                <div className="mono text-4xl font-bold text-[var(--accent)]" aria-live="polite">
                  {changedIdx.length}
                </div>
                <div className="text-sm text-[var(--muted)]">{t(STRINGS.nodesUpdated)}</div>
              </div>
            </div>
          </div>
        </>
      )}

      <SectionTitle>{t(STRINGS.codeTitle)}</SectionTitle>
      <CodeBlock code={CODE} lang="jsx" />

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <Quiz questions={QUIZ} quizId="vdom-diff" />
    </SimulationShell>
  )
}
