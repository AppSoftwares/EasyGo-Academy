const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Ranking = sequelize.define('Ranking', {
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
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false,
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Días consecutivos de estudio',
    },
    lessonsCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'lessons_completed',
    },
    exercisesCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'exercises_completed',
    },
    hoursStudied: {
      type: DataTypes.DECIMAL(5, 1),
      defaultValue: 0,
      field: 'hours_studied',
    },
    week: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'YYYY-WW formato',
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'ranking',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return Ranking
}