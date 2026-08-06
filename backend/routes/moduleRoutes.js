// backend/routes/moduleRoutes.js
const express = require('express')
const router = express.Router()
const moduleController = require('../controllers/moduleController')
const { authMiddleware, teacherMiddleware } = require('../middleware/auth')

router.use(authMiddleware)
router.use(teacherMiddleware)

router.get('/:level', moduleController.getModules)
router.post('/', moduleController.createModule)
router.put('/:id', moduleController.updateModule)
router.delete('/:id', moduleController.deleteModule)
router.post('/reorder', moduleController.reorderModules)

module.exports = router