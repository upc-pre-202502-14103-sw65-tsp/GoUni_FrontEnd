import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-driver-info',
  standalone: true,
  imports: [
    MatCard,
    MatIcon
  ],
  templateUrl: './driver-info.component.html',
  styleUrl: './driver-info.component.css'
})
export class DriverInfoComponent {
  driver = {
    name: 'Carla Muñoz',
    date: '03:30 PM | 04/09/2024',
    plate: 'A1B-234'
  };
}
