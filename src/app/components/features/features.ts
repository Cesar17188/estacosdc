import { Component } from '@angular/core';

interface ProcessFeature {
  number: string;
  title: string;
  description: string;
  iconPath: string;
}

@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  // Datos de las características del proceso
  features: ProcessFeature[] = [
    {
      number: '01',
      title: 'Fermentación Lenta',
      description: 'Un proceso pausado y meticuloso que permite a nuestras levaduras desarrollar ésteres complejos, garantizando perfiles aromáticos excepcionalmente profundos antes de la destilación.',
      // Ícono de reloj/tiempo
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      number: '02',
      title: 'Alambique de Cobre',
      description: 'Utilizamos alambiques de cobre tradicionales. Este metal noble reacciona con el destilado, purificando el espíritu y otorgándole una textura sedosa y suave al paladar.',
      // Ícono que simula un matraz/alambique
      iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
    },
    {
      number: '03',
      title: 'El Corazón del Destilado',
      description: 'Realizamos cortes precisos y artesanales para descartar las cabezas y colas. Capturamos y añejamos únicamente el núcleo más puro de cada lote, la verdadera esencia de Estancos.',
      // Ícono de un corazón/gota
      iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    }
  ];
}
