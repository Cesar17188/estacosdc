import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../env/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
   // Variable privada que sostiene la conexión
  private supabase: SupabaseClient;

  constructor() {
    // Inicializamos el cliente usando las variables de entorno
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // === MÉTODOS GETTER (Para exponer el cliente) ===

  /**
   * Retorna la instancia principal de Supabase.
   * Útil para operaciones generales (auth, storage, etc).
   */
  get client(): SupabaseClient {
    return this.supabase;
  }

  // === EJEMPLOS DE MÉTODOS ESPECÍFICOS PARA TU PROYECTO ===

  /**
   * Obtiene todos los productos activos de la base de datos.
   */
  async getActiveProducts() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
    return data;
  }

  /**
   * Guarda un nuevo prospecto (lead) del formulario B2B de Aliados.
   */
  async submitDistributorRequest(requestData: any) {
    const { data, error } = await this.supabase
      .from('distributor_requests')
      .insert([requestData]);

    if (error) {
      console.error('Error guardando la solicitud:', error);
      throw error;
    }
    return data;
  }
}
