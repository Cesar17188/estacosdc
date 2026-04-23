import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';


@Component({
  selector: 'app-empresas',
  imports: [CommonModule],
  templateUrl: './empresas.html',
  styleUrl: './empresas.scss',
})
export class Empresas implements OnInit{
  crmService = inject(SupabaseService);

  // Estados
  leads = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Panel State
  isPanelOpen = signal<boolean>(false);
  selectedLead = signal<any>(null);
  isUpdating = signal<boolean>(false);

  ngOnInit() {
    this.loadLeads();
  }

  async loadLeads() {
    this.isLoading.set(true);
    try {
      const data = await this.crmService.getAllLeads();
      this.leads.set(data);
    } catch (error) {
      console.error('Error', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openLeadDetails(lead: any) {
    this.selectedLead.set(lead);
    this.isPanelOpen.set(true);
  }

  closePanel() {
    this.isPanelOpen.set(false);
    setTimeout(() => {
      this.selectedLead.set(null);
    }, 400); // Esperar animación CSS
  }

  async updateStatus(newStatus: string) {
    if (!this.selectedLead() || this.selectedLead().status === newStatus) return;

    this.isUpdating.set(true);
    try {
      await this.crmService.updateLeadStatus(this.selectedLead().id, newStatus);

      // Actualización reactiva local
      this.selectedLead.update((l: any) => ({ ...l, status: newStatus }));
      this.leads.update(list => list.map(l => l.id === this.selectedLead().id ? { ...l, status: newStatus } : l));

    } catch (error) {
      console.error('Error', error);
    } finally {
      this.isUpdating.set(false);
    }
  }

  // Utilidades para la UI
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'nuevo': 'Nuevo',
      'contactado': 'Contactado',
      'en_evaluacion': 'En Evaluación',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado'
    };
    return statusMap[status] || status;
  }
}
