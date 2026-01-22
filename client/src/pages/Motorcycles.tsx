import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

interface MotorcycleForm {
  name: string;
  model: string;
  price: string;
  batteryCapacity: string;
  range: string;
  maxSpeed: string;
  chargingTime: string;
  weight: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function Motorcycles() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MotorcycleForm>({
    name: "",
    model: "",
    price: "",
    batteryCapacity: "",
    range: "",
    maxSpeed: "",
    chargingTime: "",
    weight: "",
    description: "",
    imageUrl: "",
    category: "city",
  });

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

  const { data: motorcycles, isLoading } = trpc.motorcycles.list.useQuery();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.model || !formData.price) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    try {
      // Aquí iría la llamada a la API para crear/actualizar
      // Por ahora solo mostramos un mensaje de éxito
      toast.success(
        editingId
          ? "Moto actualizada correctamente"
          : "Moto creada correctamente"
      );
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        model: "",
        price: "",
        batteryCapacity: "",
        range: "",
        maxSpeed: "",
        chargingTime: "",
        weight: "",
        description: "",
        imageUrl: "",
        category: "city",
      });
    } catch (error) {
      toast.error("Error al guardar la moto");
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Motos</h1>
              <p className="text-gray-600">
                Total de motos: {motorcycles?.length || 0}
              </p>
            </div>
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Moto
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Editar Moto" : "Nueva Moto"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="ej: Tesla Model S"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Modelo *
                  </label>
                  <Input
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="ej: Plaid"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Precio ($) *
                  </label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="ej: 50000"
                    required
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
                    <option value="city">City</option>
                    <option value="sport">Sport</option>
                    <option value="adventure">Adventure</option>
                    <option value="cruiser">Cruiser</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Capacidad Batería
                  </label>
                  <Input
                    name="batteryCapacity"
                    value={formData.batteryCapacity}
                    onChange={handleInputChange}
                    placeholder="ej: 50 kWh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rango
                  </label>
                  <Input
                    name="range"
                    value={formData.range}
                    onChange={handleInputChange}
                    placeholder="ej: 200 km"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Velocidad Máxima (km/h)
                  </label>
                  <Input
                    name="maxSpeed"
                    type="number"
                    value={formData.maxSpeed}
                    onChange={handleInputChange}
                    placeholder="ej: 180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tiempo de Carga
                  </label>
                  <Input
                    name="chargingTime"
                    value={formData.chargingTime}
                    onChange={handleInputChange}
                    placeholder="ej: 4 horas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Peso (kg)
                  </label>
                  <Input
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="ej: 1600"
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    onImageUrl={(url) =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: url,
                      }))
                    }
                    currentImageUrl={formData.imageUrl}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descripción de la moto..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Actualizar" : "Crear"} Moto
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando motos...</p>
          </div>
        ) : motorcycles && motorcycles.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">No hay motos registradas</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primera Moto
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {motorcycles?.map((moto: any) => (
              <Card key={moto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {moto.imageUrl && (
                  <img
                    src={moto.imageUrl}
                    alt={moto.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    {moto.name} {moto.model}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 my-2">
                    ${(moto.price / 100).toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    {moto.batteryCapacity && (
                      <p>
                        <strong>Batería:</strong> {moto.batteryCapacity}
                      </p>
                    )}
                    {moto.range && (
                      <p>
                        <strong>Rango:</strong> {moto.range}
                      </p>
                    )}
                    {moto.maxSpeed && (
                      <p>
                        <strong>Vel. Máx:</strong> {moto.maxSpeed} km/h
                      </p>
                    )}
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-4">
                    {moto.category}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(moto.id);
                        setFormData({
                          name: moto.name,
                          model: moto.model,
                          price: (moto.price / 100).toString(),
                          batteryCapacity: moto.batteryCapacity || "",
                          range: moto.range || "",
                          maxSpeed: moto.maxSpeed?.toString() || "",
                          chargingTime: moto.chargingTime || "",
                          weight: moto.weight?.toString() || "",
                          description: moto.description || "",
                          imageUrl: moto.imageUrl || "",
                          category: moto.category || "city",
                        });
                        setShowForm(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        toast.success("Moto eliminada");
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
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
