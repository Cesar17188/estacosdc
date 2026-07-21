import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // ==========================================================================
  // 1. AUTENTICACIÓN Y PERFIL (AUTH)
  // ==========================================================================

  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) return null;
    return data.session;
  }

  async getUserProfile() {
    const { data: sessionData, error: sessionError } = await this.supabase.auth.getSession();
    if (sessionError || !sessionData.session) return null;

    const userId = sessionData.session.user.id;
    const { data, error } = await this.supabase
      .from('profiles')
      .select('first_name, last_name, is_staff')
      .eq('id', userId)
      .single();

    if (error) {
      // Retornamos una estructura consistente si falla la consulta
      return {
        email: sessionData.session.user.email,
        first_name: null,
        last_name: null,
        is_staff: false
      };
    }
    return { ...data, email: sessionData.session.user.email };
  }


  // ==========================================================================
  // 2. WEB PÚBLICA (E-COMMERCE, CATÁLOGO, VISITAS, BLOG)
  // ==========================================================================

  async getActiveProducts() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('category', 'experiencia')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getFeaturedSpirits() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .in('category', ['ron', 'whisky'])
      .eq('is_active', true)
      .limit(3);
    if (error) throw error;
    return data;
  }

  async getSpirits() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .in('category', ['ron', 'whisky'])
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async getTours() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category', 'experiencia')
      .eq('is_active', true)
      .order('price', { ascending: true });
    if (error) throw error;
    return data;
  }

  async getCocktails() {
    const { data, error } = await this.supabase
      .from('cocktail_recipes')
      .select('id:slug, title, base_spirit, excerpt, image_url, read_time, ingredients, instructions')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getGalleryImages() {
    const { data, error } = await this.supabase
      .from('gallery_images')
      .select('*');
    if (error) throw error;
    return data;
  }

  async submitDistributorRequest(requestData: any) {
    const { data, error } = await this.supabase
      .from('distributor_requests')
      .insert([requestData]);
    if (error) throw error;
    return data;
  }

  async submitTourBooking(bookingData: any) {
    const { data, error } = await this.supabase
      .from('tour_bookings')
      .insert([bookingData]);
    if (error) throw error;
    return data;
  }

  // ==========================================================================
  // 3. CHECKOUT (CARRITO DE COMPRAS)
  // ==========================================================================

  async createOrder(orderDetails: any, cartItems: any[], totalAmount: number) {
    const orderId = crypto.randomUUID();

    const orderData = {
      id: orderId,
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

    const { error: orderError } = await this.supabase.from('orders').insert([orderData]);
    if (orderError) throw orderError;

    const itemsData = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await this.supabase.from('order_items').insert(itemsData);

    if (itemsError) {
      await this.supabase.from('orders').delete().eq('id', orderId);
      throw itemsError;
    }

    return { success: true, orderId: orderId };
  }


  // ==========================================================================
  // 4. MÓDULO CRM (PANEL DE ADMINISTRADOR)
  // ==========================================================================

  // --- DASHBOARD (KPIs) ---
  async getDashboardStats(startDate?: string, endDate?: string) {
    let salesQuery = this.supabase
      .from('orders')
      .select('total_amount, created_at')
      .in('status', ['pagado', 'enviado', 'entregado']);

    let ordersQuery = this.supabase
      .from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pendiente');

    let leadsQuery = this.supabase
      .from('distributor_requests').select('*', { count: 'exact', head: true }).eq('status', 'nuevo');

    let toursQuery = this.supabase
      .from('tour_bookings').select('*', { count: 'exact', head: true }).in('status', ['pendiente', 'confirmado']);

    if (startDate) {
      salesQuery = salesQuery.gte('created_at', startDate);
      ordersQuery = ordersQuery.gte('created_at', startDate);
      leadsQuery = leadsQuery.gte('created_at', startDate);
      toursQuery = toursQuery.gte('created_at', startDate);
    }

    if (endDate) {
      const endDateTime = `${endDate}T23:59:59.999Z`;
      salesQuery = salesQuery.lte('created_at', endDateTime);
      ordersQuery = ordersQuery.lte('created_at', endDateTime);
      leadsQuery = leadsQuery.lte('created_at', endDateTime);
      toursQuery = toursQuery.lte('created_at', endDateTime);
    }

    const { data: salesData } = await salesQuery;
    const totalSales = salesData ? salesData.reduce((sum, order) => sum + Number(order.total_amount), 0) : 0;

    const { count: pendingOrders } = await ordersQuery;
    const { count: newLeads } = await leadsQuery;
    const { count: activeTours } = await toursQuery;

    return {
      totalSales: totalSales,
      pendingOrders: pendingOrders || 0,
      newLeads: newLeads || 0,
      activeTours: activeTours || 0
    };
  }

  // --- GESTIÓN DE PEDIDOS ---
  async getRecentOrders() {
    const { data, error } = await this.supabase
      .from('orders').select('*').order('created_at', { ascending: false }).limit(5);
    if (error) throw error;
    return this.mapOrdersForUI(data);
  }

  async getAllOrders(startDate?: string, endDate?: string) {
    let query = this.supabase
      .from('orders').select('*').order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      const endDateTime = `${endDate}T23:59:59.999Z`;
      query = query.lte('created_at', endDateTime);
    }

    const { data, error } = await query;
    if (error) throw error;
    return this.mapOrdersForUI(data);
  }

  private mapOrdersForUI(data: any[]) {
    return data.map(order => {
      const dateObj = new Date(order.created_at);
      const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
      return {
        id: `ORD-${order.id.split('-')[0].toUpperCase()}`,
        original_id: order.id,
        created_at: order.created_at,
        customer: order.shipping_address?.fullName || 'Sin nombre',
        email: order.contact_email,
        date: formattedDate,
        amount: Number(order.total_amount),
        total_amount: Number(order.total_amount),
        status: order.status,
        shipping_address: order.shipping_address
      };
    });
  }

  async getOrderDetails(orderId: string) {
    const { data, error } = await this.supabase
      .from('order_items')
      .select(`quantity, unit_price, products ( name )`)
      .eq('order_id', orderId);
    if (error) throw error;

    return data.map((item: any) => ({
      product_name: item.products?.name || 'Producto Desconocido',
      quantity: item.quantity,
      unit_price: Number(item.unit_price)
    }));
  }

  async updateOrderStatus(orderId: string, newStatus: string) {
    const { error } = await this.supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) throw error;
    return true;
  }

  // --- GESTIÓN DE EMPRESAS (LEADS B2B) ---
  async getRecentLeads() {
    const { data, error } = await this.supabase
      .from('distributor_requests').select('*').order('created_at', { ascending: false }).limit(4);
    if (error) throw error;
    return data.map(lead => ({
      ...lead,
      contactName: lead.name,
      date: new Date(lead.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }));
  }

  async getAllLeads() {
    const { data, error } = await this.supabase
      .from('distributor_requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateLeadStatus(leadId: string, newStatus: string) {
    const { error } = await this.supabase.from('distributor_requests').update({ status: newStatus }).eq('id', leadId);
    if (error) throw error;
    return true;
  }

  // --- GESTIÓN DE RESERVAS DE TOURS ---
  async getAllTourBookings(startDate?: string, endDate?: string) {
    let query = this.supabase
      .from('tour_bookings').select('*').order('booking_date', { ascending: false });

    if (startDate) {
      query = query.gte('booking_date', startDate);
    }
    if (endDate) {
      const endDateTime = `${endDate}T23:59:59.999Z`;
      query = query.lte('booking_date', endDateTime);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateTourBookingStatus(bookingId: string, newStatus: string) {
    console.log(`Actualizando reserva ${bookingId} a estado ${newStatus}...`);
    const { data, error } = await this.supabase.from('tour_bookings').update({ status: newStatus }).eq('id', bookingId).select();
    if (error) {
      console.error('Error de Supabase al actualizar:', error);
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error("No se pudo guardar en Supabase. Verifica que el ID sea correcto y que las políticas de seguridad (RLS) permitan actualizar (UPDATE) la tabla 'tour_bookings'.");
    }
    console.log('Reserva actualizada correctamente en DB:', data);
    return true;
  }

  // --- GESTIÓN DE CATÁLOGO / INVENTARIO ---
  async getAllProducts() {
    const { data, error } = await this.supabase
      .from('products')
      // AÑADIMOS discount_price A LA CONSULTA
      .select('id, slug, name, category, price, discount_price, stock_quantity, is_active, image_url')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo inventario:', error);
      throw error;
    }
    return data;
  }

  async updateProduct(productId: string, updates: any) {
    const { error } = await this.supabase
      .from('products')
      .update({
        name: updates.name,
        price: updates.price,
        discount_price: updates.discount_price, // NUEVO
        stock_quantity: updates.stock_quantity,
        category: updates.category,
        is_active: updates.is_active,
        image_url: updates.image_url
      })
      .eq('id', productId);

    if (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
    return true;
  }

  /**
   * Sube una imagen de producto al Storage de Supabase
   * y devuelve la URL pública de la imagen.
   */
  async uploadProductImage(file: File): Promise<string> {
    // 1. Generamos un nombre único para evitar que se sobreescriban fotos con el mismo nombre
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // 2. Subimos el archivo físico al bucket 'product-images'
    const { error: uploadError } = await this.supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error subiendo imagen al Storage:', uploadError);
      throw uploadError;
    }
    // 3. Solicitamos a Supabase que nos dé la URL pública para poder mostrarla en la web
    const { data } = this.supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Crea un nuevo producto en el catálogo y devuelve los datos insertados.
   */
  async createProductAdmin(productData: any) {
    // 1. Generar un slug a partir del nombre (ej: "Ron Estancos" -> "ron-estancos")
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // 2. Insertar el nuevo producto y pedir que nos devuelva la fila creada (.select().single())
    const { data, error } = await this.supabase
      .from('products')
      .insert([{ ...productData, slug }])
      .select()
      .single();

    if (error) {
      console.error('Error creando el producto:', error);
      throw error;
    }

    return data;
  }

  /**
   * Sube una imagen al Storage de Supabase en el bucket 'galleryImages'
   * @param file Archivo físico seleccionado desde el input file
   * @returns La URL pública de la imagen recién subida
   */
  async uploadGalleryImageFile(file: File): Promise<string> {
    // 1. Generamos un nombre único para evitar colisiones
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // 2. Subimos el archivo al bucket
    const { error: uploadError } = await this.supabase.storage
      .from('galleryImages')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error subiendo imagen a la galería:', uploadError);
      throw uploadError;
    }

    // 3. Obtenemos la URL pública
    const { data } = this.supabase.storage
      .from('galleryImages')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Inserta el registro de la imagen (con su URL, título y tamaño) en la base de datos
   * @param imageData Objeto con la url, title, alt y sizeClass
   */
  async addGalleryImageRecord(imageData: any) {
    const { data, error } = await this.supabase
      .from('gallery_images')
      .insert([imageData])
      .select()
      .single();

    if (error) {
      console.error('Error guardando el registro de la galería:', error);
      throw error;
    }
    return data;
  }

  /**
   * Elimina un registro de imagen de la galería
   * Nota: En producción, podrías querer borrar también el archivo físico del Storage
   */
  async deleteGalleryImage(id: string) {
    const { error } = await this.supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando la imagen:', error);
      throw error;
    }
    return true;
  }

   // ==========================================================================
  // GESTIÓN DE COCTELERÍA (ADMIN)
  // ==========================================================================

  /**
   * Obtiene TODAS las recetas para el panel de administración (incluyendo borradores)
   */
  async getCocktailsAdmin() {
    const { data, error } = await this.supabase
      .from('cocktail_recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Sube una imagen al Storage de Supabase en el bucket 'cocktails'
   */
  async uploadCocktailImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('cocktails')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from('cocktails')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Crea o Actualiza un registro en la tabla cocktail_recipes
   * Si le envías el parámetro 'id', Supabase actualizará esa fila. Si no, creará una nueva.
   */
  async saveCocktailRecipe(recipeData: any, id?: string) {
    let query = this.supabase.from('cocktail_recipes');

    if (id) {
      // Es una actualización (Update)
      const { data, error } = await query
        .update(recipeData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Es una inserción nueva (Insert)
      const { data, error } = await query
        .insert([recipeData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Elimina permanentemente una receta
   */
  async deleteCocktailRecipe(id: string) {
    const { error } = await this.supabase
      .from('cocktail_recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

   // ==========================================================================
  // GESTIÓN DE PROSPECTOS (REDES SOCIALES Y OUTREACH)
  // ==========================================================================

  /**
   * Obtiene todos los prospectos de redes sociales
   */
  async getSocialProspects() {
    const { data, error } = await this.supabase
      .from('social_prospects')
      .select('*')
      .order('updated_at', { ascending: false }); // Vemos los movidos recientemente primero

    if (error) {
      console.error('Error obteniendo prospectos:', error);
      throw error;
    }

    return data;
  }

  /**
   * Crea o actualiza un prospecto
   */
  async saveSocialProspect(prospectData: any, id?: string) {
    let query = this.supabase.from('social_prospects');

    if (id) {
      // Actualizar existente
      const { data, error } = await query
        .update(prospectData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Crear nuevo
      const { data, error } = await query
        .insert([prospectData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Elimina un prospecto definitivamente
   */
  async deleteSocialProspect(id: string) {
    const { error } = await this.supabase
      .from('social_prospects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar el prospecto:', error);
      throw error;
    }

    return true;
  }


  // ==========================================================================
  // 5. INTEGRACIÓN CON GOOGLE CALENDAR (VÍA EDGE FUNCTIONS)
  // ==========================================================================

  /**
   * Obtiene eventos de un calendario específico llamando a una Edge Function
   */
  async getCalendarEvents(calendarName: string = 'Estancos-operaciones') {
    const { data, error } = await this.supabase.functions.invoke('google-calendar', {
      body: { action: 'listEvents', calendarName }
    });

    if (error) {
      console.error('Error fetching calendar events (Http):', error);
      return [];
    }
    if (data?.error) {
      console.error('Error fetching calendar events (Function):', data.error, data.stack);
      return [];
    }
    return data?.events || [];
  }

  /**
   * Crea un nuevo evento en Google Calendar
   */
  async createCalendarEvent(calendarName: string, eventData: any) {
    const { data, error } = await this.supabase.functions.invoke('google-calendar', {
      body: { action: 'createEvent', calendarName, eventData }
    });

    if (error) {
      console.error('Error creating calendar event (Http):', error);
      throw error;
    }
    
    if (data?.error) {
      console.error('Error creating calendar event (Function):', data.error);
      throw new Error(data.error);
    }
    
    return data;
  }

  /**
   * Actualiza un evento en Google Calendar
   */
  async updateCalendarEvent(calendarName: string, eventId: string, eventData: any) {
    const { data, error } = await this.supabase.functions.invoke('google-calendar', {
      body: { action: 'updateEvent', calendarName, eventId, eventData }
    });

    if (error) {
      console.error('Error updating calendar event (Http):', error);
      throw error;
    }
    
    if (data?.error) {
      console.error('Error updating calendar event (Function):', data.error);
      throw new Error(data.error);
    }
    
    return data;
  }

  /**
   * Elimina un evento de Google Calendar
   */
  async deleteCalendarEvent(calendarName: string, eventId: string) {
    const { data, error } = await this.supabase.functions.invoke('google-calendar', {
      body: { action: 'deleteEvent', calendarName, eventId }
    });

    if (error) {
      console.error('Error deleting calendar event (Http):', error);
      throw error;
    }
    
    if (data?.error) {
      console.error('Error deleting calendar event (Function):', data.error);
      throw new Error(data.error);
    }
    
    return data;
  }

}
