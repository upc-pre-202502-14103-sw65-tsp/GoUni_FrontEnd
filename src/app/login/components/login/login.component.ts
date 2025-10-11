import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIcon,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.pe$/;

    if (!emailRegex.test(this.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten correos institucionales (.edu.pe).',
      });
      return;
    }

    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(
        (isAuthenticated) => {
          if (isAuthenticated) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Bienvenido/a!',
            });
            
            // Verificar el rol del usuario y redirigir
            const isDriver = this.authService.isDriver();
            console.log('Is driver:', isDriver);
            console.log('User email:', localStorage.getItem('userEmail'));
            
            // Redirigir según el rol del usuario
            if (isDriver) {
              console.log('Redirecting to driver dashboard');
              this.router.navigate(['/driver-dashboard']);
            } else {
              console.log('Redirecting to home');
              this.router.navigate(['/home']);
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Credenciales incorrectas. Inténtalo de nuevo.',
            });
          }
        },
        (error) => {
          console.error('Error en la autenticación:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el servidor. Inténtalo de nuevo más tarde.',
          });
        }
      );
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}