// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {AuthService} from "../../login/service/auth.service";

export interface PaymentRequest {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://gouniprojectdeploy-production.up.railway.app/api/v1/payments';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createPayment(paymentData: PaymentRequest): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.post<any>(this.apiUrl, paymentData).pipe(
      tap(response => console.log('Payment response:', response)),
      catchError(error => {
        console.error('Payment error:', error);
        return throwError(() => error);
      })
    );
  }

  getAllPayments(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.get<any>(this.apiUrl);
  }
}
