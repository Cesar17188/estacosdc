import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SpiritsPage } from './pages/spirits-page/spirits-page';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'espiritus',
        component: SpiritsPage
    }
];
