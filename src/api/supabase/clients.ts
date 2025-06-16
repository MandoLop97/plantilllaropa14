
import { supabase } from './client';
import { Database } from './types';

type Cliente = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];

export class ClientsService {
  static async createClient(clientData: Cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(clientData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getClientByEmail(email: string, businessId: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email)
      .eq('negocio_id', businessId)
      .maybeSingle(); // Changed from .single() to .maybeSingle() to handle when no client exists

    if (error) throw error;
    return data; // Will return null if no client found, instead of throwing an error
  }

  static async updateClient(id: string, clientData: ClienteUpdate) {
    const { data, error } = await supabase
      .from('clientes')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
