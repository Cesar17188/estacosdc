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
 // AEO: Array redactado con Tripletas Semánticas puras e íconos conceptuales
  features = [
    {
      number: '01',
      // Ícono de Brote/Grano (Sprout/Grains) para "Selección de Origen y Granos" (Caña, Cebada, Choclo)
      iconPath: 'M12 21V10m0 0a4 4 0 014-4h2v2a4 4 0 01-4 4h-2zm0 4a4 4 0 00-4-4H6v2a4 4 0 004 4h2zM7 20h10',
      title: 'Selección de Origen y Granos',
      // Tripleta: [Nuestra destilería] + [selecciona] + [100% jugo de caña puro].
      description: '<strong>Nuestra destilería</strong> selecciona <strong>100% jugo de caña puro</strong> para rones agrícolas. Además, <strong>Estancos</strong> elabora <strong>whisky Single Malt de cebada malteada</strong> y <strong>nuestros maestros</strong> destilan <strong>whiskey con choclo ecuatoriano</strong> (maíz tierno local), garantizando perfiles andinos de pureza absoluta.'
    },
    {
      number: '02',
      // Ícono de Alambique/Destilación para "Destilación Artesanal"
      iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      title: 'Destilación Artesanal',
      // Tripleta: [Estancos Distilling Company] + [destila] + [pequeños lotes de autor].
      description: '<strong>Estancos Distilling Company</strong> destila <strong>pequeños lotes de autor</strong>. Nuestro alambique de cobre purifica el alcohol conservando los aromas primarios de cada grano y de la caña del valle.'
    },
    {
      number: '03',
      // Ícono de Cordillera/Montaña para "Añejamiento de Altura" (2500m)
      iconPath: 'M2.25 18L9 7.5l3 4.5 4.5-6.75L21.75 18H2.25z',
      title: 'Añejamiento de Altura',
      // Tripleta: [El frío andino] + [oxigena] + [nuestras barricas de roble].
      description: '<strong>El frío andino</strong> oxigena <strong>nuestras barricas de roble</strong>. La maduración a 2500 m.s.n.m extrae colores cobrizos y perfiles de sabor extraordinarios en todos nuestros licores.'
    }
  ];
}

