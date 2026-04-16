import { Component } from '@angular/core';

interface Award {
  year: string;
  title: string;
  competition: string;
}

interface ProductAwards {
  productName: string;
  imageUrl: string;
  awards: Award[];
}

@Component({
  selector: 'app-premios',
  imports: [],
  templateUrl: './premios.html',
  styleUrl: './premios.scss',
})
export class Premios {
  // Datos de los premios separados por producto
  productsAwards: ProductAwards[] = [
    {
      productName: 'Ron Estancos',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/RonEcommerce.jpeg', // Imagen de referencia del Ron
      awards: [
        {
          year: '2025',
          title: 'Medalla de Plata - Ron Clásico',
          competition: 'Premios gourmet Ecuador 2025'
        },
        {
          year: '2024',
          title: 'Medalla de Plata - Ron Clásico',
          competition: 'Premios gourmet Ecuador 2024'
        }
      ]
    },
    {
      productName: 'Whisky Estancos',
      imageUrl: 'https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/whiskyEcommerce.jpeg', // Imagen de referencia del Whisky
      awards: [
        {
          year: '2025',
          title: 'Medalla de Oro - Whisky Clásico',
          competition: 'Premios gourmet Ecuador 2025'
        },
        {
          year: '2024',
          title: 'Medalla de Oro - Whisky Clásico',
          competition: 'Premios gourmet Ecuador 2024'
        },
        {
          year: '2023',
          title: 'Medalla de Plata - Whisky Clásico',
          competition: 'Premios gourmet Ecuador 2023'
        }
      ]
    }
  ];
}
