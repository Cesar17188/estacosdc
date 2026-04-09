import { Component, signal, computed  } from '@angular/core';
import { DecimalPipe } from '@angular/common';

interface Product {
  id: string;
  name: string;
  category: 'ron' | 'whisky' | 'accesorios';
  price: number;
  imageUrl: string;
  badge?: string; // Ej: 'Nuevo', 'Agotado', 'Cask Strength'
}

@Component({
  selector: 'app-tienda-page',
  imports: [ DecimalPipe ],
  templateUrl: './tienda-page.html',
  styleUrl: './tienda-page.scss',
})
export class TiendaPage {
  // === SECCIÓN DE DATOS ===
  products: Product[] = [
    {
      id: 'ron-estancos-anejo',
      name: 'Ron Añejo Estancos (750ml)',
      category: 'ron',
      price: 45.00,
      imageUrl: 'https://images.unsplash.com/photo-1614316311652-3d712f602b9f?q=80&w=400&auto=format&fit=crop',
      badge: 'Más Vendido'
    },
    {
      id: 'whiskey-chillos-valley',
      name: 'Whiskey Chillos Valley Grain (750ml)',
      category: 'whisky',
      price: 55.00,
      imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'whisky-coleccionista',
      name: 'Whisky Chillos Coleccionista Cask Strength',
      category: 'whisky',
      price: 85.00,
      imageUrl: 'https://images.unsplash.com/photo-1601614945413-5b839215096a?q=80&w=400&auto=format&fit=crop',
      badge: 'Edición Limitada'
    },
    {
      id: 'copa-glencairn',
      name: 'Copa Glencairn Oficial Estancos',
      category: 'accesorios',
      price: 15.00,
      imageUrl: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'kit-cocteleria',
      name: 'Kit de Coctelería Andina Premium',
      category: 'accesorios',
      price: 120.00,
      imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400&auto=format&fit=crop',
      badge: 'Agotado'
    },
    {
      id: 'ron-estancos-reserva',
      name: 'Ron Reserva Familiar 12 Años',
      category: 'ron',
      price: 95.00,
      imageUrl: 'https://images.unsplash.com/photo-1582222345511-137f8ebcddf5?q=80&w=400&auto=format&fit=crop',
      badge: 'Nuevo'
    }
  ];

  // === LÓGICA DE FILTRADO (ANGULAR SIGNALS) ===

  // Signal para guardar la categoría activa actual
  activeCategory = signal<string>('todos');

  // Computed Signal: Reacciona automáticamente cuando `activeCategory` cambia
  filteredProducts = computed(() => {
    const category = this.activeCategory();
    if (category === 'todos') {
      return this.products;
    }
    return this.products.filter(product => product.category === category);
  });

  // Función para actualizar la categoría desde el HTML
  setCategory(category: string) {
    this.activeCategory.set(category);
  }

  // Simulación de Añadir al carrito
  addToCart(product: Product) {
    console.log(`Añadido al carrito: ${product.name} - $${product.price}`);
    alert(`Has añadido ${product.name} a tu carrito de compras.`);
    // Aquí conectarías con tu servicio de Carrito/Estado (ej. NgRx o un Service con Signals)
  }
}
