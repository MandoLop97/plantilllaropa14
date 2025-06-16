
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, Plus, Edit2, Trash2, Save, X, Upload, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useNegocio } from "@/hooks/useNegocio";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import SupabaseImageUpload from "@/admin/components/SupabaseImageUpload";

interface Variante {
  id: string;
  producto_id: string;
  atributo_id: string;
  atributo: string;
  descripcion: string | null;
  imagen_url: string | null;
}

interface Producto {
  id: string;
  nombre: string;
}

export default function AdminVariantesPage() {
  const navigate = useNavigate();
  const { productoId, atributoId } = useParams();
  const [searchParams] = useSearchParams();
  const atributoNombre = searchParams.get("atributo") || "";
  const [loading, setLoading] = useState(true);
  const [variantes, setVariantes] = useState<Variante[]>([]);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [productoError, setProductoError] = useState(false);
  const [editingVariante, setEditingVariante] = useState<string | null>(null);
  const [editData, setEditData] = useState({ atributo: "", descripcion: "" });
  const [newVariante, setNewVariante] = useState({ atributo: "", descripcion: "" });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const { user } = useAuth();
  const { negocio } = useNegocio(user?.id || null);

  const fetchProducto = async () => {
    if (!productoId || !negocio?.id) return;
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("id, nombre")
        .eq("id", productoId)
        .eq("negocio_id", negocio.id)
        .single();

      if (error) throw error;
      setProducto(data);
      setProductoError(false);
    } catch (error) {
      console.error("Error fetching producto:", error);
      toast.error("Error al cargar el producto");
      setProducto(null);
      setProductoError(true);
    }
  };

  const fetchVariantes = async () => {
    if (!productoId || !atributoId || !negocio?.id) return;
    try {
      const { data, error } = await supabase
        .from("producto_atributo")
        .select("*")
        .eq("producto_id", productoId)
        .eq("atributo_id", atributoId)
        .eq("negocio_id", negocio.id)
        .order("atributo");

      if (error) throw error;
      setVariantes(data || []);
    } catch (error) {
      console.error("Error fetching variantes:", error);
      toast.error("Error al cargar las variantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducto();
    fetchVariantes();
  }, [productoId, atributoId, negocio?.id]);

  const handleAddVariante = async () => {
    if (!newVariante.atributo.trim() || !negocio?.id) {
      toast.error("El valor del atributo es requerido");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("producto_atributo")
        .insert({
          producto_id: productoId,
          atributo_id: atributoId,
          atributo: newVariante.atributo.trim(),
          descripcion: newVariante.descripcion.trim() || null,
          negocio_id: negocio.id,
        })
        .select()
        .single();

      if (error) throw error;

      setVariantes([...variantes, data]);
      setNewVariante({ atributo: "", descripcion: "" });
      setShowAddDialog(false);
      toast.success("Variante agregada correctamente");
    } catch (error) {
      console.error("Error adding variante:", error);
      toast.error("Error al agregar la variante");
    }
  };

  const handleUpdateVariante = async (varianteId: string) => {
    if (!editData.atributo.trim()) {
      toast.error("El valor del atributo es requerido");
      return;
    }

    try {
      const { error } = await supabase
        .from("producto_atributo")
        .update({
          atributo: editData.atributo.trim(),
          descripcion: editData.descripcion.trim() || null,
        })
        .eq("id", varianteId);

      if (error) throw error;

      setVariantes(variantes.map(v => 
        v.id === varianteId 
          ? { ...v, atributo: editData.atributo.trim(), descripcion: editData.descripcion.trim() || null }
          : v
      ));

      setEditingVariante(null);
      setEditData({ atributo: "", descripcion: "" });
      toast.success("Variante actualizada correctamente");
    } catch (error) {
      console.error("Error updating variante:", error);
      toast.error("Error al actualizar la variante");
    }
  };

  const handleDeleteVariante = async (varianteId: string) => {
    try {
      const { error } = await supabase
        .from("producto_atributo")
        .delete()
        .eq("id", varianteId);

      if (error) throw error;

      setVariantes(variantes.filter(v => v.id !== varianteId));
      toast.success("Variante eliminada correctamente");
    } catch (error) {
      console.error("Error deleting variante:", error);
      toast.error("Error al eliminar la variante");
    }
  };

  const handleImageUpload = async (varianteId: string, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from("producto_atributo")
        .update({ imagen_url: imageUrl })
        .eq("id", varianteId);

      if (error) throw error;

      setVariantes(variantes.map(v => 
        v.id === varianteId ? { ...v, imagen_url: imageUrl } : v
      ));

      setUploadingImage(null);
      toast.success("Imagen actualizada correctamente");
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Error al actualizar la imagen");
    }
  };

  const startEditing = (variante: Variante) => {
    setEditingVariante(variante.id);
    setEditData({
      atributo: variante.atributo || "",
      descripcion: variante.descripcion || ""
    });
  };

  const cancelEditing = () => {
    setEditingVariante(null);
    setEditData({ atributo: "", descripcion: "" });
  };

  // Ensure variantes is always an array
  const safeVariantes = Array.isArray(variantes) ? variantes : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex items-center gap-4 p-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/productos/editar/${productoId}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Cargando...</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mt-2 text-muted-foreground">Cargando variantes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mejorado para móvil */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-3 p-3 md:p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/productos/editar/${productoId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-semibold truncate">Variantes: {atributoNombre}</h1>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Producto: {producto?.nombre}</p>
            {productoError && (
              <p className="text-xs text-destructive truncate">No se pudo cargar el producto.</p>
            )}
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-shrink-0">
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden xs:inline">Agregar</span>
                <span className="xs:hidden">+</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] mx-4">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Variante</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Valor del atributo</label>
                  <Input
                    placeholder="Ej: Rojo, Talla M, etc."
                    value={newVariante.atributo}
                    onChange={(e) => setNewVariante(prev => ({ ...prev, atributo: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción (opcional)</label>
                  <Textarea
                    placeholder="Descripción de la variante"
                    value={newVariante.descripcion}
                    onChange={(e) => setNewVariante(prev => ({ ...prev, descripcion: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddVariante} disabled={!newVariante.atributo.trim()} className="flex-1">
                    Agregar
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 max-w-7xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base md:text-lg">Lista de Variantes</CardTitle>
          </CardHeader>
          <CardContent>
            {safeVariantes.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Package className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-3 md:mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-3 md:mb-4 text-base md:text-lg">No hay variantes para este atributo</p>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 px-4">
                  Agrega la primera variante para comenzar a gestionar las opciones de este atributo
                </p>
                <Button onClick={() => setShowAddDialog(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primera Variante
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile view - Cards - Mejorado */}
                <div className="block lg:hidden space-y-3">
                  {safeVariantes.map((variante) => (
                    <Card key={variante.id} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            {variante.imagen_url ? (
                              <img 
                                src={variante.imagen_url} 
                                alt={variante.atributo}
                                className="h-12 w-12 md:h-16 md:w-16 rounded object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 md:h-16 md:w-16 rounded bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-400 text-center px-1">Sin imagen</span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {editingVariante === variante.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editData.atributo}
                                  onChange={(e) => setEditData(prev => ({ ...prev, atributo: e.target.value }))}
                                  placeholder="Valor del atributo"
                                  className="text-sm"
                                />
                                <Textarea
                                  value={editData.descripcion}
                                  onChange={(e) => setEditData(prev => ({ ...prev, descripcion: e.target.value }))}
                                  placeholder="Descripción"
                                  rows={2}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateVariante(variante.id)}
                                    disabled={!editData.atributo.trim()}
                                    className="flex-1"
                                  >
                                    <Save className="h-3 w-3 mr-1" />
                                    Guardar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelEditing}
                                    className="flex-1"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4 className="font-medium text-foreground truncate text-sm md:text-base">{variante.atributo}</h4>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {variante.descripcion || "Sin descripción"}
                                </p>
                                <div className="flex flex-wrap items-center gap-1 mt-2">
                                  {negocio?.id && (
                                    <Dialog open={uploadingImage === variante.id} onOpenChange={(open) => setUploadingImage(open ? variante.id : null)}>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                                          <Upload className="h-3 w-3 mr-1" />
                                          Imagen
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="mx-4">
                                        <DialogHeader>
                                          <DialogTitle className="text-base">Subir Imagen para {variante.atributo}</DialogTitle>
                                        </DialogHeader>
                                        <SupabaseImageUpload
                                          onImageSelect={(url) => handleImageUpload(variante.id, url)}
                                          currentImageUrl={variante.imagen_url || ""}
                                          negocioId={negocio.id}
                                          label="Imagen de la variante"
                                          previewClassName="h-32 w-32 rounded-lg object-cover"
                                        />
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEditing(variante)}
                                    className="text-xs px-2 py-1"
                                  >
                                    <Edit2 className="h-3 w-3 mr-1" />
                                    Editar
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 text-xs px-2 py-1">
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Eliminar
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="mx-4">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción eliminará la variante "{variante.atributo}" permanentemente.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                        <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteVariante(variante.id)}
                                          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                        >
                                          Eliminar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop view - Table - Mejorado */}
                <div className="hidden lg:block">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[140px]">Imagen</TableHead>
                          <TableHead className="min-w-[120px]">Valor</TableHead>
                          <TableHead className="min-w-[200px]">Descripción</TableHead>
                          <TableHead className="text-right w-[220px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {safeVariantes.map((variante) => (
                          <TableRow key={variante.id} className="hover:bg-muted/50">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                {variante.imagen_url ? (
                                  <img 
                                    src={variante.imagen_url} 
                                    alt={variante.atributo}
                                    className="h-12 w-12 rounded object-cover"
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                                    <span className="text-xs text-gray-400 text-center">Sin imagen</span>
                                  </div>
                                )}
                                {negocio?.id && (
                                  <Dialog open={uploadingImage === variante.id} onOpenChange={(open) => setUploadingImage(open ? variante.id : null)}>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="p-2">
                                        <Upload className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Subir Imagen para {variante.atributo}</DialogTitle>
                                      </DialogHeader>
                                      <SupabaseImageUpload
                                        onImageSelect={(url) => handleImageUpload(variante.id, url)}
                                        currentImageUrl={variante.imagen_url || ""}
                                        negocioId={negocio.id}
                                        label="Imagen de la variante"
                                        previewClassName="h-32 w-32 rounded-lg object-cover"
                                      />
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {editingVariante === variante.id ? (
                                <Input
                                  value={editData.atributo}
                                  onChange={(e) => setEditData(prev => ({ ...prev, atributo: e.target.value }))}
                                  className="w-full"
                                />
                              ) : (
                                <span className="font-medium">{variante.atributo}</span>
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              {editingVariante === variante.id ? (
                                <Textarea
                                  value={editData.descripcion}
                                  onChange={(e) => setEditData(prev => ({ ...prev, descripcion: e.target.value }))}
                                  rows={2}
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  {variante.descripcion || "Sin descripción"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <div className="flex justify-end gap-1">
                                {editingVariante === variante.id ? (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateVariante(variante.id)}
                                      disabled={!editData.atributo.trim()}
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={cancelEditing}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => startEditing(variante)}
                                    >
                                      <Edit2 className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta acción eliminará la variante "{variante.atributo}" permanentemente.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteVariante(variante.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
