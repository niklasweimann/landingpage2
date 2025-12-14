import { Component } from '@angular/core';

type WasteTypeKey = 'braune' | 'schwarze' | 'gruene' | 'gelbe';

interface PrefillConfig {
  start: string;
  interval: number;
}

@Component({
  selector: 'app-ics-generator',
  templateUrl: './ics-generator.component.html',
  styleUrls: ['./ics-generator.component.scss']
})
export class IcsGeneratorComponent {

  brauneTonneDates: string = '';
  schwarzeTonneDates: string = '';
  grueneTonneDates: string = '';
  gelbeTonneDates: string = '';
  generationSuccess = false;
  generatedIcsContent: string = '';
  public prefillSettings: Record<WasteTypeKey, PrefillConfig> = {
    braune: {start: '', interval: 14},
    schwarze: {start: '', interval: 14},
    gruene: {start: '', interval: 28},
    gelbe: {start: '', interval: 14},
  };

  constructor() { }

  generateIcs() {
    this.generationSuccess = false;
    this.generatedIcsContent = '';
    const kalenderDaten = {
      "Abfuhr Braune Tonne (Biomüll)": this.parseDates(this.brauneTonneDates),
      "Abfuhr Schwarze/Rote Tonne (Restmüll)": this.parseDates(this.schwarzeTonneDates),
      "Abfuhr Grüne Tonne (Altpapier)": this.parseDates(this.grueneTonneDates),
      "Abfuhr Gelbe Tonne (Leichtfraktion)": this.parseDates(this.gelbeTonneDates)
    };

    const lineEnding = "\r\n";
    let icalString = `BEGIN:VCALENDAR${lineEnding}`;
    icalString += `VERSION:2.0${lineEnding}`;
    icalString += `PRODID:-//My Angular App//DE${lineEnding}`;
    icalString += `CALSCALE:GREGORIAN${lineEnding}`;

    const dstStart2025 = new Date('2025-03-30');
    const dstEnd2025 = new Date('2025-10-26');

    for (const name in kalenderDaten) {
      if (kalenderDaten.hasOwnProperty(name)) {
        const termine = kalenderDaten[name as keyof typeof kalenderDaten];
        for (const terminStr of termine) {
          const eventDate = new Date(terminStr);

          const alarmDateTimeLocal = new Date(eventDate.getTime() - (24 * 60 * 60 * 1000));
          alarmDateTimeLocal.setHours(17, 0, 0, 0);

          let alarmDateTimeUtc: Date;
          if (alarmDateTimeLocal >= dstStart2025 && alarmDateTimeLocal < dstEnd2025) {
            // Sommerzeit (CEST, UTC+2)
            alarmDateTimeUtc = new Date(alarmDateTimeLocal.getTime() - (2 * 60 * 60 * 1000));
          } else {
            // Winterzeit (CET, UTC+1)
            alarmDateTimeUtc = new Date(alarmDateTimeLocal.getTime() - (60 * 60 * 1000));
          }

          const dtstamp = this.formatDateToUTC(new Date());
          const dtstartStr = this.formatDate(eventDate);
          const triggerStr = this.formatDateToUTC(alarmDateTimeUtc);
          const uid = `${this.uuid()}@abfallkalender`;

          icalString += `BEGIN:VEVENT${lineEnding}`;
          icalString += `UID:${uid}${lineEnding}`;
          icalString += `DTSTAMP:${dtstamp}${lineEnding}`;
          icalString += `DTSTART;VALUE=DATE:${dtstartStr}${lineEnding}`;
          icalString += `SUMMARY:${name}${lineEnding}`;
          icalString += `BEGIN:VALARM${lineEnding}`;
          icalString += `ACTION:DISPLAY${lineEnding}`;
          icalString += `DESCRIPTION:Erinnerung: ${name} morgen${lineEnding}`;
          icalString += `TRIGGER;VALUE=DATE-TIME:${triggerStr}${lineEnding}`;
          icalString += `END:VALARM${lineEnding}`;
          icalString += `END:VEVENT${lineEnding}`;
        }
      }
    }

    icalString += `END:VCALENDAR${lineEnding}`;

    this.generatedIcsContent = icalString;
    this.download('abfallkalender.ics', icalString);
    this.generationSuccess = true;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.generatedIcsContent).then(() => {
      alert('Inhalt in die Zwischenablage kopiert!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }

  public prefillRecurringDates(type: WasteTypeKey): void {
    const config = this.prefillSettings[type];
    const sanitizedInterval = Math.max(1, Math.floor(Number(config.interval)) || 0);

    if (!config.start || sanitizedInterval < 1) {
      return;
    }

    this.prefillSettings[type] = {
      start: config.start,
      interval: sanitizedInterval
    };

    const dates = this.generateRecurringDates(config.start, sanitizedInterval);
    if (dates.length === 0) {
      return;
    }

    const joinedDates = dates.join('\n');
    switch (type) {
      case 'braune':
        this.brauneTonneDates = joinedDates;
        break;
      case 'schwarze':
        this.schwarzeTonneDates = joinedDates;
        break;
      case 'gruene':
        this.grueneTonneDates = joinedDates;
        break;
      case 'gelbe':
        this.gelbeTonneDates = joinedDates;
        break;
    }
  }

  private parseDates(datesString: string): string[] {
    return datesString.split('\n').map(d => d.trim()).filter(d => d.length > 0);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  private formatDateToUTC(date: Date): string {
    return date.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
  }

  private generateRecurringDates(startDate: string, intervalDays: number): string[] {
    const firstDate = new Date(`${startDate}T00:00:00`);
    if (Number.isNaN(firstDate.getTime())) {
      return [];
    }

    const dates: string[] = [];
    let cursor = new Date(firstDate);
    const targetYear = cursor.getFullYear();

    while (cursor.getFullYear() === targetYear) {
      dates.push(this.formatDateForTextarea(cursor));
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + intervalDays);
    }

    return dates;
  }

  private formatDateForTextarea(date: Date): string {
    const offsetInMs = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offsetInMs);
    return localDate.toISOString().split('T')[0];
  }

  private uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private download(filename: string, text: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
