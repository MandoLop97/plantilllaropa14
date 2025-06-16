
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, PackageOpen, Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNegocio } from "@/hooks/useNegocio";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from "@/hooks/use-mobile";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  disponible: boolean;
  imagen_url: string | null;
  categoria_id: string | null;
  sku: string | null;
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

interface AdminProductosProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminProductos({ searchQuery, setSearchQuery }: AdminProductosProps) {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { negocio } = useNegocio(user?.id || null);

  const fetchProductos = async () => {
    if (!negocio?.id) return;

    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("negocio_id", negocio.id)
        .order("nombre");

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error("Error fetching productos:", error);
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [negocio?.id]);

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    producto.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    producto.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (producto: Producto) => {
    navigate(`/admin/productos/editar/${producto.id}`);
  };

  const handleNew = () => {
    navigate("/admin/productos/nuevo");
  };

  const toggleStatus = async (productoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("productos")
        .update({ 
          disponible: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productoId);

      if (error) throw error;
      toast.success("Estado actualizado correctamente");
      fetchProductos();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const getCategoriaName = (categoriaId: string | null) => {
    if (!categoriaId) return "Sin categoría";
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="mt-2 text-sm text-muted-foreground">Cargando productos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full p-0">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full h-9"
            />
          </div>
          <Button 
            onClick={handleNew}
            size="sm"
            className="flex items-center gap-2 shadow-sm transition-all h-9"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nuevo</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>

      {/* Products table with more prominence */}
      {filteredProductos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-card shadow-sm rounded-lg border w-full">
          <div className="bg-muted/50 rounded-full p-4 mb-3">
            <PackageOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium mb-1">No hay productos</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {searchQuery ? "No se encontraron productos que coincidan con tu búsqueda." : "No hay productos registrados. ¡Añade tu primer producto!"}
          </p>
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="mt-3">
              Limpiar búsqueda
            </Button>
          )}
        </div>
      ) : (
        <div className="w-full">
          <Card className="shadow-sm w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="h-10">
                  <TableHead className="w-[60px] p-2">Imagen</TableHead>
                  <TableHead className="p-2">Producto</TableHead>
                  <TableHead className="hidden md:table-cell p-2 w-[100px]">Precio</TableHead>
                  <TableHead className="hidden lg:table-cell p-2 w-[120px]">Categoría</TableHead>
                  <TableHead className="hidden sm:table-cell p-2 w-[80px]">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow 
                    key={producto.id} 
                    className="hover:bg-muted/50 cursor-pointer h-16"
                    onClick={() => handleEdit(producto)}
                  >
                    <TableCell className="w-[60px] p-2">
                      <div className="h-[48px] w-[48px] rounded-md bg-muted overflow-hidden">
                        {producto.imagen_url ? (
                          <img
                            src={producto.imagen_url}
                            alt={producto.nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <PackageOpen className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium p-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{producto.nombre}</span>
                        <div className="flex gap-2 mt-1 md:hidden">
                          <span className="text-xs text-muted-foreground">
                            {formatPrice(producto.precio)}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1 sm:hidden">
                          <Badge 
                            variant={producto.disponible ? "default" : "secondary"} 
                            className="text-xs px-1 py-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStatus(producto.id, producto.disponible);
                            }}
                          >
                            {producto.disponible ? "VISIBLE" : "OCULTO"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 lg:hidden">
                          {getCategoriaName(producto.categoria_id)}
                        </div>
                        {producto.sku && (
                          <span className="text-xs text-muted-foreground">SKU: {producto.sku}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell p-2">
                      <span className="font-medium text-sm">{formatPrice(producto.precio)}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell p-2">
                      <span className="inline-block bg-muted px-2 py-1 rounded text-xs">
                        {getCategoriaName(producto.categoria_id)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell p-2">
                      <Badge 
                        variant={producto.disponible ? "default" : "secondary"}
                        className="cursor-pointer text-xs px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(producto.id, producto.disponible);
                        }}
                      >
                        {producto.disponible ? "VISIBLE" : "OCULTO"}
                      </Badge>
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
