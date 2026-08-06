// backend/controllers/notificationController.js
const { Notification } = require('../models')
const { Op } = require('sequelize')

const notificationController = {
  // Obtener notificaciones del usuario autenticado
  getMyNotifications: async (req, res) => {
    try {
      const userId = req.user.id
      
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 50
      })
      
      const unreadCount = notifications.filter(n => !n.isRead).length
      
      res.json({
        success: true,
        notifications,
        unreadCount
      })
    } catch (error) {
      console.error('Error al obtener notificaciones:', error)
      res.status(500).json({ success: false, message: 'Error al obtener notificaciones' })
    }
  },
  
  // Marcar notificación como leída
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id
      
      const notification = await Notification.findOne({
        where: { id, userId }
      })
      
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notificación no encontrada' })
      }
      
      await notification.update({ isRead: true })
      
      res.json({ success: true, message: 'Notificación marcada como leída' })
    } catch (error) {
      console.error('Error al marcar notificación:', error)
      res.status(500).json({ success: false, message: 'Error al marcar notificación' })
    }
  },
  
  // Marcar todas como leídas
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.id
      
      await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      )
      
      res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' })
    } catch (error) {
      console.error('Error al marcar notificaciones:', error)
      res.status(500).json({ success: false, message: 'Error al marcar notificaciones' })
    }
  },
  
  // Obtener estadísticas (para el dashboard)
  getStats: async (req, res) => {
    try {
      const userId = req.user.id
      
      const unreadCount = await Notification.count({
        where: { userId, isRead: false }
      })
      
      const recentCount = await Notification.count({
        where: {
          userId,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
      
      res.json({
        success: true,
        stats: { unreadCount, recentCount }
      })
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      res.status(500).json({ success: false, message: 'Error al obtener estadísticas' })
    }
  }
}

module.exports = notificationController