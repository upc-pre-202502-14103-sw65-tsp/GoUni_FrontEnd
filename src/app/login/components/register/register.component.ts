import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgOptimizedImage } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
})
export class RegisterComponent {
  email = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  dniNumber = '';
  password = '';
  showPassword = false;
  termsAccepted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (!this.termsAccepted) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes aceptar los Términos y Condiciones para continuar.',
      });
      return;
    }

    const email = this.email;
    const firstName = this.firstName;
    const lastName = this.lastName;
    const phoneNumber = this.phoneNumber;
    const dniNumber = this.dniNumber;
    const password = this.password;
    const role = 'PASSENGER_ROLE';

    this.authService.register(email, firstName, lastName, phoneNumber, dniNumber, password, role).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro exitoso. Ahora puedes iniciar sesión.',
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el usuario. Por favor, intenta nuevamente.',
        });
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
