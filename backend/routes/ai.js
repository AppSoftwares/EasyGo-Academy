const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authMiddleware } = require('../middleware/auth');

router.post('/chat', authMiddleware, aiController.chat);
router.post('/pronunciation', authMiddleware, aiController.practicePronunciation);
router.post('/exercise', authMiddleware, aiController.generateExercise);

module.exports = router;
