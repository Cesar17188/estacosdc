import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SpiritsPage } from './pages/spirits-page/spirits-page';
import { RommeliersPage } from './pages/rommeliers-page/rommeliers-page';
import { ContenidosPage } from './pages/contenidos-page/contenidos-page';
import { VisitasPage } from './pages/visitas-page/visitas-page';
import { TiendaPage } from './pages/tienda-page/tienda-page';
import { CartPage } from './pages/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout-page/checkout-page';


export const routes: Routes = [
   // 1. RUTA DEL CRM (AISLADA Y CON CARGA DIFERIDA)
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

    {
        path: '',
        component: Home,
        title: 'Ron y Whisky Artesanal de los Andes | Estancos Distilling Co.',
        data: {
          description: 'Descubre nuestros destilados premium madurados a 2500 msnm. Ron añejo y whisky andino elaborados con pasión y tradición en Ecuador.',
          ogImage: '[https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/hero.jpeg](https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/hero.jpeg)'
        }
    },
    {
        path: 'espiritus',
        component: SpiritsPage,
        title: 'Nuestra Colección de Espíritus | Estancos',
        data: {
          description: 'Explora las notas de cata y la historia detrás de nuestro ron y whisky. Destilados de clase mundial, moldeados por la altura.',
          ogImage: '[https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/espiritus/whiskey-60-ecommerce.jpeg](https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/espiritus/whiskey-60-ecommerce.jpeg)'
      }
    },
    {
        path: 'rommeliers',
        component: RommeliersPage,
        title: 'Nuestros Rommeliers | Fundadores y Maestros Destiladores de Estancos',
        data: {
          description: 'Conoce a los visionarios detrás de Estancos Distilling Co. Nuestros rommeliers combinan tradición y técnica para crear destilados excepcionales y sus procesos de creación.',
          ogImage: '[https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/RichardMaster.jpeg](https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/RichardMaster.jpeg)'
        }
    },
    {
        path: 'contenidos',
        component: ContenidosPage,
        title: 'Universo Estancos | Historias, Recetas y Cultura del Ron y Whisky',
        data: {
          description: 'Adéntrate en nuestra cultura. Descubre los momentos capturados, aprende a mezclar como un maestro, encuentra el maridaje perfecto y acompáñanos en nuestros próximos eventos exclusivos.',
          ogImage: '[https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/galleryImages/whiskyCentroH.jpeg](https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/galleryImages/whiskyCentroH.jpeg)'
        }
    },
    {
        path: 'visitas',
        component: VisitasPage,
        title: 'Enoturismo y Catas en Quito | Estancos Distilling Co.',
        data: {
          description: 'Reserva tu recorrido por nuestra destilería. Conoce la sala de alambiques, las bodegas y disfruta de una cata exclusiva de la barrica a la copa.',
          ogImage: '[https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/destileriaEcommerce.jpeg](https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/views/destileriaEcommerce.jpeg)'
    }
    },
    {
        path: 'tienda',
        component: TiendaPage,
        title: 'Boutique Online | Comprar Destilados Estancos',
        data: {
          description: 'Compra en línea nuestro Ron Añejo, Whisky Single Malt y accesorios. Envíos a todo el país directamente desde nuestra destilería.',
          ogImage: '[https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1777317752257-iaqtod14t6.jpeg](https://qgbwjkjgnyaynctlqxvq.supabase.co/storage/v1/object/public/product-images/1777317752257-iaqtod14t6.jpeg)'
        }
    },
    {
        path: 'cart',
        component: CartPage,
        title: 'Carrito de Compras | Estancos Distilling Co.',
        data: {
          description: 'Revisa los productos que has seleccionado para comprar. Actualiza tus cantidades o elimina artículos antes de proceder al checkout.'
        }
    },
    {
        path: 'checkout',
        component: CheckoutPage,
        title: 'Checkout | Estancos Distilling Co.',
        data: {
          description: 'Completa tu compra y proporciona los detalles de envío y pago.'
        }
    }
];
