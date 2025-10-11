import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule, DecimalPipe, NgForOf} from "@angular/common";
import { Location } from '@angular/common';
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";
import {DestinationApiService} from "../../../destination/services/destination-api.service";
import {DriverService, Driver} from "../../services/driver.service";

@Component({
  selector: 'app-book-trip',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
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
  availableDrivers: Driver[] = [];
  selectedDriver: Driver | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destinationService: DestinationApiService,
    private driverService: DriverService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.destinationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDestination();
    this.loadDrivers();
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

  loadDrivers(): void {
    this.driverService.getAllDrivers().subscribe(
      (drivers) => {
        this.availableDrivers = drivers;
        console.log('Drivers loaded:', drivers);
      },
      (error) => {
        console.error('Error loading drivers', error);
        this.availableDrivers = [];
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

  selectDriver(driver: Driver): void {
    this.selectedDriver = driver;
  }

  applyDiscount(): void {
    // Por ahora, simplificamos el descuento ya que no tenemos códigos específicos de conductores
    if (this.discountCode.toLowerCase() === 'descuento10') {
      if (!this.discountApplied) {
        this.total = this.total * 0.9; // 10% de descuento
        this.discountApplied = true;
        alert('Descuento del 10% aplicado.');
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

    if (!this.selectedDriver) {
      alert("Por favor, selecciona un conductor para continuar.");
      return;
    }

    alert(`Reserva confirmada para ${this.destination.name} con el conductor ${this.selectedDriver.firstName} ${this.selectedDriver.lastName} el día ${this.selectedDate.toLocaleDateString()} a las ${this.selectedTime}`);
    this.router.navigate(['/reservations']);
  }

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
