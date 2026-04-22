import { Component, signal, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';


@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  private fb = inject(FormBuilder);

  // INYECCIÓN DE SERVICIOS
  private supabaseService = inject(SupabaseService); // En tu app real: inject(SupabaseService)
  private router = inject(Router, { optional: true });   // Inyectamos el enrutador de Angular

  // ESTADOS
  isLoading = signal<boolean>(false);
  authError = signal<string | null>(null);
  loginSuccess = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.authError.set(null);

    const { email, password } = this.loginForm.value;

    try {
      // 1. Llamada a Supabase para verificar credenciales
      await this.supabaseService.signIn(email!, password!);

      // 2. Si tiene éxito, mostramos la animación verde
      this.loginSuccess.set(true);

      // 3. Esperamos 1.5 segundos (para que se vea la animación) y redirigimos al Dashboard
      setTimeout(() => {
        if (this.router) {
           this.router.navigate(['/admin/dashboard']).catch(e => console.log('Enrutando al dashboard...'));
        }
      }, 1500);

    } catch (error: any) {
      // Si falla (credenciales incorrectas):
      // Supabase devuelve el error en inglés usualmente, puedes personalizarlo:
      this.authError.set('Credenciales inválidas. Por favor, intenta de nuevo.');
      this.loginForm.get('password')?.reset();
    } finally {
      this.isLoading.set(false);
    }
}
}
