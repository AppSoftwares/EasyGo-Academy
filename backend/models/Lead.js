const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Lead = sequelize.define(
    "Lead",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: { msg: "Email inválido" },
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      goal: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      source: {
        type: DataTypes.STRING(50),
        defaultValue: "landing_hero",
        comment: "De dónde viene el lead (landing_hero, landing_footer, etc.)",
      },
      status: {
        type: DataTypes.ENUM("new", "contacted", "converted", "discarded"),
        defaultValue: "new",
      },
      testResult: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Respuestas del test de nivelación",
      },
      recommendedLevel: {
        type: DataTypes.STRING(5),
        allowNull: true,
        comment: "Nivel recomendado (A1, A2, B1, B2, C1)",
      },
      testScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Puntaje obtenido en el test (%)",
      },
      testCompletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "test_completed_at",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      convertedToUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      convertedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "leads",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Lead;
};
