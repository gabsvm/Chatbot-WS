import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, CheckCircle, TrendingUp, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Datos de ejemplo para gráficos
const conversationData = [
  { day: "Lun", conversations: 12, appointments: 3 },
  { day: "Mar", conversations: 19, appointments: 5 },
  { day: "Mié", conversations: 15, appointments: 4 },
  { day: "Jue", conversations: 22, appointments: 6 },
  { day: "Vie", conversations: 18, appointments: 5 },
  { day: "Sáb", conversations: 8, appointments: 2 },
  { day: "Dom", conversations: 5, appointments: 1 },
];

const conversionData = [
  { name: "Visitantes", value: 400 },
  { name: "Leads", value: 120 },
  { name: "Citas", value: 45 },
  { name: "Conversiones", value: 18 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const topClientsData = [
  { name: "Juan García", interactions: 12, appointments: 3, status: "Hot" },
  { name: "María López", interactions: 10, appointments: 2, status: "Warm" },
  { name: "Carlos Rodríguez", interactions: 8, appointments: 2, status: "Warm" },
  { name: "Ana Martínez", interactions: 7, appointments: 1, status: "Cold" },
  { name: "Pedro Sánchez", interactions: 6, appointments: 1, status: "Cold" },
];

export default function DashboardWithCharts() {
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

  const handleDownloadProject = async () => {
    try {
      // Llamar al endpoint para descargar el ZIP
      const response = await fetch("/api/download-project");
      if (!response.ok) throw new Error("Error descargando proyecto");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "moto-electrica-chatbot.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error descargando proyecto:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Avanzado</h1>
              <p className="text-gray-600">Análisis y métricas del chatbot</p>
            </div>
            <Button onClick={handleDownloadProject} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Descargar Proyecto
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando métricas...</p>
          </div>
        ) : (
          <>
            {/* KPIs */}
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
                    <p className="text-gray-600 text-sm">Pendientes</p>
                    <p className="text-3xl font-bold mt-2">
                      {metrics?.pendingAppointments || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
                </div>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Conversaciones por día */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Conversaciones por Día
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={conversationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="conversations"
                      stroke="#3b82f6"
                      name="Conversaciones"
                    />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#10b981"
                      name="Citas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Embudo de conversión */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Embudo de Conversión
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conversionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {conversionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Tabla de clientes principales */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Clientes Principales
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">
                        Nombre
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Interacciones
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Citas
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topClientsData.map((client, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{client.name}</td>
                        <td className="py-3 px-4">{client.interactions}</td>
                        <td className="py-3 px-4">{client.appointments}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                              client.status === "Hot"
                                ? "bg-red-100 text-red-800"
                                : client.status === "Warm"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
