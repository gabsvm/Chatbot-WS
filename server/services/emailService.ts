/**
 * Email Service - Maneja notificaciones por email
 * 
 * Configuración requerida:
 * - EMAIL_PROVIDER: sendgrid, mailgun, o smtp
 * - EMAIL_API_KEY: API key del proveedor
 * - EMAIL_FROM: Email remitente
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface AppointmentEmailData {
  clientName: string;
  clientEmail: string;
  appointmentDate: Date;
  motorcycleName?: string;
  advisorName?: string;
  advisorPhone?: string;
}

/**
 * Envía email de confirmación de cita
 */
export async function sendAppointmentConfirmationEmail(
  data: AppointmentEmailData
): Promise<boolean> {
  try {
    const appointmentTime = new Date(data.appointmentDate).toLocaleString(
      "es-ES",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const html = `
      <h2>¡Tu cita ha sido confirmada!</h2>
      <p>Hola ${data.clientName},</p>
      <p>Tu cita ha sido agendada exitosamente.</p>
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Fecha y Hora:</strong> ${appointmentTime}</p>
        ${data.motorcycleName ? `<p><strong>Moto:</strong> ${data.motorcycleName}</p>` : ""}
        ${data.advisorName ? `<p><strong>Asesor:</strong> ${data.advisorName}</p>` : ""}
        ${data.advisorPhone ? `<p><strong>Teléfono:</strong> ${data.advisorPhone}</p>` : ""}
      </div>
      <p>Si necesitas cambiar o cancelar tu cita, por favor contacta con nosotros.</p>
      <p>¡Gracias por tu confianza!</p>
    `;

    return await sendEmail({
      to: data.clientEmail,
      subject: "Confirmación de Cita - MotoElectrica",
      html,
    });
  } catch (error) {
    console.error("[EmailService] Error sending appointment confirmation:", error);
    return false;
  }
}

/**
 * Envía email de recordatorio de cita
 */
export async function sendAppointmentReminderEmail(
  data: AppointmentEmailData
): Promise<boolean> {
  try {
    const appointmentTime = new Date(data.appointmentDate).toLocaleString(
      "es-ES",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const html = `
      <h2>Recordatorio de tu Cita</h2>
      <p>Hola ${data.clientName},</p>
      <p>Te recordamos que tienes una cita programada:</p>
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Fecha y Hora:</strong> ${appointmentTime}</p>
        ${data.motorcycleName ? `<p><strong>Moto:</strong> ${data.motorcycleName}</p>` : ""}
      </div>
      <p>Por favor, llega 10 minutos antes de tu cita.</p>
      <p>¡Te esperamos!</p>
    `;

    return await sendEmail({
      to: data.clientEmail,
      subject: "Recordatorio de Cita - MotoElectrica",
      html,
    });
  } catch (error) {
    console.error("[EmailService] Error sending appointment reminder:", error);
    return false;
  }
}

/**
 * Envía resumen diario a asesores
 */
export async function sendDailySummaryEmail(
  advisorEmail: string,
  advisorName: string,
  summary: {
    newClients: number;
    appointmentsToday: number;
    appointmentsThisWeek: number;
    pendingAppointments: number;
  }
): Promise<boolean> {
  try {
    const html = `
      <h2>Resumen Diario - MotoElectrica</h2>
      <p>Hola ${advisorName},</p>
      <p>Aquí está tu resumen del día:</p>
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Clientes Nuevos:</strong> ${summary.newClients}</p>
        <p><strong>Citas Hoy:</strong> ${summary.appointmentsToday}</p>
        <p><strong>Citas Esta Semana:</strong> ${summary.appointmentsThisWeek}</p>
        <p><strong>Citas Pendientes:</strong> ${summary.pendingAppointments}</p>
      </div>
      <p>Accede a tu panel para más detalles: <a href="https://motochatbot-ekvaizfr.manus.space/dashboard">Dashboard</a></p>
    `;

    return await sendEmail({
      to: advisorEmail,
      subject: "Resumen Diario - MotoElectrica",
      html,
    });
  } catch (error) {
    console.error("[EmailService] Error sending daily summary:", error);
    return false;
  }
}

/**
 * Función genérica para enviar emails
 * 
 * Nota: Esta es una función placeholder que necesita ser implementada
 * con el proveedor de email específico (SendGrid, Mailgun, etc.)
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // TODO: Implementar con proveedor de email específico
    // Por ahora, solo loguea el email
    console.log("[EmailService] Email enviado:", {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString(),
    });

    // En producción, descomentar y configurar el proveedor:
    /*
    const emailProvider = process.env.EMAIL_PROVIDER || 'sendgrid';
    
    if (emailProvider === 'sendgrid') {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      await sgMail.send({
        to: options.to,
        from: process.env.EMAIL_FROM || 'noreply@motoelectrica.com',
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    }
    */

    return true;
  } catch (error) {
    console.error("[EmailService] Error:", error);
    return false;
  }
}
