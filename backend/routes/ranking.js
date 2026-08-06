const express = require('express')
const router = express.Router()
const controller = require('../controllers/rankingController')
const { authMiddleware } = require('../middleware/auth')

router.get('/weekly', controller.getWeekly)
router.get('/stats', controller.getStats)
router.get('/my-position', authMiddleware, controller.getMyPosition)
router.post('/update', authMiddleware, controller.updatePoints)

module.exports = router