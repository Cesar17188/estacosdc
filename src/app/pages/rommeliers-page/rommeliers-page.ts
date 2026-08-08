import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RommelierCard } from '../../components/rommelier-card/rommelier-card';
import { Procesos } from '../../components/procesos/procesos';
import { Premios } from '../../components/premios/premios';

@Component({
  selector: 'app-rommeliers-page',
  standalone: true,
  imports: [ CommonModule, RommelierCard, Procesos, Premios ],
  templateUrl: './rommeliers-page.html',
  styleUrl: './rommeliers-page.scss',
})
export class RommeliersPage {

  /**
   * Desplazamiento suave (smooth scroll) hacia la sección seleccionada
   */
  scrollToSection(sectionId: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
