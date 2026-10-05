// Sandbox library registry — the single source of truth for Phase 8.
// Each entry: { id, title: {en,es}, difficulty, blurb: {en,es},
//   files: [{ name, code }], hints: {en,es} }.
// Dashboard/Certificate totals (Phase 10) should consume SANDBOX_COUNT.
import { items as basics } from './items/basics.js'
import { items as forms } from './items/forms.js'
import { items as effects } from './items/effects.js'
import { items as advanced } from './items/advanced.js'
import { items as patterns } from './items/patterns.js'

export const SANDBOXES = [...basics, ...forms, ...effects, ...advanced, ...patterns]

export const SANDBOX_COUNT = SANDBOXES.length

export function getSandbox(id) {
  return SANDBOXES.find((s) => s.id === id) ?? null
}
