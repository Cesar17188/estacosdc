import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from "@angular/router";
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit {
  // Inyectamos nuestro servicio a base de datos
  supabaseService = inject(SupabaseService);
  private router = inject(Router, { optional: true });

  isSidebarOpen = signal<boolean>(false);
  currentRoute = signal<string>('dashboard');

  // Estados para el perfil del usuario logueado
  isLoadingProfile = signal<boolean>(true);
  userName = signal<string>('Cargando...');
  userRole = signal<string>('...');
  userInitials = signal<string>('--');

  async ngOnInit() {
    this.isLoadingProfile.set(true);
    try {
      // Solicitamos los datos del perfil a Supabase
      const profile = await this.supabaseService.getUserProfile();

      if (profile) {
        // Formateamos el nombre (o usamos el email si no ha llenado su perfil)
        const firstName = profile.first_name || 'Admin';
        const lastName = profile.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        // Extraemos las iniciales
        const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();

        this.userName.set(fullName);
        this.userInitials.set(initials);
        this.userRole.set(profile.is_staff ? 'Equipo Estancos' : 'Administrador');
      }
    } catch (error) {
      console.error('No se pudo cargar el perfil del usuario');
      // Fallback amigable
      this.userName.set('Administrador');
      this.userInitials.set('AD');
      this.userRole.set('Usuario');
    } finally {
      this.isLoadingProfile.set(false);
    }
  }

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

  async logout() {
    try {
      await this.supabaseService.signOut();

      // Si estamos en el entorno real de Angular, redirigimos al login
      if (this.router) {
        this.router.navigate(['/admin/login']);
      } else {
        console.log('Simulación: Redirigiendo a /admin/login');
      }
    } catch (error) {
      console.error('Hubo un error al intentar cerrar sesión', error);
    }
  }
}
