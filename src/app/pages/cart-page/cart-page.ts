import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

// === ESTADO GLOBAL SIMULADO PARA LA VISTA PREVIA ===
// En tu app real, inyectarás CartService aquí y leerás sus signals
const initialCart = [
  {
    id: 'ron-estancos-anejo',
    name: 'Ron Añejo Estancos',
    category: 'ron',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1614316311652-3d712f602b9f?q=80&w=400&auto=format&fit=crop',
    quantity: 2
  },
  {
    id: 'whisky-estancos-single-malt',
    name: 'Whisky Estancos Single Malt',
    category: 'whisky',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04d84ee52a?q=80&w=400&auto=format&fit=crop',
    quantity: 1
  }
];

const cartItems = signal<any[]>(initialCart);
const cartTotal = computed(() => cartItems().reduce((total, item) => total + (item.price * item.quantity), 0));
const cartCount = computed(() => cartItems().reduce((count, item) => count + item.quantity, 0));


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  cartService = inject(CartService);
  cartItems = cartItems;
  cartTotal = cartTotal;
  cartCount = cartCount;
}
