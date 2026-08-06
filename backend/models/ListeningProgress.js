const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const ListeningProgress = sequelize.define('ListeningProgress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: { model: 'users', key: 'id' }
    },
    audiobookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'audiobook_id',
      references: { model: 'audiobooks', key: 'id' }
    },
    currentTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'current_time',
      comment: 'Segundo actual de reproducción',
    },
    savedCheckpoint: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'saved_checkpoint',
      comment: 'Último checkpoint guardado (múltiplo de 30)',
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
  }, {
    tableName: 'listening_progress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return ListeningProgress
}