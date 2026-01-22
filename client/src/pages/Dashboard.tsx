import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, CheckCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            No tienes permiso para acceder a esta página
          </p>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const { data: metrics, isLoading } = trpc.dashboard.metrics.useQuery();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Métricas y análisis del chatbot</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando métricas...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Clientes</p>
                  <p className="text-3xl font-bold mt-2">
                    {metrics?.totalClients || 0}
                  </p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Citas</p>
                  <p className="text-3xl font-bold mt-2">
                    {metrics?.totalAppointments || 0}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Citas Hoy</p>
                  <p className="text-3xl font-bold mt-2">
                    {metrics?.todayAppointments || 0}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Citas Pendientes</p>
                  <p className="text-3xl font-bold mt-2">
                    {metrics?.pendingAppointments || 0}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/clients")}
              >
                Ver todos los clientes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/appointments")}
              >
                Ver todas las citas
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/motorcycles")}
              >
                Gestionar motos
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <strong>Webhook URL:</strong>
              </p>
              <code className="bg-gray-100 p-2 rounded block break-all text-xs">
                {window.location.origin}/api/webhooks/whatsapp
              </code>
              <p className="mt-4 text-xs">
                Configura esta URL en Meta Developer App para recibir mensajes de
                WhatsApp
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
