import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminLogin } from './admin-login/admin-login';
import { Dashboard } from './dashboard/dashboard';
import { Pedidos } from './pedidos/pedidos';
import { Catalogo } from './catalogo/catalogo';
import { Empresas } from './empresas/empresas';
import { Reservas } from './reservas/reservas';
import { authGuard } from '../guards/auth-guard'; // <-- IMPORTAMOS EL GUARD


export const ADMIN_ROUTES: Routes = [
  {
    // La pantalla de login NO usa el admin-layout (es pantalla completa)
    path: 'login',
    component: AdminLogin
  },
  {
    // Todas las demás pantallas SÍ usan el admin-layout (con el menú lateral)
    path: '',
    component: AdminLayout,
    canActivate: [authGuard], // <-- ¡MAGIA! Esto protege esta ruta y TODAS sus hijas
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',
        component: Dashboard,
        title: 'Admin Dashboard | Estancos',
        data: {
          description: 'Visión general de ventas, pedidos, clientes y estadísticas clave de Estancos Distilling Co.'
        }
      },
      { path: 'pedidos',
        component: Pedidos,
        title: 'Gestión de Pedidos | Estancos',
        data: {
          description: 'Consulta y gestiona todos los pedidos realizados por los clientes.'
        }
      },
      { path: 'catalogo',
        component: Catalogo,
        title: 'Gestión de Catálogo | Estancos',
        data: {
          description: 'Administra los productos disponibles en el catálogo de Estancos Distilling Co.'
        }
      },
      { path: 'empresas',
        component: Empresas,
        title: 'Gestión de Empresas | Estancos',
        data: {
          description: 'Consulta y gestiona la información de las empresas asociadas a Estancos Distilling Co.'
        }
      },
      { path: 'reservas',
        component: Reservas,
        title: 'Gestión de Reservas | Estancos',
        data: {
          description: 'Consulta y gestiona todas las reservas realizadas por los clientes.'
        }
      },
      // { path: 'ventas', component: VentasComponent },
    ]
  }
];
