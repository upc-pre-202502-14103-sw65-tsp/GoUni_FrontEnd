import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../home/components/toolbar/toolbar.component';
import { PaymentFormComponent } from '../components/payment-form/payment-form.component';

@Component({
  selector: 'app-payment-view',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    PaymentFormComponent
  ],
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css'],
})
export class PaymentViewComponent implements OnInit {
  plan: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.plan = navigation?.extras.state?.['plan'];
    
    if (!this.plan) {
      this.plan = this.getPlanFromUrl();
    }

    if (!this.plan) {
      this.router.navigate(['/plans']);
      return;
    }
  }

  private getPlanFromUrl(): any {
    const planName = this.route.snapshot.paramMap.get('plan');
    const plans = [
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

    return plans.find(p => p.name === planName);
  }
}