import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft, MessageCircle, Calendar, Save } from "lucide-react";
import { toast } from "sonner";

export default function ClientDetails({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const clientId = parseInt(params.id);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            No tienes permiso para acceder a esta página
          </p>
          <Button onClick={() => navigate("/clients")}>Volver a clientes</Button>
        </div>
      </div>
    );
  }

  const { data: client, isLoading: clientLoading } = trpc.clients.getById.useQuery({
    id: clientId,
  });

  const { data: conversations, isLoading: conversationsLoading } =
    trpc.conversations.getHistory.useQuery({
      clientId,
    });

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      // TODO: Implementar mutación para guardar notas
      toast.success("Notas guardadas correctamente");
    } catch (error) {
      toast.error("Error al guardar las notas");
    } finally {
      setIsSaving(false);
    }
  };

  if (clientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando cliente...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Cliente no encontrado</p>
          <Button onClick={() => navigate("/clients")}>Volver a clientes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/clients")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Clientes
        </Button>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h1 className="text-3xl font-bold mb-4">
                {client.name || "Cliente sin nombre"}
              </h1>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="font-semibold">{client.whatsappPhone}</p>
                </div>
                {client.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{client.email}</p>
                  </div>
                )}
                {client.budget && (
                  <div>
                    <p className="text-sm text-gray-600">Presupuesto</p>
                    <p className="font-semibold">
                      ${(client.budget / 100).toFixed(2)}
                    </p>
                  </div>
                )}
                {client.usageType && (
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Uso</p>
                    <p className="font-semibold">{client.usageType}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Estado de Conversación</p>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    client.conversationState === "initial"
                      ? "bg-blue-100 text-blue-800"
                      : client.conversationState === "gathering_info"
                      ? "bg-yellow-100 text-yellow-800"
                      : client.conversationState === "recommending"
                      ? "bg-purple-100 text-purple-800"
                      : client.conversationState === "scheduling"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {client.conversationState}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(
                      `https://wa.me/${client.whatsappPhone}`,
                      "_blank"
                    );
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Información Rápida</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Primer Contacto</p>
                  <p className="font-medium">
                    {client.createdAt
                      ? new Date(client.createdAt).toLocaleDateString("es-ES")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Último Mensaje</p>
                  <p className="font-medium">
                    {client.lastMessageAt
                      ? new Date(client.lastMessageAt).toLocaleDateString("es-ES")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Intereses</p>
                  <p className="font-medium">
                    {client.interests || "No especificados"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Historial de Conversaciones</h2>

              {conversationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Cargando conversaciones...</p>
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversations.map((msg: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.senderType === "client"
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "bg-gray-50 border-l-4 border-gray-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-sm">
                          {msg.senderType === "client" ? "Cliente" : "Bot"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString("es-ES")
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay conversaciones registradas
                </p>
              )}
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Notas del Asesor</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega notas sobre este cliente..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-4"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar Notas"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
