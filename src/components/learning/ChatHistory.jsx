import { useState } from 'react'
import { useChatStore } from '../../store/useChatStore'

export const ChatHistory = ({ onClose }) => {
  const { 
    savedConversations, 
    currentConversationId,
    loadConversation, 
    newConversation,
    deleteConversation 
  } = useChatStore()
  
  const [showConfirm, setShowConfirm] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = savedConversations
    .filter(conv => 
      conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages?.some(m => m.content?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  const handleLoadConversation = (conversationId) => {
    const success = loadConversation(conversationId)
    if (success && onClose) {
      onClose()
    }
  }

  const handleDelete = (conversationId) => {
    deleteConversation(conversationId)
    setShowConfirm(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Historial de Chats</h3>
          <p className="text-sm text-gray-500 mt-1">
            {savedConversations.length} conversaciones guardadas
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar en el historial..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {/* Boton nueva conversacion */}
      <button
        onClick={() => {
          newConversation()
          if (onClose) onClose()
        }}
        className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 mb-4 flex items-center justify-center gap-2"
      >
        <span>➕</span> Nueva Conversacion
      </button>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-2">💬</span>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'No se encontraron resultados' : 'No hay conversaciones guardadas'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {searchTerm ? 'Intenta con otra busqueda' : 'Inicia un chat para guardarlo aqui'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === currentConversationId
            const lastMessage = conv.messages[conv.messages.length - 1]
            const date = new Date(conv.updatedAt)
            const isToday = date.toDateString() === new Date().toDateString()
            const dateStr = isToday 
              ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
              : date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })

            return (
              <div
                key={conv.id}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  isActive
                    ? 'bg-primary/5 border-primary shadow-md'
                    : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                {/* Boton de eliminar (aparece al hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowConfirm(conv.id)
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300 p-1 rounded-lg hover:bg-red-50"
                  title="Eliminar conversacion"
                >
                  🗑️
                </button>

                {/* Contenido de la conversacion (click para cargar) */}
                <div onClick={() => handleLoadConversation(conv.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-semibold text-sm pr-6 ${
                      isActive ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {conv.title || 'Sin titulo'}
                    </h4>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {dateStr}
                    </span>
                  </div>
                  
                  {lastMessage && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {lastMessage.type === 'user' ? 'Tu: ' : 'EasyGo AI: '}
                      {lastMessage.content.substring(0, 80)}
                      {lastMessage.content.length > 80 ? '...' : ''}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {conv.messageCount || conv.messages.length} mensajes
                    </span>
                    {isActive && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">
                        Actual
                      </span>
                    )}
                  </div>
                </div>

                {/* Confirmacion de eliminacion */}
                {showConfirm === conv.id && (
                  <div className="absolute inset-0 bg-white/95 rounded-xl p-4 flex flex-col items-center justify-center z-10">
                    <p className="text-sm font-semibold text-gray-900 mb-2">¿Eliminar esta conversacion?</p>
                    <p className="text-xs text-gray-500 mb-3">Esta accion no se puede deshacer</p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(conv.id)
                        }}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowConfirm(null)
                        }}
                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Info de almacenamiento */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>💾</span>
          <span>Conversaciones guardadas en tu navegador</span>
        </div>
      </div>
    </div>
  )
}