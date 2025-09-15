import { Component } from '@angular/core';
import {DateTimePickerComponent} from "../date-time-picker/date-time-picker.component";
import {DriverInfoComponent} from "../driver-info/driver-info.component";
import {InsuranceDiscountComponent} from "../insurance-discount/insurance-discount.component";
import {ConfirmTripComponent} from "../confirm-trip/confirm-trip.component";

@Component({
  selector: 'app-travel-booking',
  standalone: true,
  imports: [
    DateTimePickerComponent,
    DriverInfoComponent,
    InsuranceDiscountComponent,
    ConfirmTripComponent
  ],
  templateUrl: './travel-booking.component.html',
  styleUrl: './travel-booking.component.css'
})
export class TravelBookingComponent {

}
