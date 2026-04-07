import { Component } from '@angular/core';

// === INTERFACES GLOBALES ===
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface Rommelier {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  socials: SocialLinks;
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
      name: 'César Elías Armendariz Ruano',
      role: 'CMO / CIO & Director de Marketing',
      description: 'Arquitecto de la estrategia digital y creativa de Estancos. César fusiona la tecnología con el arte de la destilación, construyendo la comunidad y proyectando la identidad premium de nuestros espíritus de altura al mundo.',
      imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop',
      socials: { facebook: '#', instagram: '#', youtube: '#' }
    },
    {
      name: 'Nombre del Fundador 2',
      role: 'Maestro Destilador / CEO',
      description: 'El alquimista detrás de la magia. Con una profunda devoción por la tradición y la innovación, selecciona meticulosamente cada ingrediente y vigila celosamente el envejecimiento en nuestras barricas a 2500 msnm.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      socials: { instagram: '#', facebook: '#', youtube: '#' }
    },
    {
      name: 'Nombre del Fundador 3',
      role: 'COO / Director de Operaciones',
      description: 'El motor que asegura que cada botella de Estancos alcance la perfección. Especialista en la gestión de nuestra cadena de producción, garantizando que el estándar de calidad se mantenga intacto desde el campo hasta la copa.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      socials: { facebook: '#', instagram: '#', youtube: '#' }
    }
  ];
}
