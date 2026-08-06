const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LevelTest = sequelize.define('LevelTest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_points'
    },
    earnedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'earned_points'
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    recommendedLevel: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'recommended_level',
      validate: {
        isIn: { args: [['A1', 'A2', 'B1', 'B2', 'C1']], msg: 'Nivel inválido' }
      }
    },
    categoryScores: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'category_scores',
      comment: 'Puntuaciones por categoria: grammar, vocabulary, listening, speaking, reading, writing'
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Respuestas del usuario a cada pregunta'
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    skipped: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reviewedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reviewed_by'
    },
    reviewedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_date'
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'review_notes'
    },
    finalLevel: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'final_level',
      validate: {
        isIn: { args: [['A1', 'A2', 'B1', 'B2', 'C1']], msg: 'Nivel inválido' }
      }
    }
  }, {
    tableName: 'level_tests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return LevelTest;
};