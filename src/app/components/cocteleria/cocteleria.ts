import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface CocktailPost {
  id: string;
  title: string;
  base_spirit: string;
  excerpt: string;
  image_url: string;
  read_time: string;
  ingredients?: string[];
  instructions?: string[];
}

@Component({
  selector: 'app-cocteleria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocteleria.html',
  styleUrl: './cocteleria.scss',
})
export class Cocteleria implements OnInit {
  supabaseService = inject(SupabaseService);

  // Estados reactivos
  cocktails = signal<CocktailPost[]>([]);
  isLoading = signal<boolean>(true);
  selectedCocktail = signal<CocktailPost | null>(null);
  activeFilter = signal<string>('todos');

  categories = computed(() => {
    const uniqueSpirits = new Set(this.cocktails().map(c => c.base_spirit));
    return ['todos', ...Array.from(uniqueSpirits)];
  });

  filteredCocktails = computed(() => {
    const filter = this.activeFilter();
    const allCocktails = this.cocktails();

    if (filter === 'todos') {
      return allCocktails;
    }

    return allCocktails.filter(c => c.base_spirit === filter);
  });

  async ngOnInit() {
    try {
      this.isLoading.set(true);
      const dbCocktails = await this.supabaseService.getCocktails();
      this.cocktails.set(dbCocktails || []);
    } catch (error) {
      console.error('Error cargando las recetas de coctelería:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  setFilter(category: string) {
    this.activeFilter.set(category);
  }

  openRecipe(post: CocktailPost) {
    this.selectedCocktail.set(post);
    setTimeout(() => {
      const section = document.getElementById('cocteleria-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  closeRecipe() {
    this.selectedCocktail.set(null);
    setTimeout(() => {
      const section = document.getElementById('cocteleria-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  /**
   * Genera tripletas semánticas (Sujeto - Predicado - Objeto) para AEO de cada cóctel
   */
  getSemanticTriplets(post: CocktailPost): SemanticTriplet[] {
    const title = post.title || 'Cóctel de Autor';
    const spirit = post.base_spirit || 'Destilado Artesanal';
    const time = post.read_time || '5 min';
    const ingCount = post.ingredients ? post.ingredients.length : 4;

    return [
      { subject: `El cóctel ${title}`, predicate: 'utiliza como base espirituosa', object: `${spirit} de Estancos Distilling Co.` },
      { subject: `El cóctel ${title}`, predicate: 'requiere un tiempo de preparación de', object: `${time}.` },
      { subject: `La mezcla de ${title}`, predicate: 'combina', object: `${ingCount} ingredientes seleccionados para equilibrio y perfil aromático.` }
    ];
  }

  /**
   * Retorna una descripción semántica unificada para los metadatos schema.org AEO
   */
  getFormattedSemanticDescription(post: CocktailPost): string {
    const triplets = this.getSemanticTriplets(post);
    const tripletsText = triplets.map(t => `${t.subject} ${t.predicate} ${t.object}`).join(' ');
    return `${post.excerpt || ''} ${tripletsText}`.trim();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop';
  }
}
