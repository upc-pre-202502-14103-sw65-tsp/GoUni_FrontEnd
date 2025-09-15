import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class BookingModule { }
