const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CourseLevel = sequelize.define(
    "CourseLevel",
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      code: {
        type: DataTypes.ENUM("A1", "A2", "B1", "B2", "C1"),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estimatedDurationMonths: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "estimated_duration_months",
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      tableName: "course_levels",
      timestamps: true,
      underscored: true,
    }
  );

  return CourseLevel;
};
