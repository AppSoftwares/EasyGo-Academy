const express = require('express')
const router = express.Router()
const progressController = require('../controllers/progressController')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

router.get('/ranking',authMiddleware, progressController.getRanking);
// Rutas para el usuario autenticado
router.get('/my-progress/:activeLevel', authMiddleware, progressController.getMyProgress)
router.get('/stats', authMiddleware, progressController.getStats)
router.post('/update', authMiddleware, progressController.updateProgress)
router.put('/complete/:unitId', authMiddleware, progressController.completeUnit)
router.post('/init-level', authMiddleware, progressController.initLevelProgress)

// Ruta para admin: ver progreso de cualquier usuario
router.get('/user/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  // Reutilizar getMyProgress pero con el userId de los params
  const originalUser = req.user
  req.user = { id: parseInt(req.params.userId) }
  await progressController.getMyProgress(req, res)
  req.user = originalUser
})


module.exports = router