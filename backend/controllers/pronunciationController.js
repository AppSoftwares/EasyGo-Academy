const { Pronunciation } = require('../models')
const { Op } = require('sequelize')

const pronunciationController = {
  // Obtener todos (público)
  getAll: async (req, res) => {
    try {
      const { level, category, difficulty, search, limit = 100, offset = 0 } = req.query
      const where = { active: true }

      if (level && level !== 'all') where.level = level
      if (category && category !== 'all') where.category = category
      if (difficulty && difficulty !== 'all') where.difficulty = difficulty

      if (search) {
        where[Op.or] = [
          { word: { [Op.like]: `%${search}%` } },
          { translation: { [Op.like]: `%${search}%` } },
          { spanishPronunciation: { [Op.like]: `%${search}%` } },
        ]
      }

      const { count, rows } = await Pronunciation.findAndCountAll({
        where,
        order: [['level', 'ASC'], ['category', 'ASC'], ['order', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      })

      res.json({ success: true, pronunciations: rows, total: count })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener pronunciaciones' })
    }
  },

  // Obtener uno
  getById: async (req, res) => {
    try {
      const item = await Pronunciation.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrado' })
      res.json({ success: true, pronunciation: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },

  // Crear
  create: async (req, res) => {
    try {
      const item = await Pronunciation.create({ ...req.body, createdBy: req.user?.id })
      res.status(201).json({ success: true, pronunciation: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear' })
    }
  },

  // Actualizar
  update: async (req, res) => {
    try {
      const item = await Pronunciation.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrado' })
      await item.update({ ...req.body, updatedBy: req.user?.id })
      res.json({ success: true, pronunciation: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar' })
    }
  },

  // Eliminar
  delete: async (req, res) => {
    try {
      const item = await Pronunciation.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrado' })
      await item.destroy()
      res.json({ success: true, message: 'Eliminado' })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar' })
    }
  },

  // Registrar práctica
  recordPractice: async (req, res) => {
    try {
      const item = await Pronunciation.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrado' })
      await item.increment('timesPracticed')
      res.json({ success: true, timesPracticed: item.timesPracticed + 1 })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },

  // Obtener por categoría para práctica diaria
  getDailyPractice: async (req, res) => {
    try {
      const { level = 'A1' } = req.query
      const items = await Pronunciation.findAll({
        where: { level, active: true },
        order: [['timesPracticed', 'ASC']], // Priorizar las menos practicadas
        limit: 10,
      })
      res.json({ success: true, pronunciations: items })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },

  // Estadísticas
  getStats: async (req, res) => {
    try {
      const total = await Pronunciation.count({ where: { active: true } })
      const totalPractices = await Pronunciation.sum('timesPracticed') || 0
      const byLevel = {}
      const byCategory = {}
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
      const categories = ['vowels', 'consonants', 'diphthongs', 'silent_letters', 'stress', 'intonation', 'common_words', 'workplace', 'daily_life', 'phrases', 'tongue_twisters', 'minimal_pairs']

      for (const l of levels) byLevel[l] = await Pronunciation.count({ where: { level: l, active: true } })
      for (const c of categories) byCategory[c] = await Pronunciation.count({ where: { category: c, active: true } })

      res.json({ success: true, stats: { total, totalPractices, byLevel, byCategory } })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },
}

module.exports = pronunciationController