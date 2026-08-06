const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('multiple', 'fill', 'true_false'),
      allowNull: false,
      defaultValue: 'multiple',
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array de opciones para preguntas multiple/true_false',
    },
    answer: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Respuesta correcta (índice para multiple, texto para fill)',
    },
    acceptAlso: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Respuestas alternativas aceptadas',
    },
    category: {
      type: DataTypes.ENUM('grammar', 'vocabulary', 'reading', 'writing', 'listening', 'speaking'),
      allowNull: false,
      defaultValue: 'grammar',
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Sección del examen (ej: "Verbo To Be", "Present Simple")',
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1, max: 5 },
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Orden dentro de la sección',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Explicación de la respuesta correcta',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
      comment: 'ID del admin/profesor que creó la pregunta',
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'updated_by',
      comment: 'ID del admin/profesor que modificó la pregunta',
    },
  }, {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return Question
}