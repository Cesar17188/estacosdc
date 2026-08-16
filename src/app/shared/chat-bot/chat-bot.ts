import { Component, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

export interface ChatAction {
  label: string;
  actionType: 'navigate' | 'query' | 'whatsapp' | 'call';
  payload?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actions?: ChatAction[];
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.scss',
})
export class ChatBot implements AfterViewChecked {
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;

  isOpen = signal<boolean>(false);
  hasUnread = signal<boolean>(true);
  isTyping = signal<boolean>(false);
  userInput = signal<string>('');

  private sellerPhone = '593998581721';
  private shouldScrollBottom = false;

  // Sugerencias rápidas iniciales
  quickSuggestions = [
    { label: '🥃 Destilados & Precios', query: '¿Qué licores tienen y qué precios tienen?' },
    { label: '🎟️ Reservar Visita / Cata', query: '¿Cómo puedo reservar un tour o cata en la destilería?' },
    { label: '📦 Rastrear mi Pedido', query: 'Quiero consultar el estado de mi pedido' },
    { label: '🍹 Recetas de Cocteles', query: '¿Qué recetas de cocteles tienen?' },
    { label: '🚚 Envíos y Pagos', query: '¿Cómo son las formas de pago y tiempos de entrega?' },
    { label: '💬 Asesor en WhatsApp', query: 'Deseo hablar con un asesor humano en WhatsApp' }
  ];

  messages = signal<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: '¡Hola! 🥃 Bienvenido a **Estancos Destilería Clandestina**.\n\nSoy tu asistente virtual. ¿En qué puedo asesorarte hoy con nuestros destilados de autor o visitas?',
      time: this.getCurrentTime(),
      actions: [
        { label: '🥃 Ver Catálogo', actionType: 'navigate', payload: '/tienda' },
        { label: '🎟️ Reservar Experiencia', actionType: 'navigate', payload: '/visitas' },
        { label: '💬 WhatsApp Directo', actionType: 'whatsapp', payload: '¡Hola Estancos! Deseo atención personalizada.' }
      ]
    }
  ]);

  ngAfterViewChecked() {
    if (this.shouldScrollBottom) {
      this.scrollToBottom();
      this.shouldScrollBottom = false;
    }
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.hasUnread.set(false);
      this.shouldScrollBottom = true;
    }
  }

  closeChat() {
    this.isOpen.set(false);
  }

  private getCurrentTime(): string {
    const d = new Date();
    return d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Ignorar si no está listo
    }
  }

  onEnterPress(event: Event) {
    event.preventDefault();
    this.sendMessage();
  }

  handleQuickSuggestion(query: string) {
    this.processUserQuery(query);
  }

  handleAction(action: ChatAction) {
    if (action.actionType === 'navigate' && action.payload) {
      this.router.navigate([action.payload]);
      // En móviles cerramos el chat para ver la página
      if (window.innerWidth < 768) {
        this.closeChat();
      }
    } else if (action.actionType === 'whatsapp') {
      const msg = encodeURIComponent(action.payload || '¡Hola Estancos! Deseo información.');
      window.open(`https://wa.me/${this.sellerPhone}?text=${msg}`, '_blank');
    } else if (action.actionType === 'query' && action.payload) {
      this.processUserQuery(action.payload);
    }
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;

    this.processUserQuery(text);
    this.userInput.set('');
  }

  private async processUserQuery(text: string) {
    // 1. Agregar mensaje del usuario
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      time: this.getCurrentTime()
    };

    this.messages.update(prev => [...prev, userMsg]);
    this.shouldScrollBottom = true;
    this.isTyping.set(true);

    // 2. Simular tiempo de escritura realista (600ms - 900ms)
    setTimeout(async () => {
      const botResponse = await this.generateBotResponse(text);
      this.isTyping.set(false);
      this.messages.update(prev => [...prev, botResponse]);
      this.shouldScrollBottom = true;
    }, 750);
  }

  private async generateBotResponse(input: string): Promise<ChatMessage> {
    const query = input.toLowerCase().trim();
    const time = this.getCurrentTime();

    // 1. VERIFICAR SI EL USUARIO ESTÁ CONSULTANDO UN PEDIDO (ID, "ORD-", o código alfanumérico)
    const orderMatch = query.match(/ord-([a-z0-9-]+)/i) || (query.length >= 6 && query.match(/([a-f0-9-]{6,})/i));
    if (orderMatch || query.includes('pedido') || query.includes('rastrear') || query.includes('orden') || query.includes('comprobante')) {
      const candidateCode = orderMatch ? orderMatch[0] : null;

      if (candidateCode) {
        const orderData = await this.supabaseService.getPublicOrderStatus(candidateCode);
        if (orderData) {
          const statusLabels: Record<string, string> = {
            pendiente: '🟡 Pendiente (En espera de verificación de pago)',
            pagado: '🟢 Pagado / Aprobado (Preparando en destilería)',
            procesando: '🟣 Procesando en Destilería',
            enviado: '🔵 Enviado (En camino a tu dirección)',
            entregado: '✨ Entregado con éxito',
            cancelado: '🔴 Cancelado'
          };

          const statusText = statusLabels[orderData.status] || `Estado: ${orderData.status}`;
          const clientName = orderData.billing_razon_social || orderData.shipping_address?.fullName || 'Cliente';

          return {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `📦 **Información de tu Pedido:**\n\n• **ID:** \`ORD-${orderData.id.split('-')[0].toUpperCase()}\`\n• **Titular:** ${clientName}\n• **Total:** $${Number(orderData.total_amount).toFixed(2)}\n• **Estado actual:** ${statusText}\n\nSi necesitas coordinar la entrega o tienes dudas, puedes comunicarte con nuestro equipo en WhatsApp.`,
            time,
            actions: [
              { label: '💬 Consultar en WhatsApp', actionType: 'whatsapp', payload: `¡Hola! Consulto sobre el estado de mi pedido ORD-${orderData.id.split('-')[0].toUpperCase()}` },
              { label: '🛒 Ir a la Tienda', actionType: 'navigate', payload: '/tienda' }
            ]
          };
        } else {
          return {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `No encontré ningún pedido registrado con el código **"${candidateCode}"**. Por favor verifica el número o compártemelo por WhatsApp con nuestro asesor.`,
            time,
            actions: [
              { label: '💬 Enviar código a WhatsApp', actionType: 'whatsapp', payload: `Hola, deseo consultar mi pedido con código ${candidateCode}` }
            ]
          };
        }
      } else if (!query.includes('precio') && !query.includes('ron') && !query.includes('whisky')) {
        return {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Para consultar el estado de tu pedido, por favor escribe el código de tu orden (por ejemplo: **ORD-E176378A** o el identificador que recibiste al confirmar tu compra).',
          time,
          actions: [
            { label: '💬 Ayuda con mi pedido por WhatsApp', actionType: 'whatsapp', payload: '¡Hola! Necesito ayuda para rastrear mi pedido web.' }
          ]
        };
      }
    }

    // 2. PRODUCTOS / LICORES / RON / WHISKY / PRECIOS / COMPRAR
    if (query.includes('ron') || query.includes('legarda') || query.includes('whisky') || query.includes('whiskey') || query.includes('licor') || query.includes('botella') || query.includes('precio') || query.includes('catalogo') || query.includes('catálogo') || query.includes('tienda') || query.includes('comprar')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🥃 **Nuestros Destilados de Autor:**\n\n• **Ron Estancos Legarda:** Añejo 3 años en roble americano, notas de vainilla, caramelo y sutil madera tostada.\n• **Whisky Real Audiencia:** Single Malt ecuatoriano de carácter refinado y complejo.\n• **Whiskey Chillos Valley Grain:** Destilado de granos andinos con una suavidad única.\n\nPuedes comprar directamente en línea y recibirlo en tu puerta.`,
        time,
        actions: [
          { label: '🛒 Ver Tienda Online', actionType: 'navigate', payload: '/tienda' },
          { label: '💬 Pedir Asesoría en WhatsApp', actionType: 'whatsapp', payload: '¡Hola! Quisiera recomendaciones sobre sus destilados.' }
        ]
      };
    }

    // 3. TOURS / CATAS / VISITAS / EXPERIENCIAS / HORARIOS DE VISITA
    if (query.includes('tour') || query.includes('cata') || query.includes('visita') || query.includes('experiencia') || query.includes('conocer') || query.includes('destileria') || query.includes('destilería') || query.includes('reserva')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🎟️ **Experiencias & Tours en la Destilería:**\n\nVen a vivir el arte de la destilación clandestina en el **Valle de los Chillos**.\n\n• Recorrido guiado por los alambiques de cobre.\n• Explicación del proceso de fermentación y añejamiento en barricas.\n• Cata maridada de nuestros destilados premium.\n\nCupos limitados por grupo.`,
        time,
        actions: [
          { label: '🎟️ Reservar Experiencia', actionType: 'navigate', payload: '/visitas' },
          { label: '💬 Consultar Fechas Especiales', actionType: 'whatsapp', payload: '¡Hola! Deseo información sobre disponibilidad de tours y catas.' }
        ]
      };
    }

    // 4. COCTELES / RECETAS / TRAGOS
    if (query.includes('coctel') || query.includes('cóctel') || query.includes('receta') || query.includes('trago') || query.includes('mezcla') || query.includes('ingrediente')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🍹 **Coctelería de Autor:**\n\nNuestros maestros destiladores han creado recetas exclusivas como el *Old Fashioned Andino*, *Rum Mule Clandestino* y *Carapungo Sour*.\n\nDescubre el paso a paso y los ingredientes en nuestra sección de coctelería.`,
        time,
        actions: [
          { label: '🍹 Ver Recetas de Cocteles', actionType: 'navigate', payload: '/cocteleria' },
          { label: '🛒 Comprar Licores para Cocteles', actionType: 'navigate', payload: '/tienda' }
        ]
      };
    }

    // 5. ENVÍOS / TIEMPOS / FORMAS DE PAGO / FACTURA
    if (query.includes('envio') || query.includes('envío') || query.includes('entrega') || query.includes('pago') || query.includes('transferencia') || query.includes('banco') || query.includes('factura') || query.includes('ruc')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🚚 **Envíos y Formas de Pago:**\n\n• **Entregas en Quito:** 24 a 48 horas laborables.\n• **Envíos Nacionales:** A todo el Ecuador mediante transporte seguro.\n• **Métodos de Pago:** Transferencia / depósito bancario (Banco Pichincha) con confirmación vía WhatsApp.\n• **Facturación:** Emitimos factura electrónica a Consumidor Final o con tus datos de RUC / Cédula.`,
        time,
        actions: [
          { label: '🛒 Ir al Carrito / Tienda', actionType: 'navigate', payload: '/tienda' },
          { label: '💬 Contactar por WhatsApp', actionType: 'whatsapp', payload: '¡Hola! Tengo una duda sobre mi pago / envío.' }
        ]
      };
    }

    // 6. UBICACIÓN / DIRECCIÓN / CONTACTO / TELÉFONO / HORARIOS
    if (query.includes('donde') || query.includes('dónde') || query.includes('ubicacion') || query.includes('ubicación') || query.includes('direccion') || query.includes('dirección') || query.includes('telefono') || query.includes('teléfono') || query.includes('contacto') || query.includes('horario')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📍 **Ubicación & Contacto:**\n\n• **Destilería:** Valle de los Chillos, Pichincha, Ecuador.\n• **Teléfono / WhatsApp:** +593 99 858 1721\n• **Correo:** estancos.d.c@outlook.com\n\nLas visitas se realizan bajo reserva previa para garantizar una experiencia personalizada.`,
        time,
        actions: [
          { label: '🎟️ Reservar Visita', actionType: 'navigate', payload: '/visitas' },
          { label: '💬 Abrir WhatsApp', actionType: 'whatsapp', payload: '¡Hola Estancos! Deseo comunicarme con ustedes.' }
        ]
      };
    }

    // 7. ASESOR HUMANO / WHATSAPP DIRECTO
    if (query.includes('asesor') || query.includes('humano') || query.includes('persona') || query.includes('whatsapp') || query.includes('ayuda') || query.includes('hola') || query.includes('buenas')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `¡Con gusto! Puedes continuar conversando conmigo o si prefieres atención inmediata con uno de nuestros maestros destiladores o ejecutivos de venta, escríbenos directamente a WhatsApp.`,
        time,
        actions: [
          { label: '💬 Chatear por WhatsApp', actionType: 'whatsapp', payload: `¡Hola! Me comunico desde el chat web con la siguiente consulta: "${input}"` },
          { label: '🥃 Ver Licores', actionType: 'navigate', payload: '/tienda' },
          { label: '🎟️ Ver Tours', actionType: 'navigate', payload: '/visitas' }
        ]
      };
    }

    // 8. RESPUESTA POR DEFECTO CON OPCIONES
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Entiendo tu consulta sobre "${input}". Para darte la mejor respuesta o coordinar pedidos especiales, ¿qué te gustaría hacer?`,
      time,
      actions: [
        { label: '💬 Hablar con un Asesor en WhatsApp', actionType: 'whatsapp', payload: `¡Hola! Tenía una consulta en la web: "${input}"` },
        { label: '🥃 Ver Catálogo de Licores', actionType: 'navigate', payload: '/tienda' },
        { label: '🎟️ Reservar Visita a la Destilería', actionType: 'navigate', payload: '/visitas' }
      ]
    };
  }
}
