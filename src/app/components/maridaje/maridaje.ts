import { Component } from '@angular/core';

interface PairingItem {
  name: string;
  description: string;
  imageUrl: string;
}

interface PairingCategory {
  spiritName: string;
  spiritSubtitle: string;
  items: PairingItem[];
}

@Component({
  selector: 'app-maridaje',
  imports: [],
  templateUrl: './maridaje.html',
  styleUrl: './maridaje.scss',
})
export class Maridaje {
   // Datos de Maridaje separados por el tipo de Destilado
  pairings: PairingCategory[] = [
    {
      spiritName: 'Maridaje para Ron Estancos',
      spiritSubtitle: 'Notas de Melaza, Vainilla y Frutos Secos',
      items: [
        {
          name: 'Chocolate Oscuro 70%',
          description: 'El alto porcentaje de cacao resalta las notas profundas de vainilla andina y madera tostada, creando una sinergia amarga y dulce inigualable.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/chocolate70Estancos.jpeg'
        },
        {
          name: 'Queso Azul Andino',
          description: 'El carácter intenso y salado del queso azul corta la rica dulzura del ron, limpiando el paladar y preparando las papilas para el siguiente sorbo.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/quesoAzulRon.jpeg'
        },
        {
          name: 'Habano Maduro',
          description: 'Un puro de hoja madura acompaña excelentemente el final largo de nuestro ron, armonizando con los toques ahumados adquiridos en las barricas.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/galleryImages/Ron%20y%20Puro%20Cinemat.%20(4).jpeg'
        }
      ]
    },
    {
      spiritName: 'Maridaje para Whisky Estancos',
      spiritSubtitle: 'Notas de Roble Carbonizado, Especias y Malta',
      items: [
        {
          name: 'Charcutería y Carnes Ahumadas',
          description: 'El perfil robusto y especiado del whisky estilo bourbon se complementa a la perfección con la intensidad de las carnes frías ahumadas y jamones curados.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/carnesWhisky.jpeg'
        },
        {
          name: 'Frutos Secos Tostados',
          description: 'Almendras y nueces ligeramente tostadas actúan como un puente que suaviza el grado alcohólico, resaltando las notas de cereales de la malta andina.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/frutosSecosWhisky.jpeg'
        },
        {
          name: 'Chocolate con Sal',
          description: 'La textura crujiente y salada potencia las notas de caramelo quemado del whiskey, desatando una explosión de sabores cálidos y envolventes.',
          imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/chocolateSalWhisky.jpeg'
        }
      ]
    }
  ];
}
