const { Ranking, User } = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

const rankingController = {
  // Obtener ranking de la semana actual
  getWeekly: async (req, res) => {
    try {
      const { level = 'all', limit = 50 } = req.query
      const where = {}
      
      // Calcular semana actual
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1))
      weekStart.setHours(0, 0, 0, 0)
      
      if (level !== 'all') where.level = level

      const rankings = await Ranking.findAll({
        where,
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        order: [['points', 'DESC'], ['streak', 'DESC'], ['lessonsCompleted', 'DESC']],
        limit: parseInt(limit),
      })

      // Asignar posiciones
      const ranked = rankings.map((r, i) => ({
        ...r.toJSON(),
        position: i + 1,
      }))

      res.json({ success: true, rankings: ranked })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener ranking' })
    }
  },

  // Obtener posición del usuario actual
  getMyPosition: async (req, res) => {
    try {
      const userId = req.user.id
      const allRankings = await Ranking.findAll({
        order: [['points', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      })

      const position = allRankings.findIndex(r => r.userId === userId) + 1
      const myRanking = allRankings.find(r => r.userId === userId)

      res.json({
        success: true,
        position,
        ranking: myRanking || null,
        total: allRankings.length,
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },

  // Actualizar puntos del usuario
  updatePoints: async (req, res) => {
    try {
      const userId = req.user.id
      const { points, level } = req.body

      let ranking = await Ranking.findOne({ where: { userId } })
      
      if (ranking) {
        ranking.points += points || 0
        if (level) ranking.level = level
        await ranking.save()
      } else {
        ranking = await Ranking.create({
          userId,
          points: points || 0,
          level: level || 'A1',
          streak: 1,
          lessonsCompleted: 1,
          week: new Date().toISOString().slice(0, 7),
        })
      }

      res.json({ success: true, ranking })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar puntos' })
    }
  },

  // Estadísticas del ranking
  getStats: async (req, res) => {
    try {
      const total = await Ranking.count()
      const totalPoints = await Ranking.sum('points') || 0
      const avgPoints = total > 0 ? Math.round(totalPoints / total) : 0
      const topStreak = await Ranking.max('streak') || 0

      const byLevel = {}
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
      for (const l of levels) {
        byLevel[l] = await Ranking.count({ where: { level: l } })
      }

      res.json({ success: true, stats: { total, totalPoints, avgPoints, topStreak, byLevel } })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error' })
    }
  },
}

module.exports = rankingController