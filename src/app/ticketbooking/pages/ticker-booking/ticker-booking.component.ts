import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ToolbarComponent } from '../../../home/components/toolbar/toolbar.component';
import { MiniMapComponent } from '../../../maps/components/mini-map/mini-map.component';
import { MapsLayoutComponent } from '../../../maps/layout/maps-layout/maps-layout.component';
import { SideMenuComponent } from '../../../maps/components/side-menu/side-menu.component';
import { MarkersPageComponent } from '../../../maps/pages/markers-page/markers-page.component';
import { TourService } from './tour.service';

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
export class TickerBookingComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private tourService: TourService
  ) {}

  mapExpanded: boolean = false;

  ngAfterViewInit() {
    // Inicializar el servicio de tour después de que la vista esté lista
    setTimeout(() => {
      this.tourService.init();
    }, 1000);
  }

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
    this.router.navigate(['/maps']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToBooking(): void {
    this.router.navigate(['/list']);
  }

  // Método opcional para iniciar el tour manualmente
  startTour(): void {
    this.tourService.start();
  }
}