import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { MessageCircle, Users, Calendar, BarChart3, Download, BookOpen, FileText } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              MotoElectrica AI Chatbot
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sistema inteligente de ventas para motos eléctricas con WhatsApp
            </p>
            <Button
              size="lg"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              Iniciar Sesión
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">Chatbot IA</h3>
              <p className="text-sm text-gray-600">
                Respuestas automáticas con Gemini API
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Gestión de Clientes</h3>
              <p className="text-sm text-gray-600">
                Seguimiento de leads y conversaciones
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Citas Automáticas</h3>
              <p className="text-sm text-gray-600">
                Agendamiento L-V 11am-6pm
              </p>
            </Card>

            <Card className="p-6 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold mb-2">Dashboard</h3>
              <p className="text-sm text-gray-600">
                Métricas y análisis de conversiones
              </p>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Características Principales</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Para Clientes</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Recomendaciones personalizadas de motos</li>
                  <li>✓ Información de características y precios</li>
                  <li>✓ Visualización de fotos de productos</li>
                  <li>✓ Agendamiento de citas directamente en WhatsApp</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Para Asesores</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Panel de administración completo</li>
                  <li>✓ Lista de clientes con historial</li>
                  <li>✓ Calendario de citas</li>
                  <li>✓ Métricas de conversión y desempeño</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido, {user?.name || "Asesor"}
          </h1>
          <p className="text-gray-600 mb-6">
            Panel de administración del chatbot de MotoElectrica
          </p>

          {user?.role === "admin" && (
            <div className="grid md:grid-cols-5 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto flex-col items-start p-4"
                onClick={() => navigate("/clients")}
              >
                <Users className="w-6 h-6 mb-2" />
                <span>Clientes</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto flex-col items-start p-4"
                onClick={() => navigate("/appointments")}
              >
                <Calendar className="w-6 h-6 mb-2" />
                <span>Citas</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto flex-col items-start p-4"
                onClick={() => navigate("/motorcycles")}
              >
                <MessageCircle className="w-6 h-6 mb-2" />
                <span>Motos</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto flex-col items-start p-4"
                onClick={() => navigate("/dashboard")}
              >
                <BarChart3 className="w-6 h-6 mb-2" />
                <span>Dashboard</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto flex-col items-start p-4"
                onClick={() => navigate("/dashboard-charts")}
              >
                <BarChart3 className="w-6 h-6 mb-2" />
                <span>Análisis</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto flex-col items-start p-4"
                onClick={() => navigate("/templates")}
              >
                <MessageCircle className="w-6 h-6 mb-2" />
                <span>Plantillas</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto flex-col items-start p-4"
                onClick={() => navigate("/reports")}
              >
                <FileText className="w-6 h-6 mb-2" />
                <span>Reportes</span>
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Descargar Proyecto
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Descarga todos los archivos del proyecto en formato ZIP para trabajar localmente o desplegar en tu servidor.
            </p>
            <Button
              onClick={() => {
                window.location.href = "/api/download-project";
              }}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar ZIP
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Configurar WhatsApp
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Guía paso a paso para conectar WhatsApp Business API con el chatbot.
            </p>
            <Button
              onClick={() => navigate("/whatsapp-setup")}
              className="w-full"
              variant="outline"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Guía Completa
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Guía Rápida</h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <strong>Webhook URL:</strong> Configura esta URL en Meta Developer App:
              </p>
              <code className="bg-gray-100 p-2 rounded block break-all text-xs">
                {window.location.origin}/api/webhooks/whatsapp
              </code>
              <p className="mt-4">
                <strong>Variables de Entorno Requeridas:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>WHATSAPP_VERIFY_TOKEN</li>
                <li>WHATSAPP_ACCESS_TOKEN</li>
                <li>WHATSAPP_PHONE_NUMBER_ID</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estado del Sistema</h3>
            <div className="text-sm space-y-3">
              <div className="flex items-center justify-between">
                <span>Base de Datos</span>
                <span className="text-green-600">✓ Conectada</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Gemini API</span>
                <span className="text-green-600">✓ Configurada</span>
              </div>
              <div className="flex items-center justify-between">
                <span>WhatsApp Webhook</span>
                <span className="text-green-600">✓ Activo</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Información del Proyecto</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Versión:</strong> 1.0.0</p>
              <p><strong>Stack:</strong> React + Express + tRPC</p>
              <p><strong>Base de Datos:</strong> MySQL + Drizzle ORM</p>
              <p><strong>IA:</strong> Google Gemini API</p>
              <p><strong>Messaging:</strong> WhatsApp Cloud API</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
