// Lab registry — auto-discovers every labs/*/manifest.js (except _-prefixed
// dirs, which are templates/examples excluded on purpose).
const modules = import.meta.glob('./*/manifest.js', { eager: true })

export const LABS = Object.entries(modules)
  .filter(([path]) => !path.split('/')[1].startsWith('_'))
  .map(([path, mod]) => {
    const manifest = mod.default
    if (!manifest?.id || !manifest?.load) {
      console.warn('[labs] invalid manifest at', path)
      return null
    }
    return { ...manifest, __path: path }
  })
  .filter(Boolean)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

export function getLab(id) {
  return LABS.find((l) => l.id === id)
}

export function getLabsByModule(moduleId) {
  return LABS.filter((l) => l.moduleId === moduleId)
}
