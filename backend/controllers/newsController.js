const { News } = require('../models')
const { Op } = require('sequelize')

const newsController = {
  // Obtener todas
  getAll: async (req, res) => {
    try {
      const { level, category, featured, search, limit = 50, offset = 0 } = req.query
      const where = { active: true }

      if (level && level !== 'all') where.level = level
      if (category && category !== 'all') where.category = category
      if (featured === 'true') where.featured = true

      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } },
          { subtitle: { [Op.like]: `%${search}%` } },
        ]
      }

      const { count, rows } = await News.findAndCountAll({
        where,
        order: [['featured', 'DESC'], ['publishedAt', 'DESC'], ['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['content', 'contentSpanish', 'vocabulary'] },
      })

      res.json({ success: true, news: rows, total: count })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener noticias' })
    }
  },

  // Obtener una (con contenido completo)
  getById: async (req, res) => {
    try {
      const item = await News.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrada' })
      
      // Incrementar vistas
      await item.increment('views')
      
      res.json({ success: true, news: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },

  // Obtener destacadas
  getFeatured: async (req, res) => {
    try {
      const items = await News.findAll({
        where: { active: true, featured: true },
        order: [['publishedAt', 'DESC']],
        limit: 5,
        attributes: { exclude: ['content', 'contentSpanish'] },
      })
      res.json({ success: true, news: items })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },

  // Crear
  create: async (req, res) => {
    try {
      const item = await News.create({ ...req.body, createdBy: req.user?.id })
      res.status(201).json({ success: true, news: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear' })
    }
  },

  // Actualizar
  update: async (req, res) => {
    try {
      const item = await News.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrada' })
      await item.update({ ...req.body, updatedBy: req.user?.id })
      res.json({ success: true, news: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar' })
    }
  },

  // Eliminar
  delete: async (req, res) => {
    try {
      const item = await News.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrada' })
      await item.destroy()
      res.json({ success: true, message: 'Eliminada' })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar' })
    }
  },

  // Registrar vista
  recordView: async (req, res) => {
    try {
      const item = await News.findByPk(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'No encontrada' })
      await item.increment('views')
      res.json({ success: true, views: item.views + 1 })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },

  // Estadísticas
  getStats: async (req, res) => {
    try {
      const total = await News.count({ where: { active: true } })
      const featured = await News.count({ where: { active: true, featured: true } })
      const totalViews = await News.sum('views') || 0
      const byLevel = {}
      const byCategory = {}
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
      const categories = ['world', 'usa', 'technology', 'business', 'health', 'education', 'sports', 'entertainment', 'science', 'culture', 'tips', 'easygo']

      for (const l of levels) byLevel[l] = await News.count({ where: { level: l, active: true } })
      for (const c of categories) byCategory[c] = await News.count({ where: { category: c, active: true } })

      res.json({ success: true, stats: { total, featured, totalViews, byLevel, byCategory } })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },
}

module.exports = newsController