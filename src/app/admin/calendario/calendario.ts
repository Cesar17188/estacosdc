import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { SupabaseService } from '../../services/supabase';
import { Dialog } from '../../components/dialog/dialog';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, Dialog],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss',
})
export class Calendario implements OnInit {
  crmService = inject(SupabaseService);

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: esLocale,
    customButtons: {
      addEventButton: {
        text: 'Nuevo Evento',
        click: this.handleCustomCreateEvent.bind(this)
      }
    },
    headerToolbar: {
      left: 'prev,next today addEventButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    expandRows: true,
    height: 'auto',
    events: [],
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  });

  eventCategories = [
    'fermentación de Whisky',
    'fermentación de Ron',
    'fermentación de Whiskey',
    'Destilación de Whisky',
    'destilación de Ron',
    'destilación de Whiskey',
    'Embotellado',
    'Apertura de Barril',
    'Lanzamiento',
    'Activación',
    'Cata fuera de la destilería',
    'Cata Dentro de la destilería',
    'Coctelería fuera de la destilería',
    'Coctelería dentro de la destilería',
    'Feria',
    'Degustación',
    'Presentación',
    'Reunión administrativa',
    'Reunión Emergente',
    'Reunión normal'
  ];

  categoryColors: Record<string, string> = {
    'fermentación de Whisky': '#d97706',
    'fermentación de Ron': '#b45309',
    'fermentación de Whiskey': '#f59e0b',
    'Destilación de Whisky': '#2563eb',
    'destilación de Ron': '#1d4ed8',
    'destilación de Whiskey': '#3b82f6',
    'Embotellado': '#7c3aed',
    'Apertura de Barril': '#6d28d9',
    'Lanzamiento': '#e11d48',
    'Activación': '#be123c',
    'Cata fuera de la destilería': '#059669',
    'Cata Dentro de la destilería': '#047857',
    'Coctelería fuera de la destilería': '#0d9488',
    'Coctelería dentro de la destilería': '#0f766e',
    'Feria': '#db2777',
    'Degustación': '#ca8a04',
    'Presentación': '#a16207',
    'Reunión administrativa': '#475569',
    'Reunión Emergente': '#dc2626',
    'Reunión normal': '#64748b'
  };

  currentEvents = signal<any[]>([]);

  // Estado del Panel (Formulario Slide Over)
  isPanelOpen = signal<boolean>(false);
  panelMode = signal<'create' | 'edit'>('create');
  eventForm = signal<any>({ id: '', title: '', category: '', start: '', end: '', allDay: false, attendees: '' });
  selectedCalendarApi: any = null;

  // Estado del Dialog (Toast)
  dialogMessage = signal<string | null>(null);
  dialogType = signal<'success' | 'error'>('success');

  // Estado de Confirmación (Modal)
  isConfirmOpen = signal<boolean>(false);
  confirmMessage = signal<string>('');
  pendingDeleteEvent: any = null;

  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    const rawEvents = await this.crmService.getCalendarEvents('Estancos-operaciones');
    
    const coloredEvents = rawEvents.map((evt: any) => {
      let color = '#cda75a'; // Color por defecto (oro)
      const match = evt.title?.match(/^\[(.*?)\]/);
      if (match && this.categoryColors[match[1]]) {
        color = this.categoryColors[match[1]];
      }
      return {
        ...evt,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff'
      };
    });

    this.calendarOptions.update(options => ({
      ...options,
      events: coloredEvents
    }));
  }

  private formatDatetimeLocal(dateInfo: Date): string {
    const d = new Date(dateInfo);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  private formatDate(dateInfo: Date): string {
    const d = new Date(dateInfo);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  handleCustomCreateEvent() {
    const now = new Date();
    // Redondear a la siguiente hora
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    const end = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora después
    
    this.panelMode.set('create');
    this.eventForm.set({
      id: '',
      title: '',
      category: '',
      start: this.formatDatetimeLocal(now),
      end: this.formatDatetimeLocal(end),
      allDay: false,
      attendees: ''
    });
    this.isPanelOpen.set(true);
  }

  handleDateSelect(selectInfo: any) {
    this.selectedCalendarApi = selectInfo.view.calendar;
    this.selectedCalendarApi.unselect(); // Limpiar la selección visual

    const startVal = selectInfo.allDay ? this.formatDate(selectInfo.start) : this.formatDatetimeLocal(selectInfo.start);
    const endVal = selectInfo.allDay && selectInfo.end ? this.formatDate(selectInfo.end) : (selectInfo.end ? this.formatDatetimeLocal(selectInfo.end) : startVal);

    // Abrir el panel lateral en modo creación
    this.panelMode.set('create');
    this.eventForm.set({
      id: '',
      title: '',
      category: '',
      start: startVal,
      end: endVal,
      allDay: selectInfo.allDay,
      attendees: ''
    });
    this.isPanelOpen.set(true);
  }

  onAllDayChange(isAllDay: boolean) {
    const form = this.eventForm();
    let startVal = form.start;
    let endVal = form.end;

    if (isAllDay) {
        if (startVal && startVal.includes('T')) startVal = startVal.split('T')[0];
        if (endVal && endVal.includes('T')) endVal = endVal.split('T')[0];
    } else {
        if (startVal && !startVal.includes('T')) startVal = `${startVal}T08:00`;
        if (endVal && !endVal.includes('T')) endVal = `${endVal}T09:00`;
    }

    this.eventForm.update((f: any) => ({ ...f, allDay: isAllDay, start: startVal, end: endVal }));
  }

  async saveEvent() {
    const formData = this.eventForm();
    if (!formData.title || formData.title.trim() === '') {
      this.showDialog('El título del evento es obligatorio.', 'error');
      return;
    }

    if (!formData.category) {
      this.showDialog('La categoría del evento es obligatoria.', 'error');
      return;
    }

    this.isPanelOpen.set(false);

    if (this.panelMode() === 'create') {
      let startIso = formData.start;
      let endIso = formData.end;
      
      if (!formData.allDay) {
        startIso = new Date(formData.start).toISOString();
        if (formData.end) {
            endIso = new Date(formData.end).toISOString();
        }
      }

      const finalTitle = `[${formData.category}] ${formData.title}`;

      const newEventData = {
        title: finalTitle,
        start: startIso,
        end: endIso,
        allDay: formData.allDay,
        attendees: formData.attendees ? formData.attendees.split(',').map((e: string) => e.trim()) : []
      };

      const catColor = this.categoryColors[formData.category] || '#cda75a';

      // Mostrar en la UI inmediatamente (optimista)
      if (this.selectedCalendarApi) {
        this.selectedCalendarApi.addEvent({
          id: String(Date.now()), // ID temporal
          title: finalTitle,
          start: formData.start,
          end: formData.end,
          allDay: formData.allDay,
          backgroundColor: catColor,
          borderColor: catColor,
          textColor: '#ffffff',
          extendedProps: { attendees: newEventData.attendees }
        });
      }

      try {
        await this.crmService.createCalendarEvent('Estancos-operaciones', newEventData);
        this.showDialog('Evento creado exitosamente.', 'success');
        await this.loadEvents();
      } catch (error) {
        console.error('Error al guardar el evento', error);
        this.showDialog('Hubo un error al sincronizar con Google Calendar.', 'error');
      }
    } else if (this.panelMode() === 'edit') {
      let startIso = formData.start;
      let endIso = formData.end;
      
      if (!formData.allDay) {
        startIso = new Date(formData.start).toISOString();
        if (formData.end) {
            endIso = new Date(formData.end).toISOString();
        }
      }

      const finalTitle = `[${formData.category}] ${formData.title}`;

      const updatedEventData = {
        title: finalTitle,
        start: startIso,
        end: endIso,
        allDay: formData.allDay,
        attendees: formData.attendees ? formData.attendees.split(',').map((e: string) => e.trim()) : []
      };

      const catColor = this.categoryColors[formData.category] || '#cda75a';

      if (this.pendingDeleteEvent) {
        this.pendingDeleteEvent.setProp('title', finalTitle);
        this.pendingDeleteEvent.setAllDay(formData.allDay);
        this.pendingDeleteEvent.setDates(formData.start, formData.end);
        this.pendingDeleteEvent.setProp('backgroundColor', catColor);
        this.pendingDeleteEvent.setProp('borderColor', catColor);
        this.pendingDeleteEvent.setProp('textColor', '#ffffff');
        this.pendingDeleteEvent.setExtendedProp('attendees', updatedEventData.attendees);
      }

      try {
        await this.crmService.updateCalendarEvent('Estancos-operaciones', formData.id, updatedEventData);
        this.showDialog('Evento actualizado exitosamente.', 'success');
        await this.loadEvents();
      } catch (error) {
        console.error('Error al actualizar el evento', error);
        this.showDialog('Hubo un error al actualizar en Google Calendar.', 'error');
      }
    }
  }

  handleEventClick(clickInfo: any) {
    // En lugar de confirm(), abrimos un modal personalizado o el panel lateral
    // Para simplificar y seguir el flujo del usuario, abriremos el modal de confirmación directamente
    // O abrimos el panel lateral con la info del evento y un botón de "Eliminar".
    // Haremos lo del panel lateral para mostrar los detalles.

    this.panelMode.set('edit');
    
    let rawTitle = clickInfo.event.title || '';
    let parsedCategory = '';
    let parsedTitle = rawTitle;
    
    const categoryMatch = rawTitle.match(/^\[(.*?)\]\s*(.*)$/);
    if (categoryMatch) {
        parsedCategory = categoryMatch[1];
        parsedTitle = categoryMatch[2];
    }

    const startVal = clickInfo.event.allDay ? (clickInfo.event.start ? this.formatDate(clickInfo.event.start) : '') : (clickInfo.event.start ? this.formatDatetimeLocal(clickInfo.event.start) : '');
    const endVal = clickInfo.event.allDay ? (clickInfo.event.end ? this.formatDate(clickInfo.event.end) : '') : (clickInfo.event.end ? this.formatDatetimeLocal(clickInfo.event.end) : '');

    const attendeesStr = clickInfo.event.extendedProps?.attendees 
      ? clickInfo.event.extendedProps.attendees.join(', ')
      : '';

    this.eventForm.set({
      id: clickInfo.event.id || clickInfo.event.extendedProps?.googleEventId,
      title: parsedTitle,
      category: parsedCategory,
      start: startVal,
      end: endVal,
      allDay: clickInfo.event.allDay,
      attendees: attendeesStr
    });
    this.pendingDeleteEvent = clickInfo.event;
    this.isPanelOpen.set(true);
  }

  askDeleteConfirmation() {
    this.isPanelOpen.set(false);
    this.confirmMessage.set(`¿Estás seguro de que quieres eliminar el evento '${this.pendingDeleteEvent.title}'?`);
    this.isConfirmOpen.set(true);
  }

  closeConfirm() {
    this.isConfirmOpen.set(false);
    this.pendingDeleteEvent = null;
  }

  async confirmDelete() {
    this.isConfirmOpen.set(false);
    const eventObj = this.pendingDeleteEvent;
    if (!eventObj) return;

    const eventId = eventObj.id || eventObj.extendedProps?.googleEventId;
    eventObj.remove(); // Borrado optimista de la UI

    if (eventId) {
      try {
        await this.crmService.deleteCalendarEvent('Estancos-operaciones', eventId);
        this.showDialog('Evento eliminado exitosamente.', 'success');
        await this.loadEvents();
      } catch (error) {
        console.error('Error al borrar el evento', error);
        this.showDialog('Hubo un error al eliminar el evento de Google Calendar.', 'error');
      }
    } else {
      this.showDialog('Evento temporal eliminado (no estaba sincronizado aún).', 'success');
    }
    this.pendingDeleteEvent = null;
  }

  closePanel() {
    this.isPanelOpen.set(false);
    this.pendingDeleteEvent = null;
  }

  showDialog(message: string, type: 'success' | 'error') {
    this.dialogMessage.set(message);
    this.dialogType.set(type);
  }

  closeDialog() {
    this.dialogMessage.set(null);
  }

  handleEvents(events: any) {
    this.currentEvents.set(events);
  }
}


