import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";

export const ExpressionsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedExpression, setSelectedExpression] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", label: "Todas", icon: "📚", count: 0 },
    { id: "greetings", label: "Saludos", icon: "👋", count: 0 },
    { id: "work", label: "Trabajo", icon: "💼", count: 0 },
    { id: "daily", label: "Vida diaria", icon: "🏠", count: 0 },
    { id: "shopping", label: "Compras", icon: "🛒", count: 0 },
    { id: "emergency", label: "Emergencias", icon: "🚨", count: 0 },
    { id: "phone", label: "Teléfono", icon: "📞", count: 0 },
    { id: "medical", label: "Médico", icon: "🏥", count: 0 },
    { id: "restaurant", label: "Restaurante", icon: "🍽️", count: 0 },
    { id: "travel", label: "Viajes", icon: "✈️", count: 0 },
    { id: "interviews", label: "Entrevistas", icon: "🎯", count: 0 },
    { id: "smalltalk", label: "Conversación casual", icon: "💬", count: 0 },
    { id: "idioms", label: "Modismos (Idioms)", icon: "🎭", count: 0 },
    { id: "slang", label: "Jerga (Slang)", icon: "😎", count: 0 },
  ];

  const allExpressions = [
    // ==================== SALUDOS ====================
    {
      id: 1,
      english: "Hello, how are you?",
      spanish: "Hola, ¿cómo estás?",
      pronunciation: "jelou, jau ar iu?",
      category: "greetings",
      context: "Saludo formal e informal",
    },
    {
      id: 2,
      english: "Good morning!",
      spanish: "¡Buenos días!",
      pronunciation: "gud morning",
      category: "greetings",
      context: "Saludo matutino",
    },
    {
      id: 3,
      english: "Good afternoon!",
      spanish: "¡Buenas tardes!",
      pronunciation: "gud afternun",
      category: "greetings",
      context: "Saludo vespertino",
    },
    {
      id: 4,
      english: "Good evening!",
      spanish: "¡Buenas noches! (al llegar)",
      pronunciation: "gud ivning",
      category: "greetings",
      context: "Saludo nocturno",
    },
    {
      id: 5,
      english: "Good night!",
      spanish: "¡Buenas noches! (al despedirse)",
      pronunciation: "gud nait",
      category: "greetings",
      context: "Despedida nocturna",
    },
    {
      id: 6,
      english: "Nice to meet you.",
      spanish: "Mucho gusto.",
      pronunciation: "nais tu mit iu",
      category: "greetings",
      context: "Al conocer a alguien",
    },
    {
      id: 7,
      english: "Pleased to meet you.",
      spanish: "Encantado de conocerte.",
      pronunciation: "plisd tu mit iu",
      category: "greetings",
      context: "Formal",
    },
    {
      id: 8,
      english: "How have you been?",
      spanish: "¿Cómo has estado?",
      pronunciation: "jau jav iu bin?",
      category: "greetings",
      context: "A alguien que no ves hace tiempo",
    },
    {
      id: 9,
      english: "Long time no see!",
      spanish: "¡Cuánto tiempo sin verte!",
      pronunciation: "long taim no si",
      category: "greetings",
      context: "Informal",
    },
    {
      id: 10,
      english: "What's up?",
      spanish: "¿Qué tal? / ¿Qué onda?",
      pronunciation: "wats ap",
      category: "greetings",
      context: "Muy informal",
    },
    {
      id: 11,
      english: "See you later!",
      spanish: "¡Hasta luego!",
      pronunciation: "si iu leiter",
      category: "greetings",
      context: "Despedida",
    },
    {
      id: 12,
      english: "Take care!",
      spanish: "¡Cuídate!",
      pronunciation: "teik ker",
      category: "greetings",
      context: "Despedida",
    },
    {
      id: 13,
      english: "Have a nice day!",
      spanish: "¡Que tengas un buen día!",
      pronunciation: "jav a nais dei",
      category: "greetings",
      context: "Despedida amable",
    },

    // ==================== TRABAJO ====================
    {
      id: 20,
      english: "I need to finish this report.",
      spanish: "Necesito terminar este informe.",
      pronunciation: "ai nid tu finich dis riport",
      category: "work",
      context: "Oficina",
    },
    {
      id: 21,
      english: "Can I help you with that?",
      spanish: "¿Puedo ayudarte con eso?",
      pronunciation: "can ai jelp iu wid dat?",
      category: "work",
      context: "Ofrecimiento",
    },
    {
      id: 22,
      english: "I have a meeting at 3 PM.",
      spanish: "Tengo una reunión a las 3 PM.",
      pronunciation: "ai jav a miting at zri pi em",
      category: "work",
      context: "Agenda",
    },
    {
      id: 23,
      english: "What's the deadline?",
      spanish: "¿Cuál es la fecha límite?",
      pronunciation: "wats de dedlain?",
      category: "work",
      context: "Proyectos",
    },
    {
      id: 24,
      english: "I'll get back to you.",
      spanish: "Te responderé luego.",
      pronunciation: "ail get bak tu iu",
      category: "work",
      context: "Seguimiento",
    },
    {
      id: 25,
      english: "Let me check my schedule.",
      spanish: "Déjame revisar mi agenda.",
      pronunciation: "let mi chek mai ske-yul",
      category: "work",
      context: "Planificación",
    },
    {
      id: 26,
      english: "Could you send me the file?",
      spanish: "¿Podrías enviarme el archivo?",
      pronunciation: "kud iu send mi de fail?",
      category: "work",
      context: "Petición",
    },
    {
      id: 27,
      english: "I work in construction.",
      spanish: "Trabajo en construcción.",
      pronunciation: "ai work in constrakshon",
      category: "work",
      context: "Presentación",
    },
    {
      id: 28,
      english: "I'm in charge of this project.",
      spanish: "Estoy a cargo de este proyecto.",
      pronunciation: "aim in charg ov dis proyekt",
      category: "work",
      context: "Responsabilidad",
    },
    {
      id: 29,
      english: "We need to hire more people.",
      spanish: "Necesitamos contratar más gente.",
      pronunciation: "wi nid tu jair mor pipol",
      category: "work",
      context: "Recursos humanos",
    },
    {
      id: 30,
      english: "The client is not happy.",
      spanish: "El cliente no está contento.",
      pronunciation: "de claient is not japi",
      category: "work",
      context: "Clientes",
    },

    // ==================== VIDA DIARIA ====================
    {
      id: 40,
      english: "What time is it?",
      spanish: "¿Qué hora es?",
      pronunciation: "wat taim is it?",
      category: "daily",
      context: "Hora",
    },
    {
      id: 41,
      english: "I'm running late.",
      spanish: "Voy tarde.",
      pronunciation: "aim roning leit",
      category: "daily",
      context: "Puntualidad",
    },
    {
      id: 42,
      english: "Where is the bathroom?",
      spanish: "¿Dónde está el baño?",
      pronunciation: "wer is de bazrum?",
      category: "daily",
      context: "Ubicación",
    },
    {
      id: 43,
      english: "I need to go to the bank.",
      spanish: "Necesito ir al banco.",
      pronunciation: "ai nid tu go tu de bank",
      category: "daily",
      context: "Trámites",
    },
    {
      id: 44,
      english: "Can you give me a ride?",
      spanish: "¿Me puedes dar un aventón?",
      pronunciation: "can iu giv mi a raid?",
      category: "daily",
      context: "Transporte",
    },
    {
      id: 45,
      english: "I'm going to the supermarket.",
      spanish: "Voy al supermercado.",
      pronunciation: "aim going tu de supermarkit",
      category: "daily",
      context: "Compras",
    },
    {
      id: 46,
      english: "Don't forget your keys.",
      spanish: "No olvides tus llaves.",
      pronunciation: "dont forget iur kis",
      category: "daily",
      context: "Recordatorio",
    },
    {
      id: 47,
      english: "I'll be right back.",
      spanish: "Ya regreso.",
      pronunciation: "ail bi rait bak",
      category: "daily",
      context: "Salida breve",
    },
    {
      id: 48,
      english: "It's on the table.",
      spanish: "Está en la mesa.",
      pronunciation: "its on de teibol",
      category: "daily",
      context: "Ubicación",
    },
    {
      id: 49,
      english: "Turn off the lights, please.",
      spanish: "Apaga las luces, por favor.",
      pronunciation: "turn of de laits, plis",
      category: "daily",
      context: "Petición",
    },

    // ==================== COMPRAS ====================
    {
      id: 60,
      english: "How much does it cost?",
      spanish: "¿Cuánto cuesta?",
      pronunciation: "jau mach das it cost?",
      category: "shopping",
      context: "Precio",
    },
    {
      id: 61,
      english: "Do you have this in a larger size?",
      spanish: "¿Tiene esto en una talla más grande?",
      pronunciation: "du iu jav dis in a larcher sais?",
      category: "shopping",
      context: "Tallas",
    },
    {
      id: 62,
      english: "I'm just looking, thank you.",
      spanish: "Solo estoy mirando, gracias.",
      pronunciation: "aim yast luking, zank iu",
      category: "shopping",
      context: "Sin ayuda",
    },
    {
      id: 63,
      english: "Can I pay with a credit card?",
      spanish: "¿Puedo pagar con tarjeta de crédito?",
      pronunciation: "can ai pei wid a credit card?",
      category: "shopping",
      context: "Pago",
    },
    {
      id: 64,
      english: "Where is the fitting room?",
      spanish: "¿Dónde está el probador?",
      pronunciation: "wer is de fiting rum?",
      category: "shopping",
      context: "Probador",
    },
    {
      id: 65,
      english: "Do you have any discounts?",
      spanish: "¿Tienen descuentos?",
      pronunciation: "du iu jav eni discounts?",
      category: "shopping",
      context: "Ofertas",
    },
    {
      id: 66,
      english: "I'd like to return this.",
      spanish: "Quisiera devolver esto.",
      pronunciation: "aid laik tu ritern dis",
      category: "shopping",
      context: "Devolución",
    },
    {
      id: 67,
      english: "Can I have the receipt?",
      spanish: "¿Me puede dar el recibo?",
      pronunciation: "can ai jav de risit?",
      category: "shopping",
      context: "Comprobante",
    },

    // ==================== EMERGENCIAS ====================
    {
      id: 80,
      english: "Help!",
      spanish: "¡Ayuda!",
      pronunciation: "jelp!",
      category: "emergency",
      context: "Urgencia",
    },
    {
      id: 81,
      english: "Call 911!",
      spanish: "¡Llama al 911!",
      pronunciation: "col nain wuan wuan!",
      category: "emergency",
      context: "Emergencia",
    },
    {
      id: 82,
      english: "I need a doctor.",
      spanish: "Necesito un doctor.",
      pronunciation: "ai nid a doctor",
      category: "emergency",
      context: "Médico",
    },
    {
      id: 83,
      english: "There's been an accident.",
      spanish: "Ha habido un accidente.",
      pronunciation: "ders bin an aksident",
      category: "emergency",
      context: "Accidente",
    },
    {
      id: 84,
      english: "Where is the nearest hospital?",
      spanish: "¿Dónde está el hospital más cercano?",
      pronunciation: "wer is de nirist jospital?",
      category: "emergency",
      context: "Hospital",
    },
    {
      id: 85,
      english: "I'm lost.",
      spanish: "Estoy perdido/a.",
      pronunciation: "aim lost",
      category: "emergency",
      context: "Orientación",
    },
    {
      id: 86,
      english: "Fire!",
      spanish: "¡Fuego!",
      pronunciation: "fair!",
      category: "emergency",
      context: "Incendio",
    },
    {
      id: 87,
      english: "Please hurry!",
      spanish: "¡Por favor, apúrate!",
      pronunciation: "plis jari!",
      category: "emergency",
      context: "Urgencia",
    },

    // ==================== TELÉFONO ====================
    {
      id: 100,
      english: "Hello, this is [name] speaking.",
      spanish: "Hola, habla [nombre].",
      pronunciation: "jelou, dis is [name] spiking",
      category: "phone",
      context: "Presentación",
    },
    {
      id: 101,
      english: "May I speak to [name]?",
      spanish: "¿Puedo hablar con [nombre]?",
      pronunciation: "mei ai spik tu [name]?",
      category: "phone",
      context: "Llamada",
    },
    {
      id: 102,
      english: "Hold on a moment, please.",
      spanish: "Espere un momento, por favor.",
      pronunciation: "jold on a moment, plis",
      category: "phone",
      context: "Espera",
    },
    {
      id: 103,
      english: "I'll call you back.",
      spanish: "Te devuelvo la llamada.",
      pronunciation: "ail col iu bak",
      category: "phone",
      context: "Devolver llamada",
    },
    {
      id: 104,
      english: "Can you hear me?",
      spanish: "¿Me escuchas?",
      pronunciation: "can iu jir mi?",
      category: "phone",
      context: "Audio",
    },
    {
      id: 105,
      english: "The signal is bad.",
      spanish: "La señal está mala.",
      pronunciation: "de signal is bad",
      category: "phone",
      context: "Cobertura",
    },
    {
      id: 106,
      english: "Can I leave a message?",
      spanish: "¿Puedo dejar un mensaje?",
      pronunciation: "can ai liv a mesey?",
      category: "phone",
      context: "Mensaje",
    },
    {
      id: 107,
      english: "Sorry, wrong number.",
      spanish: "Perdón, número equivocado.",
      pronunciation: "sori, rong number",
      category: "phone",
      context: "Error",
    },

    // ==================== MÉDICO ====================
    {
      id: 120,
      english: "I have an appointment.",
      spanish: "Tengo una cita.",
      pronunciation: "ai jav an apointment",
      category: "medical",
      context: "Cita",
    },
    {
      id: 121,
      english: "I don't feel well.",
      spanish: "No me siento bien.",
      pronunciation: "ai dont fil wel",
      category: "medical",
      context: "Malestar",
    },
    {
      id: 122,
      english: "It hurts here.",
      spanish: "Me duele aquí.",
      pronunciation: "it jerts jir",
      category: "medical",
      context: "Dolor",
    },
    {
      id: 123,
      english: "I have a headache.",
      spanish: "Tengo dolor de cabeza.",
      pronunciation: "ai jav a jedeik",
      category: "medical",
      context: "Síntomas",
    },
    {
      id: 124,
      english: "I need a prescription refill.",
      spanish: "Necesito una recarga de receta.",
      pronunciation: "ai nid a prescripshon rifil",
      category: "medical",
      context: "Medicina",
    },
    {
      id: 125,
      english: "Do I need insurance?",
      spanish: "¿Necesito seguro?",
      pronunciation: "du ai nid inchurans?",
      category: "medical",
      context: "Seguro",
    },
    {
      id: 126,
      english: "I'm allergic to penicillin.",
      spanish: "Soy alérgico a la penicilina.",
      pronunciation: "aim aleryic tu penicilin",
      category: "medical",
      context: "Alergias",
    },

    // ==================== RESTAURANTE ====================
    {
      id: 140,
      english: "Table for two, please.",
      spanish: "Mesa para dos, por favor.",
      pronunciation: "teibol for tu, plis",
      category: "restaurant",
      context: "Reserva",
    },
    {
      id: 141,
      english: "Can I see the menu?",
      spanish: "¿Puedo ver el menú?",
      pronunciation: "can ai si de meniu?",
      category: "restaurant",
      context: "Menú",
    },
    {
      id: 142,
      english: "I'd like to order now.",
      spanish: "Quisiera ordenar ahora.",
      pronunciation: "aid laik tu order nau",
      category: "restaurant",
      context: "Orden",
    },
    {
      id: 143,
      english: "What do you recommend?",
      spanish: "¿Qué recomienda?",
      pronunciation: "wat du iu recomend?",
      category: "restaurant",
      context: "Recomendación",
    },
    {
      id: 144,
      english: "Can I have the bill, please?",
      spanish: "¿Me trae la cuenta, por favor?",
      pronunciation: "can ai jav de bil, plis?",
      category: "restaurant",
      context: "Cuenta",
    },
    {
      id: 145,
      english: "The food is delicious!",
      spanish: "¡La comida está deliciosa!",
      pronunciation: "de fud is delishus!",
      category: "restaurant",
      context: "Halago",
    },
    {
      id: 146,
      english: "Is service included?",
      spanish: "¿Está incluido el servicio?",
      pronunciation: "is servis incluided?",
      category: "restaurant",
      context: "Propina",
    },
    {
      id: 147,
      english: "Can I get a to-go box?",
      spanish: "¿Me puede dar una caja para llevar?",
      pronunciation: "can ai get a tu go box?",
      category: "restaurant",
      context: "Para llevar",
    },

    // ==================== VIAJES ====================
    {
      id: 160,
      english: "Where is the bus stop?",
      spanish: "¿Dónde está la parada de autobús?",
      pronunciation: "wer is de bas stop?",
      category: "travel",
      context: "Transporte",
    },
    {
      id: 161,
      english: "How much is the fare?",
      spanish: "¿Cuánto es el pasaje?",
      pronunciation: "jau mach is de fer?",
      category: "travel",
      context: "Precio",
    },
    {
      id: 162,
      english: "I need to buy a ticket.",
      spanish: "Necesito comprar un boleto.",
      pronunciation: "ai nid tu bai a tikit",
      category: "travel",
      context: "Boleto",
    },
    {
      id: 163,
      english: "What time does the flight leave?",
      spanish: "¿A qué hora sale el vuelo?",
      pronunciation: "wat taim das de flait liv?",
      category: "travel",
      context: "Vuelo",
    },
    {
      id: 164,
      english: "Where can I rent a car?",
      spanish: "¿Dónde puedo rentar un carro?",
      pronunciation: "wer can ai rent a car?",
      category: "travel",
      context: "Renta",
    },
    {
      id: 165,
      english: "Is this seat taken?",
      spanish: "¿Está ocupado este asiento?",
      pronunciation: "is dis sit teiken?",
      category: "travel",
      context: "Asiento",
    },
    {
      id: 166,
      english: "Can you take me to this address?",
      spanish: "¿Me puede llevar a esta dirección?",
      pronunciation: "can iu teik mi tu dis adres?",
      category: "travel",
      context: "Taxi",
    },
    {
      id: 167,
      english: "I missed my flight.",
      spanish: "Perdí mi vuelo.",
      pronunciation: "ai mist mai flait",
      category: "travel",
      context: "Problema",
    },

    // ==================== ENTREVISTAS ====================
    {
      id: 180,
      english: "Tell me about yourself.",
      spanish: "Cuéntame sobre ti.",
      pronunciation: "tel mi abaut iurself",
      category: "interviews",
      context: "Pregunta clásica",
    },
    {
      id: 181,
      english: "I have [X] years of experience.",
      spanish: "Tengo [X] años de experiencia.",
      pronunciation: "ai jav [X] yirs of experiens",
      category: "interviews",
      context: "Experiencia",
    },
    {
      id: 182,
      english: "I'm a hard worker.",
      spanish: "Soy muy trabajador/a.",
      pronunciation: "aim a jard worker",
      category: "interviews",
      context: "Cualidad",
    },
    {
      id: 183,
      english: "I can start immediately.",
      spanish: "Puedo empezar inmediatamente.",
      pronunciation: "ai can start imidiatli",
      category: "interviews",
      context: "Disponibilidad",
    },
    {
      id: 184,
      english: "What are the benefits?",
      spanish: "¿Cuáles son los beneficios?",
      pronunciation: "wat ar de benefits?",
      category: "interviews",
      context: "Pregunta",
    },
    {
      id: 185,
      english: "I'm looking for a full-time position.",
      spanish: "Busco un puesto de tiempo completo.",
      pronunciation: "aim luking for a ful-taim posishon",
      category: "interviews",
      context: "Tipo de trabajo",
    },
    {
      id: 186,
      english: "Thank you for the opportunity.",
      spanish: "Gracias por la oportunidad.",
      pronunciation: "zank iu for de oportuniti",
      category: "interviews",
      context: "Agradecimiento",
    },

    // ==================== CONVERSACIÓN CASUAL ====================
    {
      id: 200,
      english: "How's it going?",
      spanish: "¿Cómo va todo?",
      pronunciation: "jaus it going?",
      category: "smalltalk",
      context: "Casual",
    },
    {
      id: 201,
      english: "What do you do?",
      spanish: "¿A qué te dedicas?",
      pronunciation: "wat du iu du?",
      category: "smalltalk",
      context: "Profesión",
    },
    {
      id: 202,
      english: "Where are you from?",
      spanish: "¿De dónde eres?",
      pronunciation: "wer ar iu from?",
      category: "smalltalk",
      context: "Origen",
    },
    {
      id: 203,
      english: "The weather is nice today.",
      spanish: "El clima está agradable hoy.",
      pronunciation: "de weder is nais tudei",
      category: "smalltalk",
      context: "Clima",
    },
    {
      id: 204,
      english: "Do you have any plans for the weekend?",
      spanish: "¿Tienes planes para el fin de semana?",
      pronunciation: "du iu jav eni plans for de wikend?",
      category: "smalltalk",
      context: "Planes",
    },
    {
      id: 205,
      english: "That's interesting!",
      spanish: "¡Qué interesante!",
      pronunciation: "dats interesting!",
      category: "smalltalk",
      context: "Reacción",
    },
    {
      id: 206,
      english: "I agree with you.",
      spanish: "Estoy de acuerdo contigo.",
      pronunciation: "ai agri wid iu",
      category: "smalltalk",
      context: "Opinión",
    },
    {
      id: 207,
      english: "No way!",
      spanish: "¡No puede ser!",
      pronunciation: "no wei!",
      category: "smalltalk",
      context: "Sorpresa",
    },
    {
      id: 208,
      english: "Let's hang out sometime.",
      spanish: "Salgamos algún día.",
      pronunciation: "lets jang aut somtaim",
      category: "smalltalk",
      context: "Invitación",
    },

    // ==================== MODISMOS (IDIOMS) ====================
    {
      id: 220,
      english: "Break a leg!",
      spanish: "¡Mucha suerte! (literal: rómpete una pierna)",
      pronunciation: "breik a leg",
      category: "idioms",
      context: "Buena suerte",
    },
    {
      id: 221,
      english: "It's a piece of cake.",
      spanish: "Es pan comido (muy fácil).",
      pronunciation: "its a pis of keik",
      category: "idioms",
      context: "Facilidad",
    },
    {
      id: 222,
      english: "Hit the nail on the head.",
      spanish: "Dar en el clavo.",
      pronunciation: "jit de neil on de jed",
      category: "idioms",
      context: "Acertar",
    },
    {
      id: 223,
      english: "Under the weather.",
      spanish: "Sentirse mal/enfermo.",
      pronunciation: "onder de weder",
      category: "idioms",
      context: "Salud",
    },
    {
      id: 224,
      english: "Once in a blue moon.",
      spanish: "Muy rara vez.",
      pronunciation: "wans in a blu mun",
      category: "idioms",
      context: "Frecuencia",
    },
    {
      id: 225,
      english: "Cut to the chase.",
      spanish: "Ir al grano.",
      pronunciation: "cat tu de cheis",
      category: "idioms",
      context: "Directo",
    },
    {
      id: 226,
      english: "Hang in there.",
      spanish: "Aguanta / No te rindas.",
      pronunciation: "jang in der",
      category: "idioms",
      context: "Ánimo",
    },
    {
      id: 227,
      english: "Call it a day.",
      spanish: "Terminar por hoy.",
      pronunciation: "col it a dei",
      category: "idioms",
      context: "Finalizar",
    },
    {
      id: 228,
      english: "Better late than never.",
      spanish: "Mejor tarde que nunca.",
      pronunciation: "beter leit dan never",
      category: "idioms",
      context: "Refrán",
    },
    {
      id: 229,
      english: "The ball is in your court.",
      spanish: "La decisión es tuya.",
      pronunciation: "de bol is in iur cort",
      category: "idioms",
      context: "Decisión",
    },

    // ==================== JERGA (SLANG) ====================
    {
      id: 240,
      english: "What's up, dude?",
      spanish: "¿Qué onda, amigo?",
      pronunciation: "wats ap, dud?",
      category: "slang",
      context: "Muy informal",
    },
    {
      id: 241,
      english: "That's cool!",
      spanish: "¡Qué chévere/genial!",
      pronunciation: "dats kul!",
      category: "slang",
      context: "Aprobación",
    },
    {
      id: 242,
      english: "I'm beat.",
      spanish: "Estoy agotado.",
      pronunciation: "aim bit",
      category: "slang",
      context: "Cansancio",
    },
    {
      id: 243,
      english: "No worries!",
      spanish: "¡No hay problema!",
      pronunciation: "no woris!",
      category: "slang",
      context: "Tranquilidad",
    },
    {
      id: 244,
      english: "Hang on a sec.",
      spanish: "Espera un segundo.",
      pronunciation: "jang on a sek",
      category: "slang",
      context: "Espera",
    },
    {
      id: 245,
      english: "I'm broke.",
      spanish: "Estoy sin dinero.",
      pronunciation: "aim brok",
      category: "slang",
      context: "Dinero",
    },
    {
      id: 246,
      english: "It's no big deal.",
      spanish: "No es para tanto.",
      pronunciation: "its no big dil",
      category: "slang",
      context: "Restar importancia",
    },
    {
      id: 247,
      english: "You bet!",
      spanish: "¡Claro que sí!",
      pronunciation: "iu bet!",
      category: "slang",
      context: "Afirmación",
    },
    {
      id: 248,
      english: "I'm all ears.",
      spanish: "Soy todo oídos.",
      pronunciation: "aim ol irs",
      category: "slang",
      context: "Atención",
    },
    {
      id: 249,
      english: "Gotta go!",
      spanish: "¡Me tengo que ir!",
      pronunciation: "gota go!",
      category: "slang",
      context: "Salida",
    },
  ];

  // Actualizar contadores
  categories.forEach((cat) => {
    cat.count =
      cat.id === "all"
        ? allExpressions.length
        : allExpressions.filter((e) => e.category === cat.id).length;
  });

  // Filtrar
  const filteredExpressions = allExpressions.filter((exp) => {
    const matchesCategory =
      activeCategory === "all" || exp.category === activeCategory;
    const matchesSearch =
      exp.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("✅ Copiado al portapapeles");
  };

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getCategoryName = (catId) => {
    return categories.find((c) => c.id === catId)?.label || catId;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ============ HEADER ============ */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            💬 Expresiones comunes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {allExpressions.length} frases útiles para el día a día · Con
            pronunciación y contexto
          </p>
        </div>

        {/* ============ BÚSQUEDA ============ */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar expresión en inglés o español..."
            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* ============ CATEGORÍAS ============ */}
        {/* ============ CATEGORÍAS - RESPONSIVE ============ */}
        {/* Desktop: Botones con scroll horizontal */}
        {/* Desktop: Botones con scroll horizontal */}
        {/* Desktop: Botones con scroll horizontal */}
        {/* ============ CATEGORÍAS - NUEVO DISEÑO LIMPIO ============ */}

        {/* Desktop: Grid de 2 columnas */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-primary/20"
              }`}
            >
              <span className="text-lg flex-shrink-0">{cat.icon}</span>
              <span className="flex-1 text-left">{cat.label}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: Dropdown select */}
        <div className="sm:hidden">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all outline-none appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%23475569' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              paddingRight: "44px",
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* Mobile: Dropdown select */}
        <div className="sm:hidden">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all outline-none appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23475569' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              paddingRight: "40px",
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* ============ CONTADOR ============ */}
        <div className="text-sm text-gray-500">
          Mostrando {filteredExpressions.length} de {allExpressions.length}{" "}
          expresiones
        </div>

        {/* ============ TABLA DE EXPRESIONES ============ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600 text-sm">
                    Inglés
                  </th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600 text-sm hidden sm:table-cell">
                    Pronunciación
                  </th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600 text-sm">
                    Español
                  </th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600 text-sm hidden md:table-cell">
                    Categoría
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600 text-sm">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpressions.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Inglés */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {exp.english}
                      </p>
                      <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                        {exp.pronunciation}
                      </p>
                    </td>

                    {/* Pronunciación */}
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <p className="text-sm text-gray-500 italic">
                        {exp.pronunciation}
                      </p>
                    </td>

                    {/* Español */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-700">{exp.spanish}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {exp.context}
                      </p>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-full font-semibold">
                        {getCategoryName(exp.category)}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSpeak(exp.english)}
                          className="w-8 h-8 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                          title="Escuchar pronunciación"
                        >
                          🔊
                        </button>
                        <button
                          onClick={() => handleCopy(exp.english)}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
                          title="Copiar al portapapeles"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sin resultados */}
          {filteredExpressions.length === 0 && (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">🔍</span>
              <p className="text-gray-500 text-lg">
                No se encontraron expresiones
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Intenta con otra búsqueda o categoría
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
