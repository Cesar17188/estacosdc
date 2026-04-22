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

    /**
   * Crea un nuevo pedido en la base de datos y guarda sus ítems correspondientes.
   * @param orderDetails Los datos del formulario de envío
   * @param cartItems El arreglo de productos en el carrito
   * @param totalAmount El valor total a pagar
   */
  async createOrder(orderDetails: any, cartItems: any[], totalAmount: number) {

    // 1. MAGIA AQUÍ: Generamos el ID único en Angular.
    // Esto evita tener que hacer un .select() que viole las políticas de privacidad de lectura de Supabase.
    const orderId = crypto.randomUUID();

    // 2. Construimos el objeto para la tabla principal 'orders'
    const orderData = {
      id: orderId, // Asignamos explícitamente el ID que acabamos de generar
      total_amount: totalAmount,
      contact_email: orderDetails.email,
      status: 'pendiente',
      shipping_address: {
        fullName: orderDetails.fullName,
        phone: orderDetails.phone,
        city: orderDetails.city,
        sector: orderDetails.sector,
        address: orderDetails.address
      }
    };

    // 3. Insertamos la orden SIN usar .select() al final
    const { error: orderError } = await this.supabase
      .from('orders')
      .insert([orderData]);

    if (orderError) {
      console.error('Error al crear la orden principal:', orderError);
      throw orderError;
    }

    // 4. Construimos el arreglo de productos para la tabla 'order_items'
    const itemsData = cartItems.map(item => ({
      order_id: orderId, // Usamos el mismo ID
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price
    }));

    // 5. Insertamos todos los ítems de una sola vez
    const { error: itemsError } = await this.supabase
      .from('order_items')
      .insert(itemsData);

    if (itemsError) {
      console.error('Error al insertar los items de la orden:', itemsError);

      // Lógica de reversión (rollback): Borramos la orden si fallan los ítems
      console.log('Revirtiendo la orden principal para evitar datos huérfanos...');
      const { error: rollbackError } = await this.supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (rollbackError) {
        console.error('Error crítico al intentar revertir la orden:', rollbackError);
      }

      throw itemsError;
    }

    // Si todo salió bien, devolvemos éxito
    return { success: true, orderId: orderId };
  }

  /**
   * Datos para el Dashboard del Administrador
   * 1. Obtiene las estadísticas generales (KPIs) para el Dashboard
   */
  async getDashboardStats() {
    // A. Total de Ventas (Órdenes pagadas, enviadas o entregadas)
    const { data: salesData } = await this.supabase
      .from('orders')
      .select('total_amount')
      .in('status', ['pagado', 'enviado', 'entregado']);

    // Sumamos los totales
    const totalSales = salesData ? salesData.reduce((sum, order) => sum + Number(order.total_amount), 0) : 0;

    // B. Pedidos Pendientes (usamos count para no descargar todos los registros)
    const { count: pendingOrders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendiente');

    // C. Nuevos Leads (Solicitudes de distribuidores sin contactar)
    const { count: newLeads } = await this.supabase
      .from('distributor_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'nuevo');

    // D. Tours Activos (Reservas pendientes o confirmadas)
    const { count: activeTours } = await this.supabase
      .from('tour_bookings')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pendiente', 'confirmado']);

    return {
      totalSales: totalSales,
      pendingOrders: pendingOrders || 0,
      newLeads: newLeads || 0,
      activeTours: activeTours || 0
    };
  }

  /**
   * 2. Obtiene los últimos pedidos para la tabla
   */
  async getRecentOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5); // Traemos solo los 5 más recientes

    if (error) {
      console.error('Error obteniendo órdenes recientes:', error);
      throw error;
    }

    // Mapeamos los datos para adaptarlos a la tabla del Dashboard
    return data.map(order => {
      const dateObj = new Date(order.created_at);
      const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

      return {
        // Tomamos solo la primera parte del UUID para mostrar un "ID corto" estilo factura
        id: `ORD-${order.id.split('-')[0].toUpperCase()}`,
        customer: order.shipping_address?.fullName || 'Cliente Anónimo',
        date: formattedDate,
        amount: Number(order.total_amount),
        status: order.status
      };
    });
  }

  /**
   * 3. Obtiene las últimas solicitudes B2B (Leads)
   */
  async getRecentLeads() {
    const { data, error } = await this.supabase
      .from('distributor_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) {
      console.error('Error obteniendo leads recientes:', error);
      throw error;
    }

    return data.map(lead => {
      const dateObj = new Date(lead.created_at);
      const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

      return {
        company: lead.company,
        contactName: lead.name,
        region: lead.region,
        status: lead.status,
        date: formattedDate
      };
    });
  }
// ==========================================================================
  // MÉTODOS DE AUTENTICACIÓN (CRM)
  // ==========================================================================

  /**
   * Inicia sesión con correo y contraseña.
   */
  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (error) {
      console.error('Error de autenticación:', error.message);
      throw error;
    }

    return data;
  }

  /**
   * Cierra la sesión activa del usuario.
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error;
    }
  }

  /**
   * Verifica si hay una sesión activa (Útil para proteger las rutas del CRM).
   */
  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error obteniendo sesión:', error.message);
      return null;
    }
    return data.session;
  }
}
