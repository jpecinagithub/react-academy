// markdown-lite renderer for lesson text sections.
// Supports: ### headings, - / * lists, **bold**, `code`, [label](url) links,
// paragraphs separated by blank lines. No dependency.
import { Fragment } from 'react'

function renderInline(text, keyPrefix) {
  const parts = []
  // Split on **bold**, `code`, [link](url) — keep delimiters.
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m
  let k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const token = m[1]
    if (token.startsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-${k++}`} className="font-semibold text-[var(--text-strong)]">
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('`')) {
      parts.push(
        <code
          key={`${keyPrefix}-${k++}`}
          className="mono px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--accent)] text-[0.9em]"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else {
      const label = token.slice(1, token.indexOf(']'))
      const url = token.slice(token.indexOf('(') + 1, -1)
      parts.push(
        <a
          key={`${keyPrefix}-${k++}`}
          href={url}
          className="text-[var(--accent)] underline underline-offset-2"
        >
          {label}
        </a>,
      )
    }
    last = m.index + token.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function Markdown({ text }) {
  const blocks = String(text ?? '').split(/\n{2,}/)
  const out = []
  let listBuf = []

  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc pl-6 my-3 space-y-1">
          {listBuf.map((item, i) => (
            <li key={i}>{renderInline(item, `li-${out.length}-${i}`)}</li>
          ))}
        </ul>,
      )
      listBuf = []
    }
  }

  blocks.forEach((block, bi) => {
    const lines = block.split('\n')
    const first = lines[0].trim()
    if (/^###\s+/.test(first)) {
      flushList()
      out.push(
        <h3 key={bi} className="text-lg font-bold text-[var(--text-strong)] mt-6 mb-2">
          {renderInline(first.replace(/^###\s+/, ''), `h-${bi}`)}
        </h3>,
      )
    } else if (/^[-*]\s+/.test(first)) {
      lines.forEach((ln) => {
        const item = ln.replace(/^[-*]\s+/, '')
        if (item) listBuf.push(item)
      })
      flushList()
    } else {
      flushList()
      out.push(
        <p key={bi} className="my-3 leading-relaxed">
          {renderInline(block.replace(/\n/g, ' '), `p-${bi}`)}
        </p>,
      )
    }
  })
  flushList()
  return <Fragment>{out}</Fragment>
}
