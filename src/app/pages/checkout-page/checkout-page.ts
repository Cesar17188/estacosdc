import { Component, signal, computed, inject, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../services/cart';
import { SupabaseService } from '../../services/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, ReactiveFormsModule, ],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage implements OnInit{
  cartService = inject(CartService);
  supabaseService = inject(SupabaseService);
  private fb = inject(FormBuilder);

  constructor(private router: Router){}

  // Estados
  orderConfirmed = signal<boolean>(false);
  orderTotal = signal<number>(0);
  isSubmitting = signal<boolean>(false);

  // Número de WhatsApp del vendedor de Estancos (código país + número, sin +, espacios o guiones)
  private sellerPhone = '+593998581721'; // Cambia esto por tu número real

  // Link dinámico generado para WhatsApp
  whatsappLink = signal<string>('https://api.whatsapp.com/message/24YUXEDTXLLSK1?autoload=1&app_absent=0');

  // Formulario reactivo
  checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    sector: ['', Validators.required],
    address: ['', Validators.required]
  });

  ngOnInit() {
    // Usamos setTimeout para evitar el ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      // Redirigir a /tienda si el carrito está vacío al entrar a la página
      if (this.cartService.cartItems().length === 0) {
        // En producción usarías: this.router.navigate(['/tienda']);
        this.router.navigate(['/tienda']);
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.checkoutForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  async confirmOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    // Bloqueamos la interfaz mientras guardamos
    this.isSubmitting.set(true);

    // 1. Guardamos el total estático (por si luego borramos el carrito)
    const total = this.cartService.cartTotal();
    this.orderTotal.set(total);

    // 2. Extraemos los datos del formulario
    const form = this.checkoutForm.value;

    try {
      // 3. Guardar la orden en Supabase (tabla 'orders') con estado 'pendiente'
      // En producción, llamarás a tu método real `await this.supabaseService.createOrder(...)`
      await this.supabaseService.createOrder(form, this.cartService.cartItems(), total);

      // 4. Generamos el texto estructurado para WhatsApp
      let message = `¡Hola Estancos! 🥃\nAcabo de confirmar un pedido en la web.\n\n`;
      message += `*Datos del Cliente:*\n`;
      message += `Nombre: ${form.fullName}\n`;
      message += `Teléfono: ${form.phone}\n`;
      message += `Dirección: ${form.address}, ${form.sector}, ${form.city}\n\n`;

      message += `*Resumen del Pedido:*\n`;
      this.cartService.cartItems().forEach(item => {
        message += `- ${item.quantity}x ${item.name}\n`;
      });
      message += `\n*Total a pagar:* $${total.toFixed(2)}\n\n`;
      message += `Por favor, ayúdenme a coordinar el envío. ¡Aquí adjunto el comprobante de transferencia!`;

      // 5. Codificamos el URL
      const encodedMessage = encodeURIComponent(message);
      this.whatsappLink.set(`https://wa.me/${this.sellerPhone}?text=${encodedMessage}`);

      // 6. Cambiamos la vista a "Éxito"
      this.orderConfirmed.set(true);

      // Opcional: podrías descomentar esta línea para vaciar el carrito
      // automáticamente cuando la orden ha sido registrada exitosamente.
      // this.cartService.clearCart();

    } catch (error) {
      console.error('Error al guardar el pedido en la base de datos:', error);
      alert('Hubo un problema al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      // Liberamos la interfaz
      this.isSubmitting.set(false);
    }
  }
}
