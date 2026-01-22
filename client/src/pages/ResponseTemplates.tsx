import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Edit2, Trash2, X } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Template {
  id: number;
  title: string;
  content: string;
  category: "greeting" | "product" | "appointment" | "followup" | "other";
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  title: string;
  content: string;
  category: "greeting" | "product" | "appointment" | "followup" | "other";
}

export default function ResponseTemplates() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    category: "other",
  });

  // Mock data - en producción usarías tRPC
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      title: "Bienvenida",
      content:
        "¡Hola! Bienvenido a MotoElectrica. Soy tu asesor virtual. ¿En qué puedo ayudarte hoy?",
      category: "greeting",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "Información de Producto",
      content:
        "Nuestras motos eléctricas ofrecen la mejor tecnología con autonomía de hasta 200km y carga rápida en 4 horas.",
      category: "product",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: "Agendar Cita",
      content:
        "Me gustaría agendar una cita para que conozcas nuestras motos en persona. ¿Cuál es tu disponibilidad?",
      category: "appointment",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (editingId) {
      // Actualizar
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...formData,
                updatedAt: new Date(),
              }
            : t
        )
      );
      toast.success("Plantilla actualizada");
    } else {
      // Crear
      setTemplates((prev) => [
        ...prev,
        {
          id: Math.max(...prev.map((t) => t.id), 0) + 1,
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      toast.success("Plantilla creada");
    }

    setFormData({
      title: "",
      content: "",
      category: "other",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (template: Template) => {
    setFormData({
      title: template.title,
      content: template.content,
      category: template.category,
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success("Plantilla eliminada");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      category: "other",
    });
  };

  const categoryLabels = {
    greeting: "Saludo",
    product: "Producto",
    appointment: "Cita",
    followup: "Seguimiento",
    other: "Otro",
  };

  const categoryColors = {
    greeting: "bg-blue-100 text-blue-800",
    product: "bg-green-100 text-green-800",
    appointment: "bg-purple-100 text-purple-800",
    followup: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Plantillas de Respuesta</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Plantilla
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Editar Plantilla" : "Nueva Plantilla"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="ej: Bienvenida"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="greeting">Saludo</option>
                  <option value="product">Producto</option>
                  <option value="appointment">Cita</option>
                  <option value="followup">Seguimiento</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Contenido
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Escribe el contenido de la plantilla..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Actualizar" : "Crear"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid gap-4">
          {templates.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                No hay plantillas. Crea una para comenzar.
              </p>
            </Card>
          ) : (
            templates.map((template) => (
              <Card key={template.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {template.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          categoryColors[template.category]
                        }`}
                      >
                        {categoryLabels[template.category]}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{template.content}</p>
                    <p className="text-xs text-gray-500">
                      Actualizado:{" "}
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
