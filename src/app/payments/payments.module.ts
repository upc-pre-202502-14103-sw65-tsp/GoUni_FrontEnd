import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';

@NgModule({
  declarations: [
    PaymentFormComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class PaymentsModule { }