import { Request, Response } from "express";
import type { Express } from "express";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

/**
 * Endpoint para subir imágenes a S3
 * POST /api/upload-image
 */
export async function handleUploadImage(
  req: any,
  res: Response
): Promise<void> {
  try {
    // Obtener archivo del request
    const file = (req as any).file;

    if (!file) {
      res.status(400).json({
        error: "No se proporcionó archivo",
      });
      return;
    }

    // Validar tipo de archivo
    if (!file.mimetype.startsWith("image/")) {
      res.status(400).json({
        error: "El archivo debe ser una imagen",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      res.status(400).json({
        error: "La imagen no debe superar 5MB",
      });
      return;
    }

    console.log("[ImageUpload] Subiendo imagen:", {
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    // Generar nombre único para el archivo
    const fileExtension = file.originalname.split(".").pop() || "jpg";
    const fileName = `motorcycles/${Date.now()}-${nanoid()}.${fileExtension}`;

    // Subir a S3
    const { url } = await storagePut(fileName, file.buffer, file.mimetype);

    console.log("[ImageUpload] Imagen subida exitosamente:", url);

    res.json({
      url,
      filename: fileName,
    });
  } catch (error) {
    console.error("[ImageUpload] Error:", error);
    res.status(500).json({
      error: "Error al subir la imagen",
    });
  }
}

/**
 * Middleware para parsear archivos multipart/form-data
 * Usa multer para procesar uploads
 */
export async function setupImageUploadMiddleware(app: any) {
  try {
    const multer = (await import("multer")).default;
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Solo se permiten imágenes"));
        }
      },
    });

    app.post("/api/upload-image", upload.single("file"), handleUploadImage);
    console.log("[ImageUpload] Middleware configurado exitosamente");
  } catch (error) {
    console.error("[ImageUpload] Error setting up middleware:", error);
    console.log(
      "[ImageUpload] Multer no está instalado o no se pudo cargar. Instala con: npm install multer @types/multer"
    );
  }
}
