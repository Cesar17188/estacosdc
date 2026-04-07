import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { History } from '../../components/history/history';
import { Spirits } from '../../components/spirits/spirits';
import { Features } from '../../components/features/features';
import { Distributors } from '../../components/distributors/distributors';
import { Visit } from '../../components/visit/visit';


@Component({
  selector: 'app-home',
  imports: [Hero, History, Spirits, Features, Distributors, Visit],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
