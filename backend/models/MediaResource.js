const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MediaResource = sequelize.define(
    "MediaResource",
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
      type: {
        type: DataTypes.ENUM("UNIT_INTRO_VIDEO", "SUPPORT_VIDEO", "IMAGE"),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      descriptionText: {
        type: DataTypes.TEXT,
        field: "description_text",
        defaultValue: "",
      },
    },
    {
      tableName: "media_resources",
      timestamps: true,
      underscored: true,
    }
  );

  return MediaResource;
};
