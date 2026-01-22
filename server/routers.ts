import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  getAllMotorcycles,
  getMotorcycleById,
  getAllClients,
  getAllAppointments,
  updateAppointment,
  createAppointment,
  getConversationHistory,
  getDb,
} from "./db";
import { isValidAppointmentTime } from "./services/geminiService";
import { clients } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  motorcycles: router({
    list: publicProcedure.query(async () => {
      return getAllMotorcycles();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getMotorcycleById(input.id);
      }),
  }),

  clients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return getAllClients();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const db = await getDb();
        if (!db) return null;
        const result = await db
          .select()
          .from(clients)
          .where(eq(clients.id, input.id))
          .limit(1);
        return result[0] || null;
      }),
  }),

  appointments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return getAllAppointments();
    }),
    create: protectedProcedure
      .input(
        z.object({
          clientId: z.number(),
          motorcycleId: z.number().optional(),
          appointmentDate: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!isValidAppointmentTime(input.appointmentDate)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Appointment time must be Monday-Friday, 11 AM - 6 PM",
          });
        }
        return createAppointment({
          clientId: input.clientId,
          advisorId: ctx.user?.id,
          motorcycleId: input.motorcycleId,
          appointmentDate: input.appointmentDate,
          status: "pending",
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum([
            "pending",
            "confirmed",
            "completed",
            "cancelled",
            "no_show",
          ]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return updateAppointment(input.id, { status: input.status });
      }),
  }),

  conversations: router({
    getHistory: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return getConversationHistory(input.clientId, 50);
      }),
  }),

  dashboard: router({
    metrics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const clientsList = await getAllClients();
      const appointmentsList = await getAllAppointments();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAppointments = appointmentsList.filter(
        (a: any) =>
          new Date(a.appointmentDate).toDateString() === today.toDateString()
      );
      return {
        totalClients: clientsList.length,
        totalAppointments: appointmentsList.length,
        todayAppointments: todayAppointments.length,
        pendingAppointments: appointmentsList.filter(
          (a: any) => a.status === "pending"
        ).length,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
