import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { handleWhatsAppWebhookGET, handleWhatsAppWebhookPOST } from "../webhooks/whatsappWebhook";
import { handleDownloadProject, handleProjectInfo } from "../routes/downloadProject";
import { handleDownloadPDFReport, handleDownloadExcelReport } from "../routes/reportRoutes";
import { setupImageUploadMiddleware } from "../routes/uploadImage";
import { initializeWebSocket } from "../services/websocketService";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Inicializar WebSocket
  initializeWebSocket(server);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Setup image upload middleware
  setupImageUploadMiddleware(app);
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // WhatsApp webhook
  app.get("/api/webhooks/whatsapp", handleWhatsAppWebhookGET);
  app.post("/api/webhooks/whatsapp", handleWhatsAppWebhookPOST);
  
  // Project download endpoints
  app.get("/api/download-project", handleDownloadProject);
  app.get("/api/project-info", handleProjectInfo);
  
  // Report endpoints
  app.get("/api/reports/pdf", handleDownloadPDFReport);
  app.get("/api/reports/excel", handleDownloadExcelReport);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  console.log("[Server] WebSocket inicializado");

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

export { startServer };
