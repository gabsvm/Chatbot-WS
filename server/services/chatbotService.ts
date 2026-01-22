import {
  getClientByWhatsappPhone,
  createClient,
  updateClient,
  addConversation,
  getConversationHistory,
  getAllMotorcycles,
} from "../db";
import {
  processMessageWithGemini,
  isValidAppointmentTime,
  ConversationMessage,
} from "./geminiService";
import { sendWhatsAppMessage, sendWhatsAppImage } from "./whatsappService";
import { sendAppointmentConfirmationEmail } from "./emailService";
import { createCalendarEvent } from "./googleCalendarService";

export interface ChatbotContext {
  phoneNumberId: string;
  recipientPhone: string;
  accessToken: string;
}

export async function handleIncomingMessage(
  senderPhone: string,
  messageText: string,
  senderName: string | undefined,
  context: ChatbotContext
): Promise<void> {
  try {
    const normalizedPhone = senderPhone.replace(/\D/g, "");

    let client = await getClientByWhatsappPhone(normalizedPhone);

    if (!client) {
      await createClient({
        whatsappPhone: normalizedPhone,
        name: senderName,
        conversationState: "initial",
      });

      client = await getClientByWhatsappPhone(normalizedPhone);
    }

    if (!client) {
      console.error("[Chatbot] Failed to create/retrieve client");
      return;
    }

    await addConversation({
      clientId: client.id,
      messageType: "incoming",
      senderType: "client",
      content: messageText,
      whatsappMessageId: undefined,
    });

    const rawHistory = await getConversationHistory(client.id, 10);
    const conversationHistory: ConversationMessage[] = rawHistory
      .reverse()
      .map((msg) => ({
        role: msg.senderType === "client" ? "user" : "assistant",
        content: msg.content,
      }));

    const geminiResponse = await processMessageWithGemini(
      messageText,
      conversationHistory,
      {
        name: client.name || undefined,
        budget: client.budget || undefined,
        interests: client.interests || undefined,
        usageType: client.usageType || undefined,
      }
    );

    await addConversation({
      clientId: client.id,
      messageType: "outgoing",
      senderType: "bot",
      content: geminiResponse.message,
      metadata: JSON.stringify({
        action: geminiResponse.action,
        actionData: geminiResponse.actionData,
      }),
    });

    await processGeminiAction(
      client.id,
      geminiResponse.action,
      geminiResponse.actionData,
      context,
      normalizedPhone
    );

    await sendWhatsAppMessage(
      context.phoneNumberId,
      normalizedPhone,
      geminiResponse.message,
      context.accessToken
    );

    await updateClient(client.id, {
      lastMessageAt: new Date(),
    });
  } catch (error) {
    console.error("[Chatbot] Error handling incoming message:", error);
  }
}

async function processGeminiAction(
  clientId: number,
  action: string | undefined,
  actionData: Record<string, unknown> | undefined,
  context: ChatbotContext,
  recipientPhone: string
): Promise<void> {
  try {
    switch (action) {
      case "recommend": {
        const motorcycleIds = (actionData?.motorcycleIds as number[]) || [];
        const motorcycles = await getAllMotorcycles();
        const recommended = motorcycles.filter((m) =>
          motorcycleIds.includes(m.id)
        );

        for (const moto of recommended) {
          if (moto.imageUrl) {
            await sendWhatsAppImage(
              context.phoneNumberId,
              recipientPhone,
              moto.imageUrl,
              `${moto.name} ${moto.model} - $${(moto.price / 100).toFixed(2)}`,
              context.accessToken
            );
          }
        }
        break;
      }

      case "gather_info": {
        break;
      }

      case "schedule_appointment": {
        const preferredDate = actionData?.preferredDate as string | undefined;
        const preferredTime = actionData?.preferredTime as string | undefined;

        if (preferredDate && preferredTime) {
          const appointmentDateTime = new Date(
            `${preferredDate}T${preferredTime}`
          );
          if (isValidAppointmentTime(appointmentDateTime)) {
            console.log(
              `[Chatbot] Appointment scheduled for ${appointmentDateTime}`
            );
          }
        }
        break;
      }

      case "provide_info": {
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("[Chatbot] Error processing Gemini action:", error);
  }
}
