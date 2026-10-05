import { useEffect, useRef } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultKeymap } from '@codemirror/commands'
import { useStore } from '../state/store.js'

// Lightweight CodeMirror 6 wrapper. Intentionally minimal extensions so it
// stays lazy-loadable and cheap. CodeMirror's own oneDark theme is used for
// both app themes (editor keeps a dark "IDE" look in light mode too — like
// real developer tools).
//
// Props: { value, onChange, language='jsx'|'js'|'json', height='100%', readOnly }
export default function CodeEditor({
  value,
  onChange,
  language = 'jsx',
  height = '100%',
  readOnly = false,
}) {
  const hostRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const theme = useStore((s) => s.theme)

  useEffect(() => {
    const langExt = javascript({
      jsx: language === 'jsx',
      typescript: false,
    })
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current?.(update.state.doc.toString())
      }
    })
    const state = EditorState.create({
      doc: value ?? '',
      extensions: [
        oneDark,
        langExt,
        updateListener,
        EditorView.editable.of(!readOnly),
        EditorState.readOnly.of(readOnly),
        keymap.of(defaultKeymap),
        EditorView.lineWrapping,
      ],
    })
    const view = new EditorView({ state, parent: hostRef.current })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
    // Intentionally created once; external value sync handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync external value changes (e.g. Reset / file switch) into the editor.
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (value !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value ?? '' },
      })
    }
  }, [value])

  return (
    <div
      ref={hostRef}
      data-theme={theme}
      className="cm-host rounded-lg overflow-hidden border border-[var(--code-border)]"
      style={{ height, minHeight: 120 }}
      aria-label="code editor"
    />
  )
}
