import { Component, signal, OnInit, inject} from '@angular/core';
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

  // Estados para la Imagen
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  isSaving = signal<boolean>(false);

  // Formulario
  productForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
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
      // Editar existente
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
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

  async saveProduct() {
    if (this.productForm.invalid) return;

    this.isSaving.set(true);

    try {
      let finalImageUrl = this.productForm.value.image_url;

      // 1. Si el usuario seleccionó un archivo físico, lo subimos primero
      if (this.selectedFile()) {
        finalImageUrl = await this.crmService.uploadProductImage(this.selectedFile()!);
      }

      // 2. Preparamos los datos completos
      const productData = {
        name: this.productForm.value.name,
        price: this.productForm.value.price,
        stock_quantity: this.productForm.value.stock_quantity,
        category: this.productForm.value.category,
        is_active: this.productForm.value.is_active,
        image_url: finalImageUrl
      };

      if (this.selectedProduct()) {
        // Simular Actualización
        await this.crmService.updateProduct(this.selectedProduct().id, productData);
        this.products.update(list => list.map(p => p.id === this.selectedProduct().id ? { ...p, ...productData } : p));
      } else {
        // Simular Creación
        const newProduct = {
          id: Math.random().toString().substring(2, 8),
          slug: productData.name?.toLowerCase().replace(/ /g, '-'),
          ...productData
        };
        this.products.update(list => [newProduct, ...list]);
      }

      this.closeModal();
    } catch (error) {
      console.error('Error guardando el producto:', error);
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
