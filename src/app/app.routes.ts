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
        component: Home
    },
    {
        path: 'espiritus',
        component: SpiritsPage
    },
    {
        path: 'rommeliers',
        component: RommeliersPage
    },
    {
        path: 'contenidos',
        component: ContenidosPage
    },
    {
        path: 'visitas',
        component: VisitasPage
    },
    {
        path: 'tienda',
        component: TiendaPage
    },
    {
        path: 'cart',
        component: CartPage
    },
    {
        path: 'checkout',
        component: CheckoutPage
    }
];
