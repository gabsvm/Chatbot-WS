import PDFDocument from "pdfkit";
import ExcelJS from "xlsx";
import { getDb } from "../db";
import { clients, appointments, conversations } from "../../drizzle/schema";
import { gte, lte } from "drizzle-orm";

/**
 * Generar reporte en PDF
 */
export async function generatePDFReport(
  startDate: Date,
  endDate: Date
): Promise<Buffer> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Obtener datos del período
  const appointmentsData = await db
    .select()
    .from(appointments)
    .where(
      gte(appointments.appointmentDate, startDate) &&
        lte(appointments.appointmentDate, endDate)
    );

  const clientsData = await db
    .select()
    .from(clients)
    .where(
      gte(clients.createdAt, startDate) && lte(clients.createdAt, endDate)
    );

  const conversationsData = await db
    .select()
    .from(conversations)
    .where(
      gte(conversations.createdAt, startDate) &&
        lte(conversations.createdAt, endDate)
    );

  // Crear documento PDF
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  // Título
  doc.fontSize(24).font("Helvetica-Bold").text("Reporte de Ventas", {
    align: "center",
  });

  // Período
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(
      `Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      { align: "center" }
    );

  doc.moveDown();

  // Resumen
  doc.fontSize(14).font("Helvetica-Bold").text("Resumen");
  doc.fontSize(11).font("Helvetica");
  doc.text(`Total de Clientes: ${clientsData.length}`);
  doc.text(`Total de Citas Agendadas: ${appointmentsData.length}`);
  doc.text(`Total de Conversaciones: ${conversationsData.length}`);
  doc.text(
    `Citas Completadas: ${appointmentsData.filter((a) => a.status === "completed").length}`
  );

  doc.moveDown();

  // Tabla de Citas
  doc.fontSize(14).font("Helvetica-Bold").text("Citas Agendadas");
  doc.fontSize(10).font("Helvetica");

  const tableTop = doc.y;
  const col1 = 50;
  const col2 = 150;
  const col3 = 250;
  const col4 = 350;
  const col5 = 450;

  // Encabezados
  doc
    .font("Helvetica-Bold")
    .text("Cliente", col1, tableTop)
    .text("Teléfono", col2, tableTop)
    .text("Fecha", col3, tableTop)
    .text("Hora", col4, tableTop)
    .text("Estado", col5, tableTop);

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let yPosition = tableTop + 25;

  appointmentsData.slice(0, 10).forEach((apt) => {
    const clientName = clientsData.find((c) => c.id === apt.clientId)?.name || "N/A";
    const clientPhone = clientsData.find((c) => c.id === apt.clientId)?.phone || "N/A";

    doc
      .font("Helvetica")
      .fontSize(9)
      .text(clientName, col1, yPosition, { width: 90 })
      .text(clientPhone, col2, yPosition, { width: 90 })
      .text(new Date(apt.appointmentDate).toLocaleDateString(), col3, yPosition, {
        width: 90,
      })
      .text(new Date(apt.appointmentDate).toLocaleTimeString(), col4, yPosition, { width: 90 })
      .text(apt.status || "Pendiente", col5, yPosition, { width: 90 });

    yPosition += 20;
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

/**
 * Generar reporte en Excel
 */
export async function generateExcelReport(
  startDate: Date,
  endDate: Date
): Promise<Buffer> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Obtener datos
  const appointmentsData = await db
    .select()
    .from(appointments)
    .where(
      gte(appointments.appointmentDate, startDate) &&
        lte(appointments.appointmentDate, endDate)
    );

  const clientsData = await db
    .select()
    .from(clients)
    .where(
      gte(clients.createdAt, startDate) && lte(clients.createdAt, endDate)
    );

  const conversationsData = await db
    .select()
    .from(conversations)
    .where(
      gte(conversations.createdAt, startDate) &&
        lte(conversations.createdAt, endDate)
    );

  // Crear workbook
  const wb = ExcelJS.utils.book_new();

  // Hoja de Resumen
  const summaryData = [
    ["Reporte de Ventas"],
    [
      `Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    ],
    [],
    ["Métrica", "Valor"],
    ["Total de Clientes", clientsData.length],
    ["Total de Citas Agendadas", appointmentsData.length],
    ["Total de Conversaciones", conversationsData.length],
    [
      "Citas Completadas",
      appointmentsData.filter((a) => a.status === "completed").length,
    ],
  ];

  const summarySheet = ExcelJS.utils.aoa_to_sheet(summaryData);
  ExcelJS.utils.book_append_sheet(wb, summarySheet, "Resumen");

  // Hoja de Citas
  const appointmentsSheetData = [
    ["Cliente", "Teléfono", "Email", "Fecha", "Hora", "Estado"],
    ...appointmentsData.map((apt) => {
      const client = clientsData.find((c) => c.id === apt.clientId);
      return [
        client?.name || "N/A",
        client?.phone || "N/A",
        client?.email || "N/A",
        new Date(apt.appointmentDate).toLocaleDateString(),
        new Date(apt.appointmentDate).toLocaleTimeString(),
        apt.status || "Pendiente",
      ];
    }),
  ];

  const appointmentsSheet = ExcelJS.utils.aoa_to_sheet(appointmentsSheetData);
  ExcelJS.utils.book_append_sheet(wb, appointmentsSheet, "Citas");

  // Hoja de Clientes
  const clientsSheetData = [
    ["Nombre", "Teléfono", "Email", "Presupuesto", "Intereses", "Fecha Creación"],
    ...clientsData.map((client) => [
      client.name,
      client.phone,
      client.email || "N/A",
      client.budget || "N/A",
      client.interests || "N/A",
      new Date(client.createdAt).toLocaleDateString(),
    ]),
  ];

  const clientsSheet = ExcelJS.utils.aoa_to_sheet(clientsSheetData);
  ExcelJS.utils.book_append_sheet(wb, clientsSheet, "Clientes");

  // Convertir a buffer
  const buffer = await ExcelJS.write(wb, { type: "buffer" });
  return buffer as unknown as Buffer;
}
