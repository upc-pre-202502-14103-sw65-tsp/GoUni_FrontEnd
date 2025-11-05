import { Component } from '@angular/core';
import { ExportReservationsService } from '../../services/export-reservations.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent {
  reservations: any[] = [];

  constructor(private exportService: ExportReservationsService) {}

  exportExcel() {
    this.exportService.exportToExcel(this.reservations);
  }
}