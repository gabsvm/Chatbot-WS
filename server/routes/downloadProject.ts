import { Request, Response } from "express";
import archiver from "archiver";
import { createReadStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Endpoint para descargar el proyecto completo como ZIP
 * GET /api/download-project
 */
export async function handleDownloadProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const projectRoot = path.resolve(__dirname, "../../../..");

    console.log("[Download] Iniciando descarga del proyecto desde:", projectRoot);

    // Configurar headers para descarga
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=moto-electrica-chatbot.zip"
    );

    // Crear archivo ZIP
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Máxima compresión
    });

    // Manejar errores del archivo
    archive.on("error", (err: any) => {
      console.error("[Download] Error en archiver:", err);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Error al crear el archivo ZIP",
        });
      }
    });

    // Pipe del archivo al response
    archive.pipe(res);

    // Agregar archivos al ZIP, excluyendo directorios innecesarios
    archive.glob("**/*", {
      cwd: projectRoot,
      ignore: [
        "node_modules/**",
        ".git/**",
        "dist/**",
        ".manus-logs/**",
        "*.log",
        ".env",
        ".env.local",
        ".DS_Store",
        "**/.DS_Store",
      ],
    });

    console.log("[Download] Finalizando archivo ZIP...");

    // Finalizar el archivo
    await archive.finalize();

    console.log("[Download] Descarga completada exitosamente");
  } catch (error) {
    console.error("[Download] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Error al descargar el proyecto",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

/**
 * Endpoint alternativo que retorna información del proyecto
 * GET /api/project-info
 */
export async function handleProjectInfo(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Obtener información del proyecto
    const info = {
      name: "moto-electrica-chatbot",
      version: "1.0.0",
      description:
        "Chatbot WhatsApp con Gemini API para venta de motos eléctricas",
      features: [
        "Webhook de WhatsApp",
        "Integración con Gemini API",
        "Gestión de clientes",
        "Sistema de citas",
        "Panel de administración",
        "Dashboard de métricas",
        "Gestión CRUD de motos",
        "Notificaciones por email",
        "Integración Google Calendar",
        "Carga de imágenes en S3",
        "Notificaciones en tiempo real",
        "Plantillas de respuesta",
        "Exportación de reportes",
      ],
      files: {
        backend: [
          "server/services/geminiService.ts",
          "server/services/whatsappService.ts",
          "server/services/chatbotService.ts",
          "server/services/emailService.ts",
          "server/services/googleCalendarService.ts",
          "server/webhooks/whatsappWebhook.ts",
          "server/db.ts",
          "server/routers.ts",
        ],
        frontend: [
          "client/src/pages/Home.tsx",
          "client/src/pages/Clients.tsx",
          "client/src/pages/ClientDetails.tsx",
          "client/src/pages/Appointments.tsx",
          "client/src/pages/Dashboard.tsx",
          "client/src/pages/DashboardWithCharts.tsx",
          "client/src/pages/Motorcycles.tsx",
          "client/src/pages/WhatsAppSetupGuide.tsx",
        ],
        database: ["drizzle/schema.ts"],
        documentation: [
          "README_CHATBOT.md",
          "SETUP_GUIDE.md",
          "FEATURES_GUIDE.md",
        ],
      },
      downloadUrl: "/api/download-project",
    };

    res.json(info);
  } catch (error) {
    console.error("[ProjectInfo] Error:", error);
    res.status(500).json({
      error: "Error al obtener información del proyecto",
    });
  }
}
