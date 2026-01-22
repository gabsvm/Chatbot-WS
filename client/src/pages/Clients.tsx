import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft, Search, MessageCircle } from "lucide-react";

export default function Clients() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: clients, isLoading } = trpc.clients.list.useQuery();

  const filteredClients = clients?.filter(
    (client: any) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.whatsappPhone.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-gray-600">
            Total de clientes: {clients?.length || 0}
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando clientes...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No hay clientes que coincidan con la búsqueda</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredClients.map((client: any) => (
              <Card
                key={client.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {client.name || "Cliente sin nombre"}
                    </h3>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>
                        <strong>WhatsApp:</strong> {client.whatsappPhone}
                      </p>
                      {client.email && (
                        <p>
                          <strong>Email:</strong> {client.email}
                        </p>
                      )}
                      {client.budget && (
                        <p>
                          <strong>Presupuesto:</strong> ${(client.budget / 100).toFixed(2)}
                        </p>
                      )}
                      {client.usageType && (
                        <p>
                          <strong>Tipo de uso:</strong> {client.usageType}
                        </p>
                      )}
                    </div>
                    <div className="mt-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {client.conversationState}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Último mensaje:{" "}
                      {client.lastMessageAt
                        ? new Date(client.lastMessageAt).toLocaleDateString("es-ES")
                        : "N/A"}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://wa.me/${client.whatsappPhone}`,
                          "_blank"
                        );
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
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
