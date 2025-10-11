import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.getUserRole();
    
    if (this.authService.isLoggedIn()) {
      if (expectedRole && userRole !== expectedRole) {
        // Si el usuario no tiene el rol esperado, redirigir según su rol
        if (userRole === 'DRIVER_ROLE') {
          this.router.navigate(['/driver-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private getUserRole(): string {
    // Obtener el rol del usuario desde el token o localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles?.[0] || 'PASSENGER_ROLE';
      } catch (error) {
        console.error('Error parsing token:', error);
        return 'PASSENGER_ROLE';
      }
    }
    return 'PASSENGER_ROLE';
  }
}
