import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
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
  role: string = 'PASSENGER_ROLE';
  profilePhotoUrl: string = '';
  licenseNumber: string = '';
  driverDescription: string = '';

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

    // Validación de DNI (8 dígitos)
    if (!/^\d{8}$/.test(this.dniNumber)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El DNI debe tener 8 dígitos numéricos.',
      });
      return;
    }

    // Validación de campos específicos para conductores
    if (this.role === 'DRIVER_ROLE') {
      if (!this.licenseNumber || !this.driverDescription) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Los conductores deben completar el número de licencia y descripción.',
        });
        return;
      }
    }

    this.authService.register(
      this.email,
      this.firstName,
      this.lastName,
      this.phoneNumber,
      this.dniNumber,
      this.password,
      this.role,
      this.profilePhotoUrl,
      this.licenseNumber,
      this.driverDescription
    ).subscribe({
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