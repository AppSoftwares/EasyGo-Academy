import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { geminiService } from '../services/geminiService'

export const useChatStore = create(
  persist(
    (set, get) => ({
      // Conversación actual
      messages: [
        {
          id: 1,
          type: 'ai',
          content: `¡Hola! 👋 Soy **EasyGo AI Tutor**, tu asistente personal de aprendizaje de ingles en **EasyGo Academy**.

Estoy aqui para ayudarte con:
🗣️ Practica de conversacion 24/7
📚 Explicaciones de gramatica
📝 Ejercicios personalizados
🎯 Correccion de pronunciacion
💡 Tips de aprendizaje

**¿Sabias que?** En EasyGo Academy tambien tienes acceso a:
✅ Clases en vivo con profesores nativos
✅ Videoteca completa del curso
✅ Recursos descargables (PDFs, guias, ejercicios)
✅ Dashboard con tu progreso

¿En que puedo ayudarte hoy? 🚀`,
          timestamp: new Date().toISOString()
        }
      ],
      isLoading: false,
      error: null,
      mode: 'online',
      currentConversationId: Date.now().toString(),
      
      // Historial de conversaciones guardadas
      savedConversations: [],

      sendMessage: async (text) => {
        const { messages } = get()
        
        const userMessage = {
          id: messages.length + 1,
          type: 'user',
          content: text,
          timestamp: new Date().toISOString()
        }
        
        set({ messages: [...messages, userMessage], isLoading: true, error: null })

        const history = messages.slice(-10).map(msg => ({
          type: msg.type,
          content: msg.content,
        }))

        try {
          const result = await geminiService.sendMessage(text, history)
          
          const aiMessage = {
            id: messages.length + 2,
            type: 'ai',
            content: result.message,
            timestamp: new Date().toISOString()
          }
          
          set(state => {
            const newMessages = [...state.messages, aiMessage]
            
            // Guardar automaticamente si hay mas de 2 mensajes
            if (newMessages.length > 2) {
              const updatedConversations = state.savedConversations.map(conv =>
                conv.id === state.currentConversationId
                  ? { ...conv, messages: newMessages, updatedAt: new Date().toISOString() }
                  : conv
              )
              
              // Si no existe la conversacion, crearla
              if (!updatedConversations.find(c => c.id === state.currentConversationId)) {
                updatedConversations.push({
                  id: state.currentConversationId,
                  title: getConversationTitle(newMessages),
                  messages: newMessages,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  messageCount: newMessages.length
                })
              }
              
              return {
                messages: newMessages,
                isLoading: false,
                savedConversations: updatedConversations
              }
            }
            
            return {
              messages: newMessages,
              isLoading: false
            }
          })
        } catch (error) {
          const errorMessage = {
            id: messages.length + 2,
            type: 'ai',
            content: 'Lo siento, hubo un error. Como EasyGo AI Tutor, estoy aqui para ayudarte. ¿Podrias intentar de nuevo?',
            timestamp: new Date().toISOString()
          }
          
          set(state => ({ 
            messages: [...state.messages, errorMessage], 
            isLoading: false,
            error: error.message
          }))
        }
      },

      // Cargar una conversacion guardada
      loadConversation: (conversationId) => {
        const { savedConversations } = get()
        const conversation = savedConversations.find(c => c.id === conversationId)
        
        if (conversation) {
          set({
            messages: conversation.messages,
            currentConversationId: conversation.id
          })
          return true
        }
        return false
      },

      // Nueva conversacion
      newConversation: () => {
        const { messages, currentConversationId, savedConversations } = get()
        
        // Guardar conversacion actual si tiene mensajes
        if (messages.length > 2) {
          const existingIndex = savedConversations.findIndex(c => c.id === currentConversationId)
          const updatedConversation = {
            id: currentConversationId,
            title: getConversationTitle(messages),
            messages: messages,
            createdAt: existingIndex >= 0 ? savedConversations[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageCount: messages.length
          }
          
          const updatedConversations = existingIndex >= 0
            ? savedConversations.map(c => c.id === currentConversationId ? updatedConversation : c)
            : [...savedConversations, updatedConversation]
          
          set({
            messages: [
              {
                id: 1,
                type: 'ai',
                content: `¡Hola! 👋 Soy **EasyGo AI Tutor**. ¿En que puedo ayudarte hoy? 🚀`,
                timestamp: new Date().toISOString()
              }
            ],
            currentConversationId: Date.now().toString(),
            savedConversations: updatedConversations,
            error: null
          })
        } else {
          set({
            messages: [
              {
                id: 1,
                type: 'ai',
                content: `¡Hola! 👋 Soy **EasyGo AI Tutor**. ¿En que puedo ayudarte hoy? 🚀`,
                timestamp: new Date().toISOString()
              }
            ],
            currentConversationId: Date.now().toString(),
            error: null
          })
        }
      },

      // Eliminar una conversacion guardada
      deleteConversation: (conversationId) => {
        const { savedConversations, currentConversationId } = get()
        const updatedConversations = savedConversations.filter(c => c.id !== conversationId)
        
        // Si estamos eliminando la conversacion actual, crear una nueva
        if (currentConversationId === conversationId) {
          set({
            messages: [
              {
                id: 1,
                type: 'ai',
                content: `¡Hola! 👋 Soy **EasyGo AI Tutor**. ¿En que puedo ayudarte hoy? 🚀`,
                timestamp: new Date().toISOString()
              }
            ],
            currentConversationId: Date.now().toString(),
            savedConversations: updatedConversations
          })
        } else {
          set({ savedConversations: updatedConversations })
        }
      },

      clearChat: () => {
        set({
          messages: [
            {
              id: 1,
              type: 'ai',
              content: '¡Chat limpiado! Soy EasyGo AI Tutor, listo para ayudarte con tu ingles. ¿En que podemos trabajar hoy? 🎯',
              timestamp: new Date().toISOString()
            }
          ],
          currentConversationId: Date.now().toString(),
          error: null,
          mode: 'online'
        })
      },

      practicePronunciation: async (word) => {
        set({ isLoading: true })
        const result = await geminiService.practicePronunciation(word)
        if (result.success) {
          const { messages } = get()
          const aiMessage = {
            id: messages.length + 1,
            type: 'ai',
            content: result.message,
            timestamp: new Date().toISOString()
          }
          set(state => ({ messages: [...state.messages, aiMessage], isLoading: false }))
        }
      },

      generateExercise: async (topic, level) => {
        set({ isLoading: true })
        const result = await geminiService.generateExercise(topic, level)
        if (result.success) {
          const { messages } = get()
          const aiMessage = {
            id: messages.length + 1,
            type: 'ai',
            content: result.message,
            timestamp: new Date().toISOString()
          }
          set(state => ({ messages: [...state.messages, aiMessage], isLoading: false }))
        }
      },
    }),
    {
      name: 'easygo-chat-storage',
      partialize: (state) => ({
        messages: state.messages.slice(-50),
        currentConversationId: state.currentConversationId,
        savedConversations: state.savedConversations.slice(-20).map(conv => ({
          ...conv,
          messages: conv.messages.slice(-50)
        })),
      }),
      version: 2,
    }
  )
)

// Funcion helper para obtener el titulo de la conversacion
function getConversationTitle(messages) {
  // Buscar el primer mensaje del usuario
  const firstUserMessage = messages.find(m => m.type === 'user')
  if (firstUserMessage) {
    const text = firstUserMessage.content
    // Tomar las primeras 5 palabras o 40 caracteres
    const words = text.split(' ').slice(0, 5).join(' ')
    return words.length > 40 ? words.substring(0, 40) + '...' : words
  }
  return 'Nueva conversacion'
}