# MotoElectrica Chatbot - TODO

## Base de Datos
- [x] Diseñar y crear tablas: motorcycles, clients, conversations, appointments, appointment_slots
- [x] Implementar migraciones con Drizzle
- [x] Crear helpers de consulta en server/db.ts

## Backend - Webhook de WhatsApp
- [x] Crear endpoint POST /api/webhooks/whatsapp
- [x] Implementar verificación de webhook (token)
- [x] Procesar estructura de payload de WhatsApp
- [x] Crear servicio de envío de mensajes a WhatsApp

## Backend - Integración Gemini
- [x] Configurar credenciales de Gemini API (usando invokeLLM)
- [x] Crear servicio de procesamiento con Gemini
- [x] Implementar system prompt para asesor de motos
- [x] Crear función para extraer acciones de respuesta (recomendación, solicitud de info, cita)

## Backend - Gestión de Conversaciones
- [x] Crear servicio de gestión de estado de conversación
- [x] Implementar almacenamiento de historial de mensajes
- [x] Crear sistema de extracción de información del cliente
- [x] Implementar lógica de flujo de conversación

## Backend - Sistema de Citas
- [x] Crear validador de horarios (L-V 11-18h)
- [ ] Implementar servicio de reserva de citas
- [ ] Crear sistema de slots disponibles
- [ ] Implementar notificaciones de citas

## Backend - tRPC Procedures
- [x] Crear routers para gestión de clientes
- [x] Crear routers para gestión de citas
- [x] Crear routers para obtener motos
- [x] Crear routers para dashboard de métricas
- [x] Crear routers para administración

## Frontend - Autenticación
- [x] Verificar que el sistema de auth de Manus funciona
- [x] Implementar protección de rutas para asesores

## Frontend - Panel de Administración
- [x] Crear layout de dashboard para asesores
- [x] Implementar lista de clientes con búsqueda y filtros
- [ ] Crear vista de detalles de cliente
- [x] Implementar lista de citas pendientes
- [ ] Crear calendario de citas
- [x] Implementar gestión de citas (confirmar, cancelar, reagendar)

## Frontend - Dashboard de Métricas
- [x] Crear dashboard con KPIs principales
- [ ] Implementar gráficos de conversaciones por día
- [ ] Implementar gráficos de citas agendadas
- [ ] Crear tabla de conversiones
- [ ] Implementar filtros por rango de fechas

## Frontend - Gestión de Motos
- [x] Crear página de administración de motos
- [x] Implementar CRUD de motos
- [ ] Crear formulario de carga de fotos
- [x] Implementar gestión de características y precios

## Mejoras Fase 2

### Gestión CRUD de Motos
- [x] Crear página de administración de motos
- [x] Implementar formulario de creación de motos
- [x] Implementar edición de motos
- [x] Implementar eliminación de motos
- [ ] Agregar carga de imágenes (usar S3)

### Notificaciones por Email
- [x] Crear servicio de email (EmailService)
- [x] Implementar función de confirmación de cita
- [x] Implementar función de recordatorio de cita
- [x] Implementar función de resumen diario
- [ ] Integrar con SendGrid/Mailgun
- [ ] Configurar env vars para proveedor de email

### Integración Google Calendar
- [x] Crear servicio de Google Calendar
- [x] Implementar función de creación de eventos
- [x] Implementar función de obtención de disponibilidad
- [x] Implementar función de actualización de eventos
- [ ] Configurar OAuth con Google Cloud Console
- [ ] Integrar autenticación en el panel

## Pruebas
- [ ] Crear tests unitarios para servicios de Gemini
- [ ] Crear tests para validación de horarios
- [ ] Crear tests para extracción de información
- [ ] Crear tests para procesamiento de webhooks

## Documentación
- [x] Crear guía de configuración de Meta Developer App (SETUP_GUIDE.md)
- [x] Crear guía de configuración de Gemini API (SETUP_GUIDE.md)
- [x] Crear guía de despliegue (SETUP_GUIDE.md)
- [x] Crear documentación de API (README_CHATBOT.md)
- [ ] Crear guía de uso para asesores

## Despliegue
- [ ] Preparar variables de entorno
- [ ] Crear script de inicialización
- [ ] Preparar documentación de despliegue


## Mejoras Fase 3

### Carga de Imágenes en S3
- [ ] Crear endpoint para upload de imágenes
- [ ] Integrar con servicio de S3
- [ ] Agregar preview de imagen en formulario
- [ ] Validar tamaño y tipo de archivo

### Página de Detalles de Cliente
- [x] Crear página /clients/:id
- [x] Mostrar historial de conversaciones
- [x] Mostrar citas agendadas y completadas
- [x] Agregar notas del asesor
- [x] Mostrar preferencias del cliente

### Gráficos en Dashboard
- [x] Gráfico de conversaciones por día
- [x] Gráfico de citas agendadas
- [x] Gráfico de tasa de conversión
- [x] Tabla de clientes con mejor conversión

### Descarga de Proyecto como ZIP
- [x] Crear endpoint para generar ZIP
- [x] Incluir todos los archivos del proyecto
- [x] Agregar botón en página de inicio
- [x] Agregar botón en dashboard


## Correcciones y Mejoras Finales

### Carga de Imágenes en S3
- [x] Crear componente de upload de imágenes
- [x] Integrar con servicio storagePut
- [x] Agregar preview antes de subir
- [x] Validar tamaño y tipo de archivo
- [x] Mostrar progreso de carga

### Guía de Conexión WhatsApp
- [x] Crear página de guía paso a paso
- [x] Agregar instrucciones para Meta Developer App
- [x] Agregar instrucciones para obtener tokens
- [x] Agregar instrucciones para configurar webhook
- [x] Agregar instrucciones para probar conexión


## Fase Final - Correcciones y Nuevas Características

### Corregir Descarga de ZIP
- [x] Fijar error en endpoint /api/download-project
- [x] Usar archiver en lugar de comando zip
- [x] Validar que el archivo se genera correctamente
- [x] Probar descarga en navegador

### Notificaciones en Tiempo Real
- [x] Instalar Socket.io
- [x] Crear servidor de WebSockets
- [x] Implementar eventos de nuevos mensajes
- [x] Implementar eventos de nuevas citas
- [x] Conectar cliente con Socket.io
- [x] Mostrar notificaciones en tiempo real

### Plantillas de Respuesta
- [x] Crear tabla de plantillas en BD
- [x] Crear página de gestión de plantillas
- [x] Agregar CRUD de plantillas
- [x] Integrar plantillas en chatbot
- [x] Permitir usar plantillas en conversaciones

### Exportación de Reportes
- [x] Crear endpoint de exportación a PDF
- [x] Crear endpoint de exportación a Excel
- [x] Agregar filtros por fecha
- [x] Agregar botones en dashboard
- [x] Generar reportes con datos de clientes y citas
