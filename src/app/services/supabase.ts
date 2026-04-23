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
  async getDashboardStats() {
    const { data: salesData } = await this.supabase
      .from('orders')
      .select('total_amount')
      .in('status', ['pagado', 'enviado', 'entregado']);

    const totalSales = salesData ? salesData.reduce((sum, order) => sum + Number(order.total_amount), 0) : 0;

    const { count: pendingOrders } = await this.supabase
      .from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pendiente');

    const { count: newLeads } = await this.supabase
      .from('distributor_requests').select('*', { count: 'exact', head: true }).eq('status', 'nuevo');

    const { count: activeTours } = await this.supabase
      .from('tour_bookings').select('*', { count: 'exact', head: true }).in('status', ['pendiente', 'confirmado']);

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

  async getAllOrders() {
    const { data, error } = await this.supabase
      .from('orders').select('*').order('created_at', { ascending: false });
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
  async getAllTourBookings() {
    const { data, error } = await this.supabase
      .from('tour_bookings').select('*').order('booking_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateTourBookingStatus(bookingId: string, newStatus: string) {
    const { error } = await this.supabase.from('tour_bookings').update({ status: newStatus }).eq('id', bookingId);
    if (error) throw error;
    return true;
  }

  // --- GESTIÓN DE CATÁLOGO / INVENTARIO ---
  async getAllProductsAdmin() {
    const { data, error } = await this.supabase
      .from('products')
      .select('id, slug, name, category, price, stock_quantity, is_active, image_url')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateProductAdmin(productId: string, updates: any) {
    const { error } = await this.supabase
      .from('products')
      .update({
        name: updates.name,
        price: updates.price,
        stock_quantity: updates.stock_quantity,
        category: updates.category,
        is_active: updates.is_active
      })
      .eq('id', productId);
    if (error) throw error;
    return true;
  }

}
