const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Module = sequelize.define(
    "Module",
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      levelId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "level_id",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      tableName: "modules",
      timestamps: true,
      underscored: true,
    }
  );

  return Module;
};
