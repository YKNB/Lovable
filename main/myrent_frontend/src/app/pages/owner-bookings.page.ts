import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsService } from '../services/bookings.service';
import { BookingWithPropertyLite } from '../core/models';

@Component({
  selector: 'app-owner-bookings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="grid">
      <div class="card">
        <h1>Reservations owner (OWNER)</h1>
        <p>GET /bookings/owned</p>
        <div class="notice warn" *ngIf="error">{{ error }}</div>
      </div>

      <div class="grid two">
        <div class="card" *ngFor="let booking of bookings">
          <div class="row">
            <h3>{{ booking.properties?.title || 'Reservation' }}</h3>
            <span class="pill">{{ booking.status }}</span>
          </div>
          <p>Du {{ booking.start_date | date: 'mediumDate' }} au {{ booking.end_date | date: 'mediumDate' }}</p>
          <div class="row">
            <span class="pill">Ville: {{ booking.properties?.city }}</span>
            <span class="pill">ID: {{ booking.id }}</span>
          </div>
          <div class="row">
            <button class="primary" type="button" (click)="confirm(booking.id)">
              Confirmer
            </button>
            <button class="ghost" type="button" (click)="cancel(booking.id)">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class OwnerBookingsPage implements OnInit {
  bookings: BookingWithPropertyLite[] = [];
  error = '';

  constructor(private readonly bookingsService: BookingsService) {}

  ngOnInit() {
    this.load();
  }

  confirm(id: string) {
    this.bookingsService.confirm(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error = err?.error?.error || 'Confirmation echouee.';
      }
    });
  }

  cancel(id: string) {
    this.bookingsService.cancelByOwner(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error = err?.error?.error || 'Annulation echouee.';
      }
    });
  }

  private load() {
    this.error = '';
    this.bookingsService.listOwned().subscribe({
      next: (data) => (this.bookings = data),
      error: (err) => {
        this.error = err?.error?.error || 'Impossible de charger.';
      }
    });
  }
}
