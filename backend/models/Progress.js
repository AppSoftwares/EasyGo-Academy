// backend/models/Progress.js - VERSIÓN EXTENDIDA
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Progress = sequelize.define('Progress', {
    // ========== CAMPOS EXISTENTES ==========
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false,
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'module_id',
    },
    moduleTitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'module_title',
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'unit_id',
    },
    unitTitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'unit_title',
    },
    unitType: {
      type: DataTypes.ENUM('grammar', 'vocabulary', 'speaking', 'writing', 'listening', 'reading','audiobook', 'lesson'),
      allowNull: false,
      field: 'unit_type',
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'time_spent',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
    
    // ========== NUEVOS CAMPOS PARA CURRÍCULO PARALELO ==========
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'lesson_id',
      comment: 'ID de la lección específica'
    },
    validatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'validated_by',
      comment: 'Profesor que validó la lección'
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'validated_at',
      comment: 'Fecha de validación'
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Número de intentos en quizzes'
    },
    courseType: {
      type: DataTypes.ENUM('grammar', 'curriculum'),
      defaultValue: 'grammar',
      field: 'course_type',
      comment: 'Para diferenciar el sistema actual del nuevo currículo'
    }
  }, {
    tableName: 'progress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return Progress
}