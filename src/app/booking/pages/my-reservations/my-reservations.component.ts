import { Component, OnInit } from '@angular/core';
import { ExportReservationsService } from '../../services/export-reservations.service';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToolbarComponent } from '../../../home/components/toolbar/toolbar.component';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    ToolbarComponent
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
        this.reservations = reservations || [];
        this.isLoading = false;
        console.log('✅ Reservas cargadas:', this.reservations);
      },
      error: (error) => {
        console.error('❌ Error loading reservations', error);
        this.isLoading = false;
        // Usar datos mock si hay error
        this.reservations = this.getMockReservations();
        this.showSnackBar('Usando datos de demostración', 'info');
      }
    });
  }

  exportExcel(): void {
    if (!this.reservations || this.reservations.length === 0) {
      this.showSnackBar('No tienes reservas para exportar', 'info');
      return;
    }

    try {
      this.exportService.exportToExcel(this.reservations);
      this.showSnackBar('Reservas exportadas exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error exporting to Excel', error);
      this.showSnackBar('Error al exportar las reservas', 'error');
    }
  }

  private getMockReservations(): Reservation[] {
    return [
      {
        id: 1,
        driver: {
          firstName: 'Juan',
          lastName: 'Pérez'
        },
        destination: {
          name: 'Playa de la Rosa'
        },
        date: '2024-01-15',
        time: '10:00',
        status: 'confirmed',
        price: 25.50,
        createdAt: '2024-01-10T08:30:00'
      },
      {
        id: 2,
        driver: {
          firstName: 'Ana',
          lastName: 'García'
        },
        destination: {
          name: 'Montaña Azul'
        },
        date: '2024-01-20',
        time: '14:30',
        status: 'pending',
        price: 30.00,
        createdAt: '2024-01-12T10:15:00'
      }
    ];
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