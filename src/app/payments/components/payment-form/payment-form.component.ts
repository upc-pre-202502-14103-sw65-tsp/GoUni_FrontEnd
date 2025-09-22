import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  private paymentService = inject(PaymentService);
  private fb = inject(FormBuilder);
  
  paymentForm!: FormGroup; // Añadimos el operador ! para indicar que se inicializará en ngOnInit
  isLoading = false;
  paymentSuccess = false;
  errorMessage = '';
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initializeForm();
    
    // Inicializar Stripe Elements después de un breve delay
    setTimeout(() => {
      this.paymentService.initializeStripeElements('card-element');
    }, 100);
  }

  private initializeForm(): void {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { amount, name, email } = this.paymentForm.value;

      // 1. Crear método de pago
      const paymentMethod = await this.paymentService.createPaymentMethod().toPromise();
      if (!paymentMethod) {
        throw new Error('No se pudo crear el método de pago');
      }

      // 2. Crear intento de pago en el backend
      const paymentIntent: any = await this.paymentService.createPaymentIntent(
        amount * 100, // Convertir a centavos
        'usd'
      ).toPromise();

      if (!paymentIntent || !paymentIntent.clientSecret) {
        throw new Error('No se pudo crear el intento de pago');
      }

      // 3. Confirmar el pago en el backend
      const result: any = await this.paymentService.confirmPayment(
        paymentIntent.clientSecret,
        paymentMethod.id
      ).toPromise();

      if (result.status === 'succeeded') {
        this.paymentSuccess = true;
        // Aquí puedes redirigir o mostrar un mensaje de éxito
      } else {
        throw new Error('El pago no fue exitoso');
      }
    } catch (error: any) {
      console.error('Error en el pago:', error);
      this.errorMessage = error.message || 'Ocurrió un error durante el pago';
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}