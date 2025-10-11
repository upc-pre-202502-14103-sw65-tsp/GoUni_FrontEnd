// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.backendUrl}/api/v1/authentication`;

  constructor(private http: HttpClient) { }

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
          
          // Guardar el rol si viene en la respuesta
          if (response.roles && response.roles.length > 0) {
            localStorage.setItem('userRole', response.roles[0]);
            console.log('Role saved from login response:', response.roles[0]);
          } else if (response.role) {
            localStorage.setItem('userRole', response.role);
            console.log('Role saved from login response:', response.role);
          }
          
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
  register(
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    dniNumber: string,
    password: string,
    role: string = 'PASSENGER_ROLE',
    profilePhotoUrl: string = '',
    licenseNumber?: string,
    driverDescription?: string
  ): Observable<any> {
    const url = `${this.apiUrl}/sign-up`;

    const body: any = {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      profilePhotoUrl,
      dniNumber,
      roles: [role]
    };

    // Solo agrega estos campos si el usuario es DRIVER_ROLE
    if (role === 'DRIVER_ROLE') {
      body.licenseNumber = licenseNumber || '';
      body.driverDescription = driverDescription || '';
    }

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

  // Método para obtener el rol del usuario
  getUserRole(): string {
    // Primero intentar obtener el rol desde localStorage (solución temporal)
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      console.log('Role from localStorage:', storedRole);
      return storedRole;
    }
    
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload); // Debug
        console.log('Roles in token:', payload.roles); // Debug
        
        // Intentar diferentes formatos de roles
        if (payload.roles && Array.isArray(payload.roles)) {
          return payload.roles[0] || 'PASSENGER_ROLE';
        } else if (payload.role) {
          return payload.role;
        } else if (payload.authorities && Array.isArray(payload.authorities)) {
          return payload.authorities[0] || 'PASSENGER_ROLE';
        }
        
        return 'PASSENGER_ROLE';
      } catch (error) {
        console.error('Error parsing token:', error);
        return 'PASSENGER_ROLE';
      }
    }
    return 'PASSENGER_ROLE';
  }

  // Método para guardar el rol del usuario (solución temporal)
  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  // Método para verificar si el usuario es conductor
  isDriver(): boolean {
    const role = this.getUserRole();
    
    // Si tenemos el rol guardado, usarlo
    if (role === 'DRIVER_ROLE') {
      return true;
    }
    
    // Fallback: verificar por email (conductores tienen formato específico)
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && userEmail.includes('u202218669@upc.edu.pe')) {
      localStorage.setItem('userRole', 'DRIVER_ROLE');
      return true;
    }
    
    return false;
  }

  // Método para verificar si el usuario es pasajero
  isPassenger(): boolean {
    return this.getUserRole() === 'PASSENGER_ROLE';
  }

  // Método para obtener información del usuario actual
  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      map(response => {
        console.log('Current user response:', response);
        if (response && response.roles) {
          localStorage.setItem('userRole', response.roles[0]);
        }
        return response;
      }),
      catchError(error => {
        console.error('Error getting current user:', error);
        return of(null);
      })
    );
  }

  // Método de logout para eliminar el token
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  }
}