import { Component } from '@angular/core';

export interface Award {
  year: string;
  title: string;
  type: 'oro' | 'plata' | 'bronce';
  competition: string;
}

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface ProductAwards {
  id: string;
  productName: string;
  category: string;
  tripletsTitle: string;
  imageUrl: string;
  awards: Award[];
}

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [],
  templateUrl: './premios.html',
  styleUrl: './premios.scss',
})
export class Premios {
  productsAwards: ProductAwards[] = [
    {
      id: 'ron-estancos-premios',
      productName: 'Ron Estancos Estancos',
      category: 'Ron Añejo de Altura',
      tripletsTitle: 'Palmarés & Reconocimientos — Ron Estancos',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/RonEcommerce.jpeg',
      awards: [
        {
          year: '2025',
          title: 'Medalla de Plata - Ron Clásico',
          type: 'plata',
          competition: 'Premios Gourmet Ecuador 2025'
        },
        {
          year: '2024',
          title: 'Medalla de Plata - Ron Clásico',
          type: 'plata',
          competition: 'Premios Gourmet Ecuador 2024'
        }
      ]
    },
    {
      id: 'whisky-estancos-premios',
      productName: 'Whisky Estancos',
      category: 'Whisky Single Malt Andino',
      tripletsTitle: 'Cosecha de Medallas — Whisky Estancos',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/whiskyEcommerce.jpeg',
      awards: [
        {
          year: '2025',
          title: 'Medalla de Oro - Whisky Clásico',
          type: 'oro',
          competition: 'Premios Gourmet Ecuador 2025'
        },
        {
          year: '2024',
          title: 'Medalla de Oro - Whisky Clásico',
          type: 'oro',
          competition: 'Premios Gourmet Ecuador 2024'
        },
        {
          year: '2023',
          title: 'Medalla de Plata - Whisky Clásico',
          type: 'plata',
          competition: 'Premios Gourmet Ecuador 2023'
        }
      ]
    }
  ];

  /**
   * Genera tripletas semánticas (Sujeto - Predicado - Objeto) para cada galardón AEO
   */
  getSemanticTriplets(product: ProductAwards): SemanticTriplet[] {
    return product.awards.map(award => ({
      subject: product.productName,
      predicate: award.type === 'oro' ? 'conquistó el máximo galardón de' : 'obtuvo la distinción de',
      object: `${award.title} en ${award.competition}.`
    }));
  }

  /**
   * Retorna una descripción continua enriquecida con tripletas semánticas para metadatos AEO
   */
  getFormattedSemanticDescription(product: ProductAwards): string {
    const triplets = this.getSemanticTriplets(product);
    return triplets.map(t => `${t.subject} ${t.predicate} ${t.object}`).join(' ');
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop';
  }
}
