import { Component, OnInit, OnDestroy, inject, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private paymentService = inject(PaymentService);
  private fb = inject(FormBuilder);

  @Input() planAmount: number = 0;
  @Input() planName: string = '';

  paymentForm!: FormGroup;
  isLoading = false;
  paymentSuccess = false;
  errorMessage = '';
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    // ✅ Inicializar Stripe después de que la vista esté renderizada
    this.initializeStripe();
  }

  private initializeForm(): void {
    this.paymentForm = this.fb.group({
      amount: [
        { value: this.planAmount, disabled: this.planAmount > 0 }, 
        [Validators.required, Validators.min(1)]
      ],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private async initializeStripe(): Promise<void> {
    try {
      await this.paymentService.initializeStripeElements('card-element');
    } catch (error: any) {
      console.error('Error inicializando Stripe:', error);
      this.errorMessage = 'Error al cargar el formulario de pago. Por favor, recarga la página.';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formValue = this.paymentForm.getRawValue(); // ✅ Usar getRawValue para obtener valores de campos disabled
      const { amount, name, email } = formValue;

      // 1. Crear método de pago
      const paymentMethodId = await this.paymentService.createPaymentMethod().toPromise();

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
        paymentMethodId || ""
      ).toPromise();

      if (result.status === 'succeeded') {
        this.paymentSuccess = true;
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

  private markAllFieldsAsTouched(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      control?.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.paymentService.destroy();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}