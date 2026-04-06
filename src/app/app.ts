import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Hero } from './components/hero/hero';
import { History } from "./components/history/history";
import { Spirits } from "./components/spirits/spirits";
import { Features } from "./components/features/features";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, History, Spirits, Features],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('estacosdc');
}
