import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'https://deploynew.onrender.com/reservas';  // URL del JSON-Server

  constructor(private http: HttpClient) {}

  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addReserva(reserva: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reserva);  // Método para agregar una reserva
  }

  getReservaById(reservaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${reservaId}`);
  }

  updateReserva(reservaId: number, updatedReserva: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservaId}`, updatedReserva);
  }

  deleteReserva(reservaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reservaId}`);
  }
}
