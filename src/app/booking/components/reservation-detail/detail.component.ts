import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reserva',
  templateUrl: './detail.component.html',
  standalone: true,
  imports: [MatButtonModule]
})
export class ReservaComponent {
  addToGoogleCalendar(reserva: any): void {
    const startDate = new Date(reserva.startDate);
    const endDate = new Date(reserva.endDate);
    
    const start = startDate.toISOString().replace(/-|:|\.\d{3}/g, "");
    const end = endDate.toISOString().replace(/-|:|\.\d{3}/g, "");
    
    const text = encodeURIComponent(`Reserva GoUni: ${reserva.destination}`);
    const details = encodeURIComponent(
      `Reserva realizada en GoUni\nConductor: ${reserva.driverName || 'No asignado'}\nFecha: ${startDate.toLocaleDateString()}`
    );
    const location = encodeURIComponent(reserva.destinationAddress || '');
    
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
    
    window.open(url, '_blank');
  }
}