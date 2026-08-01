import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import ATSScorerPage from '../pages/ATSScorerPage'
import HistoryPage from '../pages/HistoryPage'
import ResourcesPage from '../pages/ResourcesPage'
import AboutPage from '../pages/AboutPage'
import ProtectedRoute from '../components/common/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/scorer" element={<ATSScorerPage />} />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
