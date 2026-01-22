import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ArrowLeft, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Appointments() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filterStatus, setFilterStatus] = useState<string>("all");

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

  const { data: appointments, isLoading } = trpc.appointments.list.useQuery();
  const updateAppointmentMutation = trpc.appointments.update.useMutation();

  const filteredAppointments = appointments?.filter((apt: any) => {
    if (filterStatus === "all") return true;
    return apt.status === filterStatus;
  }) || [];

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    try {
      await updateAppointmentMutation.mutateAsync({
        id: appointmentId,
        status: newStatus as any,
      });
      toast.success("Cita actualizada");
    } catch (error) {
      toast.error("Error al actualizar la cita");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no_show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      completed: "Completada",
      cancelled: "Cancelada",
      no_show: "No presentarse",
    };
    return labels[status] || status;
  };

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
          <h1 className="text-3xl font-bold">Gestión de Citas</h1>
          <p className="text-gray-600">
            Total de citas: {appointments?.length || 0}
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              Todas ({appointments?.length || 0})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
            >
              Pendientes (
              {appointments?.filter((a: any) => a.status === "pending").length || 0})
            </Button>
            <Button
              variant={filterStatus === "confirmed" ? "default" : "outline"}
              onClick={() => setFilterStatus("confirmed")}
            >
              Confirmadas (
              {appointments?.filter((a: any) => a.status === "confirmed").length || 0})
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              onClick={() => setFilterStatus("completed")}
            >
              Completadas (
              {appointments?.filter((a: any) => a.status === "completed").length || 0})
            </Button>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando citas...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No hay citas en este estado</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments
              .sort(
                (a: any, b: any) =>
                  new Date(b.appointmentDate).getTime() -
                  new Date(a.appointmentDate).getTime()
              )
              .map((appointment: any) => (
                <Card key={appointment.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">
                          {new Date(appointment.appointmentDate).toLocaleString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Cliente ID:</strong> {appointment.clientId}
                        </p>
                        {appointment.motorcycleId && (
                          <p>
                            <strong>Moto ID:</strong> {appointment.motorcycleId}
                          </p>
                        )}
                        {appointment.notes && (
                          <p>
                            <strong>Notas:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block text-xs px-3 py-1 rounded mb-3 ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                      <div className="flex gap-2 flex-col">
                        {appointment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "confirmed")
                              }
                              disabled={updateAppointmentMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(appointment.id, "cancelled")
                              }
                              disabled={updateAppointmentMutation.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              handleUpdateStatus(appointment.id, "completed")
                            }
                            disabled={updateAppointmentMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
