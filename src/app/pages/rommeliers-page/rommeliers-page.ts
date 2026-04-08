import { Component } from '@angular/core';
import {  RommelierCard } from '../../components/rommelier-card/rommelier-card';
import { Procesos } from '../../components/procesos/procesos';
import { Premios } from '../../components/premios/premios';

@Component({
  selector: 'app-rommeliers-page',
  imports: [ RommelierCard, Procesos, Premios ],
  templateUrl: './rommeliers-page.html',
  styleUrl: './rommeliers-page.scss',
})
export class RommeliersPage {}
