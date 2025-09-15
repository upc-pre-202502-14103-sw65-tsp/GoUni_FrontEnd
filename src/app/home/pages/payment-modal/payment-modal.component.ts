import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Pago para Plan {{data.plan}}</h2>
    <mat-dialog-content>
      <form [formGroup]="paymentForm" class="payment-form">
        <mat-form-field appearance="outline">
          <mat-label>Número de tarjeta</mat-label>
          <input
            matInput
            formControlName="cardNumber"
            placeholder="4970 1000 0000 0063"
            maxlength="19"
            required
            (input)="formatCardNumber($event)"
          />
          <span matSuffix class="card-icons">
            <img src="visa-logo.avif" alt="Visa" width="24" height="16" />
            <img src="martercard.png" alt="Mastercard" width="24" height="16" />
            <img src="amex.png" alt="American Express" width="24" height="16" />
            <img src="jcb.png" alt="JCB" width="24" height="16" />
          </span>
          <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('required')">
            Número de tarjeta es requerido
          </mat-error>
          <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('pattern')">
            Número de tarjeta inválido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre en la tarjeta</mat-label>
          <input matInput formControlName="cardHolderName" required>
          <mat-error *ngIf="paymentForm.get('cardHolderName')?.hasError('required')">
            Nombre es requerido
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha de expiración</mat-label>
            <input
              matInput
              formControlName="expiryDate"
              placeholder="MM/AA"
              maxlength="5"
              required
              (input)="formatExpiryDate($event)"
            />
            <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('required')">
              Fecha de expiración es requerida
            </mat-error>
            <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('pattern')">
              Formato inválido. Use MM/AA
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>CVV</mat-label>
            <input
              matInput
              formControlName="cvv"
              placeholder="CVC"
              required
              maxlength="3"
              (input)="limitCVC($event)"
            />
            <mat-icon matSuffix>info</mat-icon>
            <mat-error *ngIf="paymentForm.get('cvv')?.hasError('required')">
              CVC es requerido
            </mat-error>
            <mat-error *ngIf="paymentForm.get('cvv')?.hasError('pattern')">
              CVC inválido
            </mat-error>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="!paymentForm.valid">
        Pagar S/.{{data.amount}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 300px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class PaymentModalComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { plan: string; amount: number }
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      cardHolderName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    value = value.slice(0, 16); // Limita a 16 dígitos

    // Formatea en grupos de 4 dígitos
    input.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  formatExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Inserta automáticamente el '/'
    }
    input.value = value.slice(0, 5); // Limita a 5 caracteres en formato MM/AA
  }

  limitCVC(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 3); // Solo permite 3 dígitos
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }
}
