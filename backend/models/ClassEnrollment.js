const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ClassEnrollment = sequelize.define(
    "ClassEnrollment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "class_id",
        references: {
          model: "classes",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      attended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Si el estudiante asistió a la clase",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Notas del profesor sobre el estudiante en esta clase",
      },
    },
    {
      tableName: "class_enrollments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["class_id", "user_id"],
        },
      ],
    },
  );

  return ClassEnrollment;
};