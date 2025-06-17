
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { CitasService } from '../../api/supabase/citas';
import { useToast } from '@/hooks/use-toast';
import { Clock, CalendarDays, AlertCircle } from 'lucide-react';
import { useDynamicBusinessId } from '../../contexts/DynamicBusinessIdContext';
import { useIsMobile } from '../../hooks/use-mobile';

interface CitasCalendarProps {
  servicioId?: string;
  onDateSelected: (fecha: Date) => void;
  onTimeSelected: (hora: string) => void;
  fechaSeleccionada?: Date;
  horaSeleccionada?: string | null;
}

export const CitasCalendar: React.FC<CitasCalendarProps> = ({
  servicioId,
  onDateSelected,
  onTimeSelected,
  fechaSeleccionada,
  horaSeleccionada
}) => {
  const { toast } = useToast();
  const { businessId } = useDynamicBusinessId();
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Calcular fecha mínima (hoy) y máxima (30 días después)
  const hoy = new Date();
  const minDate = startOfDay(hoy);
  const maxDate = addDays(hoy, 30);

  // Función para deshabilitar fechas pasadas y fines de semana
  const disabledDays = (date: Date) => {
    // Deshabilitar fechas pasadas
    if (isBefore(date, minDate)) return true;
    
    // Opcionalmente: deshabilitar domingos (0) y sábados (6)
    // const day = date.getDay();
    // return day === 0 || day === 6;
    
    return false;
  };

  // Query para cargar disponibilidad cuando se seleccione una fecha
  const { refetch: fetchDisponibilidad } = useQuery({
    queryKey: ['disponibilidad', fechaSeleccionada, servicioId, businessId],
    queryFn: async () => {
      if (!fechaSeleccionada || !businessId) return [];
      
      return await CitasService.getDisponibilidad(
        fechaSeleccionada,
        businessId,
        servicioId
      );
    },
    enabled: !!fechaSeleccionada && !!businessId,
  });

  // Cuando cambie la fecha seleccionada, resetear la hora y buscar disponibilidad
  useEffect(() => {
    if (fechaSeleccionada && businessId) {
      onTimeSelected('');
      fetchDisponibilidad().then((result) => {
        if (result.data) {
          setHorariosDisponibles(result.data);
          // Si no hay horarios disponibles, mostrar un mensaje
          if (result.data.length === 0) {
            toast({
              title: "No hay horarios disponibles",
              description: "Por favor selecciona otra fecha",
              variant: "destructive"
            });
          }
        }
      }).catch((error) => {
        console.error('Error al cargar disponibilidad:', error);
        toast({
          title: "Error al cargar disponibilidad",
          description: "Por favor intenta nuevamente",
          variant: "destructive"
        });
      });
    }
  }, [fechaSeleccionada, businessId, fetchDisponibilidad, onTimeSelected, toast]);

  return (
    <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
      {/* Selector de Fecha */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
            Selecciona una fecha
          </CardTitle>
          <CardDescription className="text-sm">
            Elige el día para tu cita
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={fechaSeleccionada}
            onSelect={(date) => {
              if (date) onDateSelected(date);
            }}
            disabled={disabledDays}
            locale={es}
            fromDate={minDate}
            toDate={maxDate}
            className={`rounded-lg border-0 ${isMobile ? 'scale-90' : ''}`}
            classNames={{
              months: "space-y-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 rounded-md transition-colors",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </CardContent>
      </Card>

      {/* Selector de Hora */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Selecciona una hora
          </CardTitle>
          <CardDescription className="text-sm">
            {fechaSeleccionada ? (
              <>Horarios para el {format(fechaSeleccionada, "EEEE d 'de' MMMM", { locale: es })}</>
            ) : (
              <>Primero selecciona una fecha</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] sm:min-h-[250px]">
          {!fechaSeleccionada ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
              <Clock size={isMobile ? 28 : 36} className="mx-auto mb-3 opacity-50" />
              <p className="text-center text-sm sm:text-base">Selecciona una fecha para ver los horarios disponibles</p>
            </div>
          ) : horariosDisponibles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="text-center p-4 sm:p-6 bg-amber-50 rounded-xl border border-amber-200 w-full">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-amber-700 font-medium mb-1">No hay horarios disponibles</p>
                <p className="text-sm text-amber-600">Por favor selecciona otra fecha</p>
              </div>
            </div>
          ) : (
            <div className={`grid gap-2 sm:gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-3 xl:grid-cols-4'}`}>
              {horariosDisponibles.map((hora) => (
                <Button
                  key={hora}
                  variant={horaSeleccionada === hora ? "default" : "outline"}
                  className={`w-full transition-all duration-200 ${
                    horaSeleccionada === hora 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg scale-105' 
                      : 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
                  } ${isMobile ? 'text-sm py-2' : 'py-3'}`}
                  onClick={() => onTimeSelected(hora)}
                >
                  {hora}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
