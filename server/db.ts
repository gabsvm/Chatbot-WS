import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, motorcycles, clients, conversations, appointments, chatMetrics, InsertClient, InsertConversation, InsertAppointment } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Motorcycles queries
export async function getAllMotorcycles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(motorcycles).where(eq(motorcycles.isActive, 'true'));
}

export async function getMotorcycleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(motorcycles).where(eq(motorcycles.id, id)).limit(1);
  return result[0];
}

// Clients queries
export async function getClientByWhatsappPhone(phone: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.whatsappPhone, phone)).limit(1);
  return result[0];
}

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(clients).values(client);
  return result;
}

export async function updateClient(id: number, updates: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(clients).set(updates).where(eq(clients.id, id));
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).orderBy(desc(clients.lastMessageAt));
}

// Conversations queries
export async function addConversation(conversation: InsertConversation) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(conversations).values(conversation);
}

export async function getConversationHistory(clientId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(conversations)
    .where(eq(conversations.clientId, clientId))
    .orderBy(desc(conversations.createdAt))
    .limit(limit);
}

// Appointments queries
export async function createAppointment(appointment: InsertAppointment) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(appointments).values(appointment);
}

export async function getAppointmentsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appointments).where(eq(appointments.clientId, clientId));
}

export async function getAllAppointments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
}

export async function updateAppointment(id: number, updates: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(appointments).set(updates).where(eq(appointments.id, id));
}

// Chat metrics queries
export async function getChatMetrics(date: Date) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chatMetrics)
    .where(eq(chatMetrics.date, date))
    .limit(1);
  return result[0];
}
