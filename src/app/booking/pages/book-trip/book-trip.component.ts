import {Component, OnInit} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatFormField} from "@angular/material/form-field";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import {MatCard} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {CommonModule, DecimalPipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import { Location } from '@angular/common';
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";
import {ReservaService} from "../../../maps/pages/reservation-cards/service/reserva.service";
import {DestinationApiService} from "../../../destination/services/destination-api.service";

@Component({
  selector: 'app-book-trip',
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    MatFormField,
    MatDivider,
    MatCard,
    FormsModule,
    NgForOf,
    MatButton,
    MatInput,
    DecimalPipe,
    CommonModule,
    ToolbarComponent
  ],
  templateUrl: './book-trip.component.html',
  styleUrl: './book-trip.component.css'
})
export class BookTripComponent implements OnInit {
  destinationId!: number;
  destination: any;
  selectedDate: Date | null = null;
  selectedTime: string = '';
  discountCode: string = '';
  total: number = 20;
  discountApplied: boolean = false;
  days: { date: Date, dayName: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destinationService: DestinationApiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.destinationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDestination();
    this.generateDays();
  }

  loadDestination(): void {
    this.destinationService.getDestinationById(this.destinationId).subscribe(
      (data) => {
        this.destination = data;
      },
      (error) => {
        console.error('Error loading destination', error);
      }
    );
  }

  generateDays(): void {
    const today = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayName = dayNames[date.getDay()];
      this.days.push({ date, dayName });
    }
  }

  applyDiscount(): void {
    if (this.discountCode.toLowerCase() === this.destination.driver.discountCode.toLowerCase()) {
      if (!this.discountApplied) {
        const discountValue = parseFloat(this.destination.driver.discount) / 100;
        this.total = this.total - (this.total * discountValue);
        this.discountApplied = true;
        alert(`Descuento del ${this.destination.driver.discount} aplicado.`);
      } else {
        alert('El descuento ya ha sido aplicado.');
      }
    } else {
      alert('Código de descuento no válido.');
    }
  }

  confirmReservation(): void {
    if (!this.selectedDate || !this.selectedTime) {
      alert("Por favor, selecciona una fecha y una hora para continuar.");
      return;
    }

    alert(`Reserva confirmada para ${this.destination.name} el día ${this.selectedDate} a las ${this.selectedTime}`);
    this.router.navigate(['/reservations']);  }

  goBack(): void {
    this.location.back();
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }
}
