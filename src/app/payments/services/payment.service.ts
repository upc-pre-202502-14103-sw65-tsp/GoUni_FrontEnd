import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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

  async createPaymentMethod(): Promise<any> {
    const stripe = await this.stripePromise;
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

    return paymentMethod;
  }

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<any> {
    try {
      const passengerUserId = localStorage.getItem('userId');
      const response = await firstValueFrom(
        this.http.post(`${environment.backendUrl}/api/v1/payment-intents/create-payment-intent`, {
          amount,
          currency,
          passengerUserId
        })
      );
      return response;
    } catch (error) {
      console.error('Error creando payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(clientSecret: string, paymentMethodId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.post(`${environment.backendUrl}/api/v1/payment-intents/confirm-payment`, {
          clientSecret,
          paymentMethodId
        })
      );
      return response;
    } catch (error) {
      console.error('Error confirmando pago:', error);
      throw error;
    }
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
      const paymentMethod = await this.createPaymentMethod();
      console.log('🔸 [PaymentService] PaymentMethod ID:', paymentMethod.id);

      console.log('🔸 [PaymentService] Creando payment intent...');
      const paymentIntent: any = await this.createPaymentIntent(amount, currency);
      console.log('🔸 [PaymentService] PaymentIntent:', paymentIntent);

      if (!paymentIntent || !paymentIntent.clientSecret) {
        console.error('❌ [PaymentService] No se pudo crear payment intent');
        throw new Error('No se pudo crear el intento de pago');
      }

      console.log('🔸 [PaymentService] Confirmando pago...');
      const result: any = await this.confirmPayment(
        paymentIntent.clientSecret,
        paymentMethod.id
      );
      console.log('🔸 [PaymentService] Resultado confirmación:', result);

      if (result.status === 'succeeded') {
        console.log('✅ [PaymentService] Pago exitoso, enviando emails...');

        const notificationData: PaymentNotificationData = {
          customerName: customerData.name,
          customerEmail: customerData.email,
          planName: planName,
          amount: amount,
          currency: currency.toUpperCase(),
          paymentStatus: 'success',
          paymentDate: new Date(),
          transactionId: result.paymentIntentId
        };

        try {
          await this.emailService.sendPaymentNotification(notificationData);
          await this.emailService.sendWelcomeNotification(notificationData);
        } catch (emailError) {
          console.warn('⚠️ [PaymentService] Error enviando emails:', emailError);
          // No fallar el pago por errores de email
        }

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
        amount: amount,
        currency: currency.toUpperCase(),
        paymentStatus: 'failed',
        paymentDate: new Date(),
        errorMessage: error.message
      };

      try {
        console.log('🔸 [PaymentService] Enviando email de fallo...');
        await this.emailService.sendPaymentNotification(notificationData);
      } catch (emailError) {
        console.warn('⚠️ [PaymentService] Error enviando email de fallo:', emailError);
      }

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