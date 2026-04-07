import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SpiritsPage } from './pages/spirits-page/spirits-page';
import { RommeliersPage } from './pages/rommeliers-page/rommeliers-page';

export const routes: Routes = [
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
    }
];
