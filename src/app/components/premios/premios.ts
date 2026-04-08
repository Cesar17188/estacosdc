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
      imageUrl: 'https://images.unsplash.com/photo-1614316311652-3d712f602b9f?q=80&w=400&auto=format&fit=crop', // Imagen de referencia del Ron
      awards: [
        {
          year: '2025',
          title: 'Doble Medalla de Oro',
          competition: 'San Francisco World Spirits Competition'
        },
        {
          year: '2024',
          title: 'Mejor Ron de Altura',
          competition: 'International Rum Conference'
        }
      ]
    },
    {
      productName: 'Whisky Estancos',
      imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=400&auto=format&fit=crop', // Imagen de referencia del Whisky
      awards: [
        {
          year: '2026',
          title: 'Medalla de Oro Excepcional',
          competition: 'International Spirits Challenge'
        },
        {
          year: '2025',
          title: 'Mejor Single Malt Andino',
          competition: 'World Whiskies Awards'
        },
        {
          year: '2024',
          title: 'Medalla de Plata',
          competition: 'New York International Spirits Competition'
        }
      ]
    }
  ];
}
