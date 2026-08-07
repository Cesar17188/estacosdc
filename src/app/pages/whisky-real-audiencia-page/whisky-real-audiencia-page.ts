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
  selector: 'app-whisky-real-audiencia-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './whisky-real-audiencia-page.html',
  styleUrl: './whisky-real-audiencia-page.scss',
})
export class WhiskyRealAudienciaPage implements OnInit {
  cartService = inject(CartService);
  supabaseService = inject(SupabaseService);

  product = signal<SpiritProduct | null>(null);
  isLoading = signal<boolean>(true);
  toastMessage = signal<string | null>(null);
  quantity = signal<number>(1);
  activeTab = signal<'notas' | 'proceso' | 'maridaje'>('notas');

  // Datos base enriquecidos para Whisky Real Audiencia
  defaultWhiskyRealAudiencia: SpiritProduct = {
    id: 'whisky-real-audiencia-01',
    name: 'Whisky Real Audiencia',
    category: 'whisky',
    type: 'Whisky Andino Single Malt',
    abv: '43% Vol.',
    age: 'Selección de Barricas de Altura',
    price: 55.00,
    description: 'El primer Single Malt de los Andes ecuatorianos. Destilado en alambique de cobre a 2500 msnm con cebada malteada y agua pura de vertiente.',
    long_description: 'Whisky Real Audiencia rinde homenaje a la nobleza histórica de los Andes. Elaborado 100% con cebada malteada cuidadosamente seleccionada y macerada con agua de vertiente andina nacida en los glaciares. Su proceso de destilación lenta en alambiques de cobre y su maduración a 2500 msnm producen un perfil aromático único, donde la turba suave se funde con matices de miel silvestre, manzana horneada y roble tostado.',
    tasting_notes: {
      nose: 'Notas elegantes a miel de páramo, manzana verde asada, malta tostada, un suave toque de humo de turba y vainilla en rama.',
      palate: 'Cuerpo untuoso y frutal. Se aprecian sabores a frutas verdes asadas, caramelo de maple, manzanas verdes andinas y roble tostado.',
      finish: 'Final largo, equilibrado y persistente con recuerdos de caramelo artesanal, turba fina y madera noble tostada.'
    },
    image_url: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974549778-45u18oado8b.jpeg'
  };

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading.set(true);
      
      // Consumo directo del servicio de Supabase para obtener la información de Whisky Real Audiencia
      const dbWhisky = await this.supabaseService.getWhiskyRealAudiencia();

      if (dbWhisky) {
        this.product.set({
          ...this.defaultWhiskyRealAudiencia,
          ...dbWhisky,
          tasting_notes: dbWhisky.tasting_notes || this.defaultWhiskyRealAudiencia.tasting_notes
        });
      } else {
        // Carga secundaria como respaldo desde la lista general de espíritus
        const spirits = await this.supabaseService.getSpirits();
        const fallbackWhisky = spirits?.find((s: any) =>
          s.name?.toLowerCase().includes('audiencia') || s.slug === 'whisky-real-audiencia'
        );

        if (fallbackWhisky) {
          this.product.set({
            ...this.defaultWhiskyRealAudiencia,
            ...fallbackWhisky,
            tasting_notes: fallbackWhisky.tasting_notes || this.defaultWhiskyRealAudiencia.tasting_notes
          });
        } else {
          this.product.set(this.defaultWhiskyRealAudiencia);
        }
      }
    } catch (err) {
      console.error('Error al cargar datos de Whisky Real Audiencia desde Supabase:', err);
      this.product.set(this.defaultWhiskyRealAudiencia);
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
    const name = p?.name || 'Whisky Real Audiencia';
    const place = '2500 metros sobre el nivel del mar en los Andes ecuatorianos';
    const notes = p?.tasting_notes;
    const nose = notes?.nose ? notes.nose : 'miel de páramo, manzana verde asada, malta tostada y turba fina';

    return [
      {
        subject: name,
        predicate: 'es producido por',
        object: 'Estancos Distilling Co. a ' + place + '.'
      },
      {
        subject: name,
        predicate: 'es categorizado como',
        object: 'uno de los Mejores Whisky Andino Single Malt elaborado 100% con cebada malteada.'
      },
      {
        subject: name,
        predicate: 'es destilado en',
        object: 'alambiques tradicionales de cobre utilizando agua pura de vertiente andina.'
      },
      {
        subject: name,
        predicate: 'ofrece notas sensoriales de',
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
