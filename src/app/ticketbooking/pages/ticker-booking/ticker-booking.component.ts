import { Component } from '@angular/core';
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatChip, MatChipsModule} from "@angular/material/chips";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";
import {MiniMapComponent} from "../../../maps/components/mini-map/mini-map.component";
import {MapsLayoutComponent} from "../../../maps/layout/maps-layout/maps-layout.component";
import {SideMenuComponent} from "../../../maps/components/side-menu/side-menu.component";
import {MarkersPageComponent} from "../../../maps/pages/markers-page/markers-page.component";

@Component({
  selector: 'app-ticker-booking',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    ToolbarComponent,
    MiniMapComponent,
    MapsLayoutComponent,
    SideMenuComponent,
    MarkersPageComponent
  ],
  templateUrl: './ticker-booking.component.html',
  styleUrl: './ticker-booking.component.css'
})
export class TickerBookingComponent {
  constructor(private router: Router) {}

  mapExpanded: boolean = false;

  expandMap(): void {
    this.mapExpanded = !this.mapExpanded;
    const mapElement = document.querySelector('.map-image') as HTMLElement;
    if (this.mapExpanded) {
      mapElement.style.height = '600px';  // Expande el mapa
    } else {
      mapElement.style.height = '380px';  // Reduce el mapa
    }
  }


  navigateToMaps(): void {
    // Redirige a la ruta /maps cuando se hace clic en "Ver más del mapa"
    this.router.navigate(['/maps']);
  }

  navigateToHome(): void {
    // Redirige a la ruta /home cuando se hace clic en "Volver al inicio"
    this.router.navigate(['/home']);
  }

  navigateToBooking(): void {
    // Redirige a la ruta /booking cuando se hace clic en "Reservar"
    this.router.navigate(['/list']);
  }
}
