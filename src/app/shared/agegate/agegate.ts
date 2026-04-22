import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-agegate',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agegate.html',
  styleUrl: './agegate.scss',
})
export class Agegate implements OnInit{
  private fb = inject(FormBuilder);

  // 2. Inyectamos el ID de la plataforma
  private platformId = inject(PLATFORM_ID);

   // Hacemos que el Router sea opcional para que no falle en el entorno de previsualización (Canvas)
  private router = inject(Router, { optional: true });

  // Guardamos la suscripción para evitar fugas de memoria
  private routerSub?: Subscription;

  showGate = signal<boolean>(true);
  errorMsg = signal<string>('');
  currentYear = new Date().getFullYear();

  // Formulario reactivo para la fecha de nacimiento
  dobForm = this.fb.group({
    day: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
    month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
    year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]]
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      // 1. Revisión Inmediata (basada en la URL actual de la ventana)
      this.evaluateRouteAndGate(window.location.href);

      // 2. Suscripción Reactiva (escucha constantemente si navegas a otra página)
      if (this.router) {
        this.routerSub = this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
          this.evaluateRouteAndGate(event.urlAfterRedirects);
        });
      }
    }
  }

  // Se destruye la escucha si el componente se elimina
  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

   /**
   * Función centralizada que decide si mostrar o no la pantalla
   * dependiendo de la URL y el LocalStorage.
   */
  private evaluateRouteAndGate(url: string) {
    // Si la URL tiene "admin", forzamos a ocultar el filtro
    if (url.includes('/admin')) {
      this.showGate.set(false);
      return;
    }

    // Si NO es admin, verificamos el localStorage normal
    const isVerified = localStorage.getItem('estancos_age_verified');
    if (isVerified !== 'true') {
      this.showGate.set(true);
    } else {
      this.showGate.set(false); // Aseguramos que se oculte si ya está verificado
    }
  }


  verifyAge() {
    if (this.dobForm.invalid) {
      this.errorMsg.set('Uy, parece que faltan algunos datos. Por favor, completa tu fecha de nacimiento.');
      return;
    }

    const { day, month, year } = this.dobForm.value;
    const d = parseInt(day!, 10);
    const m = parseInt(month!, 10);
    const y = parseInt(year!, 10);

    // 1. Validar que la fecha realmente exista (Ej: No permitir 31 de Febrero)
    const birthDate = new Date(y, m - 1, d);
    if (birthDate.getDate() !== d || birthDate.getMonth() !== m - 1 || birthDate.getFullYear() !== y) {
      this.errorMsg.set('Mmm, esa fecha no parece correcta. ¿Podrías revisarla?');
      return;
    }

    // 2. Calcular la edad exacta
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Si el mes actual es anterior al mes de nacimiento, o si es el mismo mes pero el día actual es anterior
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // 3. Validar si tiene 18 años o más
    if (age >= 18) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('estancos_age_verified', 'true');
      }
      this.showGate.set(false);
      this.errorMsg.set('');
    } else {
      this.errorMsg.set('¡Gracias por tu interés! Lamentablemente tu edad no te permite acceder a este sitio. Si crees que esto es un error, por favor contáctanos.');
    }
  }
}
