import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RatingService } from '../../services/rating.service';
import {CreateRatingRequest} from "../../services/interface/driver";

export interface RateDriverDialogData {
  rideId: string;
  driverName: string;
}

@Component({
  selector: 'app-rate-driver-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './rate-driver-dialog.component.html',
  styleUrls: ['./rate-driver-dialog.component.css']
})
export class RateDriverDialogComponent {
  rating: number = 0;
  comment: string = '';
  hoveredRating: number = 0;
  isSubmitting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RateDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RateDriverDialogData,
    private ratingService: RatingService
  ) {}

  setRating(rating: number): void {
    this.rating = rating;
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rating === 0) {
      return;
    }

    this.isSubmitting = true;

    const ratingRequest: CreateRatingRequest = {
      rideId: this.data.rideId,
      score: this.rating,
      comment: this.comment
    };

    this.ratingService.createRating(ratingRequest).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error creating rating:', error);
        this.isSubmitting = false;
        alert('Error al enviar la calificación. Por favor intente de nuevo.');
      }
    });
  }

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
