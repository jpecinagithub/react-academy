// Sandboxes 01–05: fundamentals.
export const items = [
  {
    id: 'counter',
    title: { en: 'Counter', es: 'Contador' },
    difficulty: 'beginner',
    blurb: {
      en: 'The classic first component: state + event in one screen.',
      es: 'El primer componente clásico: estado + evento en una pantalla.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [count, setCount] = useState(0);

  const btn = {
    margin: 4, padding: '8px 16px', borderRadius: 8,
    border: '1px solid #61dafb', background: 'transparent',
    color: '#e9f0f7', cursor: 'pointer', fontWeight: 600,
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, textAlign: 'center', color: '#e9f0f7' }}>
      <h2>Counter</h2>
      <p style={{ fontSize: 56, margin: '12px 0', fontWeight: 800 }}>{count}</p>
      <button style={btn} onClick={() => setCount(count - 1)}>-1</button>
      <button style={btn} onClick={() => setCount(0)}>Reset</button>
      <button style={btn} onClick={() => setCount(count + 1)}>+1</button>
      <p style={{ opacity: 0.6, fontSize: 13 }}>Every click calls setCount → React re-renders.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Try changing the initial value of useState(0).',
        'Add a button that doubles the count: setCount(count * 2).',
        'What happens if you call setCount(count + 1) three times in one handler?',
      ],
      es: [
        'Prueba a cambiar el valor inicial de useState(0).',
        'Añade un botón que duplique el contador: setCount(count * 2).',
        '¿Qué pasa si llamas setCount(count + 1) tres veces en el mismo handler?',
      ],
    },
  },
  {
    id: 'toggle',
    title: { en: 'Toggle', es: 'Interruptor' },
    difficulty: 'beginner',
    blurb: {
      en: 'Boolean state driving conditional rendering.',
      es: 'Estado booleano que controla renderizado condicional.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [on, setOn] = useState(false);

  const panel = {
    fontFamily: 'system-ui', padding: 24, borderRadius: 12, color: '#e9f0f7',
    background: on ? '#12351f' : '#2a1616',
    border: '1px solid ' + (on ? '#3ddc84' : '#ff6b6b'),
    transition: 'all .25s',
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>{on ? '💡 Lights ON' : '🌙 Lights OFF'}</h2>
        <p>{on ? 'The room is bright.' : 'The room is dark.'}</p>
        <button
          onClick={() => setOn(!on)}
          style={{
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            border: '1px solid #61dafb', background: '#61dafb', fontWeight: 700,
          }}
        >
          Turn {on ? 'off' : 'on'}
        </button>
      </div>
      {on && <p style={{ color: '#3ddc84' }}>✨ This paragraph only renders when on is true.</p>}
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'The {on && ...} pattern renders something only when a condition is true.',
        'Try making a second independent toggle (e.g. sound).',
        'Rename `on` to something clearer like `lightsOn` and see how readable it gets.',
      ],
      es: [
        'El patrón {on && ...} renderiza algo solo cuando la condición es verdadera.',
        'Prueba a crear un segundo interruptor independiente (p. ej. sonido).',
        'Renombra `on` a algo más claro como `lightsOn` y observa la legibilidad.',
      ],
    },
  },
  {
    id: 'accordion',
    title: { en: 'Accordion', es: 'Acordeón' },
    difficulty: 'beginner',
    blurb: {
      en: 'One open panel at a time — state as a single source of truth.',
      es: 'Un panel abierto a la vez: el estado como única fuente de verdad.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const ITEMS = [
  { q: 'What is a component?', a: 'A reusable, independent piece of UI.' },
  { q: 'What is state?', a: 'Data a component remembers between renders.' },
  { q: 'What is JSX?', a: 'A syntax extension that looks like HTML inside JS.' },
];

function App() {
  const [open, setOpen] = useState(0);

  const toggle = (i) => setOpen(open === i ? -1 : i);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 520, color: '#e9f0f7' }}>
      <h2>Accordion</h2>
      {ITEMS.map((item, i) => (
        <div key={i} style={{ border: '1px solid #2b3644', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
          <button
            onClick={() => toggle(i)}
            style={{
              width: '100%', textAlign: 'left', padding: 14, cursor: 'pointer',
              background: open === i ? '#16202c' : 'transparent',
              color: '#e9f0f7', border: 'none', fontWeight: 700, fontSize: 15,
            }}
          >
            {open === i ? '▾' : '▸'} {item.q}
          </button>
          {open === i && (
            <div style={{ padding: '0 14px 14px', opacity: 0.85 }}>{item.a}</div>
          )}
        </div>
      ))}
      <p style={{ opacity: 0.6, fontSize: 13 }}>State holds only an index: {String(open)}.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Allow several panels open at once: store an array of open indexes.',
        'Animate the opening with a max-height transition.',
        'Add keyboard support: make each header focusable and toggle on Enter.',
      ],
      es: [
        'Permite varios paneles abiertos: guarda un array de índices abiertos.',
        'Anima la apertura con una transición de max-height.',
        'Añade soporte de teclado: haz cada cabecera enfocable y que se abra con Enter.',
      ],
    },
  },
  {
    id: 'tabs',
    title: { en: 'Tabs', es: 'Pestañas' },
    difficulty: 'beginner',
    blurb: {
      en: 'Switch views with a single piece of state.',
      es: 'Cambia de vista con una única pieza de estado.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const TABS = [
  { id: 'home', label: 'Home', content: 'Welcome home! This is the first tab.' },
  { id: 'profile', label: 'Profile', content: 'Your profile lives here.' },
  { id: 'settings', label: 'Settings', content: 'Tweak things in settings.' },
];

function App() {
  const [active, setActive] = useState('home');
  const current = TABS.find((t) => t.id === active);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 520, color: '#e9f0f7' }}>
      <h2>Tabs</h2>
      <div role="tablist" style={{ display: 'flex', gap: 6, marginBottom: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: '10px 18px', borderRadius: '10px 10px 0 0', cursor: 'pointer',
              border: '1px solid #2b3644', borderBottom: 'none',
              background: active === t.id ? '#16202c' : 'transparent',
              color: active === t.id ? '#61dafb' : '#9aa7b5', fontWeight: 700,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid #2b3644', borderRadius: '0 10px 10px 10px', padding: 20, background: '#16202c' }}>
        {current.content}
      </div>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'The active tab id IS the state — everything derives from it.',
        'Try rendering the panels with conditional rendering instead of .find().',
        'Add a badge with a count on one tab (e.g. unread messages).',
      ],
      es: [
        'El id de la pestaña activa ES el estado: todo deriva de él.',
        'Prueba a renderizar los paneles con renderizado condicional en vez de .find().',
        'Añade una insignia con un contador en una pestaña (p. ej. mensajes sin leer).',
      ],
    },
  },
  {
    id: 'modal',
    title: { en: 'Modal', es: 'Modal' },
    difficulty: 'beginner',
    blurb: {
      en: 'Overlays, backdrop clicks and conditional mounting.',
      es: 'Capas superpuestas, clics en el fondo y montaje condicional.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, color: '#e9f0f7' }}>
      <h2>Modal</h2>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
          background: '#61dafb', border: 'none', fontWeight: 700,
        }}
      >
        Open modal
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#141b24', border: '1px solid #2b3644', borderRadius: 14,
              padding: 28, maxWidth: 360, color: '#e9f0f7',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Hello from the modal 👋</h3>
            <p style={{ opacity: 0.8 }}>Click the backdrop or the button to close me.</p>
            <button
              onClick={() => setOpen(false)}
              style={{ padding: '8px 18px', borderRadius: 8, cursor: 'pointer', border: '1px solid #61dafb', background: 'transparent', color: '#e9f0f7' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Why does stopPropagation matter? Remove it and click inside the modal.',
        'Close the modal with the Escape key: add a keydown listener in useEffect.',
        'Try mounting the modal content always but hiding it with CSS — notice the difference.',
      ],
      es: [
        '¿Por qué importa stopPropagation? Quítalo y haz clic dentro del modal.',
        'Cierra el modal con la tecla Escape: añade un listener keydown en useEffect.',
        'Prueba a montar siempre el contenido y ocultarlo con CSS: nota la diferencia.',
      ],
    },
  },
]
