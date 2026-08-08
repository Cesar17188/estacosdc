import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface GalleryImage {
  id?: string;
  url: string;
  alt: string;
  title: string;
  sizeClass: string;
  thumbUrl?: string;
}

@Component({
  selector: 'app-galeria',
  standalone: true,
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
      
      // Construimos miniaturas optimizadas para el grid de la galería
      const processedImages: GalleryImage[] = (dbImages || []).map((img: any) => ({
        ...img,
        thumbUrl: this.getOptimizedImageUrl(img.url, 600, 75)
      }));

      this.images.set(processedImages);
    } catch (error) {
      console.error('Error cargando la galería:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Transforma URLs de Supabase Storage para solicitar versiones comprimidas y reducidas
   */
  getOptimizedImageUrl(url: string, width = 600, quality = 75): string {
    if (!url) return '';
    if (url.includes('/storage/v1/object/public/')) {
      const renderUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      return `${renderUrl}?width=${width}&quality=${quality}`;
    }
    return url;
  }

  // Funciones del Lightbox
  openLightbox(img: GalleryImage) {
    this.selectedImage.set(img);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const overlay = document.querySelector('.lightbox-overlay');
      if (overlay) {
        overlay.scrollTop = 0;
      }
    }, 0);
  }

  closeLightbox(event: Event) {
    event.stopPropagation();
    this.selectedImage.set(null);
    document.body.style.overflow = 'auto';
  }

  /**
   * Genera tripletas semánticas (Sujeto - Predicado - Objeto) para AEO de cada fotografía
   */
  getSemanticTriplets(img: GalleryImage): SemanticTriplet[] {
    const title = img.title || 'Momento Histórico Estancos';
    return [
      { subject: `La fotografía "${title}"`, predicate: 'registra el patrimonio de', object: 'Estancos Distilling Co. en los Andes ecuatorianos.' },
      { subject: `La imagen "${title}"`, predicate: 'documenta el arte de', object: 'destilación artesanal y crianza a 2500 msnm.' }
    ];
  }

  /**
   * Retorna una descripción semántica unificada para los metadatos schema.org AEO
   */
  getFormattedSemanticDescription(img: GalleryImage): string {
    const triplets = this.getSemanticTriplets(img);
    const tripletsText = triplets.map(t => `${t.subject} ${t.predicate} ${t.object}`).join(' ');
    return `${img.alt || img.title || ''} ${tripletsText}`.trim();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    // Si falla la imagen renderizada/transformada, intenta con la URL directa o fallback
    if (target.src.includes('/render/image/public/')) {
      const originalUrl = target.src.split('?')[0].replace('/render/image/public/', '/object/public/');
      target.src = originalUrl;
      return;
    }
    target.src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop';
  }
}
