import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environments';
import { Observable, from, switchMap } from 'rxjs';

// Interfaz para el resultado del método de pago
interface PaymentMethodResult {
  id: string;
  // Puedes añadir más propiedades según necesites
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private stripePromise: Promise<Stripe | null>;
  private elements: StripeElements | null = null;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  // Inicializar elementos de Stripe
  async initializeStripeElements(containerId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (stripe) {
      this.elements = stripe.elements();
      const cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
              color: '#aab7c4'
            }
          }
        }
      });
      cardElement.mount(`#${containerId}`);
    }
  }

  // Crear método de pago
  createPaymentMethod(): Observable<PaymentMethodResult> {
    return from(this.stripePromise).pipe(
      switchMap(async (stripe) => {
        if (!stripe || !this.elements) {
          throw new Error('Stripe no inicializado');
        }

        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: this.elements.getElement('card')!,
        });

        if (error) {
          throw error;
        }

        return {
          id: paymentMethod.id
          // Añade aquí otras propiedades que necesites
        };
      })
    );
  }

  // Crear intento de pago (llamada al backend)
  createPaymentIntent(amount: number, currency: string = 'usd'): Observable<any> {
    return this.http.post(`${environment.backendUrl}/create-payment-intent`, {
      amount,
      currency
    });
  }

  // Confirmar pago (llamada al backend)
  confirmPayment(clientSecret: string, paymentMethodId: string): Observable<any> {
    return this.http.post(`${environment.backendUrl}/confirm-payment`, {
      clientSecret,
      paymentMethodId
    });
  }
}