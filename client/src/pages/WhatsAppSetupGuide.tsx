import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, ExternalLink } from "lucide-react";

export default function WhatsAppSetupGuide() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

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

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Guía: Conectar WhatsApp API</h1>
          <p className="text-gray-600">
            Sigue estos pasos para conectar tu número de WhatsApp Business con el chatbot
          </p>
        </div>

        {/* Paso 1 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                1
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Crear Aplicación en Meta Developer
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Primero necesitas crear una aplicación en Meta Developer Console:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    Ve a{" "}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 inline"
                    >
                      developers.facebook.com
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </li>
                  <li>Inicia sesión con tu cuenta de Meta</li>
                  <li>Haz clic en "Mis Aplicaciones" → "Crear Aplicación"</li>
                  <li>Selecciona "Tipo de Aplicación: Empresarial"</li>
                  <li>Completa los detalles de la aplicación</li>
                  <li>
                    En el dashboard, busca "WhatsApp" y haz clic en "Configurar"
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Paso 2 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                2
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Obtener Número de Teléfono de WhatsApp Business
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Necesitas un número de WhatsApp Business verificado:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>En la sección de WhatsApp, ve a "Comenzar"</li>
                  <li>Selecciona o crea una cuenta de WhatsApp Business</li>
                  <li>Verifica tu número de teléfono</li>
                  <li>Completa la información de tu negocio</li>
                  <li>
                    Copia el <strong>WHATSAPP_PHONE_NUMBER_ID</strong> (lo
                    necesitarás después)
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Paso 3 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                3
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Generar Token de Acceso
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Necesitas un token de acceso permanente:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    En el dashboard de tu aplicación, ve a "Configuración" →
                    "Básica"
                  </li>
                  <li>Copia el <strong>App ID</strong> y <strong>App Secret</strong></li>
                  <li>
                    Ve a "Herramientas" → "Explorador de API"
                  </li>
                  <li>
                    Selecciona tu aplicación y genera un token de acceso de
                    usuario
                  </li>
                  <li>
                    Este será tu <strong>WHATSAPP_ACCESS_TOKEN</strong>
                  </li>
                </ol>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mt-4">
                  <p className="text-sm">
                    <strong>⚠️ Importante:</strong> Guarda este token en un lugar
                    seguro. No lo compartas públicamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Paso 4 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                4
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Crear Token de Verificación de Webhook
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Este token se usa para verificar que los webhooks vienen de Meta:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    Elige una cadena aleatoria segura (ej: "abc123xyz789")
                  </li>
                  <li>
                    Este será tu <strong>WHATSAPP_VERIFY_TOKEN</strong>
                  </li>
                  <li>Guárdalo en un lugar seguro</li>
                </ol>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-4">
                  <p className="text-sm font-mono">
                    Ejemplo: <code>verify_token_abc123xyz789</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Paso 5 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                5
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Configurar Variables de Entorno
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Agrega estos valores en el panel de Manus:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Ve a Settings → Secrets en el panel de Manus</li>
                  <li>Agrega las siguientes variables:</li>
                </ol>
                <div className="bg-gray-900 text-gray-100 p-4 rounded mt-4 font-mono text-sm space-y-2">
                  <div>
                    <span className="text-green-400">WHATSAPP_VERIFY_TOKEN</span>
                    =verify_token_abc123xyz789
                  </div>
                  <div>
                    <span className="text-green-400">WHATSAPP_ACCESS_TOKEN</span>
                    =EAABs...
                  </div>
                  <div>
                    <span className="text-green-400">WHATSAPP_PHONE_NUMBER_ID</span>
                    =123456789
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Paso 6 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                6
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Configurar Webhook en Meta
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Ahora configura el webhook en Meta Developer:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    En tu aplicación de Meta, ve a "Configuración" →
                    "Webhooks"
                  </li>
                  <li>Haz clic en "Editar Suscripción"</li>
                  <li>
                    En "URL de Callback", ingresa:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {window.location.origin}/api/webhooks/whatsapp
                    </code>
                  </li>
                  <li>
                    En "Token de Verificación", ingresa el{" "}
                    <strong>WHATSAPP_VERIFY_TOKEN</strong> que creaste
                  </li>
                  <li>Haz clic en "Verificar y Guardar"</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Paso 7 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                7
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Suscribirse a Eventos de Webhook
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Configura qué eventos quieres recibir:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>En "Webhooks", haz clic en "Editar Suscripción"</li>
                  <li>Selecciona los eventos que quieres recibir:</li>
                </ol>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>messages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>message_template_status_update</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>message_template_quality_update</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Paso 8 */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                8
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                Probar la Conexión
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Verifica que todo funciona correctamente:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    Envía un mensaje de prueba a tu número de WhatsApp Business
                  </li>
                  <li>
                    El chatbot debería responder automáticamente con un mensaje
                    de bienvenida
                  </li>
                  <li>
                    Revisa los logs en el panel de Manus para ver los mensajes
                    recibidos
                  </li>
                </ol>
                <div className="bg-green-50 border border-green-200 p-4 rounded mt-4">
                  <p className="text-sm">
                    <strong>✓ ¡Listo!</strong> Tu chatbot de WhatsApp está
                    conectado y funcionando.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Troubleshooting */}
        <Card className="p-8 mb-6 bg-red-50 border-red-200">
          <h2 className="text-2xl font-bold mb-4">Solución de Problemas</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                El webhook no se verifica
              </h3>
              <p className="text-gray-700">
                Verifica que el WHATSAPP_VERIFY_TOKEN sea exactamente igual en
                ambos lugares (Manus y Meta). Asegúrate de que la URL del
                webhook sea accesible públicamente.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                No recibo mensajes
              </h3>
              <p className="text-gray-700">
                Verifica que el número de teléfono esté verificado en WhatsApp
                Business. Revisa que los eventos "messages" estén suscritos en
                el webhook.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                El token de acceso expiró
              </h3>
              <p className="text-gray-700">
                Los tokens de acceso de usuario pueden expirar. Genera un nuevo
                token permanente desde el Explorador de API de Meta.
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center mb-8">
          <Button size="lg" onClick={() => navigate("/")}>
            Volver al Panel Principal
          </Button>
        </div>
      </div>
    </div>
  );
}
