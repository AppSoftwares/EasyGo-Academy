// backend/models/Content.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Content = sequelize.define('Content', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'teacher_id',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('material', 'video', 'exercise', 'quiz', 'link', 'lesson', 'module'),
      defaultValue: 'material',
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      defaultValue: 'A1',
    },
    
    // ========== NUEVOS CAMPOS PARA CURRÍCULO ==========
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'module_id',
      comment: 'ID del módulo (1-12)'
    },
    orderInModule: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'order_in_module'
    },
    lessonType: {
      type: DataTypes.ENUM('explanation', 'exercise', 'quiz', 'personalized_class', 'evaluation'),
      defaultValue: 'explanation',
      field: 'lesson_type'
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Contenido explicativo de la lección'
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Preguntas del test'
    },
    tips: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Consejos para recordar'
    },
    audioUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'audio_url'
    },
    videoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'video_url'
    },
    requiresValidation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'requires_validation'
    },
    pointsToPass: {
      type: DataTypes.INTEGER,
      defaultValue: 70,
      field: 'points_to_pass'
    },
    estimatedTime: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      field: 'estimated_time'
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_required'
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'unit_id',
      comment: 'Para compatibilidad con sistema de progreso'
    },
    
    // ========== CAMPOS EXISTENTES ==========
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_url',
    },
    embedCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'embed_code',
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'content',
    timestamps: true,
  })

  return Content
}