import axios from "axios";

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: string;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: WhatsAppMessage[];
      };
      field: string;
    }>;
  }>;
}

/**
 * Envía un mensaje a WhatsApp
 */
export async function sendWhatsAppMessage(
  phoneNumberId: string,
  recipientPhone: string,
  message: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await axios.post(
      `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhone,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[WhatsApp] Message sent successfully:", response.data);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Error sending message:", error);
    return false;
  }
}

/**
 * Envía una imagen a WhatsApp
 */
export async function sendWhatsAppImage(
  phoneNumberId: string,
  recipientPhone: string,
  imageUrl: string,
  caption: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await axios.post(
      `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhone,
        type: "image",
        image: {
          link: imageUrl,
        },
        caption: caption,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[WhatsApp] Image sent successfully:", response.data);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Error sending image:", error);
    return false;
  }
}

/**
 * Extrae información del webhook de WhatsApp
 */
export function parseWhatsAppWebhook(payload: WhatsAppWebhookPayload): {
  phoneNumberId: string;
  displayPhoneNumber: string;
  messages: Array<{
    from: string;
    id: string;
    text: string;
    timestamp: string;
    senderName?: string;
  }>;
} | null {
  try {
    const entry = payload.entry[0];
    if (!entry) return null;

    const change = entry.changes[0];
    if (!change) return null;

    const value = change.value;
    if (!value.messages || value.messages.length === 0) return null;

    const phoneNumberId = value.metadata.phone_number_id;
    const displayPhoneNumber = value.metadata.display_phone_number;

    const messages = value.messages.map((msg: WhatsAppMessage) => ({
      from: msg.from,
      id: msg.id,
      text: msg.text?.body || "",
      timestamp: msg.timestamp,
      senderName: value.contacts?.[0]?.profile?.name,
    }));

    return {
      phoneNumberId,
      displayPhoneNumber,
      messages,
    };
  } catch (error) {
    console.error("[WhatsApp] Error parsing webhook:", error);
    return null;
  }
}

/**
 * Verifica el webhook de WhatsApp (desafío de verificación)
 */
export function verifyWhatsAppWebhook(
  queryParams: Record<string, string>,
  verifyToken: string
): string | null {
  const mode = queryParams["hub.mode"];
  const token = queryParams["hub.verify_token"];
  const challenge = queryParams["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp] Webhook verified successfully");
    return challenge;
  }

  console.error("[WhatsApp] Webhook verification failed");
  return null;
}
