import {Component, OnInit} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {ReservaService} from "../../../maps/pages/reservation-cards/service/reserva.service";
import {Location, NgForOf} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";


@Component({
  selector: 'app-reschedule-trip',
  standalone: true,
  imports: [
    MatDivider,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatButton,
    NgForOf,
    MatCard,
    ToolbarComponent
  ],
  templateUrl: './reschedule-trip.component.html',
  styleUrl: './reschedule-trip.component.css'
})
export class RescheduleTripComponent implements OnInit{
  reservaId!: number;
  reserva: any;

  selectedDate!: number;
  selectedTime!: string;

  // Dynamically generated days
  days: { date: number, dayName: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Get the reservation ID from the URL
    this.reservaId = +this.route.snapshot.paramMap.get('id')!;

    // Fetch the reservation from the service
    this.reservaService.getReservaById(this.reservaId).subscribe(
      (reserva) => {
        this.reserva = reserva;
      },
      (error) => {
        console.error('Error fetching the reservation:', error);
      }
    );

    // Generate the days dynamically
    this.generateDays();
  }

  // Generate days dynamically
  generateDays(): void {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayName = dayNames[date.getDay()];
      this.days.push({date: date.getDate(), dayName: dayName});
    }
  }

  // Confirm the reschedule
  confirmReschedule(): void {
    if (!this.selectedDate || !this.selectedTime) {
      alert("Please select a new date and time.");
      return;
    }

    // Obtener el mes actual si quieres que sea dinámico
    const currentMonth = new Date().getMonth() + 1;  // getMonth() devuelve un valor entre 0 y 11, por lo tanto sumamos 1

    // Update the reservation with the new date and time
    const updatedReserva = {
      ...this.reserva,
      fecha: new Date(2024, currentMonth - 1, this.selectedDate).toISOString().slice(0, 10), // formateando la fecha como 'yyyy-MM-dd'
      hora: this.selectedTime
    };

    // Llamada al servicio para actualizar la reserva
    // Llamar al servicio para actualizar la reserva
    this.reservaService.updateReserva(this.reservaId, updatedReserva).subscribe(
      () => {
        alert('Viaje reprogramado exitosamente.');
        this.router.navigate(['/reservations']);  // Navegar de vuelta a las reservas
      },
      (error) => {
        console.error('Error al reprogramar el viaje:', error);
      }
    );
  }

  // Go back to the previous page
  goBack(): void {
    this.location.back();
  }

}
