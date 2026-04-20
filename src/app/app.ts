import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  protected readonly title = signal('estacosdc');
}
