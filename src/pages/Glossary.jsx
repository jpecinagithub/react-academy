import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookMarked, Search } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { TERMS } from '../data/glossary.js'
import { getModule } from '../data/modules.js'
import { PageHeader } from '../components/ui.jsx'

const STRINGS = {
  subtitle: {
    en: 'Every key term, one definition, one example, one link.',
    es: 'Cada término clave: una definición, un ejemplo, un enlace.',
  },
  placeholder: { en: 'Search terms…', es: 'Buscar términos…' },
  noResults: {
    en: 'No terms match your search.',
    es: 'Ningún término coincide con tu búsqueda.',
  },
  openLesson: { en: 'Lesson', es: 'Lección' },
}

export default function Glossary() {
  const { t, lang } = useLang()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TERMS
    return TERMS.filter(
      (term) =>
        term.term.en.toLowerCase().includes(q) ||
        term.term.es.toLowerCase().includes(q) ||
        term.def.en.toLowerCase().includes(q) ||
        term.def.es.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title={t('nav.glossary')} subtitle={t(STRINGS.subtitle)} icon={BookMarked} />

      <div className="relative mb-6 no-print">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(STRINGS.placeholder)}
          aria-label={t(STRINGS.placeholder)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
        />
      </div>

      {results.length === 0 && <p className="text-[var(--muted)]">{t(STRINGS.noResults)}</p>}

      <dl className="flex flex-col gap-4">
        {results.map((term) => {
          const lesson = term.lesson ? getModule(term.lesson) : null
          return (
            <div key={term.id} className="card p-5">
              <dt className="text-lg font-bold text-[var(--accent)]">{term.term[lang] ?? term.term.en}</dt>
              <dd className="mt-1 text-[var(--text)]">{term.def[lang] ?? term.def.en}</dd>
              {term.example && (
                <dd>
                  <pre className="mono text-sm mt-3 p-3 rounded-lg bg-[var(--code-bg)] border border-[var(--code-border)] overflow-x-auto">
                    {term.example}
                  </pre>
                </dd>
              )}
              {lesson && (
                <dd className="mt-3">
                  <Link to={lesson.path} className="text-sm text-[var(--accent)] underline underline-offset-2">
                    {t(STRINGS.openLesson)}: {t(lesson.title)}
                  </Link>
                </dd>
              )}
            </div>
          )
        })}
      </dl>
    </div>
  )
}
