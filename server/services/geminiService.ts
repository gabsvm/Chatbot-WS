import { invokeLLM } from "../_core/llm";
import { getAllMotorcycles } from "../db";

export interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GeminiResponse {
  message: string;
  action?: "recommend" | "gather_info" | "schedule_appointment" | "provide_info" | "none";
  actionData?: Record<string, unknown>;
}

/**
 * Procesa un mensaje del cliente con Gemini API
 * Retorna la respuesta del bot y acciones a ejecutar
 */
export async function processMessageWithGemini(
  clientMessage: string,
  conversationHistory: ConversationMessage[],
  clientInfo?: {
    name?: string;
    budget?: number;
    interests?: string;
    usageType?: string;
  }
): Promise<GeminiResponse> {
  try {
    // Obtener lista de motos disponibles
    const motorcycles = await getAllMotorcycles();
    const motorcyclesList = motorcycles
      .map(
        (m) =>
          `- ${m.name} ${m.model}: $${(m.price / 100).toFixed(2)} - ${m.category} - Rango: ${m.range}, Velocidad máx: ${m.maxSpeed} km/h`
      )
      .join("\n");

    // Construir el system prompt
    const systemPrompt = `Eres un asesor de ventas profesional y amigable especializado en motos eléctricas. Tu objetivo es:

1. Saludar al cliente de manera cálida
2. Entender sus necesidades (presupuesto, tipo de uso, preferencias)
3. Recomendar motos eléctricas basadas en su perfil
4. Ayudar a agendar citas (disponibles de lunes a viernes, 11:00 AM a 6:00 PM)
5. Recopilar información de contacto (nombre, teléfono, email)

MOTOS DISPONIBLES:
${motorcyclesList}

INFORMACIÓN DEL CLIENTE ACTUAL:
${clientInfo ? `- Nombre: ${clientInfo.name || "No proporcionado"}
- Presupuesto: ${clientInfo.budget ? `$${(clientInfo.budget / 100).toFixed(2)}` : "No proporcionado"}
- Tipo de uso: ${clientInfo.usageType || "No proporcionado"}
- Intereses: ${clientInfo.interests || "No proporcionado"}` : "Cliente nuevo"}

INSTRUCCIONES IMPORTANTES:
- Mantén respuestas concisas (máximo 2-3 párrafos) para WhatsApp
- Usa un tono profesional pero amigable
- Si el cliente pregunta sobre una moto específica, proporciona detalles técnicos
- Si quiere agendar cita, confirma disponibilidad (L-V 11-18h)
- Extrae información del cliente gradualmente sin ser invasivo
- Si el cliente está listo para cita, solicita: nombre completo, teléfono de contacto, fecha/hora preferida

RESPONDE EN FORMATO JSON CON ESTA ESTRUCTURA:
{
  "message": "Tu respuesta al cliente",
  "action": "recommend|gather_info|schedule_appointment|provide_info|none",
  "actionData": {
    "key": "value"
  }
}

Ejemplos de actionData:
- Para "recommend": {"motorcycleIds": [1, 2], "reason": "Se adaptan a tu presupuesto"}
- Para "gather_info": {"field": "budget", "question": "¿Cuál es tu presupuesto?"}
- Para "schedule_appointment": {"preferredDate": "2026-01-25", "preferredTime": "14:00"}
- Para "provide_info": {"topic": "battery_life", "details": "..."}`;

    // Construir mensajes para Gemini
    const messages: ConversationMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: clientMessage },
    ];

    // Llamar a Gemini API
    const response = await invokeLLM({
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extraer el contenido de la respuesta
    const responseContent = response.choices[0]?.message?.content;
    const responseText = typeof responseContent === 'string' ? responseContent : 
                         Array.isArray(responseContent) ? 
                         responseContent.find(c => c.type === 'text')?.text || '' : '';

    if (!responseText) {
      throw new Error("No response from Gemini API");
    }

    // Parsear la respuesta JSON
    try {
      const parsed = JSON.parse(responseText);
      return {
        message: parsed.message || "Disculpa, no entendí bien. ¿Podrías repetir?",
        action: parsed.action || "none",
        actionData: parsed.actionData || {},
      };
    } catch (parseError) {
      // Si no es JSON válido, retornar como mensaje simple
      return {
        message: responseText,
        action: "none",
      };
    }
  } catch (error) {
    console.error("[Gemini Service] Error processing message:", error);
    throw error;
  }
}

/**
 * Extrae información del cliente de la respuesta de Gemini
 */
export function extractClientInfo(
  actionData: Record<string, unknown> | undefined
): {
  field?: string;
  value?: unknown;
} {
  if (!actionData) return {};

  if (actionData.field && actionData.value) {
    return {
      field: actionData.field as string,
      value: actionData.value,
    };
  }

  return {};
}

/**
 * Valida si una fecha/hora es válida para agendar cita
 * Horario: Lunes a Viernes, 11:00 AM a 6:00 PM
 */
export function isValidAppointmentTime(date: Date): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hour = date.getHours();

  // Validar que sea lunes a viernes (1-5)
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    return false;
  }

  // Validar que sea entre 11:00 y 18:00 (6 PM)
  if (hour < 11 || hour >= 18) {
    return false;
  }

  return true;
}
