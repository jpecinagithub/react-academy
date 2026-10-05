import { createElement, Fragment, lazy, Suspense, useState } from 'react'
import { Wrench } from 'lucide-react'
import {
  SimulationShell,
  SectionTitle,
  CodeBlock,
  Callout,
} from '../../components/ui.jsx'
import { useLang } from '../../i18n/index.jsx'

const CodeEditor = lazy(() => import('../../components/CodeEditor.jsx'))

/* ------------------------------------------------------------------ */
/* Mini JSX parser (teaching-grade, dependency-free).                   */
/* Parses one root element into:                                        */
/*   element  { kind, tag, attrs:[{kind:'string'|'expr'|'bool'|'spread',*/
/*              name?, value?, code?}], children }                       */
/*   fragment { kind:'fragment', children }                             */
/*   text     { kind:'text', text }                                     */
/*   expr     { kind:'expr', code }                                      */
/* ------------------------------------------------------------------ */

function parseJSX(src) {
  let i = 0
  const fail = (msg) => {
    const line = src.slice(0, i).split('\n').length
    throw new SyntaxError(`${msg} — line ${line}`)
  }
  const skipWs = () => {
    while (i < src.length && /\s/.test(src[i])) i++
  }

  function parseExpression() {
    // src[i] === '{' — consume balanced braces, string-aware
    i++
    const start = i
    let depth = 1
    while (i < src.length && depth > 0) {
      const ch = src[i]
      if (ch === '"' || ch === "'" || ch === '`') {
        const quote = ch
        i++
        while (i < src.length && src[i] !== quote) {
          if (src[i] === '\\') i += 2
          else if (quote === '`' && src[i] === '$' && src[i + 1] === '{') {
            let d = 1
            i += 2
            while (i < src.length && d > 0) {
              if (src[i] === '{') d++
              else if (src[i] === '}') d--
              i++
            }
          } else i++
        }
        i++
      } else if (ch === '{') {
        depth++
        i++
      } else if (ch === '}') {
        depth--
        i++
      } else if (ch === '/' && src[i + 1] === '/') {
        while (i < src.length && src[i] !== '\n') i++
      } else if (ch === '/' && src[i + 1] === '*') {
        i += 2
        while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++
        i += 2
      } else {
        i++
      }
    }
    if (depth !== 0) fail('Unbalanced { } in an expression')
    return src.slice(start, i - 1)
  }

  function parseName() {
    const m = /^[A-Za-z][\w.-]*/.exec(src.slice(i))
    if (!m) fail('Expected a tag or attribute name')
    i += m[0].length
    return m[0]
  }

  function parseAttributes() {
    const attrs = []
    for (;;) {
      skipWs()
      if (i >= src.length) fail('Unterminated tag')
      if (src[i] === '/' || src[i] === '>') break
      if (src[i] === '{') {
        const code = parseExpression().trim()
        const m = /^\.\.\.(.+)$/s.exec(code)
        attrs.push(
          m
            ? { kind: 'spread', code: m[1].trim() }
            : { kind: 'expr', name: '???', code },
        )
        continue
      }
      const name = parseName()
      skipWs()
      if (src[i] !== '=') {
        attrs.push({ kind: 'bool', name })
        continue
      }
      i++
      skipWs()
      const ch = src[i]
      if (ch === '"' || ch === "'") {
        i++
        let value = ''
        while (i < src.length && src[i] !== ch) {
          if (src[i] === '\\' && i + 1 < src.length) {
            value += src[i + 1]
            i += 2
          } else {
            value += src[i]
            i++
          }
        }
        if (src[i] !== ch) fail(`Unterminated string for attribute "${name}"`)
        i++
        attrs.push({ kind: 'string', name, value })
      } else if (ch === '{') {
        attrs.push({ kind: 'expr', name, code: parseExpression().trim() })
      } else {
        fail(`Expected "value" or {expression} after ${name}=`)
      }
    }
    return attrs
  }

  function parseTagOpen() {
    // src[i] === '<'
    i++
    skipWs()
    if (src[i] === '/') {
      i++
      skipWs()
      const tag = src[i] === '>' ? null : parseName()
      skipWs()
      if (src[i] !== '>') fail('Expected > to close the tag')
      i++
      return { closing: true, tag }
    }
    const tag = src[i] === '>' ? null : parseName()
    const attrs = parseAttributes()
    skipWs()
    if (src[i] === '/' && src[i + 1] === '>') {
      i += 2
      return { tag, attrs, selfClosing: true }
    }
    if (src[i] !== '>') fail('Expected > or /> to finish the tag')
    i++
    return { tag, attrs, selfClosing: false }
  }

  function flushText(buf, children) {
    let text = buf
    if (/[\n\r]/.test(text)) text = text.replace(/\s*\n\s*/g, ' ').trim()
    if (text) children.push({ kind: 'text', text })
  }

  function parseChildren(stopTag) {
    const children = []
    let buf = ''
    for (;;) {
      if (i >= src.length) fail(`Unclosed <${stopTag === null ? '' : stopTag}> — every tag needs its closing tag`)
      const ch = src[i]
      if (ch === '<' && src[i + 1] === '/') {
        flushText(buf, children)
        buf = ''
        const close = parseTagOpen()
        if (close.tag !== stopTag) {
          fail(
            `Mismatched tags: expected </${stopTag === null ? '' : stopTag}>, found </${close.tag === null ? '' : close.tag}>`,
          )
        }
        return children
      }
      if (ch === '<') {
        flushText(buf, children)
        buf = ''
        children.push(parseElement())
      } else if (ch === '{') {
        flushText(buf, children)
        buf = ''
        children.push({ kind: 'expr', code: parseExpression().trim() })
      } else {
        buf += ch
        i++
      }
    }
  }

  function parseElement() {
    if (src[i] !== '<') fail('JSX must start with <')
    const open = parseTagOpen()
    if (open.closing) fail('Unexpected closing tag')
    const node =
      open.tag === null
        ? { kind: 'fragment', attrs: [], children: [] }
        : { kind: 'element', tag: open.tag, attrs: open.attrs, children: [] }
    if (!open.selfClosing) node.children = parseChildren(open.tag)
    return node
  }

  skipWs()
  if (src[i] !== '<') fail('JSX must start with < — did you forget the root element?')
  const root = parseElement()
  skipWs()
  if (i < src.length) {
    fail('JSX needs ONE root element — wrap siblings in a fragment <>...</>')
  }
  return root
}

/* Pretty-print the AST as React.createElement calls */
function printProps(attrs) {
  if (!attrs.length) return 'null'
  const parts = attrs.map((a) => {
    if (a.kind === 'string') return `${a.name}: ${JSON.stringify(a.value)}`
    if (a.kind === 'expr') return `${a.name}: ${a.code || 'undefined'}`
    if (a.kind === 'bool') return `${a.name}: true`
    if (a.kind === 'spread') return `...(${a.code})`
    return `${a.name}: ?`
  })
  return `{ ${parts.join(', ')} }`
}

function printTag(tag) {
  return /^[A-Z]/.test(tag) || tag.includes('.') ? tag : JSON.stringify(tag)
}

function printCE(node, depth = 0) {
  const pad = '  '.repeat(depth)
  if (node.kind === 'text') return pad + JSON.stringify(node.text)
  if (node.kind === 'expr') {
    if (/^\/\*[\s\S]*\*\/$/.test(node.code)) return pad + 'null /* comment */'
    return pad + (node.code || 'undefined')
  }
  const tag = node.kind === 'fragment' ? 'React.Fragment' : printTag(node.tag)
  const props = printProps(node.attrs)
  const kids = node.children.map((c) => printCE(c, depth + 1))
  if (!kids.length) return `${pad}React.createElement(${tag}, ${props})`
  return `${pad}React.createElement(${tag}, ${props},\n${kids.join(',\n')}\n${pad})`
}

/* Compile the AST to real React elements (for the live preview) */
function evalExpr(code, scope) {
  const keys = Object.keys(scope)
  return new Function(...keys, `"use strict"; return (${code});`)(...keys.map((k) => scope[k]))
}

function toElement(node, scope) {
  if (node.kind === 'text') return node.text
  if (node.kind === 'expr') {
    if (/^\/\*[\s\S]*\*\/$/.test(node.code)) return null
    return evalExpr(node.code, scope)
  }
  const type =
    node.kind === 'fragment'
      ? Fragment
      : /^[A-Z]/.test(node.tag)
        ? scope[node.tag] || node.tag
        : node.tag
  const props = {}
  for (const a of node.attrs) {
    if (a.kind === 'string') props[a.name] = a.value
    else if (a.kind === 'expr') props[a.name] = evalExpr(a.code, scope)
    else if (a.kind === 'bool') props[a.name] = true
    else if (a.kind === 'spread') Object.assign(props, evalExpr(a.code, scope))
  }
  const kids = node.children
    .map((c) => toElement(c, scope))
    .filter((k) => k !== undefined)
  return createElement(type, props, ...kids)
}

/* Collect friendly warnings (class=, for=, …) */
function collectWarnings(node, out = []) {
  if (node.kind === 'element' || node.kind === 'fragment') {
    for (const a of node.attrs) {
      if (a.name === 'class') {
        out.push({
          en: 'Did you mean className? In JSX, "class" is a reserved word in JavaScript.',
          es: '¿Querías decir className? En JSX, "class" es palabra reservada en JavaScript.',
        })
      }
      if (a.name === 'for') {
        out.push({
          en: 'Did you mean htmlFor? "for" is a reserved word in JavaScript.',
          es: '¿Querías decir htmlFor? "for" es palabra reservada en JavaScript.',
        })
      }
    }
    node.children.forEach((c) => collectWarnings(c, out))
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Visual element-tree diagram                                         */
/* ------------------------------------------------------------------ */

function TreeNode({ node }) {
  if (node.kind === 'text') {
    return (
      <div className="mono text-xs text-[var(--muted)]">
        <span className="text-[var(--green)]">"{node.text}"</span>
      </div>
    )
  }
  if (node.kind === 'expr') {
    return (
      <div className="mono text-xs">
        <span className="inline-block px-1.5 py-0.5 rounded bg-[var(--amber-dim)] text-[var(--amber)]">
          {'{'}{node.code || '…'}{'}'}
        </span>
      </div>
    )
  }
  const label = node.kind === 'fragment' ? '<>' : `<${node.tag}>`
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mono text-xs font-bold px-1.5 py-0.5 rounded bg-[var(--accent-dim)] text-[var(--accent)]">
          {label}
        </span>
        {node.attrs.map((a, i) => (
          <span
            key={i}
            className="mono text-[11px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]"
          >
            {a.kind === 'string' && `${a.name}="${a.value}"`}
            {a.kind === 'expr' && `${a.name}={${a.code}}`}
            {a.kind === 'bool' && `${a.name}`}
            {a.kind === 'spread' && `{...${a.code}}`}
          </span>
        ))}
      </div>
      {node.children.length > 0 && (
        <div className="ml-3 pl-3 mt-1.5 border-l-2 border-[var(--border)] flex flex-col gap-1.5">
          {node.children.map((c, i) => (
            <TreeNode key={i} node={c} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Lab                                                                */
/* ------------------------------------------------------------------ */

const PRESETS = [
  {
    key: 'hello',
    label: { en: 'Hello + expression', es: 'Hola + expresión' },
    code: '<h1>Hello {name}!</h1>',
    scope: { name: 'Jon' },
  },
  {
    key: 'nested',
    label: { en: 'Nested + attributes', es: 'Anidado + atributos' },
    code: '<div className="card">\n  <h2>{title}</h2>\n  <p>2 + 2 = {2 + 2}</p>\n</div>',
    scope: { title: 'Math' },
  },
  {
    key: 'fragment',
    label: { en: 'Fragment', es: 'Fragmento' },
    code: '<>\n  <p>First</p>\n  <p>Second</p>\n</>',
    scope: {},
  },
  {
    key: 'attrs',
    label: { en: 'Expressions everywhere', es: 'Expresiones en todo' },
    code: '<button className="primary" disabled={isDisabled}>\n  Save {count} items\n</button>',
    scope: { isDisabled: false, count: 3 },
  },
]

const STRINGS = {
  concept: { en: 'Concept', es: 'Concepto' },
  conceptBody: {
    en: 'JSX is not HTML and not magic: every tag becomes a React.createElement() call describing an element. Type JSX on the left and inspect the three views on the right — the calls, the tree, and the rendered result.',
    es: 'JSX no es HTML ni magia: cada etiqueta se convierte en una llamada React.createElement() que describe un elemento. Escribe JSX a la izquierda e inspecciona las tres vistas: las llamadas, el árbol y el resultado renderizado.',
  },
  presets: { en: 'Presets', es: 'Ejemplos' },
  editor: { en: 'Your JSX', es: 'Tu JSX' },
  calls: { en: 'What React sees', es: 'Lo que React ve' },
  tree: { en: 'Element tree', es: 'Árbol de elementos' },
  rendered: { en: 'Rendered', es: 'Renderizado' },
  scopeNote: {
    en: 'Available variables',
    es: 'Variables disponibles',
  },
  rules: { en: 'The 4 JSX rules', es: 'Las 4 reglas de JSX' },
  challenge: { en: 'Challenge: break it, then fix it', es: 'Reto: rómpelo y arréglalo' },
  challengeBody: {
    en: 'Inject a classic mistake, read the friendly error, then fix the code. Press "Check" when you think it is valid again.',
    es: 'Inyecta un error clásico, lee el mensaje amable y corrige el código. Pulsa «Comprobar» cuando creas que vuelve a ser válido.',
  },
  injectClass: { en: 'Inject: use class', es: 'Inyectar: usar class' },
  injectRoots: { en: 'Inject: two roots', es: 'Inyectar: dos raíces' },
  check: { en: 'Check my JSX', es: 'Comprobar mi JSX' },
  challengeOk: {
    en: 'Valid JSX — no errors, no warnings. You fixed it!',
    es: 'JSX válido: sin errores ni avisos. ¡Lo arreglaste!',
  },
  challengeKo: {
    en: 'Still broken — read the message above and keep fixing.',
    es: 'Sigue roto: lee el mensaje de arriba y sigue corrigiendo.',
  },
}

const RULES = [
  {
    en: 'One root element — wrap siblings in a fragment <>...</>.',
    es: 'Un único elemento raíz: envuelve hermanos en un fragmento <>...</>.',
  },
  {
    en: 'Curly braces { } embed any JavaScript expression.',
    es: 'Las llaves { } incrustan cualquier expresión JavaScript.',
  },
  {
    en: 'className instead of class (and htmlFor instead of for).',
    es: 'className en vez de class (y htmlFor en vez de for).',
  },
  {
    en: 'Self-close void tags: <img />, <br />, <input />.',
    es: 'Autocierra etiquetas vacías: <img />, <br />, <input />.',
  },
]

export default function JsxTranslatorLab() {
  const { t } = useLang()
  const [presetKey, setPresetKey] = useState('hello')
  const preset = PRESETS.find((p) => p.key === presetKey)
  const [code, setCode] = useState(preset.code)
  const [challengeMsg, setChallengeMsg] = useState(null)

  const pickPreset = (key) => {
    const p = PRESETS.find((x) => x.key === key)
    setPresetKey(key)
    setCode(p.code)
    setChallengeMsg(null)
  }

  const parsed = useMemo(() => {
    try {
      const ast = parseJSX(code)
      const warnings = collectWarnings(ast)
      let element = null
      let renderError = null
      try {
        element = toElement(ast, preset.scope)
      } catch (e) {
        renderError = e
      }
      return { ast, warnings, element, renderError, error: null }
    } catch (e) {
      return { ast: null, warnings: [], element: null, renderError: null, error: e }
    }
  }, [code, preset])

  const inject = (kind) => {
    if (kind === 'class') {
      setCode(code.replace('className=', 'class='))
    } else if (kind === 'roots') {
      setCode(`${code}\n<p>Oops, a second root</p>`)
    }
    setChallengeMsg(null)
  }

  const checkChallenge = () => {
    setChallengeMsg(parsed.error || parsed.warnings.length > 0 ? 'ko' : 'ok')
  }

  return (
    <SimulationShell
      labId="jsx-translator"
      title={t({ en: 'JSX Translator', es: 'Traductor JSX' })}
      intro={t({
        en: 'Type JSX and see what React actually understands: the createElement calls and the element tree.',
        es: 'Escribe JSX y mira lo que React entiende de verdad: las llamadas createElement y el árbol de elementos.',
      })}
      difficulty="beginner"
    >
      <SectionTitle>{t(STRINGS.concept)}</SectionTitle>
      <p className="text-[var(--text)] mb-2">{t(STRINGS.conceptBody)}</p>

      <div className="flex flex-wrap gap-2 my-4" role="group" aria-label={t(STRINGS.presets)}>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={p.key === presetKey ? 'btn btn-primary !text-xs' : 'btn !text-xs'}
            onClick={() => pickPreset(p.key)}
          >
            {t(p.label)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.editor)}</h3>
          <Suspense fallback={<p className="text-sm text-[var(--muted)]">…</p>}>
            <CodeEditor value={code} onChange={(v) => { setCode(v); setChallengeMsg(null) }} language="jsx" height={220} />
          </Suspense>
          <p className="mono text-xs text-[var(--muted)] mt-2">
            {t(STRINGS.scopeNote)}:{' '}
            {Object.keys(preset.scope).length === 0
              ? '—'
              : Object.entries(preset.scope)
                  .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
                  .join(', ')}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.rendered)}</h3>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5 min-h-[220px] flex items-center justify-center">
            {parsed.error ? (
              <p className="text-sm text-[var(--faint)] italic">
                {t({ en: 'Fix the error to see the preview.', es: 'Corrige el error para ver la vista previa.' })}
              </p>
            ) : parsed.renderError ? (
              <p className="text-sm text-[var(--faint)] italic">
                {t({ en: 'Fix the expression error to see the preview.', es: 'Corrige el error de expresión para ver la vista previa.' })}
              </p>
            ) : (
              <>{parsed.element}</>
            )}
          </div>
        </div>
      </div>

      {parsed.error && (
        <div
          role="alert"
          className="rounded-xl border p-4 my-4"
          style={{ borderColor: 'var(--red)', background: 'var(--red-dim)' }}
        >
          <p className="font-bold text-[var(--red)] text-sm mb-1">
            ⚠ {t({ en: 'JSX error — friendly version', es: 'Error de JSX, versión amable' })}
          </p>
          <p className="mono text-sm text-[var(--text)]">{parsed.error.message}</p>
          <p className="text-sm text-[var(--muted)] mt-2">
            {t({
              en: 'Nothing crashed — fix the code above and the views update instantly.',
              es: 'Nada se ha roto: corrige el código y las vistas se actualizan al instante.',
            })}
          </p>
        </div>
      )}

      {parsed.renderError && !parsed.error && (
        <div
          role="alert"
          className="rounded-xl border p-4 my-4"
          style={{ borderColor: 'var(--amber)', background: 'var(--amber-dim)' }}
        >
          <p className="font-bold text-[var(--amber)] text-sm mb-1">
            ⚠ {t({ en: 'Expression error', es: 'Error de expresión' })}
          </p>
          <p className="mono text-sm text-[var(--text)]">
            {parsed.renderError.name}: {parsed.renderError.message}
          </p>
          <p className="text-sm text-[var(--muted)] mt-2">
            {t({
              en: 'An expression references something unknown. Check the available variables.',
              es: 'Una expresión referencia algo desconocido. Revisa las variables disponibles.',
            })}
          </p>
        </div>
      )}

      {parsed.warnings.length > 0 && !parsed.error && (
        <div
          className="rounded-xl border p-4 my-4"
          style={{ borderColor: 'var(--amber)', background: 'var(--amber-dim)' }}
        >
          {parsed.warnings.map((w, i) => (
            <p key={i} className="text-sm text-[var(--text)]">
              💡 {t(w)}
            </p>
          ))}
        </div>
      )}

      {!parsed.error && (
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.calls)}</h3>
            <CodeBlock code={printCE(parsed.ast)} lang="js" maxHeight={320} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-strong)] mb-2">{t(STRINGS.tree)}</h3>
            <div className="rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] p-4">
              <TreeNode node={parsed.ast} />
            </div>
          </div>
        </div>
      )}

      <SectionTitle>{t(STRINGS.rules)}</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-3">
        {RULES.map((rule, i) => (
          <Callout key={i} type={i === 2 ? 'warn' : 'info'}>
            <span className="font-bold mr-1">{i + 1}.</span> {t(rule)}
          </Callout>
        ))}
      </div>

      <SectionTitle>{t(STRINGS.challenge)}</SectionTitle>
      <div className="card p-5">
        <p className="text-sm text-[var(--muted)] mb-3">{t(STRINGS.challengeBody)}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <button type="button" className="btn !text-xs" onClick={() => inject('class')}>
            <Wrench size={13} aria-hidden="true" />
            {t(STRINGS.injectClass)}
          </button>
          <button type="button" className="btn !text-xs" onClick={() => inject('roots')}>
            <Wrench size={13} aria-hidden="true" />
            {t(STRINGS.injectRoots)}
          </button>
          <button type="button" className="btn btn-primary !text-xs" onClick={checkChallenge}>
            {t(STRINGS.check)}
          </button>
        </div>
        {challengeMsg && (
          <p
            role="status"
            className="text-sm font-semibold"
            style={{ color: challengeMsg === 'ok' ? 'var(--green)' : 'var(--amber)' }}
          >
            {t(challengeMsg === 'ok' ? STRINGS.challengeOk : STRINGS.challengeKo)}
          </p>
        )}
      </div>
    </SimulationShell>
  )
}
