const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Pronunciation = sequelize.define('Pronunciation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    word: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Palabra o frase en inglés',
    },
    phonetic: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Pronunciación fonética (ej: /həˈloʊ/)',
    },
    spanishPronunciation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'spanish_pronunciation',
      comment: 'Pronunciación en español (ej: jelou)',
    },
    translation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Traducción al español',
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Oración de ejemplo en inglés',
    },
    exampleTranslation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'example_translation',
      comment: 'Traducción del ejemplo',
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('vowels', 'consonants', 'diphthongs', 'silent_letters', 'stress', 'intonation', 'common_words', 'workplace', 'daily_life', 'phrases', 'tongue_twisters', 'minimal_pairs'),
      allowNull: false,
      defaultValue: 'common_words',
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'easy',
    },
    audioUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'audio_url',
      comment: 'URL del audio con la pronunciación correcta',
    },
    tips: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Tips para pronunciar correctamente (en español)',
    },
    commonMistakes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'common_mistakes',
      comment: 'Errores comunes de hispanohablantes',
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    timesPracticed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'times_practiced',
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
    tableName: 'pronunciations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return Pronunciation
} 