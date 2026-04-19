import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './visitas-page.html',
  styleUrl: './visitas-page.scss',
})
export class VisitasPage implements OnInit {
  // En tu entorno real, esto sería: inject(SupabaseService)
  supabaseService = inject(SupabaseService);
  // En tu entorno real, esto sería: inject(CartService)
  cartService = inject(CartService);

  tours = signal<TourProduct[]>([]);
  isLoading = signal<boolean>(true);
  toastMessage = signal<string | null>(null);

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

  addTourToCart(tour: TourProduct) {
    // Transformamos el objeto TourProduct al formato Product que espera el carrito
    const cartProduct = {
      id: tour.id,
      name: tour.name,
      category: tour.category,
      price: tour.price,
      image_url: tour.image_url // Mapeamos image_url a imageUrl
    };

    this.cartService.addToCart(cartProduct);

    this.showToast(`Se ha añadido "${tour.name}" a tu carrito.`);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
