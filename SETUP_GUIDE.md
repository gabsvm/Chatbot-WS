# Guía de Configuración - MotoElectrica AI Chatbot

## Requisitos Previos

1. **Cuenta de Meta Developer**: [https://developers.facebook.com](https://developers.facebook.com)
2. **Cuenta de Google Cloud**: Para acceso a Gemini API
3. **Número de teléfono de WhatsApp Business**: Para recibir/enviar mensajes

## Paso 1: Configurar Meta Developer App

### 1.1 Crear una nueva aplicación

1. Ve a [Meta Developers](https://developers.facebook.com)
2. Haz clic en "My Apps" → "Create App"
3. Selecciona "Business" como tipo de app
4. Completa los detalles de la app

### 1.2 Agregar WhatsApp Business

1. En el dashboard de la app, busca "WhatsApp"
2. Haz clic en "Set Up" → "WhatsApp Business Platform"
3. Sigue los pasos de configuración

### 1.3 Obtener credenciales

1. **Phone Number ID**: Ve a "WhatsApp" → "Getting Started" → copia el Phone Number ID
2. **Access Token**: En "System Users", crea un nuevo usuario y genera un token permanente
3. **Verify Token**: Crea un token aleatorio para verificación de webhook (ej: `my_secure_verify_token_12345`)

## Paso 2: Configurar Variables de Entorno

En tu panel de Manus, ve a **Settings → Secrets** y agrega:

```
WHATSAPP_VERIFY_TOKEN=tu_verify_token_aqui
WHATSAPP_ACCESS_TOKEN=tu_access_token_aqui
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id_aqui
```

## Paso 3: Configurar Webhook en Meta

1. En Meta Developer App, ve a "WhatsApp" → "Configuration"
2. En "Webhook URL", ingresa:
   ```
   https://tu-dominio.manus.space/api/webhooks/whatsapp
   ```
3. En "Verify Token", ingresa el mismo token que configuraste en `WHATSAPP_VERIFY_TOKEN`
4. En "Subscribe to this field", selecciona:
   - `messages`
   - `message_status`
   - `message_template_status_update`

5. Haz clic en "Verify and Save"

## Paso 4: Configurar Gemini API

### 4.1 Obtener credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita "Generative Language API"
4. Crea una clave de API

### 4.2 Configurar en Manus

La integración con Gemini ya está configurada en el sistema usando `invokeLLM`. Las credenciales se inyectan automáticamente desde el servidor de Manus.

## Paso 5: Agregar Motos a la Base de Datos

### Opción A: Usando SQL directo

Accede a la base de datos desde el panel de Manus y ejecuta:

```sql
INSERT INTO motorcycles (name, model, price, batteryCapacity, range, maxSpeed, chargingTime, weight, description, imageUrl, category, isActive) VALUES
('Tesla Model S', 'Plaid', 150000000, '100 kWh', '500 km', 250, '1 hour', 1600, 'Moto eléctrica de alto rendimiento', 'https://example.com/tesla.jpg', 'sport', 'true'),
('Harley-Davidson', 'LiveWire', 50000000, '15.5 kWh', '235 km', 180, '1.5 hours', 249, 'Moto clásica eléctrica', 'https://example.com/harley.jpg', 'city', 'true');
```

### Opción B: Crear interfaz de administración

Crea una página en el frontend para agregar motos (próxima mejora).

## Paso 6: Probar el Sistema

### 6.1 Verificar webhook

1. En Meta Developer App, ve a "Logs" para ver si el webhook está recibiendo eventos
2. Envía un mensaje de prueba desde WhatsApp al número configurado

### 6.2 Verificar respuesta del bot

1. Abre WhatsApp
2. Envía un mensaje al número de tu bot
3. Deberías recibir una respuesta automática de Gemini

### 6.3 Verificar panel de administración

1. Accede a tu aplicación en `https://tu-dominio.manus.space`
2. Inicia sesión con tu cuenta
3. Ve a "Clientes" para ver los clientes que han interactuado con el bot

## Paso 7: Configurar Horarios de Citas

El sistema está configurado para agendar citas de **lunes a viernes, 11:00 AM a 6:00 PM**.

Para cambiar estos horarios, edita el archivo `server/services/geminiService.ts` en la función `isValidAppointmentTime()`.

## Troubleshooting

### El webhook no recibe mensajes

1. Verifica que el URL del webhook sea accesible desde internet
2. Comprueba que el Verify Token sea correcto
3. Revisa los logs de Meta Developer App

### El bot no responde

1. Verifica que las credenciales de Gemini estén configuradas
2. Revisa los logs del servidor en el panel de Manus
3. Comprueba que el número de teléfono esté registrado correctamente

### Las citas no se crean

1. Verifica que el horario sea válido (L-V 11-18h)
2. Comprueba que el cliente haya proporcionado una fecha/hora válida
3. Revisa la base de datos para ver si se creó la cita

## Próximas Mejoras

- [ ] Interfaz para gestionar motos (CRUD)
- [ ] Sistema de notificaciones por email
- [ ] Integración con calendario (Google Calendar, Outlook)
- [ ] Análisis avanzado de conversaciones
- [ ] Exportar reportes en PDF
- [ ] Soporte para múltiples idiomas
- [ ] Integración con CRM externo

## Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
