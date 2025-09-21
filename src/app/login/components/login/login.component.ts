import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
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
    MatCard,
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
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.pe$/;

    if (!emailRegex.test(this.username)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten correos institucionales (.edu.pe).',
      });
      return;
    }

    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        (isAuthenticated) => {
          if (isAuthenticated) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Bienvenido/a!',
            });
            this.router.navigate(['/home']);
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