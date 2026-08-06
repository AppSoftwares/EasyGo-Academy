// src/pages/DashboardPage.jsx - VERSIÓN COMPONENTIZADA
import { useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { ProgressCard } from '../components/dashboard/ProgressCard'
import { ContinueLearning } from '../components/dashboard/ContinueLearning'
import { UpcomingClass } from '../components/dashboard/UpcomingClass'
import { QuickAccess } from '../components/dashboard/QuickAccess'
import { LevelTestInline } from '../components/dashboard/LevelTestInline'
import { TutorIA } from '../components/dashboard/TutorIA'
import { LearningPath } from '../components/dashboard/LearningPath'
import { WeeklyRanking } from '../components/dashboard/WeeklyRanking'
import { RecommendedResources } from '../components/dashboard/RecommendedResources'
import { CommunityPosts } from '../components/dashboard/CommunityPosts'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { useAuthStore } from '../store/useAuthStore'

export const DashboardPage = () => {
  const { user } = useAuthStore()
  const userName = user?.name?.split(' ')[0] || 'Estudiante'
  const needsLevelTest = !user?.levelTestCompleted
  const [showDashboard, setShowDashboard] = useState(!needsLevelTest)

  const handleTestComplete = (results) => {
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  if (needsLevelTest && !showDashboard) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              ¡Bienvenido, {userName}! 👋
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Antes de empezar, necesitamos conocer tu nivel de inglés
            </p>
          </div>
          <LevelTestInline onComplete={handleTestComplete} />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* ============ HEADER ============ */}
        <DashboardHeader />

        {/* ============ FILA 1: PROGRESO + TUTOR IA ============ */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProgressCard />
          </div>
          <TutorIA />
        </div>

        {/* ============ FILA 2: CONTINUAR + CLASE + COMUNIDAD ============ */}
        <div className="grid md:grid-cols-3 gap-6">
          <ContinueLearning />
          <UpcomingClass />
          <CommunityPosts />
        </div>

        {/* ============ FILA 3: ACCESOS RÁPIDOS ============ */}
        <QuickAccess />

        {/* ============ FILA 4: RUTA + RANKING + RECURSOS ============ */}
        <div className="grid md:grid-cols-3 gap-6">
          <LearningPath />
          <WeeklyRanking />
          <RecommendedResources />
        </div>
      </div>
    </DashboardLayout>
  )
}