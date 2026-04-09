import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from "./shared/footer/footer";
import { CartSidebar } from "./shared/cart-sidebar/cart-sidebar";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CartSidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('estacosdc');
}
