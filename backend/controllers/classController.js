const { Class, ClassEnrollment, User } = require('../models')
const { Op } = require('sequelize')
const notificationHelper = require('../utils/notificationHelper')

const classController = {
  // Obtener próximas clases disponibles
  getUpcoming: async (req, res) => {
    try {
      const now = new Date()
      const classes = await Class.findAll({
        where: {
          date: { [Op.gte]: now.toISOString().split('T')[0] },
          active: true,
        },
        order: [['date', 'ASC']],
      })

      const userId = req.user?.id
      const classesWithStatus = await Promise.all(
        classes.map(async (c) => {
          const enrollment = userId
            ? await ClassEnrollment.findOne({ where: { classId: c.id, userId } })
            : null
          return {
            ...c.toJSON(),
            isEnrolled: !!enrollment,
            hasSpace: c.currentStudents < c.maxStudents,
          }
        })
      )

      res.json({ success: true, classes: classesWithStatus })
    } catch (error) {
      console.error('Error getUpcoming:', error)
      res.status(500).json({ success: false, message: 'Error al obtener clases' })
    }
  },

  // Inscribirse a una clase - CON NOTIFICACIÓN DE CONFIRMACIÓN
  enroll: async (req, res) => {
    try {
      const userId = req.user.id
      const { classId } = req.params

      const classItem = await Class.findByPk(classId)
      if (!classItem) {
        return res.status(404).json({ success: false, message: 'Clase no encontrada' })
      }
      if (!classItem.active) {
        return res.status(400).json({ success: false, message: 'Clase no disponible' })
      }
      if (classItem.currentStudents >= classItem.maxStudents) {
        return res.status(400).json({ success: false, message: 'Clase llena. Intenta con otro horario.' })
      }

      const existing = await ClassEnrollment.findOne({ where: { classId, userId } })
      if (existing) {
        return res.status(400).json({ success: false, message: 'Ya estás inscrito en esta clase' })
      }

      // Verificar límite diario (1 clase por día)
      const classDate = classItem.date
      const dayEnrollments = await ClassEnrollment.findAll({
        include: [{ model: Class, as: 'class', where: { date: classDate } }],
        where: { userId },
      })
      if (dayEnrollments.length >= 1) {
        return res.status(400).json({
          success: false,
          message: 'Ya tienes una clase este día. Solo puedes tomar 1 clase por día.',
        })
      }

      await ClassEnrollment.create({ classId, userId })
      await classItem.increment('currentStudents')

      // 🔔 NOTIFICACIÓN DE CONFIRMACIÓN DE INSCRIPCIÓN
      const user = await User.findByPk(userId)
      const dateFormatted = new Date(classItem.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
      
      await notificationHelper.createForUser(userId, {
        title: '✅ Inscripción confirmada',
        message: `Te has inscrito a "${classItem.title}" - ${dateFormatted}`,
        type: 'success',
        icon: '✅',
        link: '/classes',
        relatedId: classId,
        relatedType: 'class_enrollment'
      })

      res.json({ success: true, message: '¡Inscrito exitosamente! Recibirás el enlace de Zoom.' })
    } catch (error) {
      console.error('Error enroll:', error)
      res.status(500).json({ success: false, message: 'Error al inscribirse' })
    }
  },

  // Cancelar inscripción - CON NOTIFICACIÓN DE CANCELACIÓN
  unenroll: async (req, res) => {
    try {
      const userId = req.user.id
      const { classId } = req.params

      const enrollment = await ClassEnrollment.findOne({ where: { classId, userId } })
      if (!enrollment) {
        return res.status(404).json({ success: false, message: 'No estás inscrito en esta clase' })
      }

      const classItem = await Class.findByPk(classId)
      
      await enrollment.destroy()
      await Class.decrement('currentStudents', { where: { id: classId } })

      // 🔔 NOTIFICACIÓN DE CANCELACIÓN
      if (classItem) {
        const dateFormatted = new Date(classItem.date).toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
        
        await notificationHelper.createForUser(userId, {
          title: '❌ Inscripción cancelada',
          message: `Has cancelado tu inscripción a "${classItem.title}" - ${dateFormatted}`,
          type: 'warning',
          icon: '❌',
          link: '/classes',
          relatedId: classId,
          relatedType: 'class_cancellation'
        })
      }

      res.json({ success: true, message: 'Inscripción cancelada' })
    } catch (error) {
      console.error('Error unenroll:', error)
      res.status(500).json({ success: false, message: 'Error al cancelar' })
    }
  },

  // Obtener mis clases
  getMyClasses: async (req, res) => {
    try {
      const userId = req.user.id
      const enrollments = await ClassEnrollment.findAll({
        where: { userId },
        include: [{ model: Class, as: 'class' }],
        order: [[{ model: Class, as: 'class' }, 'date', 'ASC']],
      })

      res.json({ success: true, classes: enrollments })
    } catch (error) {
      console.error('Error getMyClasses:', error)
      res.status(500).json({ success: false, message: 'Error al obtener tus clases' })
    }
  },

  // Admin/Teacher: Obtener todas
  getAll: async (req, res) => {
    try {
      const classes = await Class.findAll({
        include: [
          {
            model: ClassEnrollment,
            as: 'enrollments',
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
          },
        ],
        order: [['date', 'ASC']],
      })
      res.json({ success: true, classes })
    } catch (error) {
      console.error('Error getAll:', error)
      res.status(500).json({ success: false, message: 'Error al obtener clases' })
    }
  },

  // Admin/Teacher: Crear - CON NOTIFICACIÓN PARA TODOS LOS USUARIOS
  create: async (req, res) => {
    try {
      const { title, date } = req.body
      if (!title || !date) {
        return res.status(400).json({ success: false, message: 'Título y fecha requeridos' })
      }

      const newClass = await Class.create({ ...req.body, createdBy: req.user?.id })
      
      // 🔔 NOTIFICACIÓN PARA TODOS LOS USUARIOS - Nueva clase disponible
      await notificationHelper.notifyNewClass(newClass)
      
      res.status(201).json({ success: true, message: 'Clase creada', class: newClass })
    } catch (error) {
      console.error('Error create:', error)
      res.status(500).json({ success: false, message: 'Error al crear clase' })
    }
  },

  // Admin/Teacher: Actualizar
  update: async (req, res) => {
    try {
      const c = await Class.findByPk(req.params.id)
      if (!c) {
        return res.status(404).json({ success: false, message: 'Clase no encontrada' })
      }
      await c.update(req.body)
      res.json({ success: true, message: 'Clase actualizada', class: c })
    } catch (error) {
      console.error('Error update:', error)
      res.status(500).json({ success: false, message: 'Error al actualizar' })
    }
  },

  // Admin: Eliminar - CON NOTIFICACIÓN DE CANCELACIÓN PARA INSCRITOS
  delete: async (req, res) => {
    try {
      const c = await Class.findByPk(req.params.id)
      if (!c) {
        return res.status(404).json({ success: false, message: 'Clase no encontrada' })
      }
      
      // Obtener usuarios inscritos para notificarles
      const enrollments = await ClassEnrollment.findAll({
        where: { classId: c.id },
        include: [{ model: User, as: 'user' }]
      })
      
      // 🔔 NOTIFICAR A LOS INSCRITOS QUE LA CLASE FUE CANCELADA
      for (const enrollment of enrollments) {
        await notificationHelper.createForUser(enrollment.userId, {
          title: '⚠️ Clase cancelada',
          message: `La clase "${c.title}" programada para el ${new Date(c.date).toLocaleDateString('es-ES')} ha sido cancelada.`,
          type: 'error',
          icon: '⚠️',
          link: '/classes',
          relatedId: c.id,
          relatedType: 'class_cancelled'
        })
      }
      
      await c.destroy()
      res.json({ success: true, message: 'Clase eliminada' })
    } catch (error) {
      console.error('Error delete:', error)
      res.status(500).json({ success: false, message: 'Error al eliminar' })
    }
  },
}

module.exports = classController