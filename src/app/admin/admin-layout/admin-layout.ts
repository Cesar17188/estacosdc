import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  // Lógica local para la vista previa
  isSidebarOpen = signal<boolean>(false);
  currentRoute = signal<string>('dashboard');

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

  navigate(route: string) {
    this.currentRoute.set(route);
    // En móviles, cerramos el menú automáticamente al seleccionar una opción
    if (window.innerWidth <= 900) {
      this.isSidebarOpen.set(false);
    }
  }
}
