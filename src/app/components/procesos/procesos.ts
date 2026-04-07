import { Component } from '@angular/core';

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-procesos',
  imports: [],
  templateUrl: './procesos.html',
  styleUrl: './procesos.scss',
})
export class Procesos {
  processSteps: ProcessStep[] = [
    {
      id: 'fermentacion',
      number: '01',
      title: 'Fermentación',
      description: 'Todo gran destilado comienza con una fermentación excepcional. Seleccionamos levaduras específicas que trabajan de manera lenta y pausada. Este ritmo controlado permite la creación de ésteres complejos, asegurando que los perfiles aromáticos primarios se desarrollen con una profundidad inigualable antes de pasar al alambique.',
      imageUrl: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=1000&auto=format&fit=crop' // Representación de fermentación/materia prima
    },
    {
      id: 'destilacion',
      number: '02',
      title: 'Destilación',
      description: 'Nuestra magia ocurre en alambiques tradicionales de cobre. Este metal noble reacciona con el líquido, purificando el espíritu y otorgándole una textura sedosa. Durante este paso, nuestros maestros realizan cortes extremadamente precisos, descartando las cabezas y las colas para capturar únicamente el "corazón" del destilado: la esencia más pura de Estancos.',
      imageUrl: 'https://images.unsplash.com/photo-1582885461973-c60f25603816?q=80&w=1000&auto=format&fit=crop' // Representación de alambiques de cobre
    },
    {
      id: 'anejamiento',
      number: '03',
      title: 'Añejamiento',
      description: 'El tiempo y la altitud son nuestros mejores aliados. Maduramos nuestros espíritus a 2500 metros sobre el nivel del mar. Las drásticas variaciones de temperatura andinas obligan a la madera a expandirse y contraerse, forzando una interacción profunda entre el líquido y las barricas de roble. Este "envejecimiento dinámico" extrae sabores a madera tostada, vainilla y especias con una intensidad única en el mundo.',
      imageUrl: 'https://images.unsplash.com/photo-1590483866160-c6c70bb234ab?q=80&w=1000&auto=format&fit=crop' // Representación de barricas de roble
    }
  ];
}
