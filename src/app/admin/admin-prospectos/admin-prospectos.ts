import { Component, signal, OnInit, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-admin-prospectos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-prospectos.html',
  styleUrl: './admin-prospectos.scss',
})
export class AdminProspectos implements OnInit {
  private fb = inject(FormBuilder);
  crmService = inject(SupabaseService); // En tu app real: inject(SupabaseService)

  // Estados
  leads = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Estado Modal
  isModalOpen = signal<boolean>(false);
  selectedLead = signal<any>(null);
  isSaving = signal<boolean>(false);
  isConfirmingDelete = signal<boolean>(false); // Para no usar alertas de navegador

  leadForm = this.fb.group({
    platform: ['Instagram', Validators.required],
    handle: ['', Validators.required],
    profile_url: [''],
    status: ['Pendiente', Validators.required],
    notes: ['']
  });

  ngOnInit() { this.loadLeads(); }

  async loadLeads() {
    this.isLoading.set(true);
    try {
      const data = await this.crmService.getSocialProspects();
      this.leads.set(data);
    } catch (e) { console.error(e); }
    finally { this.isLoading.set(false); }
  }

  openEditModal(lead: any | null) {
    this.selectedLead.set(lead);
    this.isConfirmingDelete.set(false); // Reset al abrir

    if (lead) {
      this.leadForm.patchValue({
        platform: lead.platform, handle: lead.handle, profile_url: lead.profile_url,
        status: lead.status, notes: lead.notes
      });
    } else {
      this.leadForm.reset({ platform: 'Instagram', status: 'Pendiente' });
    }
    this.isModalOpen.set(true);
  }

  closeModal() { this.isModalOpen.set(false); }

  isInvalid(field: string): boolean {
    const control = this.leadForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  async saveLead() {
    if (this.leadForm.invalid) { this.leadForm.markAllAsTouched(); return; }
    this.isSaving.set(true);

    try {
      const formVals = this.leadForm.value;
      const dataToSave = {
        platform: formVals.platform, handle: formVals.handle, profile_url: formVals.profile_url,
        status: formVals.status, notes: formVals.notes
      };

      if (this.selectedLead()) {
        const updated = await this.crmService.saveSocialProspect(dataToSave, this.selectedLead().id);
        this.leads.update(list => list.map(l => l.id === this.selectedLead().id ? { ...l, ...updated } : l));
      } else {
        const newRecord = await this.crmService.saveSocialProspect(dataToSave);
        this.leads.update(list => [newRecord, ...list]);
      }
      this.closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      this.isSaving.set(false);
    }
  }

  confirmDelete() {
    this.isConfirmingDelete.set(true);
  }

  cancelDelete() {
    this.isConfirmingDelete.set(false);
  }

  async executeDelete() {
    if (!this.selectedLead()) return;
    try {
      await this.crmService.deleteSocialProspect(this.selectedLead().id);
      this.leads.update(list => list.filter(l => l.id !== this.selectedLead().id));
      this.closeModal();
    } catch (e) {
      console.error(e);
    }
  }

  getPlatformIcon(platform: string): string {
    switch(platform) {
      case 'Instagram': return 'fa-brands fa-instagram';
      case 'Facebook': return 'fa-brands fa-facebook-f';
      case 'TikTok': return 'fa-brands fa-tiktok';
      case 'Web': return 'fa-solid fa-globe';
      default: return 'fa-solid fa-link';
    }
  }

  getPlatformClass(platform: string): string {
    switch(platform) {
      case 'Instagram': return 'ig'; case 'Facebook': return 'fb';
      case 'TikTok': return 'tk'; case 'Web': return 'wb'; default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pendiente': return 'pending'; case 'Contactado': return 'contacted';
      case 'En Negociación': return 'negotiation'; case 'Aliado': return 'ally';
      case 'Descartado': return 'rejected'; default: return 'pending';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
