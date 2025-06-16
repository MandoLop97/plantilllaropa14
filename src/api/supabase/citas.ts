
import { supabase } from './client';
import { logger } from '../../utils/logger';

interface CitaRow {
  id: string;
  fecha: string;
  duracion_minutos: number;
  cliente_id: string;
  servicio_id: string;
  negocio_id: string;
  estado: string;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

interface CitaInput {
  fecha: Date;
  duracionMinutos: number;
  servicioId: string;
  negocioId: string;
  clienteId: string;
  notas?: string;
}

interface ClienteInput {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  negocioId: string;
}

export class CitasService {
  static async getDisponibilidad(
    fecha: Date,
    negocioId: string,
    servicioId?: string
  ): Promise<string[]> {
    try {
      // Formato ISO para fecha
      const fechaISOStart = new Date(fecha);
      fechaISOStart.setHours(0, 0, 0, 0);
      
      const fechaISOEnd = new Date(fecha);
      fechaISOEnd.setHours(23, 59, 59, 999);

      // Consultar citas existentes para este día
      const { data: citasExistentes, error } = await supabase
        .from('citas')
        .select('fecha, duracion_minutos')
        .eq('negocio_id', negocioId)
        .gte('fecha', fechaISOStart.toISOString())
        .lte('fecha', fechaISOEnd.toISOString());
      
      if (error) throw error;

      // Horario comercial típico (9am a 6pm)
      const horarioComercial = [
        '09:00', '10:00', '11:00', '12:00', 
        '13:00', '14:00', '15:00', '16:00', 
        '17:00', '18:00'
      ];

      // Si no hay citas, todos los horarios están disponibles
      if (!citasExistentes || citasExistentes.length === 0) {
        return horarioComercial;
      }

      // Filtrar horarios disponibles (eliminar los que ya tienen cita)
      const horariosOcupados = citasExistentes.map(cita => {
        const fechaCita = new Date(cita.fecha);
        return `${fechaCita.getHours().toString().padStart(2, '0')}:${fechaCita.getMinutes().toString().padStart(2, '0')}`;
      });

      return horarioComercial.filter(hora => !horariosOcupados.includes(hora));
    } catch (error) {
      logger.error('❌ Error al obtener disponibilidad:', undefined, error as Error);
      throw error;
    }
  }

  static async crearCliente(cliente: ClienteInput): Promise<string> {
    try {
      // Verificar si el cliente ya existe por email o teléfono
      let clienteExistente = null;
      
      if (cliente.email) {
        const { data } = await supabase
          .from('clientes')
          .select('id')
          .eq('email', cliente.email)
          .eq('negocio_id', cliente.negocioId)
          .maybeSingle();
          
        if (data) clienteExistente = data;
      }
      
      if (!clienteExistente && cliente.telefono) {
        const { data } = await supabase
          .from('clientes')
          .select('id')
          .eq('telefono', cliente.telefono)
          .eq('negocio_id', cliente.negocioId)
          .maybeSingle();
          
        if (data) clienteExistente = data;
      }
      
      // Si el cliente ya existe, devolver su ID
      if (clienteExistente) {
        return clienteExistente.id;
      }
      
      // Si no existe, crear nuevo cliente
      const { data, error } = await supabase
        .from('clientes')
        .insert({
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          email: cliente.email,
          telefono: cliente.telefono,
          negocio_id: cliente.negocioId
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      logger.error('❌ Error al crear cliente:', undefined, error as Error);
      throw error;
    }
  }

  static async crearCita(cita: CitaInput): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('citas')
        .insert({
          fecha: cita.fecha.toISOString(),
          duracion_minutos: cita.duracionMinutos,
          servicio_id: cita.servicioId,
          negocio_id: cita.negocioId,
          cliente_id: cita.clienteId,
          estado: 'pendiente',
          notas: cita.notas
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      logger.error('❌ Error al crear cita:', undefined, error as Error);
      throw error;
    }
  }
}
