import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-confirm-trip',
  standalone: true,
  imports: [
    MatCard,
    MatButton
  ],
  templateUrl: './confirm-trip.component.html',
  styleUrl: './confirm-trip.component.css'
})
export class ConfirmTripComponent {
  confirmTrip() {
    console.log('Viaje confirmado');
  }
}
