import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { supabase } from "@/lib/supabase";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Plus, Pencil, Trash2, Search, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLayout from "../components/AdminLayout";

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion_minutos: number;
}

interface Cita {
  id: string;
  fecha: string;
  duracion_minutos: number;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  cliente: Cliente;
  servicio?: Servicio;
  servicio_id?: string;
}

interface FormValues {
  cliente_id: string;
  servicio_id: string;
  fecha: string;
  hora: string;
  duracion_minutos: number;
  estado: string;
  notas: string;
}

export default function AdminCitas() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { negocioActivo } = useNegocioActivo(user?.id || null);
  const [loading, setLoading] = useState(false);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      cliente_id: "",
      servicio_id: "",
      fecha: "",
      hora: "09:00",
      duracion_minutos: 30,
      estado: "pendiente",
      notas: "",
    },
  });

  useEffect(() => {
    if (negocioActivo?.id) {
      fetchCitas();
      fetchClientes();
      fetchServicios();
    }
  }, [negocioActivo?.id]);

  const fetchCitas = async () => {
    if (!negocioActivo?.id) return;
    
    setLoadingCitas(true);
    try {
      const { data, error } = await supabase
        .from('citas')
        .select(`
          *,
          cliente:clientes(*),
          servicio:servicios(*)
        `)
        .eq('negocio_id', negocioActivo.id)
        .order('fecha', { ascending: false });

      if (error) throw error;
      setCitas(data || []);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las citas.",
        variant: "destructive",
      });
    } finally {
      setLoadingCitas(false);
    }
  };

  const fetchClientes = async () => {
    if (!negocioActivo?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('negocio_id', negocioActivo.id)
        .order('nombre', { ascending: true });

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes.",
        variant: "destructive",
      });
    }
  };

  const fetchServicios = async () => {
    if (!negocioActivo?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('negocio_id', negocioActivo.id)
        .eq('disponible', true)
        .order('nombre', { ascending: true });

      if (error) throw error;
      setServicios(data || []);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (values: FormValues) => {
    if (!negocioActivo?.id) return;

    setLoading(true);
    try {
      const fechaHora = `${values.fecha}T${values.hora}:00`;
      
      if (editingCita) {
        const { error } = await supabase
          .from('citas')
          .update({
            cliente_id: values.cliente_id,
            servicio_id: values.servicio_id || null,
            fecha: fechaHora,
            duracion_minutos: values.duracion_minutos,
            estado: values.estado,
            notas: values.notas,
          })
          .eq('id', editingCita.id);

        if (error) throw error;
        toast({
          title: "Cita actualizada",
          description: "La cita se ha actualizado correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('citas')
          .insert({
            negocio_id: negocioActivo.id,
            cliente_id: values.cliente_id,
            servicio_id: values.servicio_id || null,
            fecha: fechaHora,
            duracion_minutos: values.duracion_minutos,
            estado: values.estado,
            notas: values.notas,
          });

        if (error) throw error;
        toast({
          title: "Cita guardada",
          description: "La cita se ha guardado correctamente.",
        });
      }

      fetchCitas();
      form.reset();
      setEditingCita(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la cita.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cita: Cita) => {
    setEditingCita(cita);
    const fechaObj = new Date(cita.fecha);
    const fecha = fechaObj.toISOString().split('T')[0];
    const hora = fechaObj.toTimeString().slice(0, 5);
    
    form.reset({
      cliente_id: cita.cliente.id,
      servicio_id: cita.servicio_id || "",
      fecha: fecha,
      hora: hora,
      duracion_minutos: cita.duracion_minutos,
      estado: cita.estado,
      notas: cita.notas || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      return;
    }
    try {
      const { error } = await supabase
        .from('citas')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({
        title: "Cita eliminada",
        description: "La cita se ha eliminado correctamente.",
      });
      fetchCitas();
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingCita(null);
    form.reset();
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: "secondary" as const,
      confirmada: "default" as const,
      completada: "outline" as const,
      cancelada: "destructive" as const
    };
    return variants[estado as keyof typeof variants] || "secondary" as const;
  };

  const filteredCitas = citas.filter((cita) => 
    cita.cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cita.cliente.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cita.servicio?.nombre && cita.servicio.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!negocioActivo) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando información del negocio...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span>Gestión de Citas</span>
            </h2>
            <p className="text-muted-foreground">
              Administra las citas y reservas de tus clientes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar citas por cliente, servicio, fecha..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[300px]"
              />
            </div>
            <Button
              onClick={() => {
                setEditingCita(null);
                form.reset();
                setShowForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Nueva Cita
            </Button>
          </div>
        </div>

        {/* Lista de Citas */}
        {loadingCitas ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCitas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No hay citas</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? "No se encontraron citas que coincidan con tu búsqueda." : "No hay citas registradas. ¡Añade tu primera cita!"}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
                  Limpiar búsqueda
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCitas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{cita.cliente.nombre} {cita.cliente.apellido}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              {cita.cliente.email && (
                                <div className="flex items-center mr-3">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {cita.cliente.email}
                                </div>
                              )}
                              {cita.cliente.telefono && (
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {cita.cliente.telefono}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cita.servicio ? (
                          <div>
                            <p className="font-medium">{cita.servicio.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              ${cita.servicio.precio.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sin servicio</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(cita.fecha)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {cita.duracion_minutos} min
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadge(cita.estado)}>
                          {cita.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(cita)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(cita.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Formulario */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingCita ? "Editar Cita" : "Nueva Cita"}
                  </CardTitle>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSave)}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cliente_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cliente</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un cliente" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {clientes.map((cliente) => (
                                    <SelectItem key={cliente.id} value={cliente.id}>
                                      {cliente.nombre} {cliente.apellido}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="servicio_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Servicio (Opcional)</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un servicio" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="">Sin servicio específico</SelectItem>
                                  {servicios.map((servicio) => (
                                    <SelectItem key={servicio.id} value={servicio.id}>
                                      {servicio.nombre} - ${servicio.precio}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fecha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hora"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hora</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duracion_minutos"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duración (minutos)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={e => field.onChange(parseInt(e.target.value) || 30)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="estado"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pendiente">Pendiente</SelectItem>
                                  <SelectItem value="confirmada">Confirmada</SelectItem>
                                  <SelectItem value="completada">Completada</SelectItem>
                                  <SelectItem value="cancelada">Cancelada</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="notas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notas</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Notas adicionales sobre la cita..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingCita ? "Actualizando..." : "Guardando..."}
                          </>
                        ) : (
                          <>{editingCita ? "Actualizar Cita" : "Guardar Cita"}</>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
