import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaymentService } from "../../service/payment.service";
import { AuthService } from "../../../login/service/auth.service";
import { PaymentModalComponent } from "../payment-modal/payment-modal.component";
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
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

  subscriptionStatus: string | null = null;

  constructor(
    private dialog: MatDialog,
    private paymentService: PaymentService,
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

    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '400px',
      data: { plan: plan.name, amount: plan.price }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.createPayment({
          ...result,
          amount: plan.price
        }).subscribe({
          next: (response) => {
            this.subscriptionStatus = `¡Suscripción exitosa al plan ${plan.name}!`;
            this.snackBar.open(
              this.subscriptionStatus,
              'Cerrar',
              { duration: 3000 }
            );
          },
          error: (error) => {
            this.subscriptionStatus = `Error en la suscripción al plan ${plan.name}.`;
            this.snackBar.open(
              this.subscriptionStatus,
              'Cerrar',
              { duration: 3000 }
            );
          }
        });
      }
    });
  }
}
