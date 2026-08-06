// scripts/migrateCurriculum.js
const { Content, ModuleContent, User } = require('../models')
const fs = require('fs')
const path = require('path')

async function migrateCurriculum() {
  try {
    console.log('🚀 Iniciando migración del currículo A1...')

    // Obtener un teacherId válido (el primer profesor o admin)
    const teacher = await User.findOne({ 
      where: { role: ['admin', 'teacher'] },
      order: [['id', 'ASC']]
    })
    
    if (!teacher) {
      console.error('❌ No se encontró ningún profesor o administrador')
      process.exit(1)
    }
    
    console.log(`👨‍🏫 Usando teacherId: ${teacher.id} (${teacher.name})`)

    // Leer el archivo JSON
    const dataPath = path.join(__dirname, 'curriculumData.json')
    
    if (!fs.existsSync(dataPath)) {
      console.error('❌ No se encuentra el archivo curriculumData.json')
      process.exit(1)
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    
    const { level, modules } = data
    
    let moduleCount = 0
    let lessonCount = 0
    let relationCount = 0
    
    for (const moduleData of modules) {
      console.log(`\n📦 Procesando Módulo ${moduleData.id}: ${moduleData.title}`)
      
      // 1. Crear o actualizar el módulo en content
      const [moduleRecord, moduleCreated] = await Content.findOrCreate({
        where: { 
          title: moduleData.title, 
          type: 'module', 
          level: level 
        },
        defaults: {
          teacherId: teacher.id,
          title: moduleData.title,
          description: moduleData.description || '',
          type: 'module',
          level: level,
          order_in_module: moduleData.id,
          active: true
        }
      })
      
      if (moduleCreated) {
        console.log(`   ✅ Módulo creado: ${moduleRecord.title} (ID: ${moduleRecord.id})`)
      } else {
        console.log(`   ⏩ Módulo ya existe: ${moduleRecord.title}`)
      }
      moduleCount++
      
      // 2. Procesar cada lección del módulo
      for (let i = 0; i < moduleData.lessons.length; i++) {
        const lesson = moduleData.lessons[i]
        
        // Crear slug único
        const slug = lesson.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        
        // 3. Crear o actualizar la lección en content
        const [lessonRecord, lessonCreated] = await Content.findOrCreate({
          where: { 
            title: lesson.title, 
            type: 'lesson', 
            level: level 
          },
          defaults: {
            teacherId: teacher.id,
            title: lesson.title,
            slug: slug,
            description: lesson.sections?.[0]?.content?.substring(0, 200) || '',
            type: 'lesson',
            level: level,
            moduleId: moduleRecord.id,
            order_in_module: i + 1,
            sections: JSON.stringify(lesson.sections || []),
            questions: JSON.stringify(lesson.questions || []),
            tips: JSON.stringify(lesson.tips || []),
            lesson_type: lesson.type || 'explanation',
            active: true
          }
        })
        
        if (lessonCreated) {
          console.log(`      📖 Lección creada: ${lessonRecord.title} (ID: ${lessonRecord.id})`)
        } else {
          console.log(`      ⏩ Lección ya existe: ${lessonRecord.title}`)
          // Actualizar module_id y order_in_module si es necesario
          await lessonRecord.update({
            moduleId: moduleRecord.id,
            order_in_module: i + 1
          })
        }
        lessonCount++
        
        // 4. 👇 USANDO CAMELCASE (como está definido en el modelo) 👇
        const [association, assocCreated] = await ModuleContent.findOrCreate({
          where: { 
            moduleId: moduleRecord.id,      // ← camelCase
            contentId: lessonRecord.id,     // ← camelCase
            contentType: 'lesson'           // ← camelCase
          },
          defaults: {
            moduleId: moduleRecord.id,      // ← camelCase
            contentId: lessonRecord.id,     // ← camelCase
            contentType: 'lesson',          // ← camelCase
            order: i + 1,
            isRequired: true                // ← camelCase
          }
        })
        
        if (assocCreated) {
          console.log(`         🔗 Asociada al módulo ${moduleRecord.id} (module_content)`);
          relationCount++
        } else {
          console.log(`         🔗 Asociación ya existente`);
        }
      }
    }
    
    console.log('\n✅ Migración completada exitosamente!')
    console.log(`📊 Resumen:`)
    console.log(`   - Módulos procesados: ${moduleCount}`)
    console.log(`   - Lecciones procesadas: ${lessonCount}`)
    console.log(`   - Relaciones creadas: ${relationCount}`)
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error en la migración:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

// Ejecutar migración
migrateCurriculum()