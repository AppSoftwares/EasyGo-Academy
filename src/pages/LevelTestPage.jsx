import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export const LevelTestPage = () => {
  const navigate = useNavigate()
  const { user, saveLevelTestResult } = useAuthStore()
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [textAnswers, setTextAnswers] = useState({})

  // Estructura del examen por secciones y niveles
  const sections = [
    {
      id: 'A1',
      title: 'Nivel A1 - Identidad, Inventario y Accion',
      description: 'Verbo To Be, Posesivos, There is/are, Preposiciones, Can/Can not, Presente Continuo, Pasado Simple',
      questions: [
        // Ejercicio 1: Verb To Be
        { id: 'a1_1', type: 'fill', category: 'grammar', question: 'I ________ the painter. (Affirmative)', answer: 'am', points: 1 },
        { id: 'a1_2', type: 'fill', category: 'grammar', question: 'The tools ________ in the truck. (Negative)', answer: 'are not', points: 1, acceptAlso: ['aren\'t', 'arent'] },
        { id: 'a1_3', type: 'fill', category: 'grammar', question: 'She ________ the manager. (Affirmative)', answer: 'is', points: 1 },
        { id: 'a1_4', type: 'fill', category: 'grammar', question: 'We ________ ready for the job. (Negative)', answer: 'are not', points: 1, acceptAlso: ['aren\'t', 'arent'] },
        { id: 'a1_5', type: 'fill', category: 'grammar', question: 'It ________ a new drill. (Affirmative)', answer: 'is', points: 1 },
        
        // Ejercicio 2: Possessive Adjectives
        { id: 'a1_6', type: 'fill', category: 'grammar', question: 'I have a helmet. ________ helmet is yellow.', answer: 'My', points: 1 },
        { id: 'a1_7', type: 'fill', category: 'grammar', question: 'John has a truck. ________ truck is white.', answer: 'His', points: 1 },
        { id: 'a1_8', type: 'fill', category: 'grammar', question: 'Maria has an office. ________ office is big.', answer: 'Her', points: 1 },
        { id: 'a1_9', type: 'fill', category: 'grammar', question: 'We have a team. ________ team is professional.', answer: 'Our', points: 1 },
        { id: 'a1_10', type: 'fill', category: 'grammar', question: 'You have a permit. Where is ________ permit?', answer: 'your', points: 1 },
        
        // Ejercicio 3: There is/are
        { id: 'a1_11', type: 'fill', category: 'grammar', question: '________________ forklift in the warehouse.', answer: 'There is a', points: 1, acceptAlso: ['There is an', 'There is'] },
        { id: 'a1_12', type: 'fill', category: 'grammar', question: '________________ 50 bricks in the patio.', answer: 'There are', points: 1 },
        { id: 'a1_13', type: 'fill', category: 'grammar', question: '________________ emergency exit near the stairs.', answer: 'There is an', points: 1, acceptAlso: ['There is a', 'There is'] },
        { id: 'a1_14', type: 'fill', category: 'grammar', question: '________________ many workers in the building.', answer: 'There are', points: 1 },
        { id: 'a1_15', type: 'fill', category: 'grammar', question: '________________ extension cord in the box.', answer: 'There is an', points: 1, acceptAlso: ['There is a', 'There is'] },
        
        // Ejercicio 4: Prepositions
        { id: 'a1_16', type: 'multiple', category: 'vocabulary', question: 'The keys are ________ the table. (Sobre)', options: ['in', 'on', 'under', 'next to'], correct: 1, points: 1 },
        { id: 'a1_17', type: 'multiple', category: 'vocabulary', question: 'The hammer is ________ the toolbox. (Dentro)', options: ['in', 'on', 'under', 'next to'], correct: 0, points: 1 },
        { id: 'a1_18', type: 'multiple', category: 'vocabulary', question: 'The supervisor is ________ the truck. (Al lado)', options: ['in', 'on', 'under', 'next to'], correct: 3, points: 1 },
        { id: 'a1_19', type: 'multiple', category: 'vocabulary', question: 'The cables are ________ the floor. (Debajo de)', options: ['in', 'on', 'under', 'next to'], correct: 2, points: 1 },
        
        // Ejercicio 5: Frequency Adverbs
        { id: 'a1_20', type: 'fill', category: 'grammar', question: '(Always / I / wear / gloves) Ordena:', answer: 'I always wear gloves', points: 1, acceptAlso: ['I always wear gloves.'] },
        { id: 'a1_21', type: 'fill', category: 'grammar', question: '(is / late / He / never) Ordena:', answer: 'He is never late', points: 1, acceptAlso: ['He is never late.'] },
        { id: 'a1_22', type: 'fill', category: 'grammar', question: '(check / We / sometimes / the oil) Ordena:', answer: 'We sometimes check the oil', points: 1, acceptAlso: ['We sometimes check the oil.'] },
        
        // Ejercicio 6: Can/Can't
        { id: 'a1_23', type: 'fill', category: 'grammar', question: 'Yo puedo usar el taladro (Traduce):', answer: 'I can use the drill', points: 2, acceptAlso: ['I can use the drill.'] },
        { id: 'a1_24', type: 'fill', category: 'grammar', question: 'Ella no puede conducir el camion (Traduce):', answer: 'She cannot drive the truck', points: 2, acceptAlso: ['She can\'t drive the truck', 'She cant drive the truck', 'She cannot drive the truck.'] },
        { id: 'a1_25', type: 'fill', category: 'grammar', question: '¿Puedes ayudarme? (Traduce):', answer: 'Can you help me?', points: 2, acceptAlso: ['Can you help me'] },
        { id: 'a1_26', type: 'fill', category: 'grammar', question: 'Nosotros podemos empezar ahora (Traduce):', answer: 'We can start now', points: 2, acceptAlso: ['We can start now.'] },
        
        // Ejercicio 7: How much/many
        { id: 'a1_27', type: 'fill', category: 'grammar', question: '________ ________ sand do we need?', answer: 'How much', points: 1 },
        { id: 'a1_28', type: 'fill', category: 'grammar', question: '________ ________ screws are in the box?', answer: 'How many', points: 1 },
        { id: 'a1_29', type: 'fill', category: 'grammar', question: '________ ________ gallons of paint do you want?', answer: 'How many', points: 1 },
        { id: 'a1_30', type: 'fill', category: 'grammar', question: '________ ________ money is the total?', answer: 'How much', points: 1 },
        
        // Ejercicio 8: Present Continuous
        { id: 'a1_31', type: 'fill', category: 'grammar', question: 'I (work) ________________ in the roof.', answer: 'am working', points: 1 },
        { id: 'a1_32', type: 'fill', category: 'grammar', question: 'They (not / clean) ________________ the kitchen.', answer: 'are not cleaning', points: 1, acceptAlso: ['aren\'t cleaning', 'arent cleaning'] },
        { id: 'a1_33', type: 'fill', category: 'grammar', question: 'Is he (repair) ________________ the AC?', answer: 'repairing', points: 1 },
        { id: 'a1_34', type: 'fill', category: 'grammar', question: 'We (drive) ________________ to the job site.', answer: 'are driving', points: 1 },
        
        // Ejercicio 9: Past Simple Was/Were
        { id: 'a1_35', type: 'fill', category: 'grammar', question: 'I ________ at the office yesterday.', answer: 'was', points: 1 },
        { id: 'a1_36', type: 'fill', category: 'grammar', question: 'The materials ________ not ready.', answer: 'were', points: 1 },
        { id: 'a1_37', type: 'fill', category: 'grammar', question: 'Where ________ you at 10:00 AM?', answer: 'were', points: 1 },
        { id: 'a1_38', type: 'fill', category: 'grammar', question: 'The project ________ very difficult.', answer: 'was', points: 1 },
        
        // Ejercicio 10: Regular Verbs -ed
        { id: 'a1_39', type: 'fill', category: 'grammar', question: 'Yesterday I ____________ the door. (fix)', answer: 'fixed', points: 1 },
        { id: 'a1_40', type: 'fill', category: 'grammar', question: 'Yesterday we ____________ the wall. (finish)', answer: 'finished', points: 1 },
        { id: 'a1_41', type: 'fill', category: 'grammar', question: 'Yesterday she ____________ the client. (call)', answer: 'called', points: 1 },
        
        // Reading A1
        { id: 'a1_42', type: 'multiple', category: 'reading', question: 'DAILY REPORT: "Yesterday was Monday. I arrived at the job site at 7:30 AM..." The worker arrived at 8:00 AM.', options: ['True', 'False'], correct: 1, points: 2 },
        { id: 'a1_43', type: 'multiple', category: 'reading', question: 'Mr. Smith is the supervisor.', options: ['True', 'False'], correct: 0, points: 2 },
        { id: 'a1_44', type: 'multiple', category: 'reading', question: 'They repaired a fence.', options: ['True', 'False'], correct: 0, points: 2 },
        { id: 'a1_45', type: 'multiple', category: 'reading', question: 'There were 5 helpers.', options: ['True', 'False'], correct: 1, points: 2 },
        { id: 'a1_46', type: 'multiple', category: 'reading', question: 'The crane was working perfectly.', options: ['True', 'False'], correct: 1, points: 2 }
      ]
    },
    {
      id: 'A2',
      title: 'Nivel A2 - Acciones, Comparaciones y Pasado Complejo',
      description: 'Presente Simple vs Continuo, Comparativos, Superlativos, Pasado Irregular, Direcciones',
      questions: [
        // Ejercicio 1: Present Simple vs Continuous
        { id: 'a2_1', type: 'multiple', category: 'grammar', question: 'I (work / am working) ________________ right now, call me later.', options: ['work', 'am working'], correct: 1, points: 1 },
        { id: 'a2_2', type: 'multiple', category: 'grammar', question: 'He (drives / is driving) ________________ the truck every Monday.', options: ['drives', 'is driving'], correct: 0, points: 1 },
        { id: 'a2_3', type: 'multiple', category: 'grammar', question: 'Look! The supervisor (comes / is coming) ________________ to the site.', options: ['comes', 'is coming'], correct: 1, points: 1 },
        { id: 'a2_4', type: 'multiple', category: 'grammar', question: 'We usually (clean / are cleaning) ________________ the tools at 5:00 PM.', options: ['clean', 'are cleaning'], correct: 0, points: 1 },
        { id: 'a2_5', type: 'multiple', category: 'grammar', question: 'They (repair / are repairing) ________________ the roof at this moment.', options: ['repair', 'are repairing'], correct: 1, points: 1 },
        
        // Ejercicio 2: Live Reports
        { id: 'a2_6', type: 'fill', category: 'writing', question: '"No puedo hablar, estoy instalando los cables" (Traduce):', answer: 'I cannot talk, I am installing the cables', points: 2, acceptAlso: ['I can\'t talk, I\'m installing the cables', 'I cant talk, I am installing the cables'] },
        { id: 'a2_7', type: 'fill', category: 'writing', question: '"¿Qué está haciendo el equipo ahora?" (Traduce):', answer: 'What is the team doing now?', points: 2, acceptAlso: ['What are the team doing now?'] },
        { id: 'a2_8', type: 'fill', category: 'writing', question: '"Ellos no están usando el casco" (Traduce):', answer: 'They are not using the helmet', points: 2, acceptAlso: ['They aren\'t using the helmet', 'They are not wearing the helmet'] },
        
        // Ejercicio 3: Comparatives
        { id: 'a2_9', type: 'fill', category: 'grammar', question: 'Steel is ________________ (strong) than aluminum.', answer: 'stronger', points: 1 },
        { id: 'a2_10', type: 'fill', category: 'grammar', question: 'This project is ________________ (expensive) than the last one.', answer: 'more expensive', points: 1 },
        { id: 'a2_11', type: 'fill', category: 'grammar', question: 'The new ladder is ________________ (safe) than the old one.', answer: 'safer', points: 1 },
        { id: 'a2_12', type: 'fill', category: 'grammar', question: 'Working in the morning is ________________ (good) than the night shift.', answer: 'better', points: 1 },
        
        // Ejercicio 4: Superlatives
        { id: 'a2_13', type: 'fill', category: 'grammar', question: 'This is the ________________ (important) safety rule.', answer: 'most important', points: 1 },
        { id: 'a2_14', type: 'fill', category: 'grammar', question: 'He is the ________________ (fast) painter in the company.', answer: 'fastest', points: 1 },
        { id: 'a2_15', type: 'fill', category: 'grammar', question: 'What is the ________________ (cheap) material in the store?', answer: 'cheapest', points: 1 },
        { id: 'a2_16', type: 'fill', category: 'grammar', question: 'This was the ________________ (difficult) task of the week.', answer: 'most difficult', points: 1 },
        
        // Ejercicio 5: Irregular Verbs
        { id: 'a2_17', type: 'fill', category: 'grammar', question: 'Go -> ________ (Past)', answer: 'went', points: 1 },
        { id: 'a2_18', type: 'fill', category: 'grammar', question: 'Buy -> ________ (Past)', answer: 'bought', points: 1 },
        { id: 'a2_19', type: 'fill', category: 'grammar', question: 'See -> ________ (Past)', answer: 'saw', points: 1 },
        { id: 'a2_20', type: 'fill', category: 'grammar', question: 'Take -> ________ (Past)', answer: 'took', points: 1 },
        { id: 'a2_21', type: 'fill', category: 'grammar', question: 'Speak -> ________ (Past)', answer: 'spoke', points: 1 },
        
        // Reading A2
        { id: 'a2_22', type: 'multiple', category: 'reading', question: 'CASE: Floor options. Which option is better for a high-traffic area?', options: ['Wood (Option A)', 'Tile (Option B)'], correct: 1, points: 3 },
        { id: 'a2_23', type: 'fill', category: 'reading', question: 'Why is Option B better? (Reason 1):', answer: 'easier to clean', points: 2, acceptAlso: ['more durable', 'stronger', 'it is easier to clean', 'it is stronger'] },
        { id: 'a2_24', type: 'fill', category: 'reading', question: 'If the client has a very small budget, which one?', answer: 'Wood', points: 1, acceptAlso: ['Option A', 'wood'] },
        
        // Commands
        { id: 'a2_25', type: 'fill', category: 'writing', question: '"Gira a la izquierda en la señal de stop" (Traduce):', answer: 'Turn left at the stop sign', points: 2, acceptAlso: ['Turn left at the stop sign.'] },
        { id: 'a2_26', type: 'fill', category: 'writing', question: '"Sube la escalera con cuidado" (Traduce):', answer: 'Go up the ladder carefully', points: 2, acceptAlso: ['Climb the ladder carefully', 'Go up the ladder with care'] },
        { id: 'a2_27', type: 'fill', category: 'writing', question: '"Pon las cajas detrás del camión" (Traduce):', answer: 'Put the boxes behind the truck', points: 2, acceptAlso: ['Put the boxes behind the truck.'] }
      ]
    },
    {
      id: 'B1',
      title: 'Nivel B1 - Experiencia, Obligacion y Futuro',
      description: 'Present Perfect, Modals, Will vs Going to, First Conditional',
      questions: [
        // Ejercicio 1: Present Perfect
        { id: 'b1_1', type: 'fill', category: 'grammar', question: 'I ____________ (work) in construction for 10 years.', answer: 'have worked', points: 2 },
        { id: 'b1_2', type: 'fill', category: 'grammar', question: 'The company ____________ (buy) three new trucks this year.', answer: 'has bought', points: 2 },
        { id: 'b1_3', type: 'fill', category: 'grammar', question: '____________ you ____________ (see) the new safety regulations?', answer: 'Have seen', points: 2, acceptAlso: ['Have you seen'] },
        { id: 'b1_4', type: 'fill', category: 'grammar', question: 'We ____________ not ____________ (finish) the inspection yet.', answer: 'have finished', points: 2, acceptAlso: ['have not finished'] },
        { id: 'b1_5', type: 'fill', category: 'grammar', question: 'He ____________ (be) the supervisor since January.', answer: 'has been', points: 2 },
        
        // For vs Since
        { id: 'b1_6', type: 'multiple', category: 'grammar', question: 'I have lived in the US ________ 2015.', options: ['for', 'since'], correct: 1, points: 1 },
        { id: 'b1_7', type: 'multiple', category: 'grammar', question: 'We have used this machine ________ six months.', options: ['for', 'since'], correct: 0, points: 1 },
        
        // Modals
        { id: 'b1_8', type: 'multiple', category: 'grammar', question: 'You __________ wear a harness when working on the roof. (Obligacion fuerte)', options: ['must', 'should', 'can\'t'], correct: 0, points: 1 },
        { id: 'b1_9', type: 'multiple', category: 'grammar', question: 'You __________ use this tool; it is broken. (Prohibicion)', options: ['must', 'should', 'can\'t'], correct: 2, points: 1 },
        { id: 'b1_10', type: 'multiple', category: 'grammar', question: 'I think we __________ buy more cement today. (Recomendacion)', options: ['must', 'should', 'can\'t'], correct: 1, points: 1 },
        
        // Will vs Going to
        { id: 'b1_11', type: 'fill', category: 'grammar', question: 'Next Monday, we ________________ (start) the new project. (Plan)', answer: 'are going to start', points: 2, acceptAlso: ['are going to start'] },
        { id: 'b1_12', type: 'fill', category: 'grammar', question: 'Don\'t worry, I ________________ (call) the client right now. (Promesa)', answer: 'will call', points: 2 },
        
        // First Conditional
        { id: 'b1_13', type: 'fill', category: 'grammar', question: 'If we ________ (finish) early, we ________ (go) home at 3:00.', answer: 'finish will go', points: 3, acceptAlso: ['finish, will go'] },
        
        // Reading B1
        { id: 'b1_14', type: 'fill', category: 'reading', question: 'EMAIL: ¿Cual es la queja principal del cliente?', answer: 'the roof is not finished', points: 3, acceptAlso: ['progress is slow', 'the roof is not done', 'lack of progress'] }
      ]
    },
    {
      id: 'B2',
      title: 'Nivel B2 - Lenguaje Corporativo y Negociacion',
      description: 'Voz Pasiva, Second/Third Conditional, Reported Speech, Phrasal Verbs',
      questions: [
        // Passive Voice
        { id: 'b2_1', type: 'fill', category: 'grammar', question: 'The inspector approved the permits. (Passive): The permits ________________.', answer: 'were approved by the inspector', points: 3, acceptAlso: ['were approved'] },
        { id: 'b2_2', type: 'fill', category: 'grammar', question: 'We are renovating the main lobby. (Passive): The main lobby ________________.', answer: 'is being renovated', points: 3 },
        
        // Second Conditional
        { id: 'b2_3', type: 'fill', category: 'grammar', question: 'If we ________ (have) a bigger budget, we ________ (hire) more staff.', answer: 'had would hire', points: 3, acceptAlso: ['had, would hire'] },
        
        // Reported Speech
        { id: 'b2_4', type: 'fill', category: 'grammar', question: 'He said: "I want the report by Friday." -> He said that ________________.', answer: 'he wanted the report by Friday', points: 3, acceptAlso: ['he wanted the report by Friday.'] },
        
        // Linking Words
        { id: 'b2_5', type: 'multiple', category: 'grammar', question: 'The project was delayed __________ the heavy rain.', options: ['However', 'due to', 'Therefore', 'Although'], correct: 1, points: 2 },
        { id: 'b2_6', type: 'multiple', category: 'grammar', question: 'Our prices are high. __________, our quality is the best.', options: ['However', 'due to', 'Therefore', 'Although'], correct: 0, points: 2 },
        
        // Phrasal Verbs
        { id: 'b2_7', type: 'fill', category: 'vocabulary', question: 'Deal with (Traduce):', answer: 'lidiar con', points: 2, acceptAlso: ['encargarse de', 'manejar'] },
        { id: 'b2_8', type: 'fill', category: 'vocabulary', question: 'Carry out (Traduce):', answer: 'llevar a cabo', points: 2, acceptAlso: ['realizar', 'ejecutar'] }
      ]
    }
  ]

  const allQuestions = sections.flatMap(s => s.questions)
  const currentQ = allQuestions[currentQuestion]
  const totalQuestions = allQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleTextAnswer = (questionId, value) => {
    setTextAnswers({ ...textAnswers, [questionId]: value })
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const checkAnswer = (question, userAnswer) => {
    if (!userAnswer) return false
    const cleanAnswer = userAnswer.trim().toLowerCase()
    const correctAnswer = question.answer.toLowerCase()
    
    if (cleanAnswer === correctAnswer) return true
    
    if (question.acceptAlso) {
      return question.acceptAlso.some(alt => cleanAnswer === alt.toLowerCase())
    }
    
    return false
  }

  const calculateResults = () => {
    let totalPoints = 0
    let earnedPoints = 0
    const categoryScores = {}
    const levelScores = {}

    allQuestions.forEach(q => {
      totalPoints += q.points
      
      // Inicializar categorías
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { earned: 0, total: 0 }
      }
      categoryScores[q.category].total += q.points

      // Determinar nivel de la pregunta
      const section = sections.find(s => s.questions.includes(q))
      const level = section?.id || 'A1'
      if (!levelScores[level]) {
        levelScores[level] = { earned: 0, total: 0 }
      }
      levelScores[level].total += q.points

      // Verificar respuesta
      let isCorrect = false
      if (q.type === 'multiple') {
        isCorrect = answers[q.id] === q.correct
      } else {
        isCorrect = checkAnswer(q, textAnswers[q.id])
      }

      if (isCorrect) {
        earnedPoints += q.points
        categoryScores[q.category].earned += q.points
        levelScores[level].earned += q.points
      }
    })

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0

    // Determinar nivel recomendado
    let recommendedLevel = 'A1'
    if (percentage >= 85) recommendedLevel = 'C1'
    else if (percentage >= 70) recommendedLevel = 'B2'
    else if (percentage >= 55) recommendedLevel = 'B1'
    else if (percentage >= 35) recommendedLevel = 'A2'

    return {
      totalPoints,
      earnedPoints,
      percentage: percentage.toFixed(1),
      recommendedLevel,
      categoryScores,
      levelScores,
      totalQuestions,
      answeredQuestions: Object.keys(answers).length + Object.keys(textAnswers).length
    }
  }

  const handleSubmit = () => {
    const unanswered = totalQuestions - (Object.keys(answers).length + Object.keys(textAnswers).length)
    if (unanswered > 20) {
      const confirm = window.confirm(`Te faltan ${unanswered} preguntas. ¿Continuar?`)
      if (!confirm) return
    }

    const results = calculateResults()
    saveLevelTestResult({
      ...results,
      date: new Date().toISOString(),
      answers: { ...answers, ...textAnswers }
    })
    setShowResults(true)
  }

  // Vista de resultados
  if (showResults) {
    const results = calculateResults()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-primary to-primary-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">
              {results.percentage >= 70 ? '🎉' : results.percentage >= 40 ? '👍' : '💪'}
            </span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">¡Examen Completado!</h2>
            <p className="text-gray-600">{user?.name}, estos son tus resultados</p>
          </div>

          <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl text-center mb-6">
            <p className="text-lg mb-2">Tu nivel recomendado es:</p>
            <p className="text-5xl font-black">{results.recommendedLevel}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black text-primary">{results.earnedPoints}/{results.totalPoints}</p>
              <p className="text-sm text-gray-600">Puntuacion</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black text-accent">{results.percentage}%</p>
              <p className="text-sm text-gray-600">Porcentaje</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-bold text-gray-900">Resultados por nivel:</h4>
            {Object.entries(results.levelScores).map(([level, scores]) => (
              <div key={level} className="flex items-center gap-3">
                <span className="w-10 text-sm font-bold text-gray-700">{level}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${scores.total > 0 && (scores.earned / scores.total) >= 0.7 ? 'bg-green-500' : scores.total > 0 && (scores.earned / scores.total) >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${scores.total > 0 ? (scores.earned / scores.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{scores.earned}/{scores.total}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <p className="text-sm text-blue-800">
              📋 Tus resultados han sido guardados. Un profesor los revisara y te asignara el nivel adecuado.
            </p>
          </div>

          <button onClick={() => navigate('/dashboard')} className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg transition-all">
            Ir a mi Dashboard 🚀
          </button>
        </div>
      </div>
    )
  }

  // Vista de pregunta
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-primary to-primary-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">📝</span>
          <h2 className="text-2xl font-black text-gray-900">Examen de Nivelacion EasyGo Academy</h2>
          <p className="text-gray-600 text-sm mt-1">Niveles A1 al B2</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
            {currentQ.category.toUpperCase()} • {currentQ.type === 'multiple' ? 'Seleccion' : 'Completar'}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-4">{currentQ.question}</h3>

          {currentQ.type === 'multiple' ? (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    answers[currentQ.id] === index
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={textAnswers[currentQ.id] || ''}
              onChange={(e) => handleTextAnswer(currentQ.id, e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              placeholder="Escribe tu respuesta..."
            />
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold disabled:opacity-50">
            ← Anterior
          </button>
          {currentQuestion === totalQuestions - 1 ? (
            <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-bold hover:shadow-lg">
              Finalizar Examen ✓
            </button>
          ) : (
            <button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold">
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}