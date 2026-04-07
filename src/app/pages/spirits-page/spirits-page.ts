import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TastingNotes {
  nose: string;
  palate: string;
  finish: string;
}

interface ProductDetails {
  id: string;
  name: string;
  type: string;
  abv: string;
  age: string;
  description: string;
  tastingNotes: TastingNotes;
  imageUrl: string;
  reverseLayout?: boolean; // Para alternar la imagen izquierda/derecha
}

@Component({
  selector: 'app-spirits-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spirits-page.html',
  styleUrl: './spirits-page.scss',
})
export class SpiritsPage {
  // Base de datos de nuestros destilados detallados
  products: ProductDetails[] = [
    {
      id: 'ron-estancos',
      name: 'Ron Añejo Estancos',
      type: 'Ron Artesanal Premium',
      abv: '40% Vol.',
      age: 'Sistema Solera 8 Años',
      description: 'Destilado del jugo virgen de caña cultivada en los valles ecuatoriales y madurado a 2500 msnm. La baja presión atmosférica acelera la interacción con las barricas de roble americano ex-bourbon, creando un ron de complejidad inusual, donde la altitud dicta las reglas.',
      tastingNotes: {
        nose: 'Aromas intensos a melaza tostada, vainilla andina, cacao y sutiles toques de frutos secos.',
        palate: 'Entrada sedosa y cálida. Notas de caramelo oscuro, roble especiado, y un toque de café tostado.',
        finish: 'Largo y persistente, dejando un recuerdo dulce y suave en el paladar.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1613140506142-277c6241b858?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reverseLayout: false
    },
    {
      id: 'whisky-estancos',
      name: 'Whisky Single Malt Estancos',
      type: 'Whisky de Altura',
      abv: '43% Vol.',
      age: '12 Años',
      description: 'El primer Single Malt forjado en la cordillera de los Andes. Utilizando cebada malteada seleccionada y agua pura de deshielo glaciar. Su maduración en la altura permite una evaporación ("Angel\'s Share") distinta, concentrando sabores elegantes y robustos.',
      tastingNotes: {
        nose: 'Elegante y floral. Notas de manzana horneada, miel de brezo y un levísimo toque ahumado.',
        palate: 'Cuerpo medio con textura oleosa. Sabores a especias de panadería, nuez moscada y malta dulce.',
        finish: 'Seco y especiado, con recuerdos a madera tostada y un eco floral persistente.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1000&auto=format&fit=crop',
      reverseLayout: true // Esta tarjeta tendrá la imagen a la derecha para romper la monotonía visual
    },
    {
      id: 'whiskey-chillos-valley',
      name: 'Whiskey Chillos Valley Grain',
      type: 'Whiskey Estilo Bourbon',
      abv: '50% Vol.',
      age: 'Small Batch (Lotes Pequeños)',
      description: 'Nuestra reinterpretación del clásico americano utilizando maíces endémicos del Valle de los Chillos. Envejecido en barricas de roble nuevo altamente carbonizadas. El drástico cambio de temperatura entre el día y la noche andina exprime al máximo los azúcares de la madera.',
      tastingNotes: {
        nose: 'Explosión de vainilla, maíz dulce tostado, caramelo quemado y cuero viejo.',
        palate: 'Robusto y potente. Dulzor intenso que se equilibra con notas de pimienta negra, canela y roble oscuro.',
        finish: 'Cálido y envolvente, con un final persistente de especias de madera y toffee.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1000&auto=format&fit=crop',
      reverseLayout: false
    },
    {
      id: 'whisky-chillos-valley-coleccionista',
      name: 'Whisky Chillos Valley Grain Coleccionista',
      type: 'Whiskey Estilo Bourbon (Edición Especial)',
      abv: '60% Vol.',
      age: 'Cask Strength',
      description: 'Una edición de colección embotellada directamente de la barrica sin diluir (Cask Strength). Esta versión robusta a 60% Vol. ofrece la experiencia más pura del Chillos Valley Grain, intensificando magistralmente las notas de la madera carbonizada y la calidez del maíz andino.',
      tastingNotes: {
        nose: 'Potente y profunda. Aromas concentrados a caramelo oscuro, roble tostado intenso, cuero y tabaco dulce.',
        palate: 'Intenso, cálido y oleoso. Una explosión de vainilla rica, especias marcadas, pimienta negra y un dulzor meloso que recubre el paladar.',
        finish: 'Extremadamente largo y reconfortante, con notas persistentes de madera dulce y especias cálidas.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1601614945413-5b839215096a?q=80&w=1000&auto=format&fit=crop',
      reverseLayout: true
    }
  ];
}
