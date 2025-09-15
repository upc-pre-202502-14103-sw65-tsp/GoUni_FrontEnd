import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SideMenuComponent} from "../../components/side-menu/side-menu.component";

@Component({
  selector: 'app-maps-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SideMenuComponent
  ],
  templateUrl: './maps-layout.component.html',
  styleUrl: './maps-layout.component.css'
})
export class MapsLayoutComponent {

}
