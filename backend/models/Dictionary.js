const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Dictionary = sequelize.define('Dictionary', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    word: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    translation: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phonetic: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    spanishPronunciation: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'spanish_pronunciation'
    },
    definition: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exampleTranslation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'example_translation'
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    synonyms: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tips: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    searches: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'dictionary',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return Dictionary
}