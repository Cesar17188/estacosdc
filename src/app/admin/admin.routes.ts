import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminLogin } from './admin-login/admin-login';
import { Dashboard } from './dashboard/dashboard';
import { Pedidos } from './pedidos/pedidos';
import { Catalogo } from './catalogo/catalogo';
import { Empresas } from './empresas/empresas';
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
      { path: 'dashboard', component: Dashboard },
      { path: 'pedidos', component: Pedidos },
      { path: 'catalogo', component: Catalogo },
      { path: 'empresas', component: Empresas },
      // { path: 'ventas', component: VentasComponent },
    ]
  }
];
