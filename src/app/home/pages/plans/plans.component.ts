import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from "../../../login/service/auth.service";
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    ToolbarComponent
  ],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent {
  plans = [
    {
      name: 'Básico',
      displayPrice: 'Gratis',
      price: 0,
      features: [
        '2 viajes por día',
        'Acceso limitado a funciones',
        'Anuncios incluidos',
        'Soporte básico comunitario'
      ]
    },
    {
      name: 'Plan Estudiante',
      displayPrice: 'S/.10',
      period: '/mes',
      price: 10,
      popular: true,
      features: [
        'Invita a un acompañante gratis',
        'Viajes ilimitados',
        'Puntos dobles en el primer mes',
        'Reservas anticipadas',
        'Acceso a descuentos exclusivos',
        'Atención al cliente preferencial'
      ]
    },
    {
      name: 'Plan Premium',
      displayPrice: 'S/.15',
      period: '/mes',
      price: 15,
      features: [
        'Viajes ilimitados',
        'Acumulación de puntos canjeables',
        'Personalización de precios',
        'Notificaciones en tiempo real',
        'Invita a un acompañante gratis',
        'Acceso a eventos exclusivos para conductores'
      ]
    }
  ];

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  subscribe(plan: any) {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Por favor inicia sesión para suscribirte', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/payments', plan.name], { 
      state: { plan } 
    }).then(success => {
      if (!success) {
        this.snackBar.open('Error al navegar a la página de pago', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
}