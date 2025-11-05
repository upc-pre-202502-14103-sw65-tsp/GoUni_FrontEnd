import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) { }

  getUserReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/my-reservations`);
  }

  createReservation(reservationData: any): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservationData);
  }
}