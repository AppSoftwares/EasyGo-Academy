const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const News = sequelize.define('News', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Contenido de la noticia en inglés',
    },
    contentSpanish: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'content_spanish',
      comment: 'Resumen o traducción en español',
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('world', 'usa', 'technology', 'business', 'health', 'education', 'sports', 'entertainment', 'science', 'culture', 'tips', 'easygo'),
      allowNull: false,
      defaultValue: 'world',
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url',
    },
    source: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Fuente original de la noticia',
    },
    sourceUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'source_url',
    },
    vocabulary: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '[{word, translation, pronunciation}]',
    },
    readingTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'reading_time',
      comment: 'Tiempo de lectura en minutos',
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '["tag1", "tag2"]',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'published_at',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'updated_by',
    },
  }, {
    tableName: 'news',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return News
}