// backend/models/index.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DB_URL) {
  // Configuración para PostgreSQL (Supabase)
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { underscored: true, freezeTableName: false },
  });
  console.log("📡 Usando base de datos Supabase (PostgreSQL)");
} else {
  // Configuración para MySQL (XAMPP/Hosting)
  sequelize = new Sequelize(
    process.env.DB_NAME || "easygo_academy",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      define: { underscored: true, freezeTableName: false, charset: "utf8mb4" },
    },
  );
  console.log("📡 Usando base de datos MySQL");
}

// Importar modelos
const UserModel = require("./User");
const LevelTestModel = require("./LevelTest");
const SessionModel = require("./Session");
const QuestionModel = require("./Question");
const LeadModel = require("./Lead");
const ProgressModel = require("./Progress");
const TestProgressModel = require("./TestProgress");
const AudiobookModel = require("./Audiobook");
const ListeningProgressModel = require("./ListeningProgress");
const PronunciationModel = require("./Pronunciation");
const NewsModel = require("./News");
const DictionaryModel = require("./Dictionary");
const ClassModel = require("./Class");
const ClassEnrollmentModel = require("./ClassEnrollment");
const GrammarTopicModel = require("./GrammarTopic");
const NotificationModel = require("./Notification");
const AssignmentModel = require("./Assignment");
const AssignmentSubmissionModel = require("./AssignmentSubmission");
const ContentModel = require("./Content");
const MessageModel = require("./Message");
const ScheduleModel = require("./Schedule");
const ModuleContentModel = require("./ModuleContent");
const PostModel = require('./Post')
const CommentModel = require('./Comment')
const PostLikeModel = require('./PostLike')

// Inicializar modelos
const User = UserModel(sequelize);
const LevelTest = LevelTestModel(sequelize);
const Session = SessionModel(sequelize);
const Question = QuestionModel(sequelize);
const Lead = LeadModel(sequelize);
const Progress = ProgressModel(sequelize);
const TestProgress = TestProgressModel(sequelize);
const Audiobook = AudiobookModel(sequelize);
const ListeningProgress = ListeningProgressModel(sequelize);
const Pronunciation = PronunciationModel(sequelize);
const News = NewsModel(sequelize);
const Dictionary = DictionaryModel(sequelize);
const Class = ClassModel(sequelize);
const ClassEnrollment = ClassEnrollmentModel(sequelize);
const GrammarTopic = GrammarTopicModel(sequelize);
const Notification = NotificationModel(sequelize);
const Assignment = AssignmentModel(sequelize);
const AssignmentSubmission = AssignmentSubmissionModel(sequelize);
const Content = ContentModel(sequelize);
const Message = MessageModel(sequelize);
const Schedule = ScheduleModel(sequelize);
const ModuleContent = ModuleContentModel(sequelize);
const Post = PostModel(sequelize)
const Comment = CommentModel(sequelize)
const PostLike = PostLikeModel(sequelize)

// ============ RELACIONES ============
User.hasMany(LevelTest, { foreignKey: "user_id", as: "levelTests", onDelete: "CASCADE" });
LevelTest.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Session, { foreignKey: "user_id", as: "sessions", onDelete: "CASCADE" });
Session.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Progress, { foreignKey: "user_id", as: "progress", onDelete: "CASCADE" });
Progress.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(TestProgress, { foreignKey: "user_id", as: "testProgress" });
TestProgress.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Audiobook, { foreignKey: "created_by", as: "createdAudiobooks" });
Audiobook.belongsTo(User, { foreignKey: "created_by", as: "creator" });
User.hasMany(ListeningProgress, { foreignKey: "user_id", as: "listeningProgress" });
ListeningProgress.belongsTo(User, { foreignKey: "user_id", as: "user" });
Audiobook.hasMany(ListeningProgress, { foreignKey: "audiobook_id", as: "listeningProgress" });
ListeningProgress.belongsTo(Audiobook, { foreignKey: "audiobook_id", as: "audiobook" });
User.hasMany(News, { foreignKey: "created_by", as: "createdNews" });
News.belongsTo(User, { foreignKey: "created_by", as: "creator" });
User.hasMany(Pronunciation, { foreignKey: "created_by", as: "createdPronunciations" });
Pronunciation.belongsTo(User, { foreignKey: "created_by", as: "creator" });
Class.hasMany(ClassEnrollment, { foreignKey: "class_id", as: "enrollments" });
ClassEnrollment.belongsTo(Class, { foreignKey: "class_id", as: "class" });
Class.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });
User.hasMany(Class, { foreignKey: "teacher_id", as: "taughtClasses" });
User.hasMany(ClassEnrollment, { foreignKey: "user_id", as: "enrollments" });
ClassEnrollment.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Notification, { foreignKey: "user_id", as: "notifications", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });
Assignment.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });
User.hasMany(Assignment, { foreignKey: "teacher_id", as: "assignments" });
Assignment.hasMany(AssignmentSubmission, { foreignKey: "assignment_id", as: "submissions" });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: "assignment_id", as: "assignment" });
AssignmentSubmission.belongsTo(User, { foreignKey: "student_id", as: "student" });
User.hasMany(AssignmentSubmission, { foreignKey: "student_id", as: "submissions" });
Content.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });
User.hasMany(Content, { foreignKey: "teacher_id", as: "content" });
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });
User.hasMany(Message, { foreignKey: "sender_id", as: "sentMessages" });
User.hasMany(Message, { foreignKey: "receiver_id", as: "receivedMessages" });
Schedule.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });
User.hasOne(Schedule, { foreignKey: "teacher_id", as: "schedule" });
Content.hasMany(ModuleContent, { foreignKey: "moduleId", as: "moduleContents", onDelete: "CASCADE" });
ModuleContent.belongsTo(Content, { foreignKey: "moduleId", as: "module" });
Content.hasMany(ModuleContent, { foreignKey: "contentId", as: "contentModules", onDelete: "CASCADE" });
ModuleContent.belongsTo(Content, { foreignKey: "contentId", as: "content" });
User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' })
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' })
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' })
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' })
Post.hasMany(PostLike, { foreignKey: 'postId', as: 'postLikes', onDelete: 'CASCADE' })
PostLike.belongsTo(Post, { foreignKey: 'postId', as: 'post' })
User.hasMany(PostLike, { foreignKey: 'userId', as: 'postLikesUser', onDelete: 'CASCADE' })
PostLike.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// ============ SINCRONIZACIÓN ==========
const syncDatabase = async (force = false) => {
  try {
    if (!process.env.DB_URL) {
      const sequelizeInit = new Sequelize("", process.env.DB_USER || "root", process.env.DB_PASSWORD || "", {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false,
      });
      const dbName = process.env.DB_NAME || "easygo_academy";
      await sequelizeInit.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await sequelizeInit.close();
    }

    await sequelize.authenticate();
    console.log("✅ Conexión a base de datos establecida");

    await sequelize.sync({ force });
    console.log("✅ Base de datos sincronizada");

    return true;
  } catch (error) {
    console.error("❌ Error en syncDatabase:", error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  User, LevelTest, Session, Question, Lead, Progress, TestProgress, Audiobook,
  ListeningProgress, Pronunciation, News, Dictionary, Class, ClassEnrollment,
  GrammarTopic, Notification, Assignment, AssignmentSubmission, Content,
  Message, Schedule, ModuleContent, Post, Comment, PostLike,
  syncDatabase,
};
