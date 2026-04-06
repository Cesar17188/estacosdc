import { Component } from '@angular/core';

interface SpiritInfo {
  name: string;
  description: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-spirits',
  imports: [],
  templateUrl: './spirits.html',
  styleUrl: './spirits.scss',
})
export class Spirits {
// Arreglo de objetos con la información de nuestros destilados
  spirits: SpiritInfo[] = [
    {
      name: 'Ron Estancos',
      description: 'Añejado pacientemente a 2500 msnm. Nuestro ron captura la esencia pura de la caña de azúcar, entregando notas complejas de caramelo oscuro, vainilla andina y un final suave e inolvidable.',
      imageUrl: 'https://images.unsplash.com/photo-1613140506142-277c6241b858?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Imagen placeholder (Ron)
      link: '#/espiritus/ron-estancos' // Ruta dinámica a la que redirigirá
    },
    {
      name: 'Whisky Estancos',
      description: 'Elaborado con malta seleccionada y agua pura de glaciar andino. Este whisky madurado en la altura desarrolla un carácter profundo, con sutiles toques a roble tostado y un leve ahumado.',
      imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop', // Imagen placeholder (Whisky/Barricas)
      link: '#/espiritus/whisky-estancos'
    },
    {
      name: 'Whiskey Bourbon Estancos',
      description: 'Nuestra interpretación andina del clásico americano. Una mezcla perfecta de maíz y destilación artesanal que aporta un dulzor intenso, equilibrado con el vigor de las barricas nuevas carbonizadas.',
      imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=800&auto=format&fit=crop', // Imagen placeholder (Bourbon)
      link: '#/espiritus/bourbon-estancos'
    }
  ];

}
