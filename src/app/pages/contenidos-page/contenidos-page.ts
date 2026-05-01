import { Component,signal } from '@angular/core';
import { Galeria } from '../../components/galeria/galeria';
import { Cocteleria } from '../../components/cocteleria/cocteleria';
import { Maridaje } from '../../components/maridaje/maridaje';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contenidos-page',
  imports: [ CommonModule, Galeria, Cocteleria, Maridaje ],
  templateUrl: './contenidos-page.html',
  styleUrl: './contenidos-page.scss',
})
export class ContenidosPage {
  // El estado de este componente padre se reduce únicamente a saber qué pestaña está activa
  activeTab = signal<'mixologia' | 'maridaje' | 'galeria'>('mixologia');

  setTab(tab: 'mixologia' | 'maridaje' | 'galeria') {
    this.activeTab.set(tab);
  }
}
