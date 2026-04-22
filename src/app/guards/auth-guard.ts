import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  // Inyectamos los servicios necesarios
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Le preguntamos a Supabase si el usuario actual tiene una sesión válida
  const session = await supabaseService.getSession();

  if (session) {
    // Si hay sesión, retornamos 'true' (Acceso concedido)
    return true;
  } else {
    // Si NO hay sesión, lo enviamos a la pantalla de Login y retornamos 'false' (Acceso denegado)
    console.warn('Acceso denegado: Se requiere iniciar sesión.');
    router.navigate(['/admin/login']);
    return false;
  }
};
