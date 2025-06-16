
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { CitasService } from "../../api/supabase/citas";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, User, Calendar, Mail, Phone, MessageSquare, DollarSign } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

const citaFormSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  apellido: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z
    .string()
    .email({
      message: "Ingresa un email válido.",
    })
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .min(10, {
      message: "El teléfono debe tener al menos 10 dígitos.",
    })
    .optional()
    .or(z.literal("")),
  notas: z.string().optional(),
});

interface CitasFormProps {
  servicio: any;
  fecha: Date | undefined;
  hora: string | null;
  businessId: string;
}

export const CitasForm: React.FC<CitasFormProps> = ({
  servicio,
  fecha,
  hora,
  businessId,
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof citaFormSchema>>({
    resolver: zodResolver(citaFormSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      notas: "",
    },
  });

  const reservarCitaMutation = useMutation({
    mutationFn: async (data: z.infer<typeof citaFormSchema>) => {
      if (!fecha || !hora || !servicio) {
        throw new Error("Faltan datos para la reserva");
      }

      // Crear el cliente
      const clienteId = await CitasService.crearCliente({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email || undefined,
        telefono: data.telefono || undefined,
        negocioId: businessId,
      });

      // Crear la fecha completa (fecha + hora)
      const [hours, minutes] = hora.split(":").map(Number);
      const fechaCompleta = new Date(fecha);
      fechaCompleta.setHours(hours, minutes, 0, 0);

      // Crear la cita
      const citaId = await CitasService.crearCita({
        fecha: fechaCompleta,
        duracionMinutos: servicio.duracionMinutos,
        servicioId: servicio.id,
        negocioId: businessId,
        clienteId: clienteId,
        notas: data.notas,
      });

      return { citaId, clienteId };
    },
    onSuccess: () => {
      toast({
        title: "¡Cita reservada con éxito!",
        description: "Te hemos enviado un correo con los detalles de tu cita.",
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Error al reservar cita:", error);
      toast({
        title: "Error al reservar cita",
        description: "Por favor intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof citaFormSchema>) {
    reservarCitaMutation.mutate(data);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Resumen de la cita */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-blue-800 text-xl sm:text-2xl">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Resumen de tu cita
          </CardTitle>
          <CardDescription className="text-blue-600 text-sm sm:text-base">
            Revisa los detalles antes de confirmar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
            <div className="flex items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100">
              <User className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium text-gray-600 block">Servicio:</span>
                <p className="text-gray-900 font-semibold text-sm sm:text-base truncate">{servicio?.nombre}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100">
              <Calendar className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium text-gray-600 block">Fecha:</span>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {fecha ? format(fecha, isMobile ? "d MMM yyyy" : "EEEE d 'de' MMMM", { locale: es }) : ""}
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100">
              <Clock className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium text-gray-600 block">Hora:</span>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">{hora}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100">
              <DollarSign className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium text-gray-600 block">Precio:</span>
                <p className="text-gray-900 font-semibold text-lg sm:text-xl">
                  ${servicio?.precio.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">Completa tus datos</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Para confirmar tu cita necesitamos algunos datos de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
              id="cita-form"
            >
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Nombre *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tu nombre" 
                          className="h-11 sm:h-12" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Apellido *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tu apellido" 
                          className="h-11 sm:h-12" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          className="h-11 sm:h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Para enviarte confirmación de tu cita
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        Teléfono
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tu teléfono" 
                          className="h-11 sm:h-12" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Para contactarte si es necesario
                      </FormDescription>
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
                    <FormLabel className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      Notas adicionales
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alguna información adicional que quieras compartir (opcional)"
                        className="min-h-[80px] sm:min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="pt-4">
          <Button
            type="submit"
            form="cita-form"
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 ${
              isMobile ? 'py-3' : 'py-4'
            }`}
            disabled={reservarCitaMutation.isPending}
          >
            {reservarCitaMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Reservando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Confirmar reserva
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
