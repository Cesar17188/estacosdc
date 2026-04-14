import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

interface FeaturedSpirit {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
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

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1000&auto=format&fit=crop';
  }
}
