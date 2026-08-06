// backend/controllers/grammarController.js
const { GrammarTopic } = require('../models')
const { Op } = require('sequelize')

const grammarController = {
  // Obtener todos los temas (para listado - datos básicos)
  getAll: async (req, res) => {
    try {
      const { level, search } = req.query
      const where = { active: true }

      if (level && level !== 'all') where.level = level
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { category: { [Op.like]: `%${search}%` } },
        ]
      }

      const topics = await GrammarTopic.findAll({
        where,
        order: [['level', 'ASC'], ['order', 'ASC']],
        attributes: ['id', 'title', 'slug', 'level', 'category', 'description', 'formula', 'icon', 'unitId', 'order'],
      })

      res.json({ success: true, topics })
    } catch (error) {
      console.error('Error getAll grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener temas' })
    }
  },

  // Obtener un tema por slug (COMPLETO - con questions, sections, tips)
  getBySlug: async (req, res) => {
    try {
      const topic = await GrammarTopic.findOne({
        where: { slug: req.params.slug, active: true },
      })
      
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' })
      }
      
      // Procesar los campos JSON para asegurar que sean objetos/arrays
      const responseTopic = {
        id: topic.id,
        title: topic.title,
        slug: topic.slug,
        level: topic.level,
        category: topic.category,
        description: topic.description,
        formula: topic.formula,
        icon: topic.icon,
        unitId: topic.unitId,
        order: topic.order,
        // Parsear JSON o devolver array vacío
        sections: typeof topic.sections === 'string' ? JSON.parse(topic.sections) : (topic.sections || []),
        tips: typeof topic.tips === 'string' ? JSON.parse(topic.tips) : (topic.tips || []),
        commonMistakes: typeof topic.commonMistakes === 'string' ? JSON.parse(topic.commonMistakes) : (topic.commonMistakes || []),
        questions: typeof topic.questions === 'string' ? JSON.parse(topic.questions) : (topic.questions || []),
        active: topic.active,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt
      }
      
      res.json({ success: true, topic: responseTopic })
    } catch (error) {
      console.error('Error getBySlug grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener tema', error: error.message })
    }
  },

  // Obtener preguntas de un tema (para el test)
  getQuestions: async (req, res) => {
    try {
      const { slug } = req.params
      const topic = await GrammarTopic.findOne({
        where: { slug, active: true },
        attributes: ['id', 'title', 'questions', 'unitId']
      })
      
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' })
      }
      
      let questions = typeof topic.questions === 'string' ? JSON.parse(topic.questions) : (topic.questions || [])
      
      // Mezclar preguntas aleatoriamente (opcional)
      if (req.query.shuffle === 'true') {
        questions = JSON.parse(questions).sort(() => Math.random() - 0.5)
      }
      
      res.json({ 
        success: true, 
        questions,
        unitId: topic.unitId,
        topicTitle: topic.title
      })
    } catch (error) {
      console.error('Error getQuestions grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener preguntas' })
    }
  },

  // Obtener solo los temas de un nivel específico (para el sistema de progreso)
  getByLevel: async (req, res) => {
    try {
      const { level } = req.params
      const topics = await GrammarTopic.findAll({
        where: { level, active: true },
        order: [['order', 'ASC']],
        attributes: ['id', 'title', 'slug', 'unitId', 'level', 'icon', 'description', 'order']
      })
      
      res.json({ success: true, topics })
    } catch (error) {
      console.error('Error getByLevel grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener temas por nivel' })
    }
  },

  // Obtener tema por unitId (para navegación entre unidades)
  getByUnitId: async (req, res) => {
    try {
      const { level, unitId } = req.params
      const topic = await GrammarTopic.findOne({
        where: { level, unitId, active: true },
        attributes: ['id', 'title', 'slug', 'unitId', 'level', 'icon', 'description']
      })
      
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' })
      }
      
      res.json({ success: true, topic })
    } catch (error) {
      console.error('Error getByUnitId grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener tema' })
    }
  },

  // Obtener siguiente unidad (para navegación "siguiente lección")
  getNextUnit: async (req, res) => {
    try {
      const { level, currentUnitId } = req.params
      
      const nextTopic = await GrammarTopic.findOne({
        where: { 
          level, 
          unitId: { [Op.gt]: parseInt(currentUnitId) },
          active: true 
        },
        order: [['unitId', 'ASC']],
        attributes: ['id', 'title', 'slug', 'unitId', 'level', 'icon']
      })
      
      res.json({ success: true, next: nextTopic })
    } catch (error) {
      console.error('Error getNextUnit grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener siguiente unidad' })
    }
  },

  // Obtener unidad anterior (para navegación "lección anterior")
  getPreviousUnit: async (req, res) => {
    try {
      const { level, currentUnitId } = req.params
      
      const prevTopic = await GrammarTopic.findOne({
        where: { 
          level, 
          unitId: { [Op.lt]: parseInt(currentUnitId) },
          active: true 
        },
        order: [['unitId', 'DESC']],
        attributes: ['id', 'title', 'slug', 'unitId', 'level', 'icon']
      })
      
      res.json({ success: true, previous: prevTopic })
    } catch (error) {
      console.error('Error getPreviousUnit grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener unidad anterior' })
    }
  },

  // Admin/Teacher: Crear tema
  create: async (req, res) => {
    try {
      // Validar campos requeridos
      const { title, slug, level } = req.body
      if (!title || !slug || !level) {
        return res.status(400).json({ 
          success: false, 
          message: 'Título, slug y nivel son requeridos' 
        })
      }
      
      // Verificar slug único
      const existing = await GrammarTopic.findOne({ where: { slug } })
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ya existe un tema con este slug' 
        })
      }
      
      // Stringificar campos JSON si vienen como objetos
      const data = { ...req.body }
      if (data.sections && typeof data.sections !== 'string') data.sections = JSON.stringify(data.sections)
      if (data.tips && typeof data.tips !== 'string') data.tips = JSON.stringify(data.tips)
      if (data.commonMistakes && typeof data.commonMistakes !== 'string') data.commonMistakes = JSON.stringify(data.commonMistakes)
      if (data.questions && typeof data.questions !== 'string') data.questions = JSON.stringify(data.questions)
      
      const topic = await GrammarTopic.create(data)
      
      // Devolver el tema creado con campos parseados
      const responseTopic = {
        ...topic.toJSON(),
        sections: typeof topic.sections === 'string' ? JSON.parse(topic.sections) : topic.sections,
        tips: typeof topic.tips === 'string' ? JSON.parse(topic.tips) : topic.tips,
        questions: typeof topic.questions === 'string' ? JSON.parse(topic.questions) : topic.questions
      }
      
      res.status(201).json({ success: true, message: 'Tema creado', topic: responseTopic })
    } catch (error) {
      console.error('Error create grammar:', error)
      res.status(500).json({ success: false, message: 'Error al crear tema', error: error.message })
    }
  },

  // Admin/Teacher: Actualizar tema
  update: async (req, res) => {
    try {
      const topic = await GrammarTopic.findByPk(req.params.id)
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' })
      }
      
      // Stringificar campos JSON si vienen como objetos
      const data = { ...req.body }
      if (data.sections && typeof data.sections !== 'string') data.sections = JSON.stringify(data.sections)
      if (data.tips && typeof data.tips !== 'string') data.tips = JSON.stringify(data.tips)
      if (data.commonMistakes && typeof data.commonMistakes !== 'string') data.commonMistakes = JSON.stringify(data.commonMistakes)
      if (data.questions && typeof data.questions !== 'string') data.questions = JSON.stringify(data.questions)
      
      await topic.update(data)
      
      // Recargar y devolver con campos parseados
      await topic.reload()
      const responseTopic = {
        ...topic.toJSON(),
        sections: typeof topic.sections === 'string' ? JSON.parse(topic.sections) : topic.sections,
        tips: typeof topic.tips === 'string' ? JSON.parse(topic.tips) : topic.tips,
        questions: typeof topic.questions === 'string' ? JSON.parse(topic.questions) : topic.questions
      }
      
      res.json({ success: true, message: 'Tema actualizado', topic: responseTopic })
    } catch (error) {
      console.error('Error update grammar:', error)
      res.status(500).json({ success: false, message: 'Error al actualizar' })
    }
  },

  // Admin: Eliminar tema (soft delete)
  delete: async (req, res) => {
    try {
      const topic = await GrammarTopic.findByPk(req.params.id)
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' })
      }
      
      // Soft delete (cambiar active a false) o hard delete
      if (req.query.soft === 'true') {
        await topic.update({ active: false })
        res.json({ success: true, message: 'Tema desactivado' })
      } else {
        await topic.destroy()
        res.json({ success: true, message: 'Tema eliminado permanentemente' })
      }
    } catch (error) {
      console.error('Error delete grammar:', error)
      res.status(500).json({ success: false, message: 'Error al eliminar' })
    }
  },

  // Obtener estadísticas (para admin)
  getStats: async (req, res) => {
    try {
      const total = await GrammarTopic.count()
      const byLevel = {}
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
      
      for (const level of levels) {
        byLevel[level] = await GrammarTopic.count({ where: { level } })
      }
      
      res.json({ 
        success: true, 
        stats: { total, byLevel }
      })
    } catch (error) {
      console.error('Error getStats grammar:', error)
      res.status(500).json({ success: false, message: 'Error al obtener estadísticas' })
    }
  }
}

module.exports = grammarController