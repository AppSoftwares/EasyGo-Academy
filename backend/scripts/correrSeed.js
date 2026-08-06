const fs = require("fs");
const path = require("path");

async function runSeeds() {
  console.log("🌱 Iniciando ejecución de Seeds...");

  const seedersPath = path.join(__dirname, "../seeders"); // Ajusta la ruta si es necesario

  if (!fs.existsSync(seedersPath)) {
    console.error("❌ No existe la carpeta seeders");
    process.exit(1);
  }

  // Orden de ejecución específico
  const seedOrder = ['seedUsers.js', 'seedQuestions.js', 'seedGrammar.js'];
  
  // Obtener archivos de la carpeta
  const seedFiles = fs.readdirSync(seedersPath).filter((file) => file.endsWith(".js"));

  // Filtrar y ordenar
  const orderedSeeds = [
    ...seedOrder.filter(file => seedFiles.includes(file)),
    ...seedFiles.filter(file => !seedOrder.includes(file))
  ];

  for (const seedFile of orderedSeeds) {
    console.log(`\n📝 Ejecutando: ${seedFile}...`);
    try {
      const seedModule = require(path.join(seedersPath, seedFile));

      // Soporta diferentes tipos de exportación
      if (typeof seedModule === "function") {
        await seedModule();
      } else if (seedModule.seed && typeof seedModule.seed === "function") {
        await seedModule.seed();
      } else if (typeof seedModule === "object" && seedModule.up) {
        await seedModule.up();
      }
      
      console.log(`✅ Completado: ${seedFile}`);
    } catch (err) {
      console.error(`❌ Error en ${seedFile}:`, err.message);
    }
  }

  console.log("\n🚀 Todos los seeds ejecutados.");
  process.exit(0);
}

runSeeds();