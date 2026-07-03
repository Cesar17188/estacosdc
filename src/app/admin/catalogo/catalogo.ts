import { Component, signal, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

import { Dialog } from '../../components/dialog/dialog';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Dialog],
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

  // Estados para la Imagen
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  isSaving = signal<boolean>(false);

  // Dialog State
  dialogMessage = signal<string | null>(null);
  dialogType = signal<'success' | 'error'>('success');
  
  closeDialog() {
    this.dialogMessage.set(null);
  }

  // Formulario
  productForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    has_discount: [false], // Interruptor virtual (no se guarda directo en BD)
    discount_price: [null as number | null],
    stock_quantity: [0, [Validators.required, Validators.min(0)]],
    category: ['ron', Validators.required],
    is_active: [true],
    image_url: ['']
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

  // --- Lógica de la Imagen ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      // Creamos una URL temporal para mostrar la vista previa al instante
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  // --- Lógica del Modal ---
  openEditModal(product: any | null) {
    this.selectedProduct.set(product);

    // Reseteamos estados de la imagen
    this.selectedFile.set(null);
    this.imagePreview.set(product ? product.image_url : null);

    if (product) {

      // Configuramos el switch basado en si el producto tiene o no un discount_price
      const hasDiscount = product.discount_price !== null && product.discount_price > 0;
      // Editar existente
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        has_discount: hasDiscount,
        discount_price: product.discount_price,
        stock_quantity: product.stock_quantity,
        category: product.category,
        is_active: product.is_active,
        image_url: product.image_url
      });
    } else {
      // Nuevo producto (Reset)
      this.productForm.reset({
        category: 'ron',
        price: 0,
        has_discount: false,
        discount_price: null,
        stock_quantity: 0,
        is_active: true,
        image_url: ''
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

  // --- Guardar Producto con Imagen ---
  async saveProduct() {
    if (this.productForm.invalid) return;

    this.isSaving.set(true);

    try {
      const formValues = this.productForm.value;
      let finalImageUrl = formValues.image_url;

      // 1. Si el usuario seleccionó un archivo físico, lo subimos primero
      if (this.selectedFile()) {
        finalImageUrl = await this.crmService.uploadProductImage(this.selectedFile()!);
      }

      // 2. Preparamos los datos completos
      const productData = {
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        discount_price: formValues.has_discount ? formValues.discount_price : null,
        stock_quantity: this.productForm.value.stock_quantity,
        category: this.productForm.value.category,
        is_active: this.productForm.value.is_active,
        image_url: finalImageUrl
      };

      if (this.selectedProduct()) {
        // ACTUALIZAR EXISTENTE
        await this.crmService.updateProduct(this.selectedProduct().id, productData);
        this.products.update(list => list.map(p => p.id === this.selectedProduct().id ? { ...p, ...productData } : p));
      } else {
       const newProduct = {
          id: Math.random().toString().substring(2, 8),
          slug: productData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          ...productData
        };
        this.products.update(list => [newProduct, ...list]);
      }

      this.closeModal();
    } catch (error) {
      console.error('Error guardando el producto:', error);
      this.dialogType.set('error');
      this.dialogMessage.set('Hubo un error guardando el producto. Por favor, intenta de nuevo.');
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
