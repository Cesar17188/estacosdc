import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase'; // IMPORTAR EL SERVICIO REAL DE SUPABASE

@Component({
  selector: 'app-admin-galeria',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './admin-galeria.html',
  styleUrl: './admin-galeria.scss',
})
export class AdminGaleria implements OnInit {
  private fb = inject(FormBuilder);
  crmService = inject(SupabaseService); // Reemplazar por SupabaseService en prod

  images = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Estados del Modal
  isModalOpen = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  submitAttempted = signal<boolean>(false);

  // Archivo e Imagen
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  uploadForm = this.fb.group({
    title: ['', Validators.required],
    alt: ['', Validators.required],
    sizeClass: ['normal', Validators.required]
  });

  ngOnInit() {
    this.loadImages();
  }

  async loadImages() {
    this.isLoading.set(true);
    try {
      const data = await this.crmService.getGalleryImages();
      this.images.set(data);
    } catch (error) {
      console.error('Error cargando galería', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openUploadModal() {
    this.submitAttempted.set(false);
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    this.uploadForm.reset({ sizeClass: 'normal' });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  isInvalid(field: string): boolean {
    const control = this.uploadForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched || this.submitAttempted())) : false;
  }

  async saveImage() {
    this.submitAttempted.set(true);

    if (this.uploadForm.invalid || !this.selectedFile()) {
      return;
    }

    this.isSaving.set(true);
    const formValues = this.uploadForm.value;

    try {
      // 1. Subir la imagen al Bucket físico de Supabase Storage
      const uploadedUrl = await this.crmService.uploadGalleryImageFile(this.selectedFile()!);

      // 2. Guardar el registro en la tabla de la base de datos
      const newRecord = {
        url: uploadedUrl,
        title: formValues.title,
        alt: formValues.alt,
        sizeClass: formValues.sizeClass
      };

      const savedData = await this.crmService.addGalleryImageRecord(newRecord);

      // Actualizar la vista local para que se vea inmediatamente
      this.images.update(list => [savedData, ...list]);
      this.closeModal();

    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Hubo un problema al subir la imagen.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteImage(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen de la galería?')) {
      try {
        await this.crmService.deleteGalleryImage(id);
        this.images.update(list => list.filter(img => img.id !== id));
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
