// backend/controllers/moduleContentController.js
const { ModuleContent, Content, GrammarTopic, Audiobook, Assignment } = require('../models')
const { Op } = require('sequelize')

const moduleContentController = {
  // Obtener todo el contenido de un módulo
  getModuleContent: async (req, res) => {
    try {
      const { moduleId } = req.params
      
      const moduleItems = await ModuleContent.findAll({
        where: { moduleId: moduleId },
        order: [['order', 'ASC']]
      })
      
      // Para cada item, obtener los detalles según su tipo
      const itemsWithDetails = await Promise.all(moduleItems.map(async (item) => {
        let details = null
        
        switch (item.contentType) {
          case 'grammar':
            const grammar = await GrammarTopic.findByPk(item.contentId, {
              attributes: ['id', 'title', 'slug', 'level', 'description', 'icon']
            })
            if (grammar) {
              details = {
                id: grammar.id,
                title: grammar.title,
                description: grammar.description,
                level: grammar.level,
                slug: grammar.slug,
                icon: grammar.icon,
                type: 'grammar',
                url: `/grammar/${grammar.slug}`
              }
            }
            break
            
          case 'audiobook':
            const audiobook = await Audiobook.findByPk(item.contentId, {
              attributes: ['id', 'title', 'level', 'duration', 'audio_url', 'narrator']
            })
            if (audiobook) {
              details = {
                id: audiobook.id,
                title: audiobook.title,
                description: `Audiolibro de ${audiobook.duration || '?'} minutos`,
                level: audiobook.level,
                duration: audiobook.duration,
                audio_url: audiobook.audio_url,
                type: 'audiobook',
                url: `/audiobooks/${audiobook.id}`
              }
            }
            break
            
          case 'task':
            const task = await Assignment.findByPk(item.contentId, {
              attributes: ['id', 'title', 'description', 'due_date', 'max_score']
            })
            if (task) {
              details = {
                id: task.id,
                title: task.title,
                description: task.description,
                dueDate: task.due_date,
                maxScore: task.max_score,
                type: 'task',
                url: `/assignments/${task.id}`
              }
            }
            break
            
          default:
            const content = await Content.findByPk(item.contentId, {
              attributes: ['id', 'title', 'description', 'type', 'lesson_type', 'level']
            })
            if (content) {
              details = {
                id: content.id,
                title: content.title,
                description: content.description,
                type: content.type,
                lessonType: content.lesson_type,
                level: content.level,
                url: `/curriculum/lesson/${content.id}`
              }
            }
        }
        console.log(item, "details");
        return {
          id: item.id,
          moduleId: item.moduleId,
          contentId: item.contentId,
          contentType: item.contentType,
          order: item.order,
          isRequired: item.isRequired,
          details: details
        }
      }))
      
      // Filtrar items que no tienen detalles (contenido eliminado)
      const validItems = itemsWithDetails.filter(item => item.details !== null)
      
      res.json({ success: true, items: validItems })
    } catch (error) {
      console.error('Error getting module content:', error)
      res.status(500).json({ success: false, message: 'Error al obtener contenido del módulo' })
    }
  },
  
  // Agregar contenido a un módulo
  addContentToModule: async (req, res) => {
    try {
      const { moduleId } = req.params
      const { contentId, contentType, order, isRequired } = req.body
      
      // Validaciones
      if (!moduleId) {
        return res.status(400).json({ success: false, message: 'moduleId es requerido' })
      }
      if (!contentId) {
        return res.status(400).json({ success: false, message: 'contentId es requerido' })
      }
      if (!contentType) {
        return res.status(400).json({ success: false, message: 'contentType es requerido' })
      }
      
      // Verificar que el módulo existe
      const module = await Content.findOne({
        where: { id: parseInt(moduleId), type: 'module', active: true }
      })
      
      if (!module) {
        return res.status(404).json({ success: false, message: 'Módulo no encontrado' })
      }
      
      // Verificar que no exista ya la relación
      const existing = await ModuleContent.findOne({
        where: { 
          moduleId: parseInt(moduleId), 
          contentId: parseInt(contentId), 
          contentType: contentType 
        }
      })
      
      if (existing) {
        return res.status(400).json({ success: false, message: 'Este contenido ya está en el módulo' })
      }
      
      const moduleContent = await ModuleContent.create({
        moduleId: parseInt(moduleId),
        contentId: parseInt(contentId),
        contentType: contentType,
        order: order || 0,
        isRequired: isRequired !== false
      })
      
      res.status(201).json({ success: true, item: moduleContent })
    } catch (error) {
      console.error('Error adding content to module:', error)
      res.status(500).json({ success: false, message: 'Error al agregar contenido: ' + error.message })
    }
  },
  
  // Eliminar contenido de un módulo
  removeContentFromModule: async (req, res) => {
    try {
      const { id } = req.params
      
      const item = await ModuleContent.findByPk(id)
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item no encontrado' })
      }
      
      await item.destroy()
      
      res.json({ success: true, message: 'Contenido eliminado del módulo' })
    } catch (error) {
      console.error('Error removing content from module:', error)
      res.status(500).json({ success: false, message: 'Error al eliminar contenido' })
    }
  },
  
  // Reordenar contenido del módulo
  reorderModuleContent: async (req, res) => {
    try {
      const { moduleId } = req.params
      const { orders } = req.body
      
      for (const item of orders) {
        await ModuleContent.update(
          { order: item.order },
          { where: { id: item.id, moduleId: moduleId } }
        )
      }
      
      res.json({ success: true, message: 'Orden actualizado' })
    } catch (error) {
      console.error('Error reordering module content:', error)
      res.status(500).json({ success: false, message: 'Error al reordenar' })
    }
  },
  
  // Obtener contenido disponible para agregar
  getAvailableContent: async (req, res) => {
    try {
      const { moduleId, type } = req.params
      const { search } = req.query
      
      const module = await Content.findByPk(moduleId)
      if (!module) {
        return res.status(404).json({ success: false, message: 'Módulo no encontrado' })
      }
      
      // Obtener IDs de contenido ya agregados
      const existingItems = await ModuleContent.findAll({
        where: { moduleId: moduleId },
        attributes: ['contentId', 'contentType']
      })
      
      const existingIds = {
        grammar: existingItems.filter(i => i.contentType === 'grammar').map(i => i.contentId),
        audiobook: existingItems.filter(i => i.contentType === 'audiobook').map(i => i.contentId),
        task: existingItems.filter(i => i.contentType === 'task').map(i => i.contentId),
        lesson: existingItems.filter(i => i.contentType === 'lesson').map(i => i.contentId)
      }
      
      let availableContent = []
      
      switch (type) {
        case 'grammar':
          const grammarTopics = await GrammarTopic.findAll({
            where: {
              level: module.level,
              active: true,
              id: { [Op.notIn]: existingIds.grammar }
            },
            attributes: ['id', 'title', 'slug', 'level', 'description'],
            order: [['order', 'ASC']]
          })
          availableContent = grammarTopics.map(g => ({
            id: g.id,
            title: g.title,
            description: g.description || 'Tema de gramática',
            type: 'grammar',
            level: g.level,
            slug: g.slug,
            source: 'Gramática'
          }))
          break
          
        case 'audiobook':
          const audiobooks = await Audiobook.findAll({
            where: {
              level: module.level,
              active: true,
              id: { [Op.notIn]: existingIds.audiobook }
            },
            attributes: ['id', 'title', 'level', 'duration', 'narrator']
          })
          availableContent = audiobooks.map(a => ({
            id: a.id,
            title: a.title,
            description: `Audiolibro de ${a.duration || '?'} minutos`,
            type: 'audiobook',
            level: a.level,
            duration: a.duration,
            source: 'Audiolibros'
          }))
          break
          
        case 'task':
          const tasks = await Assignment.findAll({
            where: {
              level: module.level,
              active: true,
              id: { [Op.notIn]: existingIds.task }
            },
            attributes: ['id', 'title', 'description', 'due_date']
          })
          availableContent = tasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || 'Tarea pendiente',
            type: 'task',
            level: module.level,
            dueDate: t.due_date,
            source: 'Tareas'
          }))
          break
          
        default:
          const lessons = await Content.findAll({
            where: {
              level: module.level,
              type: ['lesson', 'exercise', 'quiz', 'video', 'material'],
              active: true,
              id: { [Op.notIn]: existingIds.lesson }
            },
            attributes: ['id', 'title', 'description', 'type', 'lesson_type', 'level']
          })
          availableContent = lessons.map(l => ({
            id: l.id,
            title: l.title,
            description: l.description || 'Contenido educativo',
            type: l.type,
            lesson_type: l.lesson_type,
            level: l.level,
            source: 'Contenido propio'
          }))
      }
      
      if (search) {
        availableContent = availableContent.filter(c => 
          c.title.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      res.json({ success: true, content: availableContent })
    } catch (error) {
      console.error('Error getting available content:', error)
      res.status(500).json({ success: false, message: 'Error al obtener contenido disponible' })
    }
  }
}

module.exports = moduleContentController