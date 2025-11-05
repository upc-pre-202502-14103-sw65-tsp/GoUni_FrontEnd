import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookTripComponent } from "./pages/book-trip/book-trip.component";
import { MyReservationsComponent } from "./pages/my-reservations/my-reservations.component";

const routes: Routes = [
  { 
    path: ':id',
    component: BookTripComponent 
  },
  {
    path: '',
    redirectTo: 'my-reservations',
    pathMatch: 'full'
  },
  {
    path: 'my-reservations',
    component: MyReservationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }