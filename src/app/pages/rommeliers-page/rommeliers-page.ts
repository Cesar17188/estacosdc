import { Component } from '@angular/core';
import {  RommelierCard } from '../../components/rommelier-card/rommelier-card';
import { Procesos } from '../../components/procesos/procesos';

@Component({
  selector: 'app-rommeliers-page',
  imports: [ RommelierCard, Procesos ],
  templateUrl: './rommeliers-page.html',
  styleUrl: './rommeliers-page.scss',
})
export class RommeliersPage {}
