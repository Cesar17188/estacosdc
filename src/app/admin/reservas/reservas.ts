import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { Dialog } from '../../components/dialog/dialog';


@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, Dialog],
  templateUrl: './reservas.html',
  styleUrl: './reservas.scss',
})
export class Reservas implements OnInit{
  crmService = inject(SupabaseService);

  // Estados
  bookings = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Panel State
  isPanelOpen = signal<boolean>(false);
  selectedBooking = signal<any>(null);
  selectedStatus = signal<string>('');
  isUpdating = signal<boolean>(false);

  // Dialog State
  dialogMessage = signal<string | null>(null);
  dialogType = signal<'success' | 'error'>('success');

  ngOnInit() {
    this.loadBookings();
  }

  async loadBookings() {
    this.isLoading.set(true);
    try {
      const data = await this.crmService.getAllTourBookings();
      this.bookings.set(data);
    } catch (error) {
      console.error('Error cargando reservas', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openBookingDetails(booking: any) {
    this.selectedBooking.set(booking);
    this.selectedStatus.set(booking.status);
    this.isPanelOpen.set(true);
  }

  closePanel() {
    this.isPanelOpen.set(false);
    setTimeout(() => {
      this.selectedBooking.set(null);
    }, 400); // Esperar a que acabe la animación CSS
  }

  closeDialog() {
    this.dialogMessage.set(null);
  }

  async updateStatus() {
    const newStatus = this.selectedStatus();
    if (!this.selectedBooking() || this.selectedBooking().status === newStatus) return;

    this.isUpdating.set(true);
    try {
      const targetId = this.selectedBooking().id;
      await this.crmService.updateTourBookingStatus(targetId, newStatus);

      // Actualización local para la UI
      this.selectedBooking.update((b: any) => ({ ...b, status: newStatus }));
      this.bookings.update(list => list.map(b => b.id === targetId ? { ...b, status: newStatus } : b));

      // Feedback visual para confirmar el cambio
      this.dialogType.set('success');
      this.dialogMessage.set('Estado de reserva actualizado exitosamente');
    } catch (error: any) {
      console.error('Error actualizando el estado', error);
      this.dialogType.set('error');
      this.dialogMessage.set('Error al actualizar: ' + (error.message || 'Error desconocido'));
    } finally {
      this.isUpdating.set(false);
    }
  }

  // Utilidad para mostrar la fecha de manera más legible
  formatVisitDate(dateString: string): string {
    // Para las fechas de reserva (solo día/mes/año), las tratamos en UTC para que no haya salto de día por zona horaria
    const date = new Date(`${dateString}T12:00:00Z`);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

    // Capitalizar la primera letra del resultado
    let formatted = date.toLocaleDateString('es-ES', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
