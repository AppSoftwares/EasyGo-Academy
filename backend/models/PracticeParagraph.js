const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PracticeParagraph = sequelize.define(
    "PracticeParagraph",
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      unitId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "unit_id",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paragraph: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      practiceExerciseIds: {
        type: DataTypes.JSON,
        field: "practice_exercise_ids",
        defaultValue: [],
      },
    },
    {
      tableName: "practice_paragraphs",
      timestamps: true,
      underscored: true,
    }
  );

  return PracticeParagraph;
};
