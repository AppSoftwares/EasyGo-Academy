// backend/utils/notificationHelper.js
const { Notification, User } = require('../models')

const notificationHelper = {
  // Crear notificación para un usuario
  async createForUser(userId, data) {
    try {
      const notification = await Notification.create({
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        icon: data.icon,
        link: data.link,
        relatedId: data.relatedId,
        relatedType: data.relatedType
      })
      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      return null
    }
  },
  
  // Crear notificación para múltiples usuarios
  async createForUsers(userIds, data) {
    const notifications = userIds.map(userId => ({
      userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      icon: data.icon,
      link: data.link,
      relatedId: data.relatedId,
      relatedType: data.relatedType
    }))
    
    try {
      await Notification.bulkCreate(notifications)
      return true
    } catch (error) {
      console.error('Error creating bulk notifications:', error)
      return false
    }
  },
  
  // Notificación al completar una unidad
  async notifyUnitCompleted(user, unitTitle, score, unitId) {
    let title, message, type, icon
    
    if (score >= 90) {
      title = '🎉 ¡Excelente!'
      message = `Has completado "${unitTitle}" con ${score}%. ¡Sigue así!`
      type = 'achievement'
      icon = '🏆'
    } else if (score >= 70) {
      title = '✅ ¡Bien hecho!'
      message = `Has completado "${unitTitle}" con ${score}%. ¡Vas por buen camino!`
      type = 'success'
      icon = '✅'
    } else {
      title = '📚 Sigue practicando'
      message = `Has completado "${unitTitle}". Obtuviste ${score}%. ¡Revisa los errores!`
      type = 'warning'
      icon = '📖'
    }
    
    return this.createForUser(user.id, { title, message, type, icon, link: '/grammar', relatedId: unitId, relatedType: 'unit' })
  },
  
  // Notificación al subir de nivel
  async notifyLevelUp(user, oldLevel, newLevel) {
    return this.createForUser(user.id, {
      title: '🎊 ¡Has subido de nivel!',
      message: `¡Felicidades! Has pasado de nivel ${oldLevel} a ${newLevel}. ¡Sigue así!`,
      type: 'achievement',
      icon: '🎊',
      link: '/progress',
      relatedType: 'level_up'
    })
  },
  
  // Notificación de nueva clase (para todos los usuarios)
  async notifyNewClass(classData) {
    const users = await User.findAll({ where: { role: 'user' } })
    const userIds = users.map(u => u.id)
    const date = new Date(classData.date).toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    })
    
    return this.createForUsers(userIds, {
      title: '📅 Nueva clase en vivo',
      message: `Se ha programado "${classData.title}" para el ${date}. ¡No te la pierdas!`,
      type: 'class',
      icon: '🎓',
      link: '/classes',
      relatedId: classData.id,
      relatedType: 'class'
    })
  },
  
  // Notificación de bienvenida
  async notifyWelcome(user) {
    return this.createForUser(user.id, {
      title: '👋 ¡Bienvenido a EasyGo Academy!',
      message: 'Comienza con el test de nivelación para encontrar tu nivel ideal. ¡Mucho éxito!',
      type: 'success',
      icon: '👋',
      link: '/level-test',
      relatedType: 'welcome'
    })
  },
  
  // Notificación al completar test de nivelación
  async notifyTestCompleted(user, level) {
    return this.createForUser(user.id, {
      title: '🎯 ¡Test de nivelación completado!',
      message: `Tu nivel recomendado es ${level}. ¡Ya puedes acceder a todo el contenido!`,
      type: 'success',
      icon: '🎯',
      link: '/dashboard',
      relatedType: 'test_completed'
    })
  }
}

module.exports = notificationHelper