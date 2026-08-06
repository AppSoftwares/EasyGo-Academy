const express = require('express')
const router = express.Router()
const leadController = require('../controllers/leadController')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

// Ruta pública: crear lead desde el formulario
router.post('/', leadController.create)

// Rutas protegidas (admin)
router.get('/', authMiddleware, adminMiddleware, leadController.getAll)
router.get('/stats', authMiddleware, adminMiddleware, leadController.getStats)
router.put('/:id', authMiddleware, adminMiddleware, leadController.updateStatus)
// Ruta pública para el test de nivelación
router.post('/level-test', leadController.saveLevelTest);

// Ruta para obtener leads por nivel (admin)
router.get('/level/:level', authMiddleware, adminMiddleware, leadController.getLeadsByLevel);
module.exports = router