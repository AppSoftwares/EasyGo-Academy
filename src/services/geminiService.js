// Ya no se llama a Google directamente desde el cliente
import api from './api'

export const geminiService = {
  async sendMessage(userMessage, conversationHistory = []) {
    try {
      const { data } = await api.post('/ai/chat', { userMessage, conversationHistory })
      return data
    } catch (error) {
      console.error('Error in geminiService.sendMessage:', error)
      throw error
    }
  },

  async practicePronunciation(word) {
    try {
      const { data } = await api.post('/ai/pronunciation', { word })
      return data
    } catch (error) {
      console.error('Error in geminiService.practicePronunciation:', error)
      throw error
    }
  },

  async generateExercise(topic, level = 'intermediate') {
    try {
      const { data } = await api.post('/ai/exercise', { topic, level })
      return data
    } catch (error) {
      console.error('Error in geminiService.generateExercise:', error)
      throw error
    }
  }
}
