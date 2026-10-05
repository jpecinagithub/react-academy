import { Printer, FileText } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { PageHeader, Callout } from '../components/ui.jsx'

// Placeholder cards for the 8 cheat sheets. Phase 10 fills real content;
// the print pipeline (window.print + @media print CSS) is wired now.
const SHEETS = [
  { id: 'usestate', en: 'useState', es: 'useState' },
  { id: 'useeffect', en: 'useEffect', es: 'useEffect' },
  { id: 'jsx', en: 'JSX', es: 'JSX' },
  { id: 'events', en: 'Events', es: 'Eventos' },
  { id: 'arrays', en: 'Arrays & Keys', es: 'Arrays y keys' },
  { id: 'forms', en: 'Forms', es: 'Formularios' },
  { id: 'router', en: 'React Router', es: 'React Router' },
  { id: 'hooks', en: 'Hooks', es: 'Hooks' },
]

const STRINGS = {
  subtitle: {
    en: 'Quick-reference cards. Print any of them with your browser — the layout is print-ready.',
    es: 'Fichas de referencia rápida. Imprímelas con tu navegador: el diseño está listo para impresión.',
  },
  printOne: { en: 'Print', es: 'Imprimir' },
}

export default function CheatSheets() {
  const { t, lang } = useLang()
  return (
    <div>
      <PageHeader
        title={t('nav.cheatsheets')}
        subtitle={t(STRINGS.subtitle)}
        icon={FileText}
        actions={
          <button type="button" className="btn no-print" onClick={() => window.print()}>
            <Printer size={15} />
            {t('common.print')}
          </button>
        }
      />
      <Callout type="info" title={t('common.comingSoon')}>
        {lang === 'es'
          ? 'El contenido detallado de cada ficha llega en la Fase 10.'
          : 'Detailed content for each sheet arrives in Phase 10.'}
      </Callout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {SHEETS.map((s) => (
          <div key={s.id} className="card print-sheet p-6 text-center opacity-80">
            <FileText size={28} className="mx-auto mb-3 text-[var(--accent)]" aria-hidden="true" />
            <h3 className="font-bold text-[var(--text-strong)]">{s[lang]}</h3>
            <p className="mono text-xs text-[var(--faint)] mt-1">cheatsheet/{s.id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
