const { Dictionary } = require('../models')
const { Op } = require('sequelize')
const axios = require('axios')

const dictionaryController = {
  // Buscar palabra (BD + API externa)
  searchWord: async (req, res) => {
    try {
      const { word } = req.params
      if (!word) return res.status(400).json({ success: false, message: 'Palabra requerida' })

      // 1. Buscar en nuestra BD
      let result = await Dictionary.findOne({
        where: { word: { [Op.like]: word }, active: true }
      })

      if (result) {
        // Incrementar contador de búsquedas
        await result.increment('searches')
        return res.json({ success: true, word: result.toJSON(), source: 'database' })
      }

      // 2. Si no existe, buscar en API gratuita
      try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
        if (response.data && response.data.length > 0) {
          const entry = response.data[0]
          const meaning = entry.meanings?.[0]
          const definition = meaning?.definitions?.[0]

          // Detectar nivel aproximado según la complejidad
          let level = 'A1'
          const wordLength = word.length
          if (wordLength > 10) level = 'C1'
          else if (wordLength > 8) level = 'B2'
          else if (wordLength > 6) level = 'B1'
          else if (wordLength > 4) level = 'A2'

          // Crear en nuestra BD
          const newWord = await Dictionary.create({
            word: entry.word || word,
            phonetic: entry.phonetic || (entry.phonetics?.[0]?.text) || '',
            translation: definition?.definition?.substring(0, 100) || '',
            definition: definition?.definition || '',
            example: definition?.example || '',
            level,
            synonyms: meaning?.synonyms?.slice(0, 5) || [],
            searches: 1,
          })

          return res.json({ success: true, word: newWord.toJSON(), source: 'external' })
        }
      } catch (apiError) {
        console.log(apiError)
        console.log('API externa falló, no se encontró la palabra')
      }

      return res.status(404).json({ success: false, message: 'Palabra no encontrada' })
    } catch (error) {
      console.error('Error al buscar palabra:', error)
      res.status(500).json({ success: false, message: 'Error al buscar palabra' })
    }
  },

  // Obtener estadísticas
  getStats: async (req, res) => {
    try {
      const total = await Dictionary.count({ where: { active: true } })
      const totalSearches = await Dictionary.sum('searches') || 0
      res.json({ success: true, stats: { total, totalSearches } })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },
}

module.exports = dictionaryController