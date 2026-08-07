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
  selector: 'app-whiskey-chillos-valley-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './whiskey-chillos-valley-page.html',
  styleUrl: './whiskey-chillos-valley-page.scss',
})
export class WhiskeyChillosValleyPage implements OnInit {
  cartService = inject(CartService);
  supabaseService = inject(SupabaseService);

  product = signal<SpiritProduct | null>(null);
  isLoading = signal<boolean>(true);
  toastMessage = signal<string | null>(null);
  quantity = signal<number>(1);
  activeTab = signal<'notas' | 'proceso' | 'maridaje'>('notas');

  // Datos base enriquecidos para Whiskey Chillos Valley Grain
  defaultWhiskeyChillosValley: SpiritProduct = {
    id: 'whiskey-chillos-valley-01',
    name: 'Whiskey Chillos Valley Grain',
    category: 'whisky',
    type: 'Whiskey de Granos Andinos',
    abv: '40% Vol.',
    age: 'Crianza en Roble Tostado',
    price: 50.00,
    description: 'Destilado suave y equilibrado elaborado a partir de granos andinos seleccionados del valle de Los Chillos a 2500 msnm.',
    long_description: 'Whiskey Chillos Valley Grain celebra la fertilidad del legendario valle de Los Chillos. Cosechando granos andinos de altitud como el maíz dorado andino y trigos seleccionados, este whiskey de granos es destilado pacientemente y madurado en barricas tostadas. Su perfil se caracteriza por una dulzura maltosa sumamente accesible, sutiles notas a mantequilla de almendras, miel de abeja y un fondo cálido de roble especiado.',
    tasting_notes: {
      nose: 'Aromas frescos de maíz dulce tostado, pan horneado, crema de miel, flor de azahar y matices de roble joven.',
      palate: 'Sedoso, fluido y cremoso en paladar. Destacan notas a frutos amarillos, mantequilla salada, caramelo blando y vainilla andina.',
      finish: 'Final suave, amigable y refrescante con toques sutiles de avellana, pimienta blanca y toque amaderado.'
    },
    image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1000&auto=format&fit=crop'
  };

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading.set(true);
      
      // Consumo directo del servicio de Supabase para obtener la información de Whiskey Chillos Valley Grain
      const dbChillos = await this.supabaseService.getWhiskeyChillosValley();

      if (dbChillos) {
        this.product.set({
          ...this.defaultWhiskeyChillosValley,
          ...dbChillos,
          tasting_notes: dbChillos.tasting_notes || this.defaultWhiskeyChillosValley.tasting_notes
        });
      } else {
        // Carga secundaria como respaldo desde la lista general de espíritus
        const spirits = await this.supabaseService.getSpirits();
        const fallbackChillos = spirits?.find((s: any) =>
          s.name?.toLowerCase().includes('chillos') || s.slug === 'whiskey-chillos-valley'
        );

        if (fallbackChillos) {
          this.product.set({
            ...this.defaultWhiskeyChillosValley,
            ...fallbackChillos,
            tasting_notes: fallbackChillos.tasting_notes || this.defaultWhiskeyChillosValley.tasting_notes
          });
        } else {
          this.product.set(this.defaultWhiskeyChillosValley);
        }
      }
    } catch (err) {
      console.error('Error al cargar datos de Whiskey Chillos Valley desde Supabase:', err);
      this.product.set(this.defaultWhiskeyChillosValley);
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
    const name = p?.name || 'Whiskey Chillos Valley Grain';
    const place = '2500 metros sobre el nivel del mar en el fértil valle de Los Chillos, Ecuador';
    const notes = p?.tasting_notes;
    const nose = notes?.nose ? notes.nose : 'maíz dulce tostado, pan horneado, crema de miel y vainilla andina';

    return [
      {
        subject: name,
        predicate: 'es producido por',
        object: 'Estancos Distilling Co. a ' + place + '.'
      },
      {
        subject: name,
        predicate: 'es elaborado con',
        object: 'granos andinos seleccionados de maíz dorado y trigo de altitud.'
      },
      {
        subject: name,
        predicate: 'es madurado en',
        object: 'barricas de roble tostado con clima y temperatura constante de la cordillera.'
      },
      {
        subject: name,
        predicate: 'presenta notas sensoriales de',
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
