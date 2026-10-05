import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Atom, Menu, X, Moon, Sun, Languages, BookOpenCheck } from 'lucide-react'
import { useLang } from '../i18n/index.jsx'
import { useStore, applyTheme } from '../state/store.js'

const NAV_ITEMS = [
  { to: '/modules', key: 'modules' },
  { to: '/playground', key: 'playground' },
  { to: '/sandboxes', key: 'sandboxes' },
  { to: '/challenges', key: 'challenges' },
  { to: '/dashboard', key: 'dashboard' },
  { to: '/path', key: 'path' },
]

const MORE_ITEMS = [
  { to: '/concepts', key: 'concepts' },
  { to: '/glossary', key: 'glossary' },
  { to: '/cheatsheets', key: 'cheatsheets' },
  { to: '/certificate', key: 'certificate' },
  { to: '/about', key: 'about' },
]

function ThemeToggle() {
  const { t } = useLang()
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn !px-2.5 !py-2"
      aria-label={dark ? t('theme.toggleLight') : t('theme.toggleDark')}
      title={dark ? t('theme.toggleLight') : t('theme.toggleDark')}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

function LangToggle() {
  const { t, lang, setLang } = useLang()
  const next = lang === 'en' ? 'es' : 'en'
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      className="btn !px-2.5 !py-2"
      aria-label={t('language.label')}
      title={t('language.label')}
    >
      <Languages size={16} aria-hidden="true" />
      <span className="text-xs font-bold uppercase">{next}</span>
    </button>
  )
}

function TooltipModeToggle() {
  const { t } = useLang()
  const tooltipMode = useStore((s) => s.tooltipMode)
  const setTooltipMode = useStore((s) => s.setTooltipMode)
  return (
    <button
      type="button"
      onClick={() => setTooltipMode(!tooltipMode)}
      aria-pressed={tooltipMode}
      className="btn !px-2.5 !py-2"
      aria-label={tooltipMode ? t('tooltipMode.off') : t('tooltipMode.on')}
      title={t('tooltipMode.label')}
      style={
        tooltipMode
          ? { borderColor: 'var(--accent)', background: 'var(--accent-dim)', color: 'var(--accent)' }
          : undefined
      }
    >
      <BookOpenCheck size={16} aria-hidden="true" />
    </button>
  )
}

export default function Layout({ children }) {
  const { t, lang } = useLang()
  const theme = useStore((s) => s.theme)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-[var(--accent)] bg-[var(--accent-dim)]'
        : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--surface)] focus:rounded-lg"
      >
        {lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>

      <header
        className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur"
        style={{ height: 'var(--header-h)' }}
      >
        <div className="max-w-[var(--max-w-wide)] mx-auto px-4 h-full flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={t('brand.name')}>
            <span
              className="p-1.5 rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]"
              aria-hidden="true"
            >
              <Atom size={22} />
            </span>
            <span className="hidden sm:block">
              <span className="block font-bold text-[var(--text-strong)] leading-tight text-[15px]">
                {t('brand.short')}
              </span>
              <span className="block text-[11px] text-[var(--faint)] leading-tight">
                {t('brand.tagline')}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label={t('nav.home')}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkCls}>
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
            <NavLink to="/concepts" className={linkCls}>
              {t('nav.concepts')}
            </NavLink>
            <NavLink to="/glossary" className={linkCls}>
              {t('nav.glossary')}
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <TooltipModeToggle />
              <LangToggle />
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="btn !px-2.5 !py-2 lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 flex flex-col gap-1 max-h-[70vh] overflow-y-auto"
            aria-label="mobile"
          >
            {[...NAV_ITEMS, ...MORE_ITEMS].map((item) => (
              <NavLink key={item.to} to={item.to} className={linkCls}>
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
            <div className="flex md:hidden items-center gap-2 pt-3">
              <TooltipModeToggle />
              <LangToggle />
              <ThemeToggle />
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1 w-full max-w-[var(--max-w-wide)] mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-[var(--border)] mt-8">
        <div className="max-w-[var(--max-w-wide)] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <p className="flex items-center gap-2">
            <Atom size={16} className="text-[var(--accent)]" aria-hidden="true" />
            {t('footer.author')}
          </p>
          <p>{t('footer.tagline')}</p>
          <Link to="/about" className="hover:text-[var(--text)] transition-colors">
            {t('footer.about')}
          </Link>
        </div>
      </footer>
    </div>
  )
}
