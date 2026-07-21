// supabase/functions/google-calendar/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { google } from "npm:googleapis@126.0.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejar el pre-flight de CORS de Angular
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, calendarName, eventData, eventId } = await req.json()

    // Obtenemos las credenciales configuradas en los Secrets de Supabase
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    const calendarId = Deno.env.get('GOOGLE_CALENDAR_ID');

    if (!serviceAccountJson || !calendarId) {
      throw new Error("Faltan las variables de entorno de Google Calendar");
    }

    const credentials = JSON.parse(serviceAccountJson);

    // Autenticarnos con Google
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // 1. LISTAR EVENTOS
    if (action === 'listEvents') {
      const response = await calendar.events.list({
        calendarId,
        timeMin: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      });
      
      const events = response.data.items?.map(item => ({
        id: item.id,
        title: item.summary,
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
        allDay: !item.start?.dateTime,
        attendees: item.attendees?.map((a: any) => a.email) || [],
        extendedProps: { googleEventId: item.id }
      })) || [];

      return new Response(JSON.stringify({ events }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. CREAR EVENTO
    if (action === 'createEvent') {
      const attendeesList = eventData.attendees 
        ? eventData.attendees.map((email: string) => ({ email }))
        : [];

      const event: any = {
        summary: eventData.title,
        start: eventData.allDay 
          ? { date: eventData.start.split('T')[0] } 
          : { dateTime: eventData.start },
        end: eventData.allDay && eventData.end
          ? { date: eventData.end.split('T')[0] } 
          : (eventData.end ? { dateTime: eventData.end } : { dateTime: eventData.start }),
        attendees: attendeesList
      };

      if (!eventData.allDay) {
        event.reminders = {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 90 }
          ]
        };
      }

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
      });

      return new Response(JSON.stringify({ success: true, event: response.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. BORRAR EVENTO
    if (action === 'deleteEvent') {
      await calendar.events.delete({ calendarId, eventId });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. ACTUALIZAR EVENTO
    if (action === 'updateEvent') {
      const attendeesList = eventData.attendees 
        ? eventData.attendees.map((email: string) => ({ email }))
        : [];

      const event: any = {
        summary: eventData.title,
        start: eventData.allDay 
          ? { date: eventData.start.split('T')[0] } 
          : { dateTime: eventData.start },
        end: eventData.allDay && eventData.end
          ? { date: eventData.end.split('T')[0] } 
          : (eventData.end ? { dateTime: eventData.end } : { dateTime: eventData.start }),
        attendees: attendeesList
      };

      if (!eventData.allDay) {
        event.reminders = {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 90 }
          ]
        };
      }

      const response = await calendar.events.patch({
        calendarId,
        eventId,
        requestBody: event,
      });

      return new Response(JSON.stringify({ success: true, event: response.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: "Acción no soportada" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
