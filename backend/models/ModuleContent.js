// backend/models/ModuleContent.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const ModuleContent = sequelize.define('ModuleContent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'module_id',
      comment: 'ID del módulo (de content donde type="module")',
      references: {
        model: 'content',
        key: 'id',
      },
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'content_id',
      comment: 'ID del contenido (de content, grammar_topics, audiobooks, etc.)',
    },
    contentType: {
      type: DataTypes.ENUM('lesson', 'exercise', 'quiz', 'grammar', 'audiobook', 'task', 'video', 'material'),
      defaultValue: 'lesson',
      field: 'content_type',
      allowNull: false,
      comment: 'Tipo de contenido para saber de qué tabla viene',
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Orden dentro del módulo',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_required',
      comment: '¿Obligatorio para completar el módulo?',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'module_content',
    timestamps: false,
    updatedAt: false,
  })

  return ModuleContent
}