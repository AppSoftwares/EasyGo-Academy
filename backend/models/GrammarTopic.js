// backend/models/GrammarTopic.js - VERSIÓN EXTENDIDA
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const GrammarTopic = sequelize.define('GrammarTopic', {
    // ========== CAMPOS EXISTENTES (no tocar) ==========
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    formula: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(10),
      defaultValue: '📖',
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'unit_id',
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    tips: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    commonMistakes: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'common_mistakes',
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    
    // ========== NUEVOS CAMPOS PARA EL CURRÍCULO PARALELO ==========
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'module_id',
      comment: 'ID del módulo (1-12 para curso A1)'
    },
    lessonType: {
      type: DataTypes.ENUM('explanation', 'exercise', 'quiz', 'personalized_class', 'evaluation'),
      defaultValue: 'explanation',
      field: 'lesson_type'
    },
    requiresValidation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'requires_validation'
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
    orderInModule: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'order_in_module'
    },
    pointsToPass: {
      type: DataTypes.INTEGER,
      defaultValue: 70,
      field: 'points_to_pass'
    },
    estimatedTime: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      field: 'estimated_time',
      comment: 'Tiempo estimado en minutos'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_id',
      comment: 'Para lecciones hijas (ej: quizzes dentro de una lección)'
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_required'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
      comment: 'ID del profesor que creó la lección'
    }
  }, {
    tableName: 'grammar_topics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  // Auto-relación para lecciones hijas
  GrammarTopic.hasMany(GrammarTopic, { as: 'children', foreignKey: 'parent_id' })
  GrammarTopic.belongsTo(GrammarTopic, { as: 'parent', foreignKey: 'parent_id' })

  return GrammarTopic
}