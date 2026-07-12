import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule],
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
  
  startDate = signal<string>(this.getDefaultStartDate());
  endDate = signal<string>(this.getDefaultEndDate());

  getDefaultStartDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  }

  getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      // Cargamos todas las promesas en paralelo para mayor rapidez
      const [statsData, ordersData, leadsData] = await Promise.all([
        this.crmService.getDashboardStats(this.startDate(), this.endDate()),
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

  async onDateChange() {
    this.isLoading.set(true);
    try {
      const statsData = await this.crmService.getDashboardStats(this.startDate(), this.endDate());
      this.stats.set(statsData);
    } catch (error) {
      console.error('Error al actualizar stats:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.startDate.set(input.value);
    this.onDateChange();
  }

  onEndDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.endDate.set(input.value);
    this.onDateChange();
  }
}
