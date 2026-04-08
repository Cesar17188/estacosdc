import { Component } from '@angular/core';
import { Galeria } from '../../components/galeria/galeria';

@Component({
  selector: 'app-contenidos-page',
  imports: [ Galeria ],
  templateUrl: './contenidos-page.html',
  styleUrl: './contenidos-page.scss',
})
export class ContenidosPage {}
