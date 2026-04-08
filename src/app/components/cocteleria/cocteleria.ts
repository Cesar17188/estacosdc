import { Component } from '@angular/core';

interface CocktailPost {
  id: string;
  title: string;
  baseSpirit: string; // Ej: 'Ron Estancos', 'Whisky Estancos'
  excerpt: string;
  imageUrl: string;
  readTime: string;
}

@Component({
  selector: 'app-cocteleria',
  imports: [],
  templateUrl: './cocteleria.html',
  styleUrl: './cocteleria.scss',
})
export class Cocteleria {
  // Arreglo de recetas de coctelería simulando entradas de blog
  cocktailPosts: CocktailPost[] = [
    {
      id: 'old-fashioned-altura',
      title: 'Old Fashioned de Altura',
      baseSpirit: 'Whisky Chillos Valley',
      excerpt: 'Una reinterpretación robusta del clásico. Las notas de roble carbonizado de nuestro whiskey estilo bourbon se realzan con un toque de sirope de panela y bitters de naranja.',
      imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04d84ee52a?q=80&w=800&auto=format&fit=crop',
      readTime: '3 min'
    },
    {
      id: 'cuba-libre-andina',
      title: 'Cuba Libre Andina',
      baseSpirit: 'Ron Estancos',
      excerpt: 'Refrescante y profunda. Descubre cómo nuestro ron añejado a 2500 msnm transforma por completo la tradicional mezcla caribeña, aportando matices de cacao y vainilla.',
      imageUrl: 'https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?q=80&w=800&auto=format&fit=crop',
      readTime: '2 min'
    },
    {
      id: 'whisky-sour-paramo',
      title: 'Sour del Páramo',
      baseSpirit: 'Whisky Single Malt',
      excerpt: 'El equilibrio perfecto entre la potencia de nuestra malta andina y la frescura de los cítricos locales. Una receta sedosa que sorprenderá a tu paladar.',
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop',
      readTime: '4 min'
    },
    {
      id: 'mojito-estancos',
      title: 'Mojito Reserva Estancos',
      baseSpirit: 'Ron Estancos',
      excerpt: 'Un twist premium para tus tardes. Elevamos el clásico mojito utilizando nuestro ron oscuro añejado, hierbabuena fresca y un toque sutil de jengibre.',
      imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop',
      readTime: '3 min'
    }
  ];
}
