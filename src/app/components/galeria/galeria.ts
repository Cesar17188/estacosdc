import { Component } from '@angular/core';

interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  sizeClass: string; // Controla si la imagen es normal, ancha o alta en el grid
}


@Component({
  selector: 'app-galeria',
  imports: [],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss',
})
export class Galeria {
  // Arreglo de 8 imágenes con clases de tamaño para crear un Masonry Grid asimétrico
  images: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
      alt: 'Coctel sirviéndose en vaso',
      title: 'El Arte de la Mezcla',
      sizeClass: 'tall' // Ocupa 2 filas hacia abajo
    },
    {
      url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop',
      alt: 'Barricas de roble en bodega',
      title: 'Reposo en las Alturas',
      sizeClass: 'wide' // Ocupa 2 columnas a lo ancho
    },
    {
      url: 'https://images.unsplash.com/photo-1582885461973-c60f25603816?q=80&w=800&auto=format&fit=crop',
      alt: 'Alambique de cobre brillando',
      title: 'Corazón de Cobre',
      sizeClass: 'normal' // Tamaño estándar
    },
    {
      url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=800&auto=format&fit=crop',
      alt: 'Vaso de whisky con hielo oscuro',
      title: 'Oro Líquido',
      sizeClass: 'normal'
    },
    {
      url: 'https://images.unsplash.com/photo-1470337458703-415120a41f67?q=80&w=1000&auto=format&fit=crop',
      alt: 'Ambiente de bar premium oscuro',
      title: 'La Experiencia',
      sizeClass: 'large' // Ocupa 2 filas y 2 columnas (la foto protagonista)
    },
    {
      url: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=800&auto=format&fit=crop',
      alt: 'Bartender preparando un trago',
      title: 'Pasión y Precisión',
      sizeClass: 'tall'
    },
    {
      url: 'https://images.unsplash.com/photo-1614316311652-3d712f602b9f?q=80&w=800&auto=format&fit=crop',
      alt: 'Botella de Ron en ambiente de madera',
      title: 'Herencia Cañera',
      sizeClass: 'normal'
    },
    {
      url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop',
      alt: 'Detalles de coctelería con cítricos',
      title: 'Notas Cítricas',
      sizeClass: 'wide'
    }
  ];
}
