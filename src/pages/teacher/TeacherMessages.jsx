// src/pages/teacher/TeacherMessages.jsx
import { useState, useEffect, useRef } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'
import { useAuthStore } from '../../store/useAuthStore'

export const TeacherMessages = () => {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [students, setStudents] = useState([])
  const [selectedStudentForChat, setSelectedStudentForChat] = useState(null)

  useEffect(() => {
    loadConversations()
    loadStudents()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadMessages(selectedStudent.id)
    }
  }, [selectedStudent])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const res = await teacherService.getMessages()
      if (res.data.success) {
        setConversations(res.data.conversations || [])
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    try {
      const res = await teacherService.getMyStudents()
      if (res.data.success) {
        setStudents(res.data.students || [])
      }
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  const loadMessages = async (studentId) => {
    try {
      const res = await teacherService.getConversation(studentId)
      if (res.data.success) {
        setMessages(res.data.messages || [])
        await teacherService.markMessageAsRead(studentId)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return
    
    setSending(true)
    try {
      const res = await teacherService.sendMessage(selectedStudent.id, newMessage)
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message])
        setNewMessage('')
        loadConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error al enviar el mensaje')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewChat = () => {
    if (selectedStudentForChat) {
      setSelectedStudent(selectedStudentForChat)
      setShowNewChatModal(false)
      setSelectedStudentForChat(null)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} h`
    if (diffDays < 7) return `Hace ${diffDays} d`
    return date.toLocaleDateString('es-ES')
  }

  return (
    <TeacherLayout>
      <div className="h-[calc(100vh-120px)]">
        <div className="flex h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Panel izquierdo */}
          <div className="w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-900">Mensajes</h2>
                <button 
                  onClick={() => setShowNewChatModal(true)}
                  className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition"
                >
                  +
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar conversación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary/30"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl block mb-2">💬</span>
                  <p className="text-gray-500 text-sm">No hay conversaciones</p>
                  <button 
                    onClick={() => setShowNewChatModal(true)}
                    className="mt-3 text-primary text-sm font-semibold"
                  >
                    Iniciar nueva conversación →
                  </button>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <div
                    key={conv.student?.id}
                    onClick={() => setSelectedStudent(conv.student)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedStudent?.id === conv.student?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-primary font-bold">
                          {conv.student?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {conv.student?.name}
                          </h3>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {conv.student?.assignedLevel || 'A1'} • {conv.student?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel derecho - Chat */}
          {selectedStudent ? (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {selectedStudent.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-xs text-gray-500">{selectedStudent.email} • Nivel {selectedStudent.assignedLevel || 'A1'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedStudent(null)
                    setMessages([])
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-5xl block mb-3">💬</span>
                    <p className="text-gray-500">No hay mensajes aún</p>
                    <p className="text-sm text-gray-400 mt-1">Envía un mensaje para iniciar la conversación</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isTeacher = msg.senderId === user?.id
                    return (
                      <div key={msg.id || idx} className={`flex ${isTeacher ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isTeacher ? 'bg-primary text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl' : 'bg-white border border-gray-200 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl'} p-3 shadow-sm`}>
                          <p className={`text-sm ${isTeacher ? 'text-white' : 'text-gray-700'}`}>
                            {msg.message}
                          </p>
                          <p className={`text-[10px] mt-1 ${isTeacher ? 'text-white/70' : 'text-gray-400'}`}>
                            {msg.createdAt ? formatTime(msg.createdAt) : 'Ahora'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje aquí..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:border-primary/30 outline-none"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-5 py-2 bg-primary text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-primary-dark transition self-end"
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Presiona Enter para enviar, Shift+Enter para nueva línea
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <span className="text-6xl block mb-4">💬</span>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Mensajes</h3>
                <p className="text-gray-500 mb-4">Selecciona una conversación para empezar a chatear</p>
                <button 
                  onClick={() => setShowNewChatModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition"
                >
                  Iniciar nueva conversación
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal nueva conversación */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewChatModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Nueva Conversación</h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona un alumno</label>
              <select 
                value={selectedStudentForChat?.id || ''} 
                onChange={(e) => {
                  const student = students.find(s => s.id === parseInt(e.target.value))
                  setSelectedStudentForChat(student)
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="">-- Seleccionar alumno --</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.email} (Nivel {student.assignedLevel || 'A1'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={startNewChat} 
                disabled={!selectedStudentForChat}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
              >
                Iniciar conversación
              </button>
              <button 
                onClick={() => setShowNewChatModal(false)} 
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  )
}