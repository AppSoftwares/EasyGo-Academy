import { useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'

export const VideosPage = () => {
  const [currentVideo, setCurrentVideo] = useState(null)

  const videos = [
    { id: 1, title: 'Introduccion al Ingles', duration: '10:30', level: 'Principiante', thumbnail: '🎬' },
    { id: 2, title: 'Pronunciacion Basica', duration: '15:45', level: 'Principiante', thumbnail: '🎬' },
    { id: 3, title: 'Conversacion Cotidiana', duration: '20:00', level: 'Intermedio', thumbnail: '🎬' },
    { id: 4, title: 'Ingles para Negocios', duration: '25:15', level: 'Avanzado', thumbnail: '🎬' },
    { id: 5, title: 'Entrevistas de Trabajo', duration: '18:30', level: 'Intermedio', thumbnail: '🎬' },
    { id: 6, title: 'Presentaciones Ejecutivas', duration: '22:00', level: 'Avanzado', thumbnail: '🎬' }
  ]

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Video Player - Arriba en móvil */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-none">
          <div className="bg-black rounded-xl sm:rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
            {currentVideo ? (
              <div className="text-white text-center p-4">
                <span className="text-4xl sm:text-6xl mb-4 block">🎥</span>
                <p className="text-lg sm:text-2xl font-bold">{currentVideo.title}</p>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Reproduciendo video...</p>
              </div>
            ) : (
              <div className="text-white text-center p-4">
                <span className="text-4xl sm:text-6xl mb-4 block">📺</span>
                <p className="text-lg sm:text-2xl font-bold">Selecciona un video</p>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Elige un video de la lista para comenzar</p>
              </div>
            )}
          </div>

          {currentVideo && (
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">{currentVideo.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4">Aprende los fundamentos basicos del idioma ingles con este video tutorial.</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button className="bg-primary text-white px-4 py-2 sm:py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors text-sm sm:text-base">
                  📝 Tomar Notas
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base">
                  📥 Descargar Transcripcion
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video List - Abajo en móvil */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 order-2 lg:order-none">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Lista de Reproduccion</h3>
          <div className="space-y-2 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setCurrentVideo(video)}
                className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                  currentVideo?.id === video.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl">{video.thumbnail}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{video.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
                        currentVideo?.id === video.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                      }`}>
                        {video.level}
                      </span>
                      <span className={`text-xs sm:text-sm ${currentVideo?.id === video.id ? 'text-white/70' : 'text-gray-500'}`}>
                        {video.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}