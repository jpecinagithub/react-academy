import { Link } from 'react-router-dom'
import { Swords, PencilLine, Bug, BrainCircuit } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { PageHeader, Callout } from '../components/ui.jsx'

const STRINGS = {
  subtitle: {
    en: 'Complete code, hunt bugs, predict outputs. Challenges arrive in Phase 9.',
    es: 'Completa código, caza bugs, predice resultados. Los retos llegan en la Fase 9.',
  },
  categories: {
    en: [
      { icon: PencilLine, name: 'Fill in the blank', desc: 'Complete missing pieces of real components.' },
      { icon: Bug, name: 'Bug hunt', desc: 'Find the infinite useEffect, the missing key, the mutated state…' },
      { icon: BrainCircuit, name: 'Predict the output', desc: 'What renders after this click? Then watch it happen.' },
    ],
    es: [
      { icon: PencilLine, name: 'Completa el código', desc: 'Completa las piezas que faltan en componentes reales.' },
      { icon: Bug, name: 'Caza el bug', desc: 'Encuentra el useEffect infinito, la key que falta, el estado mutado…' },
      { icon: BrainCircuit, name: 'Predice el resultado', desc: '¿Qué se renderiza tras este clic? Luego míralo ocurrir.' },
    ],
  },
}

export default function Challenges() {
  const { t, lang } = useLang()
  return (
    <div>
      <PageHeader title={t('nav.challenges')} subtitle={t(STRINGS.subtitle)} icon={Swords} />
      <Callout type="info" title={t('common.comingSoon')}>
        {lang === 'es'
          ? 'La colección completa de retos llega en la Fase 9. El contrato ya está listo: '
          : 'The full challenge collection arrives in Phase 9. The contract is ready: '}
        <code className="mono text-[var(--accent)]">completeChallenge(id)</code>
        {lang === 'es' ? ' guarda cada reto superado.' : ' records every completed challenge.'}
      </Callout>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {STRINGS.categories[lang].map(({ icon: Icon, name, desc }) => (
          <div key={name} className="card p-6 text-center opacity-80">
            <span className="inline-block p-3 rounded-xl bg-[var(--accent-dim)] text-[var(--accent)] mb-3" aria-hidden="true">
              <Icon size={24} />
            </span>
            <h3 className="font-bold text-[var(--text-strong)]">{name}</h3>
            <p className="text-sm text-[var(--muted)] mt-2">{desc}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-[var(--muted)] mt-8">
        {lang === 'es' ? '¿Quieres calentar? Prueba el ' : 'Want a warm-up? Try the '}
        <Link to="/lab/hello-lab" className="text-[var(--accent)] underline">
          hello lab
        </Link>
        .
      </p>
    </div>
  )
}
