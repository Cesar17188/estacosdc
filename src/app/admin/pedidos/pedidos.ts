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
      // Cargamos los items de la orden seleccionada
      const items = await this.crmService.getOrderDetails(order.id);
      this.orderItems.set(items);
    } catch (error) {
      console.error('Error', error);
    } finally {
      this.isLoadingDetails.set(false);
    }
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
