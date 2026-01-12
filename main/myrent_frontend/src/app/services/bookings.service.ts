import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';
import { Booking, BookingCreateBody, BookingWithPropertyLite } from '../core/models';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  constructor(private readonly http: HttpClient) {}

  create(body: BookingCreateBody) {
    return this.http.post<Booking>(`${API_BASE_URL}/bookings`, body);
  }

  listMine() {
    return this.http.get<BookingWithPropertyLite[]>(`${API_BASE_URL}/bookings/me`);
  }

  listOwned() {
    return this.http.get<BookingWithPropertyLite[]>(`${API_BASE_URL}/bookings/owned`);
  }

  confirm(id: string) {
    return this.http.patch<Booking>(`${API_BASE_URL}/bookings/${id}/confirm`, {});
  }

  cancelMine(id: string) {
    return this.http.patch<Booking>(`${API_BASE_URL}/bookings/${id}/cancel`, {});
  }

  cancelByOwner(id: string) {
    return this.http.patch<Booking>(`${API_BASE_URL}/bookings/${id}/cancel-by-owner`, {});
  }
}
