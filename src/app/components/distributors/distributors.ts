import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necesario para el pipe json en depuración si se usara

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './distributors.html',
  styleUrl: './distributors.scss',
})
export class Distributors {
   // Inyectamos el FormBuilder de Angular
  private fb = inject(FormBuilder);

  // Variable para controlar la vista de éxito
  isSubmitted = false;
  isSubmitting = false;

  // Definición del Formulario Reactivo con sus validaciones seguras
  distributorForm = this.fb.group({
    name: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    region: ['', Validators.required],
    message: [''] // Campo opcional, no requiere validador
  });

  // Método auxiliar para limpiar el HTML y comprobar si un campo tiene error y ya fue tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.distributorForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Método que se ejecuta al presionar "Enviar Solicitud"
  onSubmit() {
    // Si alguien altera el HTML y logra enviar, esta barrera de TypeScript lo detiene
    if (this.distributorForm.invalid) {
      this.distributorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Aquí iría tu conexión real con Supabase para guardar el lead B2B.
    // Por ahora simulamos una carga de red de 1.5 segundos.
    setTimeout(() => {
      console.log('Datos seguros enviados a Supabase:', this.distributorForm.value);
      this.isSubmitting = false;
      this.isSubmitted = true;
      this.distributorForm.reset();
    }, 1500);
  }
}
