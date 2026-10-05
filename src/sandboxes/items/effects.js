// Sandboxes 12–17: effects, timers, simulated async.
export const items = [
  {
    id: 'timer',
    title: { en: 'Timer', es: 'Temporizador' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Countdown with useEffect + cleanup.',
      es: 'Cuenta atrás con useEffect + limpieza.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [seconds, setSeconds] = useState(10);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) { setRunning(false); return; }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id); // cleanup!
  }, [running, seconds]);

  const reset = () => { setRunning(false); setSeconds(10); };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, textAlign: 'center', color: '#e9f0f7' }}>
      <h2>Timer</h2>
      <p style={{ fontSize: 64, margin: '8px 0', fontWeight: 800, color: seconds === 0 ? '#3ddc84' : '#e9f0f7' }}>
        {seconds === 0 ? '🎉' : seconds}
      </p>
      <button onClick={() => setRunning(!running)} style={btnStyle()}>{running ? 'Pause' : 'Start'}</button>
      <button onClick={reset} style={btnStyle()}>Reset</button>
      <p style={{ opacity: 0.6, fontSize: 13 }}>The interval is created and destroyed by the effect.</p>
    </div>
  );
}

function btnStyle() {
  return { margin: 4, padding: '8px 18px', borderRadius: 8, border: '1px solid #61dafb', background: 'transparent', color: '#e9f0f7', cursor: 'pointer', fontWeight: 600 };
}`,
      },
    ],
    hints: {
      en: [
        'Remove the cleanup (return () => clearInterval) and watch intervals pile up.',
        'Why is setSeconds((s) => s - 1) used instead of setSeconds(seconds - 1)?',
        'Make the starting value configurable with an input.',
      ],
      es: [
        'Quita la limpieza (return () => clearInterval) y observa cómo se acumulan intervalos.',
        '¿Por qué se usa setSeconds((s) => s - 1) en vez de setSeconds(seconds - 1)?',
        'Haz configurable el valor inicial con un input.',
      ],
    },
  },
  {
    id: 'stopwatch',
    title: { en: 'Stopwatch', es: 'Cronómetro' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Laps, precision and refs that do not re-render.',
      es: 'Vueltas, precisión y refs que no re-renderizan.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [elapsed, setElapsed] = useState(0); // ms
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(baseRef.current + Date.now() - startRef.current);
    }, 31);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const stop = () => { baseRef.current = elapsed; setRunning(false); };
  const reset = () => { setRunning(false); setElapsed(0); baseRef.current = 0; setLaps([]); };
  const lap = () => setLaps([...laps, elapsed]);

  const fmt = (ms) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const c = Math.floor((ms % 1000) / 10);
    const pad = (n) => String(n).padStart(2, '0');
    return pad(m) + ':' + pad(s) + '.' + pad(c);
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 420, color: '#e9f0f7' }}>
      <h2>Stopwatch</h2>
      <p className="mono" style={{ fontSize: 48, margin: '8px 0' }}>{fmt(elapsed)}</p>
      <div>
        {!running
          ? <button onClick={start} style={b()}>Start</button>
          : <button onClick={stop} style={b()}>Stop</button>}
        <button onClick={lap} disabled={!running} style={b()}>Lap</button>
        <button onClick={reset} style={b()}>Reset</button>
      </div>
      <ol style={{ paddingLeft: 20 }}>
        {laps.map((l, i) => <li key={i} className="mono">{fmt(l)}</li>)}
      </ol>
    </div>
  );
}

function b() {
  return { margin: 4, padding: '8px 16px', borderRadius: 8, border: '1px solid #61dafb', background: 'transparent', color: '#e9f0f7', cursor: 'pointer', fontWeight: 600 };
}`,
      },
    ],
    hints: {
      en: [
        'Refs hold mutable values without causing re-renders.',
        'Why does the effect depend only on [running], not on elapsed?',
        'Add a "best lap" highlight for the fastest lap.',
      ],
      es: [
        'Las refs guardan valores mutables sin provocar re-renders.',
        '¿Por qué el efecto depende solo de [running] y no de elapsed?',
        'Añade un resaltado de "mejor vuelta" para la más rápida.',
      ],
    },
  },
  {
    id: 'api-fetcher',
    title: { en: 'API Fetcher', es: 'Cargador de API' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Loading, success and error — with latency and failure dials.',
      es: 'Carga, éxito y error: con diales de latencia y fallo.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const FAKE_USERS = [
  { id: 1, name: 'Ada Lovelace', role: 'Pioneer' },
  { id: 2, name: 'Grace Hopper', role: 'Admiral' },
  { id: 3, name: 'Margaret Hamilton', role: 'Engineer' },
];

function fakeFetch(latency, shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('Network exploded (simulated) 💥'));
      else resolve(FAKE_USERS);
    }, latency);
  });
}

function App() {
  const [latency, setLatency] = useState(1200);
  const [fail, setFail] = useState(false);
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (runId === 0) return;
    let cancelled = false;
    setStatus('loading'); setData(null); setError(null);
    fakeFetch(latency, fail)
      .then((users) => { if (!cancelled) { setData(users); setStatus('success'); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setStatus('error'); } });
    return () => { cancelled = true; };
  }, [runId]);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 480, color: '#e9f0f7' }}>
      <h2>API Fetcher <span style={{ fontSize: 13, opacity: 0.6 }}>(simulated)</span></h2>
      <label style={{ display: 'block', marginBottom: 8 }}>
        Latency: {latency}ms
        <input type="range" min={200} max={3000} step={100} value={latency}
          onChange={(e) => setLatency(Number(e.target.value))} style={{ width: '100%' }} />
      </label>
      <label style={{ display: 'block', marginBottom: 12 }}>
        <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} /> Simulate failure
      </label>
      <button onClick={() => setRunId((n) => n + 1)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#61dafb', fontWeight: 700, cursor: 'pointer' }}>
        Fetch users
      </button>

      <div style={{ marginTop: 16, minHeight: 120, border: '1px dashed #2b3644', borderRadius: 10, padding: 16 }}>
        {status === 'idle' && <p style={{ opacity: 0.5 }}>Press Fetch to start.</p>}
        {status === 'loading' && <p>⏳ Loading… (try unmounting? you cannot — but cancelled handles it)</p>}
        {status === 'success' && (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {data.map((u) => <li key={u.id}><strong>{u.name}</strong> <span style={{ opacity: 0.6 }}>— {u.role}</span></li>)}
          </ul>
        )}
        {status === 'error' && <p style={{ color: '#ff6b6b' }}>❌ {error}</p>}
      </div>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'The cancelled flag prevents setState after the effect is cleaned up.',
        'Crank latency to 3000ms and toggle failure: watch the three states.',
        'In a real app you would use fetch() here — the state machine stays the same.',
      ],
      es: [
        'La bandera cancelled evita setState tras la limpieza del efecto.',
        'Sube la latencia a 3000ms y activa el fallo: observa los tres estados.',
        'En una app real usarías fetch() aquí; la máquina de estados es la misma.',
      ],
    },
  },
  {
    id: 'weather-ui',
    title: { en: 'Weather UI demo', es: 'Demo de UI del tiempo' },
    difficulty: 'beginner',
    blurb: {
      en: 'City picker driving a simulated weather fetch.',
      es: 'Selector de ciudad que dispara una carga simulada del tiempo.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const WEATHER = {
  Madrid: { temp: 24, icon: '☀️', desc: 'Sunny' },
  London: { temp: 14, icon: '🌧️', desc: 'Rainy' },
  Oslo: { temp: 6, icon: '❄️', desc: 'Snowy' },
  Tokyo: { temp: 19, icon: '⛅', desc: 'Cloudy' },
};

function App() {
  const [city, setCity] = useState('Madrid');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(WEATHER.Madrid);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setWeather(WEATHER[city]);
      setLoading(false);
    }, 700); // simulated network
    return () => clearTimeout(id);
  }, [city]);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 380, color: '#e9f0f7' }}>
      <h2>Weather</h2>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.keys(WEATHER).map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            style={{
              padding: '8px 14px', borderRadius: 20, cursor: 'pointer',
              border: '1px solid #61dafb',
              background: city === c ? '#61dafb' : 'transparent',
              color: city === c ? '#0b0e11' : '#e9f0f7', fontWeight: 700,
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid #2b3644', borderRadius: 14, padding: 28, textAlign: 'center', background: '#141b24', opacity: loading ? 0.5 : 1, transition: 'opacity .2s' }}>
        <div style={{ fontSize: 56 }}>{weather.icon}</div>
        <div style={{ fontSize: 40, fontWeight: 800 }}>{weather.temp}°C</div>
        <div style={{ opacity: 0.7 }}>{weather.desc} in {city}</div>
      </div>
      <p style={{ opacity: 0.6, fontSize: 13 }}>Changing city re-runs the effect → refetch.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Click cities quickly: the cleanup cancels stale timeouts.',
        'Add a 5th city to the WEATHER map — no other code changes needed.',
        'Replace the setTimeout with a real fetch() to a weather API.',
      ],
      es: [
        'Haz clic rápido en ciudades: la limpieza cancela timeouts obsoletos.',
        'Añade una 5.ª ciudad al mapa WEATHER: no hace falta cambiar más código.',
        'Sustituye el setTimeout por un fetch() real a una API del tiempo.',
      ],
    },
  },
  {
    id: 'pagination',
    title: { en: 'Pagination', es: 'Paginación' },
    difficulty: 'beginner',
    blurb: {
      en: 'Slice big lists with page state.',
      es: 'Trocea listas grandes con estado de página.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const ITEMS = Array.from({ length: 42 }, (_, i) => 'Item #' + (i + 1));
const PER_PAGE = 6;

function App() {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(ITEMS.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = ITEMS.slice(start, start + PER_PAGE);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 480, color: '#e9f0f7' }}>
      <h2>Pagination</h2>
      <ul style={{ listStyle: 'none', padding: 0, minHeight: 180 }}>
        {visible.map((it) => (
          <li key={it} style={{ padding: '10px 4px', borderBottom: '1px solid #1d2632' }}>{it}</li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 12 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pg()}>←</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            style={{ ...pg(), background: n === page ? '#61dafb' : 'transparent', color: n === page ? '#0b0e11' : '#e9f0f7', fontWeight: n === page ? 800 : 400 }}
          >
            {n}
          </button>
        ))}
        <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} style={pg()}>→</button>
      </div>
      <p style={{ opacity: 0.6, fontSize: 13 }}>Page {page} of {pages} — slice({start}, {start + PER_PAGE}).</p>
    </div>
  );
}

function pg() {
  return { minWidth: 36, padding: '6px 10px', borderRadius: 8, border: '1px solid #2b3644', cursor: 'pointer' };
}`,
      },
    ],
    hints: {
      en: [
        'Only `page` is state; visible items are derived with slice().',
        'Change PER_PAGE to 10 and watch the page buttons adapt.',
        'Add ellipsis (…) when there are many pages.',
      ],
      es: [
        'Solo `page` es estado; los items visibles se derivan con slice().',
        'Cambia PER_PAGE a 10 y observa cómo se adaptan los botones.',
        'Añade puntos suspensivos (…) cuando haya muchas páginas.',
      ],
    },
  },
  {
    id: 'infinite-scroll',
    title: { en: 'Infinite scroll simulation', es: 'Simulación de scroll infinito' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Append pages as the user scrolls.',
      es: 'Añade páginas a medida que el usuario hace scroll.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const BATCH = 15;
const MAX = 120;

function App() {
  const [count, setCount] = useState(BATCH);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading || count >= MAX) return;
    setLoading(true);
    setTimeout(() => {
      setCount((c) => Math.min(MAX, c + BATCH));
      setLoading(false);
    }, 500); // simulated network
  };

  const onScroll = (e) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) loadMore();
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 440, color: '#e9f0f7' }}>
      <h2>Infinite scroll</h2>
      <div
        onScroll={onScroll}
        style={{ height: 320, overflowY: 'auto', border: '1px solid #2b3644', borderRadius: 12, padding: 12, background: '#0f141b' }}
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{ padding: 12, marginBottom: 8, borderRadius: 8, background: '#16202c' }}>
            Post #{i + 1}
          </div>
        ))}
        <div style={{ textAlign: 'center', padding: 12, opacity: 0.6 }}>
          {loading ? 'Loading more…' : count >= MAX ? '🎉 You reached the end!' : 'Scroll for more'}
        </div>
      </div>
      <p style={{ opacity: 0.6, fontSize: 13 }}>onScroll detects the bottom → loads the next batch.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'The 60px threshold triggers the load before hitting the absolute bottom.',
        'In real apps the trigger is often an IntersectionObserver.',
        'Add a "back to top" button that appears after scrolling down.',
      ],
      es: [
        'El umbral de 60px dispara la carga antes de llegar al fondo absoluto.',
        'En apps reales el disparador suele ser un IntersectionObserver.',
        'Añade un botón "volver arriba" que aparezca al bajar.',
      ],
    },
  },
]
