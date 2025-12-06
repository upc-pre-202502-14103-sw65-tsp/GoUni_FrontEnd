// src/app/booking/services/rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import {Rating} from "primeng/rating";
import {CreateRatingRequest, DriverRatingStats} from "./interface/driver";

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = `${environment.backendUrl}/api/v1/ratings`;

  constructor(private http: HttpClient) { }

  /**
   * Creates a new rating for a completed ride
   */
  createRating(rating: CreateRatingRequest): Observable<Rating> {
    const headers = this.getAuthHeaders();
    return this.http.post<Rating>(this.apiUrl, rating, { headers });
  }

  /**
   * Gets all ratings for a specific driver
   */
  getDriverRatings(driverId: string): Observable<Rating[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Rating[]>(`${this.apiUrl}/driver/${driverId}`, { headers });
  }

  /**
   * Gets rating statistics for a specific driver
   */
  getDriverRatingStats(driverId: string): Observable<DriverRatingStats> {
    const headers = this.getAuthHeaders();
    return this.http.get<DriverRatingStats>(`${this.apiUrl}/driver/${driverId}/stats`, { headers });
  }

  /**
   * Gets the rating for a specific ride
   */
  getRatingByRide(rideId: string): Observable<Rating> {
    const headers = this.getAuthHeaders();
    return this.http.get<Rating>(`${this.apiUrl}/ride/${rideId}`, { headers });
  }

  /**
   * Gets all ratings given by a specific passenger
   */
  getPassengerRatings(passengerId: string): Observable<Rating[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Rating[]>(`${this.apiUrl}/passenger/${passengerId}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }
}
