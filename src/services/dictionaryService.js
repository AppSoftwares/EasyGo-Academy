import api from './api'

export const dictionaryService = {
  // Buscar palabra en el diccionario (BD + API externa)
  searchWord: (word) => {
    return api.get(`/dictionary/search/${encodeURIComponent(word)}`)
  },

  // Obtener estadísticas del diccionario
  getStats: () => {
    return api.get('/dictionary/stats')
  },
}