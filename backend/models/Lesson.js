const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Lesson = sequelize.define(
    "Lesson",
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
      estimatedMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 15,
        field: "estimated_minutes",
      },
    },
    {
      tableName: "lessons",
      timestamps: true,
      underscored: true,
    }
  );

  return Lesson;
};
