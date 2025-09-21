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
import toast, {Toaster} from "solid-toast";

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
      toast.error('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.pe$/;

    if (!emailRegex.test(this.email)) {
      toast.error('Solo se permiten correos institucionales (.edu.pe).');
      return;
    }

    const username = this.username;
    const password = this.password;
    const role = 'USER';

    this.authService.register(username, password, role).subscribe({
      next: (response) => {
        toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        toast.error('No se pudo registrar el usuario. Por favor, intenta nuevamente.');
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

