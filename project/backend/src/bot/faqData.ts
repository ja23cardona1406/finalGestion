// FAQ data for Agrosoft CM WhatsApp bot
export const faqCorpus = [
  {
    keywords: ['que es', 'agrosoft', 'sistema', 'que hace', 'funciona'],
    question: '¿Qué es Agrosoft CM?',
    answer: '🐄 *Agrosoft CM* es un Sistema Inteligente de Producción Lechera que revoluciona la ganadería mediante:\n\n• 🤖 *Inteligencia Artificial* para predicciones precisas\n• 📊 *Análisis predictivo* de producción láctea\n• 📱 *Dashboard moderno* y fácil de usar\n• 📈 *Optimización* de hasta 15% en producción\n\n¡Transforma tu ganadería con tecnología de punta!'
  },
  {
    keywords: ['precio', 'costo', 'valor', 'cuanto cuesta', 'tarifas'],
    question: '¿Cuál es el precio del sistema?',
    answer: '💰 *Planes de Agrosoft CM:*\n\n🥉 *Plan Básico* - $299.000/mes\n• Hasta 50 vacas\n• Predicciones básicas\n• Soporte email\n\n🥈 *Plan Profesional* - $599.000/mes\n• Hasta 200 vacas\n• IA avanzada (4 algoritmos)\n• Dashboard completo\n• Soporte telefónico\n\n🥇 *Plan Empresarial* - $999.000/mes\n• Vacas ilimitadas\n• Módulos completos\n• Consultoría especializada\n\n¡Solicita tu *demo gratuita* de 30 días!'
  },
  {
    keywords: ['inteligencia artificial', 'ia', 'algoritmos', 'prediccion', 'machine learning'],
    question: '¿Cómo funciona la IA del sistema?',
    answer: '🧠 *Inteligencia Artificial de Agrosoft CM:*\n\n🔹 *4 Algoritmos Especializados:*\n• Regresión Lineal (tendencias básicas)\n• Árboles de Decisión (factores complejos)\n• LSTM (patrones temporales)\n• Random Forest (predicciones robustas)\n\n📊 *Precisión del 85-95%*\n🎯 *Considera:* raza, peso, lactancia, clima, nutrición\n⚡ *Predicciones en tiempo real*\n\n¡La IA que entiende tu ganado!'
  },
  {
    keywords: ['beneficios', 'ventajas', 'que gano', 'mejoras', 'resultados'],
    question: '¿Qué beneficios obtendré?',
    answer: '🚀 *Beneficios Comprobados de Agrosoft CM:*\n\n📈 *Productivos:*\n• +8-15% aumento en producción\n• -10-20% reducción de costos\n• -25% tiempo de gestión\n\n🎯 *Operativos:*\n• Predicciones diarias precisas\n• Detección temprana de problemas\n• Optimización nutricional\n• Planificación inteligente\n\n🌱 *Ambientales:*\n• Menor huella de carbono\n• Uso eficiente de recursos\n\n¡Transforma tu ganadería en negocio inteligente!'
  },
  {
    keywords: ['demo', 'prueba', 'test', 'gratis', 'probar'],
    question: '¿Puedo probar el sistema?',
    answer: '🎉 ¡Claro! *Demo Gratuita por 30 días*\n\n✅ *Incluye:*\n• Acceso completo al sistema\n• Registro de hasta 20 vacas\n• Todas las funcionalidades\n• Soporte técnico\n• Capacitación inicial\n\n📞 *Para activar tu demo:*\nComparte tu información:\n• Nombre de la finca\n• Número de vacas\n• Ubicación\n• Teléfono de contacto\n\n¡Sin compromisos, sin tarjeta de crédito!'
  },
  {
    keywords: ['requisitos', 'necesito', 'instalacion', 'computador', 'celular'],
    question: '¿Qué necesito para usar el sistema?',
    answer: '💻 *Requisitos Técnicos Mínimos:*\n\n🖥️ *Computador/Laptop:*\n• Windows 10+ / Mac / Linux\n• 4GB RAM mínimo\n• Navegador web actualizado\n• Internet estable\n\n📱 *Dispositivos Móviles:*\n• Android 8+ / iOS 12+\n• App nativa próximamente\n\n🌐 *Conectividad:*\n• Internet banda ancha\n• WiFi en área de ordeño (recomendado)\n\n¡Fácil instalación, sin hardware adicional!'
  },
  {
    keywords: ['soporte', 'ayuda', 'capacitacion', 'entrenamiento', 'apoyo'],
    question: '¿Qué soporte técnico incluye?',
    answer: '🛠️ *Soporte Técnico Completo:*\n\n📚 *Capacitación:*\n• Entrenamiento inicial 4 horas\n• Manuales digitales\n• Videos tutoriales\n• Webinars mensuales\n\n📞 *Asistencia:*\n• Soporte telefónico (horario laboral)\n• Chat en vivo\n• Email técnico 24/7\n• Acceso remoto para configuración\n\n🔄 *Actualizaciones:*\n• Mejoras automáticas\n• Nuevas funcionalidades\n• Sin costos adicionales\n\n¡Tu éxito es nuestro compromiso!'
  },
  {
    keywords: ['contacto', 'telefono', 'email', 'direccion', 'ubicacion'],
    question: '¿Cómo los contacto?',
    answer: '📞 *Contacta con Agrosoft CM:*\n\n📱 *WhatsApp:* +57 300 123 4567\n📧 *Email:* info@agrosoftcm.com\n🌐 *Web:* www.agrosoftcm.com\n\n🏢 *Oficina Principal:*\nCali, Valle del Cauca\nCarrera 15 #25-30, Piso 3\n\n⏰ *Horarios:*\nLun-Vie: 8:00 AM - 6:00 PM\nSáb: 8:00 AM - 12:00 PM\n\n¡Estamos aquí para ayudarte!'
  }
];

// Casual responses for non-FAQ messages
export const casualResponses: [string, string | (() => string)][] = [
  ['hola|buenos días|buenas tardes|saludos', '¡Hola! 😊 ¿En qué puedo ayudarte hoy con Agrosoft CM?'],
  ['cómo estás|qué tal|como estas', '¡Estoy muy bien, gracias por preguntar! Listo para ayudarte con información sobre nuestro sistema de producción lechera. 🐄'],
  ['gracias|muchas gracias|thank you', '¡De nada! Estoy aquí para ayudarte con cualquier duda sobre Agrosoft CM. 😊'],
  ['adiós|chao|hasta luego|nos vemos', 'Hasta luego! Si necesitas más información sobre Agrosoft CM, no dudes en contactarnos. 👋'],
  ['quién eres|qué eres|que eres', 'Soy el asistente virtual de Agrosoft CM, diseñado para ayudarte con información sobre nuestro sistema inteligente de producción lechera. 🤖']
];