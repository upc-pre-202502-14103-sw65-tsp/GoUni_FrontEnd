import { Component, OnInit, OnDestroy, inject, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmailService } from '../../../notifications/services/email.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private paymentService = inject(PaymentService);
  private emailService = inject(EmailService);
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
    console.log('🔸 [PaymentForm] onSubmit iniciado');

    if (this.paymentForm.invalid) {
      console.log('❌ [PaymentForm] Formulario inválido');
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formValue = this.paymentForm.getRawValue();
      console.log('🔸 [PaymentForm] Datos del formulario:', formValue);

      const result = await this.paymentService.processCompletePayment(
        formValue.amount,
        'usd',
        { name: formValue.name, email: formValue.email },
        this.planName
      );

      console.log('🔸 [PaymentForm] Resultado del pago:', result);

      if (result.success) {
        this.paymentSuccess = true;
        console.log('✅ [PaymentForm] Pago exitoso');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('❌ [PaymentForm] Error en onSubmit:', error);
      this.errorMessage = error.message || 'Ocurrió un error durante el pago';
    } finally {
      this.isLoading = false;
      console.log('🔸 [PaymentForm] onSubmit finalizado');
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