const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Exercise = sequelize.define(
    "Exercise",
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      lessonId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "lesson_id",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("READING", "SPEAKING", "WRITING", "GRAMMAR"),
        allowNull: false,
      },
      prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      correctAnswer: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "correct_answer",
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
    },
    {
      tableName: "exercises",
      timestamps: true,
      underscored: true,
    }
  );

  return Exercise;
};
