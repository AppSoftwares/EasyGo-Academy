// backend/controllers/communityController.js
const { Post, Comment, PostLike, User } = require('../models')
const { Op } = require('sequelize')

const communityController = {
  // Obtener posts recientes
  getRecentPosts: async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query
      
      const posts = await Post.findAll({
        where: { active: true },
        order: [
          ['is_pinned', 'DESC'],
          ['created_at', 'DESC']
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'photo']
          }
        ]
      })
      
      const total = await Post.count({ where: { active: true } })
      
      res.json({
        success: true,
        posts,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      })
    } catch (error) {
      console.error('Error getting posts:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // Crear post
  createPost: async (req, res) => {
    try {
      const { content, type = 'general' } = req.body
      const userId = req.user.id
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'El contenido es requerido' 
        })
      }
      
      const post = await Post.create({
        userId,
        content: content.trim(),
        type
      })
      
      // Obtener el post con datos del usuario
      const postWithUser = await Post.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'photo']
          }
        ]
      })
      
      res.status(201).json({
        success: true,
        message: 'Post creado exitosamente',
        post: postWithUser
      })
    } catch (error) {
      console.error('Error creating post:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // Dar like a un post
  toggleLike: async (req, res) => {
    try {
      const { postId } = req.params
      const userId = req.user.id
      
      const post = await Post.findByPk(postId)
      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: 'Post no encontrado' 
        })
      }
      
      // Verificar si ya dio like
      const existingLike = await PostLike.findOne({
        where: { postId, userId }
      })
      
      if (existingLike) {
        // Quitar like
        await existingLike.destroy()
        await post.decrement('likes')
        return res.json({
          success: true,
          message: 'Like removido',
          liked: false,
          likes: post.likes - 1
        })
      } else {
        // Agregar like
        await PostLike.create({ postId, userId })
        await post.increment('likes')
        return res.json({
          success: true,
          message: 'Like agregado',
          liked: true,
          likes: post.likes + 1
        })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // Comentar un post
  createComment: async (req, res) => {
    try {
      const { postId } = req.params
      const { content } = req.body
      const userId = req.user.id
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'El comentario es requerido' 
        })
      }
      
      const post = await Post.findByPk(postId)
      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: 'Post no encontrado' 
        })
      }
      
      const comment = await Comment.create({
        postId,
        userId,
        content: content.trim()
      })
      
      await post.increment('commentsCount')
      
      // Obtener el comentario con datos del usuario
      const commentWithUser = await Comment.findByPk(comment.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'photo']
          }
        ]
      })
      
      res.status(201).json({
        success: true,
        message: 'Comentario agregado',
        comment: commentWithUser
      })
    } catch (error) {
      console.error('Error creating comment:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // Obtener comentarios de un post
  getComments: async (req, res) => {
    try {
      const { postId } = req.params
      
      const comments = await Comment.findAll({
        where: { postId, active: true },
        order: [['created_at', 'ASC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'photo']
          }
        ]
      })
      
      res.json({
        success: true,
        comments
      })
    } catch (error) {
      console.error('Error getting comments:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = communityController