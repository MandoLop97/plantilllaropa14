
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Scissors, Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNegocio } from "@/hooks/useNegocio";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from "@/hooks/use-mobile";

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

interface AdminServiciosProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminServicios({ searchQuery, setSearchQuery }: AdminServiciosProps) {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { negocio } = useNegocio(user?.id || null);

  const fetchServicios = async () => {
    if (!negocio?.id) return;

    try {
      const { data, error } = await supabase
        .from("servicios")
        .select("*")
        .eq("negocio_id", negocio.id)
        .order("nombre");

      if (error) throw error;
      setServicios(data || []);
    } catch (error) {
      console.error("Error fetching servicios:", error);
      toast.error("Error al cargar los servicios");
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
        .eq("tipo", "Servicio")
        .eq("activo", true)
        .order("nombre");

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  useEffect(() => {
    fetchServicios();
    fetchCategorias();
  }, [negocio?.id]);

  const filteredServicios = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    servicio.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (servicio: Servicio) => {
    navigate(`/admin/servicios/editar/${servicio.id}`);
  };

  const handleNew = () => {
    navigate("/admin/servicios/nuevo");
  };

  const toggleStatus = async (servicioId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("servicios")
        .update({ 
          disponible: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", servicioId);

      if (error) throw error;
      toast.success("Estado actualizado correctamente");
      fetchServicios();
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
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2 text-muted-foreground">Cargando servicios...</span>
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
              placeholder="Buscar servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button 
            onClick={handleNew}
            className="flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nuevo Servicio</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </div>

      {/* Services table */}
      {filteredServicios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-card shadow-lg rounded-lg border w-full">
          <div className="bg-muted/50 rounded-full p-6 mb-4">
            <Scissors className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No hay servicios</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            {searchQuery ? "No se encontraron servicios que coincidan con tu búsqueda." : "No hay servicios registrados. ¡Añade tu primer servicio!"}
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
                  <TableHead className="w-[80px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Precio</TableHead>
                  <TableHead className="hidden lg:table-cell">Duración</TableHead>
                  <TableHead className="hidden lg:table-cell">Categoría</TableHead>
                  <TableHead className="hidden sm:table-cell">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServicios.map((servicio) => (
                  <TableRow 
                    key={servicio.id} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleEdit(servicio)}
                  >
                    <TableCell className="w-[80px] p-2">
                      <div className="h-[60px] w-[60px] rounded-md bg-muted overflow-hidden flex items-center justify-center">
                        {servicio.imagen_url ? (
                          <img 
                            src={servicio.imagen_url} 
                            alt={servicio.nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Scissors className="h-6 w-6 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium p-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{servicio.nombre}</span>
                        <div className="flex gap-2 mt-1 md:hidden">
                          <span className="text-sm text-muted-foreground">
                            {formatPrice(servicio.precio)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {servicio.duracion_minutos} min
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1 sm:hidden">
                          <Badge 
                            variant={servicio.disponible ? "default" : "secondary"} 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStatus(servicio.id, servicio.disponible);
                            }}
                          >
                            {servicio.disponible ? "VISIBLE" : "OCULTO"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 lg:hidden">
                          {getCategoriaName(servicio.categoria_id)}
                        </div>
                        {servicio.descripcion && (
                          <span className="text-xs text-muted-foreground mt-1">
                            {servicio.descripcion.length > 50 
                              ? `${servicio.descripcion.substring(0, 50)}...` 
                              : servicio.descripcion}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell p-2">
                      <span className="font-medium">{formatPrice(servicio.precio)}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell p-2">
                      <span className="text-sm">{servicio.duracion_minutos} min</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell p-2">
                      <span className="inline-block bg-muted px-2 py-1 rounded text-xs">
                        {getCategoriaName(servicio.categoria_id)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell p-2">
                      <Badge 
                        variant={servicio.disponible ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(servicio.id, servicio.disponible);
                        }}
                      >
                        {servicio.disponible ? "VISIBLE" : "OCULTO"}
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
