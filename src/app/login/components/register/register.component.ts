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

interface PasswordRequirement {
  text: string;
  met: boolean;
  checked: boolean;
}

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

  passwordStrengthClass = '';
  passwordStrengthText = '';
  passwordStrengthPercentage = 0;

  passwordRequirements: PasswordRequirement[] = [
    { text: 'Al menos 8 caracteres', met: false, checked: false },
    { text: 'Una letra mayúscula', met: false, checked: false },
    { text: 'Una letra minúscula', met: false, checked: false },
    { text: 'Un número', met: false, checked: false },
    { text: 'Un carácter especial', met: false, checked: false },
  ];

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
        detail: 'Debes aceptar los Términos y Condiciones.',
      });
      return;
    }

    if (!/^\d{8}$/.test(this.dniNumber)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El DNI debe tener 8 dígitos.',
      });
      return;
    }

    if (this.role === 'DRIVER_ROLE') {
      if (!this.licenseNumber || !this.driverDescription) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Completa licencia y descripción.',
        });
        return;
      }
    }

    this.authService
      .register(
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
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro exitoso.',
          });

          this.router.navigate(['/login']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar.',
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

  checkPasswordStrength() {
    const pwd = this.password || '';

    if (!pwd) {
      this.passwordRequirements.forEach(req => {
        req.met = false;
        req.checked = false;
      });

      this.passwordStrengthPercentage = 0;
      this.passwordStrengthClass = '';
      this.passwordStrengthText = '';
      return;
    }

    this.passwordRequirements.forEach(req => req.checked = true);

    this.passwordRequirements[0].met = pwd.length >= 8;
    this.passwordRequirements[1].met = /[A-Z]/.test(pwd);
    this.passwordRequirements[2].met = /[a-z]/.test(pwd);
    this.passwordRequirements[3].met = /\d/.test(pwd);
    this.passwordRequirements[4].met = /[^A-Za-z0-9]/.test(pwd);

    const metCount = this.passwordRequirements.filter(req => req.met).length;
    this.passwordStrengthPercentage = (metCount / this.passwordRequirements.length) * 100;

    if (metCount <= 2) {
      this.passwordStrengthClass = 'weak';
      this.passwordStrengthText = 'Débil';
    } else if (metCount === 3 || metCount === 4) {
      this.passwordStrengthClass = 'medium';
      this.passwordStrengthText = 'Media';
    } else if (metCount === 5) {
      this.passwordStrengthClass = 'strong';
      this.passwordStrengthText = 'Fuerte';
    }
  }
}
