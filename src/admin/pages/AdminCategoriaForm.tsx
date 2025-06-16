
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useNegocio } from "@/hooks/useNegocio";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import SupabaseImageUpload from "@/admin/components/SupabaseImageUpload";

const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  tipo: z.enum(["Producto", "Servicio"]),
  activo: z.boolean().default(true),
  imagen_url: z.string().optional(),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

const defaultFormValues: CategoriaFormData = {
  nombre: "",
  descripcion: "",
  tipo: "Producto" as const,
  activo: true,
  imagen_url: "",
};

export default function AdminCategoriaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const { user } = useAuth();
  const { negocio } = useNegocio(user?.id || null);

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: defaultFormValues,
  });

  const fetchCategoria = async () => {
    if (!id || !negocio?.id) return;

    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("id", id)
        .eq("negocio_id", negocio.id)
        .single();

      if (error) throw error;

      if (data) {
        form.reset({
          nombre: data.nombre,
          descripcion: data.descripcion || "",
          tipo: data.tipo as "Producto" | "Servicio",
          activo: data.activo,
          imagen_url: data.imagen_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching categoria:", error);
      toast.error("Error al cargar la categoría");
      navigate("/admin/inventario");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchCategoria();
    }
  }, [negocio?.id, id]);

  const onSubmit = async (data: CategoriaFormData) => {
    if (!negocio?.id) return;

    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from("categorias")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Categoría actualizada correctamente");
      } else {
        const { error } = await supabase
          .from("categorias")
          .insert({
            ...data,
            negocio_id: negocio.id,
          });

        if (error) throw error;
        toast.success("Categoría creada correctamente");
      }

      navigate("/admin/inventario");
    } catch (error) {
      console.error("Error saving categoria:", error);
      toast.error("Error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex items-center gap-4 p-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/inventario")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Cargando...</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mt-2 text-muted-foreground">Cargando categoría...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/inventario")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Editar Categoría" : "Nueva Categoría"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Cortes de cabello" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descripción de la categoría"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imagen_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <div className="max-w-full overflow-hidden">
                          {negocio?.id && (
                            <SupabaseImageUpload
                              onImageSelect={field.onChange}
                              currentImageUrl={field.value}
                              negocioId={negocio.id}
                              label="imagen"
                              previewClassName="h-32 w-full rounded-lg object-cover"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Producto">Producto</SelectItem>
                          <SelectItem value="Servicio">Servicio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Activo</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Las categorías activas están disponibles para asignar
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/inventario")}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              isEditing ? "Actualizar" : "Crear"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
