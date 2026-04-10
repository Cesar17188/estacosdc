import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

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
  tastingNotes: TastingNotes;
  imageUrl: string;
  reverseLayout?: boolean;
  badge?: string;
}

// === ESTADO GLOBAL SIMULADO PARA LA VISTA PREVIA ===
// En tu proyecto real, esto se maneja inyectando el CartService
const cartItems = signal<any[]>([]);
const isCartOpen = signal<boolean>(false);
const cartTotal = computed(() => cartItems().reduce((total, item) => total + (item.price * item.quantity), 0));
const cartCount = computed(() => cartItems().reduce((count, item) => count + item.quantity, 0));
const addToCart = (product: any) => {
  cartItems.update(items => {
    const existing = items.find(i => i.id === product.id);
    if (existing) return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    return [...items, { ...product, quantity: 1, category: product.category || 'espirituoso' }];
  });
  isCartOpen.set(true);
};
const updateQty = (id: string, delta: number) => cartItems.update(items => items.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
const remove = (id: string) => cartItems.update(items => items.filter(i => i.id !== id));

@Component({
  selector: 'app-spirits-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spirits-page.html',
  styleUrl: './spirits-page.scss',
})
export class SpiritsPage {
  cartService = inject(CartService);

  // Exponemos las signals al template
  cartItems = cartItems;
  isCartOpen = isCartOpen;
  cartTotal = cartTotal;
  cartCount = cartCount;

  // Acciones
  toggleCart() { isCartOpen.update(v => !v); }
  add(product: Product) { addToCart(product); }
  updateQty(id: string, delta: number) { updateQty(id, delta); }
  remove(id: string) { remove(id); }

  // Base de datos de nuestros destilados detallados
  products: Product[] = [
    {
      id: 'ron-estancos-anejo',
      name: 'Ron Añejo Estancos',
      category: 'ron',
      type: 'Ron Artesanal Premium',
      abv: '40% Vol.',
      age: 'Sistema Solera 8 Años',
      price: 45.00,
      description: 'Destilado del jugo virgen de caña cultivada en los valles ecuatoriales y madurado a 2500 msnm. La baja presión atmosférica acelera la interacción con las barricas de roble americano ex-bourbon, creando un ron de complejidad inusual, donde la altitud dicta las reglas.',
      tastingNotes: {
        nose: 'Aromas intensos a melaza tostada, vainilla andina, cacao y sutiles toques de frutos secos.',
        palate: 'Entrada sedosa y cálida. Notas de caramelo oscuro, roble especiado, y un toque de café tostado.',
        finish: 'Largo y persistente, dejando un recuerdo dulce y suave en el paladar.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1614316311652-3d712f602b9f?q=80&w=1000&auto=format&fit=crop',
      reverseLayout: false
    },
    {
      id: 'whiskey-chillos-valley',
      name: 'Whiskey Chillos Valley Grain',
      category: 'whisky',
      type: 'Whiskey Estilo Bourbon',
      abv: '50% Vol.',
      age: 'Small Batch',
      price: 55.00,
      description: 'Nuestra reinterpretación del clásico americano utilizando maíces endémicos del Valle de los Chillos. Envejecido en barricas de roble nuevo altamente carbonizadas. El drástico cambio de temperatura entre el día y la noche andina exprime al máximo los azúcares de la madera.',
      tastingNotes: {
        nose: 'Explosión de vainilla, maíz dulce tostado, caramelo quemado y cuero viejo.',
        palate: 'Robusto y potente. Dulzor intenso que se equilibra con notas de pimienta negra, canela y roble oscuro.',
        finish: 'Cálido y envolvente, con un final persistente de especias de madera y toffee.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1000&auto=format&fit=crop',
      reverseLayout: true
    },
    {
      id: 'whisky-coleccionista',
      name: 'Whisky Chillos Coleccionista',
      category: 'whisky',
      type: 'Whiskey Estilo Bourbon',
      abv: '60% Vol.',
      age: 'Cask Strength',
      price: 85.00,
      description: 'Una edición de colección embotellada directamente de la barrica sin diluir (Cask Strength). Esta versión robusta a 60% Vol. ofrece la experiencia más pura del Chillos Valley Grain, intensificando magistralmente las notas de la madera carbonizada y la calidez del maíz andino.',
      tastingNotes: {
        nose: 'Potente y profunda. Aromas concentrados a caramelo oscuro, roble tostado intenso, cuero y tabaco dulce.',
        palate: 'Intenso, cálido y oleoso. Una explosión de vainilla rica, especias marcadas, pimienta negra y un dulzor meloso que recubre el paladar.',
        finish: 'Extremadamente largo y reconfortante, con notas persistentes de madera dulce y especias cálidas.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1601614945413-5b839215096a?q=80&w=1000&auto=format&fit=crop',
      reverseLayout: false
    },
    {
      id: 'whisky-estancos-single-malt',
      name: 'Whisky Estancos Single Malt',
      category: 'whisky',
      type: 'Single Malt Andino',
      abv: '43% Vol.',
      age: '10 Años',
      price: 75.00,
      description: 'Elaborado exclusivamente con cebada malteada seleccionada y agua pura de los deshielos andinos. Este Single Malt madura lentamente a 2500 metros de altitud, donde la baja presión y el clima de montaña moldean un perfil excepcionalmente elegante y equilibrado.',
      tastingNotes: {
        nose: 'Delicadas notas florales, manzana verde horneada, miel de páramo y un suave toque de roble tostado.',
        palate: 'Elegante y sedoso. Sabores a vainilla, almendras tostadas, pera caramelizada y un sutil especiado.',
        finish: 'Medio-largo, limpio y refrescante con un eco persistente de roble dulce y malta.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04d84ee52a?q=80&w=1000&auto=format&fit=crop',
      reverseLayout: true
    }
  ];

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
      this.cartService.addToCart(product);
      console.log('Productos en carrito:', this.cartService.cartItems());
      alert(`Has añadido ${product.name} a tu carrito de compras.`);
      // Aquí conectarías con tu servicio de Carrito/Estado (ej. NgRx o un Service con Signals)
    }
}
