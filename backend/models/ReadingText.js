const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ReadingText = sequelize.define(
    "ReadingText",
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      comprehensionQuestionIds: {
        type: DataTypes.JSON,
        field: "comprehension_question_ids",
        defaultValue: [],
      },
    },
    {
      tableName: "reading_texts",
      timestamps: true,
      underscored: true,
    }
  );

  return ReadingText;
};
