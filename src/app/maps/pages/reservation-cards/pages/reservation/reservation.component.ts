import {Component, OnInit} from '@angular/core';
import {Reservation} from "../../service/interface/reservation";
import {HttpClient} from "@angular/common/http";
import {DatePipe, Location, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {ToolbarComponent} from "../../../../../home/components/toolbar/toolbar.component";
import {ReservaService} from "../../service/reserva.service";

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    MatButton,
    NgForOf,
    MatIcon,
    ToolbarComponent,
    DatePipe,
    RouterLink
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit{

  reservas: any[] = []; // Lista de reservas que viene del JSON-Server

  constructor(
    private http: HttpClient,
    private router: Router,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.getReservas();  // Llama al servicio para obtener las reservas
  }

  // Método para obtener las reservas desde el servicio
  getReservas(): void {
    this.reservaService.getReservas().subscribe((data) => {
      this.reservas = data;
    });
  }

  // Lógica para reprogramar la reserva
  rescheduleReservation(reservation: any): void {
    console.log(`Reprogramando la reserva de ${reservation.usuario}`);
    // Aquí puedes agregar la lógica para reprogramar la reserva
  }

  // Lógica para iniciar un chat
  openChat(reservation: any): void {
    console.log(`Iniciando chat con ${reservation.usuario}`);
    // Aquí puedes agregar la lógica para iniciar un chat
  }

  // Lógica para volver a la página anterior
  goBack(): void {
    this.router.navigate(['/list']);
  }

  deleteReservation(reservaId: number): void {
    if (confirm('¿Estás seguro que deseas eliminar esta reserva?')) {
      this.reservaService.deleteReserva(reservaId).subscribe(() => {
        // Filtrar las reservas en la lista después de eliminar
        this.reservas = this.reservas.filter(reserva => reserva.id !== reservaId);
        alert('Reserva eliminada exitosamente');
      }, error => {
        console.error('Error al eliminar la reserva', error);
      });
    }
  }
}
