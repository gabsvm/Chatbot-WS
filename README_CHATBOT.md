# MotoElectrica AI Chatbot

Un sistema completo de chatbot inteligente para WhatsApp que automatiza la venta de motos eléctricas usando Gemini API.

## Características Principales

### Para Clientes
- **Recomendaciones Inteligentes**: El bot analiza las necesidades del cliente y recomienda motos basadas en presupuesto y tipo de uso
- **Información de Productos**: Muestra características técnicas, precios y fotos de motos
- **Agendamiento de Citas**: Los clientes pueden agendar citas directamente en WhatsApp (L-V 11am-6pm)
- **Conversación Natural**: Powered by Google Gemini API para respuestas contextuales y personalizadas

### Para Asesores
- **Panel de Administración**: Interfaz completa para gestionar clientes y citas
- **Gestión de Clientes**: Ver historial de conversaciones, información de contacto y preferencias
- **Calendario de Citas**: Visualizar, confirmar y gestionar todas las citas agendadas
- **Dashboard de Métricas**: Análisis de conversaciones, citas agendadas y conversiones
- **Contacto Directo**: Botón para contactar clientes vía WhatsApp

## Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express.js + tRPC + Node.js
- **Base de Datos**: MySQL con Drizzle ORM
- **IA**: Google Gemini API
- **Messaging**: WhatsApp Cloud API (Meta)
- **Autenticación**: Manus OAuth

### Componentes Principales

#### Backend Services
1. **Gemini Service** (`server/services/geminiService.ts`)
   - Procesa mensajes con Gemini API
   - Extrae acciones (recomendación, solicitud de info, cita)
   - Valida horarios de citas

2. **WhatsApp Service** (`server/services/whatsappService.ts`)
   - Envía/recibe mensajes de WhatsApp
   - Verifica webhooks
   - Maneja payloads de Meta

3. **Chatbot Service** (`server/services/chatbotService.ts`)
   - Orquesta la conversación
   - Gestiona estado de cliente
   - Procesa acciones de Gemini

#### Webhook Endpoint
- **GET** `/api/webhooks/whatsapp`: Verificación de webhook
- **POST** `/api/webhooks/whatsapp`: Recepción de mensajes

#### tRPC Procedures
- `motorcycles.list`: Obtener motos disponibles
- `clients.list`: Listar clientes (admin)
- `appointments.list`: Listar citas (admin)
- `appointments.create`: Crear cita
- `appointments.update`: Actualizar estado de cita
- `dashboard.metrics`: Obtener métricas

## Flujo de Conversación

```
Cliente envía mensaje
    ↓
Webhook recibe en /api/webhooks/whatsapp
    ↓
Procesar y obtener historial
    ↓
Enviar a Gemini API con contexto
    ↓
Gemini retorna: mensaje + acción
    ↓
Procesar acción (recomendación, cita, etc.)
    ↓
Guardar en BD
    ↓
Enviar respuesta a WhatsApp
    ↓
Asesor ve en panel de administración
```

## Base de Datos

### Tablas Principales

**motorcycles**
- Catálogo de motos disponibles
- Campos: nombre, modelo, precio, batería, rango, velocidad máx, tiempo carga, peso, descripción, foto, categoría

**clients**
- Información de clientes
- Campos: teléfono WhatsApp, nombre, email, presupuesto, intereses, tipo de uso, estado de conversación

**conversations**
- Historial de mensajes
- Campos: cliente, tipo de mensaje, contenido, metadata, timestamp

**appointments**
- Citas agendadas
- Campos: cliente, asesor, moto, fecha/hora, estado, notas

**chatMetrics**
- Métricas diarias
- Campos: total conversaciones, citas agendadas, citas completadas, clientes nuevos

## Configuración

### Variables de Entorno Requeridas

```
WHATSAPP_VERIFY_TOKEN=tu_verify_token
WHATSAPP_ACCESS_TOKEN=tu_access_token
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
```

Ver `SETUP_GUIDE.md` para instrucciones completas de configuración.

## Páginas del Frontend

### Públicas
- `/`: Página de inicio con información del sistema

### Protegidas (Admin)
- `/clients`: Gestión de clientes
- `/clients/:id`: Detalles de cliente
- `/appointments`: Gestión de citas
- `/dashboard`: Métricas y análisis
- `/motorcycles`: Gestión de motos (próxima)

## Instrucciones de Despliegue

1. Clona el repositorio
2. Instala dependencias: `pnpm install`
3. Configura variables de entorno en Manus Settings → Secrets
4. Ejecuta migraciones: `pnpm db:push`
5. Inicia servidor: `pnpm dev`
6. Configura webhook en Meta Developer App
7. Accede a `https://tu-dominio.manus.space`

## Mejoras Futuras

- [ ] Interfaz CRUD para gestionar motos
- [ ] Notificaciones por email
- [ ] Integración con Google Calendar
- [ ] Análisis avanzado de conversaciones
- [ ] Exportar reportes en PDF
- [ ] Soporte multiidioma
- [ ] Integración con CRM externo
- [ ] Sistema de calificación de clientes
- [ ] Seguimiento de conversiones

## Estructura de Archivos

```
moto-electrica-chatbot/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Clients.tsx
│       │   ├── Appointments.tsx
│       │   └── Dashboard.tsx
│       └── App.tsx
├── server/
│   ├── services/
│   │   ├── geminiService.ts
│   │   ├── whatsappService.ts
│   │   └── chatbotService.ts
│   ├── webhooks/
│   │   └── whatsappWebhook.ts
│   ├── db.ts
│   ├── routers.ts
│   └── _core/
│       └── index.ts
├── drizzle/
│   └── schema.ts
├── SETUP_GUIDE.md
└── README_CHATBOT.md
```

## Notas Importantes

1. **Horarios de Citas**: Configurados para L-V 11am-6pm. Edita `isValidAppointmentTime()` para cambiar.
2. **Gemini API**: Usa la integración de Manus. Las credenciales se inyectan automáticamente.
3. **WhatsApp**: Requiere número de teléfono verificado y acceso a Cloud API.
4. **Seguridad**: Todos los endpoints admin requieren autenticación y rol de administrador.

## Soporte

Para problemas o preguntas sobre la configuración, consulta `SETUP_GUIDE.md` o contacta al equipo de desarrollo.
