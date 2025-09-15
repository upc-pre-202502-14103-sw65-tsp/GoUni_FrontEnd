import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-insurance-discount',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatButton
  ],
  templateUrl: './insurance-discount.component.html',
  styleUrl: './insurance-discount.component.css'
})
export class InsuranceDiscountComponent {
  applyDiscount() {
    console.log('Aplicando descuento');
  }
}
