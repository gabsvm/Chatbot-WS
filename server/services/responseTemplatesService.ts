import { getDb } from "../db";
import { responseTemplates } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export interface ResponseTemplate {
  id: number;
  title: string;
  content: string;
  category: "greeting" | "product" | "appointment" | "followup" | "other";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Obtener todas las plantillas
 */
export async function getAllTemplates(): Promise<ResponseTemplate[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Templates] Database not available");
    return [];
  }

  try {
    const templates = await db
      .select()
      .from(responseTemplates)
      .orderBy(desc(responseTemplates.createdAt));

    return templates;
  } catch (error) {
    console.error("[Templates] Error getting templates:", error);
    return [];
  }
}

/**
 * Obtener plantillas por categoría
 */
export async function getTemplatesByCategory(
  category: string
): Promise<ResponseTemplate[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Templates] Database not available");
    return [];
  }

  try {
    const templates = await db
      .select()
      .from(responseTemplates)
      .where(eq(responseTemplates.category, category as any))
      .orderBy(desc(responseTemplates.createdAt));

    return templates;
  } catch (error) {
    console.error("[Templates] Error getting templates by category:", error);
    return [];
  }
}

/**
 * Crear nueva plantilla
 */
export async function createTemplate(
  title: string,
  content: string,
  category: string
): Promise<ResponseTemplate | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Templates] Database not available");
    return null;
  }

  try {
    const result = await db.insert(responseTemplates).values({
      title,
      content,
      category: category as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("[Templates] Template created:", title);

    // Obtener la plantilla creada
    const templates = await db
      .select()
      .from(responseTemplates)
      .orderBy(desc(responseTemplates.createdAt))
      .limit(1);

    return templates[0] || null;
  } catch (error) {
    console.error("[Templates] Error creating template:", error);
    return null;
  }
}

/**
 * Actualizar plantilla
 */
export async function updateTemplate(
  id: number,
  title: string,
  content: string,
  category: string
): Promise<ResponseTemplate | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Templates] Database not available");
    return null;
  }

  try {
    await db
      .update(responseTemplates)
      .set({
        title,
        content,
        category: category as any,
        updatedAt: new Date(),
      })
      .where(eq(responseTemplates.id, id));

    console.log("[Templates] Template updated:", id);

    // Obtener la plantilla actualizada
    const templates = await db
      .select()
      .from(responseTemplates)
      .where(eq(responseTemplates.id, id));

    return templates[0] || null;
  } catch (error) {
    console.error("[Templates] Error updating template:", error);
    return null;
  }
}

/**
 * Eliminar plantilla
 */
export async function deleteTemplate(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Templates] Database not available");
    return false;
  }

  try {
    await db
      .delete(responseTemplates)
      .where(eq(responseTemplates.id, id));

    console.log("[Templates] Template deleted:", id);
    return true;
  } catch (error) {
    console.error("[Templates] Error deleting template:", error);
    return false;
  }
}

/**
 * Obtener plantilla por ID
 */
export async function getTemplateById(
  id: number
): Promise<ResponseTemplate | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Templates] Database not available");
    return null;
  }

  try {
    const templates = await db
      .select()
      .from(responseTemplates)
      .where(eq(responseTemplates.id, id));

    return templates[0] || null;
  } catch (error) {
    console.error("[Templates] Error getting template:", error);
    return null;
  }
}
