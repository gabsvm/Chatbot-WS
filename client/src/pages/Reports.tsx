import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Reports() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/reports/pdf?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Error descargando PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${startDate}-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al descargar el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/reports/excel?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Error descargando Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${startDate}-${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Excel descargado exitosamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al descargar el Excel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold mb-8">Exportar Reportes</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Seleccionar Período</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={isLoading}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>

            <Button
              onClick={handleDownloadExcel}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Excel
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Contenido del Reporte
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Resumen</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Total de clientes creados en el período</li>
                <li>Total de citas agendadas</li>
                <li>Total de conversaciones</li>
                <li>Citas completadas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Citas</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Nombre del cliente</li>
                <li>Teléfono y email</li>
                <li>Fecha y hora de la cita</li>
                <li>Estado (pendiente, confirmada, completada, cancelada)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Clientes</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Nombre y contacto</li>
                <li>Presupuesto</li>
                <li>Intereses en motos</li>
                <li>Fecha de creación</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
