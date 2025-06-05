# Bot WhatsApp Agrosoft CM - Versión Simplificada

Este proyecto es una versión simplificada del bot de WhatsApp para Agrosoft CM, enfocada en la funcionalidad básica de responder preguntas y gestionar contactos autorizados.

## Arquitectura del Proyecto

### Arquitectura Física-Técnica

El sistema sigue una arquitectura cliente-servidor con:

**Backend:**
- Node.js con TypeScript
- Framework: Express.js
- Librería WhatsApp: whatsapp-web.js
- Procesamiento de lenguaje: string-similarity para comparación semántica
- Persistencia: JSON files para contactos autorizados
- Comunicación en tiempo real: Socket.io

**Frontend:**
- React con TypeScript
- UI: Tailwind CSS para estilos
- Componentes principales: QRCode, Lista de contactos, Panel de estado
- Comunicación en tiempo real con Socket.io

### Lógica del Bot

El bot funciona en 4 pasos principales:

**1. Inicialización:**
- Carga contactos autorizados
- Genera QR para conexión WhatsApp
- Escucha mensajes entrantes

**2. Procesamiento de mensajes:**
- Verifica si el remitente está autorizado
- Clasifica el mensaje (pregunta técnica o conversación casual)
- Busca la mejor respuesta en el corpus de FAQs o respuestas casuales

**3. Respuesta:**
- Para preguntas técnicas: usa similitud semántica con Jaro-Winkler
- Para conversación casual: usa expresiones regulares para patrones

**4. Registro:**
- Guarda consultas no reconocidas
- Mantiene estadísticas básicas

### Componente de PLN

El procesamiento de lenguaje natural se implementa con dos enfoques:

**Para preguntas técnicas:**
- Algoritmo Jaro-Winkler para similitud de strings
- Comparación con palabras clave y preguntas completas
- Umbral de similitud del 30% para considerar coincidencia

**Para conversación casual:**
- Lista de patrones (expresiones regulares) y respuestas
- Permite respuestas dinámicas con funciones
- Manejo de sinónimos y variaciones comunes

## Configuración y Uso

**Instalar dependencias:**

```bash
npm run install:all
```

**Ejecutar:**

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

**Usar la interfaz:**
1. Escanear QR para conectar WhatsApp
2. Agregar números autorizados
3. El bot responderá automáticamente a mensajes

## Preguntas Frecuentes Implementadas

El bot puede responder sobre:
- Qué es Agrosoft CM
- Precios y planes
- Funcionamiento de la IA
- Beneficios del sistema
- Demo gratuita
- Requisitos técnicos
- Soporte y contacto

También maneja conversación casual:
- Saludos
- Preguntas sobre sí mismo
- Agradecimientos

// Bot WhatsApp para Agrosoft CM - Sistema Inteligente de Producción Lechera
// Autor: Desarrollo para promoción académica/comercial
// Fecha: Junio 2025
// Modificado: Solo responde a contactos autorizados - CORREGIDO