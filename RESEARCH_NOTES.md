# Investigación - Integración WhatsApp + Gemini API

## WhatsApp Cloud API

### Conceptos Clave
- **Webhooks**: HTTP requests con payloads JSON enviados por Meta a tu servidor
- **Estructura**: Los webhooks contienen información sobre mensajes entrantes, cambios de estado, etc.
- **Autenticación**: Se usa un token permanente generado desde el Dashboard de Meta
- **Webhook Payload**: Contiene objeto, entrada, cambios, con detalles de mensajes (from, timestamp, text, type, etc.)

### Flujo de Integración
1. Crear app en Meta Developer Dashboard
2. Configurar webhook endpoint (URL pública)
3. Generar token de acceso permanente (System User)
4. Recibir webhooks en formato JSON
5. Procesar mensajes y enviar respuestas

### Estructura de Mensaje Entrante
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WABA_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "PHONE",
          "phone_number_id": "PHONE_ID"
        },
        "contacts": [{"profile": {"name": "NAME"}, "wa_id": "PHONE"}],
        "messages": [{
          "from": "SENDER_PHONE",
          "id": "MESSAGE_ID",
          "timestamp": "UNIX_TIMESTAMP",
          "text": {"body": "MESSAGE_TEXT"},
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

### Tipos de Mensajes Soportados
- text
- image
- document
- audio
- video
- location
- contacts
- button
- interactive

## Gemini API

### Características
- Procesamiento de lenguaje natural
- Generación de texto
- Análisis de contexto
- Respuestas estructuradas con JSON Schema

### Ventajas para Chatbot
- Contexto conversacional
- Respuestas naturales y personalizadas
- Capacidad de seguir instrucciones del sistema
- Soporte para structured output (JSON)

## Arquitectura Propuesta

### Componentes Principales
1. **Webhook Handler**: Express endpoint que recibe mensajes de WhatsApp
2. **Message Processor**: Procesa mensajes y extrae información
3. **Gemini Integration**: Envía contexto a Gemini y obtiene respuestas
4. **State Manager**: Mantiene estado de conversación por usuario
5. **Database**: Almacena clientes, motos, citas, conversaciones
6. **WhatsApp Sender**: Envía respuestas a WhatsApp
7. **Admin Panel**: Dashboard para asesores
8. **Appointment Manager**: Sistema de citas con validación de horarios

### Flujo de Mensaje
1. WhatsApp envía webhook → Webhook Handler
2. Extraer datos del mensaje (from, text, timestamp)
3. Buscar/crear cliente en BD
4. Obtener historial de conversación
5. Enviar a Gemini con contexto + instrucciones
6. Procesar respuesta de Gemini
7. Extraer acciones (recomendación, solicitud de info, cita, etc.)
8. Guardar en BD
9. Enviar respuesta a WhatsApp

### Instrucciones del Sistema para Gemini
- Eres un asesor de ventas de motos eléctricas
- Recomenda motos basadas en presupuesto y necesidades
- Recopila: nombre, teléfono, presupuesto, tipo de uso
- Si el cliente quiere agendar cita, confirma disponibilidad (L-V 11-18h)
- Mantén tono profesional pero amigable
- Respuestas concisas para WhatsApp

## Próximos Pasos
1. Diseñar esquema de BD (motos, clientes, conversaciones, citas)
2. Implementar webhook endpoint
3. Integrar Gemini API
4. Sistema de gestión de estado
5. Panel de administración
6. Dashboard de métricas
