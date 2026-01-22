import { Request, Response } from "express";
import { generatePDFReport, generateExcelReport } from "../services/reportService";

/**
 * Descargar reporte en PDF
 * GET /api/reports/pdf?startDate=2024-01-01&endDate=2024-12-31
 */
export async function handleDownloadPDFReport(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        error: "startDate y endDate son requeridos",
      });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    console.log("[Reports] Generando PDF:", start, "-", end);

    const pdfBuffer = await generatePDFReport(start, end);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reporte-${start.toISOString().split("T")[0]}-${end.toISOString().split("T")[0]}.pdf`
    );

    res.send(pdfBuffer);

    console.log("[Reports] PDF generado exitosamente");
  } catch (error) {
    console.error("[Reports] Error generando PDF:", error);
    res.status(500).json({
      error: "Error al generar el reporte PDF",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Descargar reporte en Excel
 * GET /api/reports/excel?startDate=2024-01-01&endDate=2024-12-31
 */
export async function handleDownloadExcelReport(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        error: "startDate y endDate son requeridos",
      });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    console.log("[Reports] Generando Excel:", start, "-", end);

    const excelBuffer = await generateExcelReport(start, end);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reporte-${start.toISOString().split("T")[0]}-${end.toISOString().split("T")[0]}.xlsx`
    );

    res.send(excelBuffer);

    console.log("[Reports] Excel generado exitosamente");
  } catch (error) {
    console.error("[Reports] Error generando Excel:", error);
    res.status(500).json({
      error: "Error al generar el reporte Excel",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
