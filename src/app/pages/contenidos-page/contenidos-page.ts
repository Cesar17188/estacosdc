import { Component } from '@angular/core';
import { Galeria } from '../../components/galeria/galeria';
import { Cocteleria } from '../../components/cocteleria/cocteleria';
import { Maridaje } from '../../components/maridaje/maridaje';

@Component({
  selector: 'app-contenidos-page',
  imports: [ Galeria, Cocteleria, Maridaje ],
  templateUrl: './contenidos-page.html',
  styleUrl: './contenidos-page.scss',
})
export class ContenidosPage {}
