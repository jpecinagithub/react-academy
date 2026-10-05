// Lightweight analytics wrapper around @vercel/analytics custom events.
// Never throws; safe to call anywhere (SSR-safe, adblock-safe).
let trackFn = null
async function loadTrack() {
  if (trackFn !== null) return
  try {
    const mod = await import('@vercel/analytics')
    trackFn = typeof mod.track === 'function' ? mod.track : false
  } catch {
    trackFn = false
  }
}
loadTrack()

export function track(event, data = {}) {
  if (!trackFn) {
    // Queue on window so late loads still fire; also swallow everything.
    try {
      window.va =
        window.va ||
        function (...args) {
          ;(window.vaq = window.vaq || []).push(args)
        }
      window.va('event', { name: event, data })
    } catch {
      /* analytics is best-effort */
    }
    return
  }
  try {
    trackFn(event, data)
  } catch {
    /* best-effort */
  }
}
