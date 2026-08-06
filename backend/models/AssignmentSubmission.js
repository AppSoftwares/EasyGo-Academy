// backend/models/AssignmentSubmission.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'assignment_id',
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_url',
    },
    submitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submitted_at',
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'assignment_submissions',
    timestamps: true,
    updatedAt: false,
  })

  return AssignmentSubmission
}