import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Header } from './shared/header/header';
import { Footer } from "./shared/footer/footer";
import { Agegate } from "./shared/agegate/agegate";
import { isPlatformBrowser } from '@angular/common';

declare let gtag: Function;
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Agegate],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})


export class App implements OnInit {

    private router = inject(Router);
     private activatedRoute = inject(ActivatedRoute);
    private titleService = inject(Title);
    private metaService = inject(Meta);

    // Inyectamos el ID de la plataforma para solucionar el error de SSR
  private platformId = inject(PLATFORM_ID);

     // Creamos una Signal que sabrá si estamos en el administrador
  isAdminRoute = signal<boolean>(false);

  ngOnInit() {
    // Escuchamos los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      // 1. Verificamos si es ruta admin
      map((event: any) => {
        this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin'));
        return this.activatedRoute;
      }),
      // 2. Buscamos la información SEO en la ruta activa más profunda
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {

      // === ACTUALIZACIÓN DINÁMICA DE SEO ===

      // Actualizar descripción
      if (data['description']) {
        this.metaService.updateTag({ name: 'description', content: data['description'] });
        this.metaService.updateTag({ property: 'og:description', content: data['description'] });
      }

      // Actualizar imagen para compartir en redes
      if (data['ogImage']) {
        this.metaService.updateTag({ property: 'og:image', content: data['ogImage'] });
      }

      // Asegurarnos de que el título de redes (Open Graph) coincida con el de la pestaña
      this.metaService.updateTag({ property: 'og:title', content: this.titleService.getTitle() });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });

      // SOLUCIÓN SSR: Solo usamos 'window' si estamos en el navegador
      if (isPlatformBrowser(this.platformId)) {
        this.metaService.updateTag({ property: 'og:url', content: window.location.href });
      } else {
        // En el servidor, construimos la URL manualmente con tu dominio de GoDaddy
        this.metaService.updateTag({ property: 'og:url', content: 'https://estancosdistillingcompany.com' + this.router.url });
      }

      // SOLUCIÓN SSR: Solo usamos 'window' y 'gtag' si estamos en el navegador
      if (isPlatformBrowser(this.platformId)) {
        this.metaService.updateTag({ property: 'og:url', content: window.location.href });

        // --- NUEVO: RASTREO DINÁMICO DE GOOGLE ANALYTICS ---
        try {
          gtag('event', 'page_view', {
            page_path: this.router.url
          });
        } catch (e) {
          console.warn('Google Analytics no está cargado');
        }

      } else {
        // En el servidor, construimos la URL manualmente
        this.metaService.updateTag({ property: 'og:url', content: '[https://estancosdistillingcompany.com](https://estancosdistillingcompany.com)' + this.router.url });
      }


    });
  }
}

