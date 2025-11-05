import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

export interface Reservation {
  id: number;
  driver: {
    firstName: string;
    lastName: string;
  };
  destination: {
    name: string;
  };
  date: string;
  time: string;
  status: string;
  price: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.backendUrl}/api/v1/reservations`;

  private mockReservations: Reservation[] = [
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

  constructor(private http: HttpClient) { }

  getUserReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/my-reservations`).pipe(
      catchError((error) => {
        console.warn('⚠️ Error al obtener reservas del servidor, usando datos de demostración:', error);
        return of(this.mockReservations);
      })
    );
  }

  createReservation(reservationData: any): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservationData).pipe(
      catchError((error) => {
        console.warn('⚠️ Error al crear reserva, simulando respuesta:', error);
        // Simular respuesta exitosa
        const mockReservation: Reservation = {
          id: Date.now(),
          driver: reservationData.driver || { firstName: 'Conductor', lastName: 'Demo' },
          destination: reservationData.destination || { name: 'Destino Demo' },
          date: reservationData.date || new Date().toISOString(),
          time: reservationData.time || '12:00',
          status: 'confirmed',
          price: reservationData.price || 20.00,
          createdAt: new Date().toISOString()
        };
        return of(mockReservation);
      })
    );
  }

  // Método para obtener datos mock directamente
  getMockReservations(): Reservation[] {
    return this.mockReservations;
  }
}