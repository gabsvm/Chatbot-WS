import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Motorcycles table
export const motorcycles = mysqlTable("motorcycles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  price: int("price").notNull(), // in cents
  batteryCapacity: varchar("batteryCapacity", { length: 100 }), // e.g., "50 kWh"
  range: varchar("range", { length: 100 }), // e.g., "200 km"
  maxSpeed: int("maxSpeed"), // km/h
  chargingTime: varchar("chargingTime", { length: 100 }), // e.g., "4 hours"
  weight: int("weight"), // kg
  description: text("description"),
  imageUrl: text("imageUrl"),
  category: varchar("category", { length: 100 }), // e.g., "city", "sport", "adventure"
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Motorcycle = typeof motorcycles.$inferSelect;
export type InsertMotorcycle = typeof motorcycles.$inferInsert;

// Clients table
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  whatsappPhone: varchar("whatsappPhone", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  budget: int("budget"), // in cents
  interests: text("interests"), // JSON array of motorcycle IDs
  usageType: varchar("usageType", { length: 100 }), // e.g., "daily commute", "weekend", "sport"
  conversationState: mysqlEnum("conversationState", [
    "initial",
    "gathering_info",
    "recommending",
    "scheduling",
    "completed"
  ]).default("initial").notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// Conversations table
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  messageType: varchar("messageType", { length: 50 }).notNull(), // "incoming" or "outgoing"
  senderType: varchar("senderType", { length: 50 }).notNull(), // "client" or "bot"
  content: text("content").notNull(),
  metadata: text("metadata"), // JSON for storing action data
  whatsappMessageId: varchar("whatsappMessageId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Appointments table
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  advisorId: int("advisorId"), // Reference to users table (advisor)
  motorcycleId: int("motorcycleId"),
  appointmentDate: timestamp("appointmentDate").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "no_show"
  ]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// Appointment slots table (for availability)
export const appointmentSlots = mysqlTable("appointmentSlots", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:mm format
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:mm format
  isAvailable: mysqlEnum("isAvailable", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AppointmentSlot = typeof appointmentSlots.$inferSelect;
export type InsertAppointmentSlot = typeof appointmentSlots.$inferInsert;

// Chat metrics table (for dashboard analytics)
export const chatMetrics = mysqlTable("chatMetrics", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  totalConversations: int("totalConversations").default(0).notNull(),
  totalAppointmentsScheduled: int("totalAppointmentsScheduled").default(0).notNull(),
  totalAppointmentsCompleted: int("totalAppointmentsCompleted").default(0).notNull(),
  totalClientsCreated: int("totalClientsCreated").default(0).notNull(),
  averageConversationLength: int("averageConversationLength").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMetric = typeof chatMetrics.$inferSelect;
export type InsertChatMetric = typeof chatMetrics.$inferInsert;

// Response templates table
export const responseTemplates = mysqlTable("responseTemplates", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", [
    "greeting",
    "product",
    "appointment",
    "followup",
    "other",
  ]).default("other").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResponseTemplate = typeof responseTemplates.$inferSelect;
export type InsertResponseTemplate = typeof responseTemplates.$inferInsert;
