import { Component } from '@angular/core';

interface TourExperience {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  includes: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-visitas-page',
  imports: [],
  templateUrl: './visitas-page.html',
  styleUrl: './visitas-page.scss',
})
export class VisitasPage {
  tours: TourExperience[] = [
    {
      id: 'tour-clasico',
      title: 'Recorrido Andino',
      duration: '1 hora',
      price: '$20',
      description: 'Nuestra visita introductoria. Conoce el corazón de Estancos recorriendo la sala de alambiques y las bodegas de añejamiento, culminando con una degustación guiada.',
      includes: [
        'Recorrido guiado por las instalaciones',
        'Cata de 2 destilados (Ron y Whiskey Clásico)',
        '10% de descuento en la tienda física'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1582885461973-c60f25603816?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'cata-maestro',
      title: 'Cata del Maestro Destilador',
      duration: '2 horas',
      price: '$30',
      description: 'Una inmersión profunda para verdaderos conocedores. Explora el proceso técnico detallado y degusta nuestros destilados de colección directamente extraídos de la barrica.',
      includes: [
        'Recorrido VIP por áreas restringidas',
        'Cata de 4 destilados (incluyendo Cask Strength)',
        'Degustación directa desde la barrica',
        'Copa Glencairn oficial de regalo'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'experiencia-rommelier',
      title: 'Experiencia Rommelier',
      duration: '3 horas',
      price: '$50',
      description: 'La experiencia definitiva de Estancos. Combina nuestro recorrido técnico con una masterclass de coctelería andina y una sesión completa de maridaje de autor.',
      includes: [
        'Recorrido guiado completo',
        'Masterclass de Mixología (prepara 2 cócteles)',
        'Sesión de maridaje con quesos y chocolates locales',
        'Botella miniatura de cortesía'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop'
    }
  ];
}
