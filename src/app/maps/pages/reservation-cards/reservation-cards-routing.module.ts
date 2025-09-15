import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReservationComponent} from "./pages/reservation/reservation.component";

const routes: Routes = [
  { path: '',
    component: ReservationComponent }  // Ruta principal para las reservas

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationCardsRoutingModule { }
