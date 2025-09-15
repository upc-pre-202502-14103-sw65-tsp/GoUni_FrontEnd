// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gouniprojectdeploy-production.up.railway.app/api/v1/authentication';

  constructor(private http: HttpClient) {}

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método de inicio de sesión que recibe usuario y contraseña
  login(username: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/sign-in`;
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          // Almacena el token en localStorage
          localStorage.setItem('token', response.token);
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
  register(username: string, password: string, role: string = 'USER'): Observable<any> {
    const url = `${this.apiUrl}/sign-up`;
    const body = { username, password, role };
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
