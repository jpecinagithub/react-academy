import { useDeferredValue, useMemo } from 'react'
import * as React from 'react'
import { transform } from 'sucrase'
import { useLang } from '../i18n/index.jsx'
import { SandboxBoundary, SandboxError } from './SandboxError.jsx'

// Hooks exposed to user code inside the sandbox.
const SCOPE = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  useContext: React.useContext,
  useReducer: React.useReducer,
  createContext: React.createContext,
  memo: React.memo,
  Fragment: React.Fragment,
}

// Heuristic: a file is an ES module when it has import/export statements.
const MODULE_RE = /(^|[\n;}])\s*(import|export)[\s{*"/']/m

const isModuleFile = (code) => MODULE_RE.test(code)

// Resolve a require path ('./Counter.jsx', './Counter', 'react') to a file.
function resolveName(files, path) {
  if (path === 'react') return 'react'
  const p = path.replace(/^\.\//, '').replace(/^\//, '')
  const byName = (n) => files.find((f) => f.name === n)
  if (byName(p)) return p
  if (byName(p + '.jsx')) return p + '.jsx'
  if (byName(p + '.js')) return p + '.js'
  const noExt = p.replace(/\.(jsx|js)$/, '')
  const hit = files.find((f) => f.name.replace(/\.(jsx|js)$/, '') === noExt)
  return hit ? hit.name : null
}

function compileFiles(files) {
  const names = Object.keys(SCOPE)
  const values = Object.values(SCOPE)

  // Legacy mode: no file uses import/export (e.g. the Playground's original
  // multi-pane style). Concatenate everything into one synthetic module,
  // App last, and return the top-level `App`.
  if (!files.some((f) => isModuleFile(f.code))) {
    const app = files.find((f) => f.name === 'App.jsx') ?? files[0]
    const rest = files.filter((f) => f !== app)
    const combined = [...rest, app].map((f) => f.code).join('\n\n')
    const { code: js } = transform(combined, { transforms: ['jsx'] })
    const factory = new Function(
      ...names,
      `${js}\n;return (typeof App !== 'undefined' ? App : null);`,
    )
    const AppComp = factory(...values)
    if (!AppComp) throw new Error('No component named "App" found.')
    return AppComp
  }

  // Module mode: each file becomes a CJS module; a require-shim resolves
  // relative imports ('./Counter.jsx') and 'react'.
  const records = {}
  for (const f of files) {
    const { code: cjs } = transform(f.code, { transforms: ['jsx', 'imports'] })
    const factory = new Function(...names, 'require', 'module', 'exports', cjs)
    records[f.name] = {
      factory,
      module: { exports: {} },
      executed: false,
      require: null, // set below
    }
  }

  const exec = (name) => {
    const rec = records[name]
    if (!rec) throw new Error(`Cannot find module '${name}'.`)
    if (!rec.executed) {
      rec.executed = true
      rec.factory(...values, rec.require, rec.module, rec.module.exports)
    }
    return rec.module.exports
  }

  for (const name of Object.keys(records)) {
    records[name].require = (path) => {
      const resolved = resolveName(files, path)
      if (!resolved) throw new Error(`Cannot find module '${path}'.`)
      if (resolved === 'react') return React
      return exec(resolved)
    }
  }

  const entryName =
    files.find((f) => f.name === 'App.jsx')?.name ?? files[0]?.name
  if (!entryName) throw new Error('No files to run.')
  const entryExports = exec(entryName)
  const AppComp = entryExports.default ?? entryExports.App ?? null
  if (!AppComp) {
    throw new Error(
      'No component named "App" found. Export it: `export default function App() { … }`.',
    )
  }
  return AppComp
}

const STRINGS = {
  emptyHint: {
    en: 'Nothing to render yet — write a component and press Run.',
    es: 'Nada que renderizar todavía: escribe un componente y pulsa Ejecutar.',
  },
}

/* ---------- MultiFileRunner ---------- */
// <MultiFileRunner files={[{ name: 'App.jsx', code: '…' }, …]} runKey={n} />
// - Module mode when any file uses import/export: a tiny require-shim maps
//   './Sibling.jsx' (or './Sibling') to the sibling module and 'react' to
//   the React namespace. The entry file is App.jsx (or the first file) and
//   must `export default` (or export) the component.
// - Legacy mode otherwise: files are concatenated (App last) and a top-level
//   `App` is returned — keeps the original Playground behavior intact.
// - Typing is smooth: compilation follows a deferred value of `files`.
// - `runKey` forces re-execution (resets component state) and clears errors.
// - Errors render <SandboxError>; the app never crashes.
export default function MultiFileRunner({ files = [], runKey = 0 }) {
  const { t } = useLang()
  // Defer heavy compilation while the user types.
  const deferredFiles = useDeferredValue(files)

  const { AppComp, error } = useMemo(() => {
    try {
      void runKey // recompile on demand
      if (!deferredFiles.length) return { AppComp: null, error: null }
      return { AppComp: compileFiles(deferredFiles), error: null }
    } catch (err) {
      return { AppComp: null, error: err }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredFiles, runKey])

  if (error) return <SandboxError error={error} />
  if (!AppComp) {
    return <p className="text-[var(--muted)] text-sm p-4">{t(STRINGS.emptyHint)}</p>
  }
  return (
    <SandboxBoundary resetKey={runKey}>
      <AppComp />
    </SandboxBoundary>
  )
}
