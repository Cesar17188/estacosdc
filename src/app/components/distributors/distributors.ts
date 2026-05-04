import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Necesario para el pipe json en depuración si se usara
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './distributors.html',
  styleUrl: './distributors.scss',
})
export class Distributors implements OnInit {

   // Inyectamos el FormBuilder de Angular
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  supabaseService = inject(SupabaseService);

  // Variable para controlar la vista de éxito
  isSubmitted = false;
  isSubmitting = false;
  submitError = ''; // Almacena mensajes de error si falla la conexión

  // DEFENSAS INVISIBLES
  private formInitTime = 0;
  private spamWords = ['test', 'asdf', '1234', 'qwerty', 'http', 'www', 'cripto', 'crypto', 'seo', 'marketing', 'viagra'];

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

  ngOnInit() {
    // Almacenamos el momento exacto en el que el formulario cargó (Filtro 2)
    this.formInitTime = Date.now();
  }

  // Método auxiliar para limpiar el HTML y comprobar si un campo tiene error y ya fue tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.distributorForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  async onSubmit() {
    if (this.distributorForm.invalid) {
      this.distributorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    // --- FILTRO 1: HONEYPOT ---
    if (this.distributorForm.get('website_url')?.value) {
      console.warn('Bot detectado: Llenó el campo oculto.');
      return this.fakeSuccess();
    }

    // --- FILTRO 2: TRAMPA DE TIEMPO ---
    const timeToFill = Date.now() - this.formInitTime;
    if (timeToFill < 4000) { // Si tardó menos de 4 segundos en llenar todo
      console.warn('Bot detectado: Velocidad de llenado inhumana.');
      return this.fakeSuccess();
    }

    // --- FILTRO 3: BLOQUEO POR SESIÓN (Evita errores SSR) ---
    if (isPlatformBrowser(this.platformId)) {
      const lastSubmit = localStorage.getItem('last_b2b_submit');
      // Bloquea por 24 horas (86400000 ms)
      if (lastSubmit && (Date.now() - parseInt(lastSubmit)) < 86400000) {
        console.warn('Spam manual detectado: Ya envió solicitud recientemente.');
        return this.fakeSuccess();
      }
    }

    // --- FILTRO 4: PALABRAS PROHIBIDAS ---
    const formVals = this.distributorForm.value;
    const textToCheck = `${formVals.name} ${formVals.company} ${formVals.message}`.toLowerCase();
    const isSpam = this.spamWords.some(word => textToCheck.includes(word));

    if (isSpam) {
      console.warn('Contenido basura detectado en la redacción.');
      return this.fakeSuccess();
    }

    // --- PASÓ TODAS LAS DEFENSAS: ENVÍO REAL ---
    try {
      const dataToSubmit = {
        name: formVals.name,
        company: formVals.company,
        email: formVals.email,
        region: formVals.region,
        message: formVals.message,
        status: 'nuevo'
      };

      // 1. Guardar en Supabase (Descomentar en local)
      // await this.supabaseService.submitDistributorRequest(dataToSubmit);

      // (Aquí también puedes poner el fetch a tu correo de formsubmit si lo sigues usando)

      // 2. Registro exitoso
      this.isSubmitted = true;
      this.distributorForm.reset();

      // Bloqueamos envíos futuros por 24h
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('last_b2b_submit', Date.now().toString());
      }

    } catch (error) {
      console.error('Error procesando la solicitud:', error);
      this.submitError = 'Ocurrió un problema de conexión. Por favor, intenta de nuevo.';
    } finally {
      this.isSubmitting = false;
    }
  }

  // MÉTODO TÁCTICO: Simula éxito para despistar al bot/troll
  private fakeSuccess() {
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
      this.distributorForm.reset();
    }, 800);
  }
}
