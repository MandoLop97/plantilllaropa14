
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Scissors, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNegocio } from "@/hooks/useNegocio";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import SupabaseImageUpload from "@/admin/components/SupabaseImageUpload";

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion_minutos: number;
  disponible: boolean;
  categoria_id: string | null;
  imagen_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  activo: boolean;
}

export default function AdminServicioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { user } = useAuth();
  const { negocio } = useNegocio(user?.id || null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion_minutos: "",
    categoria_id: "none",
    disponible: true,
    imagen_url: "",
  });

  useEffect(() => {
    if (negocio?.id) {
      fetchCategorias();
      if (isEditing && id) {
        fetchServicio();
      }
    }
  }, [negocio?.id, id, isEditing]);

  const fetchCategorias = async () => {
    if (!negocio?.id) return;

    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("negocio_id", negocio.id)
        .eq("tipo", "Servicio")
        .eq("activo", true)
        .order("nombre");

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchServicio = async () => {
    if (!id || !negocio?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("servicios")
        .select("*")
        .eq("id", id)
        .eq("negocio_id", negocio.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          precio: data.precio?.toString() || "",
          duracion_minutos: data.duracion_minutos?.toString() || "",
          categoria_id: data.categoria_id || "none",
          disponible: data.disponible ?? true,
          imagen_url: data.imagen_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching servicio:", error);
      toast.error("Error al cargar el servicio");
      navigate("/admin/inventario");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!negocio?.id) return;

    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error("El nombre del servicio es requerido");
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) < 0) {
      toast.error("El precio debe ser mayor o igual a 0");
      return;
    }

    if (!formData.duracion_minutos || parseInt(formData.duracion_minutos) <= 0) {
      toast.error("La duración debe ser mayor a 0 minutos");
      return;
    }

    setSaving(true);
    try {
      const servicioData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        precio: parseFloat(formData.precio),
        duracion_minutos: parseInt(formData.duracion_minutos),
        categoria_id: formData.categoria_id === "none" ? null : formData.categoria_id,
        disponible: formData.disponible,
        imagen_url: formData.imagen_url || null,
        negocio_id: negocio.id,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from("servicios")
          .update(servicioData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Servicio actualizado correctamente");
      } else {
        const { error } = await supabase
          .from("servicios")
          .insert(servicioData);

        if (error) throw error;
        toast.success("Servicio creado correctamente");
      }

      navigate("/admin/inventario");
    } catch (error) {
      console.error("Error saving servicio:", error);
      toast.error(isEditing ? "Error al actualizar el servicio" : "Error al crear el servicio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isEditing) return;

    if (!confirm("¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("servicios")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Servicio eliminado correctamente");
      navigate("/admin/inventario");
    } catch (error) {
      console.error("Error deleting servicio:", error);
      toast.error("Error al eliminar el servicio");
    } finally {
      setDeleting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (url: string) => {
    setFormData(prev => ({
      ...prev,
      imagen_url: url
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mt-2 text-muted-foreground">Cargando servicio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/inventario")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
              </h1>
            </div>
          </div>
          
          {/* Delete button in header */}
          {isEditing && (
            <Button
  variant="destructive"
  onClick={handleDelete}
  disabled={loading}
  className="flex items-center gap-1 px-2 py-1 text-sm rounded-md"
>
  {loading ? (
    <>
      <Loader2 className="animate-spin" size={16} />
      Eliminando...
    </>
  ) : (
    <>
      <Trash2 className="" size={16} />
      Eliminar
    </>
  )}
</Button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6 pb-32 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del servicio *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ej: Corte de cabello"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    placeholder="Describe el servicio que ofreces..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria_id}
                    onValueChange={(value) => handleInputChange("categoria_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin categoría</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="disponible">Servicio disponible</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.disponible ? "Visible para los clientes" : "Oculto para los clientes"}
                    </p>
                  </div>
                  <Switch
                    id="disponible"
                    checked={formData.disponible}
                    onCheckedChange={(checked) => handleInputChange("disponible", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Precio y duración */}
            <Card>
              <CardHeader>
                <CardTitle>Precio y duración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => handleInputChange("precio", e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (minutos) *</Label>
                  <Input
                    id="duracion"
                    type="number"
                    min="1"
                    value={formData.duracion_minutos}
                    onChange={(e) => handleInputChange("duracion_minutos", e.target.value)}
                    placeholder="60"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Imagen del servicio */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen del servicio</CardTitle>
            </CardHeader>
            <CardContent>
              {negocio?.id && (
                <SupabaseImageUpload
                  onImageSelect={handleImageSelect}
                  currentImageUrl={formData.imagen_url}
                  negocioId={negocio.id}
                  label="imagen"
                  bucketName="imagenservicio"
                  folderPath={`servicios/${negocio.id}`}
                  previewClassName="h-32 w-full rounded-lg object-cover"
                />
              )}
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/inventario")}
            className="flex-1"
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Actualizando..." : "Creando..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Actualizar servicio" : "Crear servicio"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
