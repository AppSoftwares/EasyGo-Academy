const express = require('express')
const router = express.Router()
const { ListeningProgress } = require('../models')
const { authMiddleware } = require('../middleware/auth')

// Obtener progreso del usuario para un audiolibro
router.get('/:audiobookId', authMiddleware, async (req, res) => {
  try {
    const progress = await ListeningProgress.findOne({
      where: { 
        userId: req.user.id, 
        audiobookId: req.params.audiobookId 
      }
    })
    res.json({ success: true, progress })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Guardar progreso
router.post('/:audiobookId', authMiddleware, async (req, res) => {
  try {
    const { currentTime, completed } = req.body
    
    // Calcular checkpoint (múltiplo de 30)
    const checkpoint = Math.floor(currentTime / 30) * 30
    
    let progress = await ListeningProgress.findOne({
      where: { 
        userId: req.user.id, 
        audiobookId: req.params.audiobookId 
      }
    })

    if (progress) {
      // Solo actualizar si el checkpoint es mayor al guardado
      if (checkpoint > progress.savedCheckpoint || completed) {
        await progress.update({
          currentTime,
          savedCheckpoint: checkpoint,
          completed: completed || progress.completed,
          completedAt: completed ? new Date() : progress.completedAt,
        })
      }
    } else {
      progress = await ListeningProgress.create({
        userId: req.user.id,
        audiobookId: req.params.audiobookId,
        currentTime,
        savedCheckpoint: checkpoint,
        completed: completed || false,
      })
    }

    res.json({ success: true, progress })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router