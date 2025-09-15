import { Component } from '@angular/core';
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    ToolbarComponent,
    MatIcon,
    MatCard
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

}
