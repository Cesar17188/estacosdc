import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

// Interfaz actualizada con los nuevos campos de contenido
interface CocktailPost {
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
  imports: [CommonModule],
  templateUrl: './cocteleria.html',
  styleUrl: './cocteleria.scss',
})
export class Cocteleria implements OnInit {
  supabaseService = inject(SupabaseService);

  // Estados reactivos
  cocktails = signal<CocktailPost[]>([]);
  isLoading = signal<boolean>(true);

  // NUEVO ESTADO: Rastrea qué cóctel está seleccionado actualmente
  selectedCocktail = signal<CocktailPost | null>(null);

  // NUEVOS ESTADOS PARA EL FILTRADO
  activeFilter = signal<string>('todos');

  // Extraemos las categorías únicas (licores base) dinámicamente de los datos
  categories = computed(() => {
    const uniqueSpirits = new Set(this.cocktails().map(c => c.base_spirit));
    return ['todos', ...Array.from(uniqueSpirits)];
  });

   // Filtramos la cuadrícula de cócteles basándonos en el filtro activo
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

  // ACCIONES DE LA UI
  setFilter(category: string) {
    this.activeFilter.set(category);
  }

  // ACCIONES DE LA UI
  openRecipe(post: CocktailPost) {
    this.selectedCocktail.set(post);
    // Hacemos scroll suave específicamente hacia la sección del componente
    // Utilizamos setTimeout para asegurar que la vista del detalle ya fue renderizada en el DOM
    setTimeout(() => {
      const section = document.getElementById('cocteleria-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  closeRecipe() {
    this.selectedCocktail.set(null);
    // Opcional: También podemos hacer scroll al volver a la cuadrícula
    setTimeout(() => {
      const section = document.getElementById('cocteleria-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  // Fallback por si la imagen de la base de datos se rompe
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop';
  }
}
