import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { LanguageProvider } from './i18n/index.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-[var(--muted)]">
              Loading…
            </div>
          }
        >
          <App />
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
