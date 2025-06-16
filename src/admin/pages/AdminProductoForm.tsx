import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Plus, Package, Trash2, Settings } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useNegocio } from "@/hooks/useNegocio";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import SupabaseImageUpload from "@/admin/components/SupabaseImageUpload";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  disponible: z.boolean().default(true),
  tipo: z.string().default("Físico"),
  categoria_id: z.string().optional(),
  sku: z.string().optional(),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  precio_original: z.number().optional(),
  tiene_costo_unidad: z.boolean().default(false),
  costo_unidad: z.number().optional(),
  precio_por_unidad: z.boolean().default(false),
  peso: z.number().optional(),
  volumen: z.number().optional(),
  unidades: z.number().optional(),
  unidad_medida: z.string().optional(),
  imagen_url: z.string().optional(),
  seguimiento_inventario: z.boolean().default(false),
});

type ProductoFormData = z.infer<typeof productoSchema>;

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  activo: boolean;
}

interface Atributo {
  id: string;
  nombre: string;
}

interface AtributoConVariantes extends Atributo {
  variantesCount: number;
}

interface Variante {
  id: string;
  producto_id: string;
  atributo_id: string;
  atributo: string;
  descripcion: string;
}

interface Inventario {
  stock_actual: string | null;
  stock_minimo: string | null;
}

const defaultFormValues: ProductoFormData = {
  nombre: "",
  descripcion: "",
  disponible: true,
  tipo: "Físico",
  categoria_id: "none",
  sku: "",
  precio: 0,
  precio_original: 0,
  tiene_costo_unidad: false,
  costo_unidad: 0,
  precio_por_unidad: false,
  peso: 0,
  volumen: 0,
  unidades: 0,
  unidad_medida: "",
  imagen_url: "",
  seguimiento_inventario: false,
};

export default function AdminProductoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [atributosConVariantes, setAtributosConVariantes] = useState<AtributoConVariantes[]>([]);
  const [selectedAtributos, setSelectedAtributos] = useState<string[]>([]);
  const [newAtributo, setNewAtributo] = useState("");
  const [inventario, setInventario] = useState<Inventario | null>(null);
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const { user } = useAuth();
  const { negocio } = useNegocio(user?.id || null);

  const form = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: defaultFormValues,
  });

  const watchTieneCostoUnidad = form.watch("tiene_costo_unidad");
  const watchPrecioPorUnidad = form.watch("precio_por_unidad");
  const watchSeguimientoInventario = form.watch("seguimiento_inventario");

  const fetchCategorias = async () => {
    if (!negocio?.id) return;
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("negocio_id", negocio.id)
        .eq("tipo", "Producto")
        .eq("activo", true)
        .order("nombre");
      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchAtributosConVariantes = async () => {
    if (!negocio?.id) return;
    try {
      const { data: atributos, error } = await supabase
        .from("atributos")
        .select("*")
        .eq("negocio_id", negocio.id)
        .order("nombre");
      
      if (error) throw error;
      
      const atributosConCounts = await Promise.all((atributos || []).map(async (atributo) => {
        let variantesCount = 0;
        
        if (id) {
          const { data: variantes, error: variantesError } = await supabase
            .from("producto_atributo")
            .select("id", { count: 'exact' })
            .eq("atributo_id", atributo.id)
            .eq("producto_id", id)
            .eq("negocio_id", negocio.id);
          
          if (!variantesError && variantes) {
            variantesCount = variantes.length;
          }
        }
        
        return {
          ...atributo,
          variantesCount
        };
      }));
      
      setAtributosConVariantes(atributosConCounts);
    } catch (error) {
      console.error("Error fetching atributos:", error);
    }
  };

  const fetchProducto = async () => {
    if (!id || !negocio?.id) return;
    try {
      const { data, error } = await supabase
        .from("productos")
        .select(`
          *,
          producto_atributo (
            id,
            atributo_id
          )
        `)
        .eq("id", id)
        .eq("negocio_id", negocio.id)
        .single();

      if (error) throw error;
      if (data) {
        const productoAtributos =
          data.producto_atributo?.map((pa: { atributo_id: string }) => pa.atributo_id) || [];
        setSelectedAtributos(productoAtributos);
        
        form.reset({
          nombre: data.nombre,
          descripcion: data.descripcion || "",
          disponible: data.disponible,
          tipo: data.tipo || "Físico",
          categoria_id: data.categoria_id || "none",
          sku: data.sku || "",
          precio: data.precio,
          precio_original: data.precio_original || 0,
          tiene_costo_unidad: data.tiene_costo_unidad || false,
          costo_unidad: data.costo_unidad || 0,
          precio_por_unidad: data.precio_por_unidad || false,
          peso: data.peso || 0,
          volumen: data.volumen || 0,
          unidades: data.unidades || 0,
          unidad_medida: data.unidad_medida || "",
          imagen_url: data.imagen_url || "",
          seguimiento_inventario: data.seguimiento_inventario || false,
        });

        // Fetch inventario data
        if (data.seguimiento_inventario) {
          const { data: inventarioData } = await supabase
            .from("inventario")
            .select("stock_actual, stock_minimo")
            .eq("producto_id", id)
            .eq("negocio_id", negocio.id)
            .maybeSingle();
          
          if (inventarioData) {
            setInventario(inventarioData);
            setStockActual(inventarioData.stock_actual || "");
            setStockMinimo(inventarioData.stock_minimo || "");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching producto:", error);
      toast.error("Error al cargar el producto");
      navigate("/admin/inventario");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isEditing) return;

    if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Producto eliminado correctamente");
      navigate("/admin/inventario");
    } catch (error) {
      console.error("Error deleting producto:", error);
      toast.error("Error al eliminar el producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchAtributosConVariantes();
    if (isEditing) {
      fetchProducto();
    } else {
      setLoadingData(false);
    }
  }, [negocio?.id, id]);

  const handleAddAtributo = async () => {
    if (!newAtributo.trim() || !negocio?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("atributos")
        .insert({
          nombre: newAtributo.trim(),
          negocio_id: negocio.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newAtributoConVariantes = {
        ...data,
        variantesCount: 0
      };
      
      setAtributosConVariantes([...atributosConVariantes, newAtributoConVariantes]);
      setSelectedAtributos([...selectedAtributos, data.id]);
      setNewAtributo("");
      toast.success("Atributo agregado correctamente");
    } catch (error) {
      console.error("Error adding atributo:", error);
      toast.error("Error al agregar el atributo");
    }
  };

  const onSubmit = async (data: ProductoFormData) => {
    if (!negocio?.id) return;
    setLoading(true);
    
    try {
      const dataToSave = {
        ...data,
        negocio_id: negocio.id,
        categoria_id: data.categoria_id === "none" ? null : data.categoria_id,
      };

      // Remove categoria_id if it's "none"
      if (dataToSave.categoria_id === null) {
        delete dataToSave.categoria_id;
      }

      // Remove stock_actual from product data since it should be in inventario table
      const productData = { ...dataToSave };

      let productoId = id;

      if (isEditing) {
        const { error } = await supabase
          .from("productos")
          .update({
            ...productData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
        if (error) throw error;
      } else {
        const { data: newProducto, error } = await supabase
          .from("productos")
          .insert(productData)
          .select()
          .single();
        if (error) throw error;
        productoId = newProducto.id;
      }

      // Update producto_atributo relationships
      if (productoId) {
        // Delete existing relationships
        await supabase
          .from("producto_atributo")
          .delete()
          .eq("producto_id", productoId)
          .eq("negocio_id", negocio.id);

        // Insert new relationships
        if (selectedAtributos.length > 0) {
          const relationships = selectedAtributos.map(atributoId => ({
            producto_id: productoId,
            atributo_id: atributoId,
            negocio_id: negocio.id,
          }));
          
          await supabase
            .from("producto_atributo")
            .insert(relationships);
        }

        // Update inventario if needed
        if (data.seguimiento_inventario && (stockActual || stockMinimo)) {
          const { data: existingInventario } = await supabase
            .from("inventario")
            .select("id")
            .eq("producto_id", productoId)
            .eq("negocio_id", negocio.id)
            .maybeSingle();

          const inventarioData = {
            stock_actual: stockActual || null,
            stock_minimo: stockMinimo || null,
            seguimiento_de_inventario: true,
          };

          if (existingInventario) {
            await supabase
              .from("inventario")
              .update(inventarioData)
              .eq("id", existingInventario.id);
          } else {
            await supabase
              .from("inventario")
              .insert({
                producto_id: productoId,
                negocio_id: negocio.id,
                ...inventarioData,
              });
          }
        }
      }

      toast.success(isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente");
      navigate("/admin/inventario");
    } catch (error) {
      console.error("Error saving producto:", error);
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4 p-4 max-w-7xl mx-auto">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/inventario")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Cargando...</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mt-2 text-muted-foreground">Cargando producto...</span>
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
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
            </h1>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del producto *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Camisa deportiva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del producto" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectItem value="Físico">Físico</SelectItem>
                            <SelectItem value="Digital">Digital</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoria_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Sin categoría</SelectItem>
                            {categorias.map((categoria) => (
                              <SelectItem key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="disponible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Disponible</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Los productos disponibles se muestran en el catálogo
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Precios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="precio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="precio_original"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio original</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tiene_costo_unidad"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Costo por unidad</FormLabel>
                      </FormItem>
                    )}
                  />

                  {watchTieneCostoUnidad && (
                    <FormField
                      control={form.control}
                      name="costo_unidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costo por unidad</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="precio_por_unidad"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Precio por unidad</FormLabel>
                      </FormItem>
                    )}
                  />

                  {watchPrecioPorUnidad && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="peso"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peso</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="volumen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Volumen</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unidades"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unidades</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unidad_medida"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unidad de medida</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona unidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="UN">UN</SelectItem>
                                <SelectItem value="G">G</SelectItem>
                                <SelectItem value="KG">KG</SelectItem>
                                <SelectItem value="L">L</SelectItem>
                                <SelectItem value="ML">ML</SelectItem>
                                <SelectItem value="PACK">PACK</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Imagen del Producto</CardTitle>
              </CardHeader>
              <CardContent>
                {negocio?.id && (
                  <SupabaseImageUpload
                    onImageSelect={(url) => form.setValue("imagen_url", url)}
                    currentImageUrl={form.watch("imagen_url")}
                    negocioId={negocio.id}
                    label="Imagen del producto"
                    previewClassName="h-40 w-40 rounded-lg object-cover mx-auto"
                  />
                )}
              </CardContent>
            </Card>

            {/* Variants */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Variantes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define atributos y sus variantes (color, talla, etc.)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Nombre del atributo (ej: Color, Talla)"
                    value={newAtributo}
                    onChange={(e) => setNewAtributo(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAtributo}
                    disabled={!newAtributo.trim()}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>

                {atributosConVariantes.length > 0 ? (
                  <div className="space-y-4">
                    {atributosConVariantes.map((atributo) => (
                      <Card key={atributo.id} className="border-2 border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-foreground">{atributo.nombre}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {atributo.variantesCount === 0 
                                    ? "Sin variantes" 
                                    : `${atributo.variantesCount} variante${atributo.variantesCount !== 1 ? 's' : ''}`
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/inventario/productos/${id}/variantes/${atributo.id}?atributo=${encodeURIComponent(atributo.nombre)}`)}
                                className="flex-1 lg:flex-none"
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Gestionar Variantes
                              </Button>
                              
                              {atributo.variantesCount === 0 && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button type="button" variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar atributo?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción eliminará el atributo "{atributo.nombre}" permanentemente.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={async () => {
                                          if (!negocio?.id) return;
                                          try {
                                            const { data: variantes, error: variantesError } = await supabase
                                              .from("producto_atributo")
                                              .select("id")
                                              .eq("atributo_id", atributo.id)
                                              .eq("producto_id", id);

                                            if (variantesError) throw variantesError;

                                            if (variantes && variantes.length > 0) {
                                              toast.error("No se puede eliminar un atributo que tiene variantes. Elimina primero todas las variantes.");
                                              return;
                                            }

                                            const { error } = await supabase
                                              .from("atributos")
                                              .delete()
                                              .eq("id", atributo.id);

                                            if (error) throw error;

                                            setAtributosConVariantes(atributosConVariantes.filter(attr => attr.id !== atributo.id));
                                            toast.success("Atributo eliminado correctamente");
                                          } catch (error) {
                                            console.error("Error deleting atributo:", error);
                                            toast.error("Error al eliminar el atributo");
                                          }
                                        }}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">No hay atributos definidos</p>
                    <p className="text-sm text-gray-500">Agrega un atributo para comenzar a crear variantes</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Inventario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="seguimiento_inventario"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Seguimiento de Inventario</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Activar para llevar control del stock del producto
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchSeguimientoInventario && (
                  <div className="space-y-4">
                    {inventario && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Stock Actual</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <div>Stock actual: {inventario.stock_actual || "0"}</div>
                          <div>Stock mínimo: {inventario.stock_minimo || "0"}</div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Stock Actual</label>
                        <Input
                          placeholder="Ej: 50"
                          value={stockActual}
                          onChange={(e) => setStockActual(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Stock Mínimo</label>
                        <Input
                          placeholder="Ej: 10"
                          value={stockMinimo}
                          onChange={(e) => setStockMinimo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
        <div className="max-w-4xl mx-auto flex gap-3">
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
            ) : isEditing ? "Actualizar Producto" : "Crear Producto"}
          </Button>
        </div>
      </div>
    </div>
  );
}
