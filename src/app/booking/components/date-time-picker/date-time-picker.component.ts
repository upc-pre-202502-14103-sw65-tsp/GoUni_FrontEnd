import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    NgForOf
  ],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.css'
})
export class DateTimePickerComponent {
  days = ['17 Lun', '18 Mar', '19 Mie', '20 Jue', '21 Vie'];
  times = ['8:00', '10:30', '13:00', '14:30', '15:00', '16:30'];
  selectedDate = '';
  selectedTime = '';

  selectDate(day: string) {
    this.selectedDate = day;
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }
}
