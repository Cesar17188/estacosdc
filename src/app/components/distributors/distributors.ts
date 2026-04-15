import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necesario para el pipe json en depuración si se usara
import { SupabaseService } from '../../services/supabase';

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
  supabaseService = inject(SupabaseService);

  // Variable para controlar la vista de éxito
  isSubmitted = false;
  isSubmitting = false;
  submitError = ''; // Almacena mensajes de error si falla la conexión

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
  async onSubmit() {
    // Si alguien altera el HTML y logra enviar, esta barrera de TypeScript lo detiene
    if (this.distributorForm.invalid) {
      this.distributorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    const formData = this.distributorForm.value;

    try {
      // 1. Guardar silenciosamente en Supabase
      await this.supabaseService.submitDistributorRequest(formData);
      // Usamos el endpoint de formsubmit que convierte JSON a un correo
      const response = await fetch('https://formsubmit.co/ajax/estancos.d.c@outlook.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: formData.name,
          Empresa: formData.company,
          Email: formData.email,
          Region: formData.region,
          Mensaje: formData.message || 'Sin mensaje adicional',
          // Opciones de configuración para FormSubmit
          _subject: `Nueva solicitud B2B de ${formData.company}`, // Asunto del correo
          _template: 'box' // Estilo del correo que recibirás
        })
      });

      if (response.ok) {
        this.isSubmitted = true;
        this.distributorForm.reset();
      } else {
        throw new Error('La respuesta de red no fue satisfactoria.');
      }
    } catch (error) {
      console.error('Error enviando el correo:', error);
      this.submitError = 'Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
