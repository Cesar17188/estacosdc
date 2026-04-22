import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

interface KpiStats {
  totalSales: number;
  pendingOrders: number;
  newLeads: number;
  activeTours: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pendiente' | 'pagado' | 'enviado';
}

interface RecentLead {
  company: string;
  contactName: string;
  region: string;
  status: 'nuevo' | 'contactado';
  date: string;
}


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})

export class Dashboard implements OnInit{
  crmService = inject(SupabaseService);

  // Estados
  isLoading = signal<boolean>(true);
  stats = signal<KpiStats | null>(null);
  recentOrders = signal<RecentOrder[]>([]);
  recentLeads = signal<RecentLead[]>([]);

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      // Cargamos todas las promesas en paralelo para mayor rapidez
      const [statsData, ordersData, leadsData] = await Promise.all([
        this.crmService.getDashboardStats(),
        this.crmService.getRecentOrders(),
        this.crmService.getRecentLeads()
      ]);

      this.stats.set(statsData);
      this.recentOrders.set(ordersData);
      this.recentLeads.set(leadsData);
    } catch (error) {
      console.error('Error al cargar datos del Dashboard:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
