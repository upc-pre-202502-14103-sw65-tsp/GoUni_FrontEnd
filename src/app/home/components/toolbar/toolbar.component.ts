import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    LanguageSwitcherComponent,
    MatToolbar,
    MatAnchor,
    RouterLink,
    MatButton,
    MatIconButton,
    MatIcon,
    NgIf
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  constructor(
    private router: Router
  ) {}

  logout() {
    // Aquí puedes limpiar el token o cualquier información relacionada con la autenticación
    localStorage.removeItem('token');  // Ejemplo de eliminación de un token guardado
    sessionStorage.clear();            // Limpiar toda la sesión si es necesario
    this.router.navigate(['/login']);  // Redirigir al login u otra página
  }

}
