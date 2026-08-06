// backend/models/Notification.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
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
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'achievement', 'class', 'assignment', 'level_up', 'test_completed', 'admin'),
      defaultValue: 'info',
    },
    icon: {
      type: DataTypes.STRING(50),
      defaultValue: '📌',
    },
    link: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read',
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'related_id',
    },
    relatedType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'related_type',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false,
  })

  return Notification
}