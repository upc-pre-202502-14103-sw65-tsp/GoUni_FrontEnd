import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

export interface Driver {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePhotoUrl: string;
  dniNumber: string;
  licenseNumber: string;
  driverDescription: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = `${environment.backendUrl}/api/v1/users`;

  private mockDrivers: Driver[] = [
    {
      id: 1,
      email: 'juan.perez@example.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '123456789',
      profilePhotoUrl: 'https://img.freepik.com/foto-gratis/joven-hombre-barbudo-camisa-rayas_273609-5677.jpg?semt=ais_hybrid&w=740&q=80',
      dniNumber: '12345678',
      licenseNumber: 'LIC12345',
      driverDescription: 'Conductor con 5 años de experiencia',
      roles: ['DRIVER']
    },
    {
      id: 2,
      email: 'ana.garcia@example.com',
      firstName: 'Ana',
      lastName: 'García',
      phoneNumber: '987654321',
      profilePhotoUrl: 'https://st3.depositphotos.com/14807954/19325/i/450/depositphotos_193252528-stock-photo-a-young-man-mimicing-against.jpg',
      dniNumber: '87654321',
      licenseNumber: 'LIC54321',
      driverDescription: 'Conductor puntual y amable',
      roles: ['DRIVER']
    },
  ];

  constructor(private http: HttpClient) { }

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/drivers`).pipe(
      catchError((error) => {
        console.warn('⚠️ Error al obtener conductores del servidor, usando datos de respaldo:', error);
        return of(this.mockDrivers);
      })
    );
  }

  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.warn(`⚠️ Error al obtener conductor ${id}, usando datos de respaldo:`, error);
        const mockDriver = this.mockDrivers.find(d => d.id === id);
        if (mockDriver) {
          return of(mockDriver);
        }
        return of(this.mockDrivers[0]); // Retornar primer conductor si no se encuentra
      })
    );
  }

  // Método adicional para obtener datos mock directamente
  getMockDrivers(): Driver[] {
    return this.mockDrivers;
  }
}