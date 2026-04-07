import { Component } from '@angular/core';
import {  RommelierCard } from '../../components/rommelier-card/rommelier-card';

@Component({
  selector: 'app-rommeliers-page',
  imports: [ RommelierCard ],
  templateUrl: './rommeliers-page.html',
  styleUrl: './rommeliers-page.scss',
})
export class RommeliersPage {}
