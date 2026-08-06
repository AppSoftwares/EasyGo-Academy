const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Class = sequelize.define(
    "Class",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "teacher_id",
        references: {
          model: "users",
          key: "id",
        },
        comment: "ID del profesor asignado (de la tabla users)",
      },
      teacherName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "teacher_name",
        comment: "Nombre del profesor (auto-completado del usuario)",
      },
      teacherRole: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "teacher_role",
        comment: "Rol del profesor (auto-completado)",
      },
      teacherPhoto: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "teacher_photo",
        comment: "URL de la foto del profesor (auto-completado)",
      },
      teacherInitials: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: "teacher_initials",
        comment: "Iniciales del profesor (auto-completado)",
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "Fecha de la clase",
      },
      time: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Hora de la clase (formato: HH:MM - HH:MM)",
      },
      duration: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
        comment: "Duración en minutos",
      },
      meetLink: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "meet_link",
        comment: "Enlace de Zoom o videoconferencia",
      },
      level: {
        type: DataTypes.ENUM("A1", "A2", "B1", "B2", "C1", "all"),
        defaultValue: "all",
        comment: "Nivel de la clase (all = todos los niveles)",
      },
      maxStudents: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        field: "max_students",
        comment: "Cupo máximo de estudiantes",
      },
      currentStudents: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "current_students",
        comment: "Estudiantes inscritos actualmente",
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Si la clase está activa o no",
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "created_by",
        comment: "ID del admin/profesor que creó la clase",
      },
    },
    {
      tableName: "classes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Class;
};