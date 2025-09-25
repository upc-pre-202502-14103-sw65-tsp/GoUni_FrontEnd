import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environments';
import { Observable, from, switchMap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private stripePromise: Promise<Stripe | null>;
  private elements: StripeElements | null = null;
  private cardElement: any = null;
  private isInitialized = new BehaviorSubject<boolean>(false);

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  async initializeStripeElements(containerId: string): Promise<void> {
    try {
      await this.waitForElement(containerId);
      
      const stripe = await this.stripePromise;
      if (!stripe) {
        throw new Error('Stripe no se pudo cargar');
      }

      this.elements = stripe.elements();
      this.cardElement = this.elements.create('card', {
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

      this.cardElement.mount(`#${containerId}`);
      this.isInitialized.next(true);
      
    } catch (error) {
      console.error('Error inicializando Stripe Elements:', error);
      throw error;
    }
  }

  private waitForElement(selector: string): Promise<Element> {
    return new Promise((resolve, reject) => {
      const element = document.getElementById(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.getElementById(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Elemento ${selector} no encontrado después de 5 segundos`));
      }, 5000);
    });
  }

  createPaymentMethod(): Observable<string> {
    return this.isInitialized.pipe(
      switchMap(isInitialized => {
        if (!isInitialized) {
          throw new Error('Stripe Elements no está inicializado');
        }
        return from(this.stripePromise);
      }),
      switchMap(async (stripe) => {
        if (!stripe || !this.cardElement) {
          throw new Error('Stripe no inicializado');
        }

        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: this.cardElement,
        });

        if (error) {
          throw error;
        }

        return paymentMethod.id;
      })
    );
  }

  createPaymentIntent(amount: number, currency: string = 'usd'): Observable<any> {
    return this.http.post(`${environment.backendUrl}/create-payment-intent`, {
      amount,
      currency
    });
  }

  confirmPayment(clientSecret: string, paymentMethodId: string): Observable<any> {
    return this.http.post(`${environment.backendUrl}/confirm-payment`, {
      clientSecret,
      paymentMethodId
    });
  }

  destroy(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    this.isInitialized.next(false);
  }
}