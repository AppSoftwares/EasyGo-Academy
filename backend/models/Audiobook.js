const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Audiobook = sequelize.define('Audiobook', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('stories', 'dialogues', 'business', 'daily', 'news', 'interviews', 'academic', 'other'),
      allowNull: false,
      defaultValue: 'other',
    },
    duration: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Formato: MM:SS',
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duración en segundos para cálculo',
    },
    narrator: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    accent: {
      type: DataTypes.ENUM('American', 'British', 'Australian', 'Mixed', 'Other'),
      allowNull: true,
      defaultValue: 'American',
    },
    audioUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'audio_url',
      comment: 'URL del archivo de audio (MP3)',
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'thumbnail_url',
      comment: 'URL de la imagen/miniatura',
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Transcripción del audio',
    },
    vocabulary: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Lista de vocabulario clave [{word, translation}]',
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Preguntas de comprensión [{question, options, answer}]',
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    downloads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    plays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: { min: 0, max: 5 },
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
    tableName: 'audiobooks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return Audiobook
}