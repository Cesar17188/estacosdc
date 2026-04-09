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
          imageUrl: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Queso Azul Andino',
          description: 'El carácter intenso y salado del queso azul corta la rica dulzura del ron, limpiando el paladar y preparando las papilas para el siguiente sorbo.',
          imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Habano Maduro',
          description: 'Un puro de hoja madura acompaña excelentemente el final largo de nuestro ron, armonizando con los toques ahumados adquiridos en las barricas.',
          imageUrl: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?q=80&w=600&auto=format&fit=crop'
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
          imageUrl: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Frutos Secos Tostados',
          description: 'Almendras y nueces ligeramente tostadas actúan como un puente que suaviza el grado alcohólico, resaltando las notas de cereales de la malta andina.',
          imageUrl: 'https://images.unsplash.com/photo-1599598425947-33002620f4c7?q=80&w=600&auto=format&fit=crop'
        },
        {
          name: 'Chocolate con Sal de Mar',
          description: 'La textura crujiente y salada potencia las notas de caramelo quemado del whiskey, desatando una explosión de sabores cálidos y envolventes.',
          imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d06aca27?q=80&w=600&auto=format&fit=crop'
        }
      ]
    }
  ];
}
