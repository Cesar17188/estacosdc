import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiendaPage } from './tienda-page';
import { CartService } from '../../services/cart';
import { SupabaseService } from '../../services/supabase';
import { vi } from 'vitest';

describe('TiendaPage', () => {
  let component: TiendaPage;
  let fixture: ComponentFixture<TiendaPage>;
  let mockCartService: any;
  let mockSupabaseService: any;

  beforeEach(async () => {
    mockCartService = {
      addToCart: vi.fn()
    };
    mockSupabaseService = {
      getActiveProducts: vi.fn().mockResolvedValue([])
    };

    await TestBed.configureTestingModule({
      imports: [TiendaPage],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TiendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addToCart', () => {
    it('should use regular price if discount_price is not provided', () => {
      const product = {
        id: '1',
        name: 'Ron Reserva',
        category: 'ron' as const,
        price: 100,
        image_url: 'url',
        stock_quantity: 10
      };

      component.showToast = vi.fn();

      component.addToCart(product);

      expect(mockCartService.addToCart).toHaveBeenCalledWith({
        ...product,
        price: 100
      });
      expect(component.showToast).toHaveBeenCalledWith('Se añadió Ron Reserva a tu carrito por $100.');
    });

    it('should use discount_price if it is greater than 0', () => {
      const product = {
        id: '2',
        name: 'Whisky Añejo',
        category: 'whisky' as const,
        price: 150,
        discount_price: 120,
        image_url: 'url',
        stock_quantity: 5
      };

      component.showToast = vi.fn();

      component.addToCart(product);

      expect(mockCartService.addToCart).toHaveBeenCalledWith({
        ...product,
        price: 120
      });
      expect(component.showToast).toHaveBeenCalledWith('Se añadió Whisky Añejo a tu carrito por $120.');
    });

    it('should use regular price if discount_price is 0', () => {
      const product = {
        id: '3',
        name: 'Copa',
        category: 'accesorios' as const,
        price: 25,
        discount_price: 0,
        image_url: 'url',
        stock_quantity: 50
      };

      component.showToast = vi.fn();

      component.addToCart(product);

      expect(mockCartService.addToCart).toHaveBeenCalledWith({
        ...product,
        price: 25
      });
      expect(component.showToast).toHaveBeenCalledWith('Se añadió Copa a tu carrito por $25.');
    });
  });
});
