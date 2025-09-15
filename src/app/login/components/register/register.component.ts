import { Component } from '@angular/core';
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {HttpClient} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = ''; // No se usa en este caso
  password: string = '';
  showPassword = false;
  termsAccepted = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.termsAccepted) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    const username = this.username;
    const password = this.password;
    const role = 'USER';

    this.authService.register(username, password, role).subscribe({
      next: (response) => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        alert('No se pudo registrar el usuario. Por favor, intenta nuevamente.');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

