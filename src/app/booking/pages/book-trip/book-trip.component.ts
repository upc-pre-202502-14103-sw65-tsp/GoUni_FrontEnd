import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule, DecimalPipe, NgForOf} from "@angular/common";
import { Location } from '@angular/common';
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";
import {DestinationApiService} from "../../../destination/services/destination-api.service";
import {DriverService, Driver} from "../../services/driver.service";
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-book-trip',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    DecimalPipe,
    CommonModule,
    ToolbarComponent,
    MatButtonModule
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
    if (this.discountCode.toLowerCase() === 'descuento10') {
      if (!this.discountApplied) {
        this.total = this.total * 0.9;
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

  addToGoogleCalendar(): void {
    console.log('=== INICIO: Agregar a Google Calendar ===');
    console.log('Botón presionado en:', new Date().toLocaleString());
    
    // VALORES CON FALLBACK - Siempre tendrá algo para mostrar
    const now = new Date();
    console.log('Fecha/Hora actual:', now);
    
    // Usar fecha seleccionada o fecha actual como fallback
    let startDate: Date;
    if (this.selectedDate && this.selectedTime) {
      console.log('Usando fecha seleccionada:', this.selectedDate);
      console.log('Usando hora seleccionada:', this.selectedTime);
      
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      startDate = new Date(this.selectedDate);
      startDate.setHours(hours, minutes, 0, 0);
    } else {
      console.log('⚠️ No hay fecha/hora seleccionada, usando fecha actual');
      startDate = new Date(now);
      // Redondear a la próxima hora
      startDate.setMinutes(0, 0, 0);
      startDate.setHours(startDate.getHours() + 1);
    }
    console.log('Fecha de inicio final:', startDate);

    // Fecha de fin (1 hora después)
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
    console.log('Fecha de fin final:', endDate);

    // Formato para Google Calendar
    const start = startDate.toISOString().replace(/-|:|\.\d{3}/g, "");
    const end = endDate.toISOString().replace(/-|:|\.\d{3}/g, "");
    console.log('Formato Google Calendar START:', start);
    console.log('Formato Google Calendar END:', end);

    // Información del conductor con fallback
    const driverName = this.selectedDriver 
      ? `${this.selectedDriver.firstName} ${this.selectedDriver.lastName}`
      : 'Por asignar';
    const driverPhone = this.selectedDriver?.phoneNumber || 'N/A';
    console.log('Conductor:', driverName);
    console.log('Teléfono conductor:', driverPhone);

    // Información del destino con fallback
    const destinationName = this.destination?.name || 'Destino por confirmar';
    const destinationAddress = this.destination?.address || this.destination?.name || 'Dirección por confirmar';
    console.log('Destino:', destinationName);
    console.log('Dirección:', destinationAddress);

    // Total con fallback
    const totalAmount = this.total || 0;
    console.log('Total a pagar:', totalAmount);

    // Construir el texto del evento
    const text = encodeURIComponent(`Reserva GoUni: ${destinationName}`);
    const details = encodeURIComponent(
      `🚗 Reserva realizada en GoUni\n\n` +
      `👤 Conductor: ${driverName}\n` +
      `📱 Teléfono: ${driverPhone}\n` +
      `📍 Destino: ${destinationName}\n` +
      `💰 Total: S/. ${totalAmount.toFixed(2)}\n\n` +
      `Fecha de reserva: ${now.toLocaleString()}`
    );
    const location = encodeURIComponent(destinationAddress);

    console.log('Texto del evento (decodificado):', decodeURIComponent(text));
    console.log('Detalles del evento (decodificado):', decodeURIComponent(details));
    console.log('Ubicación (decodificado):', decodeURIComponent(location));

    // Construir URL de Google Calendar
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
    
    console.log('URL completa de Google Calendar:');
    console.log(url);
    console.log('URL decodificada:');
    console.log(decodeURIComponent(url));

    // Abrir en nueva ventana
    console.log('Abriendo ventana de Google Calendar...');
    const windowOpened = window.open(url, '_blank');
    
    if (windowOpened) {
      console.log('✅ Ventana abierta exitosamente');
    } else {
      console.log('❌ No se pudo abrir la ventana (posible bloqueo de pop-ups)');
      alert('Por favor, permite pop-ups para agregar el evento a Google Calendar');
    }
    
    console.log('=== FIN: Agregar a Google Calendar ===\n\n');
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
