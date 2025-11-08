import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule, DecimalPipe, NgForOf} from "@angular/common";
import { Location } from '@angular/common';
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";
import {DestinationApiService} from "../../../destination/services/destination-api.service";
import {DriverService, Driver} from "../../services/driver.service";
import {MatButtonModule} from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';

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
export class BookTripComponent implements OnInit, OnDestroy {
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
  isLoadingDrivers: boolean = false;
  driversLoadError: boolean = false;

  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDestination(): void {
    this.destinationService.getDestinationById(this.destinationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.destination = data;
          console.log('✅ Destino cargado:', data);
        },
        error: (error) => {
          console.error('❌ Error al cargar destino:', error);
          // Opcional: mostrar mensaje al usuario
        }
      });
  }

  loadDrivers(): void {
    this.isLoadingDrivers = true;
    this.driversLoadError = false;

    this.driverService.getAllDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (drivers) => {
          this.isLoadingDrivers = false;

          if (!drivers || drivers.length === 0) {
            console.warn('⚠️ No hay conductores disponibles, usando datos de respaldo');
            this.availableDrivers = this.driverService.getMockDrivers();
            this.driversLoadError = true;
          } else {
            console.log('✅ Conductores cargados desde el servidor:', drivers);
            this.availableDrivers = drivers;
          }
        },
        error: (error) => {
          this.isLoadingDrivers = false;
          this.driversLoadError = true;
          console.error('❌ Error al cargar conductores, usando datos de respaldo:', error);
          // El catchError del servicio ya manejó el error y retornó datos mock
          this.availableDrivers = this.driverService.getMockDrivers();
        }
      });
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
    console.log('👤 Conductor seleccionado:', driver);
  }

  applyDiscount(): void {
    if (!this.discountCode.trim()) {
      alert('Por favor, ingresa un código de descuento.');
      return;
    }

    if (this.discountCode.toLowerCase() === 'descuento10') {
      if (!this.discountApplied) {
        this.total = this.total * 0.9;
        this.discountApplied = true;
        alert('✅ Descuento del 10% aplicado. Nuevo total: S/. ' + this.total.toFixed(2));
      } else {
        alert('⚠️ El descuento ya ha sido aplicado.');
      }
    } else {
      alert('❌ Código de descuento no válido.');
    }
  }

  confirmReservation(): void {
    // Validaciones
    if (!this.selectedDate || !this.selectedTime) {
      alert("⚠️ Por favor, selecciona una fecha y una hora para continuar.");
      return;
    }

    if (!this.selectedDriver) {
      alert("⚠️ Por favor, selecciona un conductor para continuar.");
      return;
    }

    if (!this.destination) {
      alert("⚠️ Error: No se pudo cargar la información del destino.");
      return;
    }

    // Mensaje de confirmación detallado
    const confirmationMessage =
      `🎉 Reserva confirmada\n\n` +
      `📍 Destino: ${this.destination.name}\n` +
      `👤 Conductor: ${this.selectedDriver.firstName} ${this.selectedDriver.lastName}\n` +
      `📱 Teléfono: ${this.selectedDriver.phoneNumber}\n` +
      `📅 Fecha: ${this.selectedDate.toLocaleDateString('es-PE')}\n` +
      `🕐 Hora: ${this.selectedTime}\n` +
      `💰 Total: S/. ${this.total.toFixed(2)}`;

    alert(confirmationMessage);

    console.log('✅ Reserva confirmada:', {
      destination: this.destination,
      driver: this.selectedDriver,
      date: this.selectedDate,
      time: this.selectedTime,
      total: this.total
    });

    // this.router.navigate(['/reservations']);
    this.router.navigate(['/booking/reservations']);
  }

  addToGoogleCalendar(): void {
    console.log('📅 === INICIO: Agregar a Google Calendar ===');

    const now = new Date();
    let startDate: Date;

    // Determinar fecha de inicio
    if (this.selectedDate && this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      startDate = new Date(this.selectedDate);
      startDate.setHours(hours, minutes, 0, 0);
      console.log('✅ Usando fecha seleccionada:', startDate);
    } else {
      console.warn('⚠️ No hay fecha/hora seleccionada, usando fecha actual + 1 hora');
      startDate = new Date(now);
      startDate.setMinutes(0, 0, 0);
      startDate.setHours(startDate.getHours() + 1);
    }

    // Fecha de fin (1 hora después)
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    // Formato para Google Calendar (formato ISO sin separadores)
    const start = startDate.toISOString().replace(/-|:|\.\d{3}/g, "");
    const end = endDate.toISOString().replace(/-|:|\.\d{3}/g, "");

    // Información con fallbacks
    const driverName = this.selectedDriver
      ? `${this.selectedDriver.firstName} ${this.selectedDriver.lastName}`
      : 'Por asignar';
    const driverPhone = this.selectedDriver?.phoneNumber || 'N/A';
    const driverLicense = this.selectedDriver?.licenseNumber || 'N/A';
    const destinationName = this.destination?.name || 'Destino por confirmar';
    const destinationAddress = this.destination?.address || this.destination?.name || 'Dirección por confirmar';
    const totalAmount = this.total || 0;

    // Construir el evento
    const text = encodeURIComponent(`🚗 Reserva GoUni: ${destinationName}`);
    const details = encodeURIComponent(
      `🚗 RESERVA GOUNI\n\n` +
      `👤 CONDUCTOR\n` +
      `Nombre: ${driverName}\n` +
      `Teléfono: ${driverPhone}\n` +
      `Licencia: ${driverLicense}\n\n` +
      `📍 DESTINO\n` +
      `${destinationName}\n` +
      `${destinationAddress}\n\n` +
      `💰 DETALLES DEL PAGO\n` +
      `Total: S/. ${totalAmount.toFixed(2)}\n` +
      `${this.discountApplied ? ' Descuento aplicado (10%)' : ''}\n\n` +
      ` Reserva realizada: ${now.toLocaleString('es-PE')}\n\n` +
      `---\n` +
      `Generado por GoUni App`
    );
    const location = encodeURIComponent(destinationAddress);

    // URL de Google Calendar
    const url =
      `https://www.google.com/calendar/render?` +
      `action=TEMPLATE&` +
      `text=${text}&` +
      `dates=${start}/${end}&` +
      `details=${details}&` +
      `location=${location}&` +
      `sf=true&` +
      `output=xml`;

    console.log('🔗 URL de Google Calendar generada');
    console.log('📄 Detalles:', {
      evento: decodeURIComponent(text),
      conductor: driverName,
      destino: destinationName,
      fecha: startDate.toLocaleString('es-PE')
    });

    // Abrir en nueva ventana
    const windowOpened = window.open(url, '_blank');

    if (windowOpened) {
      console.log('✅ Ventana de Google Calendar abierta exitosamente');
    } else {
      console.error('❌ No se pudo abrir la ventana (bloqueo de pop-ups)');
      alert('⚠️ Por favor, permite pop-ups para agregar el evento a Google Calendar');
    }

    console.log('📅 === FIN: Agregar a Google Calendar ===\n');
  }

  goBack(): void {
    this.location.back();
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
    console.log('📅 Fecha seleccionada:', date.toLocaleDateString('es-PE'));
  }

  selectTime(time: string): void {
    this.selectedTime = time;
    console.log('🕐 Hora seleccionada:', time);
  }
}
