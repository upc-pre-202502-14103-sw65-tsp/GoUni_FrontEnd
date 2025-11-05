import { Component, OnInit } from '@angular/core';
import { ExportReservationsService } from '../../services/export-reservations.service';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  isLoading: boolean = false;

  constructor(
    private exportService: ExportReservationsService,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getUserReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reservations', error);
        this.isLoading = false;
        this.showSnackBar('Error al cargar las reservas', 'error');
      }
    });
  }

  exportExcel(): void {
    if (this.reservations.length === 0) {
      this.showSnackBar('No tienes reservas para exportar', 'info');
      return;
    }

    try {
      this.exportService.exportToExcel(this.reservations);
      this.showSnackBar('Reservas exportadas exitosamente', 'success');
    } catch (error) {
      console.error('Error exporting to Excel', error);
      this.showSnackBar('Error al exportar las reservas', 'error');
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}