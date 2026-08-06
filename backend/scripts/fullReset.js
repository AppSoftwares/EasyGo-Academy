// scripts/fullReset.js
const fs = require("fs");
const path = require("path");
const { sequelize } = require("../models");

// Colores para console.log
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fullReset() {
  try {
    log("cyan", "\n🚨 INICIANDO RESET COMPLETO DE BASE DE DATOS");
    log("yellow", "⚠️  ESTO BORRARÁ TODOS LOS DATOS EXISTENTES\n");

    // Confirmación
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
      rl.question('¿Estás seguro? Escribe "SI" para continuar: ', resolve);
    });

    if (answer !== "SI") {
      log("red", "❌ Operación cancelada");
      rl.close();
      process.exit(0);
    }
    rl.close();

    // ========== 1. DESACTIVAR VERIFICACIÓN DE LLAVES FORÁNEAS ==========
    log("blue", "\n🔓 Desactivando verificaciones de llaves foráneas...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    log("green", "✅ Llaves foráneas desactivadas");

    // ========== 2. DETECTAR TODOS LOS MODELOS ==========
    log("blue", "\n📦 Detectando modelos...");

    const modelsPath = path.join(__dirname, "../models");
    const modelFiles = fs.readdirSync(modelsPath).filter((file) => {
      return (
        file !== "index.js" && file.endsWith(".js") && file !== "Ranking.js"
      );
    });

    log(
      "green",
      `✅ Encontrados ${modelFiles.length} modelos: ${modelFiles.map((f) => f.replace(".js", "")).join(", ")}`,
    );

    // Importar dinámicamente todos los modelos en orden inverso (primero los que tienen FK)
    const models = {};
    for (const file of modelFiles) {
      const modelName = file.replace(".js", "");
      const model = require(`../models/${file}`);
      if (typeof model === "function") {
        models[modelName] = model(sequelize);
      } else {
        models[modelName] = model;
      }
    }

    // ========== 3. ELIMINAR TABLAS EN ORDEN INVERSO ==========
    log("blue", "\n🗑️  Eliminando todas las tablas...");

    // Obtener todas las tablas
    const [tables] = await sequelize.query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    // Eliminar cada tabla
    for (const tableName of tableNames) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        log("yellow", `   🗑️ Eliminada: ${tableName}`);
      } catch (err) {
        log("red", `   ❌ Error eliminando ${tableName}: ${err.message}`);
      }
    }

    log("green", "\n✅ Todas las tablas eliminadas");

    // ========== 4. REACTIVAR LLAVES FORÁNEAS ==========
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    log("green", "🔒 Llaves foráneas reactivadas");

    // ========== 5. RECREAR TABLAS ==========
    log("blue", "\n📦 Recreando tablas desde los modelos...");

    // Sincronizar todas las tablas
    await sequelize.sync({ force: true });
    log("green", "✅ Todas las tablas recreadas exitosamente");

    // ========== 6. EJECUTAR TODOS LOS SEEDS ==========
    log("blue", "\n🌱 Ejecutando seeds...");

    const seedersPath = path.join(__dirname, "../seeders");

    if (!fs.existsSync(seedersPath)) {
      log("yellow", "⚠️ No existe carpeta seeders");
    } else {
      const seedFiles = fs
        .readdirSync(seedersPath)
        .filter((file) => file.endsWith(".js"));

      if (seedFiles.length === 0) {
        log("yellow", "⚠️ No hay archivos seed para ejecutar");
      } else {
        log(
          "green",
          `✅ Encontrados ${seedFiles.length} seeds: ${seedFiles.join(", ")}`,
        );

        // Orden específico para seeds (primero usuarios, luego dependencias)
        const seedOrder = ['seedUsers.js', 'seedQuestions.js', 'seedGrammar.js'];
        const orderedSeeds = [];

        for (const orderFile of seedOrder) {
          // ← Nunca entra aquí porque seedOrder está vacío
          if (seedFiles.includes(orderFile)) {
            orderedSeeds.push(orderFile);
          }
        }
        // Agregar el resto
        for (const file of seedFiles) {
          if (!seedOrder.includes(file)) {
            orderedSeeds.push(file); // ← Aquí agrega TODOS los seeds
          }
        }

        for (const seedFile of orderedSeeds) {
          log("cyan", `\n📝 Ejecutando seed: ${seedFile}...`);
          try {
            const seedPath = path.join(seedersPath, seedFile);
            const seedModule = require(seedPath);

            if (typeof seedModule === "function") {
              await seedModule();
            } else if (
              seedModule.seed &&
              typeof seedModule.seed === "function"
            ) {
              await seedModule.seed();
            } else if (typeof seedModule === "object" && seedModule.up) {
              await seedModule.up();
            } else {
              log("yellow", `   ⚠️ Formato de seed no reconocido: ${seedFile}`);
            }

            log("green", `   ✅ Seed completado: ${seedFile}`);
          } catch (err) {
            log("red", `   ❌ Error en seed ${seedFile}: ${err.message}`);
          }
        }
      }
    }

    // ========== 7. VERIFICAR DATOS CREADOS ==========
    log("blue", "\n📊 Verificando datos creados...");

    if (models.User) {
      const userCount = await models.User.count();
      log("green", `   👥 Usuarios: ${userCount}`);
    }

    if (models.Question) {
      const questionCount = await models.Question.count();
      log("green", `   📝 Preguntas: ${questionCount}`);
    }

    if (models.GrammarTopic) {
      const grammarCount = await models.GrammarTopic.count();
      log("green", `   📚 Temas de gramática: ${grammarCount}`);
    }

    if (models.Audiobook) {
      const audiobookCount = await models.Audiobook.count();
      log("green", `   🎧 Audiolibros: ${audiobookCount}`);
    }

    // ========== RESUMEN FINAL ==========
    log("cyan", "\n🎉 ¡RESET COMPLETADO EXITOSAMENTE!");
    log("green", "\n🔑 Credenciales de acceso:");
    log("green", "   Admin: admin@easygo.com / admin123");
    log("green", "   Profesor: teacher@easygo.com / teacher123");
    log("green", "   Estudiante: maria@email.com / 123456");

    process.exit(0);
  } catch (error) {
    log("red", `\n❌ Error durante el reset: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

fullReset();
