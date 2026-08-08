import { Component } from '@angular/core';

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tripletsTitle: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

@Component({
  selector: 'app-procesos',
  standalone: true,
  imports: [],
  templateUrl: './procesos.html',
  styleUrl: './procesos.scss',
})
export class Procesos {
  processSteps: ProcessStep[] = [
    {
      id: 'fermentacion',
      number: '01',
      title: 'Fermentación Lenta',
      subtitle: 'Alquimia de la Materia Prima',
      tripletsTitle: 'Esencia & Origen Aromático',
      description: 'Todo gran destilado comienza con una fermentación excepcional. Seleccionamos levaduras específicas que trabajan de manera lenta y pausada a temperatura controlada. Este ritmo permite la creación de ésteres complejos, asegurando que los perfiles aromáticos primarios se desarrollen con una profundidad inigualable.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/fermentacion.jpeg',
      highlights: ['Levaduras Seleccionadas', 'Ritmo Lento y Pausado', 'Ésteres Frutales Complejos']
    },
    {
      id: 'destilacion',
      number: '02',
      title: 'Destilación en Cobre',
      subtitle: 'Pureza en Alambiques de Altura',
      tripletsTitle: 'Pureza & Alquimia en Cobre',
      description: 'Nuestra magia ocurre en alambiques tradicionales de cobre. Este metal noble reacciona con el vapor, purificando el espíritu y otorgándole una textura sedosa. Durante este paso, realizamos cortes extremadamente precisos para capturar únicamente el "corazón" del destilado: la esencia más pura de Estancos.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/Destilacion.jpeg',
      highlights: ['Alambiques de Cobre', 'Corte Preciso del Corazón', 'Textura Sedosa y Pura']
    },
    {
      id: 'anejamiento',
      number: '03',
      title: 'Añejamiento a 2500 MSNM',
      subtitle: 'Crianza Dinámica en Barrica Andina',
      tripletsTitle: 'Crianza & Carácter Andino',
      description: 'El tiempo y la altitud son nuestros mejores aliados. Maduramos nuestros espíritus a 2500 metros sobre el nivel del mar. Las variaciones térmicas andinas obligan a la madera a expandirse y contraerse, forzando una interacción profunda entre el líquido y las barricas de roble tostado.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/aniejamiento.jpeg',
      highlights: ['2500 Metros de Altitud', 'Roble Tostado Seleccionado', 'Microclima Térmico Andino']
    }
  ];

  /**
   * Transforma URLs de Supabase Storage para solicitar imágenes redimensionadas
   */
  getOptimizedImageUrl(url: string, width = 700, quality = 80): string {
    if (!url) return '';
    if (url.includes('/storage/v1/object/public/')) {
      const renderUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      return `${renderUrl}?width=${width}&quality=${quality}`;
    }
    return url;
  }

  /**
   * Genera tripletas semánticas (Sujeto - Predicado - Objeto) para cada etapa del proceso AEO
   */
  getSemanticTriplets(step: ProcessStep): SemanticTriplet[] {
    if (step.id === 'fermentacion') {
      return [
        { subject: 'La Fermentación en Estancos', predicate: 'se realiza mediante', object: 'levaduras seleccionadas a temperatura controlada.' },
        { subject: 'El Proceso de Fermentación', predicate: 'desarrolla', object: 'ésteres aromáticos complejos y perfiles primarios profundos.' }
      ];
    }
    if (step.id === 'destilacion') {
      return [
        { subject: 'La Destilación de Estancos', predicate: 'utiliza', object: 'alambiques tradicionales de cobre a 2500 msnm.' },
        { subject: 'Los Maestros Destiladores', predicate: 'capturan', object: 'únicamente el corazón del destilado desechando cabezas y colas.' }
      ];
    }
    return [
      { subject: 'El Añejamiento en Estancos', predicate: 'ocurre a', object: '2500 metros sobre el nivel del mar en la cordillera andina.' },
      { subject: 'La Maduración Dinámica', predicate: 'extrae de la barrica', object: 'matices intensos a roble tostado, vainilla y especias nobles.' }
    ];
  }

  /**
   * Retorna una descripción continua enriquecida con tripletas semánticas para metadatos AEO
   */
  getFormattedSemanticDescription(step: ProcessStep): string {
    const triplets = this.getSemanticTriplets(step);
    const tripletsText = triplets.map(t => `${t.subject} ${t.predicate} ${t.object}`).join(' ');
    return `${step.description} ${tripletsText}`.trim();
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target.src.includes('/render/image/public/')) {
      const originalUrl = target.src.split('?')[0].replace('/render/image/public/', '/object/public/');
      target.src = originalUrl;
      return;
    }
    target.src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop';
  }
}
