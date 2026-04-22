import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class Catalogo implements OnInit{

  private fb = inject(FormBuilder);
  crmService = inject(SupabaseService);

  products = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Modal State
  isModalOpen = signal<boolean>(false);
  selectedProduct = signal<any>(null);
  isSaving = signal<boolean>(false);

  // Formulario
  productForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock_quantity: [0, [Validators.required, Validators.min(0)]],
    category: ['ron', Validators.required],
    is_active: [true]
  });

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.isLoading.set(true);
    try {
      const data = await this.crmService.getAllProducts();
      this.products.set(data);
    } catch (error) {
      console.error('Error cargando inventario', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // --- Lógica del Modal ---
  openEditModal(product: any | null) {
    this.selectedProduct.set(product);

    if (product) {
      // Editar existente
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category: product.category,
        is_active: product.is_active
      });
    } else {
      // Nuevo producto (Reset)
      this.productForm.reset({
        category: 'ron',
        price: 0,
        stock_quantity: 0,
        is_active: true
      });
    }

    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  isInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  async saveProduct() {
    if (this.productForm.invalid) return;

    this.isSaving.set(true);
    const formValues = this.productForm.value;

    try {
      if (this.selectedProduct()) {
        // ACTUALIZAR (Simulado)
        await this.crmService.updateProduct(this.selectedProduct().id, formValues);
        // Actualizar UI localmente
        this.products.update(list => list.map(p => p.id === this.selectedProduct().id ? { ...p, ...formValues } : p));
      } else {
        // CREAR NUEVO (Simulado)
        // En tu app real, Supabase generará el ID y el Slug automáticamente.
        const newProduct = {
          id: Math.random().toString(),
          slug: formValues.name?.toLowerCase().replace(/ /g, '-'),
          image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=200',
          ...formValues
        };
        this.products.update(list => [newProduct, ...list]);
      }

      this.closeModal();
    } catch (error) {
      console.error('Error guardando:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  // --- Utilidades Visuales ---
  getStockClass(qty: number): string {
    if (qty === 0) return 'stock-out';
    if (qty < 15) return 'stock-low';
    return 'stock-high';
  }
}
