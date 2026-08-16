import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

import { Dialog } from '../../components/dialog/dialog';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, Dialog],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss',
})
export class Pedidos implements OnInit{
  crmService = inject(SupabaseService);
  // Estados
  orders = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  startDate = signal<string>(this.getDefaultStartDate());
  endDate = signal<string>(this.getDefaultEndDate());

  getDefaultStartDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  }

  getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Estados del Modal
  isModalOpen = signal<boolean>(false);
  selectedOrder = signal<any>(null);
  orderItems = signal<any[]>([]);
  isLoadingDetails = signal<boolean>(false);
  isUpdating = signal<boolean>(false);

  // Dialog State
  dialogMessage = signal<string | null>(null);
  dialogType = signal<'success' | 'error'>('success');
  
  closeDialog() {
    this.dialogMessage.set(null);
  }

  ngOnInit() {
    this.loadOrders();
    console.log('Pedidos cargados:', this.orders());
  }

  async loadOrders() {
    this.isLoading.set(true);
    try {
      const data = await this.crmService.getAllOrders(this.startDate(), this.endDate());
      this.orders.set(data);
    } catch (error) {
      console.error('Error', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async openOrderDetails(order: any) {
    this.selectedOrder.set(order);
    this.isModalOpen.set(true);
    this.isLoadingDetails.set(true);

    try {
      // Cargamos los items de la orden seleccionada usando el UUID original
      const targetId = order.original_id || order.id;
      const items = await this.crmService.getOrderDetails(targetId);
      this.orderItems.set(items);
    } catch (error) {
      console.error('Error al cargar items del pedido:', error);
    } finally {
      this.isLoadingDetails.set(false);
    }
  }

  printReceipt() {
    window.print();
  }

  sendInvoiceEmail() {
    const order = this.selectedOrder();
    if (!order || !order.email) {
      this.dialogType.set('error');
      this.dialogMessage.set('El pedido no tiene un correo electrónico registrado.');
      return;
    }

    const items = this.orderItems();
    const itemsText = items.length > 0
      ? items.map(i => `• ${i.quantity}x ${i.product_name} - $${(i.quantity * i.unit_price).toFixed(2)}`).join('\n')
      : `• Total del pedido: $${order.total_amount.toFixed(2)}`;

    const subject = encodeURIComponent(`Comprobante de Pedido #${order.id} | Estancos D.C.`);
    const body = encodeURIComponent(
      `Estimado/a ${order.billing_razon_social || order.customer},\n\n` +
      `Gracias por tu compra en Estancos Destilería Clandestina. A continuación encontrarás el resumen y comprobante de tu pedido:\n\n` +
      `--------------------------------------------------\n` +
      `N° PEDIDO: ${order.id}\n` +
      `FECHA: ${this.formatDate(order.created_at)}\n` +
      `ESTADO: ${(order.status || 'Pendiente').toUpperCase()}\n` +
      `--------------------------------------------------\n\n` +
      `DATOS DE FACTURACIÓN:\n` +
      `Razón Social / Nombre: ${order.billing_razon_social || 'Consumidor Final'}\n` +
      `RUC / C.I.: ${order.billing_ruc_ci || '9999999999999'}\n` +
      `Correo: ${order.email}\n` +
      `Dirección de Envío: ${order.shipping_address?.address || 'N/A'}, ${order.shipping_address?.sector || ''}, ${order.shipping_address?.city || ''}\n\n` +
      `DETALLE DE PRODUCTOS:\n` +
      `${itemsText}\n\n` +
      `TOTAL A PAGAR: $${order.total_amount.toFixed(2)}\n\n` +
      `--------------------------------------------------\n` +
      `Puedes guardar o imprimir este comprobante como respaldo de tu compra.\n\n` +
      `Atentamente,\n` +
      `Estancos Destilería Clandestina\n` +
      `WhatsApp: +593 99 858 1721\n` +
      `estancos.d.c@outlook.com`
    );

    window.open(`mailto:${order.email}?subject=${subject}&body=${body}`, '_blank');

    this.dialogType.set('success');
    this.dialogMessage.set(`Se abrió tu gestor de correo para enviar el comprobante a ${order.email}`);
  }

  closeModal() {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.selectedOrder.set(null);
      this.orderItems.set([]);
    }, 300); // Esperar a que termine la animación
  }

  async updateStatus(newStatus: string) {
    if (!this.selectedOrder() || this.selectedOrder().status === newStatus) return;

    this.isUpdating.set(true);
    try {
      await this.crmService.updateOrderStatus(this.selectedOrder().original_id, newStatus);

      // Actualizamos el estado localmente para no recargar toda la página
      this.selectedOrder.update((order: any) => ({ ...order, status: newStatus }));
      this.orders.update((list: any[]) => list.map(o => o.id === this.selectedOrder().id ? { ...o, status: newStatus } : o));

      // Feedback visual (opcional)
      this.dialogType.set('success');
      this.dialogMessage.set('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error', error);
      this.dialogType.set('error');
      this.dialogMessage.set('Hubo un error al actualizar el estado');
    } finally {
      this.isUpdating.set(false);
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.startDate.set(input.value);
    this.loadOrders();
  }

  onEndDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.endDate.set(input.value);
    this.loadOrders();
  }
}
