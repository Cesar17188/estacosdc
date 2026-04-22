import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './shared/header/header';
import { Footer } from "./shared/footer/footer";
import { Agegate } from "./shared/agegate/agegate";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Agegate],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
    private router = inject(Router);

     // Creamos una Signal que sabrá si estamos en el administrador
  isAdminRoute = signal<boolean>(false);

  constructor() {
    // Escuchamos cada vez que el usuario cambia de página
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL empieza con '/admin', isAdminRoute se vuelve true
      this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin'));
    });
  }
}
