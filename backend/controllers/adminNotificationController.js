// backend/controllers/adminNotificationController.js
const { Notification, User } = require('../models')
const { Op } = require('sequelize')

const adminNotificationController = {
  // Obtener notificaciones del admin autenticado
  getNotifications: async (req, res) => {
    try {
      const adminId = req.user.id
      
      const notifications = await Notification.findAll({
        where: { 
          userId: adminId,
          type: 'admin'
        },
        order: [['createdAt', 'DESC']],
        limit: 50
      })
      
      const unreadCount = notifications.filter(n => !n.isRead).length
      
      res.json({ success: true, notifications, unreadCount })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ success: false, message: 'Error al obtener notificaciones' })
    }
  },
  
  // Marcar como leída
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params
      const adminId = req.user.id
      
      await Notification.update(
        { isRead: true },
        { where: { id, userId: adminId, type: 'admin' } }
      )
      res.json({ success: true })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ success: false, message: 'Error al marcar notificación' })
    }
  },
  
  // Marcar todas como leídas
  markAllAsRead: async (req, res) => {
    try {
      const adminId = req.user.id
      
      await Notification.update(
        { isRead: true },
        { where: { userId: adminId, type: 'admin', isRead: false } }
      )
      res.json({ success: true })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ success: false, message: 'Error al marcar notificaciones' })
    }
  },
  
  // Obtener contador de no leídas
  getUnreadCount: async (req, res) => {
    try {
      const adminId = req.user.id
      
      const count = await Notification.count({
        where: { userId: adminId, type: 'admin', isRead: false }
      })
      res.json({ success: true, count })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ success: false, message: 'Error al obtener contador' })
    }
  },
  
  // Crear notificación para TODOS los administradores
  createLeadNotification: async (leadData) => {
    try {
      // Buscar todos los usuarios administradores
      const admins = await User.findAll({ where: { role: 'admin' } })
      
      if (!admins || admins.length === 0) {
        console.error('No se encontraron administradores para asignar la notificación')
        return null
      }
      
      // Crear una notificación para cada administrador
      const notifications = []
      for (const admin of admins) {
        const notification = await Notification.create({
          userId: admin.id,
          title: '📋 Nuevo Lead Registrado',
          message: `${leadData.name} (${leadData.email}) se ha registrado desde la landing page.`,
          type: 'admin',
          icon: '📋',
          link: '/admin/leads',
          relatedId: leadData.id,
          relatedType: 'lead',
          isRead: false
        })
        notifications.push(notification)
        console.log(`🔔 Notificación creada para admin: ${admin.name} (${admin.email})`)
      }
      
      return notifications
    } catch (error) {
      console.error('Error creando notificación:', error)
      return null
    }
  }
}

module.exports = adminNotificationController