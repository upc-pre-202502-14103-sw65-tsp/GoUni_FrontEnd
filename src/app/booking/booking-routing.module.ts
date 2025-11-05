import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookTripComponent } from "./pages/book-trip/book-trip.component";
import { MyReservationsComponent } from "./pages/my-reservations/my-reservations.component";

const routes: Routes = [
  {
    path: 'book/:id',
    component: BookTripComponent
  },
  {
    path: 'reservations',
    component: MyReservationsComponent
  },
  {
    path: ':id',
    component: BookTripComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }