// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gouni-platform-deploy.ey.r.appspot.com/api/v1/authentication';

  constructor(private http: HttpClient) {}

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método de inicio de sesión que recibe email y contraseña
  login(email: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/sign-in`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        if (response && response.token) {
          // Almacena el token en localStorage
          localStorage.setItem('token', response.token);
          // También almacena información del usuario si es necesaria
          localStorage.setItem('userId', response.id);
          localStorage.setItem('userEmail', response.email);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return of(false);
      })
    );
  }

  // Método de registro
  register(email: string, firstName: string, lastName: string, phoneNumber: string, dniNumber: string, password: string, role: string = 'PASSENGER_ROLE'): Observable<any> {
    const url = `${this.apiUrl}/sign-up`;
    const body = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      profilePhotoUrl: '',
      dniNumber: dniNumber,
      licenseNumber: '',
      driverDescription: '',
      roles: [role]
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Error durante el registro:', error);
        return of(null);
      })
    );
  }

  // Método para verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Método de logout para eliminar el token
  logout(): void {
    localStorage.removeItem('token');
  }
}
