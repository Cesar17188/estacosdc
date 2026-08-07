import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

export interface FeaturedSpirit {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  short_description?: string;
  image_url: string;
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

  // === ESTADO REACTIVO ===
  spirits = signal<FeaturedSpirit[]>([]);
  isLoading = signal<boolean>(true);

  // Ciclo de vida
  async ngOnInit(): Promise<void> {
    try {
      this.isLoading.set(true);
      const dbSpirits = await this.supabaseService.getFeaturedSpirits();
      this.spirits.set(dbSpirits || []);
    } catch (error) {
      console.error('Error cargando el resumen de espíritus:', error);
    } finally {
      this.isLoading.set(false);
    }
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

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1000&auto=format&fit=crop';
  }
}
