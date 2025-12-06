// src/app/booking/components/driver-rating-display/driver-rating-display.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RatingService } from '../../services/rating.service';
import {DriverRatingStats} from "../../services/interface/driver";

@Component({
  selector: 'app-driver-rating-display',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './driver-rating-display.component.html',
  styleUrls: ['./driver-rating-display.component.css']
})
export class DriverRatingDisplayComponent implements OnInit {
  @Input() driverId!: string;
  @Input() compact: boolean = false;

  driverStats: DriverRatingStats | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    if (this.driverId) {
      this.loadDriverStats();
    }
  }

  loadDriverStats(): void {
    this.isLoading = true;
    this.error = null;

    this.ratingService.getDriverRatingStats(this.driverId).subscribe({
      next: (stats) => {
        this.driverStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading driver stats:', error);
        this.error = 'No se pudieron cargar las calificaciones';
        this.isLoading = false;
      }
    });
  }

  getStarArray(rating: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating));
    }
    return stars;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
