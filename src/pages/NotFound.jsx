import { Link } from 'react-router-dom'
import { Ghost } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'

export default function NotFound() {
  const { t, lang } = useLang()
  return (
    <div className="text-center py-24">
      <Ghost size={48} className="mx-auto mb-4 text-[var(--faint)]" aria-hidden="true" />
      <h1 className="text-4xl font-bold text-[var(--text-strong)] mb-2">404</h1>
      <p className="text-[var(--muted)] mb-6">
        {lang === 'es' ? 'Esta ruta no existe.' : 'This route does not exist.'}
      </p>
      <Link to="/" className="btn btn-primary">
        {t('nav.home')}
      </Link>
    </div>
  )
}
