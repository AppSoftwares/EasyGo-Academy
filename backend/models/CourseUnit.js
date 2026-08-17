const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CourseUnit = sequelize.define(
    "CourseUnit",
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      moduleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "module_id",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      objective: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      tableName: "course_units",
      timestamps: true,
      underscored: true,
    }
  );

  return CourseUnit;
};
