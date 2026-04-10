import { Injectable, signal, computed } from '@angular/core';

// === INTERFACES ===
// Exportamos las interfaces para poder usarlas en toda la app
export interface Product {
  id: string;
  name: string;
  category: 'ron' | 'whisky' | 'accesorios';
  price: number;
  imageUrl: string;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root' // Singleton: Una única instancia de datos para toda la aplicación
})
export class CartService {

  // === ESTADO REACTIVO PRINCIPAL (Signals) ===
  // Inicializamos el carrito vacío
  cartItems = signal<CartItem[]>([]);

  // === ESTADO DERIVADO (Computed Signals) ===
  // Calcula el total a pagar automáticamente cada vez que cartItems cambia
  cartTotal = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Calcula la cantidad total de artículos (ideal para el numerito rojo del Header)
  cartCount = computed(() => {
    return this.cartItems().reduce((count, item) => count + item.quantity, 0);
  });

  // === MÉTODOS ===

  // Añadir un producto al carrito
  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);

      // Si el producto ya está en el carrito, solo sumamos 1 a la cantidad
      if (existingItem) {
        return items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // Si no está, lo agregamos como un elemento nuevo con cantidad 1
      return [...items, { ...product, quantity: 1 }];
    });
  }

  // Actualizar cantidad (+ o -) desde la página del carrito
  updateQuantity(productId: string, delta: number) {
    this.cartItems.update(items => {
      return items.map(item => {
        if (item.id === productId) {
          // Aseguramos que la cantidad nunca sea menor a 1
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  }

  // Eliminar producto completamente del carrito
  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  // Vaciar el carrito (útil para después de que el usuario finaliza su compra)
  clearCart() {
    this.cartItems.set([]);
  }
}
