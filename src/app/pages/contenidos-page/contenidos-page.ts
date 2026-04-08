import { Component } from '@angular/core';
import { Galeria } from '../../components/galeria/galeria';
import { Cocteleria } from '../../components/cocteleria/cocteleria';

@Component({
  selector: 'app-contenidos-page',
  imports: [ Galeria, Cocteleria ],
  templateUrl: './contenidos-page.html',
  styleUrl: './contenidos-page.scss',
})
export class ContenidosPage {}
