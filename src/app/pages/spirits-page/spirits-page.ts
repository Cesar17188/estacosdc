import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  short_description?: string;
  long_description: string;
  tasting_notes?: TastingNotes;
  image_url: string;
  reverseLayout?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-spirits-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  /**
   * Obtiene la descripción corta enriquecida con tripletas semánticas para AEO
   */
  getShortDescription(product: Product): string {
    if (!product) return '';
    if (product.short_description && product.short_description.trim().length > 0) {
      return product.short_description.trim();
    }
    const clean = product.description || product.long_description || '';
    if (clean.trim().length > 0 && clean.trim().length <= 130) {
      return clean.trim();
    }
    const name = product.name || 'Destilado Artesanal';
    const baseSemanticSubject = `${name} es producido artesanalmente a 2500 msnm en los Andes ecuatorianos.`;
    if (!clean) return baseSemanticSubject;

    const truncated = clean.trim().substring(0, 90);
    const lastSpace = truncated.lastIndexOf(' ');
    const shortDesc = lastSpace > 45 ? truncated.substring(0, lastSpace) : truncated;
    return `${baseSemanticSubject} ${shortDesc}...`;
  }

  // Manejador de imágenes rotas
  onImageError(event: Event, productName?: string) {
    const target = event.target as HTMLImageElement;
    if (target.getAttribute('data-failed')) {
      return;
    }
    target.setAttribute('data-failed', 'true');
    target.onerror = null;

    const nameLower = (productName || '').toLowerCase();
    if (nameLower.includes('legarda')) {
      target.src = 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/RonEcommerce.jpeg';
    } else if (nameLower.includes('audiencia')) {
      target.src = 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/whiskyEcommerce.jpeg';
    } else if (nameLower.includes('chillos') || nameLower.includes('valley')) {
      target.src = 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/espiritus/whiskey-60-ecommerce.jpeg';
    } else {
      target.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop';
    }
  }
}
