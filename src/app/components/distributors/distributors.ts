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
    // Validaciones más estrictas con Regex y longitudes mínimas
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
    company: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    region: ['', [Validators.required, Validators.minLength(4)]],
    message: ['', [Validators.minLength(15)]],
    website_url: [''] // Campo Honeypot oculto
  });

  // Método auxiliar para limpiar el HTML y comprobar si un campo tiene error y ya fue tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.distributorForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Método que se ejecuta al presionar "Enviar Solicitud"
  async onSubmit() {
    // 1. Verificación del Honeypot (Trampa para Bots)
    // Si este campo tiene texto, fue llenado por un robot. Cancelamos silenciosamente.
    if (this.distributorForm.get('website_url')?.value) {
      console.warn('Bot detectado y bloqueado silenciosamente.');
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitted = true; // Le hacemos creer al bot que tuvo éxito
        this.isSubmitting = false;
        this.distributorForm.reset();
      }, 1000);
      return;
    }

    if (this.distributorForm.invalid) {
      this.distributorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    const formData = this.distributorForm.value;

    try {
      // Excluimos el campo trampa de la información final
      const dataToSubmit = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        region: formData.region,
        message: formData.message
      };

      // 2. Guardar silenciosamente en Supabase
      await this.supabaseService.submitDistributorRequest(dataToSubmit);

      // 3. Usamos el endpoint de formsubmit para notificar por correo
      const response = await fetch('https://formsubmit.co/ajax/estancos.d.c@outlook.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: dataToSubmit.name,
          Empresa: dataToSubmit.company,
          Email: dataToSubmit.email,
          Region: dataToSubmit.region,
          Mensaje: dataToSubmit.message || 'Sin mensaje adicional',
          // Opciones de configuración para FormSubmit
          _subject: `Nueva solicitud B2B de ${dataToSubmit.company}`,
          _template: 'box'
        })
      });

      if (response.ok) {
        this.isSubmitted = true;
        this.distributorForm.reset();
      } else {
        throw new Error('La respuesta de red no fue satisfactoria.');
      }
    } catch (error) {
      console.error('Error procesando la solicitud:', error);
      this.submitError = 'Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
