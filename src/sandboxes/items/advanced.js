// Sandboxes 18–22: interaction + context + custom hooks.
export const items = [
  {
    id: 'drag-drop',
    title: { en: 'Drag & Drop', es: 'Arrastrar y soltar' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Move cards between lists with HTML5 drag events.',
      es: 'Mueve tarjetas entre listas con eventos drag de HTML5.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `function App() {
  const [lists, setLists] = useState({
    fruits: ['🍎 Apple', '🍌 Banana', '🍇 Grapes'],
    veggies: ['🥕 Carrot', '🥦 Broccoli'],
  });
  const [dragging, setDragging] = useState(null);

  const onDragStart = (list, item) => setDragging({ list, item });

  const onDrop = (target) => {
    if (!dragging || dragging.list === target) { setDragging(null); return; }
    setLists((prev) => ({
      ...prev,
      [dragging.list]: prev[dragging.list].filter((i) => i !== dragging.item),
      [target]: [...prev[target], dragging.item],
    }));
    setDragging(null);
  };

  const col = (id, title) => (
    <div
      key={id}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(id)}
      style={{ flex: 1, minHeight: 220, border: '2px dashed #2b3644', borderRadius: 12, padding: 12, background: '#0f141b' }}
    >
      <strong>{title}</strong>
      {lists[id].map((item) => (
        <div
          key={item}
          draggable
          onDragStart={() => onDragStart(id, item)}
          style={{
            margin: '8px 0', padding: 10, borderRadius: 8, background: '#16202c',
            cursor: 'grab', opacity: dragging && dragging.item === item ? 0.4 : 1,
          }}
        >
          {item}
        </div>
      ))}
      {lists[id].length === 0 && <p style={{ opacity: 0.4, fontSize: 13 }}>Drop here</p>}
    </div>
  );

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, color: '#e9f0f7' }}>
      <h2>Drag & Drop</h2>
      <p style={{ opacity: 0.7 }}>Drag a card from one list to the other.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        {col('fruits', '🍓 Fruits')}
        {col('veggies', '🥬 Veggies')}
      </div>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'onDragOver must preventDefault or the drop never fires.',
        'The dragged card is identified by state, not by the DOM.',
        'Try a third column and watch the same code scale.',
      ],
      es: [
        'onDragOver debe hacer preventDefault o el drop nunca se dispara.',
        'La tarjeta arrastrada se identifica por estado, no por el DOM.',
        'Prueba una tercera columna y observa cómo escala el mismo código.',
      ],
    },
  },
  {
    id: 'kanban',
    title: { en: 'Kanban board', es: 'Tablero kanban' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Move tasks through columns — state machines in disguise.',
      es: 'Mueve tareas entre columnas: máquinas de estado disfrazadas.',
    },
    files: [
      {
        name: 'App.jsx',
        code: `const COLUMNS = ['todo', 'doing', 'done'];
const LABELS = { todo: '📝 To do', doing: '⚙️ Doing', done: '✅ Done' };

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn components', col: 'done' },
    { id: 2, title: 'Master useState', col: 'doing' },
    { id: 3, title: 'Conquer useEffect', col: 'todo' },
  ]);
  const [text, setText] = useState('');

  const move = (id, dir) =>
    setTasks((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t;
        const i = COLUMNS.indexOf(t.col);
        const next = i + dir;
        if (next < 0 || next >= COLUMNS.length) return t;
        return { ...t, col: COLUMNS[next] };
      })
    );

  const add = () => {
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: text.trim(), col: 'todo' }]);
    setText('');
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, color: '#e9f0f7' }}>
      <h2>Kanban</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="New task…"
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #2b3644', background: '#0f141b', color: '#e9f0f7', flex: 1, maxWidth: 280 }}
        />
        <button onClick={add} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#61dafb', fontWeight: 700, cursor: 'pointer' }}>Add</button>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {COLUMNS.map((c) => (
          <div key={c} style={{ flex: 1, background: '#0f141b', border: '1px solid #2b3644', borderRadius: 12, padding: 12, minHeight: 240 }}>
            <strong>{LABELS[c]}</strong>
            {tasks.filter((t) => t.col === c).map((t) => (
              <div key={t.id} style={{ background: '#16202c', borderRadius: 8, padding: 10, marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>{t.title}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => move(t.id, -1)} disabled={t.col === 'todo'} style={kb()}>←</button>
                  <button onClick={() => move(t.id, 1)} disabled={t.col === 'done'} style={kb()}>→</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function kb() {
  return { padding: '4px 10px', borderRadius: 6, border: '1px solid #2b3644', background: 'transparent', color: '#e9f0f7', cursor: 'pointer' };
}`,
      },
    ],
    hints: {
      en: [
        'Each task knows its column — the board is derived by filtering.',
        'Replace the ← → buttons with real drag & drop (see the drag-drop sandbox).',
        'Add a delete button per task.',
      ],
      es: [
        'Cada tarea conoce su columna: el tablero se deriva filtrando.',
        'Sustituye los botones ← → por drag & drop real (mira el sandbox de drag-drop).',
        'Añade un botón de borrar por tarea.',
      ],
    },
  },
  {
    id: 'theme-context',
    title: { en: 'Theme Context', es: 'Contexto de tema' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Share theme without prop drilling — 3 files.',
      es: 'Comparte el tema sin prop drilling: 3 archivos.',
    },
    files: [
      {
        name: 'ThemeContext.jsx',
        code: `import { createContext, useContext, useState } from 'react';

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}`,
      },
      {
        name: 'ThemedPanel.jsx',
        code: `import { useTheme } from './ThemeContext.jsx';

export default function ThemedPanel() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <div style={{
      padding: 24, borderRadius: 12,
      background: dark ? '#0b0e11' : '#f7f9fc',
      color: dark ? '#e9f0f7' : '#141b24',
      border: '1px solid ' + (dark ? '#2b3644' : '#dbe2ea'),
      transition: 'all .25s',
    }}>
      <h3 style={{ marginTop: 0 }}>Themed panel ({theme})</h3>
      <p style={{ opacity: 0.7 }}>This component never received props — it reads the context.</p>
      <button
        onClick={toggle}
        style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', border: 'none', background: '#61dafb', fontWeight: 700 }}
      >
        Toggle theme
      </button>
    </div>
  );
}`,
      },
      {
        name: 'App.jsx',
        code: `import { ThemeProvider } from './ThemeContext.jsx';
import ThemedPanel from './ThemedPanel.jsx';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h2 style={{ color: '#e9f0f7' }}>Theme Context</h2>
      <ThemeProvider>
        <ThemedPanel />
        <p style={{ color: '#9aa7b5', fontSize: 13 }}>
          Notice: App renders the provider, ThemedPanel consumes it —
          no props travel between them.
        </p>
      </ThemeProvider>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Try importing the files with ./ThemeContext (no extension) — the resolver handles it.',
        'Add a second consumer component at a different depth.',
        'Break it on purpose: use useTheme() outside the provider.',
      ],
      es: [
        'Prueba a importar con ./ThemeContext (sin extensión): el resolvedor lo acepta.',
        'Añade un segundo consumidor en otra profundidad.',
        'Rómpelo a propósito: usa useTheme() fuera del provider.',
      ],
    },
  },
  {
    id: 'language-context',
    title: { en: 'Language Context', es: 'Contexto de idioma' },
    difficulty: 'intermediate',
    blurb: {
      en: 'A mini i18n system with Context — 3 files.',
      es: 'Un mini sistema i18n con Context: 3 archivos.',
    },
    files: [
      {
        name: 'LanguageContext.jsx',
        code: `import { createContext, useContext, useState } from 'react';

const DICT = {
  en: { greeting: 'Hello', text: 'This text comes from a dictionary.', button: 'Switch to Spanish' },
  es: { greeting: 'Hola', text: 'Este texto viene de un diccionario.', button: 'Cambiar a inglés' },
};

const LangCtx = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = (key) => DICT[lang][key];
  return (
    <LangCtx.Provider value={{ lang, setLang, t }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLanguage() {
  return useContext(LangCtx);
}`,
      },
      {
        name: 'Greeting.jsx',
        code: `import { useLanguage } from './LanguageContext.jsx';

export default function Greeting() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: 24, borderRadius: 12, background: '#141b24', border: '1px solid #2b3644' }}>
      <h3 style={{ marginTop: 0 }}>{t('greeting')} 👋</h3>
      <p style={{ opacity: 0.75 }}>{t('text')}</p>
    </div>
  );
}`,
      },
      {
        name: 'App.jsx',
        code: `import { LanguageProvider, useLanguage } from './LanguageContext.jsx';
import Greeting from './Greeting.jsx';

function Switcher() {
  const { lang, setLang, t } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      style={{ marginBottom: 16, padding: '8px 18px', borderRadius: 20, cursor: 'pointer', border: '1px solid #61dafb', background: 'transparent', color: '#e9f0f7', fontWeight: 700 }}
    >
      {t('button')}
    </button>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, color: '#e9f0f7' }}>
      <h2>Language Context</h2>
      <LanguageProvider>
        <Switcher />
        <Greeting />
      </LanguageProvider>
      <p style={{ opacity: 0.6, fontSize: 13 }}>One context value (lang) re-renders every consumer.</p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'Add a third language — only the DICT object changes.',
        'This is exactly how this academy’s own i18n works.',
        'Persist the language in localStorage with a useEffect.',
      ],
      es: [
        'Añade un tercer idioma: solo cambia el objeto DICT.',
        'Así funciona exactamente el i18n de esta academia.',
        'Persiste el idioma en localStorage con un useEffect.',
      ],
    },
  },
  {
    id: 'custom-hook',
    title: { en: 'Custom hook', es: 'Hook personalizado' },
    difficulty: 'intermediate',
    blurb: {
      en: 'Extract reusable logic: useLocalStorage — 2 files.',
      es: 'Extrae lógica reutilizable: useLocalStorage, 2 archivos.',
    },
    files: [
      {
        name: 'useLocalStorage.js',
        code: `import { useState } from 'react';

// A reusable hook: useState that survives page reloads.
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  const set = (next) => {
    const v = typeof next === 'function' ? next(value) : next;
    setValue(v);
    try {
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* storage full or unavailable */
    }
  };

  return [value, set];
}`,
      },
      {
        name: 'App.jsx',
        code: `import useLocalStorage from './useLocalStorage.js';

export default function App() {
  const [name, setName] = useLocalStorage('sandbox-name', '');
  const [count, setCount] = useLocalStorage('sandbox-count', 0);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 440, color: '#e9f0f7' }}>
      <h2>Custom hook: useLocalStorage</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name…"
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #2b3644', background: '#0f141b', color: '#e9f0f7', boxSizing: 'border-box', marginBottom: 12 }}
      />
      <p>Hello, <strong>{name || 'stranger'}</strong>!</p>
      <button onClick={() => setCount(count + 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #61dafb', background: 'transparent', color: '#e9f0f7', cursor: 'pointer', fontWeight: 600 }}>
        Clicks: {count}
      </button>
      <button onClick={() => { setName(''); setCount(0); }} style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid #2b3644', background: 'transparent', color: '#9aa7b5', cursor: 'pointer' }}>
        Reset
      </button>
      <p style={{ opacity: 0.6, fontSize: 13 }}>
        Press Run, change values, then run again — the state survived. 🎉
      </p>
    </div>
  );
}`,
      },
    ],
    hints: {
      en: [
        'The hook returns [value, set] just like useState — same API, superpower added.',
        'Write your own: useWindowSize() listening to resize events.',
        'Custom hooks are just functions that call other hooks.',
      ],
      es: [
        'El hook devuelve [value, set] como useState: misma API, superpoder añadido.',
        'Escribe el tuyo: useWindowSize() escuchando eventos resize.',
        'Los hooks personalizados son solo funciones que llaman a otros hooks.',
      ],
    },
  },
]
