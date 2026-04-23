import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';
import { CartService } from '../../services/cart';

// Interfaz que mapea a lo que recibimos de Supabase
interface TourProduct {
  id: string;
  name: string;
  category: 'experiencia';
  price: number;
  description: string;
  image_url: string;
  tour_details: {
    duration: string;
    includes: string[];
  };
}

@Component({
  selector: 'app-visitas-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visitas-page.html',
  styleUrl: './visitas-page.scss',
})
export class VisitasPage implements OnInit {
  // En tu entorno real, esto sería: inject(SupabaseService)
  supabaseService = inject(SupabaseService);
  // En tu entorno real, esto sería: inject(CartService)
  cartService = inject(CartService);
  private fb = inject(FormBuilder);

  tours = signal<TourProduct[]>([]);
  isLoading = signal<boolean>(true);
  toastMessage = signal<string | null>(null);

  // Estados del Modal de Reserva
  isBookingModalOpen = signal<boolean>(false);
  selectedTour = signal<TourProduct | null>(null);

  // Estado para cálculo reactivo del total
  attendeesCount = signal<number>(1);
  dateTimeError = signal<string>('');

  // NUEVO ESTADO PARA CARGA DEL BOTÓN
  isSubmitting = signal<boolean>(false);

  calculatedTotal = computed(() => {
    const tour = this.selectedTour();
    return tour ? tour.price * this.attendeesCount() : 0;
  });

  // Formulario Reactivo
  bookingForm = this.fb.group({
    userName: ['', Validators.required],
    userEmail: ['', [Validators.required, Validators.email]],
    bookingDate: ['', Validators.required],
    bookingTime: ['', Validators.required],
    attendees: [1, [Validators.required, Validators.min(1), Validators.max(15)]]
  });

  async ngOnInit() {
    try {
      this.isLoading.set(true);
      // Usamos el servicio simulado para obtener los tours en la vista previa
      const dbTours = await this.supabaseService.getTours();
      this.tours.set(dbTours || []);
    } catch (error) {
      console.error('Error obteniendo tours:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Abre el modal y prepara el formulario
  openBookingModal(tour: TourProduct) {
    this.selectedTour.set(tour);
    this.bookingForm.reset({ attendees: 1 });
    this.attendeesCount.set(1);
    this.dateTimeError.set('');
    this.isBookingModalOpen.set(true);
    document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo
  }

  closeBookingModal() {
    this.isBookingModalOpen.set(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => this.selectedTour.set(null), 300);
  }

  // Retorna la fecha actual en formato YYYY-MM-DD para bloquear fechas pasadas en el input
  todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  isInvalid(field: string): boolean {
    const control = this.bookingForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  updateAttendeesCount() {
    const val = this.bookingForm.get('attendees')?.value;
    this.attendeesCount.set(val && val > 0 ? val : 1);
  }

  // Validación robusta de horarios según el esquema de atención de Estancos
  validateDateTime() {
    const dateVal = this.bookingForm.get('bookingDate')?.value;
    const timeVal = this.bookingForm.get('bookingTime')?.value;

    if (!dateVal || !timeVal) {
      this.dateTimeError.set('');
      return true;
    }

    // Usamos T00:00:00 para evitar desajustes de zona horaria local
    const dateObj = new Date(`${dateVal}T00:00:00`);
    const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const hour = parseInt(timeVal.split(':')[0], 10);

    // Días Cerrados (Lunes a Miércoles)
    if (dayOfWeek >= 1 && dayOfWeek <= 3) {
      this.dateTimeError.set('Nuestra destilería permanece cerrada al público de Lunes a Miércoles.');
      return false;
    }

    // Horarios de Jueves a Sábado (10:00 a 16:00)
    if (dayOfWeek >= 4 && dayOfWeek <= 6) {
      if (hour < 10 || hour >= 16) {
        this.dateTimeError.set('Los horarios de atención de Jueves a Sábado son de 10:00 AM a 4:00 PM.');
        return false;
      }
    }

    // Horarios de Domingo (10:00 a 14:00)
    if (dayOfWeek === 0) {
      if (hour < 10 || hour >= 14) {
        this.dateTimeError.set('Los horarios de atención los Domingos son de 10:00 AM a 2:00 PM.');
        return false;
      }
    }

    this.dateTimeError.set('');
    return true;
  }

  // MÉTODO ACTUALIZADO: Guarda en BD y añade al carrito
  async confirmBooking() {
    if (this.bookingForm.invalid || !this.validateDateTime()) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const tour = this.selectedTour();
    if (!tour) return;

    this.isSubmitting.set(true); // Activamos estado de carga
    const formValues = this.bookingForm.value;

    try {
      // 1. Guardar primero en la base de datos de Supabase como "Pendiente"
      await this.supabaseService.submitTourBooking({
        tour_slug: tour.id,
        user_name: formValues.userName,
        user_email: formValues.userEmail,
        booking_date: formValues.bookingDate,
        attendees: formValues.attendees,
        total_price: this.calculatedTotal(),
        status: 'pendiente'
      });

      // 2. Si guardó exitosamente, procedemos a añadirlo al carrito local
      const dateObj = new Date(`${formValues.bookingDate}T00:00:00`);
      const dateStr = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

      const cartProduct = {
        id: `${tour.id}-${formValues.bookingDate}-${formValues.bookingTime}`,
        name: `${tour.name} (${dateStr} a las ${formValues.bookingTime})`,
        category: tour.category,
        price: tour.price,
        image_url: tour.image_url
      };

      this.cartService.addToCart(cartProduct, formValues.attendees || 1);

      // 3. Cerramos modal y mostramos confirmación
      this.closeBookingModal();
      this.showToast(`Tu reserva para el ${dateStr} se guardó y añadió al carrito.`);

    } catch (error) {
      console.error('Error procesando reserva:', error);
      this.dateTimeError.set('Hubo un problema al procesar la reserva. Intenta de nuevo.');
    } finally {
      this.isSubmitting.set(false); // Desactivamos el estado de carga
    }
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }
}
