import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { RouterLink } from "@angular/router";

export interface FeaturedSpirit {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  short_description?: string;
  image_url: string;
  abv?: string;
  age?: string;
}

@Component({
  selector: 'app-spirits',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './spirits.html',
  styleUrl: './spirits.scss',
})
export class Spirits implements OnInit {
  // === INYECCIÓN DE SERVICIOS ===
  supabaseService = inject(SupabaseService);
  platformId = inject(PLATFORM_ID);

  // Fallback / Datos por defecto precargados para renders INSTANTÁNEOS (0ms de espera)
  defaultSpirits: FeaturedSpirit[] = [
    {
      id: 'ron-legarda',
      name: 'Ron Estancos Legarda',
      category: 'Ron Añejo de Altura',
      price: 45.00,
      abv: '40% Vol.',
      age: '8 Años Roble Ex-Bourbon',
      description: 'Añejado pacientemente a 2500 msnm en barricas de roble americano ex-bourbon. Notas complejas de miel, vainilla y roble ahumado.',
      short_description: 'Ron premium madurado a 2500 msnm en barricas de roble ex-bourbon. Sabor cálido, profundo y aromático.',
      image_url: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974515924-kfh4xh0x93.jpeg'
    },
    {
      id: 'whisky-real-audiencia',
      name: 'Whisky Real Audiencia',
      category: 'Single Malt Andino',
      price: 65.00,
      abv: '40% Vol.',
      age: 'Single Malt Seleccionado',
      description: 'El primer whisky single malt destilado en los Andes ecuatorianos a 2500 msnm. Perfil noble, aromático y especiado.',
      short_description: 'Single Malt andino de pura malta destilado a gran altura. Gran cuerpo, notas ahumadas suaves y roble tostado.',
      image_url: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974549778-45u18oado8b.jpeg'
    },
    {
      id: 'whiskey-chillos-valley',
      name: 'Whiskey Chillos Valley Grain',
      category: 'Whiskey de Granos Andinos',
      price: 50.00,
      abv: '50% Vol.',
      age: 'Crianza en Roble Tostado',
      description: 'Destilado artesanal elaborado a partir de granos andinos seleccionados del valle de Los Chillos. Suave, maltoso y fluido.',
      short_description: 'Whiskey de granos andinos de altitud. Dulzura maltosa, mantequilla de almendras y fondo cálido especiado.',
      image_url: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974601243-c91k221iz0g.jpeg'
    }
  ];

  // === ESTADO REACTIVO INICIALIZADO DE FORMA INSTANTÁNEA ===
  spirits = signal<FeaturedSpirit[]>(this.defaultSpirits);
  isLoading = signal<boolean>(false);

  // Ciclo de vida: Render inmediato + Sincronización asíncrona no bloqueante
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshFromDatabase();
    }
  }

  /**
   * Sincroniza datos con la base de datos de Supabase en segundo plano sin pausar el render de UI
   */
  private async refreshFromDatabase(): Promise<void> {
    try {
      const dbSpirits = await this.supabaseService.getFeaturedSpirits();
      if (dbSpirits && dbSpirits.length > 0) {
        const formattedSpirits = dbSpirits.map((spirit: FeaturedSpirit) => ({
          ...spirit,
          image_url: this.getSpiritImage(spirit),
          abv: this.getSpiritAbv(spirit),
          age: this.getSpiritAge(spirit)
        }));
        this.spirits.set(formattedSpirits);
      }
    } catch (error) {
      console.warn('Manteniendo vitrinas precargadas por rendimiento:', error);
    }
  }

  getSpiritAbv(spirit: FeaturedSpirit): string {
    if (spirit.abv) return spirit.abv;
    return '40% Vol.';
  }

  getSpiritAge(spirit: FeaturedSpirit): string {
    if (spirit.age) return spirit.age;
    const nameLower = (spirit.name || '').toLowerCase();
    if (nameLower.includes('legarda')) return '8 Años Roble';
    if (nameLower.includes('audiencia')) return 'Single Malt';
    if (nameLower.includes('chillos')) return 'Granos Andinos';
    return 'Crianza en Roble';
  }

  getSpiritImage(spirit: FeaturedSpirit): string {
    const img = spirit?.image_url;
    if (img && img.trim().length > 0 && !img.includes('unsplash.com')) {
      return img.trim();
    }
    const nameLower = (spirit?.name || '').toLowerCase();
    if (nameLower.includes('legarda')) {
      return 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974515924-kfh4xh0x93.jpeg';
    }
    if (nameLower.includes('audiencia') || nameLower.includes('real')) {
      return 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974549778-45u18oado8b.jpeg';
    }
    if (nameLower.includes('chillos') || nameLower.includes('valley')) {
      return 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974601243-c91k221iz0g.jpeg';
    }
    return img || 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1785974515924-kfh4xh0x93.jpeg';
  }

  /**
   * Obtiene la descripción corta enriquecida con tripletas semánticas para AEO
   */
  getShortDescription(spirit: FeaturedSpirit): string {
    if (!spirit) return '';
    if (spirit.short_description && spirit.short_description.trim().length > 0) {
      return spirit.short_description.trim();
    }
    const clean = spirit.description ? spirit.description.trim() : '';
    if (clean.length > 0 && clean.length <= 130) {
      return clean;
    }
    const name = spirit.name || 'Destilado Artesanal';
    const baseSemanticSubject = `${name} es producido artesanalmente a 2500 msnm en los Andes ecuatorianos.`;
    if (!clean) return baseSemanticSubject;

    const truncated = clean.substring(0, 85);
    const lastSpace = truncated.lastIndexOf(' ');
    const shortDesc = lastSpace > 40 ? truncated.substring(0, lastSpace) : truncated;
    return `${baseSemanticSubject} ${shortDesc}...`;
  }

  /**
   * Determina la ruta específica basada en el nombre del licor
   */
  getSpiritRoute(spiritName: string): string {
    if (!spiritName) return '/espiritus';
    const nameLower = spiritName.toLowerCase();
    
    if (nameLower.includes('legarda')) {
      return '/espiritus/ron-legarda';
    }
    if (nameLower.includes('chillos') || nameLower.includes('valley')) {
      return '/espiritus/whiskey-chillos-valley';
    }
    if (nameLower.includes('audiencia') || nameLower.includes('real')) {
      return '/espiritus/whisky-real-audiencia';
    }
    return '/espiritus';
  }

  onImageError(event: Event, spiritName?: string) {
    const target = event.target as HTMLImageElement;
    if (target.getAttribute('data-failed')) {
      return;
    }
    target.setAttribute('data-failed', 'true');
    target.onerror = null;

    const nameLower = (spiritName || '').toLowerCase();
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



