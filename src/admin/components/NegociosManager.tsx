
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNegocioActivo } from "@/hooks/useNegocioActivo";
import { supabase } from "@/lib/supabase";
import { Negocio } from "@/lib/supabase";
import { Loader2, Plus, Building, Edit, Trash2, Check } from "lucide-react";
import SupabaseImageUpload from "./SupabaseImageUpload";

interface FormValues {
  id?: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  subdominio: string;
  logo_url: string;
  banner_url: string;
}

export default function NegociosManager() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { negocioActivo, negocios, isLoading: negociosLoading, setActiveNegocio, refetchNegocios } = useNegocioActivo(user?.id || null);
  const [loading, setLoading] = useState(false);
  const [editingNegocio, setEditingNegocio] = useState<Negocio | null>(null);
  const [creatingNegocio, setCreatingNegocio] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      email: "",
      subdominio: "",
      logo_url: "",
      banner_url: "",
    },
  });

  const handleCreateNegocio = () => {
    setEditingNegocio(null);
    setCreatingNegocio(true);
    form.reset({
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      email: "",
      subdominio: "",
      logo_url: "",
      banner_url: "",
    });
  };

  const handleEditNegocio = (negocio: Negocio) => {
    setCreatingNegocio(false);
    setEditingNegocio(negocio);
    form.reset({
      id: negocio.id,
      nombre: negocio.nombre,
      descripcion: negocio.descripcion || "",
      direccion: negocio.direccion || "",
      telefono: negocio.telefono || "",
      email: negocio.email || "",
      subdominio: (negocio as any).subdominio || "",
      logo_url: negocio.logo_url || "",
      banner_url: negocio.banner_url || "",
    });
  };

  const handleDeleteNegocio = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este negocio?")) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('negocios').delete().eq('id', id);
      if (error) throw error;
      
      await refetchNegocios();
      
      toast({
        title: "Negocio eliminado",
        description: "El negocio se ha eliminado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el negocio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    try {
      setLoading(true);
      if (editingNegocio) {
        const { error } = await supabase
          .from('negocios')
          .update({
            nombre: values.nombre,
            descripcion: values.descripcion,
            direccion: values.direccion,
            telefono: values.telefono,
            email: values.email,
            subdominio: values.subdominio || null,
            logo_url: values.logo_url || null,
            banner_url: values.banner_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNegocio.id);
        if (error) throw error;
        toast({
          title: "Negocio actualizado",
          description: "Los datos del negocio se han actualizado correctamente.",
        });
      } else {
        // Validate subdomain uniqueness before creating
        if (values.subdominio) {
          const { data: existing, error: subError } = await supabase
            .from('negocios')
            .select('id')
            .eq('subdominio', values.subdominio);
          if (subError) throw subError;
          if (existing && existing.length > 0) {
            toast({
              title: 'Subdominio no disponible',
              description: 'El subdominio elegido ya está en uso.',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
        }
        const { data, error } = await supabase
          .from('negocios')
          .insert({
            user_id: user.id,
            nombre: values.nombre,
            descripcion: values.descripcion,
            direccion: values.direccion,
            telefono: values.telefono,
            email: values.email,
            subdominio: values.subdominio || null,
            logo_url: values.logo_url || null,
            banner_url: values.banner_url || null,
          })
          .select()
          .single();
          
        if (error) throw error;
        
        if (negocios.length === 0 && data) {
          await setActiveNegocio(data.id);
        }
        
        toast({
          title: "Negocio creado",
          description: "Tu negocio se ha creado correctamente.",
        });
      }
      await refetchNegocios();
      setEditingNegocio(null);
      setCreatingNegocio(false);
      form.reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "No se pudo guardar el negocio.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingNegocio(null);
    setCreatingNegocio(false);
    form.reset({
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      email: "",
      subdominio: "",
      logo_url: "",
      banner_url: "",
    });
  };

  const handleSelectNegocio = async (negocio: Negocio) => {
    await setActiveNegocio(negocio.id);
    navigate("/admin");
  };

  if (!negociosLoading && negocios.length === 0 && !creatingNegocio) {
    return (
      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-gray-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Crear primer negocio</CardTitle>
            <p className="text-gray-600">
              No tienes ningún negocio registrado. Crea tu primer negocio para comenzar.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateNegocio} className="w-full" variant="minimal">
              <Plus className="mr-2 h-4 w-4" /> 
              Crear mi primer negocio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!creatingNegocio && !editingNegocio && (
        <div className="flex justify-end">
          <Button onClick={handleCreateNegocio} variant="minimal">
            <Plus className="mr-2 h-4 w-4" /> 
            Nuevo Negocio
          </Button>
        </div>
      )}

      {negociosLoading && negocios.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {(creatingNegocio || editingNegocio) && (
            <div className={creatingNegocio && !editingNegocio ? "fixed inset-0 bg-white z-50 overflow-auto p-4 flex justify-center" : ""}>
            <Card className="border border-gray-200 w-full max-w-2xl">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  {editingNegocio ? (
                    <>
                      <Edit className="h-5 w-5" />
                      Editar Negocio
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Nuevo Negocio
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Nombre del Negocio</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre de tu negocio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subdominio"
                      rules={{
                        pattern: {
                          value: /^[a-z0-9-]+$/i,
                          message: 'Solo letras, números y guiones',
                        },
                        validate: async (value) => {
                          if (!value) return true;
                          const { data } = await supabase
                            .from('negocios')
                            .select('id')
                            .eq('subdominio', value);
                          return data && data.length === 0 || 'Subdominio no disponible';
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Subdominio</FormLabel>
                          <FormControl>
                            <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-gray-400">
                              <Input
                                placeholder="mi-negocio"
                                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                              />
                              <span className="inline-flex items-center px-3 bg-gray-50 text-gray-700 text-sm border-l border-gray-300">
                                .gutix.site
                              </span>
                            </div>
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
                          <FormLabel className="text-gray-700">Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe tu negocio" 
                              rows={3}
                              className="border-gray-300 focus-visible:ring-gray-400"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Dirección</FormLabel>
                            <FormControl>
                              <Input placeholder="Dirección del negocio" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="Teléfono de contacto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="logo_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Logo</FormLabel>
                            <FormControl>
                              <SupabaseImageUpload
                                onImageSelect={(url) => form.setValue('logo_url', url)}
                                currentImageUrl={field.value}
                                negocioId={editingNegocio?.id || 'new'}
                                bucketName="infonegocio"
                                folderPath={`Logo/${editingNegocio?.id || 'new'}`}
                                label="Logo"
                                previewClassName="h-20 w-20 rounded-lg object-cover border shadow mx-auto"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="banner_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Portada</FormLabel>
                            <FormControl>
                              <SupabaseImageUpload
                                onImageSelect={(url) => form.setValue('banner_url', url)}
                                currentImageUrl={field.value}
                                negocioId={editingNegocio?.id || 'new'}
                                bucketName="infonegocio"
                                folderPath={`Banner/${editingNegocio?.id || 'new'}`}
                                label="Portada"
                                previewClassName="h-24 w-full rounded-lg object-cover border shadow mx-auto"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email de contacto</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email de contacto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        variant="minimal"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingNegocio ? "Actualizando..." : "Creando..."}
                          </>
                        ) : (
                          editingNegocio ? "Actualizar" : "Crear"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            </div>
          )}

          {negocios.length > 0 && !creatingNegocio && !editingNegocio && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {negocios.map((negocio) => (
                <Card key={negocio.id} className="border border-gray-200 hover:border-gray-300 transition-colors relative">
                  {negocioActivo?.id === negocio.id && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white p-1 rounded-full">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-8">
                        <CardTitle className="text-lg text-gray-900">
                          {negocio.nombre}
                          {negocioActivo?.id === negocio.id && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Activo
                            </span>
                          )}
                        </CardTitle>
                        {negocio.descripcion && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {negocio.descripcion}
                          </p>
                        )}
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {negocio.direccion && <p><span className="font-medium">Dirección:</span> {negocio.direccion}</p>}
                      {negocio.telefono && <p><span className="font-medium">Teléfono:</span> {negocio.telefono}</p>}
                      {negocio.email && <p><span className="font-medium">Email:</span> {negocio.email}</p>}
                    </div>
                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditNegocio(negocio)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteNegocio(negocio.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                        </Button>
                      </div>
                      {negocioActivo?.id !== negocio.id && (
                        <Button 
                          onClick={() => handleSelectNegocio(negocio)} 
                          variant="minimal"
                          className="w-full"
                        >
                          Seleccionar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
