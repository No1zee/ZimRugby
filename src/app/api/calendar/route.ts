import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/api/events';

export const dynamic = 'force-dynamic';

function generateIcs(events: any[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Zimbabwe Rugby Union//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Zimbabwe Rugby Union Calendar',
    'X-WR-TIMEZONE:Africa/Harare',
    'X-WR-CALDESC:Official matches and events for the Zimbabwe Rugby Union'
  ];

  events.forEach((event) => {
    // Basic date fallback
    if (!event.date) return;
    
    // Parse Date
    const d = new Date(event.date);
    if (isNaN(d.getTime())) return;

    // Optional Time
    let t = '00:00:00';
    if (event.time) {
      // time might be "15:30" or "15:30:00"
      t = event.time.length === 5 ? `${event.time}:00` : event.time;
    }

    // Format for ICS (YYYYMMDDTHHmmssZ) - assuming UTC or local for now
    const dateStr = d.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = t.replace(/:/g, '');
    const dtstart = `${dateStr}T${timeStr}Z`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const uid = `${event.id}@zimrugby.vercel.app`;
    
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`SUMMARY:${escapeIcsText(event.title || 'ZRU Event')}`);
    
    if (event.location) {
      lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    }
    
    let description = '';
    if (event.subtitle) description += `${event.subtitle}\\n`;
    if (event.category) description += `Category: ${event.category}\\n`;
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
    
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function escapeIcsText(text: string): string {
  if (!text) return '';
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export async function GET() {
  try {
    const events = await getEvents();
    const icsContent = generateIcs(events);
    
    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="zimrugby_calendar.ics"',
      },
    });
  } catch (error) {
    console.error('Failed to generate ICS calendar:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
