import { useEffect, useRef, useState } from 'react'
import { Play, Trash2 } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { track } from '../utils/analytics.js'

const STRINGS = {
  run: { en: 'Run', es: 'Ejecutar' },
  clear: { en: 'Clear', es: 'Limpiar' },
  consoleTitle: { en: 'Console', es: 'Consola' },
  empty: {
    en: 'Press Run to execute the code.',
    es: 'Pulsa Ejecutar para correr el código.',
  },
  timeout: {
    en: 'Execution timed out (3s) — possible infinite loop.',
    es: 'Tiempo de ejecución agotado (3 s): posible bucle infinito.',
  },
}

// iframe sandbox protocol: parent posts {type:'run', code}; iframe captures
// console.log/error/warn and window.onerror and posts back {type:'log',...}.
const IFRAME_SRC = `<!doctype html><html><body><script>
(function(){
  var post = function(msg){ parent.postMessage(msg, '*'); };
  ['log','info','warn','error'].forEach(function(m){
    var orig = console[m];
    console[m] = function(){
      var args = Array.prototype.map.call(arguments, function(a){
        try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
        catch(e){ return String(a); }
      });
      post({ type:'jsconsole', kind:m, text: args.join(' ') });
      return orig && orig.apply(console, arguments);
    };
  });
  window.onerror = function(msg, src, line, col){
    post({ type:'jsconsole', kind:'error', text: String(msg) + ' (' + line + ':' + col + ')' });
  };
  window.addEventListener('message', function(e){
    if(!e.data || e.data.type !== 'run') return;
    try {
      (0, eval)(e.data.code);
    } catch(err) {
      post({ type:'jsconsole', kind:'error', text: err.name + ': ' + err.message });
    }
    post({ type:'jsconsole', kind:'done' });
  });
})();
</script></body></html>`

// JsConsole — sandboxed plain-JS runner (used by Module 0 readiness labs).
// Props: { code } — runs on demand via the Run button, never on mount.
export default function JsConsole({ code }) {
  const { t } = useLang()
  const iframeRef = useRef(null)
  const timerRef = useRef(null)
  const [lines, setLines] = useState([])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const onMessage = (e) => {
      const d = e.data
      if (!d || d.type !== 'jsconsole') return
      if (d.kind === 'done') {
        setRunning(false)
        clearTimeout(timerRef.current)
        return
      }
      setLines((ls) => [...ls, { kind: d.kind, text: d.text }])
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      clearTimeout(timerRef.current)
    }
  }, [])

  const run = () => {
    setLines([])
    setRunning(true)
    track('jsconsole_run', {})
    iframeRef.current?.contentWindow?.postMessage({ type: 'run', code }, '*')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setLines((ls) => [...ls, { kind: 'error', text: t(STRINGS.timeout) }])
      setRunning(false)
      // Destroy the iframe to kill any runaway loop.
      if (iframeRef.current) iframeRef.current.srcdoc = IFRAME_SRC
    }, 3000)
  }

  return (
    <div className="rounded-xl border border-[var(--code-border)] overflow-hidden my-4 bg-[var(--code-bg)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--code-border)]">
        <span className="text-xs font-mono text-[var(--muted)]">{t(STRINGS.consoleTitle)}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn !py-1.5 !px-3 !text-xs"
            onClick={() => setLines([])}
          >
            <Trash2 size={13} />
            {t(STRINGS.clear)}
          </button>
          <button
            type="button"
            className="btn btn-primary !py-1.5 !px-3 !text-xs"
            onClick={run}
            disabled={running}
          >
            <Play size={13} />
            {running ? '…' : t(STRINGS.run)}
          </button>
        </div>
      </div>
      <div
        className="p-4 min-h-[120px] max-h-[280px] overflow-y-auto mono text-sm"
        role="log"
        aria-live="polite"
        aria-label={t(STRINGS.consoleTitle)}
      >
        {lines.length === 0 && (
          <p className="text-[var(--faint)] italic">{t(STRINGS.empty)}</p>
        )}
        {lines.map((l, i) => (
          <div
            key={i}
            className="py-0.5 border-b border-[var(--code-border)]/50 last:border-0 whitespace-pre-wrap break-words"
            style={{
              color:
                l.kind === 'error'
                  ? 'var(--red)'
                  : l.kind === 'warn'
                    ? 'var(--amber)'
                    : 'var(--text)',
            }}
          >
            <span className="text-[var(--faint)] mr-2 select-none">›</span>
            {l.text}
          </div>
        ))}
      </div>
      <iframe
        ref={iframeRef}
        title="js-sandbox"
        sandbox="allow-scripts"
        srcDoc={IFRAME_SRC}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
