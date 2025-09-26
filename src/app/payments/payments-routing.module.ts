import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentViewComponent } from './views/payment-view.component';

const routes: Routes = [
  { path: ':plan', component: PaymentViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }