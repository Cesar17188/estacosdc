import { Component } from '@angular/core';

// === INTERFACES GLOBALES ===
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface SemanticTriplet {
  subject: string;
  predicate: string;
  object: string;
}

export interface Rommelier {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  description: string;
  imageUrl: string;
  socials: SocialLinks;
  expertise: string[];
}

@Component({
  selector: 'app-rommelier-card',
  standalone: true,
  imports: [],
  templateUrl: './rommelier-card.html',
  styleUrl: './rommelier-card.scss',
})
export class RommelierCard {
  rommeliers: Rommelier[] = [
    {
      id: 'cesar-armendariz',
      name: 'César Elías Armendariz Ruano',
      role: 'CMO / CIO & Director de Marketing',
      shortRole: 'Estrategia & Innovación Digital',
      description: 'Arquitecto de la estrategia digital y creativa de Estancos. César fusiona la tecnología con el arte de la destilación, construyendo la comunidad y proyectando la identidad premium de nuestros espíritus de altura al mundo.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/CesarCata.jpeg',
      socials: { 
        facebook: 'https://www.facebook.com/CArmendariz17188', 
        instagram: 'https://www.instagram.com/estancos_cesar/', 
        youtube: 'https://www.youtube.com/@estancosdistillingcompany' 
      },
      expertise: ['Marketing Digital', 'Transformación CIO', 'Narrativa de Marca']
    },
    {
      id: 'richard-armendariz',
      name: 'Richard Alexis Armendariz Ruano',
      role: 'Maestro Destilador / CEO',
      shortRole: 'Alquimia & Añejamiento Andino',
      description: 'El alquimista detrás de la magia. Con una profunda devoción por la tradición y la innovación, selecciona meticulosamente cada ingrediente y vigila celosamente el envejecimiento en nuestras barricas a 2500 msnm.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/RichardMaster.jpeg',
      socials: { 
        instagram: 'https://www.instagram.com/richard_destilador/', 
        facebook: 'https://www.facebook.com/richard.armendariz.31', 
        youtube: 'https://www.youtube.com/@estancosdistillingcompany' 
      },
      expertise: ['Maestro Destilador', 'Crianza en Barrica', 'Alquimia Andina']
    },
    {
      id: 'andres-salinas',
      name: 'Andrés Salinas',
      role: 'Master Rommelier & Sommelier de Honor',
      shortRole: 'Cata & Análisis Organoléptico',
      description: 'Sommelier experto y guardián del perfil sensorial de Estancos. Andrés lidera las catas de honor, evaluando meticulosamente cada lote para garantizar la perfecta armonía de vainilla, melaza y especias andinas en boca.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/AndresRetroBar.jpeg',
      socials: { 
        instagram: 'https://www.instagram.com/estancosdistillingcompany/', 
        facebook: 'https://www.facebook.com/estancosdistillingcompany', 
        youtube: 'https://www.youtube.com/@estancosdistillingcompany' 
      },
      expertise: ['Master Sommelier', 'Análisis Organoléptico', 'Maridaje de Altura']
    }
  ];

  /**
   * Transforma la URL de Supabase para solicitar imágenes redimensionadas y optimizadas
   */
  getOptimizedImageUrl(url: string, width = 600, quality = 80): string {
    if (!url) return '';
    if (url.includes('/storage/v1/object/public/')) {
      const renderUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      return `${renderUrl}?width=${width}&quality=${quality}`;
    }
    return url;
  }

  getSemanticTriplets(rommelier: Rommelier): SemanticTriplet[] {
    if (rommelier.id === 'cesar-armendariz') {
      return [
        { subject: 'César Armendariz', predicate: 'dirige', object: 'la estrategia digital, CIO y comunicación de marca de Estancos.' },
        { subject: 'La visión de César Armendariz', predicate: 'posiciona a', object: 'Estancos Distilling Co. como referente de licores andinos de alta gama.' }
      ];
    }
    if (rommelier.id === 'richard-armendariz') {
      return [
        { subject: 'Richard Armendariz', predicate: 'supervisa', object: 'la fermentación, destilación y añejamiento a 2500 msnm.' },
        { subject: 'El trabajo de Richard Armendariz', predicate: 'garantiza', object: 'la pureza aromática y la excelencia artesanal de Ron Legarda y Whisky Real Audiencia.' }
      ];
    }
    return [
      { subject: 'Andrés Salinas', predicate: 'dirige', object: 'las catas organolépticas y el análisis sensorial de Estancos.' },
      { subject: 'La experiencia de Andrés Salinas', predicate: 'evalúa', object: 'el equilibrio de madera, melaza y especias en cada barrica.' }
    ];
  }

  getFormattedSemanticDescription(rommelier: Rommelier): string {
    const triplets = this.getSemanticTriplets(rommelier);
    const tripletsText = triplets.map(t => `${t.subject} ${t.predicate} ${t.object}`).join(' ');
    return `${rommelier.description} ${tripletsText}`.trim();
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
