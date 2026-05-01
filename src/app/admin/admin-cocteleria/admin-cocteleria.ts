import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase'; // IMPORTAR EL SERVICIO REAL DE SUPABASE


@Component({
  selector: 'app-admin-cocteleria',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-cocteleria.html',
  styleUrl: './admin-cocteleria.scss',
})
export class AdminCocteleria implements OnInit {
  private fb = inject(FormBuilder);
  crmService = inject(SupabaseService); // Cambiar en prod

  recipes = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Modal & File States
  isModalOpen = signal<boolean>(false);
  selectedRecipe = signal<any>(null);
  isSaving = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  recipeForm = this.fb.group({
    title: ['', Validators.required],
    base_spirit: ['Ron Estancos', Validators.required],
    read_time: ['3 min', Validators.required],
    excerpt: ['', Validators.required],
    ingredients: ['', Validators.required],
    instructions: ['', Validators.required],
    is_active: [true]
  });

  ngOnInit() {
    this.loadRecipes();
  }

  async loadRecipes() {
    this.isLoading.set(true);
    try {
      const data = await this.crmService.getCocktailsAdmin();
      this.recipes.set(data);
    } catch (error) {
      console.error('Error cargando recetas', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openEditModal(recipe: any | null) {
    this.selectedRecipe.set(recipe);
    this.selectedFile.set(null);
    this.imagePreview.set(recipe ? recipe.image_url : null);

    if (recipe) {
      this.recipeForm.patchValue({
        title: recipe.title,
        base_spirit: recipe.base_spirit,
        read_time: recipe.read_time,
        excerpt: recipe.excerpt,
        // Convertimos los arrays a texto separado por saltos de línea para el textarea
        ingredients: recipe.ingredients ? recipe.ingredients.join('\n') : '',
        instructions: recipe.instructions ? recipe.instructions.join('\n') : '',
        is_active: recipe.is_active
      });
    } else {
      this.recipeForm.reset({ base_spirit: 'Ron Estancos', read_time: '3 min', is_active: true });
    }

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
    const control = this.recipeForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  async saveRecipe() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValues = this.recipeForm.value;

    try {
      let finalImageUrl = this.selectedRecipe() ? this.selectedRecipe().image_url : '';

      // 1. Subir imagen si hay un archivo nuevo
      if (this.selectedFile()) {
        finalImageUrl = await this.crmService.uploadCocktailImage(this.selectedFile()!);
      }

      // 2. Convertir los textos de textarea de vuelta a Arrays JSON
      const ingredientsArray = formValues.ingredients!.split('\n').map(i => i.trim()).filter(i => i !== '');
      const instructionsArray = formValues.instructions!.split('\n').map(i => i.trim()).filter(i => i !== '');

      // 3. Generar slug a partir del título
      const slug = formValues.title!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const recipeData = {
        title: formValues.title,
        slug: slug,
        base_spirit: formValues.base_spirit,
        read_time: formValues.read_time,
        excerpt: formValues.excerpt,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        is_active: formValues.is_active,
        image_url: finalImageUrl
      };

      if (this.selectedRecipe()) {
        // ACTUALIZAR
        await this.crmService.saveCocktailRecipe(recipeData, this.selectedRecipe().id);
        this.recipes.update(list => list.map(r => r.id === this.selectedRecipe().id ? { ...r, ...recipeData } : r));
      } else {
        // CREAR
        const newRecord = await this.crmService.saveCocktailRecipe(recipeData);
        this.recipes.update(list => [newRecord, ...list]);
      }

      this.closeModal();
    } catch (error) {
      console.error('Error guardando la receta:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteRecipe() {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta permanentemente?')) {
      try {
        await this.crmService.deleteCocktailRecipe(this.selectedRecipe().id);
        this.recipes.update(list => list.filter(r => r.id !== this.selectedRecipe().id));
        this.closeModal();
      } catch (error) {
        console.error('Error al eliminar', error);
      }
    }
  }
}
