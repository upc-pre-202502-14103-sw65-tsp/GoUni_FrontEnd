import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environments';
import { Observable, from, switchMap, BehaviorSubject } from 'rxjs';
import { EmailService, PaymentNotificationData } from '../../notifications/services/email.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private emailService = inject(EmailService);
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

  async processCompletePayment(
    amount: number,
    currency: string,
    customerData: { name: string; email: string },
    planName: string
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {

    console.log('🔸 [PaymentService] processCompletePayment INICIADO', {
      amount, currency, customerData, planName
    });

    try {
      console.log('🔸 [PaymentService] Creando payment method...');
      const paymentMethodId = await this.createPaymentMethod().toPromise();
      console.log('🔸 [PaymentService] PaymentMethod ID:', paymentMethodId);

      console.log('🔸 [PaymentService] Creando payment intent...');
      const paymentIntent: any = await this.createPaymentIntent(amount, currency).toPromise();
      console.log('🔸 [PaymentService] PaymentIntent:', paymentIntent);

      if (!paymentIntent || !paymentIntent.clientSecret) {
        console.error('❌ [PaymentService] No se pudo crear payment intent');
        throw new Error('No se pudo crear el intento de pago');
      }

      console.log('🔸 [PaymentService] Confirmando pago...');
      const result: any = await this.confirmPayment(
        paymentIntent.clientSecret,
        paymentMethodId || ""
      ).toPromise();

      console.log('🔸 [PaymentService] Resultado confirmación:', result);

      if (result.status === 'succeeded') {
        console.log('✅ [PaymentService] Pago exitoso, enviando emails...');

        const notificationData: PaymentNotificationData = {
          customerName: customerData.name,
          customerEmail: customerData.email,
          planName: planName,
          amount: amount / 100,
          currency: currency.toUpperCase(),
          paymentStatus: 'success',
          paymentDate: new Date(),
          transactionId: result.paymentIntentId
        };

        await this.emailService.sendPaymentNotification(notificationData);
        await this.emailService.sendWelcomeNotification(notificationData);

        return { success: true, transactionId: result.paymentIntentId };
      } else {
        throw new Error('El pago no fue exitoso');
      }
    } catch (error: any) {
      console.error('❌ [PaymentService] Error en processCompletePayment:', error);

      const notificationData: PaymentNotificationData = {
        customerName: customerData.name,
        customerEmail: customerData.email,
        planName: planName,
        amount: amount / 100,
        currency: currency.toUpperCase(),
        paymentStatus: 'failed',
        paymentDate: new Date(),
        errorMessage: error.message
      };

      console.log('🔸 [PaymentService] Enviando email de fallo...');
      await this.emailService.sendPaymentNotification(notificationData);

      return { success: false, error: error.message };
    }
  }

  destroy(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    this.isInitialized.next(false);
  }
}