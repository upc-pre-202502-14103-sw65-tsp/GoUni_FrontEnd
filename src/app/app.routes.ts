import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DestinationComponent } from "./destination/pages/destination/destination.component";
import { AuthGuard } from "./login/auth.guard";
import { RoleGuard } from "./login/role.guard";
import { PageNotFoundComponent } from "./home/pages/page-not-found/page-not-found.component";
import { PlansComponent } from "./home/pages/plans/plans.component";
import { ServicesComponent } from "./home/pages/services/services.component";
import { TickerBookingComponent } from "./ticketbooking/pages/ticker-booking/ticker-booking.component";
import { RegisterComponent } from "./login/components/register/register.component";
import { RescheduleTripComponent } from "./booking/components/reschedule-trip/reschedule-trip.component";
import { ChatComponent } from "./chat/components/chat/chat.component";
import { PaymentViewComponent } from './payments/views/payment-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [RoleGuard],
    data: { expectedRole: 'PASSENGER_ROLE' }
  },
  {
    path: 'driver-dashboard',
    loadComponent: () => import('./driver-dashboard/driver-dashboard.component').then(m => m.DriverDashboardComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'DRIVER_ROLE' }
  },
  { 
    path: 'plans',
    component: PlansComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'services',
    component: ServicesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ticketbooking',
    component: TickerBookingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'maps',
    loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'list',
    component: DestinationComponent,
    canActivate: [AuthGuard],
  },
  { 
    path: 'chat/:userId',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reservations',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'payments/:plan',
    component: PaymentViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reschedule/:id',
    component: RescheduleTripComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];