import { Component, signal, computed, inject, OnInit  } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartService, Product as CartProduct } from '../../services/cart';
import { SupabaseService } from '../../services/supabase';

// Interfaz adaptada a las columnas de Supabase
interface Product {
  id: string;
  name: string;
  category: 'ron' | 'whisky' | 'accesorios';
  price: number;
  image_url: string;
  badge?: string;
  stock_quantity: number;
}

@Component({
  selector: 'app-tienda-page',
  imports: [ DecimalPipe ],
  templateUrl: './tienda-page.html',
  styleUrl: './tienda-page.scss',
})
export class TiendaPage implements OnInit{
  // === INYECCIÓN DE SERVICIOS ===
  // Nota para proyecto local: Usa imports reales
  cartService = inject(CartService);
  private supabaseService = inject(SupabaseService);
  // === ESTADO REACTIVO ===
  products = signal<any[]>([]);
  isLoading = signal<boolean>(true); // Controla el spinner
  activeCategory = signal<string>('todos');
  searchQuery = signal<string>(''); // Nuevo estado para la búsqueda de texto

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
  // === CICLO DE VIDA DE ANGULAR ===
  // Se ejecuta automáticamente al cargar la página
  async ngOnInit() {
    try {
      this.isLoading.set(true); // Encendemos el loader

      // Llamada asíncrona a Supabase
      const dbProducts = await this.supabaseService.getActiveProducts();

      // Guardamos la data en nuestro estado local
      this.products.set(dbProducts || []);

    } catch (error) {
      console.error('Error al cargar los productos de Supabase:', error);
      // Opcional: Mostrar una alerta o mensaje de error al usuario
    } finally {
      this.isLoading.set(false); // Apagamos el loader
    }
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
    // Mapeamos el objeto local 'Product' (con image_url de DB)
    // al formato que espera el CartService (con imageUrl)
    const productToCart: CartProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.image_url,
      badge: product.badge
    };
    this.cartService.addToCart(productToCart);
    alert(`Se añadió ${product.name} a tu carrito.`);
  }
}
