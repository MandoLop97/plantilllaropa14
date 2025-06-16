import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, Image, Eye, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from "@/hooks/use-mobile";
import SupabaseImageUpload from "@/admin/components/SupabaseImageUpload";

const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  tipo: z.enum(["Producto", "Servicio"]),
  activo: z.boolean().default(true),
  imagen_url: z.string().optional(),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  activo: boolean;
  imagen_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminCategoriasProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const defaultFormValues: CategoriaFormData = {
  nombre: "",
  descripcion: "",
  tipo: "Producto" as const,
  activo: true,
  imagen_url: "",
};

export default function AdminCategorias({ searchQuery, setSearchQuery }: AdminCategoriasProps) {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { negocio } = useNegocio(user?.id || null);

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: defaultFormValues,
  });

  const fetchCategorias = async () => {
    if (!negocio?.id) return;

    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("negocio_id", negocio.id)
        .order("nombre");

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error fetching categorias:", error);
      toast.error("Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [negocio?.id]);

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (data: CategoriaFormData) => {
    if (!negocio?.id) return;

    try {
      if (editingCategoria) {
        const { error } = await supabase
          .from("categorias")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCategoria.id);

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

      setIsDialogOpen(false);
      setEditingCategoria(null);
      form.reset(defaultFormValues);
      fetchCategorias();
    } catch (error) {
      console.error("Error saving categoria:", error);
      toast.error("Error al guardar la categoría");
    }
  };

  const handleEdit = (categoria: Categoria) => {
    if (isMobile) {
      navigate(`/admin/categorias/editar/${categoria.id}`);
    } else {
      setEditingCategoria(categoria);
      form.reset({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || "",
        tipo: categoria.tipo as "Producto" | "Servicio",
        activo: categoria.activo,
        imagen_url: categoria.imagen_url || "",
      });
      setIsDialogOpen(true);
    }
  };

  const handleNew = () => {
    if (isMobile) {
      navigate("/admin/categorias/nueva");
    } else {
      setEditingCategoria(null);
      form.reset(defaultFormValues);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (categoriaId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;

    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoriaId);

      if (error) throw error;
      toast.success("Categoría eliminada correctamente");
      fetchCategorias();
    } catch (error) {
      console.error("Error deleting categoria:", error);
      toast.error("Error al eliminar la categoría");
    }
  };

  const toggleStatus = async (categoriaId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("categorias")
        .update({ 
          activo: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", categoriaId);

      if (error) throw error;
      toast.success("Estado actualizado correctamente");
      fetchCategorias();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2 text-muted-foreground">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full p-0">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          {!isMobile ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleNew}
                  className="flex items-center gap-2 shadow-sm transition-all"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Nueva Categoría</span>
                  <span className="sm:hidden">Nueva</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              rows={3}
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
                              <SelectItem value="producto">Producto</SelectItem>
                              <SelectItem value="servicio">Servicio</SelectItem>
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
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingCategoria ? "Actualizar" : "Crear"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : (
            <Button 
              onClick={handleNew}
              className="flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nueva Categoría</span>
              <span className="sm:hidden">Nueva</span>
            </Button>
          )}
        </div>
      </div>

      {/* Categories table */}
      {filteredCategorias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-card shadow-lg rounded-lg border w-full">
          <div className="bg-muted/50 rounded-full p-6 mb-4">
            <Tag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No hay categorías</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            {searchQuery ? "No se encontraron categorías que coincidan con tu búsqueda." : "No hay categorías registradas. ¡Añade tu primera categoría!"}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
              Limpiar búsqueda
            </Button>
          )}
        </div>
      ) : (
        <div className="w-full">
          <Card className="shadow-sm w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">Descripción</TableHead>
                  <TableHead className="hidden sm:table-cell">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategorias.map((categoria) => (
                  <TableRow key={categoria.id} className="hover:bg-muted/50">
                    <TableCell className="w-[80px] hidden sm:table-cell">
                      <div className="h-[60px] w-[60px] rounded-md bg-muted overflow-hidden">
                        {categoria.imagen_url ? (
                          <img
                            src={categoria.imagen_url}
                            alt={categoria.nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Tag className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{categoria.nombre}</span>
                        <div className="flex gap-2 mt-1 sm:hidden">
                          <Badge variant={categoria.activo ? "default" : "secondary"} className="text-xs">
                            {categoria.activo ? "Activo" : "Inactivo"}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {categoria.tipo}
                          </Badge>
                        </div>
                        {categoria.descripcion && (
                          <p className="text-xs text-muted-foreground mt-1 md:hidden">
                            {categoria.descripcion.length > 50 
                              ? `${categoria.descripcion.substring(0, 50)}...` 
                              : categoria.descripcion}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {categoria.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] hidden lg:table-cell">
                      <p className="truncate text-muted-foreground">
                        {categoria.descripcion || "Sin descripción"}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={categoria.activo ? "default" : "secondary"}>
                        {categoria.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(categoria)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleStatus(categoria.id, categoria.activo)}
                          className="h-8 w-8 p-0 hidden sm:inline-flex"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(categoria.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
