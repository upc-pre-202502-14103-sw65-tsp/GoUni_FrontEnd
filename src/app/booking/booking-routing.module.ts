import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookTripComponent} from "./pages/book-trip/book-trip.component";
import {ReservationComponent} from "../maps/pages/reservation-cards/pages/reservation/reservation.component";

const routes: Routes = [
  { path: ':id',
    component: BookTripComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
