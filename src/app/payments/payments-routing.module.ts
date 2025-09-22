import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';

const routes: Routes = [
  { path: '', component: PaymentFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }