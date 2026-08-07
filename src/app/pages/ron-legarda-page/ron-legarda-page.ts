import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { SupabaseService } from '../../services/supabase';

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface TastingNotes {
  nose: string;
  palate: string;
  finish: string;
}

export interface SpiritProduct {
  id: string;
  name: string;
  category: 'ron' | 'whisky' | 'accesorios' | 'experiencia';
  type: string;
  abv: string;
  age: string;
  price: number;
  discount_price?: number | null;
  description: string;
  long_description: string;
  tasting_notes: TastingNotes;
  image_url: string;
  stock_quantity?: number;
}

@Component({
  selector: 'app-ron-legarda-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './ron-legarda-page.html',
  styleUrl: './ron-legarda-page.scss',
})
export class RonLegardaPage implements OnInit {
  cartService = inject(CartService);
  supabaseService = inject(SupabaseService);

  product = signal<SpiritProduct | null>(null);
  isLoading = signal<boolean>(true);
  toastMessage = signal<string | null>(null);
  quantity = signal<number>(1);
  activeTab = signal<'notas' | 'proceso' | 'maridaje'>('notas');

  // Datos base enriquecidos para Ron Estancos Legarda
  defaultRonLegarda: SpiritProduct = {
    id: 'ron-legarda-01',
    name: 'Ron Estancos Legarda',
    category: 'ron',
    type: 'Ron Añejo Extra Superior',
    abv: '40% Vol.',
    age: '8 Años en Barrica',
    price: 45.00,
    description: 'Nacido en las alturas andinas a 2500 msnm, añejado pacientemente en barricas de roble americano ex-bourbon.',
    long_description: 'Ron Estancos Legarda es la máxima expresión de la destilación artesanal andina. Elaborado exclusivamente a partir de jugo fresco y mieles vírgenes de caña cosechada a mano, este ron es añejado pacientemente a 2500 metros sobre el nivel del mar. La menor presión atmosférica y el clima único de la cordillera propician un intercambio sutil y armónico entre el destilado y el roble americano ex-bourbon, dando origen a una riqueza aromática y sedosidad inigualables.',
    tasting_notes: {
      nose: 'Notas envolventes de melaza dorada, roble tostado, manzana andina, cáscara de naranja confitada y suaves destellos de moscabado.',
      palate: 'Entrada sedosa y untuosa. Despliega capas de toffee dulce, cacao fino de aroma ecuatoriano, nuez moscada y vainilla de Madagascar.',
      finish: 'Final prolongado, estructurado y especiado con recuerdos a madera noble, miel de abeja virgen y un toque sutil de caramelo ahumado.'
    },
    image_url: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974515924-kfh4xh0x93.jpeg'
  };

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading.set(true);
      
      // Consumo directo del servicio de Supabase para obtener la información de Ron Estancos Legarda
      const dbLegarda = await this.supabaseService.getRonLegarda();

      if (dbLegarda) {
        this.product.set({
          ...this.defaultRonLegarda,
          ...dbLegarda,
          tasting_notes: dbLegarda.tasting_notes || this.defaultRonLegarda.tasting_notes
        });
      } else {
        // Carga secundaria como respaldo desde la lista general de espíritus
        const spirits = await this.supabaseService.getSpirits();
        const fallbackLegarda = spirits?.find((s: any) =>
          s.name?.toLowerCase().includes('legarda') || s.slug === 'ron-estancos-legarda'
        );

        if (fallbackLegarda) {
          this.product.set({
            ...this.defaultRonLegarda,
            ...fallbackLegarda,
            tasting_notes: fallbackLegarda.tasting_notes || this.defaultRonLegarda.tasting_notes
          });
        } else {
          this.product.set(this.defaultRonLegarda);
        }
      }
    } catch (err) {
      console.error('Error al cargar datos de Ron Legarda desde el servicio de Supabase:', err);
      this.product.set(this.defaultRonLegarda);
    } finally {
      this.isLoading.set(false);
    }
  }

  setTab(tab: 'notas' | 'proceso' | 'maridaje') {
    this.activeTab.set(tab);
  }

  incrementQuantity() {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity() {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  addToCart() {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const qty = this.quantity();
    for (let i = 0; i < qty; i++) {
      this.cartService.addToCart(currentProduct);
    }
    this.showToast(`Añadido al carrito: ${qty} x ${currentProduct.name}`);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3200);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1000&auto=format&fit=crop';
  }

  /**
   * Genera tripletas semánticas (Sujeto - Predicado - Objeto) para AEO y motores de respuesta IA
   */
  getSemanticTriplets(): SemanticTriplet[] {
    const p = this.product();
    const name = p?.name || 'Ron Estancos Legarda';
    const place = '2500 metros sobre el nivel del mar en los Andes ecuatorianos';
    const notes = p?.tasting_notes;
    const nose = notes?.nose ? notes.nose : 'melaza dorada, cacao fino ecuatoriano y roble tostado';

    return [
      {
        subject: name,
        predicate: 'es producido por',
        object: 'Estancos Distilling Co. a ' + place + '.'
      },
      {
        subject: name,
        predicate: 'es añejado en',
        object: 'barricas de roble americano de primer uso durante ' + (p?.age || '5 años') + '.'
      },
      {
        subject: name,
        predicate: 'es elaborado con',
        object: 'jugo fresco y mieles vírgenes de caña cosechada a mano.'
      },
      {
        subject: name,
        predicate: 'cuenta con un perfil sensorial de',
        object: nose
      }
    ];
  }

  /**
   * Retorna una descripción continua basada en tripletas semánticas para metadatos AEO
   */
  getFormattedSemanticDescription(): string {
    const p = this.product();
    const baseDesc = p?.description || p?.long_description || '';
    const tripletsText = this.getSemanticTriplets()
      .map(t => `${t.subject} ${t.predicate} ${t.object}`)
      .join(' ');
    
    return `${baseDesc} ${tripletsText}`.trim();
  }
}
