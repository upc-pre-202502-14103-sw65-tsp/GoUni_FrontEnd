import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) { }

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/drivers`);
  }

  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }
}
