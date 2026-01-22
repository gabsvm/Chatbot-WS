import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer | null = null;

/**
 * Inicializar servidor de WebSockets
 */
export function initializeWebSocket(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("[WebSocket] Cliente conectado:", socket.id);

    // Unirse a sala de usuario
    socket.on("join-user", (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`[WebSocket] Usuario ${userId} se unió a su sala`);
    });

    // Unirse a sala de admin
    socket.on("join-admin", () => {
      socket.join("admin");
      console.log("[WebSocket] Admin se unió a la sala");
    });

    socket.on("disconnect", () => {
      console.log("[WebSocket] Cliente desconectado:", socket.id);
    });
  });

  return io;
}

/**
 * Obtener instancia de Socket.IO
 */
export function getIO(): SocketIOServer | null {
  return io;
}

/**
 * Emitir evento de nuevo mensaje a usuario específico
 */
export function emitNewMessage(
  userId: string,
  message: {
    id: string;
    clientName: string;
    clientPhone: string;
    content: string;
    timestamp: Date;
  }
) {
  if (!io) return;
  io.to(`user-${userId}`).emit("new-message", message);
  console.log("[WebSocket] Nuevo mensaje enviado a usuario:", userId);
}

/**
 * Emitir evento de nueva cita a admin
 */
export function emitNewAppointment(appointment: {
  id: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
  motorcycleName: string;
}) {
  if (!io) return;
  io.to("admin").emit("new-appointment", appointment);
  console.log("[WebSocket] Nueva cita emitida a admin");
}

/**
 * Emitir evento de cita confirmada
 */
export function emitAppointmentConfirmed(appointmentId: string) {
  if (!io) return;
  io.to("admin").emit("appointment-confirmed", { appointmentId });
  console.log("[WebSocket] Cita confirmada emitida:", appointmentId);
}

/**
 * Emitir evento de cita cancelada
 */
export function emitAppointmentCancelled(appointmentId: string) {
  if (!io) return;
  io.to("admin").emit("appointment-cancelled", { appointmentId });
  console.log("[WebSocket] Cita cancelada emitida:", appointmentId);
}

/**
 * Emitir evento de cliente actualizado
 */
export function emitClientUpdated(clientId: string, clientData: any) {
  if (!io) return;
  io.to("admin").emit("client-updated", { clientId, clientData });
  console.log("[WebSocket] Cliente actualizado emitido:", clientId);
}

/**
 * Emitir evento de conversación actualizada
 */
export function emitConversationUpdated(conversationId: string) {
  if (!io) return;
  io.to("admin").emit("conversation-updated", { conversationId });
  console.log("[WebSocket] Conversación actualizada emitida:", conversationId);
}

/**
 * Emitir evento de métrica actualizada
 */
export function emitMetricsUpdated(metrics: any) {
  if (!io) return;
  io.to("admin").emit("metrics-updated", metrics);
  console.log("[WebSocket] Métricas actualizadas emitidas");
}
