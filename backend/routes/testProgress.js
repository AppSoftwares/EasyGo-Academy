const express = require('express')
const router = express.Router()
const testProgressController = require('../controllers/testProgressController')
const { authMiddleware } = require('../middleware/auth')

router.get('/', authMiddleware, testProgressController.getProgress)
router.post('/save', authMiddleware, testProgressController.saveProgress)
router.post('/complete', authMiddleware, testProgressController.completeTest)
router.delete('/reset', authMiddleware, testProgressController.resetTest)

module.exports = router