import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TeamPage from './pages/TeamPage'
import StatsPage from './pages/StatsPage'
import InjuriesPage from './pages/InjuriesPage'
import TransfersPage from './pages/TransfersPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="team/:teamId" element={<TeamPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="injuries" element={<InjuriesPage />} />
        <Route path="transfers" element={<TransfersPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}

export default App
