import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {
  
  // Datos del conductor
  driverInfo = {
    name: 'Luis Ramírez',
    licenseNumber: 'C3D-890',
    phoneNumber: '+51987654323',
    rating: 4.8,
    totalTrips: 156,
    earnings: 2450.50
  };

  // Viajes del día
  todayTrips = [
    {
      id: 1,
      passenger: 'María García',
      pickup: 'UPC - San Miguel',
      destination: 'Miraflores',
      time: '08:30',
      status: 'completed',
      fare: 15.00
    },
    {
      id: 2,
      passenger: 'Carlos López',
      pickup: 'PUCP - San Miguel',
      destination: 'San Isidro',
      time: '10:15',
      status: 'in-progress',
      fare: 18.00
    },
    {
      id: 3,
      passenger: 'Ana Martínez',
      pickup: 'San Marcos - Lima',
      destination: 'La Molina',
      time: '14:00',
      status: 'scheduled',
      fare: 22.00
    }
  ];

  // Estadísticas semanales
  weeklyStats = {
    trips: 23,
    earnings: 345.50,
    hours: 18.5,
    rating: 4.9
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cargar datos del conductor desde el backend
    this.loadDriverData();
  }

  loadDriverData(): void {
    // Aquí cargarías los datos reales del conductor desde el backend
    console.log('Loading driver data...');
  }

  startTrip(tripId: number): void {
    console.log(`Starting trip ${tripId}`);
    // Lógica para iniciar un viaje
  }

  completeTrip(tripId: number): void {
    console.log(`Completing trip ${tripId}`);
    // Lógica para completar un viaje
  }

  viewEarnings(): void {
    this.router.navigate(['/driver-earnings']);
  }

  viewProfile(): void {
    this.router.navigate(['/driver-profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En curso';
      case 'scheduled': return 'Programado';
      default: return 'Desconocido';
    }
  }
}
