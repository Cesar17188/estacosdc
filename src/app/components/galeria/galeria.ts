import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  sizeClass: string; // Controla si la imagen es normal, ancha o alta en el grid
}


@Component({
  selector: 'app-galeria',
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss',
})
export class Galeria implements OnInit {
  supabaseService = inject(SupabaseService);

  // Estados reactivos
  images = signal<GalleryImage[]>([]);
  isLoading = signal<boolean>(true);
  selectedImage = signal<GalleryImage | null>(null);

  async ngOnInit() {
    try {
      this.isLoading.set(true);
      const dbImages = await this.supabaseService.getGalleryImages();
      console.log(dbImages);
      this.images.set(dbImages || []);
    } catch (error) {
      console.error('Error cargando la galería:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Funciones del Lightbox
  openLightbox(img: GalleryImage) {
    this.selectedImage.set(img);
    // Evita que la página haga scroll mientras el lightbox está abierto
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(event: Event) {
    event.stopPropagation();
    this.selectedImage.set(null);
    // Restaura el scroll de la página
    document.body.style.overflow = 'auto';
  }

}
