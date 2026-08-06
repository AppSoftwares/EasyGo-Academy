const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TestProgress = sequelize.define(
    "TestProgress",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: { model: "users", key: "id" },
      },
      currentQuestion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "current_question",
      },
      answers: { type: DataTypes.JSON, defaultValue: {} },
      textAnswers: {
        type: DataTypes.JSON,
        defaultValue: {},
        field: "text_answers",
      },
      startedAt: {
        type: DataTypes.DATE,
        field: "started_at",
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        defaultValue: DataTypes.NOW,
      },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
      skipped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Si el usuario omitió el test",
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "completed_at",
      },
      totalQuestions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "total_questions",
      },
    },
    { tableName: "test_progress", timestamps: false },
  );

  return TestProgress;
};
