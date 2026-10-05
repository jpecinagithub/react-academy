import { User } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { PageHeader } from '../components/ui.jsx'

const STRINGS = {
  subtitle: {
    en: 'About the author',
    es: 'Sobre el autor',
  },
  name: { en: 'Jon Peciña Iturbe', es: 'Jon Peciña Iturbe' },
  body: {
    en: 'Jon Peciña Iturbe builds interactive educational portals that make complex technical concepts understandable through experimentation, visualizations and hands-on learning.\n\nReact Fundamentals Academy is part of that collection: instead of pages of theory, it offers simulators, labs and challenges where you learn React by seeing it work — touching, changing, executing, breaking, comparing and observing.\n\nThe academy runs entirely in your browser. No accounts, no paywalls, no tracking of personal data: just you and React.',
    es: 'Jon Peciña Iturbe crea portales educativos interactivos que hacen comprensibles conceptos técnicos complejos mediante experimentación, visualizaciones y aprendizaje práctico.\n\nReact Fundamentals Academy forma parte de esa colección: en lugar de páginas de teoría, ofrece simuladores, laboratorios y retos donde aprendes React viéndolo funcionar — tocando, cambiando, ejecutando, rompiendo, comparando y observando.\n\nLa academia funciona por completo en tu navegador. Sin cuentas, sin muros de pago, sin rastreo de datos personales: solo tú y React.',
  },
}

export default function About() {
  const { t } = useLang()
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title={t('nav.about')} subtitle={t(STRINGS.subtitle)} icon={User} />
      <div className="card p-8 md:p-10">
        <div className="w-20 h-20 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center mb-6" aria-hidden="true">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-strong)] mb-4">{t(STRINGS.name)}</h2>
        {t(STRINGS.body)
          .split('\n\n')
          .map((p, i) => (
            <p key={i} className="text-[var(--text)] leading-relaxed mb-4">
              {p}
            </p>
          ))}
      </div>
    </div>
  )
}
