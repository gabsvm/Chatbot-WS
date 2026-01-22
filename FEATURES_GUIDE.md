# Guía de Nuevas Características

## 1. Gestión CRUD de Motos

### Descripción
Los asesores pueden agregar, editar y eliminar motos directamente desde el panel de administración sin necesidad de acceso a la base de datos.

### Cómo Usar

1. **Acceder a la página de motos**: En el panel principal, haz clic en "Motos" o ve a `/motorcycles`

2. **Agregar una nueva moto**:
   - Haz clic en el botón "+ Agregar Moto"
   - Completa los campos requeridos (nombre, modelo, precio)
   - Agrega información técnica (batería, rango, velocidad máxima, etc.)
   - Ingresa la URL de la imagen
   - Haz clic en "Crear Moto"

3. **Editar una moto**:
   - Haz clic en el botón de edición (lápiz) en la tarjeta de la moto
   - Modifica los campos necesarios
   - Haz clic en "Actualizar Moto"

4. **Eliminar una moto**:
   - Haz clic en el botón de eliminar (papelera) en la tarjeta de la moto
   - La moto será eliminada inmediatamente

### Campos Disponibles

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| Nombre | Sí | Nombre de la moto (ej: Tesla Model S) |
| Modelo | Sí | Modelo específico (ej: Plaid) |
| Precio | Sí | Precio en dólares |
| Categoría | No | city, sport, adventure, cruiser |
| Capacidad Batería | No | Capacidad en kWh (ej: 50 kWh) |
| Rango | No | Rango de autonomía (ej: 200 km) |
| Velocidad Máxima | No | En km/h |
| Tiempo de Carga | No | Tiempo de carga completa (ej: 4 horas) |
| Peso | No | En kilogramos |
| Descripción | No | Descripción detallada |
| URL de Imagen | No | URL pública de la imagen |

## 2. Notificaciones por Email

### Descripción
El sistema envía automáticamente emails a clientes y asesores en momentos clave del proceso de venta.

### Tipos de Emails

#### 2.1 Confirmación de Cita
Se envía al cliente cuando agenda una cita en WhatsApp.

**Contenido**:
- Fecha y hora de la cita
- Nombre de la moto (si aplica)
- Nombre del asesor
- Teléfono del asesor

#### 2.2 Recordatorio de Cita
Se envía 24 horas antes de la cita programada.

**Contenido**:
- Recordatorio de la cita
- Solicitud de llegar 10 minutos antes
- Información de contacto

#### 2.3 Resumen Diario para Asesores
Se envía cada mañana con un resumen del día.

**Contenido**:
- Número de clientes nuevos
- Citas agendadas para hoy
- Citas programadas para esta semana
- Citas pendientes de confirmación

### Configuración

Para habilitar notificaciones por email, necesitas:

1. **Elegir un proveedor de email**:
   - SendGrid (recomendado)
   - Mailgun
   - SMTP personalizado

2. **Configurar variables de entorno**:
   ```
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=tu_api_key_aqui
   EMAIL_FROM=noreply@motoelectrica.com
   ```

3. **Actualizar el archivo `server/services/emailService.ts`**:
   - Descomentar el código del proveedor elegido
   - Instalar las dependencias necesarias

### Ejemplo de Integración con SendGrid

```bash
npm install @sendgrid/mail
```

Luego, descomentar en `emailService.ts`:

```typescript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: options.to,
  from: process.env.EMAIL_FROM,
  subject: options.subject,
  html: options.html,
});
```

## 3. Integración Google Calendar

### Descripción
Las citas agendadas se sincronizan automáticamente con Google Calendar, permitiendo a los asesores ver su disponibilidad en tiempo real.

### Características

1. **Sincronización Automática**: Cuando se crea una cita, se agrega automáticamente al calendario
2. **Disponibilidad en Tiempo Real**: El sistema consulta Google Calendar para mostrar slots disponibles
3. **Notificaciones**: Los asesores reciben notificaciones de Google Calendar
4. **Invitaciones**: Los clientes reciben invitaciones por email

### Configuración

#### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita "Google Calendar API"
4. Crea credenciales OAuth 2.0 (Desktop Application)

#### Paso 2: Configurar Variables de Entorno

```
GOOGLE_CALENDAR_CLIENT_ID=tu_client_id_aqui
GOOGLE_CALENDAR_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_CALENDAR_REDIRECT_URI=https://tu-dominio.manus.space/api/oauth/google-calendar
GOOGLE_CALENDAR_ID=tu_calendar_id_aqui
```

#### Paso 3: Integrar en el Código

En `server/services/chatbotService.ts`, descomentar:

```typescript
// Sincronizar con Google Calendar (si está configurado)
await createCalendarEvent({
  title: `Cita con ${client.name}`,
  description: `Consulta sobre motos eléctricas`,
  startTime: appointmentDateTime,
  endTime: new Date(appointmentDateTime.getTime() + 60 * 60 * 1000),
  clientEmail: client.email,
  advisorEmail: advisor.email,
  motorcycleName: motorcycle?.name,
}, googleCalendarConfig);
```

#### Paso 4: Obtener Google Calendar ID

1. Ve a [Google Calendar Settings](https://calendar.google.com/calendar/u/0/r/settings)
2. Selecciona tu calendario
3. Copia el "Calendar ID" (formato: `xxxxx@group.calendar.google.com`)

### Ejemplo de Evento Creado

Cuando se agenda una cita, se crea un evento en Google Calendar con:

- **Título**: "Cita con [Nombre del Cliente]"
- **Descripción**: Detalles de la cita y moto
- **Hora**: La hora exacta de la cita
- **Asistentes**: Cliente y asesor
- **Ubicación**: Dirección de la concesionaria (si aplica)

## Próximas Mejoras

- [ ] Carga de imágenes directamente desde el panel (usando S3)
- [ ] Integración con WhatsApp Business API para enviar mensajes
- [ ] Reportes avanzados con gráficos
- [ ] Integración con CRM externo
- [ ] Sistema de calificación de clientes
- [ ] Seguimiento de conversiones

## Troubleshooting

### Los emails no se envían

1. Verifica que `EMAIL_PROVIDER` esté configurado correctamente
2. Comprueba que la API key sea válida
3. Revisa los logs del servidor

### Google Calendar no sincroniza

1. Verifica que las credenciales de OAuth sean correctas
2. Comprueba que Google Calendar API esté habilitada
3. Revisa que el Calendar ID sea válido

### Las motos no aparecen en el chatbot

1. Verifica que las motos estén marcadas como activas (`isActive = true`)
2. Comprueba que la categoría sea válida
3. Asegúrate de que el precio esté en centavos (multiplicado por 100)

## Soporte

Para problemas o preguntas, consulta la documentación principal o contacta al equipo de desarrollo.
