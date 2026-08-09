const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: "El nombre es requerido" },
          len: {
            args: [2, 100],
            msg: "El nombre debe tener entre 2 y 100 caracteres",
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          args: true,
          msg: "Este email ya está registrado",
        },
        validate: {
          isEmail: { msg: "Email inválido" },
          notEmpty: { msg: "El email es requerido" },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "La contraseña es requerida" },
          len: {
            args: [6, 255],
            msg: "La contraseña debe tener al menos 6 caracteres",
          },
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      
      lastAccess: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_access",
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "teacher_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },

      role: {
        type: DataTypes.ENUM("admin", "user", "teacher"),
        defaultValue: "user",
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "URL de la foto de perfil",
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      plan: {
        type: DataTypes.ENUM("basic", "premium"),
        defaultValue: "basic",
      },
      levelTestCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "level_test_completed",
      },
      levelTestResult: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "level_test_result",
      },
      assignedLevel: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: "assigned_level",
        validate: {
          isIn: {
            args: [["A1", "A2", "B1", "B2", "C1"]],
            msg: "Nivel inválido",
          },
        },
      },
      finalAssignedLevel: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: "final_assigned_level",
        validate: {
          isIn: {
            args: [["A1", "A2", "B1", "B2", "C1"]],
            msg: "Nivel inválido",
          },
        },
      },
      levelTestReviewed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "level_test_reviewed",
      },
      reviewedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "reviewed_by",
      },
      reviewedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "reviewed_date",
      },
      reviewNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "review_notes",
      },
      twoFactorSecret: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "two_factor_secret",
      },
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "two_factor_enabled",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const bcrypt = require("bcryptjs");
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const bcrypt = require("bcryptjs");
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    },
  );

  // Método de instancia para verificar contraseña
  User.prototype.validatePassword = async function (password) {
    const bcrypt = require("bcryptjs");
    return await bcrypt.compare(password, this.password);
  };

  // Método para retornar datos seguros (sin password)
  User.prototype.toSafeObject = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
