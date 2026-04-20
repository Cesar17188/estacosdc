import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agegate',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agegate.html',
  styleUrl: './agegate.scss',
})
export class Agegate implements OnInit{
  private fb = inject(FormBuilder);

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
    const isVerified = localStorage.getItem('estancos_age_verified');
    if (isVerified === 'true') {
      this.showGate.set(false);
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
      localStorage.setItem('estancos_age_verified', 'true');
      this.showGate.set(false);
      this.errorMsg.set('');
    } else {
      this.errorMsg.set('¡Gracias por tu interés! Lamentablemente, debes tener al menos 18 años para explorar nuestra destilería. ¡Te esperamos en el futuro!');
    }
  }

  // Función exclusiva para probar en este Canvas interactivo
  resetGate() {
    localStorage.removeItem('estancos_age_verified');
    this.dobForm.reset();
    this.showGate.set(true);
    this.errorMsg.set('');
  }
}
