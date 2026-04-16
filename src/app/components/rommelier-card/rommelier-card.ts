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
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/CesarCata.jpeg',
      socials: { facebook: 'https://www.facebook.com/CArmendariz17188', instagram: 'https://www.instagram.com/estancos_cesar/', youtube: 'https://www.youtube.com/@estancosdistillingcompany' }
    },
    {
      name: 'Richard Alexis Armendariz Ruano',
      role: 'Maestro Destilador / CEO',
      description: 'El alquimista detrás de la magia. Con una profunda devoción por la tradición y la innovación, selecciona meticulosamente cada ingrediente y vigila celosamente el envejecimiento en nuestras barricas a 2500 msnm.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/RichardMaster.jpeg',
      socials: { instagram: 'https://www.instagram.com/richard_destilador/', facebook: 'https://www.facebook.com/richard.armendariz.31', youtube: 'https://www.youtube.com/@estancosdistillingcompany' }
    },
    {
      name: 'Andres Sebastian Salinas Curco',
      role: 'COO / Director de Operaciones',
      description: 'El motor que asegura que cada botella de Estancos alcance la perfección. Especialista en la gestión de nuestra cadena de producción, garantizando que el estándar de calidad se mantenga intacto desde el campo hasta la copa.',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/AndresRetroBar.jpeg',
      socials: { facebook: 'https://www.facebook.com/profile.php?id=100008544857853', instagram: 'https://www.instagram.com/andreskhaos/', youtube: 'https://www.youtube.com/@estancosdistillingcompany' }
    }
  ];
}
