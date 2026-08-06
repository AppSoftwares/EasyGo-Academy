// backend/models/Schedule.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'teacher_id',
      unique: true,
    },
    schedule: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'schedules',
    timestamps: true,
    createdAt: false,
  })

  return Schedule
}