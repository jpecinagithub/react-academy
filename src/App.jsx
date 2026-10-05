import { lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import { track } from './utils/analytics.js'

const Modules = lazy(() => import('./pages/Modules.jsx'))
const ModulePage = lazy(() => import('./pages/ModulePage.jsx'))
const LabPage = lazy(() => import('./pages/LabPage.jsx'))
const Playground = lazy(() => import('./pages/Playground.jsx'))
const Sandboxes = lazy(() => import('./pages/Sandboxes.jsx'))
const Challenges = lazy(() => import('./pages/Challenges.jsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Path = lazy(() => import('./pages/Path.jsx'))
const ConceptMap = lazy(() => import('./pages/ConceptMap.jsx'))
const Glossary = lazy(() => import('./pages/Glossary.jsx'))
const CheatSheets = lazy(() => import('./pages/CheatSheets.jsx'))
const Certificate = lazy(() => import('./pages/Certificate.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function RouteTracker() {
  const { pathname } = useLocation()
  useEffect(() => {
    track('page_view', { path: pathname })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/module/:id" element={<ModulePage />} />
        <Route path="/lab/:labId" element={<LabPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/sandboxes" element={<Sandboxes />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/quiz/:moduleId" element={<QuizPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/path" element={<Path />} />
        <Route path="/concepts" element={<ConceptMap />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/cheatsheets" element={<CheatSheets />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
