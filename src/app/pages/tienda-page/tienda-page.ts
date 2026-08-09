import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { CartService, Product as CartProduct } from '../../services/cart';
import { SupabaseService } from '../../services/supabase';

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

// Interfaz adaptada a las columnas de Supabase
interface Product {
  id: string;
  name: string;
  category: 'ron' | 'whisky' | 'accesorios';
  price: number;
  discount_price?: number | null;
  image_url: string;
  badge?: string;
  stock_quantity: number;
}

@Component({
  selector: 'app-tienda-page',
  standalone: true,
  imports: [DecimalPipe, CommonModule],
  templateUrl: './tienda-page.html',
  styleUrl: './tienda-page.scss',
})
export class TiendaPage implements OnInit {
  cartService = inject(CartService);
  private supabaseService = inject(SupabaseService);

  // === ESTADO REACTIVO ===
  products = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  activeCategory = signal<string>('todos');
  searchQuery = signal<string>('');
  toastMessage = signal<string | null>(null);

  filteredProducts = computed(() => {
    const category = this.activeCategory();
    const query = this.searchQuery().toLowerCase();
    let currentProducts = this.products();

    // 1. Filtrar por categoría
    if (category !== 'todos') {
      currentProducts = currentProducts.filter(p => p.category === category);
    }

    // 2. Filtrar por búsqueda de texto (nombre o categoría)
    if (query) {
      currentProducts = currentProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    return currentProducts;
  });

  async ngOnInit() {
    try {
      this.isLoading.set(true);
      const dbProducts = await this.supabaseService.getActiveProducts();
      this.products.set(dbProducts || []);
    } catch (error) {
      console.error('Error al cargar los productos de Supabase:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Transforma URLs de Supabase Storage para solicitar imágenes redimensionadas y optimizadas
   */
  getOptimizedImageUrl(url: string, width = 600, quality = 80): string {
    if (!url) return '';
    if (url.includes('/storage/v1/object/public/')) {
      const renderUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      return `${renderUrl}?width=${width}&quality=${quality}&resize=contain`;
    }
    return url;
  }

  /**
   * Genera tripletas semánticas (Sujeto - Predicado - Objeto) para AEO de cada producto de la boutique
   */
  getSemanticTriplets(product: Product): SemanticTriplet[] {
    const categoryName = product.category === 'ron' ? 'el Ron Añejo' : (product.category === 'whisky' ? 'el Whisky Malta' : 'el accesorio exclusivo');
    return [
      { subject: product.name, predicate: 'representa', object: `${categoryName} elaborado a 2500 msnm por Estancos Distilling Co.` },
      { subject: `La botella de ${product.name}`, predicate: 'ofrece', object: 'notas organolépticas únicas y destilación artesanal en alambiques de cobre.' }
    ];
  }

  /**
   * Retorna una descripción continua enriquecida con tripletas semánticas para metadatos AEO
   */
  getFormattedSemanticDescription(product: Product): string {
    const triplets = this.getSemanticTriplets(product);
    const tripletsText = triplets.map(t => `${t.subject} ${t.predicate} ${t.object}`).join(' ');
    return `${product.name} es un producto premium de la boutique Estancos. ${tripletsText}`.trim();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target.src.includes('/render/image/public/')) {
      const originalUrl = target.src.split('?')[0].replace('/render/image/public/', '/object/public/');
      target.src = originalUrl;
      return;
    }
    target.src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop';
  }

  // === ACCIONES DE UI ===
  setCategory(category: string) {
    this.activeCategory.set(category);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  addToCart(product: Product) {
    const finalPrice = (product.discount_price && product.discount_price > 0)
      ? product.discount_price
      : product.price;

    const cartProduct = {
      ...product,
      price: finalPrice
    };

    this.cartService.addToCart(cartProduct);
    this.showToast(`Se añadió ${product.name} a tu carrito por $${finalPrice}.`);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
