
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export default function Citas() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isReservando, setIsReservando] = useState(false);

  const handleReserva = async (hora?: string) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas iniciar sesión para reservar una cita.",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Selecciona una fecha",
        description: "Por favor selecciona una fecha para tu cita.",
      });
      return;
    }

    setIsReservando(true);
    
    try {
      // Primero buscamos el negocio
      const { data: negocioData, error: negocioError } = await supabase
        .from('negocios')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (negocioError) throw negocioError;
      
      if (!negocioData) {
        throw new Error("No se encontró un negocio disponible");
      }
      
      // Buscamos si el cliente ya existe
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', user.email)
        .eq('negocio_id', negocioData.id)
        .maybeSingle();
        
      let clienteId;
      
      if (clienteError) throw clienteError;
      
      // Si no existe el cliente, lo creamos
      if (!clienteData) {
        const { data: nuevoCliente, error: crearClienteError } = await supabase
          .from('clientes')
          .insert({
            negocio_id: negocioData.id,
            nombre: user.email?.split('@')[0] || 'Cliente',
            apellido: 'Web',
            email: user.email,
          })
          .select('id')
          .single();
          
        if (crearClienteError) throw crearClienteError;
        clienteId = nuevoCliente.id;
      } else {
        clienteId = clienteData.id;
      }
      
      // Formato de fecha con hora para la reserva
      const selectedDate = date;
      const timeStr = hora || "09:00";
      const fechaHora = `${selectedDate.toISOString().split('T')[0]}T${timeStr}:00`;
      
      // Guardamos la cita
      const { error: citaError } = await supabase
        .from('citas')
        .insert({
          negocio_id: negocioData.id,
          cliente_id: clienteId,
          fecha: fechaHora,
          duracion_minutos: 30,
          estado: 'pendiente',
          notas: 'Reserva desde sitio web'
        });
        
      if (citaError) throw citaError;
      
      toast({
        title: "Cita reservada",
        description: `Tu cita ha sido reservada exitosamente para el ${selectedDate.toLocaleDateString()} a las ${timeStr}.`,
      });
      
    } catch (error) {
      console.error("Error al reservar cita:", error);
      toast({
        title: "Error",
        description: "No se pudo reservar la cita. Por favor intenta más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsReservando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Reserva tu cita</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Selecciona una fecha</h2>
          <div className="border rounded-lg p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Horarios disponibles</h2>
          <div className="border rounded-lg p-4">
            <p className="text-muted-foreground mb-4">
              Selecciona un horario para tu cita:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["9:00", "10:00", "11:00", "12:00", "16:00", "17:00"].map((time) => (
                <Button 
                  key={time}
                  variant="outline"
                  className="justify-center"
                  onClick={() => handleReserva(time)}
                  disabled={isReservando}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              className="w-full"
              onClick={() => handleReserva()}
              disabled={isReservando}
            >
              {isReservando ? "Reservando..." : "Reservar cita"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
