import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { SupabaseService } from '../../services/supabase';

// === INTERFACES ===
interface TastingNotes {
  nose: string;
  palate: string;
  finish: string;
}

interface Product {
  id: string;
  name: string;
  category: 'ron' | 'whisky' | 'accesorios';
  type: string;
  abv: string;
  age: string;
  price: number;
  description: string;
  tasting_notes: TastingNotes;
  image_url: string;
  reverseLayout?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-spirits-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spirits-page.html',
  styleUrl: './spirits-page.scss',
})
export class SpiritsPage implements OnInit {
  // inyección de servicios
  cartService = inject(CartService);
  supabaseService = inject(SupabaseService);

    // === ESTADO REACTIVO ===
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  toastMessage = signal<string | null>(null);

  // === CICLO DE VIDA ===
  async ngOnInit() {
    try {
      this.isLoading.set(true);

      const dbSpirits = await this.supabaseService.getSpirits();

      // Asignamos reverseLayout a los elementos impares para el diseño zig-zag
      const formattedSpirits = dbSpirits.map((spirit, index) => ({
        ...spirit,
        reverseLayout: index % 2 !== 0
      }));

      this.products.set(formattedSpirits);
    } catch (error) {
      console.error('Error cargando la colección de espíritus:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // === ACCIONES DE UI ===
  add(product: Product) {
    this.cartService.addToCart(product);
    this.showToast(`Se añadió ${product.name} a tu carrito.`);
  }

  // Sistema de Toast reemplazando el window.alert nativo
  showToast(msg: string) {
    this.toastMessage.set(msg);
    // El toast desaparece después de 3 segundos
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }

  // Manejador de imágenes rotas
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1000&auto=format&fit=crop';
  }
}
