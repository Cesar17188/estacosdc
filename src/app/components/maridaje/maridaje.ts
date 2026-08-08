import { Component } from '@angular/core';

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface PairingItem {
  id: string;
  name: string;
  sensoryNote: string;
  description: string;
  imageUrl: string;
}

export interface PairingCategory {
  id: string;
  spiritName: string;
  spiritSubtitle: string;
  tripletsTitle: string;
  items: PairingItem[];
}

@Component({
  selector: 'app-maridaje',
  standalone: true,
  imports: [],
  templateUrl: './maridaje.html',
  styleUrl: './maridaje.scss',
})
export class Maridaje {
  pairings: PairingCategory[] = [
    {
      id: 'maridaje-ron',
      spiritName: 'Maridaje para Ron Estancos Legarda',
      spiritSubtitle: 'Notas de Melaza, Vainilla y Frutos Secos',
      tripletsTitle: 'Armonía Sensorial — Ron Legarda',
      items: [
        {
          id: 'chocolate-70',
          name: 'Chocolate Oscuro 70%',
          sensoryNote: 'Cacao & Vainilla',
          description: 'El alto porcentaje de cacao resalta las notas profundas de vainilla andina y madera tostada, creando una sinergia amarga y dulce inigualable.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/chocolate70Estancos.jpeg'
        },
        {
          id: 'queso-azul',
          name: 'Queso Azul Andino',
          sensoryNote: 'Contraste Salado & Dulzura',
          description: 'El carácter intenso y salado del queso azul corta la rica dulzura del ron, limpiando el paladar y preparando las papilas para el siguiente sorbo.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/quesoAzulRon.jpeg'
        },
        {
          id: 'habano-maduro',
          name: 'Habano Maduro',
          sensoryNote: 'Ahumado & Roble',
          description: 'Un puro de hoja madura acompaña excelentemente el final largo de nuestro ron, armonizando con los toques ahumados adquiridos en las barricas.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/galleryImages/Ron%20y%20Puro%20Cinemat.%20(4).jpeg'
        }
      ]
    },
    {
      id: 'maridaje-whisky',
      spiritName: 'Maridaje para Whisky Real Audiencia',
      spiritSubtitle: 'Notas de Roble Carbonizado, Especias y Malta',
      tripletsTitle: 'Armonía Sensorial — Whisky Real Audiencia',
      items: [
        {
          id: 'charcuteria-ahumada',
          name: 'Charcutería y Carnes Ahumadas',
          sensoryNote: 'Curado & Especias',
          description: 'El perfil robusto y especiado del whisky estilo bourbon se complementa a la perfección con la intensidad de las carnes frías ahumadas y jamones curados.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/carnesWhisky.jpeg'
        },
        {
          id: 'frutos-secos',
          name: 'Frutos Secos Tostados',
          sensoryNote: 'Cereales & Tueste',
          description: 'Almendras y nueces ligeramente tostadas actúan como un puente que suaviza el grado alcohólico, resaltando las notas de cereales de la malta andina.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/frutosSecosWhisky.jpeg'
        },
        {
          id: 'chocolate-sal',
          name: 'Chocolate con Sal',
          sensoryNote: 'Caramelo & Sal Marina',
          description: 'La textura crujiente y salada potencia las notas de caramelo quemado del whisky, desatando una explosión de sabores cálidos y envolventes.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/chocolateSalWhisky.jpeg'
        }
      ]
    }
  ];

  /**
   * Genera tripletas semánticas (Sujeto - Predicado - Objeto) para AEO de cada maridaje
   */
  getSemanticTriplets(category: PairingCategory, item: PairingItem): SemanticTriplet[] {
    const spirit = category.spiritName.replace('Maridaje para ', '');
    return [
      { subject: `El maridaje de ${spirit}`, predicate: 'se logra idealmente con', object: `${item.name}.` },
      { subject: `La combinación con ${item.name}`, predicate: 'desarrolla una armonía de', object: `${item.sensoryNote} en el paladar.` }
    ];
  }

  /**
   * Retorna una descripción continua enriquecida con tripletas semánticas para metadatos AEO
   */
  getFormattedSemanticDescription(category: PairingCategory, item: PairingItem): string {
    const triplets = this.getSemanticTriplets(category, item);
    const tripletsText = triplets.map(t => `${t.subject} ${t.predicate} ${t.object}`).join(' ');
    return `${item.description} ${tripletsText}`.trim();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop';
  }
}
