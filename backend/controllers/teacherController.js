// backend/controllers/teacherController.js
const {
  User,
  Class,
  ClassEnrollment,
  Progress,
  GrammarTopic,
  Assignment,
  AssignmentSubmission,
  Content,
  Message,
  Notification,
  Schedule,
} = require("../models");
const { Op } = require("sequelize");
const notificationHelper = require("../utils/notificationHelper");

const teacherController = {
  // ==================== DASHBOARD ====================
  getStats: async (req, res) => {
    try {
      const teacherId = req.user.id;

      const totalStudents = await User.count({
        where: { role: "user", teacherId: teacherId },
      });
      const totalClasses = await Class.count({
        where: { teacherId: teacherId },
      });

      const students = await User.findAll({
        where: { role: "user", teacherId: teacherId },
      });
      let avgProgress = 0;
      if (students.length > 0) {
        let progressSum = 0;
        for (const student of students) {
          const progress = await Progress.findAll({
            where: { userId: student.id },
          });
          const completed = progress.filter((p) => p.completed).length;
          const total = progress.length;
          progressSum += total > 0 ? (completed / total) * 100 : 0;
        }
        avgProgress = Math.round(progressSum / students.length);
      }

      // Tareas pendientes de calificar
      const assignments = await Assignment.findAll({
        where: { teacherId: teacherId },
      });
      let pendingCount = 0;
      for (const assignment of assignments) {
        const submissions = await AssignmentSubmission.findAll({
          where: { assignmentId: assignment.id, grade: null },
        });
        pendingCount += submissions.length;
      }

      res.json({
        success: true,
        stats: {
          totalStudents,
          totalClasses,
          avgProgress,
          completionRate: Math.round((totalClasses > 0 ? 1 : 0) * 100),
          pendingAssignments: pendingCount,
        },
      });
    } catch (error) {
      console.error("Error getting teacher stats:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener estadísticas" });
    }
  },

  // ==================== CLASES ====================
  getMyClasses: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const classes = await Class.findAll({
        where: { teacherId: teacherId },
        include: [
          {
            model: ClassEnrollment,
            as: "enrollments",
            include: [
              { model: User, as: "user", attributes: ["id", "name", "email"] },
            ],
          },
        ],
        order: [["date", "ASC"]],
      });

      res.json({ success: true, classes });
    } catch (error) {
      console.error("Error getting my classes:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener clases" });
    }
  },

  getClass: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classData = await Class.findOne({
        where: { id, teacherId: teacherId },
        include: [
          {
            model: ClassEnrollment,
            as: "enrollments",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "email", "assignedLevel"],
              },
            ],
          },
        ],
      });

      if (!classData) {
        return res
          .status(404)
          .json({ success: false, message: "Clase no encontrada" });
      }

      res.json({ success: true, class: classData });
    } catch (error) {
      console.error("Error getting class:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener clase" });
    }
  },

  createClass: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const {
        title,
        description,
        date,
        time,
        duration,
        meetLink,
        maxStudents,
      } = req.body;

      const newClass = await Class.create({
        title,
        description,
        teacherId,
        date,
        time,
        duration: duration || 60,
        meetLink,
        maxStudents: maxStudents || 50,
        currentStudents: 0,
        active: true,
      });

      // Notificar a todos los estudiantes
      const students = await User.findAll({ where: { role: "user" } });
      await notificationHelper.notifyNewClass(newClass);

      res.status(201).json({ success: true, class: newClass });
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ success: false, message: "Error al crear clase" });
    }
  },

  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classData = await Class.findOne({
        where: { id, teacherId: teacherId },
      });
      if (!classData) {
        return res
          .status(404)
          .json({ success: false, message: "Clase no encontrada" });
      }

      await classData.update(req.body);
      res.json({ success: true, class: classData });
    } catch (error) {
      console.error("Error updating class:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar clase" });
    }
  },

  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classData = await Class.findOne({
        where: { id, teacherId: teacherId },
      });
      if (!classData) {
        return res
          .status(404)
          .json({ success: false, message: "Clase no encontrada" });
      }

      const enrollments = await ClassEnrollment.findAll({
        where: { classId: id },
        include: [{ model: User, as: "user" }],
      });
      for (const enrollment of enrollments) {
        await notificationHelper.createForUser(enrollment.userId, {
          title: "⚠️ Clase cancelada",
          message: `La clase "${classData.title}" ha sido cancelada.`,
          type: "error",
          icon: "⚠️",
          link: "/classes",
        });
      }

      await classData.destroy();
      res.json({ success: true, message: "Clase eliminada" });
    } catch (error) {
      console.error("Error deleting class:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar clase" });
    }
  },

  getClassEnrollments: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classData = await Class.findOne({
        where: { id, teacherId: teacherId },
      });
      if (!classData) {
        return res
          .status(404)
          .json({ success: false, message: "Clase no encontrada" });
      }

      const enrollments = await ClassEnrollment.findAll({
        where: { classId: id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "assignedLevel"],
          },
        ],
      });

      res.json({ success: true, enrollments });
    } catch (error) {
      console.error("Error getting enrollments:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener inscripciones" });
    }
  },

  markAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const { studentId, attended } = req.body;
      const teacherId = req.user.id;

      const classData = await Class.findOne({
        where: { id, teacherId: teacherId },
      });
      if (!classData) {
        return res
          .status(404)
          .json({ success: false, message: "Clase no encontrada" });
      }

      const enrollment = await ClassEnrollment.findOne({
        where: { classId: id, userId: studentId },
      });
      if (!enrollment) {
        return res
          .status(404)
          .json({ success: false, message: "Inscripción no encontrada" });
      }

      await enrollment.update({ attended: attended });
      res.json({ success: true, enrollment });
    } catch (error) {
      console.error("Error marking attendance:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al marcar asistencia" });
    }
  },

  sendClassReminder: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classData = await Class.findOne({
        where: { id, teacherId: teacherId },
      });
      if (!classData) {
        return res
          .status(404)
          .json({ success: false, message: "Clase no encontrada" });
      }

      const enrollments = await ClassEnrollment.findAll({
        where: { classId: id },
        include: [{ model: User, as: "user" }],
      });

      for (const enrollment of enrollments) {
        await notificationHelper.createForUser(enrollment.userId, {
          title: "⏰ Recordatorio de clase",
          message: `Tu clase "${classData.title}" es el ${new Date(classData.date).toLocaleDateString()} a las ${classData.time}`,
          type: "warning",
          icon: "⏰",
          link: "/classes",
        });
      }

      res.json({ success: true, message: "Recordatorio enviado" });
    } catch (error) {
      console.error("Error sending reminder:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al enviar recordatorio" });
    }
  },

  // ==================== ALUMNOS ====================
  getMyStudents: async (req, res) => {
    try {
      const teacherId = req.user.id;

      const classes = await Class.findAll({
        where: { teacherId: teacherId },
        include: [{ model: ClassEnrollment, as: "enrollments" }],
      });

      const studentIds = new Set();
      classes.forEach((cls) => {
        cls.enrollments?.forEach((enrollment) => {
          studentIds.add(enrollment.userId);
        });
      });

      const students = await User.findAll({
        where: { id: { [Op.in]: Array.from(studentIds) }, role: "user" },
        attributes: [
          "id",
          "name",
          "email",
          "assignedLevel",
          "phone",
          "created_at",
          "lastAccess",
          "status",
        ],
      });

      const studentsWithProgress = await Promise.all(
        students.map(async (student) => {
          const progress = await Progress.findAll({
            where: { userId: student.id },
          });
          const completed = progress.filter((p) => p.completed).length;
          const total = progress.length;
          const progressPercent =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          return {
            ...student.toJSON(),
            progress: progressPercent,
            attendedClasses: 0,
          };
        }),
      );

      res.json({ success: true, students: studentsWithProgress });
    } catch (error) {
      console.error("Error getting my students:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener alumnos" });
    }
  },

  getStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classes = await Class.findAll({
        where: { teacherId: teacherId },
        include: [
          { model: ClassEnrollment, as: "enrollments", where: { userId: id } },
        ],
      });

      if (classes.length === 0) {
        return res
          .status(403)
          .json({ success: false, message: "No tienes acceso a este alumno" });
      }

      const student = await User.findByPk(id, {
        attributes: [
          "id",
          "name",
          "email",
          "assignedLevel",
          "phone",
          "status",
          "createdAt",
          "lastAccess",
        ],
      });

      res.json({ success: true, student });
    } catch (error) {
      console.error("Error getting student:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener alumno" });
    }
  },

  getStudentProgress: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classes = await Class.findAll({
        where: { teacherId: teacherId },
        include: [
          { model: ClassEnrollment, as: "enrollments", where: { userId: id } },
        ],
      });

      if (classes.length === 0) {
        return res
          .status(403)
          .json({ success: false, message: "No tienes acceso a este alumno" });
      }

      const progress = await Progress.findAll({ where: { userId: id } });
      const completed = progress.filter((p) => p.completed).length;
      const total = progress.length;
      const overall = total > 0 ? Math.round((completed / total) * 100) : 0;

      const levels = ["A1", "A2", "B1", "B2", "C1"];
      const levelsData = {};
      for (const level of levels) {
        const levelProgress = progress.filter((p) => p.level === level);
        const levelCompleted = levelProgress.filter((p) => p.completed).length;
        levelsData[level] = {
          total: levelProgress.length,
          completed: levelCompleted,
          progress:
            levelProgress.length > 0
              ? Math.round((levelCompleted / levelProgress.length) * 100)
              : 0,
        };
      }

      const recentUnits = progress
        .filter((p) => p.completed)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 10)
        .map((p) => ({
          id: p.unitId,
          title: p.unitTitle,
          score: p.score,
          completedAt: p.completedAt,
        }));

      const avgScore =
        progress
          .filter((p) => p.completed)
          .reduce((sum, p) => sum + (p.score || 0), 0) /
        (progress.filter((p) => p.completed).length || 1);
      const totalTime = progress.reduce(
        (sum, p) => sum + (p.timeSpent || 0),
        0,
      );

      res.json({
        success: true,
        progress: {
          overall,
          totalUnits: total,
          completedUnits: completed,
          levels: levelsData,
          recentUnits,
          avgScore: Math.round(avgScore),
          totalTime: Math.floor(totalTime / 60),
        },
      });
    } catch (error) {
      console.error("Error getting student progress:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener progreso" });
    }
  },

  getStudentAssignments: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const classes = await Class.findAll({
        where: { teacherId: teacherId },
        include: [
          { model: ClassEnrollment, as: "enrollments", where: { userId: id } },
        ],
      });

      if (classes.length === 0) {
        return res
          .status(403)
          .json({ success: false, message: "No tienes acceso a este alumno" });
      }

      const assignments = await Assignment.findAll({
        where: { teacherId: teacherId },
        include: [
          {
            model: AssignmentSubmission,
            as: "submissions",
            where: { studentId: id },
            required: false,
          },
        ],
        order: [["dueDate", "DESC"]],
      });

      const formattedAssignments = assignments.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        maxScore: a.maxScore,
        type: a.type,
        submittedAt: a.submissions?.[0]?.submittedAt || null,
        grade: a.submissions?.[0]?.grade || null,
        feedback: a.submissions?.[0]?.feedback || null,
      }));

      res.json({ success: true, assignments: formattedAssignments });
    } catch (error) {
      console.error("Error getting student assignments:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener tareas del alumno",
      });
    }
  },

  sendMessageToStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;
      const { message } = req.body;

      const student = await User.findByPk(id);
      if (!student || student.role !== "user") {
        return res
          .status(404)
          .json({ success: false, message: "Alumno no encontrado" });
      }

      const newMessage = await Message.create({
        senderId: teacherId,
        receiverId: id,
        message: message,
        isRead: false,
      });

      await notificationHelper.createForUser(id, {
        title: "📩 Nuevo mensaje",
        message: `Tienes un nuevo mensaje de tu profesor`,
        type: "info",
        icon: "📩",
        link: "/messages",
      });

      res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al enviar mensaje" });
    }
  },

  // ==================== PROGRESO GENERAL ====================
  getProgressOverview: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const { period = "month" } = req.query;

      const classes = await Class.findAll({
        where: { teacherId: teacherId },
        include: [{ model: ClassEnrollment, as: "enrollments" }],
      });

      const studentIds = new Set();
      classes.forEach((cls) => {
        cls.enrollments?.forEach((e) => studentIds.add(e.userId));
      });

      const students = await User.findAll({
        where: { id: { [Op.in]: Array.from(studentIds) } },
      });
      const activeStudents = students.filter(
        (s) => s.status === "active",
      ).length;

      let totalProgress = 0;
      for (const student of students) {
        const progress = await Progress.findAll({
          where: { userId: student.id },
        });
        const completed = progress.filter((p) => p.completed).length;
        const total = progress.length;
        totalProgress += total > 0 ? (completed / total) * 100 : 0;
      }
      const avgProgress =
        students.length > 0 ? Math.round(totalProgress / students.length) : 0;

      // Datos para gráfica (últimos 7 días)
      const dailyProgress = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyProgress.push({
          label: date.toLocaleDateString("es-ES", { weekday: "short" }),
          value: Math.floor(Math.random() * 100),
        });
      }

      const levelDistribution = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
      for (const student of students) {
        const level = student.assignedLevel || "A1";
        if (levelDistribution[level] !== undefined) levelDistribution[level]++;
      }

      const topStudents = await Promise.all(
        students.map(async (student) => {
          const progress = await Progress.findAll({
            where: { userId: student.id },
          });
          const completed = progress.filter((p) => p.completed).length;
          const total = progress.length;
          return {
            id: student.id,
            name: student.name,
            email: student.email,
            progress: total > 0 ? Math.round((completed / total) * 100) : 0,
            completedUnits: completed,
          };
        }),
      );
      topStudents.sort((a, b) => b.progress - a.progress);

      res.json({
        success: true,
        activeStudents,
        completionRate: avgProgress,
        totalHours: 0,
        avgScore: 0,
        dailyProgress,
        levelDistribution,
        topStudents: topStudents.slice(0, 5),
      });
    } catch (error) {
      console.error("Error getting progress overview:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener progreso" });
    }
  },

  // ==================== TAREAS (ASSIGNMENTS) ====================
  getAssignments: async (req, res) => {
    try {
      const teacherId = req.user.id;

      const assignments = await Assignment.findAll({
        where: { teacherId: teacherId },
        order: [["dueDate", "ASC"]],
      });

      const assignmentsWithStats = await Promise.all(
        assignments.map(async (assignment) => {
          const submissions = await AssignmentSubmission.findAll({
            where: { assignmentId: assignment.id },
          });

          return {
            ...assignment.toJSON(),
            totalStudents: await User.count({ where: { role: "user" } }),
            submittedCount: submissions.length,
            submissions: submissions,
          };
        }),
      );

      res.json({ success: true, assignments: assignmentsWithStats });
    } catch (error) {
      console.error("Error getting assignments:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener tareas" });
    }
  },

  getAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      const submissions = await AssignmentSubmission.findAll({
        where: { assignmentId: assignment.id },
        include: [
          { model: User, as: "student", attributes: ["id", "name", "email"] },
        ],
      });

      res.json({
        success: true,
        assignment: {
          ...assignment.toJSON(),
          submissions,
        },
      });
    } catch (error) {
      console.error("Error getting assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener tarea" });
    }
  },

  // backend/controllers/teacherController.js - Reemplazar la función createAssignment

  createAssignment: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const {
        title,
        description,
        instructions,
        level,
        dueDate,
        maxScore,
        type,
        assignedToAll,
        assignedStudentIds,
      } = req.body;

      let finalAssignedStudentIds = [];

      if (assignedToAll) {
        // Asignar a TODOS los alumnos
        const allStudents = await User.findAll({
          where: { role: "user", active: true },
          attributes: ["id"],
        });
        finalAssignedStudentIds = allStudents.map((s) => s.id);
      } else if (assignedStudentIds && assignedStudentIds.length > 0) {
        // Asignar a alumnos específicos
        finalAssignedStudentIds = assignedStudentIds;
      } else {
        return res.status(400).json({
          success: false,
          message: "Debes seleccionar al menos un alumno o asignar a todos",
        });
      }

      // Crear la tarea
      const assignment = await Assignment.create({
        teacherId: teacherId,
        title: title,
        description: description || "",
        instructions: instructions || "",
        level: level || "A1",
        dueDate: dueDate,
        maxScore: maxScore || 100,
        type: type || "homework",
        assignedToAll: assignedToAll || false,
        assignedStudentIds: finalAssignedStudentIds,
        active: true,
      });

      // Crear submissions para cada alumno asignado
      const submissions = [];
      for (const studentId of finalAssignedStudentIds) {
        const submission = await AssignmentSubmission.create({
          assignmentId: assignment.id,
          studentId: studentId,
          submitted: false,
          grade: null,
          feedback: null,
        });
        submissions.push(submission);

        // Notificar al alumno
        await notificationHelper.createForUser(studentId, {
          title: "📝 Nueva tarea asignada",
          message: `Tienes una nueva tarea: "${title}". Fecha límite: ${new Date(dueDate).toLocaleDateString()}`,
          type: "assignment",
          icon: "📝",
          link: `/assignments/${assignment.id}`,
          relatedId: assignment.id,
          relatedType: "assignment",
        });
      }

      res.status(201).json({
        success: true,
        assignment: {
          ...assignment.toJSON(),
          assignedCount: finalAssignedStudentIds.length,
        },
        submissionsCount: submissions.length,
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear tarea: " + error.message,
      });
    }
  },

  updateAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      await assignment.update(req.body);

      res.json({ success: true, assignment });
    } catch (error) {
      console.error("Error updating assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar tarea" });
    }
  },

  deleteAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      await assignment.destroy();

      res.json({ success: true, message: "Tarea eliminada" });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar tarea" });
    }
  },

  gradeAssignment: async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { studentId, grade, feedback } = req.body;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id: assignmentId, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      let submission = await AssignmentSubmission.findOne({
        where: { assignmentId, studentId },
      });

      if (!submission) {
        submission = await AssignmentSubmission.create({
          assignmentId,
          studentId,
          grade,
          feedback,
          submittedAt: new Date(),
        });
      } else {
        await submission.update({ grade, feedback });
      }

      await notificationHelper.createForUser(studentId, {
        title: "📊 Tarea calificada",
        message: `Tu tarea "${assignment.title}" ha sido calificada. Obtuviste ${grade}/${assignment.maxScore} puntos.`,
        type: "success",
        icon: "📊",
        link: "/assignments",
        relatedId: assignmentId,
        relatedType: "assignment",
      });

      res.json({ success: true, submission });
    } catch (error) {
      console.error("Error grading assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al calificar tarea" });
    }
  },

  getPendingAssignments: async (req, res) => {
    try {
      const teacherId = req.user.id;

      const assignments = await Assignment.findAll({
        where: { teacherId: teacherId },
      });

      const pendingAssignments = [];
      for (const assignment of assignments) {
        const submissions = await AssignmentSubmission.findAll({
          where: { assignmentId: assignment.id },
        });
        const totalStudents = await User.count({ where: { role: "user" } });

        if (submissions.length < totalStudents) {
          pendingAssignments.push({
            id: assignment.id,
            title: assignment.title,
            dueDate: assignment.dueDate,
            totalStudents: totalStudents,
            submittedCount: submissions.length,
          });
        }
      }

      res.json({ success: true, assignments: pendingAssignments });
    } catch (error) {
      console.error("Error getting pending assignments:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener tareas pendientes",
      });
    }
  },

  // ==================== CONTENIDO ====================
  getContent: async (req, res) => {
    try {
      const content = await Content.findAll({
        where: {
          type: ["material", "video", "audio", "exercise", "quiz", "link"],
          // Excluye 'lesson' y 'module' porque tienen sus propias vistas
        },
        order: [["createdAt", "DESC"]],
      });

      res.json({ success: true, content });
    } catch (error) {
      console.error("Error getting content:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener contenido" });
    }
  },

  createContent: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const {
        title,
        description,
        type,
        level,
        fileUrl,
        embedCode,
        duration,
        tags,
      } = req.body;

      const content = await Content.create({
        teacherId,
        title,
        description,
        type: type || "material",
        level: level || "A1",
        fileUrl,
        embedCode,
        duration,
        tags,
        active: true,
      });

      res.status(201).json({ success: true, content });
    } catch (error) {
      console.error("Error creating content:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al crear contenido" });
    }
  },

  updateContent: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const content = await Content.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Contenido no encontrado" });
      }

      await content.update(req.body);

      res.json({ success: true, content });
    } catch (error) {
      console.error("Error updating content:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar contenido" });
    }
  },

  deleteContent: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const content = await Content.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Contenido no encontrado" });
      }

      await content.destroy();

      res.json({ success: true, message: "Contenido eliminado" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar contenido" });
    }
  },

  // ==================== MENSAJES ====================
  getMessages: async (req, res) => {
    try {
      const teacherId = req.user.id;

      const messages = await Message.findAll({
        where: {
          [Op.or]: [{ senderId: teacherId }, { receiverId: teacherId }],
        },
        include: [
          { model: User, as: "sender", attributes: ["id", "name", "email"] },
          { model: User, as: "receiver", attributes: ["id", "name", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Agrupar por conversación
      const conversations = {};
      for (const message of messages) {
        const otherId =
          message.senderId === teacherId
            ? message.receiverId
            : message.senderId;
        if (!conversations[otherId]) {
          const otherUser =
            message.senderId === teacherId ? message.receiver : message.sender;
          conversations[otherId] = {
            student: otherUser,
            lastMessage: message.message,
            lastMessageTime: message.createdAt,
            unreadCount:
              message.receiverId === teacherId && !message.isRead ? 1 : 0,
          };
        } else if (message.createdAt > conversations[otherId].lastMessageTime) {
          conversations[otherId].lastMessage = message.message;
          conversations[otherId].lastMessageTime = message.createdAt;
        }
      }

      res.json({ success: true, conversations: Object.values(conversations) });
    } catch (error) {
      console.error("Error getting messages:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener mensajes" });
    }
  },

  getConversation: async (req, res) => {
    try {
      const { studentId } = req.params;
      const teacherId = req.user.id;

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: teacherId, receiverId: studentId },
            { senderId: studentId, receiverId: teacherId },
          ],
        },
        order: [["createdAt", "ASC"]],
      });

      // Marcar como leídos
      await Message.update(
        { isRead: true },
        {
          where: { senderId: studentId, receiverId: teacherId, isRead: false },
        },
      );

      res.json({ success: true, messages });
    } catch (error) {
      console.error("Error getting conversation:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener conversación" });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const { studentId, message } = req.body;

      const newMessage = await Message.create({
        senderId: teacherId,
        receiverId: studentId,
        message: message,
        isRead: false,
      });

      await notificationHelper.createForUser(studentId, {
        title: "📩 Nuevo mensaje",
        message: `Tienes un nuevo mensaje de tu profesor`,
        type: "info",
        icon: "📩",
        link: "/messages",
      });

      res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al enviar mensaje" });
    }
  },

  markMessageAsRead: async (req, res) => {
    try {
      const { messageId } = req.params;
      const teacherId = req.user.id;

      await Message.update(
        { isRead: true },
        { where: { id: messageId, receiverId: teacherId } },
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al marcar mensaje" });
    }
  },

  // ==================== PERFIL ====================
  getProfile: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const teacher = await User.findByPk(teacherId, {
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "role",
          "status",
          "createdAt",
          "assignedLevel",
        ],
      });

      res.json({ success: true, profile: teacher });
    } catch (error) {
      console.error("Error getting profile:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener perfil" });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const { name, email, phone, bio, specialty, education, experience } =
        req.body;

      await User.update(
        { name, email, phone, bio, specialty, education, experience },
        { where: { id: teacherId } },
      );

      res.json({ success: true, message: "Perfil actualizado" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar perfil" });
    }
  },

  changePassword: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const bcrypt = require("bcryptjs");

      const teacher = await User.findByPk(teacherId);
      const isValid = await bcrypt.compare(currentPassword, teacher.password);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Contraseña actual incorrecta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        { password: hashedPassword },
        { where: { id: teacherId } },
      );

      res.json({ success: true, message: "Contraseña actualizada" });
    } catch (error) {
      console.error("Error changing password:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al cambiar contraseña" });
    }
  },

  getSchedule: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const schedule = await Schedule.findOne({
        where: { teacherId: teacherId },
      });
      res.json({ success: true, schedule: schedule?.schedule || [] });
    } catch (error) {
      console.error("Error getting schedule:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener horario" });
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const { schedule } = req.body;

      await Schedule.upsert({
        teacherId: teacherId,
        schedule: schedule,
        updatedAt: new Date(),
      });

      res.json({ success: true, message: "Horario actualizado" });
    } catch (error) {
      console.error("Error updating schedule:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar horario" });
    }
  },

  // ==================== TAREAS (ASSIGNMENTS) - Agregar al final del archivo ====================

  // Obtener todas las tareas del profesor
  // backend/controllers/teacherController.js - Modificar getAssignments

  getAssignments: async (req, res) => {
    try {
      const teacherId = req.user.id;

      const assignments = await Assignment.findAll({
        where: { teacherId: teacherId },
        include: [
          {
            model: AssignmentSubmission,
            as: "submissions",
            attributes: [
              "id",
              "studentId",
              "submitted",
              "grade",
              "submittedAt",
            ],
          },
        ],
        order: [["dueDate", "ASC"]],
      });

      // Calcular estadísticas por tarea
      const assignmentsWithStats = assignments.map((assignment) => {
        const totalAssigned = assignment.assignedStudentIds?.length || 0;
        const submittedCount =
          assignment.submissions?.filter((s) => s.submitted === true).length ||
          0;
        const gradedCount =
          assignment.submissions?.filter((s) => s.grade !== null).length || 0;

        return {
          ...assignment.toJSON(),
          totalAssigned,
          submittedCount,
          gradedCount,
          pendingCount: totalAssigned - submittedCount,
        };
      });

      res.json({ success: true, assignments: assignmentsWithStats });
    } catch (error) {
      console.error("Error getting assignments:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener tareas" });
    }
  },

  // Obtener una tarea específica
  getAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      res.json({ success: true, assignment });
    } catch (error) {
      console.error("Error getting assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener tarea" });
    }
  },

  // Crear tarea
  createAssignment: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const {
        title,
        description,
        instructions,
        level,
        dueDate,
        maxScore,
        type,
      } = req.body;

      const assignment = await Assignment.create({
        teacherId: teacherId,
        title: title,
        description: description || "",
        instructions: instructions || "",
        level: level || "A1",
        dueDate: dueDate,
        maxScore: maxScore || 100,
        type: type || "homework",
        active: true,
      });

      // Notificar a los alumnos
      const students = await User.findAll({ where: { role: "user" } });
      for (const student of students) {
        await notificationHelper.createForUser(student.id, {
          title: "📝 Nueva tarea asignada",
          message: `Tienes una nueva tarea: "${title}". Fecha límite: ${new Date(dueDate).toLocaleDateString()}`,
          type: "assignment",
          icon: "📝",
          link: "/assignments",
          relatedId: assignment.id,
          relatedType: "assignment",
        });
      }

      res.status(201).json({ success: true, assignment });
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ success: false, message: "Error al crear tarea" });
    }
  },

  // Actualizar tarea
  updateAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      await assignment.update(req.body);

      res.json({ success: true, assignment });
    } catch (error) {
      console.error("Error updating assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar tarea" });
    }
  },

  // Eliminar tarea
  deleteAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      await assignment.destroy();

      res.json({ success: true, message: "Tarea eliminada" });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar tarea" });
    }
  },

  // Calificar tarea
  gradeAssignment: async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { studentId, grade, feedback } = req.body;
      const teacherId = req.user.id;

      const assignment = await Assignment.findOne({
        where: { id: assignmentId, teacherId: teacherId },
      });

      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Tarea no encontrada" });
      }

      let submission = await AssignmentSubmission.findOne({
        where: { assignmentId, studentId },
      });

      if (!submission) {
        submission = await AssignmentSubmission.create({
          assignmentId,
          studentId,
          grade,
          feedback,
          submittedAt: new Date(),
        });
      } else {
        await submission.update({ grade, feedback });
      }

      res.json({ success: true, submission });
    } catch (error) {
      console.error("Error grading assignment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al calificar tarea" });
    }
  },

  // Obtener tareas pendientes de calificar
  getPendingAssignments: async (req, res) => {
    try {
      const teacherId = req.user.id;

      const assignments = await Assignment.findAll({
        where: { teacherId: teacherId },
      });

      res.json({ success: true, assignments });
    } catch (error) {
      console.error("Error getting pending assignments:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener tareas pendientes",
      });
    }
  },
};

module.exports = teacherController;
