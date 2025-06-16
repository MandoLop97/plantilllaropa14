
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus, Search, X, Pencil, Trash2, Users, Phone, Mail } from "lucide-react";

// Tipos para mayor robustez
type Negocio = { id: string; nombre: string; };
type Cliente = { id: string; nombre: string; apellido: string; email?: string; telefono?: string; negocio_id: string; };

export default function AdminClientes() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [selectedNegocioId, setSelectedNegocioId] = useState<string | null>(null);
  const [currentClient, setCurrentClient] = useState<Cliente | null>(null);

  const form = useForm<Pick<Cliente, "nombre" | "apellido" | "email" | "telefono">>({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
    },
    mode: "onChange"
  });

  const editForm = useForm<Pick<Cliente, "nombre" | "apellido" | "email" | "telefono">>({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    fetchClientes();
    fetchNegocios();
  }, []);

  const fetchNegocios = async () => {
    const { data, error } = await supabase.from("negocios").select("*");
    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los negocios.", variant: "destructive" });
    } else if (data && data.length > 0) {
      setNegocios(data);
      setSelectedNegocioId(data[0].id);
    } else {
      setNegocios([]);
      setSelectedNegocioId(null);
    }
  };

  const fetchClientes = async () => {
    const { data, error } = await supabase.from("clientes").select("*");
    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los clientes.", variant: "destructive" });
    } else {
      setClientes(data || []);
    }
  };

  const handleSave = async (data: Pick<Cliente, "nombre" | "apellido" | "email" | "telefono">) => {
    if (!selectedNegocioId) {
      toast({ title: "Error", description: "Debe seleccionar un negocio.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const newClient = {
      ...data,
      negocio_id: selectedNegocioId
    };
    const { error } = await supabase.from("clientes").insert(newClient);
    if (error) {
      toast({ title: "Error", description: "No se pudo crear el cliente: " + error.message, variant: "destructive" });
    } else {
      toast({ title: "Cliente creado", description: "El cliente ha sido creado exitosamente." });
      fetchClientes();
      setDialogOpen(false);
      form.reset();
    }
    setIsLoading(false);
  };

  const handleEdit = (client: Cliente) => {
    setCurrentClient(client);
    editForm.reset({
      nombre: client.nombre,
      apellido: client.apellido,
      email: client.email || "",
      telefono: client.telefono || "",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (client: Cliente) => {
    setCurrentClient(client);
    setDeleteDialogOpen(true);
  };

  const confirmEdit = async (data: Pick<Cliente, "nombre" | "apellido" | "email" | "telefono">) => {
    if (!currentClient) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from("clientes")
      .update({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email || null,
        telefono: data.telefono || null,
      })
      .eq("id", currentClient.id);
    
    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar el cliente: " + error.message, variant: "destructive" });
    } else {
      toast({ title: "Cliente actualizado", description: "El cliente ha sido actualizado exitosamente." });
      fetchClientes();
      setEditDialogOpen(false);
    }
    setIsLoading(false);
  };

  const confirmDelete = async () => {
    if (!currentClient) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", currentClient.id);
    
    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar el cliente: " + error.message, variant: "destructive" });
    } else {
      toast({ title: "Cliente eliminado", description: "El cliente ha sido eliminado exitosamente." });
      fetchClientes();
      setDeleteDialogOpen(false);
    }
    setIsLoading(false);
  };

  const filteredClientes = clientes.filter((c) =>
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.telefono || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MinimalAdminLayout>
      <div className="space-y-6 w-full pt-4 md:pt-0">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Users className="h-6 w-6" />
            Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra tus clientes y su información de contacto
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 shadow-sm transition-all"
            disabled={negocios.length === 0}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>

        {/* Clientes List */}
        <div className="w-full">
          {filteredClientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-card shadow-lg rounded-lg border w-full">
              <div className="bg-muted/50 rounded-full p-6 mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay clientes</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {clientes.length === 0
                  ? "No hay clientes registrados. Haz clic en \"Nuevo Cliente\" para crear uno."
                  : "No se encontraron clientes con esa búsqueda."}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table view */}
              <Card className="border border-gray-200 hidden md:block">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teléfono
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClientes.map((cliente) => (
                          <tr key={cliente.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {cliente.nombre} {cliente.apellido}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {cliente.email || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {cliente.telefono || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEdit(cliente)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(cliente)}
                                  className="text-gray-600 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile card view */}
              <div className="md:hidden space-y-3">
                {filteredClientes.map((cliente) => (
                  <Card key={cliente.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {cliente.nombre} {cliente.apellido}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(cliente)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(cliente)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {cliente.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{cliente.email}</span>
                          </div>
                        )}
                        {cliente.telefono && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{cliente.telefono}</span>
                          </div>
                        )}
                        {!cliente.email && !cliente.telefono && (
                          <div className="text-sm text-gray-400 italic">
                            Sin información de contacto
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Dialog para nuevo cliente */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Nuevo Cliente
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre *</label>
                <Input
                  id="nombre"
                  autoFocus
                  placeholder="Nombre"
                  {...form.register("nombre", { required: "El nombre es obligatorio" })}
                />
                {form.formState.errors.nombre && (
                  <span className="text-xs text-red-600">{form.formState.errors.nombre.message}</span>
                )}
              </div>
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido *</label>
                <Input
                  id="apellido"
                  placeholder="Apellido"
                  {...form.register("apellido", { required: "El apellido es obligatorio" })}
                />
                {form.formState.errors.apellido && (
                  <span className="text-xs text-red-600">{form.formState.errors.apellido.message}</span>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...form.register("email")}
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                <Input
                  id="telefono"
                  placeholder="Teléfono"
                  {...form.register("telefono")}
                />
              </div>
              {negocios.length > 1 && (
                <div className="space-y-2">
                  <label htmlFor="negocio" className="text-sm font-medium text-gray-700">Seleccionar Negocio</label>
                  <select
                    id="negocio"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                    value={selectedNegocioId || ""}
                    onChange={(e) => setSelectedNegocioId(e.target.value)}
                  >
                    {negocios.map(negocio => (
                      <option key={negocio.id} value={negocio.id}>
                        {negocio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {negocios.length === 0 && (
                <div className="text-red-600 text-sm">
                  No hay negocios registrados. Debe crear un negocio antes de agregar clientes.
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || negocios.length === 0 || !form.formState.isValid}>
                  {isLoading ? "Guardando..." : "Crear Cliente"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog para editar cliente */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Editar Cliente
              </DialogTitle>
            </DialogHeader>
            {currentClient && (
              <form onSubmit={editForm.handleSubmit(confirmEdit)} className="space-y-4">
                <div>
                  <label htmlFor="edit-nombre" className="block text-sm font-medium text-gray-700">Nombre *</label>
                  <Input
                    id="edit-nombre"
                    autoFocus
                    placeholder="Nombre"
                    {...editForm.register("nombre", { required: "El nombre es obligatorio" })}
                  />
                  {editForm.formState.errors.nombre && (
                    <span className="text-xs text-red-600">{editForm.formState.errors.nombre.message}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="edit-apellido" className="block text-sm font-medium text-gray-700">Apellido *</label>
                  <Input
                    id="edit-apellido"
                    placeholder="Apellido"
                    {...editForm.register("apellido", { required: "El apellido es obligatorio" })}
                  />
                  {editForm.formState.errors.apellido && (
                    <span className="text-xs text-red-600">{editForm.formState.errors.apellido.message}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Email"
                    {...editForm.register("email")}
                  />
                </div>
                <div>
                  <label htmlFor="edit-telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <Input
                    id="edit-telefono"
                    placeholder="Teléfono"
                    {...editForm.register("telefono")}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading || !editForm.formState.isValid}>
                    {isLoading ? "Guardando..." : "Actualizar Cliente"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para eliminar cliente */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Eliminar Cliente
              </DialogTitle>
            </DialogHeader>
            {currentClient && (
              <div className="py-4">
                <p className="text-center">
                  ¿Está seguro que desea eliminar al cliente <span className="font-semibold">{currentClient.nombre} {currentClient.apellido}</span>?
                </p>
                <p className="text-center text-gray-600 text-sm mt-2">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={confirmDelete} 
                disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Eliminar Cliente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MinimalAdminLayout>
  );
}
