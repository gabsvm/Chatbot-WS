import { Request, Response } from "express";
import {
  parseWhatsAppWebhook,
  verifyWhatsAppWebhook,
  WhatsAppWebhookPayload,
} from "../services/whatsappService";
import { handleIncomingMessage } from "../services/chatbotService";

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "your_verify_token";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";

export function handleWhatsAppWebhookGET(req: Request, res: Response) {
  const challenge = verifyWhatsAppWebhook(
    req.query as Record<string, string>,
    WHATSAPP_VERIFY_TOKEN
  );

  if (challenge) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Forbidden");
  }
}

export async function handleWhatsAppWebhookPOST(req: Request, res: Response) {
  try {
    const payload: WhatsAppWebhookPayload = req.body;

    // Verificar que sea un webhook válido
    if (payload.object !== "whatsapp_business_account") {
      res.status(400).send("Invalid webhook");
      return;
    }

    // Parsear el webhook
    const parsed = parseWhatsAppWebhook(payload);
    if (!parsed) {
      res.status(200).send("ok");
      return;
    }

    // Procesar cada mensaje
    for (const message of parsed.messages) {
      await handleIncomingMessage(
        message.from,
        message.text,
        message.senderName,
        {
          phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
          recipientPhone: message.from,
          accessToken: WHATSAPP_ACCESS_TOKEN,
        }
      );
    }

    res.status(200).send("ok");
  } catch (error) {
    console.error("[WhatsApp Webhook] Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
