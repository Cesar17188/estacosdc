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
   * Obtiene los 3 espíritus destacados para la página de inicio (Home)
   */
  async getFeaturedSpirits() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .in('category', ['ron', 'whisky']) // Filtra solo licores, excluye accesorios
      .eq('is_active', true)
      .limit(3); // Trae máximo 3 resultados

    if (error) {
      console.error('Error obteniendo espíritus destacados:', error);
      throw error;
    }
    return data;
  }

  /**
   * Obtiene el catálogo completo de espíritus (Página de Espíritus)
   */
  async getSpirits() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .in('category', ['ron', 'whisky'])
      .eq('is_active', true)
      .order('created_at', { ascending: true }); // Ordena por los más antiguos primero

    if (error) {
      console.error('Error obteniendo catálogo de espíritus:', error);
      throw error;
    }
    return data;
  }

  /**
   * Obtiene las imágenes para la página de Galería
   */
  async getGalleryImages() {
    const { data, error } = await this.supabase
      .from('gallery_images')
      .select('*')
      // Opcional: puedes descomentar la siguiente línea si quieres que
      // las fotos añadidas más recientemente aparezcan primero.
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo imagenes de galería:', error);
      throw error;
    }
    return data;
  }

  /**
   * Obtiene todas las recetas de coctelería activas
   */
  async getCocktails() {
    const { data, error } = await this.supabase
      .from('cocktail_recipes')
      // Seleccionamos los campos y renombramos 'slug' a 'id' para que coincida con el frontend
      .select('id:slug, title, base_spirit, excerpt, image_url, read_time, ingredients, instructions')
      .eq('is_active', true)
      .order('created_at', { ascending: false }); // Las recetas más nuevas primero

    if (error) {
      console.error('Error obteniendo recetas de coctelería:', error);
      throw error;
    }

    return data;
  }

  /**
   * Obtiene todos los tours activos de la base de datos.
   */
  async getTours() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category', 'experiencia')
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
