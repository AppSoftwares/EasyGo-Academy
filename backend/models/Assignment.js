// backend/models/Assignment.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Assignment = sequelize.define('Assignment', {
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
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      defaultValue: 'A1',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'due_date',
    },
    maxScore: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      field: 'max_score',
    },
    type: {
      type: DataTypes.ENUM('homework', 'quiz', 'project', 'exam'),
      defaultValue: 'homework',
    },
    assignedToAll: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'assigned_to_all',
    },
    assignedStudentIds: {
      type: DataTypes.JSON,
      defaultValue: [],
      field: 'assigned_student_ids',
      comment: 'Array de IDs de estudiantes asignados'
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
    tableName: 'assignments',
    timestamps: true,
  })

  return Assignment
}