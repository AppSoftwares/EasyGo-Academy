// backend/routes/communityRoutes.js
const express = require('express')
const router = express.Router()
const communityController = require('../controllers/communityController')
const { authMiddleware } = require('../middleware/auth')

// Todas las rutas requieren autenticación
router.use(authMiddleware)

// Posts
router.get('/posts/recent', communityController.getRecentPosts)
router.post('/posts', communityController.createPost)

// Likes
router.post('/posts/:postId/like', communityController.toggleLike)

// Comentarios
router.post('/posts/:postId/comments', communityController.createComment)
router.get('/posts/:postId/comments', communityController.getComments)

module.exports = router