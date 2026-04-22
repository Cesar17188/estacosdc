import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminLogin } from './admin-login/admin-login';
import { Dashboard } from './dashboard/dashboard';
// import { DashboardComponent } from './dashboard/dashboard.component';

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
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      // { path: 'ventas', component: VentasComponent },
    ]
  }
];
